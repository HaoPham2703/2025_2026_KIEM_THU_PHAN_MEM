const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../../app");
const User = require("../../models/userModel");
const Product = require("../../models/productModel");
const Order = require("../../models/orderModel");
const Review = require("../../models/reviewModel");
const Comment = require("../../models/commentModel");
const Category = require("../../models/categoryModel");
const Brand = require("../../models/brandModel");
const sendEmail = require("../../utils/email");

// Mock email module
jest.mock("../../utils/email");
sendEmail.mockResolvedValue(true);

describe("System Test - Flow User đánh giá --> Bình luận --> Like comment", () => {
  let testUser;
  let adminUser;
  let testProduct;
  let testCategory;
  let testBrand;
  let userToken;
  let adminToken;
  let testOrder;
  let testReview;
  let testComment;

  beforeAll(async () => {
    // Tạo dữ liệu test
    testCategory = await Category.create({
      name: "Laptop Review Comment Test",
      image: "https://example.com/category.jpg",
    });

    testBrand = await Brand.create({
      name: "Dell Review Comment Test",
      image: "https://example.com/brand.jpg",
    });

    testProduct = await Product.create({
      title: "Dell Laptop Review Comment Test Product",
      price: 15000000,
      inventory: 100,
      category: testCategory._id,
      brand: testBrand._id,
      images: ["https://example.com/laptop.jpg"],
    });

    testUser = await User.create({
      name: "Review Comment Test User",
      email: "reviewcomment@example.com",
      password: "Haolatuii2703@",
      passwordConfirm: "Haolatuii2703@",
      role: "user",
      active: "active",
    });

    adminUser = await User.create({
      name: "Admin Review Comment Test",
      email: "adminreviewcomment@example.com",
      password: "Haolatuii2703@",
      passwordConfirm: "Haolatuii2703@",
      role: "admin",
      active: "active",
    });
  });

  afterAll(async () => {
    await User.deleteMany({
      email: {
        $in: ["reviewcomment@example.com", "adminreviewcomment@example.com"],
      },
    });
    await Product.deleteMany({
      title: "Dell Laptop Review Comment Test Product",
    });
    await Order.deleteMany({ user: testUser._id });
    await Review.deleteMany({ user: testUser._id });
    await Comment.deleteMany({ user: testUser._id });
    await Category.deleteMany({ name: "Laptop Review Comment Test" });
    await Brand.deleteMany({ name: "Dell Review Comment Test" });
  });

  describe("Bước 1: User đăng nhập và tạo đơn hàng", () => {
    it("nên đăng nhập và tạo đơn hàng thành công", async () => {
      const loginResponse = await request(app)
        .post("/api/v1/users/login")
        .send({
          email: "reviewcomment@example.com",
          password: "Haolatuii2703@",
        });

      expect(loginResponse.status).toBe(200);
      userToken = loginResponse.body.token;

      // Tạo đơn hàng
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
        address: "123 Review Comment Test",
        receiver: "Review Comment User",
        phone: "0123456789",
        payments: "tiền mặt",
        totalPrice: 15000000,
      };

      const orderResponse = await request(app)
        .post("/api/v1/orders")
        .set("Authorization", `Bearer ${userToken}`)
        .send(orderData);

      expect(orderResponse.status).toBe(201);
      testOrder = await Order.findById(orderResponse.body.data.id);
      expect(testOrder).toBeTruthy();
    });
  });

  describe("Bước 2: Admin cập nhật order status = Success", () => {
    it("nên cập nhật order status thành Success", async () => {
      const adminLogin = await request(app).post("/api/v1/users/login").send({
        email: "adminreviewcomment@example.com",
        password: "Haolatuii2703@",
      });

      adminToken = adminLogin.body.token;

      await request(app)
        .patch(`/api/v1/orders/${testOrder._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "Success" });

      const updatedOrder = await Order.findById(testOrder._id);
      expect(updatedOrder).toBeTruthy();
      expect(updatedOrder.status).toBe("Success");
    });
  });

  describe("Bước 3: User tạo review cho sản phẩm", () => {
    it("nên tạo review thành công", async () => {
      const reviewData = {
        rating: 5,
        review: "Sản phẩm tuyệt vời!",
      };

      const response = await request(app)
        .post(`/api/v1/products/${testProduct._id}/reviews`)
        .set("Authorization", `Bearer ${userToken}`)
        .send(reviewData);

      expect(response.status).toBe(201);
      testReview = await Review.findOne({
        user: testUser._id,
        product: testProduct._id,
      });
      expect(testReview).toBeTruthy();
    });
  });

  describe("Bước 4: User tạo comment cho sản phẩm", () => {
    it("nên tạo comment thành công", async () => {
      const commentData = {
        comment: "Sản phẩm này có vẻ rất tốt!",
      };

      const response = await request(app)
        .post(`/api/v1/products/${testProduct._id}/comments`)
        .set("Authorization", `Bearer ${userToken}`)
        .send(commentData);

      expect(response.status).toBe(201);
      testComment = await Comment.findOne({
        user: testUser._id,
        product: testProduct._id,
      });
      expect(testComment).toBeTruthy();
    });
  });

  describe("Bước 5: User like comment", () => {
    it("nên like comment thành công", async () => {
      const response = await request(app)
        .patch(`/api/v1/comments/${testComment._id}/like`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.status).toBe(200);

      // Kiểm tra user đã được thêm vào likes array
      const updatedComment = await Comment.findById(testComment._id);
      expect(updatedComment).toBeTruthy();
      expect(updatedComment.likes).toContainEqual(
        expect.objectContaining({
          _id: testUser._id,
        })
      );
    });

    it("nên unlike comment khi like lại", async () => {
      // Like lại sẽ unlike
      const response = await request(app)
        .patch(`/api/v1/comments/${testComment._id}/like`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.status).toBe(200);

      // Kiểm tra user đã được xóa khỏi likes array
      const updatedComment = await Comment.findById(testComment._id);
      expect(updatedComment).toBeTruthy();
      const userInLikes = updatedComment.likes.find(
        (like) => like._id.toString() === testUser._id.toString()
      );
      expect(userInLikes).toBeUndefined();
    });
  });

  describe("Flow hoàn chỉnh: Đánh giá --> Bình luận --> Like", () => {
    it("nên thực hiện toàn bộ flow từ đánh giá đến like comment", async () => {
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
        address: "999 Complete Flow",
        receiver: "Complete Flow User",
        phone: "0111222333",
        payments: "tiền mặt",
        totalPrice: 15000000,
      };

      const orderResponse = await request(app)
        .post("/api/v1/orders")
        .set("Authorization", `Bearer ${userToken}`)
        .send(orderData);

      const orderId = orderResponse.body.data.id;

      // Admin cập nhật status
      await request(app)
        .patch(`/api/v1/orders/${orderId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "Success" });

      // User tạo review
      const reviewResponse = await request(app)
        .post(`/api/v1/products/${testProduct._id}/reviews`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          rating: 4,
          review: "Good product!",
        });

      expect(reviewResponse.status).toBe(201);

      // User tạo comment
      const commentResponse = await request(app)
        .post(`/api/v1/products/${testProduct._id}/comments`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          comment: "Nice!",
        });

      const commentId = commentResponse.body.data.data._id;

      // User like comment
      const likeResponse = await request(app)
        .patch(`/api/v1/comments/${commentId}/like`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(likeResponse.status).toBe(200);
    });
  });
});
