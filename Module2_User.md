# Module2 - User Management (Quản lý Người dùng)

## Thông tin Module

|                      |                                                                                                                                             |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Module Code**      | Module2                                                                                                                                     |
| **Test Requirement** | Test các chức năng quản lý người dùng: Xem/Cập nhật thông tin cá nhân, Quản lý địa chỉ giao hàng, Xóa tài khoản, Quản lý người dùng (Admin) |
| **Tester**           | HaoPham                                                                                                                                     |
| **Test Date**        | 18/12/2025 (GitHub Actions - Branch: weblau)                                                                                                |

---

## Thống kê Test Case

| Pass | Fail | Untested | N/A | Number of Test Cases |
| ---- | ---- | -------- | --- | -------------------- |
| 23   | 7    | 0        | 0   | 30                   |

> **Ghi chú:** Kết quả từ GitHub Actions - Branch `weblau` - Test Date: 18/12/2025

---

## Chi tiết Test Case

### Function A: Xem thông tin cá nhân (Get Me)

| ID       | Test Case Description                       | Test Case Procedure                                                  | Expected Output                                                                       | Test Data  | Result | Test Date  | Description    |
| -------- | ------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ---------- | ------ | ---------- | -------------- |
| USER-001 | Xem thông tin cá nhân thành công            | 1. Đăng nhập vào hệ thống<br>2. Gọi API GET /api/v1/users/me         | 1. Trả về status 200<br>2. Trả về thông tin user (name, email, avatar, gender, phone) | TestData01 | Pass   | 18/12/2025 | Đã đăng nhập   |
| USER-002 | Xem thông tin thất bại - Chưa đăng nhập     | 1. Không đăng nhập<br>2. Gọi API GET /api/v1/users/me                | 1. Trả về status 401<br>2. Message: "Bạn chưa đăng nhập..."                           | TestData02 | Pass   | 18/12/2025 | Không có token |
| USER-003 | Xem thông tin thất bại - Token không hợp lệ | 1. Gọi API với token không hợp lệ<br>2. Gọi API GET /api/v1/users/me | 1. Trả về status 401<br>2. Message lỗi token                                          | TestData03 | Pass   | 18/12/2025 | Token invalid  |

---

### Function B: Cập nhật thông tin cá nhân (Update Me)

| ID       | Test Case Description                          | Test Case Procedure                                                                            | Expected Output                                                                 | Test Data  | Result | Test Date  | Description             |
| -------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ---------- | ------ | ---------- | ----------------------- |
| USER-004 | Cập nhật thông tin thành công                  | 1. Đăng nhập vào hệ thống<br>2. Gọi API PATCH /updateMe<br>3. Gửi dữ liệu: name, phone, gender | 1. Trả về status 200<br>2. Thông tin user được cập nhật                         | TestData04 | Fail   | 18/12/2025 | Đã đăng nhập            |
| USER-005 | Cập nhật avatar thành công                     | 1. Đăng nhập vào hệ thống<br>2. Gọi API PATCH /updateMe<br>3. Gửi avatar URL mới               | 1. Trả về status 200<br>2. Avatar được cập nhật                                 | TestData05 | Fail   | 18/12/2025 | Đã đăng nhập            |
| USER-006 | Cập nhật thất bại - Gửi password trong request | 1. Đăng nhập vào hệ thống<br>2. Gọi API PATCH /updateMe<br>3. Gửi dữ liệu có chứa password     | 1. Trả về status 400<br>2. Message: "Trang này không dùng để thay đổi mật khẩu" | TestData06 | Pass   | 18/12/2025 | Không được đổi password |
| USER-007 | Cập nhật thất bại - Chưa đăng nhập             | 1. Không đăng nhập<br>2. Gọi API PATCH /updateMe                                               | 1. Trả về status 401<br>2. Message lỗi authentication                           | TestData07 | Fail   | 18/12/2025 | Không có token          |

---

### Function C: Xóa tài khoản (Delete Me)

