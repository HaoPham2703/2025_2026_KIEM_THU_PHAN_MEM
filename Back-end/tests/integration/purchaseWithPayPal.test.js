const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../../app");
const User = require("../../models/userModel");
const Product = require("../../models/productModel");
const Order = require("../../models/orderModel");
const Transaction = require("../../models/transactionModel");
const Category = require("../../models/categoryModel");
const Brand = require("../../models/brandModel");
const sendEmail = require("../../utils/email");

// Mock email module
jest.mock("../../utils/email");
sendEmail.mockResolvedValue(true);

describe("System Test - Flow Mua hàng --> Thanh toán PayPal --> Xác nhận", () => {
  let testUser;
  let testProduct;
  let testCategory;
  let testBrand;
  let authToken;
  let initialBalance;
  let initialInventory;

  beforeAll(async () => {
    // Tạo dữ liệu test
    testCategory = await Category.create({
      name: "Laptop PayPal Test",
      image: "https://example.com/category.jpg",
    });

    testBrand = await Brand.create({
      name: "Dell PayPal Test",
      image: "https://example.com/brand.jpg",
    });

    testProduct = await Product.create({
      title: "Dell Laptop PayPal Test Product",
      price: 15000000,
      inventory: 100,
      category: testCategory._id,
      brand: testBrand._id,
      images: ["https://example.com/laptop.jpg"],
    });

    initialInventory = testProduct.inventory;

    testUser = await User.create({
      name: "PayPal Test User",
      email: "paypaltest@example.com",
      password: "Haolatui2703@",
      passwordConfirm: "Haolatui2703@",
      role: "user",
      active: "active",
      balance: 10000000, // 10 triệu
    });

    initialBalance = testUser.balance;
  });

  afterAll(async () => {
    await User.deleteMany({ email: "paypaltest@example.com" });
    await Product.deleteMany({ title: "Dell Laptop PayPal Test Product" });
    await Order.deleteMany({ user: testUser._id });
    await Transaction.deleteMany({ user: testUser._id });
    await Category.deleteMany({ name: "Laptop PayPal Test" });
    await Brand.deleteMany({ name: "Dell PayPal Test" });
  });

  describe("Bước 1: Đăng nhập", () => {
    it("nên đăng nhập thành công", async () => {
      const response = await request(app).post("/api/v1/users/login").send({
        email: "paypaltest@example.com",
        password: "Haolatui2703@",
      });

      expect(response.status).toBe(200);
      authToken = response.body.token;
    });
  });

  describe("Bước 2: Tạo đơn hàng với payments=paypal", () => {
    it("nên tạo đơn hàng với payments=paypal", async () => {
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
        address: "123 PayPal Test Street",
        receiver: "PayPal Test User",
        phone: "0123456789",
        payments: "paypal",
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

  describe("Bước 3: Mô phỏng callback từ PayPal", () => {
    it("nên xác nhận thanh toán PayPal và tạo transaction", async () => {
      const invoicePayment = {
        id: "PAYPAL123456",
        status: "COMPLETED",
        amount: {
          total: "150.00",
          currency: "USD",
        },
      };

      const response = await request(app)
        .post("/api/v1/transactions/return_paypal_status")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          amount: 15000000,
          invoicePayment: invoicePayment,
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("success");

      // Kiểm tra transaction được tạo
      const transaction = await Transaction.findOne({
        user: testUser._id,
        payments: "paypal",
      });
      expect(transaction).toBeTruthy();
      expect(transaction.amount).toBe(15000000);

      // Kiểm tra balance user tăng (do post-save hook)
      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser).toBeTruthy();
      expect(updatedUser.balance).toBe(initialBalance + 15000000);
    });
  });

  describe("Flow hoàn chỉnh: Mua hàng --> PayPal --> Xác nhận", () => {
    it("nên thực hiện toàn bộ flow từ mua hàng đến xác nhận PayPal", async () => {
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
        address: "456 Complete PayPal Flow",
        receiver: "Complete PayPal User",
        phone: "0987654321",
        payments: "paypal",
        totalPrice: 15000000,
      };

      const orderResponse = await request(app)
        .post("/api/v1/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send(orderData);

      expect(orderResponse.status).toBe(201);

      // Bước 2: Mô phỏng callback PayPal
      const invoicePayment = {
        id: "PAYPAL789012",
        status: "COMPLETED",
      };

      const callbackResponse = await request(app)
        .post("/api/v1/transactions/return_paypal_status")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          amount: 15000000,
          invoicePayment: invoicePayment,
        });

      expect(callbackResponse.status).toBe(201);
    });
  });
});
