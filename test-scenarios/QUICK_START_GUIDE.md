# HƯỚNG DẪN SỬ DỤNG TÀI LIỆU TEST SCENARIOS

**Ngày tạo**: 21/12/2025  
**Phiên bản**: 1.0.0

---

## 🎯 MỤC ĐÍCH

Tài liệu này hướng dẫn cách sử dụng các file test documentation được tổ chức theo tình huống kiểm thử trong thư mục `test-scenarios/`.

---

## 📂 CẤU TRÚC TÀI LIỆU ĐÃ TẠO

```
test-scenarios/
│
├── README.md                           # Tổng quan tất cả scenarios
├── CONSOLIDATED_BUG_REPORT.md          # Tổng hợp bugs từ tất cả modules
├── QUICK_START_GUIDE.md                # File này - hướng dẫn nhanh
│
├── 01-authentication/                  # ✅ HOÀN THÀNH
│   ├── test-cases.md                   # 25 test cases
│   ├── test-data.json                  # Test data cho authentication
│   ├── test-report.md                  # Báo cáo chi tiết
│   └── bug-report.md                   # 3 bugs (đã fix)
│
├── 02-user-management/                 # 🔄 Đang tạo
│   └── (Files sẽ được tạo tương tự)
│
├── 03-product-management/              # ✅ HOÀN THÀNH
│   ├── test-cases.md                   # 25 test cases
│   └── test-data.json                  # Test data cho products
│
├── 04-cart-order/                      # ✅ HOÀN THÀNH
│   ├── test-cases.md                   # 20 test cases
│   └── test-data.json                  # Test data cho cart & order
│
└── 05-payment/ ... 08-import-location/ # 🔄 Sẽ được tạo tiếp
```

---

## 🚀 CÁCH SỬ DỤNG

### 1️⃣ CHO TESTERS (Người kiểm thử)

#### Bước 1: Chọn Module cần test
```
Ví dụ: Muốn test chức năng Authentication
→ Vào thư mục: test-scenarios/01-authentication/
```

#### Bước 2: Đọc Test Cases
```
Mở file: test-cases.md
- Xem danh sách tất cả test cases (25 TCs)
- Mỗi TC có:
  • ID (TC-AUTH-001)
  • Mức độ ưu tiên (High/Medium/Low)
  • Loại test (Functional/Security)
  • Bước thực hiện chi tiết
  • Kết quả mong đợi
```

#### Bước 3: Sử dụng Test Data
```
Mở file: test-data.json
- Tìm test data theo test_id
- Copy dữ liệu để sử dụng trong test
- Ví dụ:
  {
    "test_id": "USER-001",
    "email": "nguyenvana@test.com",
    "password": "Test@123"
  }
```

#### Bước 4: Thực hiện Test
```
1. Chạy test theo steps trong test-cases.md
2. So sánh kết quả thực tế với kết quả mong đợi
3. Ghi nhận: Pass ✅ hoặc Fail ❌
```

#### Bước 5: Báo cáo kết quả
```
- Nếu Pass: Update status trong test-report.md
- Nếu Fail: Tạo bug report trong bug-report.md
  • Severity (Critical/High/Medium/Low)
  • Steps to reproduce
  • Expected vs Actual
  • Screenshots nếu cần
```

---

### 2️⃣ CHO DEVELOPERS (Lập trình viên)

#### Khi nhận bug report:

1. **Tìm bug trong module tương ứng**
   ```
   Ví dụ: BUG-AUTH-001 
   → Vào: test-scenarios/01-authentication/bug-report.md
   ```

2. **Đọc thông tin bug**
   - Root Cause (nguyên nhân)
   - Steps to reproduce (cách tái hiện)
   - Expected vs Actual (kết quả mong đợi vs thực tế)

3. **Fix bug và test lại**
   ```
   - Fix code theo root cause
   - Chạy lại test case liên quan
   - Update status trong bug-report.md
   - Commit với message: "fix: BUG-AUTH-001 - description"
   ```