| ID       | Test Case Description                   | Test Case Procedure                                      | Expected Output                                                   | Test Data  | Result | Test Date  | Description  |
| -------- | --------------------------------------- | -------------------------------------------------------- | ----------------------------------------------------------------- | ---------- | ------ | ---------- | ------------ |
| USER-008 | Xóa tài khoản thành công                | 1. Đăng nhập vào hệ thống<br>2. Gọi API DELETE /deleteMe | 1. Trả về status 204<br>2. Tài khoản chuyển sang trạng thái "ban" | TestData08 | Pass   | 18/12/2025 | Đã đăng nhập |
| USER-009 | Xóa tài khoản thất bại - Chưa đăng nhập | 1. Không đăng nhập<br>2. Gọi API DELETE /deleteMe        | 1. Trả về status 401<br>2. Message lỗi authentication             | TestData09 | Fail   | 18/12/2025 |              |

---

### Function D: Thêm địa chỉ giao hàng (Create Address)

| ID       | Test Case Description                            | Test Case Procedure                                                                                                   | Expected Output                                                                | Test Data  | Result | Test Date  | Description              |
| -------- | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ---------- | ------ | ---------- | ------------------------ |
| USER-010 | Thêm địa chỉ đầu tiên thành công                 | 1. Đăng nhập vào hệ thống<br>2. Gọi API PATCH /createAddress<br>3. Gửi: name, phone, province, district, ward, detail | 1. Trả về status 200<br>2. Địa chỉ được thêm vào mảng<br>3. setDefault = true  | TestData10 | Pass   | 18/12/2025 | User chưa có địa chỉ nào |
| USER-011 | Thêm địa chỉ thứ hai thành công                  | 1. Đăng nhập (đã có 1 địa chỉ)<br>2. Gọi API PATCH /createAddress<br>3. Gửi thông tin địa chỉ mới                     | 1. Trả về status 200<br>2. Địa chỉ được thêm vào mảng<br>3. setDefault = false | TestData11 | Fail   | 18/12/2025 | User đã có 1 địa chỉ     |
| USER-012 | Thêm địa chỉ thất bại - Thiếu thông tin bắt buộc | 1. Đăng nhập vào hệ thống<br>2. Gọi API PATCH /createAddress<br>3. Gửi dữ liệu thiếu trường name                      | 1. Trả về lỗi validation<br>2. Địa chỉ không được thêm                         | TestData12 | Pass   | 18/12/2025 |                          |

---

### Function E: Xem danh sách địa chỉ (Get User Address)

| ID       | Test Case Description                   | Test Case Procedure                                     | Expected Output                                         | Test Data  | Result | Test Date  | Description               |
| -------- | --------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------- | ---------- | ------ | ---------- | ------------------------- |
| USER-013 | Xem danh sách địa chỉ thành công        | 1. Đăng nhập vào hệ thống<br>2. Gọi API GET /me/address | 1. Trả về status 200<br>2. Trả về mảng địa chỉ của user | TestData13 | Pass   | 18/12/2025 | User có ít nhất 1 địa chỉ |
| USER-014 | Xem danh sách địa chỉ - Chưa có địa chỉ | 1. Đăng nhập vào hệ thống<br>2. Gọi API GET /me/address | 1. Trả về status 200<br>2. Trả về mảng rỗng []          | TestData14 | Pass   | 18/12/2025 | User chưa có địa chỉ      |

---

### Function F: Cập nhật địa chỉ (Update Address)

| ID       | Test Case Description                        | Test Case Procedure                                                                                          | Expected Output                                                        | Test Data  | Result | Test Date  | Description             |
| -------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- | ---------- | ------ | ---------- | ----------------------- |
| USER-015 | Cập nhật địa chỉ thành công                  | 1. Đăng nhập (có ít nhất 1 địa chỉ)<br>2. Gọi API PATCH /updateAddress<br>3. Gửi id và thông tin địa chỉ mới | 1. Trả về status 200<br>2. Message: "...updated address successfully." | TestData15 | Pass   | 18/12/2025 | User có địa chỉ index 0 |
| USER-016 | Cập nhật địa chỉ thất bại - ID không tồn tại | 1. Đăng nhập vào hệ thống<br>2. Gọi API PATCH /updateAddress<br>3. Gửi id không tồn tại (vd: id=999)         | 1. Trả về status 500<br>2. Message: "This data is not exist..."        | TestData16 | Pass   | 18/12/2025 |                         |

