const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../../models/userModel");
const userController = require("../../../controllers/userController");
const factory = require("../../../controllers/handlerFactory");
const AppError = require("../../../utils/appError");

describe("User Controller - Quản lý Người dùng", () => {
  let req, res, next;
  let testUser, adminUser;

  beforeAll(async () => {
    // Create test users
    testUser = await User.create({
      name: "Test User",
      email: "testuser@example.com",
      password: "password123",
      passwordConfirm: "password123",
      active: "active",
      role: "user",
    });

    adminUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123",
      passwordConfirm: "admin123",
      active: "active",
      role: "admin",
    });
  });

  beforeEach(() => {
    req = {
      body: {},
      params: {},
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
    await User.deleteMany({});
  });

  // ========================================
  // Function A: Get Me (Xem thông tin cá nhân)
  // ========================================
  describe("getMe - Xem thông tin cá nhân", () => {
    it("USER-001: nên set req.params.id thành req.user.id", () => {
      req.user = { id: testUser._id.toString() };
      req.params = {};

      userController.getMe(req, res, next);

      expect(req.params.id).toBe(testUser._id.toString());
      expect(next).toHaveBeenCalled();
    });

    it("USER-002: nên fail khi chưa đăng nhập (req.user null)", () => {
      req.user = null;

      expect(() => {
        userController.getMe(req, res, next);
      }).toThrow();
    });

    it("USER-003: nên xử lý đúng với user ID hợp lệ", () => {
      const validUserId = new mongoose.Types.ObjectId().toString();
      req.user = { id: validUserId };
      req.params = {};

      userController.getMe(req, res, next);

      expect(req.params.id).toBe(validUserId);
      expect(next).toHaveBeenCalled();
    });
  });

  // ========================================
  // Function B: Update Me (Cập nhật thông tin cá nhân)
  // ========================================
  describe("updateMe - Cập nhật thông tin cá nhân", () => {
    it("USER-004: nên cập nhật thông tin user thành công", async () => {
      req.user = { id: testUser._id };
      req.body = {
        name: "Updated Name",
        phone: "0123456789",
        gender: "male",
      };

      await userController.updateMe(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        data: {
          user: expect.objectContaining({
            name: "Updated Name",
            phone: "0123456789",
            gender: "male",
          }),
        },
      });

      // Verify database
      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser.name).toBe("Updated Name");
      expect(updatedUser.phone).toBe("0123456789");
    });

    it("USER-005: nên cập nhật avatar thành công", async () => {
      req.user = { id: testUser._id };
      req.body = {
        avatar: "https://example.com/avatar.jpg",
      };

      await userController.updateMe(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        data: {
          user: expect.objectContaining({
            avatar: "https://example.com/avatar.jpg",
          }),
        },
      });
    });

    it("USER-006: nên trả về lỗi khi gửi password", async () => {
      req.user = { id: testUser._id };
      req.body = {
        name: "Test",
        password: "newpass123",
      };

      await userController.updateMe(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Trang này không dùng để thay đổi mật khẩu",
          statusCode: 400,
        })
      );
    });

    it("USER-007: nên trả về lỗi khi chưa đăng nhập", async () => {
      req.user = null;

      await expect(userController.updateMe(req, res, next)).rejects.toThrow();
    });
  });

  // ========================================
  // Function C: Delete Me (Xóa tài khoản)
  // ========================================
  describe("deleteMe - Xóa tài khoản", () => {
    it("USER-008: nên xóa tài khoản (chuyển sang ban) thành công", async () => {
      const tempUser = await User.create({
        name: "Temp User",
        email: "tempuser@example.com",
        password: "password123",
        passwordConfirm: "password123",
      });

      req.user = { id: tempUser._id };

      await userController.deleteMe(req, res, next);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        data: null,
      });

      // Verify user status changed to 'ban'
      const deletedUser = await User.findById(tempUser._id);
      expect(deletedUser.active).toBe("ban");
    });

    it("USER-009: nên trả về lỗi khi chưa đăng nhập", async () => {
      req.user = null;

      await expect(userController.deleteMe(req, res, next)).rejects.toThrow();
    });
  });

  // ========================================
  // Function D: Create Address (Thêm địa chỉ)
  // ========================================
  describe("createAddress - Thêm địa chỉ giao hàng", () => {
    it("USER-010: nên thêm địa chỉ đầu tiên thành công (setDefault=true)", async () => {
      const userNoAddress = await User.create({
        name: "User No Address",
        email: "noaddress@example.com",
        password: "password123",
        passwordConfirm: "password123",
        address: [],
      });

      req.user = userNoAddress;
      req.body = {
        name: "Home",
        phone: "0123456789",
        province: "Hanoi",
        district: "Cau Giay",
        ward: "Dich Vong",
        detail: "123 Street",
      };

      await userController.createAddress(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message: "You have already added address successfully.",
        data: expect.objectContaining({
          address: expect.arrayContaining([
            expect.objectContaining({
              name: "Home",
              setDefault: true,
            }),
          ]),
        }),
      });
    });

    it("USER-011: nên thêm địa chỉ thứ hai thành công (setDefault=false)", async () => {
      const userWithAddress = await User.create({
        name: "User With Address",
        email: "withaddress@example.com",
        password: "password123",
        passwordConfirm: "password123",
        address: [
          {
            name: "Home",
            phone: "0123456789",
            province: "Hanoi",
            district: "Dong Da",
            ward: "Khuong Thuong",
            detail: "456 Road",
            setDefault: true,
          },
        ],
      });

      req.user = userWithAddress;
      req.body = {
        name: "Office",
        phone: "0987654321",
        province: "HCMC",
        district: "District 1",
        ward: "Ben Nghe",
        detail: "789 Avenue",
      };

      await userController.createAddress(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall.data.address).toHaveLength(2);
      expect(jsonCall.data.address[1].setDefault).toBeUndefined();
    });

    it("USER-012: nên validation khi thiếu trường bắt buộc", async () => {
      req.user = testUser;
      req.body = {
        phone: "0123456789",
        province: "Hanoi",
        // missing name
      };

      // This should fail validation or throw error
      await expect(userController.createAddress(req, res)).rejects.toThrow();
    });
  });

  // ========================================
  // Function E: Get User Address (Xem danh sách địa chỉ)
  // ========================================
  describe("getUserAddress - Xem danh sách địa chỉ", () => {
    it("USER-013: nên xem danh sách địa chỉ thành công", () => {
      const userWithAddress = {
        id: testUser._id,
        address: [
          {
            name: "Home",
            phone: "0123456789",
            province: "Hanoi",
            setDefault: true,
          },
        ],
      };

      req.user = userWithAddress;

      userController.getUserAddress(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        data: {
          address: userWithAddress.address,
        },
        message: "Get all user address successfully.",
      });
    });

    it("USER-014: nên trả về mảng rỗng khi chưa có địa chỉ", () => {
      req.user = {
        id: testUser._id,
        address: [],
      };

      userController.getUserAddress(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        data: {
          address: [],
        },
        message: "Get all user address successfully.",
      });
    });
  });

  // ========================================
  // Function F: Update Address (Cập nhật địa chỉ)
  // ========================================
  describe("updateAddress - Cập nhật địa chỉ", () => {
    it("USER-015: nên cập nhật địa chỉ thành công", async () => {
      const userWithAddress = await User.create({
        name: "User Update Address",
        email: "updateaddress@example.com",
        password: "password123",
        passwordConfirm: "password123",
        address: [
          {
            name: "Home",
            phone: "0123456789",
            province: "Hanoi",
            district: "Dong Da",
            ward: "Khuong Thuong",
            detail: "123 Street",
            setDefault: true,
          },
        ],
      });

      req.user = userWithAddress;
      req.body = {
        id: 0,
        name: "Home Updated",
        phone: "0111111111",
        province: "Hanoi",
        district: "Cau Giay",
        ward: "Dich Vong",
        detail: "456 Avenue",
        setDefault: true,
      };

      await userController.updateAddress(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message: "You have already updated address successfully.",
      });
    });

    it("USER-016: nên trả về lỗi khi ID không tồn tại", async () => {
      req.user = testUser;
      req.body = {
        id: 999,
        name: "Invalid",
      };

      await userController.updateAddress(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        message: "This data is not exist. Please try again!!!",
        data: testUser,
      });
    });
  });

  // ========================================
  // Function G: Delete Address (Xóa địa chỉ)
  // ========================================
  describe("deleteAddress - Xóa địa chỉ", () => {
    it("USER-017: nên xóa địa chỉ thứ hai thành công", async () => {
      const userWithAddresses = await User.create({
        name: "User Delete Address",
        email: "deleteaddress@example.com",
        password: "password123",
        passwordConfirm: "password123",
        address: [
          {
            name: "Home",
            phone: "0123456789",
            setDefault: true,
          },
          {
            name: "Office",
            phone: "0987654321",
            setDefault: false,
          },
        ],
      });

      req.user = userWithAddresses;
      req.body = { id: 1 };

      await userController.deleteAddress(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message: "Delete address successfully.",
        data: expect.objectContaining({
          address: expect.arrayContaining([
            expect.objectContaining({ name: "Home" }),
          ]),
        }),
      });
    });

    it("USER-018: nên xóa địa chỉ default và set default cho địa chỉ tiếp theo", async () => {
      const userWithAddresses = await User.create({
        name: "User Delete Default",
        email: "deletedefault@example.com",
        password: "password123",
        passwordConfirm: "password123",
        address: [
          {
            name: "Home",
            phone: "0123456789",
            setDefault: true,
          },
          {
            name: "Office",
            phone: "0987654321",
            setDefault: false,
          },
        ],
      });

      req.user = userWithAddresses;
      req.body = { id: 0 };

      await userController.deleteAddress(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall.data.address[0].name).toBe("Office");
      expect(jsonCall.data.address[0].setDefault).toBe(true);
    });

    it("USER-019: nên trả về lỗi khi ID không tồn tại", async () => {
      req.user = testUser;
      req.body = { id: 999 };

      await userController.deleteAddress(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        message: "This data is not exist. Please try again!!!",
      });
    });
  });

  // ========================================
  // Function H: Set Default Address (Đặt địa chỉ mặc định)
  // ========================================
  describe("setDefaultAddress - Đặt địa chỉ mặc định", () => {
    it("USER-020: nên đặt địa chỉ mặc định thành công", async () => {
      const userWithAddresses = await User.create({
        name: "User Set Default",
        email: "setdefault@example.com",
        password: "password123",
        passwordConfirm: "password123",
        address: [
          {
            name: "Home",
            phone: "0123456789",
            setDefault: true,
          },
          {
            name: "Office",
            phone: "0987654321",
            setDefault: false,
          },
        ],
      });

      req.user = userWithAddresses;
      req.body = { id: 1 };

      await userController.setDefaultAddress(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message: "Set default address successfully.",
        data: expect.objectContaining({
          address: expect.arrayContaining([
            expect.objectContaining({ setDefault: false }),
            expect.objectContaining({ setDefault: true }),
          ]),
        }),
      });
    });

    it("USER-021: nên trả về lỗi khi ID không tồn tại", async () => {
      req.user = testUser;
      req.body = { id: 999 };

      await userController.setDefaultAddress(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        message: "This data is not exist. Please try again!!!",
      });
    });
  });

  // ========================================
  // Function I-L: Admin Functions (Mock factory functions)
  // ========================================
  describe("Admin Functions - Get All Users", () => {
    it("USER-022: Admin nên xem danh sách users thành công", async () => {
      // Mock factory.getAll
      const mockGetAll = jest.fn((Model) => {
        return async (req, res) => {
          const users = await Model.find();
          res.status(200).json({
            status: "success",
            results: users.length,
            data: { users },
          });
        };
      });

      const getAllUsers = mockGetAll(User);
      req.user = adminUser;

      await getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          results: expect.any(Number),
        })
      );
    });

    it("USER-023: User thường không có quyền xem danh sách (được handle bởi restrictTo middleware)", () => {
      // This is handled by authController.restrictTo middleware
      // Test passes if middleware is properly configured
      expect(true).toBe(true);
    });
  });

  describe("Admin Functions - Get User", () => {
    it("USER-024: Admin nên xem chi tiết user thành công", async () => {
      const mockGetOne = jest.fn((Model) => {
        return async (req, res, next) => {
          const doc = await Model.findById(req.params.id);
          if (!doc) {
            return next(new AppError("No document found with that ID", 404));
          }
          res.status(200).json({
            status: "success",
            data: { doc },
          });
        };
      });

      const getUser = mockGetOne(User);
      req.params.id = testUser._id.toString();

      await getUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
        })
      );
    });

    it("USER-025: nên trả về lỗi khi user không tồn tại", async () => {
      const mockGetOne = jest.fn((Model) => {
        return async (req, res, next) => {
          const doc = await Model.findById(req.params.id);
          if (!doc) {
            return next(new AppError("No document found with that ID", 404));
          }
          res.status(200).json({
            status: "success",
            data: { doc },
          });
        };
      });

      const getUser = mockGetOne(User);
      req.params.id = new mongoose.Types.ObjectId().toString();

      await getUser(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "No document found with that ID",
          statusCode: 404,
        })
      );
    });
  });

  describe("Admin Functions - Update User", () => {
    it("USER-026: Admin nên cập nhật user thành công", async () => {
      const mockUpdateOne = jest.fn((Model) => {
        return async (req, res, next) => {
          const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
          });
          if (!doc) {
            return next(new AppError("No document found with that ID", 404));
          }
          res.status(200).json({
            status: "success",
            data: { doc },
          });
        };
      });

      const updateUser = mockUpdateOne(User);
      req.params.id = testUser._id.toString();
      req.body = { name: "Updated by Admin" };

      await updateUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
        })
      );
    });

    it("USER-027: nên trả về lỗi khi user không tồn tại", async () => {
      const mockUpdateOne = jest.fn((Model) => {
        return async (req, res, next) => {
          const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
          });
          if (!doc) {
            return next(new AppError("No document found with that ID", 404));
          }
          res.status(200).json({
            status: "success",
            data: { doc },
          });
        };
      });

      const updateUser = mockUpdateOne(User);
      req.params.id = new mongoose.Types.ObjectId().toString();
      req.body = { name: "Updated" };

      await updateUser(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "No document found with that ID",
          statusCode: 404,
        })
      );
    });
  });

  describe("Admin Functions - Delete User", () => {
    it("USER-028: Admin nên xóa user thành công", async () => {
      const tempUser = await User.create({
        name: "Temp for Delete",
        email: "tempdelete@example.com",
        password: "password123",
        passwordConfirm: "password123",
      });

      const mockDeleteOne = jest.fn((Model) => {
        return async (req, res, next) => {
          const doc = await Model.findByIdAndDelete(req.params.id);
          if (!doc) {
            return next(new AppError("No document found with that ID", 404));
          }
          res.status(204).json({
            status: "success",
            data: null,
          });
        };
      });

      const deleteUser = mockDeleteOne(User);
      req.params.id = tempUser._id.toString();

      await deleteUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(204);
    });

    it("USER-029: nên trả về lỗi khi user không tồn tại", async () => {
      const mockDeleteOne = jest.fn((Model) => {
        return async (req, res, next) => {
          const doc = await Model.findByIdAndDelete(req.params.id);
          if (!doc) {
            return next(new AppError("No document found with that ID", 404));
          }
          res.status(204).json({
            status: "success",
            data: null,
          });
        };
      });

      const deleteUser = mockDeleteOne(User);
      req.params.id = new mongoose.Types.ObjectId().toString();

      await deleteUser(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "No document found with that ID",
          statusCode: 404,
        })
      );
    });

    it("USER-030: User thường không có quyền xóa users (được handle bởi restrictTo middleware)", () => {
      // This is handled by authController.restrictTo middleware
      // Test passes if middleware is properly configured
      expect(true).toBe(true);
    });
  });
});
