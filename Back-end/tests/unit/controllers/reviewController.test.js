const mongoose = require("mongoose");
const Review = require("../../../models/reviewModel");
const Product = require("../../../models/productModel");
const User = require("../../../models/userModel");
const Order = require("../../../models/orderModel");
const reviewController = require("../../../controllers/reviewController");
const factory = require("../../../controllers/handlerFactory");
const AppError = require("../../../utils/appError");

describe("Review Controller - Đánh giá sản phẩm", () => {
  let req, res, next;
  let testUser, testProduct, testOrder, testReview;

  beforeAll(async () => {
    // Create test product
    testProduct = await Product.create({
      title: "Test Product for Review",
      slug: "test-product-review",
      description: "Test product description for review testing",
      price: 100000,
      promotion: 80000,
      inventory: 100,
      sold: 0,
      category: new mongoose.Types.ObjectId(),
      brand: new mongoose.Types.ObjectId(),
      images: ["test-image.jpg"],
      weight: 500,
    });

    // Create test user
    testUser = await User.create({
      name: "Test User Review",
      email: "testreview@example.com",
      password: "Haolatui2703@",
      passwordConfirm: "Haolatui2703@",
      active: "active",
      role: "user",
    });

    // Create successful order for review pre-condition
    testOrder = await Order.create({
      user: testUser._id,
      cart: [
        {
          product: testProduct,
          id: testProduct._id,
          quantity: 1,
        },
      ],
      address: "Test Address",
      phone: "0123456789",
      receiver: "Test Receiver",
      totalPrice: 80000,
      payments: "số dư",
      status: "Success",
    });
  });

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {},
      user: null,
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await Review.deleteMany({});
    await Order.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});
  });

  // ========================================
  // Function A: Get All Reviews (Xem đánh giá sản phẩm)
  // ========================================
  describe("getAllReviews - Xem danh sách đánh giá", () => {
    beforeAll(async () => {
      // Create test review
      testReview = await Review.create({
        product: testProduct._id,
        user: testUser._id,
        review: "Great product!",
        rating: 5,
      });
    });

    afterAll(async () => {
      await Review.deleteMany({});
    });

    it("REV-001: nên xem danh sách đánh giá của sản phẩm thành công", async () => {
      req.params.productId = testProduct._id.toString();

      await reviewController.getAllReviews(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall.status).toBe("success");
      expect(jsonCall.data.data.length).toBeGreaterThan(0);
    });

    it("REV-002: nên xem reviews với query filter (rating=5)", async () => {
      req.params.productId = testProduct._id.toString();
      req.query.rating = "5";

      await reviewController.getAllReviews(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall.status).toBe("success");
    });

    it("REV-003: nên xem reviews của sản phẩm không tồn tại (return empty)", async () => {
      req.params.productId = new mongoose.Types.ObjectId().toString();

      await reviewController.getAllReviews(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall.status).toBe("success");
      expect(jsonCall.data.data.length).toBe(0);
    });
  });

  // ========================================
  // Function B: Create Review (Tạo đánh giá)
  // ========================================
  describe("createReview - Tạo đánh giá", () => {
    let userWithOrder, productForReview, orderForReview;

    beforeAll(async () => {
      // Create user with successful order
      userWithOrder = await User.create({
        name: "User With Order",
        email: "userwithorder@example.com",
        password: "Haolatui2703@",
        passwordConfirm: "Haolatui2703@",
        active: "active",
        role: "user",
      });

      productForReview = await Product.create({
        title: "Product for Review Test",
        slug: "product-review-test",
        description: "Test product",
        price: 200000,
        inventory: 50,
        category: new mongoose.Types.ObjectId(),
        brand: new mongoose.Types.ObjectId(),
        images: ["test.jpg"],
        weight: 300,
      });

      orderForReview = await Order.create({
        user: userWithOrder._id,
        cart: [
          {
            product: productForReview,
            id: productForReview._id,
            quantity: 1,
          },
        ],
        address: "Test Address",
        phone: "0123456789",
        receiver: "Test User",
        totalPrice: 200000,
        payments: "số dư",
        status: "Success",
      });
    });

    afterAll(async () => {
      await Review.deleteMany({});
      await Order.deleteMany({ user: userWithOrder._id });
      await Product.deleteMany({ _id: productForReview._id });
      await User.deleteMany({ _id: userWithOrder._id });
    });

    it("REV-004: nên tạo đánh giá thành công khi user đã mua sản phẩm", async () => {
      req.user = { id: userWithOrder._id };
      req.body = {
        product: productForReview._id,
        user: userWithOrder._id,
        review: "Great product!",
        rating: 5,
      };

      // Test setProductUserIds middleware first
      await reviewController.setProductUserIds(req, res, next);
      expect(next).toHaveBeenCalled();

      // Then test createReview
      await reviewController.createReview(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall.status).toBe("success");
      expect(jsonCall.data.data.review).toBe("Great product!");
    });

    it("REV-005: nên tạo review với rating 1-5 sao", async () => {
      // Test with rating = 3
      const ratings = [1, 2, 3, 4, 5];

      for (const rating of ratings) {
        const tempUser = await User.create({
          name: `User Rating ${rating}`,
          email: `rating${rating}@example.com`,
          password: "Haolatui2703@",
          passwordConfirm: "Haolatui2703@",
          role: "user",
        });

        const tempProduct = await Product.create({
          title: `Product Rating ${rating} Test`,
          slug: `product-rating-${rating}`,
          description: "Test",
          price: 100000,
          inventory: 10,
          category: new mongoose.Types.ObjectId(),
          brand: new mongoose.Types.ObjectId(),
          images: ["test.jpg"],
          weight: 100,
        });

        await Order.create({
          user: tempUser._id,
          cart: [{ product: tempProduct, id: tempProduct._id, quantity: 1 }],
          address: "Test",
          phone: "0123456789",
          receiver: "Test",
          totalPrice: 100000,
          payments: "số dư",
          status: "Success",
        });

        req.user = { id: tempUser._id };
        req.body = {
          product: tempProduct._id,
          user: tempUser._id,
          review: `Review with ${rating} stars`,
          rating: rating,
        };

        await reviewController.setProductUserIds(req, res, next);
        await reviewController.createReview(req, res, next);

        expect(res.status).toHaveBeenCalledWith(201);
        const jsonCall = res.json.mock.calls[res.json.mock.calls.length - 1][0];
        expect(jsonCall.data.data.rating).toBe(rating);

        // Cleanup
        await Review.deleteMany({ user: tempUser._id });
        await Order.deleteMany({ user: tempUser._id });
        await Product.deleteMany({ _id: tempProduct._id });
        await User.deleteMany({ _id: tempUser._id });

        jest.clearAllMocks();
      }
    });

    it("REV-006: nên fail khi user chưa mua sản phẩm", async () => {
      const userNoOrder = await User.create({
        name: "User No Order",
        email: "usernoorder@example.com",
        password: "Haolatui2703@",
        passwordConfirm: "Haolatui2703@",
        role: "user",
      });

      req.user = { id: userNoOrder._id };
      req.body = {
        product: productForReview._id,
        user: userNoOrder._id,
        review: "Test review",
        rating: 5,
      };

      await reviewController.setProductUserIds(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining(
            "Vui lòng mua hàng trước khi đánh giá"
          ),
          statusCode: 403,
        })
      );

      await User.deleteMany({ _id: userNoOrder._id });
    });

    it("REV-007: nên fail khi order status không phải Success", async () => {
      const userProcessingOrder = await User.create({
        name: "User Processing Order",
        email: "processing@example.com",
        password: "Haolatui2703@",
        passwordConfirm: "Haolatui2703@",
        role: "user",
      });

      const productProcessing = await Product.create({
        title: "Product Processing",
        slug: "product-processing",
        description: "Test",
        price: 100000,
        inventory: 10,
        category: new mongoose.Types.ObjectId(),
        brand: new mongoose.Types.ObjectId(),
        images: ["test.jpg"],
        weight: 100,
      });

      await Order.create({
        user: userProcessingOrder._id,
        cart: [
          {
            product: productProcessing,
            id: productProcessing._id,
            quantity: 1,
          },
        ],
        address: "Test",
        phone: "0123456789",
        receiver: "Test",
        totalPrice: 100000,
        payments: "số dư",
        status: "Processed", // Not Success
      });

      req.user = { id: userProcessingOrder._id };
      req.body = {
        product: productProcessing._id,
        user: userProcessingOrder._id,
        review: "Test review",
        rating: 5,
      };

      await reviewController.setProductUserIds(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining(
            "Vui lòng mua hàng trước khi đánh giá"
          ),
        })
      );

      await Order.deleteMany({ user: userProcessingOrder._id });
      await Product.deleteMany({ _id: productProcessing._id });
      await User.deleteMany({ _id: userProcessingOrder._id });
    });

    it("REV-008: nên fail khi tạo duplicate review (unique constraint)", async () => {
      // First review
      const review1 = await Review.create({
        product: productForReview._id,
        user: userWithOrder._id,
        review: "First review",
        rating: 5,
      });

      // Try to create duplicate
      req.user = { id: userWithOrder._id };
      req.body = {
        product: productForReview._id,
        user: userWithOrder._id,
        review: "Second review (duplicate)",
        rating: 4,
      };

      try {
        await reviewController.createReview(req, res, next);
      } catch (error) {
        expect(error.code).toBe(11000); // Duplicate key error
      }

      await Review.deleteMany({ _id: review1._id });
    });

    it("REV-009: nên fail khi thiếu review text", async () => {
      req.user = { id: userWithOrder._id };
      req.body = {
        product: productForReview._id,
        user: userWithOrder._id,
        rating: 5,
        // review text missing
      };

      try {
        await reviewController.createReview(req, res, next);
      } catch (error) {
        expect(error.errors.review.message).toContain(
          "Đánh giá không thể để trống!"
        );
      }
    });

    it("REV-010: nên fail khi rating ngoài phạm vi 1-5", async () => {
      req.user = { id: userWithOrder._id };
      req.body = {
        product: productForReview._id,
        user: userWithOrder._id,
        review: "Test review",
        rating: 6, // Invalid
      };

      try {
        await reviewController.createReview(req, res, next);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("REV-011: nên fail khi Admin/Employee cố tạo review", async () => {
      const adminUser = await User.create({
        name: "Admin User",
        email: "adminreview@example.com",
        password: "Haolatui2703@",
        passwordConfirm: "Haolatui2703@",
        role: "admin",
      });

      // Admin try to create review (should fail in setProductUserIds)
      req.user = { id: adminUser._id, role: "admin" };
      req.body = {
        product: productForReview._id,
        user: adminUser._id,
        review: "Admin review",
        rating: 5,
      };

      await reviewController.setProductUserIds(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining(
            "Vui lòng mua hàng trước khi đánh giá"
          ),
        })
      );

      await User.deleteMany({ _id: adminUser._id });
    });
  });

  // ========================================
  // Function C: Update Review (Cập nhật đánh giá)
  // ========================================
  describe("updateReview - Cập nhật đánh giá", () => {
    let reviewToUpdate, reviewOwner;

    beforeAll(async () => {
      reviewOwner = await User.create({
        name: "Review Owner",
        email: "reviewowner@example.com",
        password: "Haolatui2703@",
        passwordConfirm: "Haolatui2703@",
        role: "user",
      });

      reviewToUpdate = await Review.create({
        product: testProduct._id,
        user: reviewOwner._id,
        review: "Original review",
        rating: 3,
      });
    });

    afterAll(async () => {
      await Review.deleteMany({ _id: reviewToUpdate._id });
      await User.deleteMany({ _id: reviewOwner._id });
    });

    it("REV-012: nên cập nhật review thành công bởi owner", async () => {
      req.user = { id: reviewOwner._id, role: "user" };
      req.params.id = reviewToUpdate._id.toString();
      req.body = {
        review: "Updated review text",
        rating: 5,
      };

      await reviewController.updateReview(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall.status).toBe("success");
      expect(jsonCall.data.data.review).toBe("Updated review text");
    });

    it("REV-013: nên cho phép Admin cập nhật review", async () => {
      const adminUser = await User.create({
        name: "Admin Update",
        email: "adminupdate@example.com",
        password: "Haolatui2703@",
        passwordConfirm: "Haolatui2703@",
        role: "admin",
      });

      req.user = { id: adminUser._id, role: "admin" };
      req.params.id = reviewToUpdate._id.toString();
      req.body = {
        review: "Admin updated",
        rating: 4,
      };

      await reviewController.updateReview(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);

      await User.deleteMany({ _id: adminUser._id });
    });

    it("REV-014: nên fail khi user không phải owner cố update", async () => {
      const otherUser = await User.create({
        name: "Other User",
        email: "otheruser@example.com",
        password: "Haolatui2703@",
        passwordConfirm: "Haolatui2703@",
        role: "user",
      });

      req.user = { id: otherUser._id, role: "user" };
      req.params.id = reviewToUpdate._id.toString();
      req.body = {
        review: "Hacker trying to update",
        rating: 1,
      };

      await reviewController.isOwner(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining("Bạn không có quyền"),
        })
      );

      await User.deleteMany({ _id: otherUser._id });
    });

    it("REV-015: nên fail khi review không tồn tại", async () => {
      req.user = { id: reviewOwner._id };
      req.params.id = new mongoose.Types.ObjectId().toString();
      req.body = {
        review: "Update non-existent",
        rating: 5,
      };

      await reviewController.updateReview(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Không tìm thấy dữ liệu với ID này",
        })
      );
    });
  });

  // ========================================
  // Function D: Delete Review (Xóa đánh giá)
  // ========================================
  describe("deleteReview - Xóa đánh giá", () => {
    it("REV-016: nên xóa review thành công bởi owner", async () => {
      const deleteOwner = await User.create({
        name: "Delete Owner",
        email: "deleteowner@example.com",
        password: "Haolatui2703@",
        passwordConfirm: "Haolatui2703@",
        role: "user",
      });

      const reviewToDelete = await Review.create({
        product: testProduct._id,
        user: deleteOwner._id,
        review: "Will be deleted",
        rating: 3,
      });

      req.user = { id: deleteOwner._id, role: "user" };
      req.params.id = reviewToDelete._id.toString();

      await reviewController.deleteReview(req, res, next);

      expect(res.status).toHaveBeenCalledWith(204);

      await User.deleteMany({ _id: deleteOwner._id });
    });

    it("REV-017: nên cho phép Admin xóa review", async () => {
      const adminUser = await User.create({
        name: "Admin Delete",
        email: "admindelete@example.com",
        password: "Haolatui2703@",
        passwordConfirm: "Haolatui2703@",
        role: "admin",
      });

      const reviewToDelete = await Review.create({
        product: testProduct._id,
        user: testUser._id,
        review: "Admin will delete this",
        rating: 5,
      });

      req.user = { id: adminUser._id, role: "admin" };
      req.params.id = reviewToDelete._id.toString();

      await reviewController.deleteReview(req, res, next);

      expect(res.status).toHaveBeenCalledWith(204);

      await User.deleteMany({ _id: adminUser._id });
    });

    it("REV-018: nên fail khi user không phải owner cố xóa", async () => {
      const reviewOwner = await User.create({
        name: "Review Owner Delete",
        email: "reviewownerdelete@example.com",
        password: "Haolatui2703@",
        passwordConfirm: "Haolatui2703@",
        role: "user",
      });

      const otherUser = await User.create({
        name: "Other User Delete",
        email: "otheruserdelete@example.com",
        password: "Haolatui2703@",
        passwordConfirm: "Haolatui2703@",
        role: "user",
      });

      const reviewToDelete = await Review.create({
        product: testProduct._id,
        user: reviewOwner._id,
        review: "Protected review",
        rating: 5,
      });

      req.user = { id: otherUser._id, role: "user" };
      req.params.id = reviewToDelete._id.toString();

      await reviewController.isOwner(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining("Bạn không có quyền"),
        })
      );

      await Review.deleteMany({ _id: reviewToDelete._id });
      await User.deleteMany({ _id: { $in: [reviewOwner._id, otherUser._id] } });
    });
  });
});