---

### Function G: Xóa địa chỉ (Delete Address)

| ID       | Test Case Description                                | Test Case Procedure                                                                         | Expected Output                                                                  | Test Data  | Result | Test Date  | Description                   |
| -------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ---------- | ------ | ---------- | ----------------------------- |
| USER-017 | Xóa địa chỉ thành công (không phải địa chỉ mặc định) | 1. Đăng nhập (có ít nhất 2 địa chỉ)<br>2. Gọi API PATCH /deleteAddress<br>3. Gửi id địa chỉ | 1. Trả về status 200<br>2. Message: "Delete address successfully."               | TestData17 | Pass   | 18/12/2025 | Xóa địa chỉ index 1           |
| USER-018 | Xóa địa chỉ mặc định thành công                      | 1. Đăng nhập (có ít nhất 2 địa chỉ)<br>2. Gọi API PATCH /deleteAddress<br>3. Gửi id=0       | 1. Trả về status 200<br>2. Địa chỉ tiếp theo trở thành default (setDefault=true) | TestData18 | Pass   | 18/12/2025 | Xóa địa chỉ default (index 0) |
| USER-019 | Xóa địa chỉ thất bại - ID không tồn tại              | 1. Đăng nhập vào hệ thống<br>2. Gọi API PATCH /deleteAddress<br>3. Gửi id không tồn tại     | 1. Trả về status 500<br>2. Message: "This data is not exist..."                  | TestData19 | Pass   | 18/12/2025 |                               |

---

### Function H: Đặt địa chỉ mặc định (Set Default Address)

| ID       | Test Case Description                    | Test Case Procedure                                                                             | Expected Output                                                                  | Test Data  | Result | Test Date  | Description           |
| -------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ---------- | ------ | ---------- | --------------------- |
| USER-020 | Đặt địa chỉ mặc định thành công          | 1. Đăng nhập (có ít nhất 2 địa chỉ)<br>2. Gọi API PATCH /setDefaultAddress<br>3. Gửi id địa chỉ | 1. Trả về status 200<br>2. Địa chỉ được đặt làm default<br>3. Địa chỉ cũ = false | TestData20 | Pass   | 18/12/2025 | User có nhiều địa chỉ |
| USER-021 | Đặt mặc định thất bại - ID không tồn tại | 1. Đăng nhập vào hệ thống<br>2. Gọi API PATCH /setDefaultAddress<br>3. Gửi id không tồn tại     | 1. Trả về status 500<br>2. Message: "This data is not exist..."                  | TestData21 | Pass   | 18/12/2025 |                       |

---

### Function I: Quản lý người dùng - Xem danh sách (Admin - Get All Users)

| ID       | Test Case Description                         | Test Case Procedure                                         | Expected Output                                             | Test Data  | Result | Test Date  | Description  |
| -------- | --------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------- | ---------- | ------ | ---------- | ------------ |
| USER-022 | Admin xem danh sách người dùng thành công     | 1. Đăng nhập với role=admin<br>2. Gọi API GET /api/v1/users | 1. Trả về status 200<br>2. Trả về danh sách tất cả users    | TestData22 | Pass   | 18/12/2025 | Role = admin |
| USER-023 | Xem danh sách thất bại - Không có quyền admin | 1. Đăng nhập với role=user<br>2. Gọi API GET /api/v1/users  | 1. Trả về status 403<br>2. Message: "Bạn không có quyền..." | TestData23 | Pass   | 18/12/2025 | Role = user  |

---

### Function J: Quản lý người dùng - Xem chi tiết (Admin - Get User)

