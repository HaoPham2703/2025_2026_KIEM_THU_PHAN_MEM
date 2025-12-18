# Module1 - Authentication (Xác thực và Bảo mật)

## Thông tin Module

|                      |                                                                                                                                                    |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Module Code**      | Module1                                                                                                                                            |
| **Test Requirement** | Test các chức năng xác thực: Đăng ký, Đăng nhập, Đăng xuất, Xác thực tài khoản, Quên mật khẩu, Đặt lại mật khẩu, Đổi mật khẩu, Phân quyền truy cập |
| **Tester**           | HaoPham                                                                                                                                            |
| **Test Date**        | 18/12/2025 (GitHub Actions - Branch: weblau)                                                                                                       |

---

## Thống kê Test Case

| Pass | Fail | Untested | N/A | Number of Test Cases |
| ---- | ---- | -------- | --- | -------------------- |
| 26   | 5    | 0        | 0   | 31                   |

> **Ghi chú:** Kết quả từ GitHub Actions - Branch `weblau` - Test Date: 18/12/2025

---

## Chi tiết Test Case

### Function A: Đăng ký tài khoản (Signup)

| ID       | Test Case Description                                     | Test Case Procedure                                                                                                                                                                             | Expected Output                                                                                              | Test Data  | Result | Test Date  | Description                               |
| -------- | --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ---------- | ------ | ---------- | ----------------------------------------- |
| AUTH-001 | Đăng ký tài khoản thành công với thông tin hợp lệ         | 1. Truy cập trang đăng ký<br>2. Nhập name: "Nguyen Van A"<br>3. Nhập email: "test@example.com"<br>4. Nhập password: "Test@123"<br>5. Nhập passwordConfirm: "Test@123"<br>6. Click nút [Đăng ký] | 1. Tài khoản được tạo thành công<br>2. Trả về status 201<br>3. Trả về token JWT<br>4. User active = "active" | TestData01 | Pass   | 18/12/2025 | Database chưa có email "test@example.com" |
| AUTH-002 | Đăng ký thất bại - Email đã tồn tại                       | 1. Truy cập trang đăng ký<br>2. Nhập email đã tồn tại trong DB<br>3. Nhập các thông tin khác hợp lệ<br>4. Click nút [Đăng ký]                                                                   | 1. Trả về status 500<br>2. Message: "Email này đã được đăng ký."                                             | TestData02 | Pass   | 18/12/2025 | Database đã có email này                  |
| AUTH-003 | Đăng ký thất bại - Password và PasswordConfirm không khớp | 1. Truy cập trang đăng ký<br>2. Nhập password: "Test@123"<br>3. Nhập passwordConfirm: "Test@456"<br>4. Click nút [Đăng ký]                                                                      | 1. Trả về lỗi validation<br>2. Tài khoản không được tạo                                                      | TestData03 | Pass   | 18/12/2025 |                                           |
| AUTH-004 | Đăng ký thất bại - Email không đúng định dạng             | 1. Truy cập trang đăng ký<br>2. Nhập email: "invalid-email"<br>3. Nhập các thông tin khác hợp lệ<br>4. Click nút [Đăng ký]                                                                      | 1. Trả về lỗi validation email                                                                               | TestData04 | Pass   | 18/12/2025 |                                           |
| AUTH-005 | Đăng ký thất bại - Thiếu trường bắt buộc                  | 1. Truy cập trang đăng ký<br>2. Để trống trường name<br>3. Click nút [Đăng ký]                                                                                                                  | 1. Trả về lỗi validation<br>2. Yêu cầu nhập đầy đủ thông tin                                                 | TestData05 | Pass   | 18/12/2025 |                                           |

---

### Function B: Đăng nhập (Login)

