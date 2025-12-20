# Integration Tests - System Test Report (Báo Cáo Kiểm Thử Tích Hợp)

## Thông tin Module

|                      |                                                                                                       |
| -------------------- | ----------------------------------------------------------------------------------------------------- |
| **Module Code**      | Integration Tests - System Tests                                                                      |
| **Test Requirement** | Test các flow nghiệp vụ hoàn chỉnh: Đăng nhập, Mua hàng, Thanh toán, Đánh giá, Quản lý sản phẩm, etc. |
| **Tester**           | HaoPham                                                                                               |
| **Test Date**        | 18/12/2025 (GitHub Actions - Branch: weblau)                                                          |

---

## Thống kê Test Case

| Pass | Fail | Untested | N/A | Number of Test Cases |
| ---- | ---- | -------- | --- | -------------------- |
| 65   | 34   | 0        | 0   | 99                   |

> **Ghi chú:** Kết quả từ GitHub Actions - Branch `weblau` - Test Date: 18/12/2025  
> **Automated Tests:** 99 integration tests - 65 Passed, 34 Failed  
> **Pass Rate:** 65.66%

---

## Chi tiết Test Case

### Flow 1: Đăng nhập --> Mua hàng

| ID      | Test Case Description                             | Test Case Procedure                                          | Expected Output                                                   | Test Data  | Result    | Test Date  | Description                     |
| ------- | ------------------------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------- | ---------- | --------- | ---------- | ------------------------------- |
| INT-001 | Tạo đơn hàng thành công sau khi đăng nhập         | 1. Đăng nhập<br>2. POST /api/v1/orders                       | 1. Trả về status 201<br>2. Đơn hàng được tạo<br>3. Inventory giảm | TestData01 | ❌ Failed | 18/12/2025 | expect(received).toBe(expected) |
| INT-002 | Trả về lỗi khi thiếu thông tin bắt buộc (address) | 1. Đăng nhập<br>2. POST /api/v1/orders (thiếu address)       | 1. Trả về status 400<br>2. Message validation error               | TestData02 | ❌ Failed | 18/12/2025 | expect(received).toBe(expected) |
| INT-003 | Xem được chi tiết đơn hàng đã tạo                 | 1. Đăng nhập<br>2. Tạo đơn hàng<br>3. GET /api/v1/orders/:id | 1. Trả về status 200<br>2. Trả về chi tiết đơn hàng               | TestData03 | ❌ Failed | 18/12/2025 | expect(received).toBe(expected) |

---

### Flow 2: Mua hàng --> Nhận hàng --> Đánh giá sản phẩm

| ID      | Test Case Description                                  | Test Case Procedure                                                   | Expected Output                                            | Test Data  | Result    | Test Date  | Description                     |
| ------- | ------------------------------------------------------ | --------------------------------------------------------------------- | ---------------------------------------------------------- | ---------- | --------- | ---------- | ------------------------------- |
| INT-004 | Tạo đơn hàng thành công                                | 1. User đăng nhập<br>2. POST /api/v1/orders                           | 1. Trả về status 201<br>2. Đơn hàng được tạo               | TestData04 | ❌ Failed | 18/12/2025 | expect(received).toBe(expected) |
| INT-005 | Cập nhật order status thành Success                    | 1. Admin đăng nhập<br>2. PATCH /api/v1/orders/:id {status: "Success"} | 1. Trả về status 200<br>2. Order status = "Success"        | TestData05 | ❌ Failed | 18/12/2025 | expect(received).toBe(expected) |
| INT-006 | Cập nhật ratingsAverage và ratingsQuantity của product | 1. User tạo review<br>2. Kiểm tra product ratings                     | 1. ratingsQuantity tăng<br>2. ratingsAverage được tính lại | TestData06 | ❌ Failed | 18/12/2025 | expect(received).toBe(expected) |

---

### Flow 3: Admin cập nhật trạng thái đơn --> User nhận email

