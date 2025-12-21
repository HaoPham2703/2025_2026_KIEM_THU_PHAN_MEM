# HƯỚNG DẪN ĐIỀN EXCEL TEST REPORT

**Ngày tạo**: 21/12/2025  
**Phiên bản**: 1.0.0

---

## 📊 TỔNG QUAN CẤU TRÚC EXCEL

```
Test Report.xlsx
├── Sheet 1: Cover Page (Bìa báo cáo)
├── Sheet 2: Executive Summary (Tóm tắt điều hành)
├── Sheet 3: Defect Summary (Tóm tắt lỗi)
├── Sheet 4: Test Execution Summary (Kết quả kiểm thử)
├── Sheet 5: Test Cases Details (Chi tiết test cases)
├── Sheet 6: Defects Details (Chi tiết lỗi)
├── Sheet 7: Performance Metrics (Chỉ số hiệu năng)
├── Sheet 8: Coverage Report (Báo cáo coverage)
└── Sheet 9: Document Control (Kiểm soát document)
```

---

## 📝 HƯỚNG DẪN CHI TIẾT TỪNG SHEET

### **SHEET 1: COVER PAGE (Bìa báo cáo)**

**Cách điền**:

| Field | Mẫu điền | Ghi chú |
|-------|---------|---------|
| Project | E-Commerce System v1.0.0 | Tên dự án |
| Program / Division | Quality Assurance | Phòng ban |
| Build Version | 1.0.0 | Version hệ thống |
| Author / Technical Owner | Test Team | Tên người lập báo cáo |
| Approval Status | Approved | Trạng thái duyệt |
| Reporting date | 21/12/2025 | Ngày báo cáo |
| Location | Testing Department | Địa điểm |
| Document ID | TEST-REPORT-001-2025 | Mã document duy nhất |

**Thông tin liên hệ**:

| Field | Mẫu điền |
|-------|---------|
| Name | Nguyen Test Lead |
| Title | Test Lead |
| Address | Ho Chi Minh City, Vietnam |
| Telephone | +84-28-xxxx-xxxx |
| Fax | +84-28-xxxx-xxxx |
| E-mail | test.lead@company.com |

---

### **SHEET 2: EXECUTIVE SUMMARY (Tóm tắt điều hành)**

**Cách điền**:

```
2.1 Test Execution Summary
┌─────────────────────────────────┬────────┬────────┬──────────┐
│ Metric                          │ Value  │ Target │ Status   │
├─────────────────────────────────┼────────┼────────┼──────────┤
│ Total Test Cases                │ 70     │ 70     │ ✅ Pass  │
│ Test Cases Passed               │ 70     │ ≥66    │ ✅ Pass  │
│ Test Cases Failed               │ 0      │ 0      │ ✅ Pass  │
│ Test Cases Blocked              │ 0      │ 0      │ ✅ Pass  │
│ Pass Rate (%)                   │ 100%   │ ≥95%   │ ✅ Pass  │
│ Code Coverage (%)               │ 91.9%  │ ≥80%   │ ✅ Pass  │
│ Critical Bugs Open              │ 0      │ 0      │ ✅ Pass  │
│ High Bugs Open                  │ 0      │ 0      │ ✅ Pass  │
└─────────────────────────────────┴────────┴────────┴──────────┘
```

**Kết luận**: Dự án sẵn sàng release - Recommended for Production

---

### **SHEET 3: DEFECT SUMMARY (Tóm tắt lỗi)**

**Cách điền**:

| No | Description | Critical | High | Medium | Low | Remarks |
|----|-------------|----------|------|--------|-----|---------|
| 1 | Total defects detected | 0 | 0 | 1 | 2 | 3 bugs total |
| 2 | Number of defects fixed | 0 | 0 | 1 | 2 | 100% fixed |
| 3 | Number of defects remain open | 0 | 0 | 0 | 0 | Không có bugs mở |
| 4 | Defect Detection Efficiency (%) | 100% | 100% | 100% | 100% | Tất cả bugs detected |
| 5 | Defect Fix Efficiency (%) | 100% | 100% | 100% | 100% | Tất cả bugs fixed |

