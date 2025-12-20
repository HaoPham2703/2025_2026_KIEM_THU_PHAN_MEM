# Integration Tests - Order Management Flows

## Thông tin Module

|                      |                                                                                                       |
| -------------------- | ----------------------------------------------------------------------------------------------------- |
| **Module Code**      | Integration Tests - Order Management Flows                                                            |
| **Test Requirement** | Test các flow quản lý đơn hàng: Tạo đơn, Xem đơn, Cập nhật status, Hủy đơn, Gửi email               |
| **Tester**           | HaoPham                                                                                               |
| **Test Date**        | 18/12/2025 (GitHub Actions - Branch: weblau)                                                          |

---

## Thống kê Test Case

| Pass | Fail | Untested | N/A | Number of Test Cases |
| ---- | ---- | -------- | --- | -------------------- |
| 0    | 10   | 0        | 0   | 10                   |

> **Ghi chú:** Kết quả từ GitHub Actions - Branch `weblau` - Test Date: 18/12/2025  
> **Pass Rate:** 0%

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

---

### Flow 3: Admin cập nhật trạng thái đơn --> User nhận email

| ID      | Test Case Description                         | Test Case Procedure                                                    | Expected Output                                  | Test Data  | Result    | Test Date  | Description                     |
| ------- | --------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------ | ---------- | --------- | ---------- | ------------------------------- |
| INT-007 | Tạo đơn hàng thành công                       | 1. User đăng nhập<br>2. POST /api/v1/orders                            | 1. Trả về status 201<br>2. Đơn hàng được tạo     | TestData07 | ❌ Failed | 18/12/2025 | expect(received).toBe(expected) |
| INT-008 | Cập nhật order status = Delivery và gửi email | 1. Admin đăng nhập<br>2. PATCH /api/v1/orders/:id {status: "Delivery"} | 1. Trả về status 200<br>2. Email được gửi (mock) | TestData08 | ❌ Failed | 18/12/2025 | expect(received).toBe(expected) |
| INT-009 | Cập nhật order status = Success và gửi email  | 1. Admin đăng nhập<br>2. PATCH /api/v1/orders/:id {status: "Success"}  | 1. Trả về status 200<br>2. Email được gửi (mock) | TestData09 | ❌ Failed | 18/12/2025 | expect(received).toBe(expected) |

---

### Flow 11: User hủy đơn --> Hoàn tiền --> Inventory tăng lại

| ID      | Test Case Description           | Test Case Procedure                                        | Expected Output                              | Test Data  | Result    | Test Date  | Description                     |
| ------- | ------------------------------- | ---------------------------------------------------------- | -------------------------------------------- | ---------- | --------- | ---------- | ------------------------------- |
| INT-029 | Tạo đơn hàng với payments=vnpay | 1. Đăng nhập<br>2. POST /api/v1/orders {payments: "vnpay"} | 1. Trả về status 201<br>2. Đơn hàng được tạo | TestData29 | ❌ Failed | 18/12/2025 | expect(received).toBe(expected) |

---

## 📊 Phân Tích Lỗi

### Lỗi Response Structure

**Vấn đề:** Tất cả test failed do response structure không khớp với expected

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

---

## 🔗 Liên Kết

- [Integration Tests Report - Tổng hợp](./Integration_Tests_Report_SUMMARY.md)
- [Integration Auth Flows](./Integration_Auth_Flows.md)
- [Integration Payment Flows](./Integration_Payment_Flows.md)

---

## 📝 Test Files

- `loginToPurchase.test.js` - Flow đăng nhập và mua hàng
- `purchaseToReview.test.js` - Flow mua hàng và đánh giá
- `orderStatusUpdateEmail.test.js` - Flow cập nhật status và gửi email
- `cancelOrderRefund.test.js` - Flow hủy đơn và hoàn tiền

