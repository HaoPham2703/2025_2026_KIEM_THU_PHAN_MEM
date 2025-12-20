const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../../app");
const User = require("../../models/userModel");
const Product = require("../../models/productModel");
const Order = require("../../models/orderModel");
const Review = require("../../models/reviewModel");
const Category = require("../../models/categoryModel");
const Brand = require("../../models/brandModel");
const sendEmail = require("../../utils/email");

// Mock email module
jest.mock("../../utils/email");
sendEmail.mockResolvedValue(true);

describe("System Test - Flow Mua hàng --> Nhận hàng --> Đánh giá sản phẩm", () => {
  let testUser;
  let adminUser;
  let testProduct;
  let testCategory;
  let testBrand;
  let userToken;
  let adminToken;
  let testOrder;
  let initialRatingsAverage;
  let initialRatingsQuantity;

  beforeAll(async () => {
    // Tạo dữ liệu test
    testCategory = await Category.create({
      name: "Laptop Review Test",
      image: "https://example.com/category.jpg",
    });

    testBrand = await Brand.create({
      name: "Dell Review Test",
      image: "https://example.com/brand.jpg",
    });

    testProduct = await Product.create({
      title: "Dell Laptop Review Test Product",
      price: 15000000,
      inventory: 100,
      category: testCategory._id,
      brand: testBrand._id,
      images: ["https://example.com/laptop.jpg"],
      ratingsAverage: 4.5,
      ratingsQuantity: 10,
    });

    initialRatingsAverage = testProduct.ratingsAverage;
    initialRatingsQuantity = testProduct.ratingsQuantity;

    testUser = await User.create({
      name: "Review Test User",
      email: "reviewtest@example.com",
      password: "Haolatuii2703@",
      passwordConfirm: "Haolatuii2703@",
      role: "user",
      active: "active",
    });

    adminUser = await User.create({
      name: "Admin Review Test",
      email: "adminreview@example.com",
      password: "Haolatuii2703@",
      passwordConfirm: "Haolatuii2703@",
      role: "admin",
      active: "active",
    });
  });

  afterAll(async () => {
    await User.deleteMany({
      email: { $in: ["reviewtest@example.com", "adminreview@example.com"] },
    });
    await Product.deleteMany({ title: "Dell Laptop Review Test Product" });
    await Order.deleteMany({ user: testUser._id });
    await Review.deleteMany({ user: testUser._id });
    await Category.deleteMany({ name: "Laptop Review Test" });
    await Brand.deleteMany({ name: "Dell Review Test" });
  });

  describe("Bước 1: User đăng nhập và tạo đơn hàng", () => {
    beforeEach(async () => {
      // Đảm bảo user và product tồn tại (vì afterEach trong setup.js xóa tất cả)
      testCategory = await Category.create({
        name: "Laptop Review Test",
        image: "https://example.com/category.jpg",
      });

      testBrand = await Brand.create({
        name: "Dell Review Test",
        image: "https://example.com/brand.jpg",
      });

      testProduct = await Product.create({
        title: "Dell Laptop Review Test Product",
        price: 15000000,
        inventory: 100,
        category: testCategory._id,
        brand: testBrand._id,
        images: ["https://example.com/laptop.jpg"],
      });

      testUser = await User.create({
        name: "Review Test User",
        email: "reviewtest@example.com",
        password: "Haolatuii2703@",
        passwordConfirm: "Haolatuii2703@",
        role: "user",
        active: "active",
      });

      adminUser = await User.create({
        name: "Admin Review Test",
        email: "adminreview@example.com",
        password: "Haolatuii2703@",
        passwordConfirm: "Haolatuii2703@",
        role: "admin",
        active: "active",
      });

      initialRatingsQuantity = testProduct.ratingsQuantity || 0;
    });

    it("nên đăng nhập user thành công", async () => {
      const response = await request(app).post("/api/v1/users/login").send({
        email: "reviewtest@example.com",
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
        address: "123 Review Test Street",
        receiver: "Review Test User",
        phone: "0123456789",
        payments: "tiền mặt",
        totalPrice: 15000000,
      };

      const response = await request(app)
        .post("/api/v1/orders")
        .set("Authorization", `Bearer ${userToken}`)
        .send(orderData);

      expect(response.status).toBe(201);
      testOrder = await Order.findById(response.body.data.id);
      expect(testOrder).toBeTruthy();
    });
  });

  describe("Bước 2: Admin cập nhật order status = Success", () => {
    beforeEach(async () => {
      // Đảm bảo user, product và order tồn tại
      testCategory = await Category.create({
        name: "Laptop Review Test",
        image: "https://example.com/category.jpg",
      });

      testBrand = await Brand.create({
        name: "Dell Review Test",
        image: "https://example.com/brand.jpg",
      });

      testProduct = await Product.create({
        title: "Dell Laptop Review Test Product",
        price: 15000000,
        inventory: 100,
        category: testCategory._id,
        brand: testBrand._id,
        images: ["https://example.com/laptop.jpg"],
      });

      testUser = await User.create({
        name: "Review Test User",
        email: "reviewtest@example.com",
        password: "Haolatuii2703@",
        passwordConfirm: "Haolatuii2703@",
        role: "user",
        active: "active",
      });

      adminUser = await User.create({
        name: "Admin Review Test",
        email: "adminreview@example.com",
        password: "Haolatuii2703@",
        passwordConfirm: "Haolatuii2703@",
        role: "admin",
        active: "active",
      });

      // Tạo đơn hàng
      userToken = (
        await request(app).post("/api/v1/users/login").send({
          email: "reviewtest@example.com",
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
        address: "123 Review Test Street",
        receiver: "Review Test User",
        phone: "0123456789",
        payments: "tiền mặt",
        totalPrice: 15000000,
      };

      const orderResponse = await request(app)
        .post("/api/v1/orders")
        .set("Authorization", `Bearer ${userToken}`)
        .send(orderData);

      testOrder = await Order.findById(orderResponse.body.data.id);
      initialRatingsQuantity = testProduct.ratingsQuantity || 0;
    });

    it("nên đăng nhập admin thành công", async () => {
      const response = await request(app).post("/api/v1/users/login").send({
        email: "adminreview@example.com",
        password: "Haolatuii2703@",
      });

      expect(response.status).toBe(200);
      adminToken = response.body.token;
    });

    it("nên cập nhật order status thành Success", async () => {
      const response = await request(app)
        .patch(`/api/v1/orders/${testOrder._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          status: "Success",
        });

      expect(response.status).toBe(200);

      // Kiểm tra order status đã được cập nhật
      const updatedOrder = await Order.findById(testOrder._id);
      expect(updatedOrder).toBeTruthy();
      expect(updatedOrder.status).toBe("Success");
    });
  });

  describe("Bước 3: User tạo review cho sản phẩm đã mua", () => {
    it("nên tạo review thành công cho sản phẩm đã mua", async () => {
      const reviewData = {
        rating: 5,
        review: "Sản phẩm rất tốt, đáng mua!",
      };

      const response = await request(app)
        .post(`/api/v1/products/${testProduct._id}/reviews`)
        .set("Authorization", `Bearer ${userToken}`)
        .send(reviewData);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe("success");

      // Kiểm tra review được tạo
      const review = await Review.findOne({
        user: testUser._id,
        product: testProduct._id,
      });
      expect(review).toBeTruthy();
      expect(review.rating).toBe(5);
      expect(review.review).toBe("Sản phẩm rất tốt, đáng mua!");
    });

    it("nên cập nhật ratingsAverage và ratingsQuantity của product", async () => {
      const updatedProduct = await Product.findById(testProduct._id);
      expect(updatedProduct).toBeTruthy();
      expect(updatedProduct.ratingsQuantity).toBe(initialRatingsQuantity + 1);
      // ratingsAverage sẽ được tính lại tự động
      expect(updatedProduct.ratingsAverage).toBeDefined();
    });
  });

  describe("Flow hoàn chỉnh: Mua hàng --> Nhận hàng --> Đánh giá", () => {
    it("nên thực hiện toàn bộ flow từ mua hàng đến đánh giá", async () => {
      // Bước 1: User đăng nhập
      const loginResponse = await request(app)
        .post("/api/v1/users/login")
        .send({
          email: "reviewtest@example.com",
          password: "Haolatuii2703@",
        });
      const token = loginResponse.body.token;

      // Bước 2: Tạo đơn hàng
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
        payments: "tiền mặt",
        totalPrice: 15000000,
      };

      const orderResponse = await request(app)
        .post("/api/v1/orders")
        .set("Authorization", `Bearer ${token}`)
        .send(orderData);

      const orderId = orderResponse.body.data.id;

      // Bước 3: Admin cập nhật status
      const adminLogin = await request(app).post("/api/v1/users/login").send({
        email: "adminreview@example.com",
        password: "Haolatuii2703@",
      });

      await request(app)
        .patch(`/api/v1/orders/${orderId}`)
        .set("Authorization", `Bearer ${adminLogin.body.token}`)
        .send({ status: "Success" });

      // Bước 4: User tạo review
      const reviewResponse = await request(app)
        .post(`/api/v1/products/${testProduct._id}/reviews`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          rating: 4,
          review: "Sản phẩm tốt!",
        });

      expect(reviewResponse.status).toBe(201);
    });
  });
});
