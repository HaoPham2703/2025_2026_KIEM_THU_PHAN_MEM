const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../../app");
const User = require("../../models/userModel");
const Product = require("../../models/productModel");
const Order = require("../../models/orderModel");
const Transaction = require("../../models/transactionModel");
const Category = require("../../models/categoryModel");
const Brand = require("../../models/brandModel");
const crypto = require("crypto");
const querystring = require("qs");
const sendEmail = require("../../utils/email");

// Mock email module
jest.mock("../../utils/email");
sendEmail.mockResolvedValue(true);

// Helper function để tạo VNPay secure hash
function createVNPayHash(params, secretKey) {
  const sortedParams = sortObject(params);
  const signData = querystring.stringify(sortedParams, { encode: false });
  const hmac = crypto.createHmac("sha512", secretKey);
  return hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
}

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

describe("System Test - Flow Mua hàng --> Thanh toán VNPay --> Xác nhận", () => {
  let testUser;
  let testProduct;
  let testCategory;
  let testBrand;
  let authToken;
  let initialBalance;
  let initialInventory;

  beforeAll(async () => {
    // Set environment variables cho VNPay
    process.env.vnp_TmnCode = "TEST_TMN_CODE";
    process.env.vnp_HashSecret = "TEST_HASH_SECRET";
    process.env.vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    process.env.vnp_ReturnUrl = "http://localhost:3000/payment-callback";

    // Tạo dữ liệu test
    testCategory = await Category.create({
      name: "Laptop VNPay Test",
      image: "https://example.com/category.jpg",
    });

    testBrand = await Brand.create({
      name: "Dell VNPay Test",
      image: "https://example.com/brand.jpg",
    });

    testProduct = await Product.create({
      title: "Dell Laptop VNPay Test Product",
      price: 15000000,
      inventory: 100,
      category: testCategory._id,
      brand: testBrand._id,
      images: ["https://example.com/laptop.jpg"],
    });

    initialInventory = testProduct.inventory;

    testUser = await User.create({
      name: "VNPay Test User",
      email: "vnpaytest@example.com",
      password: "Haolatui2703@",
      passwordConfirm: "Haolatui2703@",
      role: "user",
      active: "active",
      balance: 10000000, // 10 triệu
    });

    initialBalance = testUser.balance;
  });

  afterAll(async () => {
    await User.deleteMany({ email: "vnpaytest@example.com" });
    await Product.deleteMany({ title: "Dell Laptop VNPay Test Product" });
    await Order.deleteMany({ user: testUser._id });
    await Transaction.deleteMany({ user: testUser._id });
    await Category.deleteMany({ name: "Laptop VNPay Test" });
    await Brand.deleteMany({ name: "Dell VNPay Test" });
  });

  describe("Bước 1: Đăng nhập", () => {
    it("nên đăng nhập thành công", async () => {
      const response = await request(app).post("/api/v1/users/login").send({
        email: "vnpaytest@example.com",
        password: "Haolatui2703@",
      });

      expect(response.status).toBe(200);
      authToken = response.body.token;
    });
  });

  describe("Bước 2: Tạo đơn hàng với payments=vnpay", () => {
    it("nên tạo đơn hàng với payments=vnpay", async () => {
      const orderData = {
        cart: [
          {
            id: testProduct._id.toString(),
            product: {
              _id: testProduct._id.toString(),
              title: testProduct.title,
              price: testProduct.price,
              images: testProduct.images,
            },
            quantity: 1,
          },
        ],
        address: "123 VNPay Test Street",
        receiver: "VNPay Test User",
        phone: "0123456789",
        payments: "vnpay",
        totalPrice: 15000000,
      };

      const response = await request(app)
        .post("/api/v1/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send(orderData);

      expect(response.status).toBe(201);
      expect(response.body.data.id).toBeDefined();
    });
  });

  describe("Bước 3: Tạo URL thanh toán VNPay", () => {
    it("nên tạo URL thanh toán VNPay thành công", async () => {
      const response = await request(app)
        .post("/api/v1/transactions/create_payment_url")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          amount: 15000000,
          action: "recharge",
          bankCode: "",
        });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe("success");
      expect(response.body.vnpUrl).toBeDefined();
      expect(response.body.vnpUrl).toContain("vnp_SecureHash");
    });
  });

  describe("Bước 4: Mô phỏng callback từ VNPay thành công", () => {
    it("nên xác nhận thanh toán VNPay và tạo transaction", async () => {
      const vnp_Params = {
        vnp_Amount: "1500000000", // 15 triệu * 100
        vnp_ResponseCode: "00",
        vnp_OrderInfo: "recharge",
        vnp_TxnRef: "12345678",
        vnp_TransactionNo: "12345678",
        vnp_BankCode: "NCB",
        vnp_PayDate: "20251218120000",
        vnp_CardType: "ATM",
      };

      // Tạo secure hash
      const secureHash = createVNPayHash(
        vnp_Params,
        process.env.vnp_HashSecret
      );
      vnp_Params.vnp_SecureHash = secureHash;

      const response = await request(app)
        .post("/api/v1/transactions/return_payment_status")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          invoice: vnp_Params,
        });

      expect(response.status).toBe(201);
      expect(response.body.code).toBe("00");

      // Kiểm tra transaction được tạo
      const transaction = await Transaction.findOne({
        user: testUser._id,
        payments: "vnpay",
      });
      expect(transaction).toBeTruthy();
      expect(transaction.amount).toBe(15000000);

      // Kiểm tra balance user tăng
      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser).toBeTruthy();
      expect(updatedUser.balance).toBe(initialBalance + 15000000);
    });
  });

  describe("Flow hoàn chỉnh: Mua hàng --> VNPay --> Xác nhận", () => {
    it("nên thực hiện toàn bộ flow từ mua hàng đến xác nhận VNPay", async () => {
      // Bước 1: Tạo đơn hàng
      const orderData = {
        cart: [
          {
            id: testProduct._id.toString(),
            product: {
              _id: testProduct._id.toString(),
              title: testProduct.title,
              price: testProduct.price,
              images: testProduct.images,
            },
            quantity: 1,
          },
        ],
        address: "456 Complete Flow Street",
        receiver: "Complete Flow User",
        phone: "0987654321",
        payments: "vnpay",
        totalPrice: 15000000,
      };

      const orderResponse = await request(app)
        .post("/api/v1/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send(orderData);

      expect(orderResponse.status).toBe(201);

      // Bước 2: Tạo URL thanh toán
      const paymentUrlResponse = await request(app)
        .post("/api/v1/transactions/create_payment_url")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          amount: 15000000,
          action: "recharge",
        });

      expect(paymentUrlResponse.status).toBe(201);

      // Bước 3: Mô phỏng callback thành công
      const vnp_Params = {
        vnp_Amount: "1500000000",
        vnp_ResponseCode: "00",
        vnp_OrderInfo: "recharge",
        vnp_TxnRef: "87654321",
      };

      const secureHash = createVNPayHash(
        vnp_Params,
        process.env.vnp_HashSecret
      );
      vnp_Params.vnp_SecureHash = secureHash;

      const callbackResponse = await request(app)
        .post("/api/v1/transactions/return_payment_status")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          invoice: vnp_Params,
        });

      expect(callbackResponse.status).toBe(201);
      expect(callbackResponse.body.code).toBe("00");
    });
  });
});