| ID       | Test Case Description                      | Test Case Procedure                                                    | Expected Output                                            | Test Data  | Result | Test Date  | Description  |
| -------- | ------------------------------------------ | ---------------------------------------------------------------------- | ---------------------------------------------------------- | ---------- | ------ | ---------- | ------------ |
| USER-024 | Admin xem chi tiết người dùng thành công   | 1. Đăng nhập với role=admin<br>2. Gọi API GET /api/v1/users/:id        | 1. Trả về status 200<br>2. Trả về thông tin user cụ thể    | TestData24 | Fail   | 18/12/2025 | Role = admin |
| USER-025 | Xem chi tiết thất bại - User không tồn tại | 1. Đăng nhập với role=admin<br>2. Gọi API GET /api/v1/users/:invalidId | 1. Trả về status 404<br>2. Message: "No document found..." | TestData25 | Pass   | 18/12/2025 |              |

---

### Function K: Quản lý người dùng - Cập nhật (Admin - Update User)

| ID       | Test Case Description                    | Test Case Procedure                                                                     | Expected Output                                            | Test Data  | Result | Test Date  | Description  |
| -------- | ---------------------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ---------- | ------ | ---------- | ------------ |
| USER-026 | Admin cập nhật thông tin user thành công | 1. Đăng nhập với role=admin<br>2. Gọi API PATCH /api/v1/users/:id<br>3. Gửi dữ liệu mới | 1. Trả về status 200<br>2. Thông tin user được cập nhật    | TestData26 | Fail   | 18/12/2025 | Role = admin |
| USER-027 | Cập nhật thất bại - User không tồn tại   | 1. Đăng nhập với role=admin<br>2. Gọi API PATCH /api/v1/users/:invalidId                | 1. Trả về status 404<br>2. Message: "No document found..." | TestData27 | Pass   | 18/12/2025 |              |

---

### Function L: Quản lý người dùng - Xóa (Admin - Delete User)

| ID       | Test Case Description               | Test Case Procedure                                                       | Expected Output                                             | Test Data  | Result | Test Date  | Description  |
| -------- | ----------------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------- | ---------- | ------ | ---------- | ------------ |
| USER-028 | Admin xóa người dùng thành công     | 1. Đăng nhập với role=admin<br>2. Gọi API DELETE /api/v1/users/:id        | 1. Trả về status 204<br>2. User được xóa khỏi database      | TestData28 | Pass   | 18/12/2025 | Role = admin |
| USER-029 | Xóa thất bại - User không tồn tại   | 1. Đăng nhập với role=admin<br>2. Gọi API DELETE /api/v1/users/:invalidId | 1. Trả về status 404<br>2. Message: "No document found..."  | TestData29 | Pass   | 18/12/2025 |              |
| USER-030 | Xóa thất bại - Không có quyền admin | 1. Đăng nhập với role=user<br>2. Gọi API DELETE /api/v1/users/:id         | 1. Trả về status 403<br>2. Message: "Bạn không có quyền..." | TestData30 | Pass   | 18/12/2025 | Role = user  |

---

## Test Data

