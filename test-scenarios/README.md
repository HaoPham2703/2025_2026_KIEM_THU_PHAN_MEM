# TEST SCENARIOS - TỔ CHỨC TÀI LIỆU KIỂM THỬ

**Dự án**: E-Commerce System  
**Ngày tạo**: 21/12/2025  
**Phiên bản**: 1.0.0

---

## 📋 TỔNG QUAN

Tài liệu này tổ chức toàn bộ test cases, test data, test reports, và bug reports theo từng tình huống kiểm thử (scenario-based testing). Mỗi module được tổ chức thành một thư mục riêng với đầy đủ tài liệu.

---

## 📂 CẤU TRÚC THƯ MỤC

```
test-scenarios/
├── README.md (file này)
├── 01-authentication/
│   ├── test-cases.md        # 25 test cases
│   ├── test-data.json       # Dữ liệu test cho authentication
│   ├── test-report.md       # Báo cáo kết quả test
│   └── bug-report.md        # Bug reports
├── 02-user-management/
│   ├── test-cases.md
│   ├── test-data.json
│   ├── test-report.md
│   └── bug-report.md
├── 03-product-management/
│   ├── test-cases.md        # 25 test cases
│   ├── test-data.json
│   ├── test-report.md
│   └── bug-report.md
├── 04-cart-order/
│   ├── test-cases.md        # 20 test cases
│   ├── test-data.json
│   ├── test-report.md
│   └── bug-report.md
├── 05-payment/
│   ├── test-cases.md
│   ├── test-data.json
│   ├── test-report.md
│   └── bug-report.md
├── 06-review-comment/
│   ├── test-cases.md
│   ├── test-data.json
│   ├── test-report.md
│   └── bug-report.md
├── 07-brand-category/
│   ├── test-cases.md
│   ├── test-data.json
│   ├── test-report.md
│   └── bug-report.md
└── 08-import-location/
    ├── test-cases.md
    ├── test-data.json
    ├── test-report.md
    └── bug-report.md
```

---

## 🎯 CÁC TÌNH HUỐNG KIỂM THỬ (TEST SCENARIOS)

### 1. Authentication & Authorization (01-authentication/)

**Mô tả**: Kiểm thử các chức năng xác thực và ủy quyền người dùng

**Chức năng bao gồm**:
- Đăng ký tài khoản (Signup)
- Đăng nhập (Login)
- Quên mật khẩu (Forgot Password)
- Đặt lại mật khẩu (Reset Password)
- Cập nhật mật khẩu (Update Password)
- Xác thực tài khoản (Verify Account)
- Phân quyền (Authorization)
- Đăng xuất (Logout)

**Số lượng test cases**: 25  
**Status**: ✅ 100% Pass (25/25)  
**Bugs tìm thấy**: 3 (đã fix)

**Files**:
- [Test Cases](01-authentication/test-cases.md)
- [Test Data](01-authentication/test-data.json)
- [Test Report](01-authentication/test-report.md)
- [Bug Report](01-authentication/bug-report.md)

---

### 2. User Management (02-user-management/)

**Mô tả**: Kiểm thử quản lý thông tin người dùng và địa chỉ

**Chức năng bao gồm**:
- Xem thông tin cá nhân
- Cập nhật thông tin cá nhân
- Quản lý địa chỉ giao hàng
- Xóa tài khoản
- Quản lý users (Admin)
- Thay đổi trạng thái user

**Số lượng test cases**: Đang cập nhật  
**Status**: Đang cập nhật

**Files**: Đang tạo

---

### 3. Product Management (03-product-management/)

**Mô tả**: Kiểm thử quản lý sản phẩm

**Chức năng bao gồm**:
- Xem danh sách sản phẩm (filter, sort, pagination)
- Xem chi tiết sản phẩm
- Tạo sản phẩm (Admin)
- Cập nhật sản phẩm (Admin)
- Xóa sản phẩm (Admin)
- Upload ảnh sản phẩm

**Số lượng test cases**: 25  
**Status**: ✅ 100% Pass (25/25)  
**Bugs tìm thấy**: 0

