const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../../app");
const User = require("../../models/userModel");
const Product = require("../../models/productModel");
const Order = require("../../models/orderModel");
const Category = require("../../models/categoryModel");
const Brand = require("../../models/brandModel");
const crypto = require("crypto");
const sendEmail = require("../../utils/email");

// Mock email module
jest.mock("../../utils/email");
sendEmail.mockResolvedValue(true);

describe("System Test - Flow Đăng ký --> Xác thực --> Mua hàng", () => {
  let testProduct;
  let testCategory;
  let testBrand;
  let newUser;
  let verifyToken;
  let authToken;
  let initialInventory;

  beforeAll(async () => {
    // Tạo dữ liệu test: Category và Brand
    testCategory = await Category.create({
      name: "Laptop Signup Test",
      image: "https://example.com/category.jpg",
    });

    testBrand = await Brand.create({
      name: "Dell Signup Test",
      image: "https://example.com/brand.jpg",
    });

    // Tạo sản phẩm test
    testProduct = await Product.create({
      title: "Dell Laptop Signup Test Product",
      price: 15000000,
      inventory: 100,
      category: testCategory._id,
      brand: testBrand._id,
      images: ["https://example.com/laptop.jpg"],
    });

    initialInventory = testProduct.inventory;
  });

  afterAll(async () => {
    // Cleanup
    await User.deleteMany({ email: "newuser@example.com" });
    await Product.deleteMany({ title: "Dell Laptop Signup Test Product" });
    await Order.deleteMany({ user: newUser?._id });
    await Category.deleteMany({ name: "Laptop Signup Test" });
    await Brand.deleteMany({ name: "Dell Signup Test" });
  });

  describe("Bước 1: Đăng ký tài khoản mới", () => {
    it("nên đăng ký tài khoản mới thành công", async () => {
      const response = await request(app).post("/api/v1/users/signup").send({
        name: "New User",
        email: "newuser@example.com",
        password: "Haolatuii2703@",
        passwordConfirm: "Haolatuii2703@",
      });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe("success");
      expect(response.body.data.user.email).toBe("newuser@example.com");
      expect(response.body.data.user.active).toBe("active");

      // Lưu user để sử dụng sau
      newUser = await User.findOne({ email: "newuser@example.com" });
      expect(newUser).toBeTruthy();
    });
  });

  describe("Bước 2: Xác thực tài khoản (nếu cần)", () => {
    it("nên đăng nhập được ngay sau khi đăng ký (vì active = active)", async () => {
      // Đảm bảo user đã được tạo trước đó
      let testUser = await User.findOne({ email: "newuser@example.com" });
      if (!testUser) {
        await request(app).post("/api/v1/users/signup").send({
          name: "New User",
          email: "newuser@example.com",
          password: "Haolatuii2703@",
          passwordConfirm: "Haolatuii2703@",
        });
      }
      const response = await request(app).post("/api/v1/users/login").send({
        email: "newuser@example.com",
        password: "Haolatuii2703@",
      });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.token).toBeDefined();

      // Lưu token để sử dụng cho các test tiếp theo
      authToken = response.body.token;
    });
  });

  describe("Bước 3: Tạo đơn hàng sau khi đăng ký và đăng nhập", () => {
    beforeEach(async () => {
      // Xóa data cũ và tạo lại
      await Category.deleteMany({ name: "Laptop Signup Test" });
      await Brand.deleteMany({ name: "Dell Signup Test" });
      await Product.deleteMany({ title: "Dell Laptop Signup Test Product" });
      await User.deleteMany({ email: "newuser@example.com" });
      await Order.deleteMany({});

      testCategory = await Category.create({
        name: "Laptop Signup Test",
        image: "https://example.com/category.jpg",
      });

      testBrand = await Brand.create({
        name: "Dell Signup Test",
        image: "https://example.com/brand.jpg",
      });

      testProduct = await Product.create({
        title: "Dell Laptop Signup Test Product",
        price: 15000000,
        inventory: 100,
        category: testCategory._id,
        brand: testBrand._id,
        images: ["https://example.com/laptop.jpg"],
      });

      initialInventory = testProduct.inventory;

      // Đăng ký user mới
      await request(app).post("/api/v1/users/signup").send({
        name: "New User",
        email: "newuser@example.com",
        password: "Haolatuii2703@",
        passwordConfirm: "Haolatuii2703@",
      });

      newUser = await User.findOne({ email: "newuser@example.com" });

      // Đăng nhập
      const loginResponse = await request(app)
        .post("/api/v1/users/login")
        .send({
          email: "newuser@example.com",
          password: "Haolatuii2703@",
        });

      authToken = loginResponse.body.token;
    });

    it("nên tạo đơn hàng thành công với user mới đăng ký", async () => {
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
        address: "123 Đường Signup Test, Quận 1, TP.HCM",
        receiver: "New User",
        phone: "0123456789",
        payments: "tiền mặt",
        totalPrice: 15000000,
      };

      const response = await request(app)
        .post("/api/v1/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send(orderData);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBeDefined();

      // Kiểm tra order đã được tạo với user mới
      const createdOrder = await Order.findById(response.body.data.id);
      expect(createdOrder).toBeTruthy();
      // Order model populate user, nên user là object với _id
      const userId = createdOrder.user._id ? createdOrder.user._id.toString() : createdOrder.user.toString();
      expect(userId).toBe(newUser._id.toString());
      expect(createdOrder.address).toBe(orderData.address);
    });

    it("nên giảm inventory sau khi user mới tạo đơn hàng", async () => {
      // Tạo order trước để test inventory giảm
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
        address: "123 Đường Signup Test, Quận 1, TP.HCM",
        receiver: "New User",
        phone: "0123456789",
        payments: "tiền mặt",
        totalPrice: 15000000,
      };

      await request(app)
        .post("/api/v1/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send(orderData);

      const updatedProduct = await Product.findById(testProduct._id);
      expect(updatedProduct).toBeTruthy();
      expect(updatedProduct.inventory).toBe(initialInventory - 1);
    });
  });

  describe("Flow hoàn chỉnh: Đăng ký --> Đăng nhập --> Mua hàng", () => {
    it("nên thực hiện toàn bộ flow từ đăng ký đến mua hàng", async () => {
      // Bước 1: Đăng ký
      const signupResponse = await request(app)
        .post("/api/v1/users/signup")
        .send({
          name: "Flow Test User",
          email: "flowtest@example.com",
          password: "Haolatuii2703@",
          passwordConfirm: "Haolatuii2703@",
        });

      expect(signupResponse.status).toBe(201);
      const signupToken = signupResponse.body.token;

      // Bước 2: Tạo đơn hàng ngay với token từ signup
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
        address: "456 Flow Test Street",
        receiver: "Flow Test User",
        phone: "0987654321",
        payments: "tiền mặt",
        totalPrice: 30000000,
      };

      const orderResponse = await request(app)
        .post("/api/v1/orders")
        .set("Authorization", `Bearer ${signupToken}`)
        .send(orderData);

      expect(orderResponse.status).toBe(201);
      expect(orderResponse.body.status).toBe("success");
      expect(orderResponse.body.data).toBeDefined();
      expect(orderResponse.body.data.id).toBeDefined();

      // Cleanup
      const flowUser = await User.findOne({ email: "flowtest@example.com" });
      if (flowUser) {
        await Order.deleteMany({ user: flowUser._id });
        await User.deleteMany({ email: "flowtest@example.com" });
      }
    });
  });
});
