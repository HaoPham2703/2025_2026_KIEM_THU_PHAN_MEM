# TEST CASES - AUTHENTICATION MODULE

**Tình huống**: Xác thực và ủy quyền người dùng  
**Module**: Authentication & Authorization  
**Ngày tạo**: 21/12/2025  
**Người tạo**: Test Team

---

## 1. ĐĂNG KÝ TÀI KHOẢN (SIGNUP)

### TC-AUTH-001: Đăng ký tài khoản user với dữ liệu hợp lệ
- **Mức độ ưu tiên**: High
- **Loại test**: Functional - Positive
- **Điều kiện tiên quyết**: Email chưa tồn tại trong hệ thống
- **Bước thực hiện**:
  1. Gửi POST request đến `/api/v1/users/signup`
  2. Body: `{ "name": "Nguyen Van A", "email": "nguyenvana@test.com", "password": "Test@123", "passwordConfirm": "Test@123" }`
- **Kết quả mong đợi**:
  - Status code: 201
  - Response có `status: "success"` và `token` hợp lệ
  - User được tạo với `active: "active"`
  - Mật khẩu được mã hóa trong database
- **Kết quả thực tế**: ✅ Pass
- **Ghi chú**: Test case cơ bản nhất

### TC-AUTH-002: Đăng ký với email đã tồn tại
- **Mức độ ưu tiên**: High
- **Loại test**: Functional - Negative
- **Điều kiện tiên quyết**: Email đã tồn tại trong hệ thống
- **Bước thực hiện**:
  1. Tạo user với email "existing@test.com"
  2. Gửi POST request đến `/api/v1/users/signup`
  3. Body: `{ "name": "Test User", "email": "existing@test.com", "password": "Test@123", "passwordConfirm": "Test@123" }`
- **Kết quả mong đợi**:
  - Status code: 400 hoặc 409
  - Response có thông báo lỗi "Email đã được sử dụng" hoặc tương tự
- **Kết quả thực tế**: ✅ Pass
- **Ghi chú**: Kiểm tra duplicate email validation

### TC-AUTH-003: Đăng ký với password không khớp passwordConfirm
- **Mức độ ưu tiên**: High
- **Loại test**: Functional - Negative
- **Điều kiện tiên quyết**: Không có
- **Bước thực hiện**:
  1. Gửi POST request đến `/api/v1/users/signup`
  2. Body: `{ "name": "Test User", "email": "test@test.com", "password": "Test@123", "passwordConfirm": "Test@456" }`
- **Kết quả mong đợi**:
  - Status code: 400
  - Response có thông báo lỗi về password không khớp
- **Kết quả thực tế**: ✅ Pass
- **Ghi chú**: Validation mật khẩu xác nhận

### TC-AUTH-004: Đăng ký với email không hợp lệ
- **Mức độ ưu tiên**: Medium
- **Loại test**: Functional - Negative
- **Điều kiện tiên quyết**: Không có
- **Bước thực hiện**:
  1. Gửi POST request đến `/api/v1/users/signup`
  2. Body: `{ "name": "Test User", "email": "invalidemail", "password": "Test@123", "passwordConfirm": "Test@123" }`
- **Kết quả mong đợi**:
  - Status code: 400
  - Response có thông báo lỗi về định dạng email
- **Kết quả thực tế**: ✅ Pass
- **Ghi chú**: Email format validation

### TC-AUTH-005: Đăng ký với password quá ngắn (< 8 ký tự)
- **Mức độ ưu tiên**: Medium
- **Loại test**: Functional - Negative
- **Điều kiện tiên quyết**: Không có
- **Bước thực hiện**:
  1. Gửi POST request đến `/api/v1/users/signup`
  2. Body: `{ "name": "Test User", "email": "test@test.com", "password": "Test@1", "passwordConfirm": "Test@1" }`
- **Kết quả mong đợi**:
  - Status code: 400
  - Response có thông báo lỗi về độ dài password tối thiểu
- **Kết quả thực tế**: ✅ Pass
- **Ghi chú**: Password length validation

### TC-AUTH-006: Đăng ký với trường bắt buộc bị thiếu
- **Mức độ ưu tiên**: High
- **Loại test**: Functional - Negative
- **Điều kiện tiên quyết**: Không có
- **Bước thực hiện**:
  1. Gửi POST request đến `/api/v1/users/signup`
  2. Body: `{ "name": "Test User", "email": "test@test.com" }` (thiếu password)
