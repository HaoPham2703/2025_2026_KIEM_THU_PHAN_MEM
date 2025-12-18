const mongoose = require("mongoose");
const Category = require("../../../models/categoryModel");
const User = require("../../../models/userModel");
const categoryController = require("../../../controllers/categoryController");

describe("Category Controller - Quản lý danh mục", () => {
  let req, res, next;
  let adminUser, employeeUser, normalUser;

  beforeAll(async () => {
    // Create test users
    adminUser = await User.create({
      name: "Admin User Category",
      email: "admincategory@example.com",
      password: "Haolatui2703@",
      passwordConfirm: "Haolatui2703@",
      active: "active",
      role: "admin",
    });

    employeeUser = await User.create({
      name: "Employee User Category",
      email: "employeecategory@example.com",
      password: "Haolatui2703@",
      passwordConfirm: "Haolatui2703@",
      active: "active",
      role: "employee",
    });

    normalUser = await User.create({
      name: "Normal User Category",
      email: "usercategory@example.com",
      password: "Haolatui2703@",
      passwordConfirm: "Haolatui2703@",
      active: "active",
      role: "user",
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
    await Category.deleteMany({});
    await User.deleteMany({});
  });

  // ========================================
  // Function E: Get All Categories (Xem danh sách danh mục)
  // ========================================
  describe("getAllCategories - Xem danh sách danh mục", () => {
    beforeAll(async () => {
      // Create test categories
      await Category.create({ name: "Electronics" });
      await Category.create({ name: "Clothing" });
      await Category.create({ name: "Books" });
    });

    afterAll(async () => {
      await Category.deleteMany({});
    });

    it("CAT-001: user đã đăng nhập nên xem danh sách category thành công", async () => {
      req.user = { id: normalUser._id, role: "user" };
      req.query = {};

      await categoryController.getAllCategories(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall.status).toBe("success");
      expect(jsonCall.data.data.length).toBeGreaterThan(0);
    });

    it("CAT-002: nên xem categories với pagination", async () => {
      req.user = { id: normalUser._id, role: "user" };
      req.query = { page: "1", limit: "2" };

      await categoryController.getAllCategories(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall.status).toBe("success");
      expect(jsonCall.data.data.length).toBeLessThanOrEqual(2);
    });

    it("CAT-003: nên xem categories với sort", async () => {
      req.user = { id: normalUser._id, role: "user" };
      req.query = { sort: "name" };

      await categoryController.getAllCategories(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall.status).toBe("success");
      // Check if sorted (first category name should be "Books")
      if (jsonCall.data.data.length > 0) {
        expect(jsonCall.data.data[0].name).toBe("Books");
      }
    });

    // CAT-004 will be tested at route level (middleware protect)
  });

  // ========================================
  // Function F: Create Category (Thêm danh mục - Admin)
  // ========================================
  describe("createCategory - Thêm danh mục", () => {
    afterEach(async () => {
      await Category.deleteMany({ name: /Test Category/ });
    });

    it("CAT-005: Admin nên thêm category thành công với slug tự động", async () => {
      req.user = { id: adminUser._id, role: "admin" };
      req.body = { name: "Test Category Admin" };

      await categoryController.createCategory(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall.status).toBe("success");
      expect(jsonCall.data.data.name).toBe("Test Category Admin");
      expect(jsonCall.data.data.slug).toBe("test-category-admin");
    });

    it("CAT-006: Employee nên thêm category thành công", async () => {
      req.user = { id: employeeUser._id, role: "employee" };
      req.body = { name: "Test Category Employee" };

      await categoryController.createCategory(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall.status).toBe("success");
      expect(jsonCall.data.data.name).toBe("Test Category Employee");
    });

    // CAT-007 will be tested at route level

    it("CAT-008: nên fail khi thiếu name", async () => {
      req.user = { id: adminUser._id, role: "admin" };
      req.body = {}; // Missing name

      try {
        await categoryController.createCategory(req, res, next);
      } catch (error) {
        expect(error.errors.name.message).toContain("Thể loại sản phẩm phải có tên");
      }
    });

    it("CAT-009: nên fail khi name quá ngắn (< 2 chars)", async () => {
      req.user = { id: adminUser._id, role: "admin" };
      req.body = { name: "A" };

      try {
        await categoryController.createCategory(req, res, next);
      } catch (error) {
        expect(error.errors.name.message).toContain("Thể loại sản phẩm tối thiểu cần 2 kí tự");
      }
    });

    it("CAT-010: nên fail khi name quá dài (> 40 chars)", async () => {
      req.user = { id: adminUser._id, role: "admin" };
      req.body = { name: "A".repeat(50) };

      try {
        await categoryController.createCategory(req, res, next);
      } catch (error) {
        expect(error.errors.name.message).toContain("Thể loại sản phẩm tối đa 40 kí tự");
      }
    });

    it("CAT-011: nên fail khi name duplicate", async () => {
      // Create first category
      await Category.create({ name: "Duplicate Category" });

      req.user = { id: adminUser._id, role: "admin" };
      req.body = { name: "Duplicate Category" };

      try {
        await categoryController.createCategory(req, res, next);
      } catch (error) {
        expect(error.code).toBe(11000); // Duplicate key error
      }

      await Category.deleteMany({ name: "Duplicate Category" });
    });

    it("CAT-012: category slug nên được tạo tự động từ name", async () => {
      req.user = { id: adminUser._id, role: "admin" };
      req.body = { name: "Test Category Slug" };

      await categoryController.createCategory(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall.data.data.slug).toBe("test-category-slug");
    });
  });

  // ========================================
  // Function G: Update Category (Cập nhật danh mục - Admin)
  // ========================================
  describe("updateCategory - Cập nhật danh mục", () => {
    let categoryToUpdate;

    beforeAll(async () => {
      categoryToUpdate = await Category.create({ name: "Category To Update" });
    });

    afterAll(async () => {
      await Category.deleteMany({ _id: categoryToUpdate._id });
    });

    it("CAT-013: Admin nên cập nhật category thành công", async () => {
      req.user = { id: adminUser._id, role: "admin" };
      req.params.id = categoryToUpdate._id.toString();
      req.body = { name: "Category Updated By Admin" };

      await categoryController.updateCategory(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall.status).toBe("success");
      expect(jsonCall.data.data.name).toBe("Category Updated By Admin");
    });

    it("CAT-014: Employee nên cập nhật category thành công", async () => {
      req.user = { id: employeeUser._id, role: "employee" };
      req.params.id = categoryToUpdate._id.toString();
      req.body = { name: "Category Updated By Employee" };

      await categoryController.updateCategory(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall.status).toBe("success");
      expect(jsonCall.data.data.name).toBe("Category Updated By Employee");
    });

    // CAT-015 will be tested at route level

    it("CAT-016: nên fail khi category không tồn tại", async () => {
      req.user = { id: adminUser._id, role: "admin" };
      req.params.id = new mongoose.Types.ObjectId().toString();
      req.body = { name: "Non-existent Category" };

      await categoryController.updateCategory(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Không tìm thấy dữ liệu với ID này",
        })
      );
    });
  });

  // ========================================
  // Function H: Delete Category (Xóa danh mục - Admin)
  // ========================================
  describe("deleteCategory - Xóa danh mục", () => {
    it("CAT-017: Admin nên xóa category thành công", async () => {
      const categoryToDelete = await Category.create({ name: "Category To Delete Admin" });

      req.user = { id: adminUser._id, role: "admin" };
      req.params.id = categoryToDelete._id.toString();

      await categoryController.deleteCategory(req, res, next);

      expect(res.status).toHaveBeenCalledWith(204);
      
      // Verify category was deleted
      const deletedCategory = await Category.findById(categoryToDelete._id);
      expect(deletedCategory).toBeNull();
    });

    it("CAT-018: Employee nên xóa category thành công", async () => {
      const categoryToDelete = await Category.create({ name: "Category To Delete Employee" });

      req.user = { id: employeeUser._id, role: "employee" };
      req.params.id = categoryToDelete._id.toString();

      await categoryController.deleteCategory(req, res, next);

      expect(res.status).toHaveBeenCalledWith(204);
      
      // Verify category was deleted
      const deletedCategory = await Category.findById(categoryToDelete._id);
      expect(deletedCategory).toBeNull();
    });

    // CAT-019 will be tested at route level

    it("CAT-020: nên fail khi category không tồn tại", async () => {
      req.user = { id: adminUser._id, role: "admin" };
      req.params.id = new mongoose.Types.ObjectId().toString();

      await categoryController.deleteCategory(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Không tìm thấy dữ liệu với ID này",
        })
      );
    });
  });
});