**Files**:
- [Test Cases](03-product-management/test-cases.md)
- Test Data: Đang tạo
- Test Report: Đang tạo
- Bug Report: Đang tạo

---

### 4. Cart & Order Management (04-cart-order/)

**Mô tả**: Kiểm thử giỏ hàng và đơn hàng

**Chức năng bao gồm**:
- Quản lý giỏ hàng (thêm, sửa, xóa)
- Tạo đơn hàng
- Xem đơn hàng
- Cập nhật trạng thái đơn hàng
- Hủy đơn hàng
- Thanh toán VNPay

**Số lượng test cases**: 20  
**Status**: ✅ 100% Pass (20/20)  
**Bugs tìm thấy**: 0

**Files**:
- [Test Cases](04-cart-order/test-cases.md)
- Test Data: Đang tạo
- Test Report: Đang tạo
- Bug Report: Đang tạo

---

### 5. Payment Management (05-payment/)

**Mô tả**: Kiểm thử các phương thức thanh toán

**Chức năng bao gồm**:
- Thanh toán bằng balance
- Thanh toán VNPay
- Xem lịch sử giao dịch
- Nạp tiền vào tài khoản

**Số lượng test cases**: Đang cập nhật  
**Status**: Đang cập nhật

**Files**: Đang tạo

---

### 6. Review & Comment (06-review-comment/)

**Mô tả**: Kiểm thử đánh giá và bình luận sản phẩm

**Chức năng bao gồm**:
- Tạo review cho sản phẩm
- Cập nhật/xóa review
- Thêm comment vào review
- Like/unlike review
- Xem reviews của sản phẩm

**Số lượng test cases**: Đang cập nhật  
**Status**: Đang cập nhật

**Files**: Đang tạo

---

### 7. Brand & Category Management (07-brand-category/)

**Mô tả**: Kiểm thử quản lý thương hiệu và danh mục

**Chức năng bao gồm**:
- CRUD Brand (Admin)
- CRUD Category (Admin)
- Filter sản phẩm theo brand/category
- Upload logo brand

**Số lượng test cases**: Đang cập nhật  
**Status**: Đang cập nhật

**Files**: Đang tạo

---

### 8. Import & Location Management (08-import-location/)

**Mô tả**: Kiểm thử quản lý nhập hàng và địa điểm

**Chức năng bao gồm**:
- Tạo phiếu nhập hàng (Admin)
- Quản lý locations
- Cập nhật tồn kho

**Số lượng test cases**: Đang cập nhật  
**Status**: Đang cập nhật

**Files**: Đang tạo

---

## 📊 THỐNG KÊ TỔNG HỢP

### Tổng số test cases hiện có

| Module | Test Cases | Passed | Failed | Pass Rate |
|--------|------------|--------|--------|-----------|
| Authentication | 25 | 25 | 0 | 100% |
| User Management | TBD | - | - | - |
| Product Management | 25 | 25 | 0 | 100% |
| Cart & Order | 20 | 20 | 0 | 100% |
| Payment | TBD | - | - | - |
| Review & Comment | TBD | - | - | - |
| Brand & Category | TBD | - | - | - |
| Import & Location | TBD | - | - | - |
| **TOTAL** | **70+** | **70** | **0** | **100%** |

### Bug Summary

| Severity | Total | Fixed | Open | Closed |
|----------|-------|-------|------|--------|
| Critical | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 0 | 0 |
| Medium | 1 | 1 | 0 | 0 |
| Low | 2 | 2 | 0 | 0 |
| **TOTAL** | **3** | **3** | **0** | **0** |

---

## 📝 CÁCH SỬ DỤNG TÀI LIỆU

### 1. Cho Testers

**Để thực hiện test**:
1. Chọn module cần test (vd: 01-authentication)
2. Mở file `test-cases.md` để xem danh sách test cases
3. Sử dụng `test-data.json` cho test data
4. Ghi kết quả vào `test-report.md`
5. Báo cáo bugs vào `bug-report.md`