| ID       | Test Case Description                           | Test Case Procedure                                                                                                          | Expected Output                                                            | Test Data  | Result | Test Date  | Description                    |
| -------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ---------- | ------ | ---------- | ------------------------------ |
| AUTH-006 | Đăng nhập thành công với email và password đúng | 1. Truy cập trang đăng nhập<br>2. Nhập email: "test@example.com"<br>3. Nhập password: "Test@123"<br>4. Click nút [Đăng nhập] | 1. Trả về status 200<br>2. Trả về token JWT<br>3. Cookie jwt được set      | TestData06 | Pass   | 18/12/2025 | Tài khoản đã active            |
| AUTH-007 | Đăng nhập thất bại - Email không tồn tại        | 1. Truy cập trang đăng nhập<br>2. Nhập email không tồn tại<br>3. Nhập password bất kỳ<br>4. Click nút [Đăng nhập]            | 1. Trả về status 401<br>2. Message: "Email hoặc mật khẩu không chính xác"  | TestData07 | Pass   | 18/12/2025 |                                |
| AUTH-008 | Đăng nhập thất bại - Password sai               | 1. Truy cập trang đăng nhập<br>2. Nhập email đúng<br>3. Nhập password sai<br>4. Click nút [Đăng nhập]                        | 1. Trả về status 401<br>2. Message: "Email hoặc mật khẩu không chính xác"  | TestData08 | Pass   | 18/12/2025 |                                |
| AUTH-009 | Đăng nhập thất bại - Thiếu email                | 1. Truy cập trang đăng nhập<br>2. Để trống email<br>3. Nhập password<br>4. Click nút [Đăng nhập]                             | 1. Trả về status 400<br>2. Message: "Vui lòng cung cấp email và mật khẩu!" | TestData09 | Pass   | 18/12/2025 |                                |
| AUTH-010 | Đăng nhập thất bại - Thiếu password             | 1. Truy cập trang đăng nhập<br>2. Nhập email<br>3. Để trống password<br>4. Click nút [Đăng nhập]                             | 1. Trả về status 400<br>2. Message: "Vui lòng cung cấp email và mật khẩu!" | TestData10 | Pass   | 18/12/2025 |                                |
| AUTH-011 | Đăng nhập với tài khoản chưa xác thực (verify)  | 1. Đăng nhập với tài khoản có active = "verify"<br>2. Nhập email và password đúng<br>3. Click nút [Đăng nhập]                | 1. Tự động active tài khoản<br>2. Trả về status 201<br>3. Trả về token JWT | TestData11 | Pass   | 18/12/2025 | Tài khoản có active = "verify" |

---

### Function C: Đăng xuất (Logout)

| ID       | Test Case Description | Test Case Procedure                                   | Expected Output                                                                               | Test Data  | Result | Test Date  | Description               |
| -------- | --------------------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------- | ---------- | ------ | ---------- | ------------------------- |
| AUTH-012 | Đăng xuất thành công  | 1. Đăng nhập vào hệ thống<br>2. Click nút [Đăng xuất] | 1. Trả về status 200<br>2. Cookie jwt được set = "loggedout"<br>3. Cookie hết hạn sau 10 giây | TestData12 | Pass   | 18/12/2025 | Đã đăng nhập vào hệ thống |

---

### Function D: Xác thực tài khoản (Verify User)

| ID       | Test Case Description                       | Test Case Procedure                                                                                         | Expected Output                                                                | Test Data  | Result | Test Date  | Description              |
| -------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ---------- | ------ | ---------- | ------------------------ |
| AUTH-013 | Xác thực tài khoản thành công với mã hợp lệ | 1. Đăng ký tài khoản mới<br>2. Nhận mã xác thực qua email<br>3. Nhập mã xác thực<br>4. Click nút [Xác thực] | 1. Trả về status 200<br>2. User active = "active"<br>3. Trả về token JWT       | TestData13 | Fail   | 18/12/2025 | Mã xác thực còn hiệu lực |
| AUTH-014 | Xác thực thất bại - Mã không hợp lệ         | 1. Nhập mã xác thực sai<br>2. Click nút [Xác thực]                                                          | 1. Trả về status 400<br>2. Message: "Mã xác nhận không hợp lệ hoặc đã hết hạn" | TestData14 | Fail   | 18/12/2025 |                          |

---

### Function E: Quên mật khẩu (Forgot Password)

| ID       | Test Case Description                 | Test Case Procedure                                                                    | Expected Output                                                                                | Test Data  | Result | Test Date  | Description            |
| -------- | ------------------------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------- | ------ | ---------- | ---------------------- |
| AUTH-015 | Gửi mã reset password thành công      | 1. Truy cập trang quên mật khẩu<br>2. Nhập email đã đăng ký<br>3. Click nút [Gửi mã]   | 1. Trả về status 200<br>2. Message: "Token sent to email!"<br>3. Email chứa mã reset được gửi  | TestData15 | Pass   | 18/12/2025 | Email tồn tại trong DB |
| AUTH-016 | Gửi mã thất bại - Email không tồn tại | 1. Truy cập trang quên mật khẩu<br>2. Nhập email chưa đăng ký<br>3. Click nút [Gửi mã] | 1. Trả về status 404<br>2. Message: "Tài khoản này không tồn tại. Vui lòng đăng ký để sử dụng" | TestData16 | Pass   | 18/12/2025 |                        |