4. **Verify fix**
   ```
   - Chạy regression test
   - Đảm bảo không phá tests khác
   - Update test-report.md
   ```

---

### 3️⃣ CHO PROJECT MANAGERS (Quản lý dự án)

#### Dashboard nhanh:

**Xem tổng quan**:
```
File: test-scenarios/README.md
- Tổng số test cases: 70+
- Pass rate: 100%
- Số bugs: 3 (đã fix hết)
```

**Xem bugs tổng hợp**:
```
File: test-scenarios/CONSOLIDATED_BUG_REPORT.md
- Bug summary table
- Bug trends
- Risk assessment
- Quality metrics
```

**Xem tiến độ từng module**:
```
Mỗi module có test-report.md riêng:
- Authentication: ✅ 100% pass (25/25)
- Product: ✅ 100% pass (25/25)
- Cart & Order: ✅ 100% pass (20/20)
- Others: 🔄 In progress
```

**Báo cáo cho stakeholders**:
```
Use: CONSOLIDATED_BUG_REPORT.md
- Executive Summary
- Quality Score: A+ (98/100)
- Risk Assessment
- Recommendations
```

---

## 📋 CÁC FILE QUAN TRỌNG

### 1. README.md (Tổng quan)
```
📍 Location: test-scenarios/README.md
📖 Content:
  - Cấu trúc tất cả modules
  - Thống kê tổng hợp
  - Chiến lược testing
  - Lịch sử cập nhật
```

### 2. Test Cases (Chi tiết test)
```
📍 Location: test-scenarios/{module}/test-cases.md
📖 Content:
  - Danh sách tất cả test cases
  - Steps chi tiết
  - Expected results
  - Actual results
```

### 3. Test Data (Dữ liệu test)
```
📍 Location: test-scenarios/{module}/test-data.json
📖 Content:
  - Valid test data
  - Invalid test data
  - Boundary values
  - Edge cases
```

### 4. Test Report (Báo cáo kết quả)
```
📍 Location: test-scenarios/{module}/test-report.md
📖 Content:
  - Test execution summary
  - Pass/Fail statistics
  - Performance metrics
  - Coverage report
```

### 5. Bug Report (Báo cáo lỗi)
```
📍 Location: test-scenarios/{module}/bug-report.md
📖 Content:
  - Bug details
  - Root cause analysis
  - Fix applied
  - Regression testing
```

---

## 🎓 BEST PRACTICES

### Khi viết Test Cases:

✅ **DO**:
- Viết steps rõ ràng, dễ hiểu
- Include cả positive và negative tests
- Test boundary values
- Document expected results chi tiết
- Sử dụng ID duy nhất (TC-XXX-001)

❌ **DON'T**:
- Viết steps mơ hồ
- Skip negative test cases
- Hardcode sensitive data
- Duplicate test cases
- Forget to update results

### Khi báo cáo Bugs:

✅ **DO**:
- Include steps to reproduce
- Attach screenshots/logs
- Specify severity correctly
- Document root cause (nếu biết)
- Link related test cases

❌ **DON'T**:
- Report duplicate bugs
- Miss important details
- Use vague descriptions
- Forget to update status
- Skip severity assessment

### Khi sử dụng Test Data:

✅ **DO**:
- Use test_id để reference
- Keep data consistent
- Document usage clearly
- Update when requirements change
- Separate valid/invalid data

❌ **DON'T**:
- Use production data
- Hardcode in test code
- Mix different test scenarios
- Forget to clean up
- Leave sensitive data

---

## 🔍 TÌM KIẾM NHANH

### Tìm Test Case theo ID:
```bash
# Windows PowerShell
Get-ChildItem -Path test-scenarios -Recurse -Filter "test-cases.md" | 
  Select-String "TC-AUTH-001"
```