- **Kết quả mong đợi**:
  - Status code: 400
  - Response có thông báo lỗi về trường bắt buộc
- **Kết quả thực tế**: ✅ Pass
- **Ghi chú**: Required fields validation

---

## 2. ĐĂNG NHẬP (LOGIN)

### TC-AUTH-007: Đăng nhập với thông tin hợp lệ
- **Mức độ ưu tiên**: High
- **Loại test**: Functional - Positive
- **Điều kiện tiên quyết**: User đã tồn tại và active
- **Bước thực hiện**:
  1. Gửi POST request đến `/api/v1/users/login`
  2. Body: `{ "email": "user@test.com", "password": "Test@123" }`
- **Kết quả mong đợi**:
  - Status code: 200
  - Response có `status: "success"` và `token` hợp lệ
  - Cookie jwt được set
- **Kết quả thực tế**: ✅ Pass
- **Ghi chú**: Login cơ bản

### TC-AUTH-008: Đăng nhập với password sai
- **Mức độ ưu tiên**: High
- **Loại test**: Security - Negative
- **Điều kiện tiên quyết**: User đã tồn tại
- **Bước thực hiện**:
  1. Gửi POST request đến `/api/v1/users/login`
  2. Body: `{ "email": "user@test.com", "password": "WrongPassword123" }`
- **Kết quả mong đợi**:
  - Status code: 401
  - Response có thông báo lỗi về thông tin đăng nhập không đúng
  - Không trả về token
- **Kết quả thực tế**: ✅ Pass
- **Ghi chú**: Authentication failure

### TC-AUTH-009: Đăng nhập với email không tồn tại
- **Mức độ ưu tiên**: High
- **Loại test**: Functional - Negative
- **Điều kiện tiên quyết**: Email không tồn tại trong hệ thống
- **Bước thực hiện**:
  1. Gửi POST request đến `/api/v1/users/login`
  2. Body: `{ "email": "notexist@test.com", "password": "Test@123" }`
- **Kết quả mong đợi**:
  - Status code: 401
  - Response có thông báo lỗi về thông tin đăng nhập không đúng
- **Kết quả thực tế**: ✅ Pass
- **Ghi chú**: Non-existent user

### TC-AUTH-010: Đăng nhập với tài khoản bị ban
- **Mức độ ưu tiên**: High
- **Loại test**: Security - Negative
- **Điều kiện tiên quyết**: User có `active: "ban"`
- **Bước thực hiện**:
  1. Tạo hoặc cập nhật user với `active: "ban"`
  2. Gửi POST request đến `/api/v1/users/login`
  3. Body: `{ "email": "banned@test.com", "password": "Test@123" }`
- **Kết quả mong đợi**:
  - Status code: 401
  - Response có thông báo tài khoản bị khóa
- **Kết quả thực tế**: ✅ Pass
- **Ghi chú**: Banned user cannot login

---

## 3. QUÊN MẬT KHẨU (FORGOT PASSWORD)

### TC-AUTH-011: Gửi yêu cầu reset password với email hợp lệ
- **Mức độ ưu tiên**: High
- **Loại test**: Functional - Positive
- **Điều kiện tiên quyết**: User tồn tại và active
- **Bước thực hiện**:
  1. Gửi POST request đến `/api/v1/users/forgotPassword`
  2. Body: `{ "email": "user@test.com" }`
- **Kết quả mong đợi**:
  - Status code: 200
  - Response có thông báo gửi email thành công
  - Reset token được tạo và lưu trong database
  - Email chứa mã reset được gửi đến user
- **Kết quả thực tế**: ✅ Pass
- **Ghi chú**: Forgot password flow

### TC-AUTH-012: Gửi yêu cầu reset password với email không tồn tại
- **Mức độ ưu tiên**: Medium
- **Loại test**: Functional - Negative
- **Điều kiện tiên quyết**: Email không tồn tại trong hệ thống
- **Bước thực hiện**:
  1. Gửi POST request đến `/api/v1/users/forgotPassword`
  2. Body: `{ "email": "notexist@test.com" }`
- **Kết quả mong đợi**:
  - Status code: 404
  - Response có thông báo không tìm thấy user
- **Kết quả thực tế**: ✅ Pass
- **Ghi chú**: Non-existent email

### TC-AUTH-013: Xác thực mã reset password hợp lệ
- **Mức độ ưu tiên**: High
- **Loại test**: Functional - Positive
- **Điều kiện tiên quyết**: Đã gửi yêu cầu reset password
- **Bước thực hiện**:
  1. Lấy reset code từ database hoặc email
  2. Gửi POST request đến `/api/v1/users/verifyResetPass`
  3. Body: `{ "email": "user@test.com", "code": "123456" }`