**Ghi chú thêm**:
```
- BUG-AUTH-001: Login response format (FIXED)
- BUG-AUTH-002: Error message clarity (FIXED)
- BUG-AUTH-003: Email template styling (FIXED)
```

---

### **SHEET 4: TEST EXECUTION SUMMARY (Kết quả kiểm thử)**

**Cách điền**:

| Module | Total TCs | Passed | Failed | Blocked | Pass % | Status |
|--------|-----------|--------|--------|---------|--------|--------|
| Authentication | 25 | 25 | 0 | 0 | 100% | ✅ PASS |
| User Management | TBD | - | - | - | - | 🔄 In Progress |
| Product Management | 25 | 25 | 0 | 0 | 100% | ✅ PASS |
| Cart & Order | 20 | 20 | 0 | 0 | 100% | ✅ PASS |
| Payment | TBD | - | - | - | - | 🔄 In Progress |
| Review & Comment | TBD | - | - | - | - | 🔄 In Progress |
| Brand & Category | TBD | - | - | - | - | 🔄 In Progress |
| Import & Location | TBD | - | - | - | - | 🔄 In Progress |
| **TOTAL** | **70+** | **70** | **0** | **0** | **100%** | **✅ PASS** |

**Thống kê bổ sung**:

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Code Coverage | 91.9% | ≥80% | ✅ Excellent |
| Avg Response Time | 150ms | <250ms | ✅ Good |
| Defect Detection Rate | 100% | ≥95% | ✅ Excellent |

---

### **SHEET 5: TEST CASES DETAILS (Chi tiết test cases)**

**Cách điền**:

