# Integration Tests - Product Management Flows

## Thông tin Module

|                      |                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------- |
| **Module Code**      | Integration Tests - Product Management Flows                                           |
| **Test Requirement** | Test các flow quản lý sản phẩm: Admin CRUD sản phẩm, Nhập hàng, Quản lý kho, Inventory |
| **Tester**           | HaoPham                                                                                |
| **Test Date**        | 18/12/2025 (GitHub Actions - Branch: weblau)                                           |

---

## Thống kê Test Case

| Pass | Fail | Untested | N/A | Number of Test Cases |
| ---- | ---- | -------- | --- | -------------------- |
| 0    | 10   | 0        | 0   | 10                   |

> **Ghi chú:** Kết quả từ GitHub Actions - Branch `weblau` - Test Date: 18/12/2025  
> **Pass Rate:** 0%

---

## Chi tiết Test Case

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

## 📊 Phân Tích Lỗi

### 1. Lỗi Response Structure

**Vấn đề:** Hầu hết các test failed do response structure không khớp với expected

**Error Pattern:**

```
Error: expect(received).toBe(expected) // Object.is equality
```

**Nguyên nhân có thể:**

- Response body structure khác với expected (thiếu `status`, `data`, `data.id`)
- Status code không đúng (expected 201/200/204 nhưng nhận giá trị khác)
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
- [Integration Review Flows](./Integration_Review_Flows.md)
- [Integration Order Flows](./Integration_Order_Flows.md)

---

## 📝 Test Files

- `adminImportProduct.test.js` - Flow admin nhập hàng
- `adminProductCRUD.test.js` - Flow admin quản lý sản phẩm (CRUD)