| ID      | Test Case Description                         | Test Case Procedure                                                    | Expected Output                                  | Test Data  | Result    | Test Date  | Description                     |
| ------- | --------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------ | ---------- | --------- | ---------- | ------------------------------- |
| INT-007 | Tạo đơn hàng thành công                       | 1. User đăng nhập<br>2. POST /api/v1/orders                            | 1. Trả về status 201<br>2. Đơn hàng được tạo     | TestData07 | ❌ Failed | 18/12/2025 | expect(received).toBe(expected) |
| INT-008 | Cập nhật order status = Delivery và gửi email | 1. Admin đăng nhập<br>2. PATCH /api/v1/orders/:id {status: "Delivery"} | 1. Trả về status 200<br>2. Email được gửi (mock) | TestData08 | ❌ Failed | 18/12/2025 | expect(received).toBe(expected) |
| INT-009 | Cập nhật order status = Success và gửi email  | 1. Admin đăng nhập<br>2. PATCH /api/v1/orders/:id {status: "Success"}  | 1. Trả về status 200<br>2. Email được gửi (mock) | TestData09 | ❌ Failed | 18/12/2025 | expect(received).toBe(expected) |

---

### Flow 4: Mua hàng --> Thanh toán số dư --> Kiểm tra balance

| ID      | Test Case Description                  | Test Case Procedure                                                          | Expected Output                                                 | Test Data  | Result    | Test Date  | Description                     |
| ------- | -------------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------- | ---------- | --------- | ---------- | ------------------------------- |
| INT-010 | Tạo đơn hàng với thanh toán bằng số dư | 1. Đăng nhập (user có balance)<br>2. POST /api/v1/orders {payments: "số dư"} | 1. Trả về status 201<br>2. Đơn hàng được tạo<br>3. Balance giảm | TestData10 | ❌ Failed | 18/12/2025 | expect(received).toBe(expected) |
| INT-011 | Giảm balance user đúng số tiền         | 1. Tạo đơn hàng với payments="số dư"<br>2. Kiểm tra user balance             | 1. Balance giảm đúng số tiền đơn hàng                           | TestData11 | ❌ Failed | 18/12/2025 | expect(received).toBeTruthy()   |
| INT-012 | Giảm inventory sản phẩm                | 1. Tạo đơn hàng<br>2. Kiểm tra product inventory                             | 1. Inventory giảm đúng số lượng                                 | TestData12 | ❌ Failed | 18/12/2025 | expect(received).toBeTruthy()   |

---

### Flow 5: Mua hàng --> Thanh toán VNPay --> Xác nhận

| ID      | Test Case Description                        | Test Case Procedure                                                                 | Expected Output                                                    | Test Data  | Result    | Test Date  | Description                     |
| ------- | -------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ---------- | --------- | ---------- | ------------------------------- |
| INT-013 | Tạo đơn hàng với payments=vnpay              | 1. Đăng nhập<br>2. POST /api/v1/orders {payments: "vnpay"}                          | 1. Trả về status 201<br>2. Đơn hàng được tạo                       | TestData13 | ❌ Failed | 18/12/2025 | expect(received).toBe(expected) |
| INT-014 | Tạo URL thanh toán VNPay thành công          | 1. POST /api/v1/transactions/create_payment_url                                     | 1. Trả về status 201<br>2. Trả về vnpUrl                           | TestData14 | ❌ Failed | 18/12/2025 | expect(received).toBe(expected) |
| INT-015 | Xác nhận thanh toán VNPay và tạo transaction | 1. Mô phỏng callback từ VNPay<br>2. POST /api/v1/transactions/return_payment_status | 1. Trả về status 201<br>2. Transaction được tạo<br>3. Balance tăng | TestData15 | ❌ Failed | 18/12/2025 | expect(received).toBe(expected) |

---

### Flow 6: User đánh giá --> Bình luận --> Like comment