### Tìm Bug theo ID:
```bash
Get-ChildItem -Path test-scenarios -Recurse -Filter "bug-report.md" | 
  Select-String "BUG-AUTH-001"
```

### Tìm tất cả failed tests:
```bash
Get-ChildItem -Path test-scenarios -Recurse -Filter "test-cases.md" | 
  Select-String "❌ Fail"
```

---

## 📊 METRICS & KPIs

### Test Coverage:
```
Location: test-scenarios/README.md
- Authentication: 25 TCs
- Product: 25 TCs  
- Cart & Order: 20 TCs
- Total: 70+ TCs
```

### Pass Rate:
```
Current: 100% (70/70 passed)
Target: ≥95%
Status: ✅ Excellent
```

### Bug Metrics:
```
Total Bugs: 3
Fixed: 3 (100%)
Critical: 0
High: 0
Status: ✅ Excellent
```

### Code Coverage:
```
Overall: 91.9%
Target: ≥80%
Status: ✅ Excellent
```

---

## 🔗 LIÊN KẾT NHANH

### Documentation:
- [Main README](README.md) - Tổng quan
- [Bug Summary](CONSOLIDATED_BUG_REPORT.md) - Tổng hợp bugs
- [Test Plan](../TEST_PLAN_AND_DESIGN.md) - Kế hoạch test
- [API Docs](../POSTMAN_SETUP_GUIDE.md) - API documentation

### Module Documentation:
- [Authentication](01-authentication/test-cases.md) - 25 TCs
- [Product Management](03-product-management/test-cases.md) - 25 TCs
- [Cart & Order](04-cart-order/test-cases.md) - 20 TCs

### Reports:
- [Integration Tests](../Integration_Tests_Report.md)
- [Final Report](../TEST_EXECUTION_FINAL_REPORT.md)

---

## ❓ FAQ

**Q: Tôi muốn thêm test case mới, làm thế nào?**
A: Mở file test-cases.md của module tương ứng, thêm test case mới theo format có sẵn với ID tiếp theo.

**Q: Làm sao để chạy test?**
A: 
- Unit/Integration tests: `npm test` trong thư mục Back-end/
- Manual tests: Theo steps trong test-cases.md
- Postman: Import collection và chạy

**Q: Test data ở đâu?**
A: Trong file test-data.json của mỗi module, format JSON dễ sử dụng.

**Q: Tôi tìm thấy bug, làm gì tiếp?**
A: 
1. Kiểm tra đã có bug tương tự chưa
2. Tạo bug report mới trong bug-report.md
3. Notify team qua chat/email
4. Assign cho developer

**Q: Làm sao update test report?**
A: Sau khi chạy test, update kết quả trong test-report.md và commit changes.

---

## 📞 SUPPORT

**Test Lead**: test.lead@company.com  
**Dev Lead**: dev.lead@company.com  
**PM**: pm@company.com

**Slack Channel**: #testing  
**Wiki**: https://wiki.company.com/testing

---

## 📝 CHANGELOG

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0.0 | 2025-12-21 | Initial creation | Test Team |
| 1.0.0 | 2025-12-21 | Added 3 modules (Auth, Product, Cart) | Test Team |

---

## 🎯 NEXT STEPS

### Immediate (This Week):
- ✅ Complete documentation structure
- 🔄 Finish remaining modules (User, Payment, Review, Brand, Import)
- 🔄 Add more test data
- 🔄 Create video tutorials

### Short-term (Next Sprint):
- 🔄 Automate test execution
- 🔄 Integrate with CI/CD
- 🔄 Add performance tests
- 🔄 Security testing

### Long-term (Next Quarter):
- 🔄 Test management tool integration
- 🔄 Automated reporting
- 🔄 Machine learning for test optimization

---

**Happy Testing! 🚀**

---

*Nếu có câu hỏi hoặc cần hỗ trợ, vui lòng liên hệ Test Team.*