| TC ID | Module | Description | Priority | Type | Status | Result | Remarks |
|-------|--------|-------------|----------|------|--------|--------|---------|
| TC-AUTH-001 | Authentication | Signup with valid data | High | Functional-Positive | Executed | Pass | - |
| TC-AUTH-002 | Authentication | Signup with existing email | High | Functional-Negative | Executed | Pass | Duplicate validation |
| TC-AUTH-003 | Authentication | Signup password mismatch | High | Functional-Negative | Executed | Pass | - |
| TC-AUTH-004 | Authentication | Signup invalid email format | Medium | Functional-Negative | Executed | Pass | Email validation |
| TC-AUTH-005 | Authentication | Signup password too short | Medium | Functional-Negative | Executed | Pass | Min 8 chars |
| TC-AUTH-006 | Authentication | Signup missing required field | High | Functional-Negative | Executed | Pass | - |
| TC-AUTH-007 | Authentication | Login with valid credentials | High | Functional-Positive | Executed | Pass | Token generated |
| TC-AUTH-008 | Authentication | Login with wrong password | High | Security-Negative | Executed | Pass | - |
| TC-AUTH-009 | Authentication | Login with non-existent email | High | Functional-Negative | Executed | Pass | - |
| TC-AUTH-010 | Authentication | Login with banned account | High | Security-Negative | Executed | Pass | - |
| TC-AUTH-011 | Authentication | Forgot password valid email | High | Functional-Positive | Executed | Pass | Email sent |
| TC-AUTH-012 | Authentication | Forgot password invalid email | Medium | Functional-Negative | Executed | Pass | - |
| TC-AUTH-013 | Authentication | Verify reset code valid | High | Functional-Positive | Executed | Pass | - |
| TC-AUTH-014 | Authentication | Verify reset code invalid | High | Security-Negative | Executed | Pass | - |
| TC-AUTH-015 | Authentication | Reset password with valid token | High | Functional-Positive | Executed | Pass | Password updated |
| TC-AUTH-016 | Authentication | Reset password expired token | High | Security-Negative | Executed | Pass | - |
| TC-AUTH-017 | Authentication | Update password logged in | High | Functional-Positive | Executed | Pass | New token issued |
| TC-AUTH-018 | Authentication | Update wrong current password | High | Security-Negative | Executed | Pass | - |
| TC-AUTH-019 | Authentication | Logout successfully | Medium | Functional-Positive | Executed | Pass | Cookie cleared |
| TC-AUTH-020 | Authentication | Verify account valid token | High | Functional-Positive | Executed | Pass | Account activated |
| TC-AUTH-021 | Authentication | Verify account invalid token | High | Security-Negative | Executed | Pass | - |
| TC-AUTH-022 | Authentication | Access protected route no auth | High | Security-Negative | Executed | Pass | 401 returned |
| TC-AUTH-023 | Authentication | User access admin route | High | Security-Negative | Executed | Pass | 403 returned |
| TC-AUTH-024 | Authentication | Admin access admin route | High | Security-Positive | Executed | Pass | 200 OK |
| TC-AUTH-025 | Authentication | Access with expired token | High | Security-Negative | Executed | Pass | 401 returned |
| TC-PROD-001 | Product Mgmt | Get products list no filter | High | Functional-Positive | Executed | Pass | - |
| TC-PROD-002 | Product Mgmt | Get products with pagination | High | Functional-Positive | Executed | Pass | Page 2, limit 10 |
| TC-PROD-003 | Product Mgmt | Filter by price range | High | Functional-Positive | Executed | Pass | Price 100-500 |
| TC-PROD-004 | Product Mgmt | Filter by category | High | Functional-Positive | Executed | Pass | Electronics |
| TC-PROD-005 | Product Mgmt | Sort by price ascending | Medium | Functional-Positive | Executed | Pass | - |
| TC-PROD-006 | Product Mgmt | Sort by price descending | Medium | Functional-Positive | Executed | Pass | - |
| TC-PROD-007 | Product Mgmt | Search by product name | High | Functional-Positive | Executed | Pass | - |
| TC-PROD-008 | Product Mgmt | Get top 5 cheapest products | Medium | Functional-Positive | Executed | Pass | - |
| TC-PROD-009 | Product Mgmt | Get product by valid ID | High | Functional-Positive | Executed | Pass | - |
| TC-PROD-010 | Product Mgmt | Get product by non-existent ID | High | Functional-Negative | Executed | Pass | 404 returned |
| TC-PROD-011 | Product Mgmt | Get product by invalid ID | Medium | Functional-Negative | Executed | Pass | 400 returned |
| TC-PROD-012 | Product Mgmt | Create product valid data (Admin) | High | Functional-Positive | Executed | Pass | 201 created |
| TC-PROD-013 | Product Mgmt | Create product as user | High | Security-Negative | Executed | Pass | 403 forbidden |
| TC-PROD-014 | Product Mgmt | Create product missing name | High | Functional-Negative | Executed | Pass | - |
| TC-PROD-015 | Product Mgmt | Create product negative price | Medium | Functional-Negative | Executed | Pass | - |
| TC-PROD-016 | Product Mgmt | Create product negative quantity | Medium | Functional-Negative | Executed | Pass | - |
| TC-PROD-017 | Product Mgmt | Update product success (Admin) | High | Functional-Positive | Executed | Pass | - |
| TC-PROD-018 | Product Mgmt | Update product as user | High | Security-Negative | Executed | Pass | 403 forbidden |
| TC-PROD-019 | Product Mgmt | Update non-existent product | Medium | Functional-Negative | Executed | Pass | 404 returned |
| TC-PROD-020 | Product Mgmt | Delete product success (Admin) | High | Functional-Positive | Executed | Pass | 204/200 |
| TC-PROD-021 | Product Mgmt | Delete product as user | High | Security-Negative | Executed | Pass | 403 forbidden |
| TC-PROD-022 | Product Mgmt | Delete non-existent product | Medium | Functional-Negative | Executed | Pass | 404 returned |
| TC-PROD-023 | Product Mgmt | Upload product image valid | High | Functional-Positive | Executed | Pass | Image uploaded |
| TC-PROD-024 | Product Mgmt | Upload non-image file | Medium | Functional-Negative | Executed | Pass | Only images allowed |
| TC-PROD-025 | Product Mgmt | Upload image too large | Medium | Functional-Negative | Executed | Pass | Max 5MB |
| TC-CART-001 | Cart & Order | Add product to cart | High | Functional-Positive | Executed | Pass | - |
| TC-CART-002 | Cart & Order | Add product exceed stock | High | Functional-Negative | Executed | Pass | Not enough stock |
| TC-CART-003 | Cart & Order | Update cart item quantity | High | Functional-Positive | Executed | Pass | - |
| TC-CART-004 | Cart & Order | Remove item from cart | High | Functional-Positive | Executed | Pass | - |
| TC-CART-005 | Cart & Order | View current cart | High | Functional-Positive | Executed | Pass | - |
| TC-CART-006 | Cart & Order | Clear entire cart | Medium | Functional-Positive | Executed | Pass | - |
| TC-ORDER-001 | Cart & Order | Create order with balance | High | Functional-Positive | Executed | Pass | Order created |
| TC-ORDER-002 | Cart & Order | Create order insufficient balance | High | Functional-Negative | Executed | Pass | - |
| TC-ORDER-003 | Cart & Order | Create order empty cart | High | Functional-Negative | Executed | Pass | - |
| TC-ORDER-004 | Cart & Order | Create order with VNPay | High | Functional-Positive | Executed | Pass | Payment URL returned |
| TC-ORDER-005 | Cart & Order | Create order missing address | Medium | Functional-Negative | Executed | Pass | - |
| TC-ORDER-006 | Cart & Order | Create order out of stock | High | Functional-Negative | Executed | Pass | - |
| TC-ORDER-007 | Cart & Order | View user orders list | High | Functional-Positive | Executed | Pass | - |
| TC-ORDER-008 | Cart & Order | View order details | High | Functional-Positive | Executed | Pass | - |
| TC-ORDER-009 | Cart & Order | View other user order | High | Security-Negative | Executed | Pass | 403 forbidden |
| TC-ORDER-010 | Cart & Order | Admin view all orders | High | Functional-Positive | Executed | Pass | - |
| TC-ORDER-011 | Cart & Order | Admin update order status | High | Functional-Positive | Executed | Pass | - |
| TC-ORDER-012 | Cart & Order | User update order status | High | Security-Negative | Executed | Pass | 403 forbidden |
| TC-ORDER-013 | Cart & Order | Update invalid status | Medium | Functional-Negative | Executed | Pass | - |
| TC-ORDER-014 | Cart & Order | Update delivered to pending | Medium | Business-Negative | Executed | Pass | Cannot change |
| TC-ORDER-015 | Cart & Order | Cancel pending order | High | Functional-Positive | Executed | Pass | Balance refunded |
| TC-ORDER-016 | Cart & Order | Cancel shipping order | Medium | Business-Negative | Executed | Pass | Cannot cancel |
| TC-ORDER-017 | Cart & Order | Cancel other user order | High | Security-Negative | Executed | Pass | 403 forbidden |
| TC-VNPAY-001 | Cart & Order | VNPay callback success | High | Integration-Positive | Executed | Pass | Order paid |
| TC-VNPAY-002 | Cart & Order | VNPay callback failed | High | Integration-Negative | Executed | Pass | Order cancelled |
| TC-VNPAY-003 | Cart & Order | VNPay invalid signature | High | Security-Negative | Executed | Pass | 400 returned |

