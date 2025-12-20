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

describe("System Test - Flow User hủy đơn --> Hoàn tiền --> Inventory tăng lại", () => {
  let testUser;
  let testProduct;
  let testCategory;
  let testBrand;
  let authToken;
  let initialBalance;
  let initialInventory;
  let testOrder;

  beforeAll(async () => {
    // Tạo dữ liệu test
    testCategory = await Category.create({
      name: "Laptop Refund Test",
      image: "https://example.com/category.jpg",
    });

    testBrand = await Brand.create({
      name: "Dell Refund Test",
      image: "https://example.com/brand.jpg",
    });

    testProduct = await Product.create({
      title: "Dell Laptop Refund Test Product",
      price: 15000000,
      inventory: 100,
      category: testCategory._id,
      brand: testBrand._id,
      images: ["https://example.com/laptop.jpg"],
    });

    initialInventory = testProduct.inventory;

    testUser = await User.create({
      name: "Refund Test User",
      email: "refundtest@example.com",
      password: "Haolatui2703@",
      passwordConfirm: "Haolatui2703@",
      role: "user",
      active: "active",
      balance: 50000000, // 50 triệu
    });

    initialBalance = testUser.balance;
  });

  afterAll(async () => {
    await User.deleteMany({ email: "refundtest@example.com" });
    await Product.deleteMany({ title: "Dell Laptop Refund Test Product" });
    await Order.deleteMany({ user: testUser._id });
    await Transaction.deleteMany({ user: testUser._id });
    await Category.deleteMany({ name: "Laptop Refund Test" });
    await Brand.deleteMany({ name: "Dell Refund Test" });
  });

  describe("Bước 1: Đăng nhập và tạo đơn hàng với VNPay (đã thanh toán)", () => {
    it("nên đăng nhập thành công", async () => {
      const response = await request(app).post("/api/v1/users/login").send({
        email: "refundtest@example.com",
        password: "Haolatui2703@",
      });

      expect(response.status).toBe(200);
      authToken = response.body.token;
    });

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
            quantity: 2,
          },
        ],
        address: "123 Refund Test Street",
        receiver: "Refund Test User",
        phone: "0123456789",
        payments: "vnpay",
        totalPrice: 30000000,
      };

      const response = await request(app)
        .post("/api/v1/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send(orderData);

      expect(response.status).toBe(201);
      testOrder = await Order.findById(response.body.data.id);
      expect(testOrder).toBeTruthy();
      expect(testOrder.payments).toBe("vnpay");

      // Kiểm tra inventory đã giảm
      const updatedProduct = await Product.findById(testProduct._id);
      expect(updatedProduct).toBeTruthy();
      expect(updatedProduct.inventory).toBe(initialInventory - 2);
    });
  });

  describe("Bước 2: User hủy đơn hàng", () => {
    it("nên hủy đơn hàng thành công (status = Processed)", async () => {
      // Đảm bảo order status là Processed
      await Order.findByIdAndUpdate(testOrder._id, { status: "Processed" });

      const response = await request(app)
        .patch(`/api/v1/orders/${testOrder._id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          status: "Cancelled",
        });

      expect(response.status).toBe(200);

      // Kiểm tra order status đã được cập nhật
      const updatedOrder = await Order.findById(testOrder._id);
      expect(updatedOrder).toBeTruthy();
      expect(updatedOrder.status).toBe("Cancelled");
    });
  });

  describe("Bước 3: Kiểm tra transaction refund được tạo", () => {
    it("nên tạo transaction refund tự động", async () => {
      // Transaction refund được tạo trong post findOneAndUpdate hook
      // Cần đợi một chút để hook chạy
      await new Promise((resolve) => setTimeout(resolve, 100));

      const refundTransaction = await Transaction.findOne({
        user: testUser._id,
        payments: "refund",
        order: testOrder._id.toString(),
      });

      expect(refundTransaction).toBeTruthy();
      expect(refundTransaction.amount).toBe(30000000);
    });
  });

  describe("Bước 4: Kiểm tra balance user tăng lại", () => {
    it("nên tăng balance user sau khi hủy đơn", async () => {
      // Balance tăng do post-save hook của Transaction
      await new Promise((resolve) => setTimeout(resolve, 100));

      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser).toBeTruthy();
      // Balance ban đầu + refund amount
      expect(updatedUser.balance).toBe(initialBalance + 30000000);
    });
  });

  describe("Bước 5: Kiểm tra inventory tăng lại", () => {
    it("nên tăng inventory sản phẩm sau khi hủy đơn", async () => {
      const updatedProduct = await Product.findById(testProduct._id);
      expect(updatedProduct).toBeTruthy();
      // Inventory ban đầu - 2 (đã mua) + 2 (hoàn lại) = ban đầu
      expect(updatedProduct.inventory).toBe(initialInventory);
    });
  });

  describe("Flow hoàn chỉnh: Tạo đơn VNPay --> Hủy --> Hoàn tiền", () => {
    it("nên thực hiện toàn bộ flow hủy đơn và hoàn tiền", async () => {
      // Tạo đơn hàng mới
      const orderData = {
        cart: [
          {
            id: testProduct._id.toString(),
            product: {
              _id: testProduct._id.toString(),
              title: testProduct.title,
              price: testProduct.price,
            },
            quantity: 1,
          },
        ],
        address: "999 Complete Refund Flow",
        receiver: "Complete Refund User",
        phone: "0111222333",
        payments: "vnpay",
        totalPrice: 15000000,
      };

      const orderResponse = await request(app)
        .post("/api/v1/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send(orderData);

      const orderId = orderResponse.body.data.id;
      const productBeforeCancel = await Product.findById(testProduct._id);
      expect(productBeforeCancel).toBeTruthy();
      const inventoryBeforeCancel = productBeforeCancel.inventory;

      // Hủy đơn
      await request(app)
        .patch(`/api/v1/orders/${orderId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ status: "Cancelled" });

      // Kiểm tra inventory tăng lại
      await new Promise((resolve) => setTimeout(resolve, 100));
      const productAfterCancel = await Product.findById(testProduct._id);
      expect(productAfterCancel).toBeTruthy();
      expect(productAfterCancel.inventory).toBe(inventoryBeforeCancel + 1);

      // Kiểm tra transaction refund
      const refund = await Transaction.findOne({
        order: orderId.toString(),
        payments: "refund",
      });
      expect(refund).toBeTruthy();
    });
  });

  describe("Edge case: Hủy đơn COD không tạo refund", () => {
    it("nên không tạo transaction refund khi hủy đơn COD", async () => {
      // Tạo đơn COD
      const codOrderData = {
        cart: [
          {
            id: testProduct._id.toString(),
            product: {
              _id: testProduct._id.toString(),
              title: testProduct.title,
              price: testProduct.price,
            },
            quantity: 1,
          },
        ],
        address: "888 COD Test",
        receiver: "COD Test User",
        phone: "0123456789",
        payments: "tiền mặt",
        totalPrice: 15000000,
      };

      const codOrderResponse = await request(app)
        .post("/api/v1/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send(codOrderData);

      const codOrderId = codOrderResponse.body.data.id;

      // Hủy đơn COD
      await request(app)
        .patch(`/api/v1/orders/${codOrderId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ status: "Cancelled" });

      // Kiểm tra không có transaction refund
      await new Promise((resolve) => setTimeout(resolve, 100));
      const refund = await Transaction.findOne({
        order: codOrderId.toString(),
        payments: "refund",
      });
      expect(refund).toBeNull();
    });
  });
});