| ID      | Test Case Description       | Test Case Procedure                                     | Expected Output                                             | Test Data  | Result    | Test Date  | Description                     |
| ------- | --------------------------- | ------------------------------------------------------- | ----------------------------------------------------------- | ---------- | --------- | ---------- | ------------------------------- |
| INT-016 | Like comment thành công     | 1. User đăng nhập<br>2. PATCH /api/v1/comments/:id/like | 1. Trả về status 200<br>2. User ID được thêm vào like array | TestData16 | ❌ Failed | 18/12/2025 | expect(received).toBe(expected) |
| INT-017 | Unlike comment khi like lại | 1. User like comment<br>2. Like lại lần nữa             | 1. Trả về status 200<br>2. User ID được xóa khỏi like array | TestData17 | ❌ Failed | 18/12/2025 | expect(received).toBe(expected) |

---

### Flow 7: Quên mật khẩu --> Reset --> Đăng nhập

| ID      | Test Case Description                | Test Case Procedure                                   | Expected Output                                                      | Test Data  | Result    | Test Date  | Description                     |
| ------- | ------------------------------------ | ----------------------------------------------------- | -------------------------------------------------------------------- | ---------- | --------- | ---------- | ------------------------------- |
| INT-018 | Không đăng nhập được với mật khẩu cũ | 1. Reset password<br>2. Thử đăng nhập với mật khẩu cũ | 1. Trả về status 401<br>2. Message: "Email hoặc mật khẩu không đúng" | TestData18 | ❌ Failed | 18/12/2025 | expect(received).toBe(expected) |

---

### Flow 8: Đăng ký --> Xác thực --> Mua hàng

| ID      | Test Case Description                        | Test Case Procedure                                 | Expected Output                              | Test Data  | Result    | Test Date  | Description                     |
| ------- | -------------------------------------------- | --------------------------------------------------- | -------------------------------------------- | ---------- | --------- | ---------- | ------------------------------- |
| INT-019 | Đăng nhập được ngay sau khi đăng ký          | 1. Đăng ký tài khoản<br>2. POST /api/v1/users/login | 1. Trả về status 200<br>2. Trả về token      | TestData19 | ❌ Failed | 18/12/2025 | expect(received).toBe(expected) |
| INT-020 | Tạo đơn hàng thành công với user mới đăng ký | 1. Đăng ký và đăng nhập<br>2. POST /api/v1/orders   | 1. Trả về status 201<br>2. Đơn hàng được tạo | TestData20 | ❌ Failed | 18/12/2025 | expect(received).toBe(expected) |

---

### Flow 9: Admin: Nhập hàng --> Tạo sản phẩm --> Quản lý kho

| ID      | Test Case Description                        | Test Case Procedure                            | Expected Output                                                 | Test Data  | Result    | Test Date  | Description                     |
| ------- | -------------------------------------------- | ---------------------------------------------- | --------------------------------------------------------------- | ---------- | --------- | ---------- | ------------------------------- |
| INT-021 | Tạo import thành công và tăng inventory      | 1. Admin đăng nhập<br>2. POST /api/v1/imports  | 1. Trả về status 201<br>2. Import được tạo<br>3. Inventory tăng | TestData21 | ❌ Failed | 18/12/2025 | expect(received).toBe(expected) |
| INT-022 | Tăng inventory sản phẩm sau khi nhập hàng    | 1. Tạo import<br>2. Kiểm tra product inventory | 1. Inventory tăng đúng số lượng                                 | TestData22 | ❌ Failed | 18/12/2025 | expect(received).toBeTruthy()   |
| INT-023 | Tạo sản phẩm mới thành công                  | 1. Admin đăng nhập<br>2. POST /api/v1/products | 1. Trả về status 201<br>2. Sản phẩm được tạo                    | TestData23 | ❌ Failed | 18/12/2025 | expect(received).toBe(expected) |
| INT-024 | Nhập hàng cho sản phẩm mới và tăng inventory | 1. Tạo sản phẩm mới<br>2. POST /api/v1/imports | 1. Import được tạo<br>2. Inventory tăng                         | TestData24 | ❌ Failed | 18/12/2025 | expect(received).toBeTruthy()   |

---

### Flow 10: Admin quản lý sản phẩm: Tạo --> Cập nhật --> Xóa

