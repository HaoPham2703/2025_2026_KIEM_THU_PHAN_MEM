const mongoose = require("mongoose");
const Import = require("../../../models/importModel");
const User = require("../../../models/userModel");
const importController = require("../../../controllers/importController");

describe("Import Controller - Quản lý phiếu nhập hàng", () => {
  let req, res, next;
  let adminUser, employeeUser, normalUser;

  beforeAll(async () => {
    // Create test users
    adminUser = await User.create({
      name: "Admin User Import",
      email: "adminimport@example.com",
      password: "Haolatui2703@",
      passwordConfirm: "Haolatui2703@",
      active: "active",
      role: "admin",
    });

    employeeUser = await User.create({
      name: "Employee User Import",
      email: "employeeimport@example.com",
      password: "Haolatui2703@",
      passwordConfirm: "Haolatui2703@",
      active: "active",
      role: "employee",
    });

    normalUser = await User.create({
      name: "Normal User Import",
      email: "userimport@example.com",
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
    await Import.deleteMany({});
    await User.deleteMany({});
  });

  // ========================================
  // Function A: Get All Imports (Xem danh sách phiếu nhập)
  // ========================================
  describe("getAllImports - Xem danh sách phiếu nhập", () => {
    beforeAll(async () => {
      // Create test imports
      await Import.create({
        user: adminUser._id,
        invoice: [{ product: "prod1", title: "Product 1", quantity: 10, price: 100000 }],
        totalPrice: 1000000,
      });
      await Import.create({
        user: employeeUser._id,
        invoice: [{ product: "prod2", title: "Product 2", quantity: 5, price: 200000 }],
        totalPrice: 1000000,
      });
    });

    afterAll(async () => {
      await Import.deleteMany({});
    });

    it("IMP-001: Admin nên xem danh sách phiếu nhập thành công", async () => {
      req.user = { id: adminUser._id, role: "admin" };
      req.query = {};

      await importController.getAllImports(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall.status).toBe("success");
      expect(jsonCall.data.data.length).toBeGreaterThan(0);
    });

    it("IMP-002: Employee nên xem danh sách phiếu nhập thành công", async () => {
      req.user = { id: employeeUser._id, role: "employee" };
      req.query = {};

      await importController.getAllImports(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall.status).toBe("success");
    });

    it("IMP-003: nên xem imports với pagination", async () => {
      req.user = { id: adminUser._id, role: "admin" };
      req.query = { page: "1", limit: "1" };

      await importController.getAllImports(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall.data.data.length).toBeLessThanOrEqual(1);
    });

    // IMP-004 will be tested at route level
  });

  // ========================================
  // Function B: Create Import (Tạo phiếu nhập hàng)
  // ========================================
  describe("createImport - Tạo phiếu nhập hàng", () => {
    afterEach(async () => {
      await Import.deleteMany({ totalPrice: { $in: [1500000, 800000] } });
    });

    it("IMP-005: Admin nên tạo phiếu nhập thành công", async () => {
      req.user = adminUser;
      req.body = {
        invoice: JSON.stringify([
          { product: "prod3", title: "Product 3", quantity: 10, price: 150000 },
        ]),
        totalPrice: 1500000,
      };

      // Call setImporter middleware first
      await importController.setImporter(req, res, next);

      // Then create import
      await importController.createImport(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall.status).toBe("success");
      expect(jsonCall.data.data.user).toBeDefined();
      expect(jsonCall.data.data.totalPrice).toBe(1500000);
    });

    it("IMP-006: Employee nên tạo phiếu nhập thành công", async () => {
      req.user = employeeUser;
      req.body = {
        invoice: JSON.stringify([
          { product: "prod4", title: "Product 4", quantity: 4, price: 200000 },
        ]),
        totalPrice: 800000,
      };

      await importController.setImporter(req, res, next);
      await importController.createImport(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall.data.data.user).toBeDefined();
    });

    // IMP-007, IMP-008 will be tested at route level

    it("IMP-009: nên tạo import với invoice hợp lệ (JSON parse)", async () => {
      req.user = adminUser;
      const invoiceData = [
        { product: "prod5", title: "Product 5", quantity: 2, price: 400000 },
      ];
      req.body = {
        invoice: JSON.stringify(invoiceData),
        totalPrice: 800000,
      };

      await importController.setImporter(req, res, next);

      // Check invoice was parsed
      expect(req.body.invoice).toEqual(invoiceData);
      expect(req.body.user).toEqual(adminUser);

      await importController.createImport(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  // ========================================
  // Function C: Update Import (Cập nhật phiếu nhập)
  // ========================================
  describe("updateImport - Cập nhật phiếu nhập", () => {
    let importToUpdate;

    beforeEach(async () => {
      importToUpdate = await Import.create({
        user: adminUser._id,
        invoice: [{ product: "prod6", title: "Product 6", quantity: 5, price: 100000 }],
        totalPrice: 500000,
      });
    });

    afterEach(async () => {
      if (importToUpdate) {
        await Import.deleteMany({ _id: importToUpdate._id });
      }
    });

    it("IMP-010: Admin nên cập nhật phiếu nhập thành công", async () => {
      req.user = { id: adminUser._id, role: "admin" };
      req.params.id = importToUpdate._id.toString();
      req.body = { totalPrice: 600000 };

      await importController.updateImport(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall.status).toBe("success");
      expect(jsonCall.data.data.totalPrice).toBe(600000);
    });

    it("IMP-011: Employee nên cập nhật phiếu nhập thành công", async () => {
      req.user = { id: employeeUser._id, role: "employee" };
      req.params.id = importToUpdate._id.toString();
      req.body = { totalPrice: 550000 };

      await importController.updateImport(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall.data.data.totalPrice).toBe(550000);
    });

    // IMP-012 will be tested at route level

    it("IMP-013: nên fail khi import không tồn tại", async () => {
      req.user = { id: adminUser._id, role: "admin" };
      req.params.id = new mongoose.Types.ObjectId().toString();
      req.body = { totalPrice: 700000 };

      await importController.updateImport(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Không tìm thấy dữ liệu với ID này",
        })
      );
    });
  });

  // ========================================
  // Function D: Delete Import (Xóa phiếu nhập)
  // ========================================
  describe("deleteImport - Xóa phiếu nhập", () => {
    it("IMP-014: Admin nên xóa phiếu nhập thành công", async () => {
      const importToDelete = await Import.create({
        user: adminUser._id,
        invoice: [{ product: "prod7", title: "Product 7", quantity: 3, price: 100000 }],
        totalPrice: 300000,
      });

      req.user = { id: adminUser._id, role: "admin" };
      req.params.id = importToDelete._id.toString();

      await importController.deleteImport(req, res, next);

      expect(res.status).toHaveBeenCalledWith(204);

      // Verify import was deleted
      const deletedImport = await Import.findById(importToDelete._id);
      expect(deletedImport).toBeNull();
    });

    it("IMP-015: Employee nên xóa phiếu nhập thành công", async () => {
      const importToDelete = await Import.create({
        user: employeeUser._id,
        invoice: [{ product: "prod8", title: "Product 8", quantity: 2, price: 150000 }],
        totalPrice: 300000,
      });

      req.user = { id: employeeUser._id, role: "employee" };
      req.params.id = importToDelete._id.toString();

      await importController.deleteImport(req, res, next);

      expect(res.status).toHaveBeenCalledWith(204);

      const deletedImport = await Import.findById(importToDelete._id);
      expect(deletedImport).toBeNull();
    });

    // IMP-016 will be tested at route level

    it("IMP-017: nên fail khi import không tồn tại", async () => {
      req.user = { id: adminUser._id, role: "admin" };
      req.params.id = new mongoose.Types.ObjectId().toString();

      await importController.deleteImport(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Không tìm thấy dữ liệu với ID này",
        })
      );
    });
  });

  // ========================================
  // Function E: Statistics (Thống kê nhập hàng)
  // ========================================
  describe("Import Statistics - Thống kê nhập hàng", () => {
    beforeAll(async () => {
      // Create imports for statistics
      const now = new Date();
      await Import.create({
        user: adminUser._id,
        invoice: [{ product: "stat1", title: "Stat Product 1", quantity: 10, price: 100000 }],
        totalPrice: 1000000,
        createdAt: new Date(now.getFullYear(), now.getMonth(), 1),
      });
      await Import.create({
        user: adminUser._id,
        invoice: [{ product: "stat2", title: "Stat Product 2", quantity: 5, price: 200000 }],
        totalPrice: 1000000,
        createdAt: new Date(now.getFullYear(), now.getMonth(), 15),
      });
    });

    afterAll(async () => {
      await Import.deleteMany({ invoice: { $elemMatch: { product: /^stat/ } } });
    });

    it("IMP-018: Admin nên xem thống kê tổng chi phí theo tháng", async () => {
      req.user = { id: adminUser._id, role: "admin" };

      await importController.sumImport(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
      const jsonCall = res.json.mock.calls[0][0];
      expect(Array.isArray(jsonCall)).toBe(true);
      if (jsonCall.length > 0) {
        expect(jsonCall[0]).toHaveProperty("_id");
        expect(jsonCall[0]).toHaveProperty("total_month");
      }
    });

    it("IMP-019: Admin nên xem thống kê với option (year, month)", async () => {
      req.user = { id: adminUser._id, role: "admin" };
      req.body = { year: true, month: true };

      await importController.sumOption(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
      const jsonCall = res.json.mock.calls[0][0];
      expect(Array.isArray(jsonCall)).toBe(true);
    });

    it("IMP-020: Admin nên xem thống kê trong khoảng thời gian", async () => {
      req.user = { id: adminUser._id, role: "admin" };
      const now = new Date();
      req.body = {
        dateFrom: new Date(now.getFullYear(), 0, 1).toISOString(), // Jan 1
        dateTo: new Date(now.getFullYear(), 11, 31).toISOString(), // Dec 31
      };

      await importController.sumInRange(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
      const jsonCall = res.json.mock.calls[0][0];
      expect(Array.isArray(jsonCall)).toBe(true);
      if (jsonCall.length > 0) {
        expect(jsonCall[0]).toHaveProperty("total");
      }
    });
  });
});