| Test Data ID | Data Description                                                                                                                        |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| TestData01   | Logged in user with valid JWT token                                                                                                     |
| TestData02   | No Authorization header                                                                                                                 |
| TestData03   | Authorization: "Bearer invalid-token-xyz"                                                                                               |
| TestData04   | {name: "Nguyen Van Updated", phone: "0123456789", gender: "male"}                                                                       |
| TestData05   | {avatar: "https://example.com/avatar.jpg"}                                                                                              |
| TestData06   | {name: "Test", password: "newpass123", passwordConfirm: "newpass123"}                                                                   |
| TestData07   | No Authorization header for updateMe                                                                                                    |
| TestData08   | Logged in user calling DELETE /deleteMe                                                                                                 |
| TestData09   | No Authorization header for deleteMe                                                                                                    |
| TestData10   | {name: "Home", phone: "0123456789", province: "Hanoi", district: "Cau Giay", ward: "Dich Vong", detail: "123 Street"}                   |
| TestData11   | {name: "Office", phone: "0987654321", province: "HCMC", district: "District 1", ward: "Ben Nghe", detail: "456 Road"}                   |
| TestData12   | {phone: "0123456789", province: "Hanoi"} (missing name)                                                                                 |
| TestData13   | User with at least 1 address in database                                                                                                |
| TestData14   | User with empty address array []                                                                                                        |
| TestData15   | {id: 0, name: "Home Updated", phone: "0111111111", province: "Hanoi", district: "Dong Da", ward: "Khuong Thuong", detail: "789 Avenue"} |
| TestData16   | {id: 999, name: "Invalid"}                                                                                                              |
| TestData17   | {id: 1} (delete second address, not default)                                                                                            |
| TestData18   | {id: 0} (delete default address)                                                                                                        |
| TestData19   | {id: 999} (invalid address id)                                                                                                          |
| TestData20   | {id: 1} (set address at index 1 as default)                                                                                             |
| TestData21   | {id: 999} (invalid address id)                                                                                                          |
| TestData22   | Admin user with role="admin"                                                                                                            |
| TestData23   | Regular user with role="user"                                                                                                           |
| TestData24   | Admin requesting GET /api/v1/users/:validUserId                                                                                         |
| TestData25   | Admin requesting GET /api/v1/users/invalidid123                                                                                         |
| TestData26   | Admin requesting PATCH /api/v1/users/:id with {name: "Updated Name"}                                                                    |
| TestData27   | Admin requesting PATCH /api/v1/users/invalidid123                                                                                       |
| TestData28   | Admin requesting DELETE /api/v1/users/:validUserId                                                                                      |
| TestData29   | Admin requesting DELETE /api/v1/users/invalidid123                                                                                      |
| TestData30   | Regular user requesting DELETE /api/v1/users/:id                                                                                        |

---

## Báo Cáo Test Tự Động (GitHub Actions)

### 📊 Tổng Quan Test Results

| Metric          | Value      | Status             |
| --------------- | ---------- | ------------------ |
| **Total Tests** | 30         | -                  |
| **✅ Passed**   | 23         | 76.67%             |
| **❌ Failed**   | 7          | 23.33% - Cần xử lý |
| **Branch**      | weblau     | -                  |
| **Test Date**   | 18/12/2025 | -                  |

### ❌ Chi Tiết Các Test Failed

| STT | Test Suite        | Test Case Description              | Test ID  | Status    | Note                                |
| --- | ----------------- | ---------------------------------- | -------- | --------- | ----------------------------------- |
| 1   | updateMe          | Cập nhật thông tin user thành công | USER-004 | ❌ Failed | Cần kiểm tra logic update           |
| 2   | updateMe          | Cập nhật avatar thành công         | USER-005 | ❌ Failed | Cần kiểm tra update avatar          |
| 3   | updateMe          | Trả về lỗi khi chưa đăng nhập      | USER-007 | ❌ Failed | Cần kiểm tra error handling         |
| 4   | deleteMe          | Trả về lỗi khi chưa đăng nhập      | USER-009 | ❌ Failed | Cần kiểm tra authentication         |
| 5   | createAddress     | Thêm địa chỉ thứ hai thành công    | USER-011 | ❌ Failed | Cần kiểm tra logic setDefault=false |
| 6   | Admin Get User    | Admin xem chi tiết user thành công | USER-024 | ❌ Failed | Cần kiểm tra factory.getOne         |
| 7   | Admin Update User | Admin cập nhật user thành công     | USER-026 | ❌ Failed | Cần kiểm tra factory.updateOne      |

### 🎯 Độ Coverage Theo Function

| Function            | Test Cases | Passed | Failed | Pass Rate |
| ------------------- | ---------- | ------ | ------ | --------- |
| Get Me              | 3          | 3      | 0      | 100% ✅   |
| Update Me           | 4          | 1      | 3      | 25% ❌    |
| Delete Me           | 2          | 1      | 1      | 50% ⚠️    |
| Create Address      | 3          | 2      | 1      | 67% ⚠️    |
| Get User Address    | 2          | 2      | 0      | 100% ✅   |
| Update Address      | 2          | 2      | 0      | 100% ✅   |
| Delete Address      | 3          | 3      | 0      | 100% ✅   |
| Set Default Address | 2          | 2      | 0      | 100% ✅   |
| Get All Users       | 2          | 2      | 0      | 100% ✅   |
| Get User (Admin)    | 2          | 1      | 1      | 50% ⚠️    |
| Update User (Admin) | 2          | 1      | 1      | 50% ⚠️    |
| Delete User (Admin) | 3          | 3      | 0      | 100% ✅   |