| ID      | Test Case Description                | Test Case Procedure                                              | Expected Output                                             | Test Data  | Result    | Test Date  | Description                     |
| ------- | ------------------------------------ | ---------------------------------------------------------------- | ----------------------------------------------------------- | ---------- | --------- | ---------- | ------------------------------- |
| INT-025 | Tạo sản phẩm mới thành công          | 1. Admin đăng nhập<br>2. POST /api/v1/products                   | 1. Trả về status 201<br>2. Sản phẩm được tạo                | TestData25 | ❌ Failed | 18/12/2025 | expect(received).toBe(expected) |
| INT-026 | Cập nhật sản phẩm thành công         | 1. Admin đăng nhập<br>2. PATCH /api/v1/products/:id              | 1. Trả về status 200<br>2. Sản phẩm được cập nhật           | TestData26 | ❌ Failed | 18/12/2025 | expect(received).toBe(expected) |
| INT-027 | Cập nhật một phần thông tin sản phẩm | 1. Admin đăng nhập<br>2. PATCH /api/v1/products/:id {price: ...} | 1. Trả về status 200<br>2. Chỉ field được gửi được cập nhật | TestData27 | ❌ Failed | 18/12/2025 | expect(received).toBe(expected) |
| INT-028 | Xóa sản phẩm thành công              | 1. Admin đăng nhập<br>2. DELETE /api/v1/products/:id             | 1. Trả về status 204<br>2. Sản phẩm bị xóa                  | TestData28 | ❌ Failed | 18/12/2025 | expect(received).toBe(expected) |

---

### Flow 11: User hủy đơn --> Hoàn tiền --> Inventory tăng lại

| ID      | Test Case Description           | Test Case Procedure                                        | Expected Output                              | Test Data  | Result    | Test Date  | Description                     |
| ------- | ------------------------------- | ---------------------------------------------------------- | -------------------------------------------- | ---------- | --------- | ---------- | ------------------------------- |
| INT-029 | Tạo đơn hàng với payments=vnpay | 1. Đăng nhập<br>2. POST /api/v1/orders {payments: "vnpay"} | 1. Trả về status 201<br>2. Đơn hàng được tạo | TestData29 | ❌ Failed | 18/12/2025 | expect(received).toBe(expected) |

---

## 📊 Báo Cáo Test Tự Động (GitHub Actions)

### 📊 Tổng Quan Test Results

| Metric          | Value      | Status             |
| --------------- | ---------- | ------------------ |
| **Total Tests** | 99         | -                  |
| **✅ Passed**   | 65         | 65.66%             |
| **❌ Failed**   | 34         | 34.34% - Cần xử lý |
| **Branch**      | weblau     | -                  |
| **Test Date**   | 18/12/2025 | -                  |

### ❌ Chi Tiết Các Test Failed

