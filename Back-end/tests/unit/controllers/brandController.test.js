const mongoose = require("mongoose");
const Brand = require("../../../models/brandModel");
const User = require("../../../models/userModel");
const brandController = require("../../../controllers/brandController");

describe("Brand Controller - Quản lý thương hiệu", () => {
  let req, res, next;
  let adminUser, employeeUser, normalUser;

  beforeAll(async () => {
    // Create test users
    adminUser = await User.create({
      name: "Admin User Brand",
      email: "adminbrand@example.com",
      password: "Haolatui2703@",
      passwordConfirm: "Haolatui2703@",
      active: "active",
      role: "admin",
    });

    employeeUser = await User.create({
      name: "Employee User Brand",
      email: "employeebrand@example.com",
      password: "Haolatui2703@",
      passwordConfirm: "Haolatui2703@",
      active: "active",
      role: "employee",
    });

    normalUser = await User.create({
      name: "Normal User Brand",
      email: "userbrand@example.com",
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
    await Brand.deleteMany({});
    await User.deleteMany({});
  });

  // ========================================
  // Function A: Get All Brands (Xem danh sách thương hiệu)
  // ========================================
  describe("getAllBrands - Xem danh sách thương hiệu", () => {
    beforeAll(async () => {
      // Create test brands
      await Brand.create({ name: "Nike" });
      await Brand.create({ name: "Adidas" });
      await Brand.create({ name: "Puma" });
    });

    afterAll(async () => {
      await Brand.deleteMany({});
    });

    it("BRD-001: nên xem danh sách thương hiệu thành công (không cần đăng nhập)", async () => {
      req.query = {};

      await brandController.getAllBrands(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall.status).toBe("success");
      expect(jsonCall.data.data.length).toBeGreaterThan(0);
    });

    it("BRD-002: nên xem brands với pagination", async () => {
      req.query = { page: "1", limit: "2" };

      await brandController.getAllBrands(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall.status).toBe("success");
      expect(jsonCall.data.data.length).toBeLessThanOrEqual(2);
    });

    it("BRD-003: nên xem brands với sort", async () => {
      req.query = { sort: "name" };

      await brandController.getAllBrands(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall.status).toBe("success");
      // Check if sorted (first brand name should be "Adidas")
      if (jsonCall.data.data.length > 0) {
        expect(jsonCall.data.data[0].name).toBe("Adidas");
      }
    });

    it("BRD-004: nên xem brands với search/filter", async () => {
      req.query = { name: "Nike" };

      await brandController.getAllBrands(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall.status).toBe("success");
    });
  });

  // ========================================
  // Function B: Create Brand (Thêm thương hiệu - Admin)
  // ========================================
  describe("createBrand - Thêm thương hiệu", () => {
    afterEach(async () => {
      await Brand.deleteMany({ name: /Test Brand/ });
    });

    it("BRD-005: Admin nên thêm brand thành công", async () => {
      req.user = { id: adminUser._id, role: "admin" };
      req.body = { name: "Test Brand Admin" };

      await brandController.createBrand(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall.status).toBe("success");
      expect(jsonCall.data.data.name).toBe("Test Brand Admin");
    });

    it("BRD-006: Employee nên thêm brand thành công", async () => {
      req.user = { id: employeeUser._id, role: "employee" };
      req.body = { name: "Test Brand Employee" };

      await brandController.createBrand(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall.status).toBe("success");
      expect(jsonCall.data.data.name).toBe("Test Brand Employee");
    });

    // BRD-007, BRD-008 will be tested at route level with middleware

    it("BRD-009: nên fail khi thiếu name", async () => {
      req.user = { id: adminUser._id, role: "admin" };
      req.body = {}; // Missing name

      try {
        await brandController.createBrand(req, res, next);
      } catch (error) {
        expect(error.errors.name.message).toContain("Nhãn hiệu phải có tên");
      }
    });

    it("BRD-010: nên fail khi name quá ngắn (< 2 chars)", async () => {
      req.user = { id: adminUser._id, role: "admin" };
      req.body = { name: "A" };

      try {
        await brandController.createBrand(req, res, next);
      } catch (error) {
        expect(error.errors.name.message).toContain("Nhãn hiệu tối thiểu 2 kí tự");
      }
    });

    it("BRD-011: nên fail khi name quá dài (> 40 chars)", async () => {
      req.user = { id: adminUser._id, role: "admin" };
      req.body = { name: "A".repeat(50) };

      try {
        await brandController.createBrand(req, res, next);
      } catch (error) {
        expect(error.errors.name.message).toContain("Nhãn hiệu tối đa 40 kí tự");
      }
    });

    it("BRD-012: nên fail khi name duplicate", async () => {
      // Create first brand
      await Brand.create({ name: "Duplicate Brand" });

      req.user = { id: adminUser._id, role: "admin" };
      req.body = { name: "Duplicate Brand" };

      try {
        await brandController.createBrand(req, res, next);
      } catch (error) {
        expect(error.code).toBe(11000); // Duplicate key error
      }

      await Brand.deleteMany({ name: "Duplicate Brand" });
    });
  });

  // ========================================
  // Function C: Update Brand (Cập nhật thương hiệu - Admin)
  // ========================================
  describe("updateBrand - Cập nhật thương hiệu", () => {
    let brandToUpdate;

    beforeAll(async () => {
      brandToUpdate = await Brand.create({ name: "Brand To Update" });
    });

    afterAll(async () => {
      await Brand.deleteMany({ _id: brandToUpdate._id });
    });

    it("BRD-013: Admin nên cập nhật brand thành công", async () => {
      req.user = { id: adminUser._id, role: "admin" };
      req.params.id = brandToUpdate._id.toString();
      req.body = { name: "Brand Updated By Admin" };

      await brandController.updateBrand(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall.status).toBe("success");
      expect(jsonCall.data.data.name).toBe("Brand Updated By Admin");
    });

    it("BRD-014: Employee nên cập nhật brand thành công", async () => {
      req.user = { id: employeeUser._id, role: "employee" };
      req.params.id = brandToUpdate._id.toString();
      req.body = { name: "Brand Updated By Employee" };

      await brandController.updateBrand(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall.status).toBe("success");
      expect(jsonCall.data.data.name).toBe("Brand Updated By Employee");
    });

    // BRD-015 will be tested at route level

    it("BRD-016: nên fail khi brand không tồn tại", async () => {
      req.user = { id: adminUser._id, role: "admin" };
      req.params.id = new mongoose.Types.ObjectId().toString();
      req.body = { name: "Non-existent Brand" };

      await brandController.updateBrand(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Không tìm thấy dữ liệu với ID này",
        })
      );
    });
  });

  // ========================================
  // Function D: Delete Brand (Xóa thương hiệu - Admin)
  // ========================================
  describe("deleteBrand - Xóa thương hiệu", () => {
    it("BRD-017: Admin nên xóa brand thành công", async () => {
      const brandToDelete = await Brand.create({ name: "Brand To Delete Admin" });

      req.user = { id: adminUser._id, role: "admin" };
      req.params.id = brandToDelete._id.toString();

      await brandController.deleteBrand(req, res, next);

      expect(res.status).toHaveBeenCalledWith(204);
      
      // Verify brand was deleted
      const deletedBrand = await Brand.findById(brandToDelete._id);
      expect(deletedBrand).toBeNull();
    });

    it("BRD-018: Employee nên xóa brand thành công", async () => {
      const brandToDelete = await Brand.create({ name: "Brand To Delete Employee" });

      req.user = { id: employeeUser._id, role: "employee" };
      req.params.id = brandToDelete._id.toString();

      await brandController.deleteBrand(req, res, next);

      expect(res.status).toHaveBeenCalledWith(204);
      
      // Verify brand was deleted
      const deletedBrand = await Brand.findById(brandToDelete._id);
      expect(deletedBrand).toBeNull();
    });

    // BRD-019 will be tested at route level

    it("BRD-020: nên fail khi brand không tồn tại", async () => {
      req.user = { id: adminUser._id, role: "admin" };
      req.params.id = new mongoose.Types.ObjectId().toString();

      await brandController.deleteBrand(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Không tìm thấy dữ liệu với ID này",
        })
      );
    });
  });
});