**Test case format**:
- ID: Mã test case duy nhất (TC-AUTH-001)
- Priority: High/Medium/Low
- Type: Functional/Security/Performance
- Steps: Các bước thực hiện
- Expected Result: Kết quả mong đợi
- Actual Result: Kết quả thực tế

### 2. Cho Developers

**Để fix bugs**:
1. Xem bug reports trong từng module
2. Tìm bug theo ID (vd: BUG-AUTH-001)
3. Xem root cause và fix applied
4. Chạy lại test cases liên quan
5. Update status trong bug report

### 3. Cho Project Managers

**Để theo dõi tiến độ**:
1. Xem file README.md này cho tổng quan
2. Kiểm tra test reports trong từng module
3. Review bug summary và trends
4. Đánh giá coverage và quality metrics

---

## 🎯 CHIẾN LƯỢC KIỂM THỬ

### Test Levels

1. **Unit Test** (White-box)
   - Kiểm thử từng function/controller
   - Code coverage > 80%
   - Branch và boundary coverage

2. **Integration Test** (API)
   - Kiểm thử luồng nghiệp vụ giữa các modules
   - End-to-end workflows
   - API contract testing

3. **System Test** (Black-box)
   - Kiểm thử hệ thống hoàn chỉnh
   - User journey testing
   - Performance và security testing

### Test Types

- ✅ **Functional Testing**: Chức năng hoạt động đúng
- ✅ **Security Testing**: Bảo mật, phân quyền
- ✅ **Performance Testing**: Response time, load testing
- ✅ **Usability Testing**: UX, error messages
- ✅ **Regression Testing**: Không có bug cũ quay lại
- ✅ **Integration Testing**: Tích hợp giữa modules

---

## 🔧 CÔNG CỤ KIỂM THỬ

### Testing Tools
- **Unit & Integration**: Jest (Node.js)
- **API Testing**: Postman, Thunder Client
- **Load Testing**: Artillery, k6
- **Security**: OWASP ZAP
- **Code Coverage**: Istanbul/nyc

### Environment
- **Development**: Local MongoDB
- **Testing**: Isolated test database
- **Staging**: Cloud-based (staging environment)
- **Production**: Production monitoring only

---

## 📅 LỊCH SỬ CẬP NHẬT

| Ngày | Version | Thay đổi | Người cập nhật |
|------|---------|----------|----------------|
| 21/12/2025 | 1.0.0 | Tạo cấu trúc ban đầu | Test Team |
| 21/12/2025 | 1.0.0 | Thêm Authentication module (25 TCs) | Test Team |
| 21/12/2025 | 1.0.0 | Thêm Product Management module (25 TCs) | Test Team |
| 21/12/2025 | 1.0.0 | Thêm Cart & Order module (20 TCs) | Test Team |

---

## 📞 LIÊN HỆ

**Test Lead**: test.lead@company.com  
**Development Lead**: dev.lead@company.com  
**Project Manager**: pm@company.com

---

## 📚 TÀI LIỆU LIÊN QUAN

- [API Documentation](../POSTMAN_SETUP_GUIDE.md)
- [Test Plan](../TEST_PLAN_AND_DESIGN.md)
- [Integration Test Report](../Integration_Tests_Report.md)
- [Final Test Execution Report](../TEST_EXECUTION_FINAL_REPORT.md)

---

## 🎓 GHI CHÚ

### Best Practices
1. ✅ Mỗi test case phải độc lập, không phụ thuộc test khác
2. ✅ Sử dụng test data riêng biệt cho mỗi test
3. ✅ Clean up sau mỗi test (xóa test data)
4. ✅ Test cả positive và negative cases
5. ✅ Focus vào boundary values và edge cases
6. ✅ Document tất cả bugs với root cause
7. ✅ Update test cases khi requirements thay đổi

### Test Data Management
- Sử dụng factories/builders để tạo test data
- Không hardcode sensitive data
- Sử dụng random data cho uniqueness
- Clean database trước mỗi test suite

### Reporting
- Update test reports sau mỗi test run
- Screenshot cho visual bugs
- Log files cho debugging
- Metrics: pass rate, coverage, performance

---

**End of Document**