| STT | Test Suite         | Test Case Description                                       | Test ID | Status    | Error Type                      |
| --- | ------------------ | ----------------------------------------------------------- | ------- | --------- | ------------------------------- |
| 1   | Like Comment       | Like comment thành công                                     | INT-016 | ❌ Failed | expect(received).toBe(expected) |
| 2   | Like Comment       | Unlike comment khi like lại                                 | INT-017 | ❌ Failed | expect(received).toBe(expected) |
| 3   | Like Comment       | Flow hoàn chỉnh: Đánh giá --> Bình luận --> Like            | INT-016 | ❌ Failed | expect(received).toBe(expected) |
| 4   | Cancel Order       | Tạo đơn hàng với payments=vnpay                             | INT-029 | ❌ Failed | expect(received).toBe(expected) |
| 5   | Login Purchase     | Tạo đơn hàng thành công sau khi đăng nhập                   | INT-001 | ❌ Failed | expect(received).toBe(expected) |
| 6   | Login Purchase     | Trả về lỗi khi thiếu address                                | INT-002 | ❌ Failed | expect(received).toBe(expected) |
| 7   | Login Purchase     | Xem được chi tiết đơn hàng                                  | INT-003 | ❌ Failed | expect(received).toBe(expected) |
| 8   | Purchase Review    | Tạo đơn hàng thành công                                     | INT-004 | ❌ Failed | expect(received).toBe(expected) |
| 9   | Purchase Review    | Cập nhật order status thành Success                         | INT-005 | ❌ Failed | expect(received).toBe(expected) |
| 10  | Purchase Review    | Cập nhật ratingsAverage và ratingsQuantity                  | INT-006 | ❌ Failed | expect(received).toBe(expected) |
| 11  | Order Email        | Tạo đơn hàng thành công                                     | INT-007 | ❌ Failed | expect(received).toBe(expected) |
| 12  | Order Email        | Cập nhật order status = Delivery                            | INT-008 | ❌ Failed | expect(received).toBe(expected) |
| 13  | Order Email        | Cập nhật order status = Success                             | INT-009 | ❌ Failed | expect(received).toBe(expected) |
| 14  | Balance Payment    | Tạo đơn hàng với thanh toán bằng số dư                      | INT-010 | ❌ Failed | expect(received).toBe(expected) |
| 15  | Balance Payment    | Giảm balance user đúng số tiền                              | INT-011 | ❌ Failed | expect(received).toBeTruthy()   |
| 16  | Balance Payment    | Giảm inventory sản phẩm                                     | INT-012 | ❌ Failed | expect(received).toBeTruthy()   |
| 17  | Forgot Password    | Không đăng nhập được với mật khẩu cũ                        | INT-018 | ❌ Failed | expect(received).toBe(expected) |
| 18  | VNPay Payment      | Tạo đơn hàng với payments=vnpay                             | INT-013 | ❌ Failed | expect(received).toBe(expected) |
| 19  | VNPay Payment      | Tạo URL thanh toán VNPay                                    | INT-014 | ❌ Failed | expect(received).toBe(expected) |
| 20  | VNPay Payment      | Xác nhận thanh toán VNPay                                   | INT-015 | ❌ Failed | expect(received).toBe(expected) |
| 21  | VNPay Payment      | Flow hoàn chỉnh: Mua hàng --> VNPay --> Xác nhận            | INT-015 | ❌ Failed | expect(received).toBe(expected) |
| 22  | Signup Purchase    | Đăng nhập được ngay sau khi đăng ký                         | INT-019 | ❌ Failed | expect(received).toBe(expected) |
| 23  | Signup Purchase    | Tạo đơn hàng thành công với user mới                        | INT-020 | ❌ Failed | expect(received).toBe(expected) |
| 24  | Signup Purchase    | Flow hoàn chỉnh: Đăng ký --> Đăng nhập --> Mua hàng         | INT-020 | ❌ Failed | expect(received).toBe(expected) |
| 25  | Admin Import       | Tạo import thành công và tăng inventory                     | INT-021 | ❌ Failed | expect(received).toBe(expected) |
| 26  | Admin Import       | Tăng inventory sản phẩm sau khi nhập hàng                   | INT-022 | ❌ Failed | expect(received).toBeTruthy()   |
| 27  | Admin Import       | Tạo sản phẩm mới thành công                                 | INT-023 | ❌ Failed | expect(received).toBe(expected) |
| 28  | Admin Import       | Nhập hàng cho sản phẩm mới                                  | INT-024 | ❌ Failed | expect(received).toBeTruthy()   |
| 29  | Admin Import       | Flow hoàn chỉnh: Tạo sản phẩm --> Nhập hàng --> Quản lý kho | INT-024 | ❌ Failed | expect(received).toBe(expected) |
| 30  | Admin Product CRUD | Tạo sản phẩm mới thành công                                 | INT-025 | ❌ Failed | expect(received).toBe(expected) |
| 31  | Admin Product CRUD | Cập nhật sản phẩm thành công                                | INT-026 | ❌ Failed | expect(received).toBe(expected) |
| 32  | Admin Product CRUD | Cập nhật một phần thông tin                                 | INT-027 | ❌ Failed | expect(received).toBe(expected) |
| 33  | Admin Product CRUD | Xóa sản phẩm thành công                                     | INT-028 | ❌ Failed | expect(received).toBe(expected) |
| 34  | Admin Product CRUD | Flow hoàn chỉnh: Tạo --> Cập nhật --> Xóa                   | INT-028 | ❌ Failed | expect(received).toBe(expected) |