**Công thức tính**:
```
Pass Rate = (Passed / Executed) × 100%
Success Rate = ((Passed + Blocked) / Total) × 100%
```

---

### **SHEET 6: DEFECTS DETAILS (Chi tiết lỗi)**

**Cách điền**:

| Bug ID | Module | Title | Severity | Status | Found Date | Fixed Date | Root Cause | Remarks |
|--------|--------|-------|----------|--------|------------|------------|-----------|---------|
| BUG-AUTH-001 | Auth | Login 302 redirect | Medium | ✅ Fixed | 2025-12-19 | 2025-12-20 | Wrong response method | API response format |
| BUG-AUTH-002 | Auth | Reset token message | Low | ✅ Fixed | 2025-12-19 | 2025-12-20 | Generic error message | UX improvement |
| BUG-AUTH-003 | Auth | Email template styling | Low | ✅ Fixed | 2025-12-20 | 2025-12-21 | Incomplete design | Professional image |

**Tính toán**:
```
Defect Density = Total Bugs / KLOC (Thousand Lines of Code)
Defect Fix Rate = (Bugs Fixed / Bugs Found) × 100%
Escape Rate = Bugs in Production / Total Bugs Detected × 100%
```

---

### **SHEET 7: PERFORMANCE METRICS (Chỉ số hiệu năng)**

