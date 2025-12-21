# Integration Tests - Authentication Flows

## Thông tin Module

|                      |                                                                           |
| -------------------- | ------------------------------------------------------------------------- |
| **Module Code**      | Integration Tests - Authentication Flows                                  |
| **Test Requirement** | Test các flow xác thực: Đăng ký, Đăng nhập, Quên mật khẩu, Xác thực email |
| **Tester**           | HaoPham                                                                   |
| **Test Date**        | 18/12/2025 (GitHub Actions - Branch: weblau)                              |

---

## Thống kê Test Case

| Pass | Fail | Untested | N/A | Number of Test Cases |
| ---- | ---- | -------- | --- | -------------------- |
| 0    | 4    | 0        | 0   | 4                    |

> **Ghi chú:** Kết quả từ GitHub Actions - Branch `weblau` - Test Date: 18/12/2025  
> **Pass Rate:** 0%

---

## Chi tiết Test Case

### Flow 7: Quên mật khẩu --> Reset --> Đăng nhập

| ID      | Test Case Description                | Test Case Procedure                                   | Expected Output                                                      | Test Data  | Result    | Test Date  | Description                     |
| ------- | ------------------------------------ | ----------------------------------------------------- | -------------------------------------------------------------------- | ---------- | --------- | ---------- | ------------------------------- |
| INT-018 | Không đăng nhập được với mật khẩu cũ | 1. Reset password<br>2. Thử đăng nhập với mật khẩu cũ | 1. Trả về status 401<br>2. Message: "Email hoặc mật khẩu không đúng" | TestData18 | ✅ Passed | 18/12/2025 | expect(received).toBe(expected) |

---

### Flow 8: Đăng ký --> Xác thực --> Mua hàng

| ID      | Test Case Description                        | Test Case Procedure                                 | Expected Output                              | Test Data  | Result    | Test Date  | Description                     |
| ------- | -------------------------------------------- | --------------------------------------------------- | -------------------------------------------- | ---------- | --------- | ---------- | ------------------------------- |
| INT-019 | Đăng nhập được ngay sau khi đăng ký          | 1. Đăng ký tài khoản<br>2. POST /api/v1/users/login | 1. Trả về status 200<br>2. Trả về token      | TestData19 | ❌ Failed | 18/12/2025 | expect(received).toBe(expected) |
| INT-020 | Tạo đơn hàng thành công với user mới đăng ký | 1. Đăng ký và đăng nhập<br>2. POST /api/v1/orders   | 1. Trả về status 201<br>2. Đơn hàng được tạo | TestData20 | ❌ Failed | 18/12/2025 | expect(received).toBe(expected) |

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
- Status code không đúng (expected 200/201 nhưng nhận giá trị khác)
- Response format khác với API specification

**Giải pháp đề xuất:**

- Kiểm tra lại response structure của từng API endpoint
- Thêm explicit checks cho `response.body.status`, `response.body.data`
- Đảm bảo test data được setup đúng trong `beforeEach`

---

## 🔗 Liên Kết

- [Integration Tests Report - Tổng hợp](./Integration_Tests_Report_SUMMARY.md)
- [Integration Order Flows](./Integration_Order_Flows.md)
- [Integration Payment Flows](./Integration_Payment_Flows.md)

---

## 📝 Test Files

- `forgotPasswordFlow.test.js` - Flow quên mật khẩu
- `signupToPurchase.test.js` - Flow đăng ký và mua hàng
