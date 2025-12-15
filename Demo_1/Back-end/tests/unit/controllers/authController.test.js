const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../../../models/userModel');
const authController = require('../../../controllers/authController');
const AppError = require('../../../utils/appError');
const sendEmail = require('../../../utils/email');

// Mock email module
jest.mock('../../../utils/email');
sendEmail.mockResolvedValue(true);

describe('Auth Controller - Đăng ký và Xác thực', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      cookies: {},
      headers: {},
      get: jest.fn((header) => {
        if (header === 'host') return 'localhost:3000';
        return '';
      }),
      protocol: 'http',
      params: {},
      user: null,
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      locals: {},
    };

    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signup - Đăng ký người dùng', () => {
    it('nên tạo người dùng mới thành công', async () => {
      req.body = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        passwordConfirm: 'password123',
      };

      await authController.signup(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
      expect(res.json.mock.calls[0][0]).toMatchObject({
        status: 'success',
        token: expect.any(String),
        data: {
          user: expect.objectContaining({
            name: 'Test User',
            email: 'test@example.com',
            active: 'active',
          }),
        },
      });
      expect(res.cookie).toHaveBeenCalledWith('jwt', expect.any(String), expect.any(Object));

      // Verify user was created in database
      const user = await User.findOne({ email: 'test@example.com' });
      expect(user).toBeTruthy();
      expect(user.name).toBe('Test User');
      expect(user.active).toBe('active');
      expect(user.password).toBeUndefined(); // Password should not be in response
    });

    it('nên trả về lỗi khi email đã tồn tại', async () => {
      // Create existing user
      await User.create({
        name: 'Existing User',
        email: 'existing@example.com',
        password: 'password123',
        passwordConfirm: 'password123',
      });

      req.body = {
        name: 'New User',
        email: 'existing@example.com',
        password: 'password123',
        passwordConfirm: 'password123',
      };

      await authController.signup(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Email này đã được đăng ký.',
          statusCode: 500,
        })
      );
    });

    it('nên hash password trước khi lưu', async () => {
      req.body = {
        name: 'Test User',
        email: 'test2@example.com',
        password: 'password123',
        passwordConfirm: 'password123',
      };

      await authController.signup(req, res, next);

      const user = await User.findOne({ email: 'test2@example.com' }).select('+password');
      expect(user.password).not.toBe('password123');
      expect(user.password).toHaveLength(60); // bcrypt hash length
    });
  });

  describe('signupAdmin - Đăng ký admin', () => {
    it('nên tạo admin mới thành công', async () => {
      req.body = {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        passwordConfirm: 'admin123',
      };

      await authController.signupAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Đăng ký admin thành công!',
        data: {
          user: expect.objectContaining({
            name: 'Admin User',
            email: 'admin@example.com',
            role: 'admin',
            active: 'active',
          }),
        },
      });

      const user = await User.findOne({ email: 'admin@example.com' });
      expect(user).toBeTruthy();
      expect(user.role).toBe('admin');
    });

    it('nên trả về lỗi khi email admin đã tồn tại', async () => {
      await User.create({
        name: 'Existing Admin',
        email: 'admin2@example.com',
        password: 'admin123',
        passwordConfirm: 'admin123',
        role: 'admin',
      });

      req.body = {
        name: 'New Admin',
        email: 'admin2@example.com',
        password: 'admin123',
        passwordConfirm: 'admin123',
      };

      await authController.signupAdmin(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Email này đã được đăng ký.',
          statusCode: 500,
        })
      );
    });
  });

  describe('login - Đăng nhập', () => {
    let user;

    beforeEach(async () => {
      user = await User.create({
        name: 'Test User',
        email: 'login@example.com',
        password: 'password123',
        passwordConfirm: 'password123',
        active: 'active',
      });
    });

    it('nên đăng nhập thành công với email và password đúng', async () => {
      req.body = {
        email: 'login@example.com',
        password: 'password123',
      };

      await authController.login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
      expect(res.json.mock.calls[0][0]).toMatchObject({
        status: 'success',
        token: expect.any(String),
        data: {
          user: expect.objectContaining({
            email: 'login@example.com',
          }),
        },
      });
      expect(res.cookie).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('nên trả về lỗi khi thiếu email hoặc password', async () => {
      req.body = {
        email: 'login@example.com',
        // password missing
      };

      await authController.login(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Vui lòng cung cấp email và mật khẩu!',
          statusCode: 400,
        })
      );
    });

    it('nên trả về lỗi khi email không tồn tại', async () => {
      req.body = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      await authController.login(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Email hoặc mật khẩu không chính xác',
          statusCode: 401,
        })
      );
    });

    it('nên trả về lỗi khi password sai', async () => {
      req.body = {
        email: 'login@example.com',
        password: 'wrongpassword',
      };

      await authController.login(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Email hoặc mật khẩu không chính xác',
          statusCode: 401,
        })
      );
    });

    it('nên tự động active user nếu status là verify', async () => {
      const verifyUser = await User.create({
        name: 'Verify User',
        email: 'verify@example.com',
        password: 'password123',
        passwordConfirm: 'password123',
        active: 'verify',
      });

      req.body = {
        email: 'verify@example.com',
        password: 'password123',
      };

      await authController.login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      
      const updatedUser = await User.findById(verifyUser._id);
      expect(updatedUser.active).toBe('active');
    });
  });

  describe('verifyUser - Xác thực người dùng', () => {
    it('nên xác thực user thành công với token hợp lệ', async () => {
      const verifyToken = crypto.randomBytes(3).toString('hex');
      const hashedToken = crypto
        .createHash('sha256')
        .update(verifyToken)
        .digest('hex');

      const user = await User.create({
        name: 'Verify User',
        email: 'verify2@example.com',
        password: 'password123',
        passwordConfirm: 'password123',
        active: 'verify',
        userVerifyToken: hashedToken,
      });

      req.body = {
        encode: verifyToken,
      };

      await authController.verifyUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
      
      const updatedUser = await User.findById(user._id);
      expect(updatedUser.active).toBe('active');
      expect(updatedUser.userVerifyToken).toBeUndefined();
    });

    it('nên trả về lỗi khi token không hợp lệ', async () => {
      req.body = {
        encode: 'invalidtoken',
      };

      await authController.verifyUser(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Mã xác nhận không hợp lệ hoặc đã hết hạn',
          statusCode: 400,
        })
      );
    });
  });

  describe('forgotPassword - Quên mật khẩu', () => {
    it('nên tạo reset token và gửi email', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'forgot@example.com',
        password: 'password123',
        passwordConfirm: 'password123',
      });

      req.body = {
        email: 'forgot@example.com',
      };

      await authController.forgotPassword(req, res, next);

      expect(sendEmail).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Token sent to email!',
      });

      const updatedUser = await User.findById(user._id);
      expect(updatedUser.passwordResetToken).toBeDefined();
      expect(updatedUser.passwordResetExpires).toBeDefined();
    });

    it('nên trả về lỗi khi email không tồn tại', async () => {
      req.body = {
        email: 'nonexistent@example.com',
      };

      await authController.forgotPassword(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Tài khoản này không tồn tại. Vui lòng đăng ký để sử dụng',
          statusCode: 404,
        })
      );
    });
  });

  describe('verifyResetPass - Xác thực reset password token', () => {
    it('nên xác thực token reset password hợp lệ', async () => {
      const resetToken = crypto.randomBytes(3).toString('hex');
      const hashedToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

      await User.create({
        name: 'Test User',
        email: 'reset@example.com',
        password: 'password123',
        passwordConfirm: 'password123',
        passwordResetToken: hashedToken,
        passwordResetExpires: Date.now() + 10 * 60 * 1000, // 10 minutes
      });

      req.body = {
        token: resetToken,
      };

      await authController.verifyResetPass(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        hashedToken: expect.any(String),
      });
    });

    it('nên trả về lỗi khi token không hợp lệ hoặc hết hạn', async () => {
      req.body = {
        token: 'invalidtoken',
      };

      await authController.verifyResetPass(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Token không hợp lệ hoặc đã hết hạn',
          statusCode: 400,
        })
      );
    });
  });

  describe('resetPassword - Đặt lại mật khẩu', () => {
    it('nên đặt lại mật khẩu thành công với token hợp lệ', async () => {
      const resetToken = crypto.randomBytes(3).toString('hex');
      const hashedToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

      const user = await User.create({
        name: 'Test User',
        email: 'reset2@example.com',
        password: 'oldpassword',
        passwordConfirm: 'oldpassword',
        passwordResetToken: hashedToken,
        passwordResetExpires: Date.now() + 10 * 60 * 1000,
      });

      req.params = {
        token: hashedToken,
      };
      req.body = {
        password: 'newpassword123',
        passwordConfirm: 'newpassword123',
      };

      await authController.resetPassword(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
      
      const updatedUser = await User.findById(user._id).select('+password');
      expect(updatedUser.passwordResetToken).toBeUndefined();
      expect(updatedUser.passwordResetExpires).toBeUndefined();
      
      // Verify new password works
      const isCorrect = await updatedUser.correctPassword('newpassword123', updatedUser.password);
      expect(isCorrect).toBe(true);
    });

    it('nên trả về lỗi khi token không hợp lệ', async () => {
      req.params = {
        token: 'invalidtoken',
      };
      req.body = {
        password: 'newpassword123',
        passwordConfirm: 'newpassword123',
      };

      await authController.resetPassword(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('không hợp lệ hoặc đã hết hạn'),
          statusCode: 400,
        })
      );
    });
  });

  describe('updatePassword - Cập nhật mật khẩu', () => {
    let user;

    beforeEach(async () => {
      user = await User.create({
        name: 'Test User',
        email: 'updatepass@example.com',
        password: 'oldpassword',
        passwordConfirm: 'oldpassword',
      });
      req.user = user;
    });

    it('nên cập nhật mật khẩu thành công với password hiện tại đúng', async () => {
      req.body = {
        passwordCurrent: 'oldpassword',
        password: 'newpassword123',
        passwordConfirm: 'newpassword123',
      };

      await authController.updatePassword(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
      
      const updatedUser = await User.findById(user._id).select('+password');
      const isCorrect = await updatedUser.correctPassword('newpassword123', updatedUser.password);
      expect(isCorrect).toBe(true);
    });

    it('nên trả về lỗi khi password hiện tại sai', async () => {
      req.body = {
        passwordCurrent: 'wrongpassword',
        password: 'newpassword123',
        passwordConfirm: 'newpassword123',
      };

      await authController.updatePassword(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Mật khẩu hiện tại chưa chính xác.',
          statusCode: 401,
        })
      );
    });
  });

  describe('logout - Đăng xuất', () => {
    it('nên đăng xuất thành công', () => {
      authController.logout(req, res);

      expect(res.cookie).toHaveBeenCalledWith(
        'jwt',
        'loggedout',
        expect.objectContaining({
          expires: expect.any(Date),
          httpOnly: true,
        })
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ status: 'success' });
    });
  });

  describe('protect - Middleware bảo vệ route', () => {
    let user;

    beforeEach(async () => {
      user = await User.create({
        name: 'Test User',
        email: 'protect@example.com',
        password: 'password123',
        passwordConfirm: 'password123',
      });
    });

    it('nên cho phép truy cập với token hợp lệ trong header', async () => {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      req.headers.authorization = `Bearer ${token}`;

      await authController.protect(req, res, next);

      expect(req.user).toBeTruthy();
      expect(req.user._id.toString()).toBe(user._id.toString());
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('nên cho phép truy cập với token hợp lệ trong cookie', async () => {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      req.cookies.jwt = token;

      await authController.protect(req, res, next);

      expect(req.user).toBeTruthy();
      expect(next).toHaveBeenCalled();
    });

    it('nên trả về lỗi khi không có token', async () => {
      await authController.protect(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Bạn chưa đăng nhập hoặc đăng ký. Vui lòng thực hiện!!!',
          statusCode: 401,
        })
      );
    });

    it('nên trả về lỗi khi user không còn tồn tại', async () => {
      const token = jwt.sign({ id: new mongoose.Types.ObjectId() }, process.env.JWT_SECRET);
      req.headers.authorization = `Bearer ${token}`;

      await authController.protect(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Token người dùng không còn tồn tại.',
          statusCode: 401,
        })
      );
    });

    it('nên trả về lỗi khi password đã thay đổi sau khi token được tạo', async () => {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      req.headers.authorization = `Bearer ${token}`;

      // Change password
      user.password = 'newpassword';
      user.passwordConfirm = 'newpassword';
      await user.save();

      await authController.protect(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Tài khoản gần đây đã thay đổi mật khẩu! Xin vui lòng đăng nhập lại.',
          statusCode: 401,
        })
      );
    });
  });

  describe('restrictTo - Middleware phân quyền', () => {
    it('nên cho phép truy cập khi user có role phù hợp', async () => {
      const admin = await User.create({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'password123',
        passwordConfirm: 'password123',
        role: 'admin',
      });

      req.user = admin;
      const middleware = authController.restrictTo('admin', 'employee');

      await middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('nên từ chối truy cập khi user không có role phù hợp', async () => {
      const user = await User.create({
        name: 'User',
        email: 'user@example.com',
        password: 'password123',
        passwordConfirm: 'password123',
        role: 'user',
      });

      req.user = user;
      const middleware = authController.restrictTo('admin', 'employee');

      await middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Bạn không có quyền thực hiện',
          statusCode: 403,
        })
      );
    });

    it('nên từ chối truy cập khi không có user', async () => {
      req.user = undefined;
      const middleware = authController.restrictTo('admin');

      await middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Bạn không có quyền thực hiện',
          statusCode: 403,
        })
      );
    });
  });

  describe('googleLogin - Đăng nhập bằng Google (Admin)', () => {
    it('nên đăng nhập thành công với admin account', async () => {
      const admin = await User.create({
        name: 'Admin',
        email: 'admin@google.com',
        password: 'password123',
        passwordConfirm: 'password123',
        role: 'admin',
      });

      req.body = {
        email: 'admin@google.com',
      };

      await authController.googleLogin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
      expect(res.cookie).toHaveBeenCalled();
    });

    it('nên từ chối đăng nhập với non-admin account', async () => {
      const user = await User.create({
        name: 'User',
        email: 'user@google.com',
        password: 'password123',
        passwordConfirm: 'password123',
        role: 'user',
      });

      req.body = {
        email: 'user@google.com',
      };

      await authController.googleLogin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Tài khoản này không được phép truy cập',
      });
    });
  });

  describe('userLoginWith - Đăng nhập bằng Google/Firebase (User)', () => {
    it('nên tạo user mới nếu chưa tồn tại', async () => {
      req.body = {
        user: {
          email: 'newuser@google.com',
          displayName: 'New User',
          emailVerified: true,
        },
      };

      await authController.userLoginWith(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
      
      const user = await User.findOne({ email: 'newuser@google.com' });
      expect(user).toBeTruthy();
      expect(user.name).toBe('New User');
      expect(user.active).toBe('active');
    });

    it('nên đăng nhập thành công với user đã tồn tại', async () => {
      const user = await User.create({
        name: 'Existing User',
        email: 'existing@google.com',
        password: 'password123',
        passwordConfirm: 'password123',
        active: 'active',
      });

      req.body = {
        user: {
          email: 'existing@google.com',
          displayName: 'Existing User',
          emailVerified: true,
        },
      };

      await authController.userLoginWith(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
    });

    it('nên tự động active user nếu status là verify', async () => {
      const user = await User.create({
        name: 'Verify User',
        email: 'verify@google.com',
        password: 'password123',
        passwordConfirm: 'password123',
        active: 'verify',
      });

      req.body = {
        user: {
          email: 'verify@google.com',
          displayName: 'Verify User',
          emailVerified: true,
        },
      };

      await authController.userLoginWith(req, res, next);

      const updatedUser = await User.findById(user._id);
      expect(updatedUser.active).toBe('active');
    });

    it('nên từ chối đăng nhập với tài khoản bị ban', async () => {
      await User.create({
        name: 'Banned User',
        email: 'banned@google.com',
        password: 'password123',
        passwordConfirm: 'password123',
        active: 'ban',
      });

      req.body = {
        user: {
          email: 'banned@google.com',
          displayName: 'Banned User',
          emailVerified: true,
        },
      };

      await authController.userLoginWith(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Tài khoản của bạn đã bị ban.',
          statusCode: 401,
        })
      );
    });
  });

  describe('changeStateUser - Thay đổi trạng thái user', () => {
    let user;

    beforeEach(async () => {
      user = await User.create({
        name: 'Test User',
        email: 'changestate@example.com',
        password: 'password123',
        passwordConfirm: 'password123',
        active: 'active',
      });
    });

    it('nên thay đổi trạng thái user thành công', async () => {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      req.cookies.jwt = token;
      req.body = {
        state: 'ban',
      };

      await authController.changeStateUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
      
      const updatedUser = await User.findById(user._id);
      expect(updatedUser.active).toBe('ban');
    });

    it('nên trả về lỗi khi token không hợp lệ', async () => {
      req.cookies.jwt = 'invalidtoken';
      req.body = {
        state: 'ban',
      };

      await authController.changeStateUser(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});

