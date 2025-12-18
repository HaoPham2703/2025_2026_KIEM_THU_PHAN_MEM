const mongoose = require("mongoose");
const Comment = require("../../../models/commentModel");
const Product = require("../../../models/productModel");
const User = require("../../../models/userModel");
const commentController = require("../../../controllers/commentController");
const AppError = require("../../../utils/appError");

describe("Comment Controller - Bình luận sản phẩm", () => {
  let req, res, next;
  let testUser, adminUser, testProduct, testComment;

  beforeAll(async () => {
    // Create test product
    testProduct = await Product.create({
      title: "Test Product for Comment",
      slug: "test-product-comment",
      description: "Test product description for comment testing",
      price: 150000,
      promotion: 120000,
      inventory: 50,
      sold: 0,
      category: new mongoose.Types.ObjectId(),
      brand: new mongoose.Types.ObjectId(),
      images: ["test-image.jpg"],
      weight: 300,
    });

    // Create test users
    testUser = await User.create({
      name: "Test User Comment",
      email: "testcomment@example.com",
      password: "Haolatui2703@",
      passwordConfirm: "Haolatui2703@",
      active: "active",
      role: "user",
    });

    adminUser = await User.create({
      name: "Admin User Comment",
      email: "admincomment@example.com",
      password: "Haolatui2703@",
      passwordConfirm: "Haolatui2703@",
      active: "active",
      role: "admin",
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
    await Comment.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});
  });

  // ========================================
  // Function E: Get All Comments (Xem bình luận sản phẩm)
  // ========================================
  describe("getAllComments - Xem danh sách bình luận", () => {
    beforeAll(async () => {
      // Create test comment
      testComment = await Comment.create({
        product: testProduct._id,
        user: testUser._id,
        comment: "Great product!",
      });
    });

    afterAll(async () => {
      await Comment.deleteMany({});
    });

    it("COM-001: nên xem danh sách bình luận của sản phẩm thành công", async () => {
      req.params.productId = testProduct._id.toString();

      await commentController.getAllComments(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall.status).toBe("success");
      expect(jsonCall.data.data.length).toBeGreaterThan(0);
    });

    it("COM-002: nên xem comments của sản phẩm không tồn tại (return empty)", async () => {
      req.params.productId = new mongoose.Types.ObjectId().toString();

      await commentController.getAllComments(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall.status).toBe("success");
      expect(jsonCall.data.data.length).toBe(0);
    });
  });

  // ========================================
  // Function F: Create Comment (Tạo bình luận)
  // ========================================
  describe("createComment - Tạo bình luận", () => {
    afterEach(async () => {
      await Comment.deleteMany({ product: testProduct._id, comment: /Test comment/ });
    });

    it("COM-003: nên tạo comment thành công bởi user", async () => {
      req.user = { id: testUser._id, role: "user" };
      req.body = {
        product: testProduct._id,
        user: testUser._id,
        comment: "Test comment by user",
      };

      await commentController.setProductUserIds(req, res, next);
      expect(next).toHaveBeenCalled();

      await commentController.createComment(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall.status).toBe("success");
      expect(jsonCall.data.data.comment).toBe("Test comment by user");
    });

    it("COM-004: nên cho phép Admin/Employee tạo comment", async () => {
      req.user = { id: adminUser._id, role: "admin" };
      req.body = {
        product: testProduct._id,
        user: adminUser._id,
        comment: "Test comment by admin",
      };

      await commentController.setProductUserIds(req, res, next);
      expect(next).toHaveBeenCalled();

      await commentController.createComment(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall.status).toBe("success");
      expect(jsonCall.data.data.comment).toBe("Test comment by admin");
    });

    it("COM-005: nên fail khi thiếu comment text", async () => {
      req.user = { id: testUser._id };
      req.body = {
        product: testProduct._id,
        user: testUser._id,
        // comment missing
      };

      try {
        await commentController.createComment(req, res, next);
      } catch (error) {
        expect(error.errors.comment.message).toContain("Bình luận không thể để trống!");
      }
    });

    it("COM-006: nên tạo reply comment (parent comment) thành công", async () => {
      // Create parent comment first
      const parentComment = await Comment.create({
        product: testProduct._id,
        user: testUser._id,
        comment: "Parent comment",
      });

      req.user = { id: adminUser._id };
      req.body = {
        product: testProduct._id,
        user: adminUser._id,
        comment: "Reply to parent comment",
        parent: parentComment._id,
      };

      await commentController.setProductUserIds(req, res, next);
      await commentController.createComment(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall.status).toBe("success");
      expect(jsonCall.data.data.parent).toEqual(parentComment._id);

      // Verify parent comment has child
      const updatedParent = await Comment.findById(parentComment._id);
      expect(updatedParent.children.length).toBeGreaterThan(0);

      await Comment.deleteMany({ _id: { $in: [parentComment._id, jsonCall.data.data._id] } });
    });
  });

  // ========================================
  // Function G: Update Comment (Cập nhật bình luận)
  // ========================================
  describe("updateComment - Cập nhật bình luận", () => {
    let commentToUpdate, commentOwner;

    beforeAll(async () => {
      commentOwner = await User.create({
        name: "Comment Owner",
        email: "commentowner@example.com",
        password: "Haolatui2703@",
        passwordConfirm: "Haolatui2703@",
        role: "user",
      });

      commentToUpdate = await Comment.create({
        product: testProduct._id,
        user: commentOwner._id,
        comment: "Original comment",
      });
    });

    afterAll(async () => {
      await Comment.deleteMany({ _id: commentToUpdate._id });
      await User.deleteMany({ _id: commentOwner._id });
    });

    it("COM-007: nên cập nhật comment thành công bởi owner", async () => {
      req.user = { id: commentOwner._id, role: "user" };
      req.params.id = commentToUpdate._id.toString();
      req.body = {
        comment: "Updated comment text",
      };

      await commentController.updateComment(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall.status).toBe("success");
      expect(jsonCall.data.data.comment).toBe("Updated comment text");
    });

    it("COM-008: nên fail khi user không phải owner cố update", async () => {
      const otherUser = await User.create({
        name: "Other User Comment",
        email: "otherusercomment@example.com",
        password: "Haolatui2703@",
        passwordConfirm: "Haolatui2703@",
        role: "user",
      });

      req.user = { id: otherUser._id, role: "user" };
      req.params.id = commentToUpdate._id.toString();
      req.body = {
        comment: "Hacker trying to update",
      };

      await commentController.isOwner(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining("Bạn không có quyền"),
        })
      );

      await User.deleteMany({ _id: otherUser._id });
    });
  });

  // ========================================
  // Function H: Delete Comment (Xóa bình luận)
  // ========================================
  describe("deleteComment - Xóa bình luận", () => {
    it("COM-009: nên xóa comment thành công bởi owner", async () => {
      const deleteOwner = await User.create({
        name: "Delete Owner Comment",
        email: "deleteownercomment@example.com",
        password: "Haolatui2703@",
        passwordConfirm: "Haolatui2703@",
        role: "user",
      });

      const commentToDelete = await Comment.create({
        product: testProduct._id,
        user: deleteOwner._id,
        comment: "Will be deleted",
      });

      req.user = { id: deleteOwner._id, role: "user" };
      req.params.id = commentToDelete._id.toString();

      await commentController.deleteComment(req, res, next);

      expect(res.status).toHaveBeenCalledWith(204);

      await User.deleteMany({ _id: deleteOwner._id });
    });

    it("COM-010: nên cho phép Admin xóa comment", async () => {
      const commentToDelete = await Comment.create({
        product: testProduct._id,
        user: testUser._id,
        comment: "Admin will delete this",
      });

      req.user = { id: adminUser._id, role: "admin" };
      req.params.id = commentToDelete._id.toString();

      await commentController.deleteComment(req, res, next);

      expect(res.status).toHaveBeenCalledWith(204);
    });

    it("COM-011: nên fail khi user không phải owner cố xóa", async () => {
      const commentOwner = await User.create({
        name: "Comment Owner Delete",
        email: "commentownerdelete@example.com",
        password: "Haolatui2703@",
        passwordConfirm: "Haolatui2703@",
        role: "user",
      });

      const otherUser = await User.create({
        name: "Other User Delete Comment",
        email: "otheruserdeletecomment@example.com",
        password: "Haolatui2703@",
        passwordConfirm: "Haolatui2703@",
        role: "user",
      });

      const commentToDelete = await Comment.create({
        product: testProduct._id,
        user: commentOwner._id,
        comment: "Protected comment",
      });

      req.user = { id: otherUser._id, role: "user" };
      req.params.id = commentToDelete._id.toString();

      await commentController.isOwner(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining("Bạn không có quyền"),
        })
      );

      await Comment.deleteMany({ _id: commentToDelete._id });
      await User.deleteMany({ _id: { $in: [commentOwner._id, otherUser._id] } });
    });
  });

  // ========================================
  // Function I: Like/Unlike Comment (Like bình luận)
  // ========================================
  describe("likeComment - Like/Unlike bình luận", () => {
    let commentForLike, userForLike;

    beforeAll(async () => {
      userForLike = await User.create({
        name: "User For Like",
        email: "userforlike@example.com",
        password: "Haolatui2703@",
        passwordConfirm: "Haolatui2703@",
        role: "user",
      });

      commentForLike = await Comment.create({
        product: testProduct._id,
        user: testUser._id,
        comment: "Comment for like test",
        like: [],
      });
    });

    afterAll(async () => {
      await Comment.deleteMany({ _id: commentForLike._id });
      await User.deleteMany({ _id: userForLike._id });
    });

    it("COM-012: nên like comment thành công (first time)", async () => {
      req.user = { id: userForLike._id };
      req.params.id = commentForLike._id.toString();

      await commentController.likeComment(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall.status).toBe("success");
      expect(jsonCall.message).toBe("Cập nhật like thành công");
      expect(jsonCall.data.data.like).toContain(userForLike._id.toString());
    });

    it("COM-013: nên unlike comment (toggle off)", async () => {
      // User already liked in previous test
      // Like again to unlike
      req.user = { id: userForLike._id };
      req.params.id = commentForLike._id.toString();

      await commentController.likeComment(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall.status).toBe("success");
      // User ID should be removed
      expect(jsonCall.data.data.like).not.toContain(userForLike._id.toString());
    });

    it("COM-014: nên fail khi comment không tồn tại", async () => {
      req.user = { id: userForLike._id };
      req.params.id = new mongoose.Types.ObjectId().toString();

      await commentController.likeComment(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Không tìm thấy comment này",
        })
      );
    });
  });
});