### 🎯 Độ Coverage Theo Flow

| Flow                                 | Test Cases | Passed | Failed | Pass Rate |
| ------------------------------------ | ---------- | ------ | ------ | --------- |
| Đăng nhập --> Mua hàng               | 3          | 0      | 3      | 0% ❌     |
| Mua hàng --> Nhận hàng --> Đánh giá  | 3          | 0      | 3      | 0% ❌     |
| Admin cập nhật trạng thái --> Email  | 3          | 0      | 3      | 0% ❌     |
| Mua hàng --> Thanh toán số dư        | 3          | 0      | 3      | 0% ❌     |
| Mua hàng --> Thanh toán VNPay        | 4          | 0      | 4      | 0% ❌     |
| User đánh giá --> Bình luận --> Like | 3          | 0      | 3      | 0% ❌     |
| Quên mật khẩu --> Reset              | 1          | 0      | 1      | 0% ❌     |
| Đăng ký --> Xác thực --> Mua hàng    | 3          | 0      | 3      | 0% ❌     |
| Admin: Nhập hàng --> Quản lý kho     | 5          | 0      | 5      | 0% ❌     |
| Admin quản lý sản phẩm CRUD          | 5          | 0      | 5      | 0% ❌     |
| User hủy đơn --> Hoàn tiền           | 1          | 0      | 1      | 0% ❌     |

### 📋 Phân Loại Theo Nhóm Chức Năng

| Nhóm Chức Năng        | Test Cases | Passed | Failed | Pass Rate | Note                              |
| --------------------- | ---------- | ------ | ------ | --------- | --------------------------------- |
| 🔐 Authentication     | 4          | 0      | 4      | 0%        | Đăng nhập, Đăng ký, Quên mật khẩu |
| 🛒 Order Management   | 10         | 0      | 10     | 0%        | Tạo đơn, Xem đơn, Cập nhật status |
| 💳 Payment            | 7          | 0      | 7      | 0%        | VNPay, Số dư, Balance             |
| ⭐ Review & Comment   | 3          | 0      | 3      | 0%        | Review, Comment, Like             |
| 📦 Product Management | 10         | 0      | 10     | 0%        | CRUD sản phẩm, Import, Inventory  |

### 🔍 Phân Tích Lỗi Chi Tiết

#### 1. **Lỗi Response Structure (expect(received).toBe(expected))**

**Vấn đề:** Hầu hết các test failed do response structure không khớp với expected

**Error Pattern:**

```
Error: expect(received).toBe(expected) // Object.is equality
```

**Nguyên nhân có thể:**

- Response body structure khác với expected (thiếu `status`, `data`, `data.id`)
- Status code không đúng (expected 201 nhưng nhận 200 hoặc ngược lại)
- Response format khác với API specification

**Giải pháp đề xuất:**

- Kiểm tra lại response structure của từng API endpoint
- Thêm explicit checks cho `response.body.status`, `response.body.data`
- Đảm bảo test data được setup đúng trong `beforeEach`

#### 2. **Lỗi Null/Undefined (expect(received).toBeTruthy())**

**Vấn đề:** Một số test failed do object null hoặc undefined

**Error Pattern:**

```
Error: expect(received).toBeTruthy()
```

**Nguyên nhân có thể:**

- Data không được tạo đúng trong `beforeEach`
- Database cleanup (`afterEach` trong `setup.js`) xóa data trước khi test chạy
- Test isolation issue - test trước đó ảnh hưởng đến test hiện tại

**Giải pháp đề xuất:**

- Đảm bảo `beforeEach` tạo lại tất cả data cần thiết
- Thêm explicit `deleteMany` trong `beforeEach` để clear data cũ
- Kiểm tra test isolation - mỗi test phải độc lập

#### 3. **Lỗi Test Isolation**

**Vấn đề:** Tests có thể chạy không đúng thứ tự hoặc data bị ảnh hưởng lẫn nhau

**Nguyên nhân:**