### 📋 Phân Loại Theo Nhóm Chức Năng

**👤 Personal Info Management (9 tests)**

- ✅ Passed: 5 tests
- ❌ Failed: 4 tests
- Pass Rate: 55.56%

**📍 Address Management (12 tests)**

- ✅ Passed: 11 tests
- ❌ Failed: 1 test
- Pass Rate: 91.67%

**🔐 Admin Functions (9 tests)**

- ✅ Passed: 7 tests
- ❌ Failed: 2 tests
- Pass Rate: 77.78%

### 🔧 Hành Động Tiếp Theo

**Ưu tiên cao:**

1. ❌ Fix function `updateMe` (USER-004, USER-005, USER-007) - 25% pass rate
2. ⚠️ Fix function `deleteMe` (USER-009) - 50% pass rate
3. ⚠️ Fix function `createAddress` (USER-011) - 67% pass rate

**Ưu tiên trung bình:** 4. ⚠️ Fix Admin `getUser` (USER-024) - 50% pass rate 5. ⚠️ Fix Admin `updateUser` (USER-026) - 50% pass rate

**Khuyến nghị:**

- Test cases liên quan đến `req.user` authentication cần kiểm tra lại
- Factory functions (getOne, updateOne) cần mock chính xác hơn
- Address management logic hoạt động tốt (91.67% pass rate)

### 📈 So Sánh với Module 1

| Module         | Total Tests | Passed | Failed | Pass Rate |
| -------------- | ----------- | ------ | ------ | --------- |
| Module1 (Auth) | 31          | 26     | 5      | 83.87%    |
| Module2 (User) | 30          | 23     | 7      | 76.67%    |

---

## Ghi chú

1. **API Endpoints:**

   - GET `/api/v1/users/me` - Xem thông tin cá nhân
   - PATCH `/api/v1/users/updateMe` - Cập nhật thông tin cá nhân
   - DELETE `/api/v1/users/deleteMe` - Xóa tài khoản (chuyển sang ban)
   - GET `/api/v1/users/me/address` - Xem danh sách địa chỉ
   - PATCH `/api/v1/users/createAddress` - Thêm địa chỉ mới
   - PATCH `/api/v1/users/updateAddress` - Cập nhật địa chỉ
   - PATCH `/api/v1/users/deleteAddress` - Xóa địa chỉ
   - PATCH `/api/v1/users/setDefaultAddress` - Đặt địa chỉ mặc định
   - GET `/api/v1/users` - Xem danh sách người dùng (Admin)
   - GET `/api/v1/users/:id` - Xem chi tiết người dùng (Admin)
   - PATCH `/api/v1/users/:id` - Cập nhật người dùng (Admin)
   - DELETE `/api/v1/users/:id` - Xóa người dùng (Admin)

2. **Trường có thể cập nhật trong updateMe:**

   - `name`: Tên người dùng
   - `avatar`: URL ảnh đại diện
   - `gender`: Giới tính
   - `dateOfBirth`: Ngày sinh
   - `phone`: Số điện thoại

3. **Cấu trúc Address:**

   - `name`: Tên người nhận
   - `phone`: Số điện thoại người nhận
   - `province`: Tỉnh/Thành phố
   - `district`: Quận/Huyện
   - `ward`: Phường/Xã
   - `detail`: Địa chỉ chi tiết
   - `setDefault`: Địa chỉ mặc định (true/false)

4. **Roles trong hệ thống:**

   - `user`: Người dùng thông thường
   - `employee`: Nhân viên
   - `admin`: Quản trị viên

5. **Trạng thái tài khoản (active):**
   - `active`: Đã kích hoạt
   - `verify`: Chờ xác thực
   - `ban`: Bị khóa