- **Kết quả mong đợi**:
  - Status code: 200
  - Response có thông báo xác thực thành công
  - Token reset hợp lệ được trả về
- **Kết quả thực tế**: ✅ Pass
- **Ghi chú**: Verify reset code

### TC-AUTH-014: Xác thực mã reset password không hợp lệ
- **Mức độ ưu tiên**: High
- **Loại test**: Security - Negative
- **Điều kiện tiên quyết**: Đã gửi yêu cầu reset password
- **Bước thực hiện**:
  1. Gửi POST request đến `/api/v1/users/verifyResetPass`
  2. Body: `{ "email": "user@test.com", "code": "000000" }` (mã sai)
- **Kết quả mong đợi**:
  - Status code: 400 hoặc 401
  - Response có thông báo mã không hợp lệ
- **Kết quả thực tế**: ✅ Pass
- **Ghi chú**: Invalid reset code

### TC-AUTH-015: Đặt lại mật khẩu mới với token hợp lệ
- **Mức độ ưu tiên**: High
- **Loại test**: Functional - Positive
- **Điều kiện tiên quyết**: Đã xác thực mã reset thành công
- **Bước thực hiện**:
  1. Gửi PATCH request đến `/api/v1/users/resetPassword/:token`
  2. Body: `{ "password": "NewPass@123", "passwordConfirm": "NewPass@123" }`
- **Kết quả mong đợi**:
  - Status code: 200
  - Password được cập nhật trong database
  - Token reset bị xóa hoặc vô hiệu hóa
  - User có thể đăng nhập bằng mật khẩu mới
- **Kết quả thực tế**: ✅ Pass
- **Ghi chú**: Reset password successful

### TC-AUTH-016: Đặt lại mật khẩu với token đã hết hạn
- **Mức độ ưu tiên**: High
- **Loại test**: Security - Negative
- **Điều kiện tiên quyết**: Token reset đã hết hạn (> 10 phút)
- **Bước thực hiện**:
  1. Gửi PATCH request đến `/api/v1/users/resetPassword/:expiredToken`
  2. Body: `{ "password": "NewPass@123", "passwordConfirm": "NewPass@123" }`
- **Kết quả mong đợi**:
  - Status code: 400 hoặc 401
  - Response có thông báo token đã hết hạn
  - Password không được thay đổi
- **Kết quả thực tế**: ✅ Pass
- **Ghi chú**: Expired token

---

## 4. CẬP NHẬT MẬT KHẨU (UPDATE PASSWORD)

### TC-AUTH-017: Cập nhật mật khẩu khi đã đăng nhập
- **Mức độ ưu tiên**: High
- **Loại test**: Functional - Positive
- **Điều kiện tiên quyết**: User đã đăng nhập
- **Bước thực hiện**:
  1. Gửi PATCH request đến `/api/v1/users/updateMyPassword`
  2. Header: `Authorization: Bearer {token}`
  3. Body: `{ "passwordCurrent": "OldPass@123", "password": "NewPass@123", "passwordConfirm": "NewPass@123" }`
- **Kết quả mong đợi**:
  - Status code: 200
  - Password được cập nhật
  - Token mới được tạo và trả về
  - User có thể đăng nhập bằng mật khẩu mới
- **Kết quả thực tế**: ✅ Pass
- **Ghi chú**: Update password while logged in

### TC-AUTH-018: Cập nhật mật khẩu với mật khẩu hiện tại sai
- **Mức độ ưu tiên**: High
- **Loại test**: Security - Negative
- **Điều kiện tiên quyết**: User đã đăng nhập
- **Bước thực hiện**:
  1. Gửi PATCH request đến `/api/v1/users/updateMyPassword`
  2. Header: `Authorization: Bearer {token}`
  3. Body: `{ "passwordCurrent": "WrongPassword", "password": "NewPass@123", "passwordConfirm": "NewPass@123" }`
- **Kết quả mong đợi**:
  - Status code: 401
  - Response có thông báo mật khẩu hiện tại không đúng
  - Password không được thay đổi
- **Kết quả thực tế**: ✅ Pass
- **Ghi chú**: Wrong current password

---

## 5. ĐĂNG XUẤT (LOGOUT)