- `setup.js` có `afterEach` hook xóa tất cả collections sau mỗi test
- Một số test dựa vào data từ test trước
- Token có thể bị invalidate sau khi database bị clear

**Giải pháp đề xuất:**

- Mỗi test phải tự tạo data trong `beforeEach`
- Re-authenticate để lấy token mới trong mỗi test
- Không dựa vào data từ test khác

### 📈 So Sánh Với Module Khác

| Module                | Total Tests | Passed | Failed | Pass Rate  |
| --------------------- | ----------- | ------ | ------ | ---------- |
| Module1 (Auth)        | 31          | 26     | 5      | 83.87%     |
| Module2 (User)        | 30          | 23     | 7      | 76.67%     |
| Module3 (Product)     | 35          | 27     | 8      | 77.14%     |
| Module4 (Order)       | 30          | 25     | 5      | 83.33%     |
| **Integration Tests** | **99**      | **65** | **34** | **65.66%** |

**Nhận xét:**

- Integration Tests có pass rate thấp nhất (65.66%)
- Số lượng test fail nhiều nhất (34 tests)
- Các lỗi chủ yếu do response structure và test isolation
- Cần ưu tiên sửa các lỗi này để tăng pass rate

### 🔧 Các Bước Tiếp Theo

1. **Ưu tiên cao:**

   - ✅ Sửa response structure checks trong tất cả tests
   - ✅ Đảm bảo test isolation - mỗi test tự tạo data
   - ✅ Thêm explicit `beforeEach` hooks để setup data
   - ✅ Re-run test để verify fix

2. **Ưu tiên trung bình:**

   - 📝 Kiểm tra lại API response format
   - 📝 Thêm delay cho async operations (product update, email sending)
   - 📝 Cải thiện error messages trong tests

3. **Ưu tiên thấp:**
   - 🧪 Thêm edge case tests
   - 📊 Tăng coverage lên 90%+
   - 🔐 Thêm security tests

### 📝 Notes

- **Test Isolation:** Mỗi test phải độc lập, không phụ thuộc vào test khác
- **Data Setup:** Sử dụng `beforeEach` để tạo lại data trước mỗi test
- **Response Structure:** Luôn check `response.body.status`, `response.body.data`
- **Async Operations:** Thêm delay cho các operations như product update, email sending
- **Token Management:** Re-authenticate trong mỗi test để lấy token mới

---

## Ghi chú

1. **Integration Test Files:**

   - `loginToPurchase.test.js` - Flow đăng nhập và mua hàng
   - `signupToPurchase.test.js` - Flow đăng ký và mua hàng
   - `purchaseWithVNPay.test.js` - Flow thanh toán VNPay
   - `purchaseWithBalance.test.js` - Flow thanh toán bằng số dư
   - `purchaseToReview.test.js` - Flow mua hàng và đánh giá
   - `cancelOrderRefund.test.js` - Flow hủy đơn và hoàn tiền
   - `adminImportProduct.test.js` - Flow admin nhập hàng
   - `viewProductToCheckout.test.js` - Flow xem sản phẩm và thanh toán
   - `orderStatusUpdateEmail.test.js` - Flow cập nhật status và gửi email
   - `reviewCommentLike.test.js` - Flow đánh giá, bình luận và like
   - `forgotPasswordFlow.test.js` - Flow quên mật khẩu
   - `adminProductCRUD.test.js` - Flow admin quản lý sản phẩm
   - `orderStatistics.test.js` - Flow thống kê đơn hàng
   - `userAddressManagement.test.js` - Flow quản lý địa chỉ

2. **Test Environment:**

   - MongoDB Memory Server (in-memory database)
   - Mock email service
   - Mock VNPay callbacks
   - Test data được tạo và cleanup tự động

3. **Common Issues:**

   - Response structure không khớp
   - Test isolation - data bị ảnh hưởng giữa các tests
   - Async operations cần delay
   - Token bị invalidate sau database cleanup

4. **Best Practices:**

   - Mỗi test độc lập
   - Setup data trong `beforeEach`
   - Cleanup data trong `afterEach`
   - Check response structure đầy đủ
   - Re-authenticate trong mỗi test
