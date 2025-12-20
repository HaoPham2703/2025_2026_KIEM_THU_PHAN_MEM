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

describe("System Test - Flow Mua hàng --> Thanh toán số dư --> Kiểm tra balance", () => {
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
      name: "Laptop Balance Test",
      image: "https://example.com/category.jpg",
    });

    testBrand = await Brand.create({
      name: "Dell Balance Test",
      image: "https://example.com/brand.jpg",
    });

    testProduct = await Product.create({
      title: "Dell Laptop Balance Test Product",
      price: 15000000,
      inventory: 100,
      category: testCategory._id,
      brand: testBrand._id,
      images: ["https://example.com/laptop.jpg"],
    });

    initialInventory = testProduct.inventory;

    testUser = await User.create({
      name: "Balance Test User",
      email: "balancetest@example.com",
      password: "Haolatuii2703@",
      passwordConfirm: "Haolatuii2703@",
      role: "user",
      active: "active",
      balance: 50000000, // 50 triệu - đủ để mua
    });

    initialBalance = testUser.balance;
  });

  afterAll(async () => {
    await User.deleteMany({ email: "balancetest@example.com" });
    await Product.deleteMany({ title: "Dell Laptop Balance Test Product" });
    await Order.deleteMany({ user: testUser._id });
    await Category.deleteMany({ name: "Laptop Balance Test" });
    await Brand.deleteMany({ name: "Dell Balance Test" });
  });

  describe("Bước 1: Đăng nhập", () => {
    it("nên đăng nhập thành công", async () => {
      const response = await request(app).post("/api/v1/users/login").send({
        email: "balancetest@example.com",
        password: "Haolatuii2703@",
      });

      expect(response.status).toBe(200);
      authToken = response.body.token;
    });
  });

  describe("Bước 2: Tạo đơn hàng với payments=số dư", () => {
    it("nên tạo đơn hàng với thanh toán bằng số dư", async () => {
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
        address: "123 Balance Test Street",
        receiver: "Balance Test User",
        phone: "0123456789",
        payments: "số dư",
        totalPrice: 15000000,
      };

      const response = await request(app)
        .post("/api/v1/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send(orderData);

      expect(response.status).toBe(201);
      expect(response.body.data.id).toBeDefined();

      // Kiểm tra order được tạo
      const createdOrder = await Order.findById(response.body.data.id);
      expect(createdOrder).toBeTruthy();
      expect(createdOrder.payments).toBe("số dư");
    });

    it("nên giảm balance user đúng số tiền", async () => {
      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser).toBeTruthy();
      expect(updatedUser.balance).toBe(initialBalance - 15000000); // 50 triệu - 15 triệu = 35 triệu
    });

    it("nên không tạo transaction khi thanh toán bằng số dư", async () => {
      const transactions = await Transaction.find({
        user: testUser._id,
        order: expect.any(String),
      });
      expect(transactions.length).toBe(0);
    });

    it("nên giảm inventory sản phẩm", async () => {
      const updatedProduct = await Product.findById(testProduct._id);
      expect(updatedProduct).toBeTruthy();
      expect(updatedProduct.inventory).toBe(initialInventory - 1);
    });
  });

  describe("Bước 3: Tạo nhiều đơn hàng với số dư", () => {
    it("nên tạo nhiều đơn hàng và balance giảm đúng", async () => {
      const orderData1 = {
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
        address: "456 Multiple Orders",
        receiver: "Balance Test User",
        phone: "0123456789",
        payments: "số dư",
        totalPrice: 15000000,
      };

      const orderData2 = {
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
        address: "789 Multiple Orders",
        receiver: "Balance Test User",
        phone: "0123456789",
        payments: "số dư",
        totalPrice: 15000000,
      };

      await request(app)
        .post("/api/v1/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send(orderData1);

      await request(app)
        .post("/api/v1/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send(orderData2);

      // Kiểm tra balance đã giảm thêm 30 triệu (2 đơn x 15 triệu)
      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser).toBeTruthy();
      expect(updatedUser.balance).toBe(initialBalance - 45000000); // 50 triệu - 45 triệu = 5 triệu
    });
  });

  describe("Flow hoàn chỉnh: Đăng nhập --> Mua hàng bằng số dư", () => {
    it("nên thực hiện toàn bộ flow thanh toán bằng số dư", async () => {
      // Đăng nhập
      const loginResponse = await request(app)
        .post("/api/v1/users/login")
        .send({
          email: "balancetest@example.com",
          password: "Haolatuii2703@",
        });

      const token = loginResponse.body.token;
      const userBefore = await User.findOne({
        email: "balancetest@example.com",
      });
      const balanceBefore = userBefore.balance;

      // Tạo đơn hàng
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
        address: "999 Complete Flow",
        receiver: "Complete Flow User",
        phone: "0111222333",
        payments: "số dư",
        totalPrice: 15000000,
      };

      const orderResponse = await request(app)
        .post("/api/v1/orders")
        .set("Authorization", `Bearer ${token}`)
        .send(orderData);

      expect(orderResponse.status).toBe(201);

      // Kiểm tra balance giảm
      const userAfter = await User.findOne({
        email: "balancetest@example.com",
      });
      expect(userAfter).toBeTruthy();
      expect(userAfter.balance).toBe(balanceBefore - 15000000);
    });
  });
});
