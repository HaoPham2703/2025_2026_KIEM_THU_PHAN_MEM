const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../../app");
const User = require("../../models/userModel");
const crypto = require("crypto");
const sendEmail = require("../../utils/email");

// Mock email module
jest.mock("../../utils/email");
sendEmail.mockResolvedValue(true);

describe("System Test - Flow Quên mật khẩu --> Reset --> Đăng nhập", () => {
  let testUser;
  let resetToken;

  beforeAll(async () => {
    // Tạo user test
    testUser = await User.create({
      name: "Forgot Password Test User",
      email: "forgotpassword@example.com",
      password: "Haolatui2703@",
      passwordConfirm: "Haolatui2703@",
      role: "user",
      active: "active",
    });
  });

  afterAll(async () => {
    await User.deleteMany({ email: "forgotpassword@example.com" });
  });

  describe("Bước 1: User gửi yêu cầu quên mật khẩu", () => {
    it("nên gửi yêu cầu quên mật khẩu thành công", async () => {
      sendEmail.mockClear();

      const response = await request(app)
        .post("/api/v1/users/forgotPassword")
        .send({
          email: "forgotpassword@example.com",
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Token sent to email!");

      // Kiểm tra email được gửi
      expect(sendEmail).toHaveBeenCalled();

      // Lấy reset token từ database
      const user = await User.findOne({
        email: "forgotpassword@example.com",
      });
      expect(user.passwordResetToken).toBeDefined();
      resetToken = user.passwordResetToken;
    });

    it("nên trả về lỗi khi email không tồn tại", async () => {
      const response = await request(app)
        .post("/api/v1/users/forgotPassword")
        .send({
          email: "notexist@example.com",
        });

      expect(response.status).toBe(404);
    });
  });

  describe("Bước 2: Xác thực mã reset", () => {
    it("nên xác thực mã reset thành công", async () => {
      // Tạo token hợp lệ
      const token = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      await User.findByIdAndUpdate(testUser._id, {
        passwordResetToken: hashedToken,
        passwordResetExpires: Date.now() + 10 * 60 * 1000, // 10 phút
      });

      const response = await request(app)
        .post("/api/v1/users/verifyResetPass")
        .send({
          token: token,
        });

      expect(response.status).toBe(200);
      expect(response.body.hashedToken).toBeDefined();
    });

    it("nên trả về lỗi khi token không hợp lệ", async () => {
      const response = await request(app)
        .post("/api/v1/users/verifyResetPass")
        .send({
          token: "invalid-token-123",
        });

      expect(response.status).toBe(400);
    });
  });

  describe("Bước 3: Đặt lại mật khẩu mới", () => {
    it("nên đặt lại mật khẩu thành công", async () => {
      // Tạo token hợp lệ
      const token = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      await User.findByIdAndUpdate(testUser._id, {
        passwordResetToken: hashedToken,
        passwordResetExpires: Date.now() + 10 * 60 * 1000,
      });

      const response = await request(app)
        .patch(`/api/v1/users/resetPassword/${token}`)
        .send({
          password: "NewPassword123@",
          passwordConfirm: "NewPassword123@",
        });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();

      // Kiểm tra password đã được cập nhật
      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser).toBeTruthy();
      expect(updatedUser.passwordResetToken).toBeUndefined();
    });
  });

  describe("Bước 4: Đăng nhập với mật khẩu mới", () => {
    it("nên đăng nhập thành công với mật khẩu mới", async () => {
      // Đảm bảo password đã được reset
      const token = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      await User.findByIdAndUpdate(testUser._id, {
        passwordResetToken: hashedToken,
        passwordResetExpires: Date.now() + 10 * 60 * 1000,
      });

      await request(app).patch(`/api/v1/users/resetPassword/${token}`).send({
        password: "NewPassword123@",
        passwordConfirm: "NewPassword123@",
      });

      // Đăng nhập với mật khẩu mới
      const response = await request(app).post("/api/v1/users/login").send({
        email: "forgotpassword@example.com",
        password: "NewPassword123@",
      });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
    });

    it("nên không đăng nhập được với mật khẩu cũ", async () => {
      const response = await request(app).post("/api/v1/users/login").send({
        email: "forgotpassword@example.com",
        password: "Haolatui2703@", // Mật khẩu cũ
      });

      expect(response.status).toBe(401);
    });
  });

  describe("Flow hoàn chỉnh: Quên mật khẩu --> Reset --> Đăng nhập", () => {
    it("nên thực hiện toàn bộ flow từ quên mật khẩu đến đăng nhập", async () => {
      // Tạo user mới cho flow test
      const newUser = await User.create({
        name: "Complete Flow User",
        email: "completeflow@example.com",
        password: "OldPassword123@",
        passwordConfirm: "OldPassword123@",
        role: "user",
        active: "active",
      });

      // Bước 1: Quên mật khẩu
      await request(app).post("/api/v1/users/forgotPassword").send({
        email: "completeflow@example.com",
      });

      // Bước 2: Lấy token từ database
      const userWithToken = await User.findOne({
        email: "completeflow@example.com",
      });
      const resetToken = userWithToken.passwordResetToken;

      // Tạo plain token (giả lập từ email)
      // Note: Trong thực tế, token được gửi qua email, ở đây ta cần tìm token tương ứng
      // Vì không thể reverse hash, ta sẽ tạo token mới và set vào DB
      const newToken = crypto.randomBytes(32).toString("hex");
      const newHashedToken = crypto
        .createHash("sha256")
        .update(newToken)
        .digest("hex");

      await User.findByIdAndUpdate(userWithToken._id, {
        passwordResetToken: newHashedToken,
        passwordResetExpires: Date.now() + 10 * 60 * 1000,
      });

      // Bước 3: Reset password
      await request(app).patch(`/api/v1/users/resetPassword/${newToken}`).send({
        password: "NewPassword456@",
        passwordConfirm: "NewPassword456@",
      });

      // Bước 4: Đăng nhập với mật khẩu mới
      const loginResponse = await request(app)
        .post("/api/v1/users/login")
        .send({
          email: "completeflow@example.com",
          password: "NewPassword456@",
        });

      expect(loginResponse.status).toBe(200);

      // Cleanup
      await User.deleteMany({ email: "completeflow@example.com" });
    });
  });
});
