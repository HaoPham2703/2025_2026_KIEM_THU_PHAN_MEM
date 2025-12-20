const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../../app");
const User = require("../../models/userModel");
const Product = require("../../models/productModel");
const Order = require("../../models/orderModel");
const Category = require("../../models/categoryModel");
const Brand = require("../../models/brandModel");
const sendEmail = require("../../utils/email");

// Mock email module
jest.mock("../../utils/email");
sendEmail.mockResolvedValue(true);

describe("System Test - Flow Admin cập nhật trạng thái đơn --> User nhận email", () => {
  let testUser;
  let adminUser;
  let testProduct;
  let testCategory;
  let testBrand;
  let userToken;
  let adminToken;
  let testOrder;

  beforeAll(async () => {
    // Tạo dữ liệu test
    testCategory = await Category.create({
      name: "Laptop Email Test",
      image: "https://example.com/category.jpg",
    });

    testBrand = await Brand.create({
      name: "Dell Email Test",
      image: "https://example.com/brand.jpg",
    });

    testProduct = await Product.create({
      title: "Dell Laptop Email Test Product",
      price: 15000000,
      inventory: 100,
      category: testCategory._id,
      brand: testBrand._id,
      images: ["https://example.com/laptop.jpg"],
    });

    testUser = await User.create({
      name: "Email Test User",
      email: "emailtest@example.com",
      password: "Haolatuii2703@",
      passwordConfirm: "Haolatuii2703@",
      role: "user",
      active: "active",
    });

    adminUser = await User.create({
      name: "Admin Email Test",
      email: "adminemail@example.com",
      password: "Haolatuii2703@",
      passwordConfirm: "Haolatuii2703@",
      role: "admin",
      active: "active",
    });
  });

  afterAll(async () => {
    await User.deleteMany({
      email: { $in: ["emailtest@example.com", "adminemail@example.com"] },
    });
    await Product.deleteMany({ title: "Dell Laptop Email Test Product" });
    await Order.deleteMany({ user: testUser._id });
    await Category.deleteMany({ name: "Laptop Email Test" });
    await Brand.deleteMany({ name: "Dell Email Test" });
  });

  describe("Bước 1: User tạo đơn hàng", () => {
    beforeEach(async () => {
      // Xóa data cũ trước khi tạo mới (tránh duplicate key error)
      await Category.deleteMany({ name: "Laptop Email Test" });
      await Brand.deleteMany({ name: "Dell Email Test" });
      await Product.deleteMany({ title: "Dell Laptop Email Test Product" });
      await User.deleteMany({
        email: { $in: ["emailtest@example.com", "adminemail@example.com"] },
      });
      await Order.deleteMany({});

      // Đảm bảo user và product tồn tại (vì afterEach trong setup.js xóa tất cả)
      testCategory = await Category.create({
        name: "Laptop Email Test",
        image: "https://example.com/category.jpg",
      });

      testBrand = await Brand.create({
        name: "Dell Email Test",
        image: "https://example.com/brand.jpg",
      });

      testProduct = await Product.create({
        title: "Dell Laptop Email Test Product",
        price: 15000000,
        inventory: 100,
        category: testCategory._id,
        brand: testBrand._id,
        images: ["https://example.com/laptop.jpg"],
      });

      testUser = await User.create({
        name: "Email Test User",
        email: "emailtest@example.com",
        password: "Haolatuii2703@",
        passwordConfirm: "Haolatuii2703@",
        role: "user",
        active: "active",
      });

      adminUser = await User.create({
        name: "Admin Email Test",
        email: "adminemail@example.com",
        password: "Haolatuii2703@",
        passwordConfirm: "Haolatuii2703@",
        role: "admin",
        active: "active",
      });
    });

    it("nên đăng nhập user thành công", async () => {
      const response = await request(app).post("/api/v1/users/login").send({
        email: "emailtest@example.com",
        password: "Haolatuii2703@",
      });

      expect(response.status).toBe(200);
      userToken = response.body.token;
    });

    it("nên tạo đơn hàng thành công", async () => {
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
        address: "123 Email Test Street",
        receiver: "Email Test User",
        phone: "0123456789",
        payments: "tiền mặt",
        totalPrice: 15000000,
      };

      const response = await request(app)
        .post("/api/v1/orders")
        .set("Authorization", `Bearer ${userToken}`)
        .send(orderData);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBeDefined();
      testOrder = await Order.findById(response.body.data.id);
      expect(testOrder).toBeTruthy();
    });
  });

  describe("Bước 2: Admin đăng nhập", () => {
    beforeEach(async () => {
      // Xóa data cũ trước khi tạo mới
      await Category.deleteMany({ name: "Laptop Email Test" });
      await Brand.deleteMany({ name: "Dell Email Test" });
      await Product.deleteMany({ title: "Dell Laptop Email Test Product" });
      await User.deleteMany({
        email: { $in: ["emailtest@example.com", "adminemail@example.com"] },
      });
      await Order.deleteMany({});

      // Đảm bảo user, product và order tồn tại
      testCategory = await Category.create({
        name: "Laptop Email Test",
        image: "https://example.com/category.jpg",
      });

      testBrand = await Brand.create({
        name: "Dell Email Test",
        image: "https://example.com/brand.jpg",
      });

      testProduct = await Product.create({
        title: "Dell Laptop Email Test Product",
        price: 15000000,
        inventory: 100,
        category: testCategory._id,
        brand: testBrand._id,
        images: ["https://example.com/laptop.jpg"],
      });

      testUser = await User.create({
        name: "Email Test User",
        email: "emailtest@example.com",
        password: "Haolatuii2703@",
        passwordConfirm: "Haolatuii2703@",
        role: "user",
        active: "active",
      });

      adminUser = await User.create({
        name: "Admin Email Test",
        email: "adminemail@example.com",
        password: "Haolatuii2703@",
        passwordConfirm: "Haolatuii2703@",
        role: "admin",
        active: "active",
      });

      // Tạo đơn hàng
      userToken = (
        await request(app).post("/api/v1/users/login").send({
          email: "emailtest@example.com",
          password: "Haolatuii2703@",
        })
      ).body.token;

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
        address: "123 Email Test Street",
        receiver: "Email Test User",
        phone: "0123456789",
        payments: "tiền mặt",
        totalPrice: 15000000,
      };

      const orderResponse = await request(app)
        .post("/api/v1/orders")
        .set("Authorization", `Bearer ${userToken}`)
        .send(orderData);

      expect(orderResponse.status).toBe(201);
      expect(orderResponse.body.data).toBeDefined();
      testOrder = await Order.findById(orderResponse.body.data.id);
      expect(testOrder).toBeTruthy();
    });

    it("nên đăng nhập admin thành công", async () => {
      const response = await request(app).post("/api/v1/users/login").send({
        email: "adminemail@example.com",
        password: "Haolatuii2703@",
      });

      expect(response.status).toBe(200);
      adminToken = response.body.token;
    });
  });

  describe("Bước 3: Admin cập nhật order status và gửi email", () => {
    it("nên cập nhật order status = Delivery và gửi email", async () => {
      // Clear mock calls trước
      sendEmail.mockClear();

      const response = await request(app)
        .patch(`/api/v1/orders/${testOrder._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          status: "Delivery",
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");

      // Kiểm tra order status đã được cập nhật
      const updatedOrder = await Order.findById(testOrder._id);
      expect(updatedOrder).toBeTruthy();
      expect(updatedOrder.status).toBe("Delivery");

      // Kiểm tra email được gửi (mock)
      // Note: Email được gửi trong controller, nhưng có thể cần đợi một chút
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(sendEmail).toHaveBeenCalled();
    });

    it("nên cập nhật order status = Success và gửi email", async () => {
      sendEmail.mockClear();

      const response = await request(app)
        .patch(`/api/v1/orders/${testOrder._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          status: "Success",
        });

      expect(response.status).toBe(200);

      const updatedOrder = await Order.findById(testOrder._id);
      expect(updatedOrder).toBeTruthy();
      expect(updatedOrder.status).toBe("Success");

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(sendEmail).toHaveBeenCalled();
    });
  });

  describe("Flow hoàn chỉnh: Tạo đơn --> Cập nhật status --> Email", () => {
    it("nên thực hiện toàn bộ flow cập nhật status và gửi email", async () => {
      // Xóa data cũ và tạo lại
      await Category.deleteMany({ name: "Laptop Email Test" });
      await Brand.deleteMany({ name: "Dell Email Test" });
      await Product.deleteMany({ title: "Dell Laptop Email Test Product" });
      await User.deleteMany({
        email: { $in: ["emailtest@example.com", "adminemail@example.com"] },
      });
      await Order.deleteMany({});

      // Tạo lại data
      const testCategory = await Category.create({
        name: "Laptop Email Test",
        image: "https://example.com/category.jpg",
      });

      const testBrand = await Brand.create({
        name: "Dell Email Test",
        image: "https://example.com/brand.jpg",
      });

      const testProduct = await Product.create({
        title: "Dell Laptop Email Test Product",
        price: 15000000,
        inventory: 100,
        category: testCategory._id,
        brand: testBrand._id,
        images: ["https://example.com/laptop.jpg"],
      });

      await User.create({
        name: "Email Test User",
        email: "emailtest@example.com",
        password: "Haolatuii2703@",
        passwordConfirm: "Haolatuii2703@",
        role: "user",
        active: "active",
      });

      await User.create({
        name: "Admin Email Test",
        email: "adminemail@example.com",
        password: "Haolatuii2703@",
        passwordConfirm: "Haolatuii2703@",
        role: "admin",
        active: "active",
      });

      // User tạo đơn
      const userLogin = await request(app).post("/api/v1/users/login").send({
        email: "emailtest@example.com",
        password: "Haolatuii2703@",
      });

      expect(userLogin.status).toBe(200);

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
        address: "999 Complete Email Flow",
        receiver: "Complete Email User",
        phone: "0111222333",
        payments: "tiền mặt",
        totalPrice: 15000000,
      };

      const orderResponse = await request(app)
        .post("/api/v1/orders")
        .set("Authorization", `Bearer ${userLogin.body.token}`)
        .send(orderData);

      expect(orderResponse.status).toBe(201);
      expect(orderResponse.body.data).toBeDefined();
      const orderId = orderResponse.body.data.id;

      // Admin cập nhật status
      const adminLogin = await request(app).post("/api/v1/users/login").send({
        email: "adminemail@example.com",
        password: "Haolatuii2703@",
      });

      sendEmail.mockClear();

      const updateResponse = await request(app)
        .patch(`/api/v1/orders/${orderId}`)
        .set("Authorization", `Bearer ${adminLogin.body.token}`)
        .send({ status: "Waiting Goods" });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.status).toBe("success");

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(sendEmail).toHaveBeenCalled();
    });
  });
});
