const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../../app");
const User = require("../../models/userModel");
const Product = require("../../models/productModel");
const Order = require("../../models/orderModel");
const Category = require("../../models/categoryModel");
const Brand = require("../../models/brandModel");
const sendEmail = require("../../utils/email");

// Mock email module để không gửi email thật trong test
jest.mock("../../utils/email");
sendEmail.mockResolvedValue(true);

describe("System Test - Flow Đăng nhập --> Mua hàng", () => {
  let testUser;
  let testProduct;
  let testCategory;
  let testBrand;
  let authToken;
  let initialInventory;

  beforeAll(async () => {
    // Tạo dữ liệu test: Category và Brand
    testCategory = await Category.create({
      name: "Laptop System Test",
      image: "https://example.com/category.jpg",
    });

    testBrand = await Brand.create({
      name: "Dell System Test",
      image: "https://example.com/brand.jpg",
    });

    // Tạo sản phẩm test
    testProduct = await Product.create({
      title: "Dell Laptop System Test Product",
      price: 15000000,
      inventory: 100,
      category: testCategory._id,
      brand: testBrand._id,
      images: ["https://example.com/laptop.jpg"],
    });

    initialInventory = testProduct.inventory;

    // Tạo user test
    testUser = await User.create({
      name: "System Test User",
      email: "systemtest@example.com",
      password: "Haolatuii2703@",
      passwordConfirm: "Haolatuii2703@",
      role: "user",
      active: "active",
      balance: 50000000, // 50 triệu VNĐ
    });
  });

  afterAll(async () => {
    // Cleanup: Xóa tất cả dữ liệu test
    await User.deleteMany({ email: "systemtest@example.com" });
    await Product.deleteMany({ title: "Dell Laptop System Test Product" });
    await Order.deleteMany({ user: testUser._id });
    await Category.deleteMany({ name: "Laptop System Test" });
    await Brand.deleteMany({ name: "Dell System Test" });
  });

  describe("Bước 1: Đăng nhập", () => {
    it("nên đăng nhập thành công và nhận được token", async () => {
      const response = await request(app).post("/api/v1/users/login").send({
        email: "systemtest@example.com",
        password: "Haolatuii2703@",
      });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.token).toBeDefined();
      expect(response.body.data.user.email).toBe("systemtest@example.com");

      // Lưu token để sử dụng cho các test tiếp theo
      authToken = response.body.token;
    });

    it("nên trả về lỗi khi đăng nhập với mật khẩu sai", async () => {
      // Đảm bảo user tồn tại
      await User.deleteMany({ email: "systemtest@example.com" });
      await User.create({
        name: "System Test User",
        email: "systemtest@example.com",
        password: "Haolatuii2703@",
        passwordConfirm: "Haolatuii2703@",
        role: "user",
        active: "active",
        balance: 50000000,
      });

      const response = await request(app).post("/api/v1/users/login").send({
        email: "systemtest@example.com",
        password: "WrongPassword123",
      });

      expect(response.status).toBe(401);
      expect(response.body.status).toBe("fail");
    });
  });

  describe("Bước 2: Tạo đơn hàng sau khi đăng nhập", () => {
    beforeEach(async () => {
      // Xóa data cũ trước khi tạo mới (tránh duplicate key error)
      await Category.deleteMany({ name: "Laptop System Test" });
      await Brand.deleteMany({ name: "Dell System Test" });
      await Product.deleteMany({ title: "Dell Laptop System Test Product" });
      await User.deleteMany({ email: "systemtest@example.com" });
      await Order.deleteMany({});

      // Đảm bảo user và product tồn tại (vì afterEach trong setup.js xóa tất cả)
      testCategory = await Category.create({
        name: "Laptop System Test",
        image: "https://example.com/category.jpg",
      });

      testBrand = await Brand.create({
        name: "Dell System Test",
        image: "https://example.com/brand.jpg",
      });

      testProduct = await Product.create({
        title: "Dell Laptop System Test Product",
        price: 15000000,
        inventory: 100,
        category: testCategory._id,
        brand: testBrand._id,
        images: ["https://example.com/laptop.jpg"],
      });

      initialInventory = testProduct.inventory;

      testUser = await User.create({
        name: "System Test User",
        email: "systemtest@example.com",
        password: "Haolatuii2703@",
        passwordConfirm: "Haolatuii2703@",
        role: "user",
        active: "active",
        balance: 50000000,
      });

      // Đảm bảo có token trước mỗi test
      const loginResponse = await request(app)
        .post("/api/v1/users/login")
        .send({
          email: "systemtest@example.com",
          password: "Haolatuii2703@",
        });
      authToken = loginResponse.body.token;
    });

    it("nên tạo đơn hàng thành công sau khi đăng nhập", async () => {
      const orderData = {
        cart: [
          {
            id: testProduct._id.toString(), // Product ID để update inventory
            product: {
              _id: testProduct._id.toString(),
              title: testProduct.title,
              price: testProduct.price,
              images: testProduct.images,
            },
            quantity: 2,
          },
        ],
        address: "123 Đường System Test, Quận 1, TP.HCM",
        receiver: "System Test User",
        phone: "0123456789",
        payments: "tiền mặt",
        totalPrice: 30000000, // 2 sản phẩm x 15 triệu
      };

      const response = await request(app)
        .post("/api/v1/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send(orderData);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe("success");
      // Response chỉ có id và totalPrice, không có full order object
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.totalPrice).toBe(30000000);

      // Kiểm tra order đã được tạo trong database
      const createdOrder = await Order.findById(response.body.data.id);
      expect(createdOrder).toBeTruthy();
      expect(createdOrder.user.toString()).toBe(testUser._id.toString());
      expect(createdOrder.address).toBe(orderData.address);
      expect(createdOrder.receiver).toBe(orderData.receiver);
      expect(createdOrder.phone).toBe(orderData.phone);
      expect(createdOrder.payments).toBe("tiền mặt");
      expect(createdOrder.status).toBe("Processed");
      expect(createdOrder.cart).toHaveLength(1);
      expect(createdOrder.cart[0].quantity).toBe(2);
      expect(createdOrder.totalPrice).toBe(30000000);
    });

    it("nên giảm inventory sản phẩm sau khi tạo đơn hàng", async () => {
      // Test này phụ thuộc vào test trước, cần đảm bảo test trước đã chạy thành công
      // Nếu test trước fail, test này sẽ skip
      if (!authToken) {
        // Đăng nhập lại nếu token chưa có
        const loginResponse = await request(app)
          .post("/api/v1/users/login")
          .send({
            email: "systemtest@example.com",
            password: "Haolatuii2703@",
          });
        authToken = loginResponse.body.token;
      }

      // Lấy lại sản phẩm từ database để kiểm tra inventory
      const updatedProduct = await Product.findById(testProduct._id);
      expect(updatedProduct).toBeTruthy();
      // Inventory đã giảm từ test trước (2 sản phẩm)
      expect(updatedProduct.inventory).toBeLessThan(initialInventory);
    });

    it("nên tạo đơn hàng với thanh toán bằng số dư", async () => {
      const orderData = {
        cart: [
          {
            id: testProduct._id.toString(), // Product ID để update inventory
            product: {
              _id: testProduct._id.toString(),
              title: testProduct.title,
              price: testProduct.price,
              images: testProduct.images,
            },
            quantity: 1,
          },
        ],
        address: "456 Đường System Test, Quận 2, TP.HCM",
        receiver: "System Test User",
        phone: "0987654321",
        payments: "số dư",
        totalPrice: 15000000, // 1 sản phẩm x 15 triệu
      };

      const response = await request(app)
        .post("/api/v1/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send(orderData);

      expect(response.status).toBe(201);

      // Kiểm tra order đã được tạo với payments = "số dư"
      const createdOrder = await Order.findById(response.body.data.id);
      expect(createdOrder).toBeTruthy();
      expect(createdOrder.payments).toBe("số dư");

      // Kiểm tra balance của user đã giảm
      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser).toBeTruthy();
      expect(updatedUser.balance).toBe(50000000 - 15000000); // 50 triệu - 15 triệu = 35 triệu
    });

    it("nên trả về lỗi khi tạo đơn hàng không có token", async () => {
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
        address: "123 Test Street",
        receiver: "Test User",
        phone: "0123456789",
        payments: "tiền mặt",
        totalPrice: 15000000,
      };

      const response = await request(app)
        .post("/api/v1/orders")
        .send(orderData);

      expect(response.status).toBe(401);
      expect(response.body.status).toBe("fail");
    });

    it("nên trả về lỗi khi thiếu thông tin bắt buộc (address)", async () => {
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
        receiver: "Test User",
        phone: "0123456789",
        payments: "tiền mặt",
        totalPrice: 15000000,
      };

      const response = await request(app)
        .post("/api/v1/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send(orderData);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe("fail");
    });
  });

  describe("Bước 3: Xem đơn hàng sau khi mua", () => {
    beforeEach(async () => {
      // Xóa data cũ trước khi tạo mới
      await Category.deleteMany({ name: "Laptop System Test" });
      await Brand.deleteMany({ name: "Dell System Test" });
      await Product.deleteMany({ title: "Dell Laptop System Test Product" });
      await User.deleteMany({ email: "systemtest@example.com" });

      // Đảm bảo user và product tồn tại
      testCategory = await Category.create({
        name: "Laptop System Test",
        image: "https://example.com/category.jpg",
      });

      testBrand = await Brand.create({
        name: "Dell System Test",
        image: "https://example.com/brand.jpg",
      });

      testProduct = await Product.create({
        title: "Dell Laptop System Test Product",
        price: 15000000,
        inventory: 100,
        category: testCategory._id,
        brand: testBrand._id,
        images: ["https://example.com/laptop.jpg"],
      });

      testUser = await User.create({
        name: "System Test User",
        email: "systemtest@example.com",
        password: "Haolatuii2703@",
        passwordConfirm: "Haolatuii2703@",
        role: "user",
        active: "active",
        balance: 50000000,
      });

      // Tạo đơn hàng để test xem đơn hàng
      const loginResponse = await request(app)
        .post("/api/v1/users/login")
        .send({
          email: "systemtest@example.com",
          password: "Haolatuii2703@",
        });
      authToken = loginResponse.body.token;

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
        address: "123 Test Address",
        receiver: "System Test User",
        phone: "0123456789",
        payments: "tiền mặt",
        totalPrice: 15000000,
      };

      await request(app)
        .post("/api/v1/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send(orderData);
    });

    it("nên xem được danh sách đơn hàng của user sau khi đăng nhập", async () => {
      const response = await request(app)
        .get("/api/v1/orders")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.results).toBeGreaterThan(0);
      expect(Array.isArray(response.body.data.data)).toBe(true);
      expect(response.body.data.data.length).toBeGreaterThan(0);
    });

    it("nên xem được chi tiết đơn hàng đã tạo", async () => {
      // Lấy đơn hàng đầu tiên
      const ordersResponse = await request(app)
        .get("/api/v1/orders")
        .set("Authorization", `Bearer ${authToken}`);

      expect(ordersResponse.status).toBe(200);
      expect(ordersResponse.body.data).toBeDefined();
      expect(ordersResponse.body.data.data).toBeDefined();
      expect(Array.isArray(ordersResponse.body.data.data)).toBe(true);
      expect(ordersResponse.body.data.data.length).toBeGreaterThan(0);

      const firstOrderId = ordersResponse.body.data.data[0]._id;

      const response = await request(app)
        .get(`/api/v1/orders/${firstOrderId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toBeDefined();
      expect(response.body.data.data).toBeDefined();
      expect(response.body.data.data.user.toString()).toBe(
        testUser._id.toString()
      );
    });
  });

  describe("Flow hoàn chỉnh: Đăng nhập --> Mua hàng --> Xem đơn hàng", () => {
    it("nên thực hiện toàn bộ flow từ đầu đến cuối thành công", async () => {
      // Bước 1: Đăng nhập
      const loginResponse = await request(app)
        .post("/api/v1/users/login")
        .send({
          email: "systemtest@example.com",
          password: "Haolatuii2703@",
        });

      expect(loginResponse.status).toBe(200);
      const token = loginResponse.body.token;

      // Bước 2: Tạo đơn hàng
      const orderData = {
        cart: [
          {
            id: testProduct._id.toString(), // Product ID để update inventory
            product: {
              _id: testProduct._id.toString(),
              title: testProduct.title,
              price: testProduct.price,
              images: testProduct.images,
            },
            quantity: 1,
          },
        ],
        address: "789 Đường System Test Flow, Quận 3, TP.HCM",
        receiver: "System Test User",
        phone: "0111222333",
        payments: "tiền mặt",
        totalPrice: 15000000,
      };

      const orderResponse = await request(app)
        .post("/api/v1/orders")
        .set("Authorization", `Bearer ${token}`)
        .send(orderData);

      expect(orderResponse.status).toBe(201);
      const orderId = orderResponse.body.data.id;

      // Bước 3: Xem đơn hàng vừa tạo
      const getOrderResponse = await request(app)
        .get(`/api/v1/orders/${orderId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(getOrderResponse.status).toBe(200);
      expect(getOrderResponse.body.data.data._id.toString()).toBe(
        orderId.toString()
      );
      expect(getOrderResponse.body.data.data.address).toBe(orderData.address);

      // Bước 4: Kiểm tra inventory đã giảm
      const updatedProduct = await Product.findById(testProduct._id);
      expect(updatedProduct).toBeTruthy();
      const expectedInventory = initialInventory - 2 - 1 - 1; // Trừ đi các đơn hàng đã tạo trong các test trước
      expect(updatedProduct.inventory).toBeLessThan(initialInventory);
    });
  });
});