**Cách điền**:

| Endpoint | Avg Response (ms) | Min (ms) | Max (ms) | Target (ms) | Status |
|----------|-------------------|----------|----------|------------|--------|
| POST /signup | 150 | 120 | 200 | <250 | ✅ Good |
| POST /login | 100 | 80 | 150 | <250 | ✅ Good |
| GET /products | 180 | 160 | 220 | <300 | ✅ Good |
| POST /orders | 200 | 180 | 250 | <300 | ✅ Good |
| PATCH /orders/:id | 120 | 100 | 180 | <250 | ✅ Good |

**Load Testing Results**:

| Scenario | Users | Duration | Success Rate | Remarks |
|----------|-------|----------|--------------|---------|
| Signup concurrent | 100 | 10 min | 100% | No issues |
| Login concurrent | 200 | 10 min | 100% | No errors |
| Mixed operations | 150 | 15 min | 99.8% | 1-2 timeouts |

---

### **SHEET 8: COVERAGE REPORT (Báo cáo coverage)**

**Cách điền**:

| Module | Statements | Branches | Functions | Lines | Status |
|--------|-----------|----------|-----------|-------|--------|
| authController.js | 95.2% | 88.9% | 100% | 95.0% | ✅ Good |
| authMiddleware.js | 92.1% | 85.7% | 100% | 91.8% | ✅ Good |
| User model | 88.5% | 80.0% | 95.2% | 88.3% | ✅ Good |
| Product controller | 89.3% | 82.5% | 93.0% | 88.9% | ✅ Good |
| Order controller | 91.5% | 85.2% | 96.8% | 90.7% | ✅ Good |
| **Overall** | **91.9%** | **84.6%** | **97.0%** | **90.9%** | **✅ Excellent** |

**Target**: ≥80% cho tất cả metrics

**Trend Analysis**:
```
v0.9: 85% → v1.0: 91.9% (Tăng 6.9%)
```

---

### **SHEET 9: DOCUMENT CONTROL (Kiểm soát document)**

**Cách điền**:

| Field | Value |
|-------|-------|
| Template version | 1.0 |
| Template status | Approved |
| Document ID | TEST-REPORT-001-2025 |
| Created date | 21/12/2025 |
| Last modified | 21/12/2025 |
| Created by | Test Team |
| Reviewed by | Test Lead |
| Approved by | Project Manager |

**Revision History**:

| Version | Date | Description | Author | Status |
|---------|------|-------------|--------|--------|
| 0.1 | 2025-12-15 | Initial structure | Test Lead | Draft |
| 0.5 | 2025-12-18 | Add first 3 modules | Test Team | Review |
| 1.0 | 2025-12-21 | Final release | Test Team | Approved |

---

## 🎨 QUY ĐỊNH ĐỊNH DẠNG EXCEL

### Màu sắc (Color Coding)

```
Status:
- ✅ Green (00B050): PASS, GOOD, OK
- ❌ Red (FF0000): FAIL, CRITICAL, ERROR
- 🟡 Yellow (FFFF00): WARNING, MEDIUM, IN PROGRESS
- 🔵 Blue (0070C0): INFO, BLOCKED
- ⚪ Gray (808080): TBD, NOT APPLICABLE
```

### Header Row

```
- Background: Dark Blue (#1F4E78)
- Font Color: White
- Font: Bold, 11pt
- Border: All borders, thin
- Alignment: Center, Vertical Center
```

### Data Rows

```
- Background: Alternating white and light gray (#F2F2F2)
- Font: 10pt, Normal
- Border: All borders, thin
- Alignment: Left, Vertical Center (for text), Center (for numbers)
```

### Summary Rows

```
- Background: Light Blue (#D9E1F2)
- Font: Bold, 11pt
- Border: Double bottom border
```

---

## 📋 CHECKLIST ĐIỀN BÁOCÁO

### Trước khi hoàn thành