---

### Function F: Xác thực mã Reset Password (Verify Reset Pass)

| ID       | Test Case Description                   | Test Case Procedure                                                      | Expected Output                                                          | Test Data  | Result | Test Date  | Description                     |
| -------- | --------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------ | ---------- | ------ | ---------- | ------------------------------- |
| AUTH-017 | Xác thực mã reset thành công            | 1. Nhận mã reset từ email<br>2. Nhập mã reset<br>3. Click nút [Xác thực] | 1. Trả về status 200<br>2. Trả về hashedToken                            | TestData17 | Pass   | 18/12/2025 | Mã reset còn hiệu lực (10 phút) |
| AUTH-018 | Xác thực mã reset thất bại - Mã hết hạn | 1. Nhập mã reset đã quá 10 phút<br>2. Click nút [Xác thực]               | 1. Trả về status 400<br>2. Message: "Token không hợp lệ hoặc đã hết hạn" | TestData18 | Pass   | 18/12/2025 |                                 |

---

### Function G: Đặt lại mật khẩu (Reset Password)

| ID       | Test Case Description                     | Test Case Procedure                                                                                                                                 | Expected Output                                                                                                   | Test Data  | Result | Test Date  | Description        |
| -------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ---------- | ------ | ---------- | ------------------ |
| AUTH-019 | Đặt lại mật khẩu thành công               | 1. Xác thực mã reset thành công<br>2. Nhập password mới: "NewPass@123"<br>3. Nhập passwordConfirm: "NewPass@123"<br>4. Click nút [Đặt lại mật khẩu] | 1. Trả về status 200<br>2. Password được cập nhật<br>3. Trả về token JWT mới<br>4. passwordResetToken = undefined | TestData19 | Fail   | 18/12/2025 | Token reset hợp lệ |
| AUTH-020 | Đặt lại mật khẩu thất bại - Token hết hạn | 1. Sử dụng token đã hết hạn<br>2. Nhập password mới<br>3. Click nút [Đặt lại mật khẩu]                                                              | 1. Trả về status 400<br>2. Message: "Token không hợp lệ hoặc đã hết hạn"                                          | TestData20 | Pass   | 18/12/2025 |                    |

---

### Function H: Đổi mật khẩu (Update Password)

| ID       | Test Case Description                         | Test Case Procedure                                                                                                                                                              | Expected Output                                                              | Test Data  | Result | Test Date  | Description  |
| -------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ---------- | ------ | ---------- | ------------ |
| AUTH-021 | Đổi mật khẩu thành công                       | 1. Đăng nhập vào hệ thống<br>2. Truy cập trang đổi mật khẩu<br>3. Nhập mật khẩu hiện tại đúng<br>4. Nhập mật khẩu mới<br>5. Xác nhận mật khẩu mới<br>6. Click nút [Đổi mật khẩu] | 1. Trả về status 200<br>2. Password được cập nhật<br>3. Trả về token JWT mới | TestData21 | Pass   | 18/12/2025 | Đã đăng nhập |
| AUTH-022 | Đổi mật khẩu thất bại - Mật khẩu hiện tại sai | 1. Đăng nhập vào hệ thống<br>2. Nhập mật khẩu hiện tại sai<br>3. Nhập mật khẩu mới<br>4. Click nút [Đổi mật khẩu]                                                                | 1. Trả về status 401<br>2. Message: "Mật khẩu hiện tại chưa chính xác."      | TestData22 | Pass   | 18/12/2025 |              |

---

### Function I: Bảo vệ Route (Protect Middleware)

| ID       | Test Case Description                  | Test Case Procedure                                                                          | Expected Output                                                                              | Test Data  | Result | Test Date  | Description      |
| -------- | -------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ---------- | ------ | ---------- | ---------------- |
| AUTH-023 | Truy cập route bảo vệ với token hợp lệ | 1. Đăng nhập để có token<br>2. Gửi request với Bearer token<br>3. Truy cập route được bảo vệ | 1. Truy cập thành công<br>2. req.user được set                                               | TestData23 | Pass   | 18/12/2025 | Token JWT hợp lệ |
| AUTH-024 | Truy cập route bảo vệ không có token   | 1. Không đăng nhập<br>2. Truy cập route được bảo vệ                                          | 1. Trả về status 401<br>2. Message: "Bạn chưa đăng nhập hoặc đăng ký. Vui lòng thực hiện!!!" | TestData24 | Pass   | 18/12/2025 |                  |

