# Integration Tests - Payment Flows

## Thông tin Module

|                      |                                                                                |
| -------------------- | ------------------------------------------------------------------------------ |
| **Module Code**      | Integration Tests - Payment Flows                                              |
| **Test Requirement** | Test các flow thanh toán: Thanh toán số dư, VNPay, Kiểm tra balance, Inventory |
| **Tester**           | HaoPham                                                                        |
| **Test Date**        | 18/12/2025 (GitHub Actions - Branch: weblau)                                   |

---

## Thống kê Test Case

| Pass | Fail | Untested | N/A | Number of Test Cases |
| ---- | ---- | -------- | --- | -------------------- |
| 0    | 7    | 0        | 0   | 7                    |

> **Ghi chú:** Kết quả từ GitHub Actions - Branch `weblau` - Test Date: 18/12/2025  
> **Pass Rate:** 0%

---

## Chi tiết Test Case

### Flow 4: Mua hàng --> Thanh toán số dư --> Kiểm tra balance

| ID      | Test Case Description                  | Test Case Procedure                                                          | Expected Output                                                 | Test Data  | Result    | Test Date  | Description                     |
| ------- | -------------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------- | ---------- | --------- | ---------- | ------------------------------- |
| INT-010 | Tạo đơn hàng với thanh toán bằng số dư | 1. Đăng nhập (user có balance)<br>2. POST /api/v1/orders {payments: "số dư"} | 1. Trả về status 201<br>2. Đơn hàng được tạo<br>3. Balance giảm | TestData10 | ❌ Failed | 18/12/2025 | expect(received).toBe(expected) |
| INT-011 | Giảm balance user đúng số tiền         | 1. Tạo đơn hàng với payments="số dư"<br>2. Kiểm tra user balance             | 1. Balance giảm đúng số tiền đơn hàng                           | TestData11 | ❌ Failed | 18/12/2025 | expect(received).toBe(expected) |
| INT-012 | Giảm inventory sản phẩm                | 1. Tạo đơn hàng<br>2. Kiểm tra product inventory                             | 1. Inventory giảm đúng số lượng                                 | TestData12 | ❌ Failed | 18/12/2025 | expect(received).toBe(expected) |

---

### Flow 5: Mua hàng --> Thanh toán VNPay --> Xác nhận

| ID      | Test Case Description                        | Test Case Procedure                                                                 | Expected Output                                                    | Test Data  | Result    | Test Date  | Description                     |
| ------- | -------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ---------- | --------- | ---------- | ------------------------------- |
| INT-013 | Tạo đơn hàng với payments=vnpay              | 1. Đăng nhập<br>2. POST /api/v1/orders {payments: "vnpay"}                          | 1. Trả về status 201<br>2. Đơn hàng được tạo                       | TestData13 | ✅ Passed | 18/12/2025 | expect(received).toBe(expected) |
| INT-014 | Tạo URL thanh toán VNPay thành công          | 1. POST /api/v1/transactions/create_payment_url                                     | 1. Trả về status 201<br>2. Trả về vnpUrl                           | TestData14 | ✅ Passed | 18/12/2025 | expect(received).toBe(expected) |
| INT-015 | Xác nhận thanh toán VNPay và tạo transaction | 1. Mô phỏng callback từ VNPay<br>2. POST /api/v1/transactions/return_payment_status | 1. Trả về status 201<br>2. Transaction được tạo<br>3. Balance tăng | TestData15 | ✅ Passed | 18/12/2025 | expect(received).toBe(expected) |

---

## 📊 Phân Tích Lỗi

### 1. Lỗi Response Structure

**Vấn đề:** Hầu hết các test failed do response structure không khớp với expected

**Error Pattern:**

```
Error: expect(received).toBe(expected) // Object.is equality
```

**Nguyên nhân có thể:**

- Response body structure khác với expected (thiếu `status`, `data`, `data.id`)
- Status code không đúng (expected 201 nhưng nhận 200 hoặc ngược lại)
- Response format khác với API specification

### 2. Lỗi Null/Undefined

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

---

## 🔗 Liên Kết

- [Integration Tests Report - Tổng hợp](./Integration_Tests_Report_SUMMARY.md)
- [Integration Order Flows](./Integration_Order_Flows.md)
- [Integration Auth Flows](./Integration_Auth_Flows.md)

---

## 📝 Test Files

- `purchaseWithBalance.test.js` - Flow thanh toán bằng số dư
- `purchaseWithVNPay.test.js` - Flow thanh toán VNPay
