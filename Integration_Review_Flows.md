# Integration Tests - Review & Comment Flows

## Thông tin Module

|                      |                                                                                                       |
| -------------------- | ----------------------------------------------------------------------------------------------------- |
| **Module Code**      | Integration Tests - Review & Comment Flows                                                           |
| **Test Requirement** | Test các flow đánh giá và bình luận: Đánh giá sản phẩm, Bình luận, Like comment                      |
| **Tester**           | HaoPham                                                                                               |
| **Test Date**        | 18/12/2025 (GitHub Actions - Branch: weblau)                                                          |

---

## Thống kê Test Case

| Pass | Fail | Untested | N/A | Number of Test Cases |
| ---- | ---- | -------- | --- | -------------------- |
| 0    | 3    | 0        | 0   | 3                    |

> **Ghi chú:** Kết quả từ GitHub Actions - Branch `weblau` - Test Date: 18/12/2025  
> **Pass Rate:** 0%

---

## Chi tiết Test Case

### Flow 6: User đánh giá --> Bình luận --> Like comment

| ID      | Test Case Description       | Test Case Procedure                                     | Expected Output                                             | Test Data  | Result    | Test Date  | Description                     |
| ------- | --------------------------- | ------------------------------------------------------- | ----------------------------------------------------------- | ---------- | --------- | ---------- | ------------------------------- |
| INT-016 | Like comment thành công     | 1. User đăng nhập<br>2. PATCH /api/v1/comments/:id/like | 1. Trả về status 200<br>2. User ID được thêm vào like array | TestData16 | ❌ Failed | 18/12/2025 | expect(received).toBe(expected) |
| INT-017 | Unlike comment khi like lại | 1. User like comment<br>2. Like lại lần nữa             | 1. Trả về status 200<br>2. User ID được xóa khỏi like array | TestData17 | ❌ Failed | 18/12/2025 | expect(received).toBe(expected) |

**Lưu ý:** Flow này cũng bao gồm test case INT-006 từ Flow 2 (Cập nhật ratingsAverage và ratingsQuantity của product)

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
- Status code không đúng (expected 200 nhưng nhận giá trị khác)
- Response format khác với API specification

**Giải pháp đề xuất:**
- Kiểm tra lại response structure của từng API endpoint
- Thêm explicit checks cho `response.body.status`, `response.body.data`
- Đảm bảo test data được setup đúng trong `beforeEach`

---

## 🔗 Liên Kết

- [Integration Tests Report - Tổng hợp](./Integration_Tests_Report_SUMMARY.md)
- [Integration Order Flows](./Integration_Order_Flows.md)
- [Integration Product Flows](./Integration_Product_Flows.md)

---

## 📝 Test Files

- `reviewCommentLike.test.js` - Flow đánh giá, bình luận và like
- `purchaseToReview.test.js` - Flow mua hàng và đánh giá