---

### Function J: Phân quyền (RestrictTo Middleware)

| ID       | Test Case Description              | Test Case Procedure                                                              | Expected Output                                                    | Test Data  | Result | Test Date  | Description           |
| -------- | ---------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ---------- | ------ | ---------- | --------------------- |
| AUTH-025 | Truy cập route admin với role user | 1. Đăng nhập với tài khoản role = "user"<br>2. Truy cập route chỉ dành cho admin | 1. Trả về status 403<br>2. Message: "Bạn không có quyền thực hiện" | TestData25 | Pass   | 18/12/2025 | User có role = "user" |

---

## Test Data

| Test Data ID | Data Description                                                                                       |
| ------------ | ------------------------------------------------------------------------------------------------------ |
| TestData01   | name: "Nguyen Van A", email: "newuser@example.com", password: "Test@123", passwordConfirm: "Test@123"  |
| TestData02   | name: "Nguyen Van B", email: "existing@example.com", password: "Test@123", passwordConfirm: "Test@123" |
| TestData03   | name: "Nguyen Van C", email: "test3@example.com", password: "Test@123", passwordConfirm: "Test@456"    |
| TestData04   | name: "Nguyen Van D", email: "invalid-email", password: "Test@123", passwordConfirm: "Test@123"        |
| TestData05   | name: "", email: "test5@example.com", password: "Test@123", passwordConfirm: "Test@123"                |
| TestData06   | email: "active@example.com", password: "Test@123"                                                      |
| TestData07   | email: "notexist@example.com", password: "Test@123"                                                    |
| TestData08   | email: "active@example.com", password: "WrongPassword"                                                 |
| TestData09   | email: "", password: "Test@123"                                                                        |
| TestData10   | email: "active@example.com", password: ""                                                              |
| TestData11   | email: "verify@example.com", password: "Test@123" (account with active = "verify")                     |
| TestData12   | Logged in user with valid JWT token                                                                    |
| TestData13   | token: "valid-verify-token"                                                                            |
| TestData14   | token: "invalid-token-123"                                                                             |
| TestData15   | email: "existing@example.com"                                                                          |
| TestData16   | email: "notexist@example.com"                                                                          |
| TestData17   | token: "valid-reset-token" (within 10 minutes)                                                         |
| TestData18   | token: "expired-reset-token" (after 10 minutes)                                                        |
| TestData19   | token: "valid-reset-token", password: "NewPass@123", passwordConfirm: "NewPass@123"                    |
| TestData20   | token: "expired-token", password: "NewPass@123", passwordConfirm: "NewPass@123"                        |
| TestData21   | passwordCurrent: "Test@123", password: "NewPass@123", passwordConfirm: "NewPass@123"                   |
| TestData22   | passwordCurrent: "WrongCurrent", password: "NewPass@123", passwordConfirm: "NewPass@123"               |
| TestData23   | Authorization: "Bearer valid-jwt-token"                                                                |
| TestData24   | No Authorization header                                                                                |
| TestData25   | User with role = "user" accessing admin route                                                          |

---

## Báo Cáo Test Tự Động (GitHub Actions)

### 📊 Tổng Quan Test Results

| Metric          | Value      | Status             |
| --------------- | ---------- | ------------------ |
| **Total Tests** | 31         | -                  |
| **✅ Passed**   | 26         | 83.87%             |
| **❌ Failed**   | 5          | 16.13% - Cần xử lý |
| **Branch**      | weblau     | -                  |
| **Test Date**   | 18/12/2025 | -                  |

### ❌ Chi Tiết Các Test Failed

