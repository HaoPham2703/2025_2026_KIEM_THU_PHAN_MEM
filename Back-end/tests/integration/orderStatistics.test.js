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

describe("System Test - Flow Thống kê đơn hàng và doanh thu", () => {
  let adminUser;
  let testUsers;
  let testProducts;
  let testCategory;
  let testBrand;
  let adminToken;
  let testOrders;

  beforeAll(async () => {
    // Tạo admin user
    adminUser = await User.create({
      name: "Admin Statistics Test",
      email: "adminstatistics@example.com",
      password: "Haolatui2703@",
      passwordConfirm: "Haolatui2703@",
      role: "admin",
      active: "active",
    });

    // Tạo test users
    testUsers = await User.create([
      {
        name: "Statistics User 1",
        email: "statistics1@example.com",
        password: "Haolatui2703@",
        passwordConfirm: "Haolatui2703@",
        role: "user",
        active: "active",
      },
      {
        name: "Statistics User 2",
        email: "statistics2@example.com",
        password: "Haolatui2703@",
        passwordConfirm: "Haolatui2703@",
        role: "user",
        active: "active",
      },
    ]);

    // Tạo category và brand
    testCategory = await Category.create({
      name: "Laptop Statistics Test",
      image: "https://example.com/category.jpg",
    });

    testBrand = await Brand.create({
      name: "Dell Statistics Test",
      image: "https://example.com/brand.jpg",
    });

    // Tạo sản phẩm
    testProducts = await Product.create([
      {
        title: "Dell Laptop Statistics Product 1",
        price: 15000000,
        inventory: 100,
        category: testCategory._id,
        brand: testBrand._id,
        images: ["https://example.com/laptop1.jpg"],
      },
      {
        title: "Dell Laptop Statistics Product 2",
        price: 20000000,
        inventory: 50,
        category: testCategory._id,
        brand: testBrand._id,
        images: ["https://example.com/laptop2.jpg"],
      },
    ]);

    // Tạo đơn hàng với các status khác nhau
    const user1Token = await getToken("statistics1@example.com");
    const user2Token = await getToken("statistics2@example.com");

    // Tạo đơn hàng Processed
    const order1 = await createOrder(user1Token, testProducts[0], "Processed");
    // Tạo đơn hàng Success
    const order2 = await createOrder(user1Token, testProducts[1], "Success");
    // Tạo đơn hàng Delivery
    const order3 = await createOrder(user2Token, testProducts[0], "Delivery");
    // Tạo đơn hàng Cancelled
    const order4 = await createOrder(user2Token, testProducts[1], "Cancelled");

    testOrders = [order1, order2, order3, order4];
  });

  afterAll(async () => {
    await User.deleteMany({
      email: {
        $in: [
          "adminstatistics@example.com",
          "statistics1@example.com",
          "statistics2@example.com",
        ],
      },
    });
    await Product.deleteMany({ title: /Statistics Product/ });
    await Order.deleteMany({ user: { $in: testUsers.map((u) => u._id) } });
    await Category.deleteMany({ name: "Laptop Statistics Test" });
    await Brand.deleteMany({ name: "Dell Statistics Test" });
  });

  // Helper functions
  async function getToken(email) {
    const response = await request(app).post("/api/v1/users/login").send({
      email: email,
      password: "Haolatui2703@",
    });
    return response.body.token;
  }

  async function createOrder(token, product, status) {
    const orderData = {
      cart: [
        {
          id: product._id.toString(),
          product: {
            _id: product._id.toString(),
            title: product.title,
            price: product.price,
            images: product.images,
          },
          quantity: 1,
        },
      ],
      address: "123 Statistics Test",
      receiver: "Statistics User",
      phone: "0123456789",
      payments: "tiền mặt",
      totalPrice: product.price,
    };

    const response = await request(app)
      .post("/api/v1/orders")
      .set("Authorization", `Bearer ${token}`)
      .send(orderData);

    const orderId = response.body.data.id;
    const order = await Order.findById(orderId);
    expect(order).toBeTruthy();
    order.status = status;
    await order.save();

    return order;
  }

  describe("Bước 1: Admin đăng nhập", () => {
    it("nên đăng nhập admin thành công", async () => {
      const response = await request(app).post("/api/v1/users/login").send({
        email: "adminstatistics@example.com",
        password: "Haolatui2703@",
      });

      expect(response.status).toBe(200);
      adminToken = response.body.token;
    });
  });

  describe("Bước 2: Thống kê số lượng đơn hàng theo status", () => {
    it("nên lấy được thống kê số lượng đơn theo status", async () => {
      const response = await request(app)
        .get("/api/v1/orders/count")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);

      // Kiểm tra có các status
      const statuses = response.body.map((item) => item._id);
      expect(statuses.length).toBeGreaterThan(0);
    });
  });

  describe("Bước 3: Thống kê số lượng đơn theo option (year/month)", () => {
    it("nên lấy được thống kê theo year", async () => {
      const response = await request(app)
        .post("/api/v1/orders/countOption")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          year: true,
        });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it("nên lấy được thống kê theo month", async () => {
      const response = await request(app)
        .post("/api/v1/orders/countOption")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          month: true,
        });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("Bước 4: Thống kê tổng doanh thu", () => {
    it("nên lấy được thống kê doanh thu theo tháng", async () => {
      const response = await request(app)
        .get("/api/v1/orders/sum")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("Bước 5: Thống kê doanh thu theo option", () => {
    it("nên lấy được thống kê doanh thu theo month", async () => {
      const response = await request(app)
        .post("/api/v1/orders/sumOption")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          month: true,
        });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("Bước 6: Thống kê top sản phẩm bán chạy", () => {
    it("nên lấy được top 5 sản phẩm bán chạy", async () => {
      const response = await request(app)
        .post("/api/v1/orders/topProduct")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({});

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(5);
    });
  });

  describe("Bước 7: Thống kê đơn hàng trong khoảng thời gian", () => {
    it("nên lấy được thống kê đơn hàng trong khoảng thời gian", async () => {
      const dateFrom = new Date("2025-01-01");
      const dateTo = new Date("2025-12-31");

      const response = await request(app)
        .post("/api/v1/orders/statusInRange")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          dateFrom: dateFrom.toISOString(),
          dateTo: dateTo.toISOString(),
        });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("Bước 8: Thống kê doanh thu trong khoảng thời gian", () => {
    it("nên lấy được thống kê doanh thu trong khoảng thời gian", async () => {
      const dateFrom = new Date("2025-01-01");
      const dateTo = new Date("2025-12-31");

      const response = await request(app)
        .post("/api/v1/orders/sumInRange")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          dateFrom: dateFrom.toISOString(),
          dateTo: dateTo.toISOString(),
        });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