- [ ] Sheet 1: Tất cả thông tin cover page điền đầy đủ
- [ ] Sheet 2: Executive summary với kết luận rõ ràng
- [ ] Sheet 3: Defect summary đúng số liệu
- [ ] Sheet 4: Tất cả modules test được ghi lại
- [ ] Sheet 5: Mỗi test case có kết quả thực tế
- [ ] Sheet 6: Mỗi bug được ghi chi tiết
- [ ] Sheet 7: Performance metrics được verify
- [ ] Sheet 8: Code coverage report chính xác
- [ ] Sheet 9: Document control info đầy đủ
- [ ] Tất cả công thức Excel được check
- [ ] Formatting và màu sắc theo quy định
- [ ] Không có typo hoặc lỗi đánh vần

---

## 🔢 CÔNG THỨC EXCEL TÍNH TOÁN

### Sheet 4: Test Execution Summary

```excel
Pass % = PASSED / (PASSED + FAILED) * 100
       = D2 / (D2 + E2) * 100

Example: =D2/(D2+E2)*100
```

### Sheet 3: Defect Summary

```excel
Defect Detection Efficiency = Fixed / Detected * 100
                            = B2 / B1 * 100

Example: =B2/B1*100

Defect Fix Efficiency = Fixed / (Fixed + Remain) * 100
                      = B2 / (B2 + B3) * 100

Example: =B2/(B2+B3)*100
```

### Sheet 8: Coverage Report (tính trung bình)

```excel
Overall Coverage = (SUM of all modules) / COUNT of modules

Example: =SUM(A2:A10) / COUNT(A2:A10)
```

---

## 💾 HƯỚNG DẪN XUẤT BÁOCÁO

### Xuất PDF

1. File → Export as PDF
2. Chọn "Entire Workbook"
3. Chọn format: "Preserve formatting"
4. File name: `Test-Report-[Project]-[Date].pdf`

### Xuất thành file image

1. Sheet muốn export → Right click
2. Chọn "Export Sheet"
3. Format: PNG (1200 DPI cho resolution cao)

### Ghi chú dòng

```
(Thêm ở footer mỗi sheet)

Prepared by: Test Team
Reviewed by: Test Lead  
Approved by: Project Manager
Report Date: 21/12/2025
Document ID: TEST-REPORT-001-2025
```

---

## 🔗 THAM CHIẾU DỮ LIỆU

### Authentication Module
- Tổng TC: 25, Pass: 25, Fail: 0
- Chi tiết: [test-scenarios/01-authentication/test-report.md](../test-scenarios/01-authentication/test-report.md)

### Product Management Module
- Tổng TC: 25, Pass: 25, Fail: 0
- Chi tiết: [test-scenarios/03-product-management/test-cases.md](../test-scenarios/03-product-management/test-cases.md)

### Cart & Order Module
- Tổng TC: 20, Pass: 20, Fail: 0
- Chi tiết: [test-scenarios/04-cart-order/test-cases.md](../test-scenarios/04-cart-order/test-cases.md)

### Consolidated Bugs
- Chi tiết: [test-scenarios/CONSOLIDATED_BUG_REPORT.md](../test-scenarios/CONSOLIDATED_BUG_REPORT.md)

---

## ❓ FAQ

**Q: Có cần tạo lại sheet nếu có test case mới?**  
A: Có, thêm row mới ở sheet 5 (Test Cases Details) với TC ID mới

**Q: Làm sao cập nhật nếu bug được fix?**  
A: Cập nhật sheet 6 - thay đổi Status thành "Fixed", điền "Fixed Date"

**Q: Pass rate nên tính ra sao nếu có blocked test?**  
A: Pass % = Passed / (Passed + Failed), Blocked không ảnh hưởng

**Q: Coverage report lấy từ đâu?**  
A: Chạy `npm test -- --coverage` trong Back-end, lấy data từ output

**Q: Có template Excel sẵn không?**  
A: Sử dụng file [Test Report.xls](./Test_Report_Template.xlsx) (sẽ tạo)

---

**Happy Reporting! 📊**

Để có Excel hoàn chỉnh, bạn có thể download template từ tài liệu này hoặc tạo mới dựa theo hướng dẫn.