| STT | Test Suite      | Test Case Description                                          | Test ID Mapping | Status    | Note                                             |
| --- | --------------- | -------------------------------------------------------------- | --------------- | --------- | ------------------------------------------------ |
| 1   | verifyUser      | Nên xác thực user thành công với token hợp lệ                  | AUTH-013        | ❌ Failed | Cần kiểm tra logic xác thực token                |
| 2   | verifyUser      | Nên trả về lỗi khi token không hợp lệ                          | AUTH-014        | ❌ Failed | Cần kiểm tra error handling                      |
| 3   | resetPassword   | Nên đặt lại mật khẩu thành công với token hợp lệ               | AUTH-019        | ❌ Failed | Cần kiểm tra logic reset password                |
| 4   | protect         | Nên trả về lỗi khi password đã thay đổi sau khi token được tạo | -               | ❌ Failed | Test bổ sung - chưa có trong danh sách test case |
| 5   | changeStateUser | Nên thay đổi trạng thái user thành công                        | -               | ❌ Failed | Test bổ sung - chưa có trong danh sách test case |

### 📋 Test Cases Bổ Sung (Không có trong danh sách AUTH-001 đến AUTH-025)

Có **6 test cases** trong Jest test suite không có trong danh sách test case chính thức:

1. **signupAdmin** - Đăng ký tài khoản Admin (2 tests)

   - ✅ Nên tạo admin với thông tin hợp lệ
   - ✅ Nên trả về lỗi khi thiếu thông tin

2. **protect - Password Changed** (1 test)

   - ❌ Nên trả về lỗi khi password đã thay đổi sau khi token được tạo

3. **changeStateUser** (2 tests)

   - ❌ Nên thay đổi trạng thái user thành công
   - ✅ Nên trả về lỗi khi user không tồn tại

4. **Protect - Token Expired/Invalid** (1 test bổ sung)
   - ✅ Test các trường hợp token hết hạn hoặc không hợp lệ

> **Khuyến nghị:** Cần bổ sung các test case này vào danh sách chính thức (AUTH-026 đến AUTH-031)

### 🎯 Độ Coverage Theo Function

| Function              | Test Cases | Passed | Failed | Pass Rate |
| --------------------- | ---------- | ------ | ------ | --------- |
| Signup                | 3          | 3      | 0      | 100% ✅   |
| SignupAdmin           | 2          | 2      | 0      | 100% ✅   |
| Login                 | 5          | 5      | 0      | 100% ✅   |
| VerifyUser            | 2          | 0      | 2      | 0% ❌     |
| ForgotPassword        | 2          | 2      | 0      | 100% ✅   |
| VerifyResetPass       | 2          | 2      | 0      | 100% ✅   |
| ResetPassword         | 2          | 1      | 1      | 50% ⚠️    |
| UpdatePassword        | 2          | 2      | 0      | 100% ✅   |
| Logout                | 1          | 1      | 0      | 100% ✅   |
| Protect Middleware    | 5          | 4      | 1      | 80% ⚠️    |
| RestrictTo Middleware | 3          | 3      | 0      | 100% ✅   |
| ChangeStateUser       | 2          | 1      | 1      | 50% ⚠️    |

### 🔧 Hành Động Tiếp Theo

**Ưu tiên cao:**

1. ✅ Fix function `verifyUser` (AUTH-013, AUTH-014) - 0% pass rate
2. ⚠️ Fix function `resetPassword` (AUTH-019) - 50% pass rate
3. ⚠️ Fix function `protect` - Test password changed scenario
4. ⚠️ Fix function `changeStateUser` - Test thay đổi trạng thái

**Ưu tiên trung bình:**

- Bổ sung test cases chính thức cho SignupAdmin và ChangeStateUser (AUTH-026 đến AUTH-031)
- Viết tài liệu hướng dẫn fix các test failed

---

## Ghi chú

1. **API Endpoints:**

   - POST `/api/v1/users/signup` - Đăng ký
   - POST `/api/v1/users/login` - Đăng nhập
   - GET `/api/v1/users/logout` - Đăng xuất
   - POST `/api/v1/users/verify` - Xác thực tài khoản
   - POST `/api/v1/users/forgotPassword` - Quên mật khẩu
   - POST `/api/v1/users/verifyResetPass` - Xác thực mã reset
   - PATCH `/api/v1/users/resetPassword/:token` - Đặt lại mật khẩu
   - PATCH `/api/v1/users/updateMyPassword` - Đổi mật khẩu

2. **Roles trong hệ thống:**

   - `user`: Người dùng thông thường
   - `employee`: Nhân viên
   - `admin`: Quản trị viên

3. **Trạng thái tài khoản (active):**
   - `active`: Đã kích hoạt
   - `verify`: Chờ xác thực
   - `ban`: Bị khóa