### TC-AUTH-019: Đăng xuất thành công
- **Mức độ ưu tiên**: Medium
- **Loại test**: Functional - Positive
- **Điều kiện tiên quyết**: User đã đăng nhập
- **Bước thực hiện**:
  1. Gửi GET request đến `/api/v1/users/logout`
  2. Header: `Authorization: Bearer {token}`
- **Kết quả mong đợi**:
  - Status code: 200
  - Cookie jwt được xóa hoặc set thành giá trị rỗng
  - Response có thông báo đăng xuất thành công
- **Kết quả thực tế**: ✅ Pass
- **Ghi chú**: Logout successful

---

## 6. XÁC THỰC TÀI KHOẢN (VERIFY)

### TC-AUTH-020: Xác thực tài khoản với token hợp lệ
- **Mức độ ưu tiên**: High
- **Loại test**: Functional - Positive
- **Điều kiện tiên quyết**: User có `active: "verify"` và verify token
- **Bước thực hiện**:
  1. Gửi POST request đến `/api/v1/users/verify`
  2. Body: `{ "token": "valid-verify-token" }`
- **Kết quả mong đợi**:
  - Status code: 200
  - User `active` được cập nhật thành "active"
  - Response có thông báo xác thực thành công
- **Kết quả thực tế**: ✅ Pass
- **Ghi chú**: Account verification

### TC-AUTH-021: Xác thực tài khoản với token không hợp lệ
- **Mức độ ưu tiên**: High
- **Loại test**: Security - Negative
- **Điều kiện tiên quyết**: Không có
- **Bước thực hiện**:
  1. Gửi POST request đến `/api/v1/users/verify`
  2. Body: `{ "token": "invalid-token" }`
- **Kết quả mong đợi**:
  - Status code: 400 hoặc 401
  - Response có thông báo token không hợp lệ
- **Kết quả thực tế**: ✅ Pass
- **Ghi chú**: Invalid verification token

---

## 7. PHÂN QUYỀN (AUTHORIZATION)

### TC-AUTH-022: Truy cập route yêu cầu authentication khi chưa đăng nhập
- **Mức độ ưu tiên**: High
- **Loại test**: Security - Negative
- **Điều kiện tiên quyết**: Chưa đăng nhập
- **Bước thực hiện**:
  1. Gửi GET request đến `/api/v1/users/me` (route cần authentication)
  2. Không gửi token trong header
- **Kết quả mong đợi**:
  - Status code: 401
  - Response có thông báo yêu cầu đăng nhập
- **Kết quả thực tế**: ✅ Pass
- **Ghi chú**: Protect route from unauthenticated access

### TC-AUTH-023: Truy cập route admin với quyền user
- **Mức độ ưu tiên**: High
- **Loại test**: Security - Negative
- **Điều kiện tiên quyết**: Đăng nhập với role "user"
- **Bước thực hiện**:
  1. Gửi GET request đến `/api/v1/users` (route chỉ admin)
  2. Header: `Authorization: Bearer {user-token}`
- **Kết quả mong đợi**:
  - Status code: 403
  - Response có thông báo không có quyền truy cập
- **Kết quả thực tế**: ✅ Pass
- **Ghi chú**: Role-based access control

### TC-AUTH-024: Truy cập route admin với quyền admin
- **Mức độ ưu tiên**: High
- **Loại test**: Security - Positive
- **Điều kiện tiên quyết**: Đăng nhập với role "admin"
- **Bước thực hiện**:
  1. Gửi GET request đến `/api/v1/users` (route chỉ admin)
  2. Header: `Authorization: Bearer {admin-token}`
- **Kết quả mong đợi**:
  - Status code: 200
  - Response trả về danh sách users
- **Kết quả thực tế**: ✅ Pass
- **Ghi chú**: Admin access granted

### TC-AUTH-025: Truy cập với token đã hết hạn
- **Mức độ ưu tiên**: High
- **Loại test**: Security - Negative
- **Điều kiện tiên quyết**: Có token đã hết hạn
- **Bước thực hiện**:
  1. Gửi GET request đến `/api/v1/users/me`
  2. Header: `Authorization: Bearer {expired-token}`
- **Kết quả mong đợi**:
  - Status code: 401
  - Response có thông báo token đã hết hạn
- **Kết quả thực tế**: ✅ Pass
- **Ghi chú**: Expired token handling

---

## TÓM TẮT

**Tổng số test cases**: 25  
**Passed**: 25  
**Failed**: 0  
**Blocked**: 0  
**Not executed**: 0

**Tỷ lệ pass**: 100%
