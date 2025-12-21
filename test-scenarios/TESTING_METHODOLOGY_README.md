# ⚠️ QUAN TRỌNG: PHƯƠNG PHÁP KIỂM THỬ VÀ SỐ LIỆU BÁO CÁO

**Ngày tạo**: 21/12/2025  
**Phiên bản**: 1.0.0  
**Trạng thái**: Critical - Bắt buộc đọc trước khi làm việc

---

## 🎯 MỤC ĐÍCH DOCUMENT NÀY

Document này giải thích **sự khác biệt** giữa 2 phương pháp kiểm thử trong dự án và cách xử lý khi số liệu không khớp.

---

## 🔍 TỔNG QUAN VẤN ĐỀ

### Tình huống hiện tại

Dự án có **2 nhóm testing** chạy song song:

```
┌─────────────────────────────────────────────────────────┐
│  TESTING TEAM A - MANUAL TESTING (Terminal)             │
│  - Chạy test thủ công trên terminal                     │
│  - Sử dụng Postman/Thunder Client                       │
│  - Test cases chi tiết từ test-scenarios/               │
│  - Báo cáo: test-report.md trong từng module            │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  TESTING TEAM B - AUTOMATED TESTING (CI/CD)             │
│  - Chạy test tự động qua CI pipeline                    │
│  - Sử dụng Jest/Mocha framework                         │
│  - Test scripts: Back-end/tests/                        │
│  - Báo cáo: CI_OVERVIEW_REPORT.md, Jest coverage        │
└─────────────────────────────────────────────────────────┘
```

### ⚠️ VẤN ĐỀ PHÁT SINH

Do **2 người/team khác nhau** làm test theo 2 cách khác nhau, dẫn đến:

❌ **Số liệu không khớp** giữa:
- Manual test reports (trong test-scenarios/)
- Automated CI reports (CI_OVERVIEW_REPORT.md, Integration_Tests_Report.md)

❌ **Thông tin có thể khác nhau**:
- Số lượng test cases
- Pass/Fail rates
- Bug counts
- Code coverage
- Performance metrics

❌ **Nguyên nhân**:
- Test environment khác nhau (local vs CI)
- Test data khác nhau
- Timing khác nhau (manual slow, CI fast)
- Test scope khác nhau
- Ghi nhận kết quả khác nhau

---

## 📊 SO SÁNH CHI TIẾT

### 1. MANUAL TESTING (Terminal/Postman)

| Aspect | Detail |
|--------|--------|
| **Người thực hiện** | Team A - Manual Testers |
| **Công cụ** | Terminal, Postman, Thunder Client |
| **Test cases** | 70+ test cases từ test-scenarios/ |
| **Môi trường** | Local development (localhost) |
| **Database** | Local MongoDB instance |
| **Test data** | Tạo thủ công từ test-data.json |
| **Execution** | Thủ công, từng test case |
| **Báo cáo** | test-scenarios/{module}/test-report.md |
| **Bugs** | Ghi trong test-scenarios/{module}/bug-report.md |
| **Ưu điểm** | Chi tiết, flexible, dễ debug |
| **Nhược điểm** | Chậm, có thể sai sót, không repeatability |

**Ví dụ kết quả Manual Testing**:
```
Module: Authentication
Total TCs: 25
Passed: 25
Failed: 0
Pass Rate: 100%
Source: test-scenarios/01-authentication/test-report.md
```

---

### 2. AUTOMATED TESTING (CI/CD)

| Aspect | Detail |
|--------|--------|
| **Người thực hiện** | Team B - CI/CD Engineers |
| **Công cụ** | Jest, GitHub Actions/GitLab CI |
| **Test cases** | Test scripts trong Back-end/tests/ |
| **Môi trường** | CI environment (Docker container) |
| **Database** | In-memory MongoDB (MongoMemoryServer) |
| **Test data** | Generated/seeded tự động |
| **Execution** | Tự động khi commit/push code |
| **Báo cáo** | CI_OVERVIEW_REPORT.md, Jest output |
| **Bugs** | CI pipeline logs, GitHub Issues |
| **Ưu điểm** | Nhanh, consistent, repeatable |
| **Nhược điểm** | Khó debug, limited flexibility |

**Ví dụ kết quả Automated Testing**:
```
Module: Authentication
Total Tests: 23 (unit + integration)
Passed: 22
Failed: 1
Pass Rate: 95.7%
Source: Back-end/tests/auth/*.test.js
```

---

## ⚖️ TẠI SAO SỐ LIỆU KHÁC NHAU?

### Lý do hợp lệ (Acceptable Differences)

#### 1. **Test Case Count khác nhau**

**Manual**: 25 test cases (bao gồm edge cases, UI flows)
```
TC-AUTH-001: Signup with valid data
TC-AUTH-002: Signup with existing email
TC-AUTH-003: Password mismatch
...
TC-AUTH-025: Expired token
```

**Automated**: 23 test cases (chỉ API logic)
```
✓ Should signup new user
✓ Should reject duplicate email
✓ Should reject password mismatch
...
(Không có UI tests, không có một số manual scenarios)
```

**Giải thích**: Automated tests thường **không cover** đầy đủ như manual tests vì:
- Không test UI/UX
- Không test manual workflows
- Tập trung vào unit/integration

---

#### 2. **Pass Rate khác nhau**

**Manual**: 100% (25/25 passed)
- Tester có thể "force pass" một số cases
- Skip test cases không chạy được
- Test lại nhiều lần cho đến khi pass

**Automated**: 95.7% (22/23 passed)
- Strict, không bỏ qua lỗi
- Chạy đúng 1 lần
- Fail nếu có lỗi dù nhỏ

**Giải thích**: Automated thường **strict hơn**, nên pass rate có thể thấp hơn.

---

#### 3. **Bug Count khác nhau**

**Manual**: 3 bugs found
```
BUG-AUTH-001: Login 302 redirect (FIXED)
BUG-AUTH-002: Error message unclear (FIXED)
BUG-AUTH-003: Email template (FIXED)
```

**Automated**: 1 bug detected
```
Test "should return JSON on login" failed
```

**Giải thích**: 
- Manual testing tìm được **nhiều bugs hơn** (UX, edge cases)
- Automated chỉ phát hiện **functional bugs**

---

#### 4. **Code Coverage khác nhau**

**Manual**: Không đo được chính xác
- Ước tính ~90% based on test cases

**Automated**: 91.9% measured by Jest
- Statement coverage: 91.9%
- Branch coverage: 84.6%
- Function coverage: 97.0%

**Giải thích**: Chỉ automated tests mới đo được **chính xác** code coverage.

---

#### 5. **Performance Metrics khác nhau**

**Manual**: 
- POST /login: ~150ms (local environment)
- GET /products: ~180ms

**Automated**: 
- POST /login: ~50ms (in-memory DB)
- GET /products: ~60ms

**Giải thích**: CI environment **nhanh hơn** vì:
- In-memory database
- No network latency
- Optimized Docker container

---

## 🔄 CÁCH XỬ LÝ SỐ LIỆU KHÔNG KHỚP

### ✅ CÁCH ĐÚNG: Reconciliation Process

#### Bước 1: Thu thập dữ liệu từ cả 2 nguồn

```
Manual Testing Data (từ test-scenarios/)
├── Module: Authentication - 25 TCs, 100% pass
├── Module: Product - 25 TCs, 100% pass
└── Module: Cart & Order - 20 TCs, 100% pass
Total: 70 TCs, 100% pass

Automated Testing Data (từ CI reports)
├── Unit Tests: 150 tests, 98% pass
├── Integration Tests: 45 tests, 95% pass
└── System Tests: 12 tests, 100% pass
Total: 207 tests, 97% pass
```

#### Bước 2: Tạo bảng so sánh

| Metric | Manual Testing | Automated Testing | Recommendation |
|--------|---------------|-------------------|----------------|
| Test Cases | 70 TCs | 207 tests | Use both (different scope) |
| Pass Rate | 100% | 97% | Report both with context |
| Bugs Found | 3 bugs | 1 bug | Combine = 3 bugs total |
| Code Coverage | N/A | 91.9% | Use automated data |
| Performance | Local timing | CI timing | Use manual (realistic) |

#### Bước 3: Viết Final Report với giải thích

**ĐÚNG** ✅:
```markdown
## Test Execution Summary

### Manual Testing (Scenario-based)
- Total Test Cases: 70
- Pass Rate: 100%
- Environment: Local development
- Scope: End-to-end workflows, UI/UX, edge cases

### Automated Testing (CI/CD)
- Total Tests: 207 (150 unit + 45 integration + 12 system)
- Pass Rate: 97%
- Environment: CI Docker container
- Scope: Code logic, API contracts, performance

### Combined Results
- Overall Test Coverage: 70 scenario TCs + 207 automated tests
- Critical Bugs Found: 3 (all fixed)
- Code Coverage: 91.9% (measured by Jest)
- Recommendation: PASS - Ready for production
```

**SAI** ❌:
```markdown
## Test Execution Summary
- Total Tests: 70 (chỉ lấy manual, bỏ automated)
- Pass Rate: 100% (chỉ manual, che giấu 97% của automated)
- Bugs: 0 (sai! có 3 bugs)
```

---

## 📋 QUY TRÌNH CHUẨN (STANDARD PROCESS)

### Khi Team A (Manual) hoàn thành test

1. ✅ Ghi kết quả vào `test-scenarios/{module}/test-report.md`
2. ✅ Ghi bugs vào `test-scenarios/{module}/bug-report.md`
3. ✅ Notify Team B: "Manual testing completed for {module}"
4. ⏸️ **KHÔNG** tự ý ghi vào báo cáo chung

### Khi Team B (Automated) hoàn thành test

1. ✅ Push test results to CI_OVERVIEW_REPORT.md
2. ✅ Generate code coverage report
3. ✅ Notify Team A: "CI tests completed, check coverage"
4. ⏸️ **KHÔNG** tự ý merge số liệu với manual

### Khi tổng hợp báo cáo cuối (Final Report)

1. ✅ Test Lead/QA Manager thu thập **CẢ 2** nguồn dữ liệu
2. ✅ So sánh và reconcile (theo bảng ở trên)
3. ✅ Viết explanation cho differences
4. ✅ Tạo **Combined Final Report** với cả 2 sections
5. ✅ Review bởi cả Team A và Team B
6. ✅ Approval bởi Project Manager

---

## 🎯 BEST PRACTICES

### ✅ DO (Nên làm)

1. **Document test methodology**
   - Ghi rõ đang làm manual hay automated
   - Ghi rõ environment (local/CI)
   - Ghi rõ tools sử dụng

2. **Maintain separate reports**
   - Manual: test-scenarios/{module}/
   - Automated: CI_OVERVIEW_REPORT.md
   - Combined: TEST_EXECUTION_FINAL_REPORT.md

3. **Cross-reference**
   - Link từ manual report sang automated
   - Link từ bug report sang CI logs
   - Maintain traceability

4. **Regular sync meetings**
   - Daily standup: "What tests did you complete?"
   - Weekly sync: Compare numbers
   - Monthly retrospective: Improve process

5. **Use version control**
   - Commit test reports với message rõ ràng
   - Tag versions: v1.0-manual-tests, v1.0-ci-tests
   - Track changes over time

### ❌ DON'T (Không nên làm)

1. **Đừng override data của nhau**
   - Team A không được sửa CI reports
   - Team B không được sửa manual reports

2. **Đừng cherry-pick số liệu đẹp**
   - Lấy 100% từ manual, bỏ qua 97% từ CI
   - Chọn số bugs ít hơn để report

3. **Đừng blame nhau khi khác nhau**
   - "Team B test sai nên có 3% fail"
   - "Team A quá lỏng nên 100% pass"

4. **Đừng skip reconciliation**
   - Lười so sánh, lấy số liệu đầu tiên thấy
   - Không giải thích differences

5. **Đừng tự ý quyết định final numbers**
   - Chỉ Test Lead/QA Manager mới tổng hợp
   - Cần approval trước khi release

---

## 📊 TEMPLATE BÁO CÁO KẾT HỢP

```markdown
# COMBINED TEST REPORT - [Module Name]

**Date**: [Date]
**Version**: [Version]

---

## 1. MANUAL TESTING RESULTS

**Tester**: Team A - [Names]
**Environment**: Local development (Windows 11, MongoDB local)
**Tools**: Postman, Thunder Client, Terminal
**Test Cases**: From test-scenarios/[module]/test-cases.md

### Results
- Total Test Cases: [X]
- Passed: [Y]
- Failed: [Z]
- Pass Rate: [%]

**Detailed Report**: [Link to test-scenarios/[module]/test-report.md]

---

## 2. AUTOMATED TESTING RESULTS

**CI/CD**: Team B - [Names]
**Environment**: GitHub Actions (Ubuntu, Docker, In-memory MongoDB)
**Tools**: Jest, Mocha, Supertest
**Test Scripts**: Back-end/tests/[module]/*.test.js

### Results
- Total Tests: [X] (breakdown: [Y] unit + [Z] integration)
- Passed: [A]
- Failed: [B]
- Pass Rate: [%]
- Code Coverage: [%]

**Detailed Report**: [Link to CI_OVERVIEW_REPORT.md]

---

## 3. RECONCILIATION & ANALYSIS

### Differences Explanation
| Metric | Manual | Automated | Reason |
|--------|--------|-----------|--------|
| Test Count | [X] | [Y] | Automated includes unit tests |
| Pass Rate | [%] | [%] | Manual more forgiving |
| Bugs | [X] | [Y] | Manual found UX bugs |

### Combined Metrics
- **Total Test Coverage**: [X] manual TCs + [Y] automated tests
- **Overall Quality**: [Assessment]
- **Critical Issues**: [Count] (all resolved)
- **Recommendation**: [PASS/FAIL/CONDITIONAL]

---

## 4. CONCLUSION

[Tổng kết với cả 2 perspectives]

**Sign-off**:
- Manual Test Lead: _____________ Date: _______
- Automation Lead: _____________ Date: _______
- QA Manager: _____________ Date: _______
```

---

## 🔗 TÀI LIỆU THAM KHẢO

### Manual Testing Documents
- [Test Scenarios README](README.md)
- [Authentication Test Cases](01-authentication/test-cases.md)
- [Product Test Cases](03-product-management/test-cases.md)
- [Consolidated Bug Report](CONSOLIDATED_BUG_REPORT.md)

### Automated Testing Documents
- [CI Overview Report](../CI_OVERVIEW_REPORT.md)
- [Integration Tests Report](../Integration_Tests_Report.md)
- [Coverage Report](../Back-end/coverage/index.html)

### Process Documents
- [Test Plan](../TEST_PLAN_AND_DESIGN.md)
- [Test Execution Report](../TEST_EXECUTION_FINAL_REPORT.md)

---

## ❓ FAQ

**Q: Nếu manual có 100% pass nhưng CI có 97% pass, báo cáo số nào?**  
A: Báo cáo **CẢ HAI** với giải thích:
```
Manual Testing: 100% pass (70 test cases)
Automated Testing: 97% pass (207 tests)
Note: Automated testing is more strict and includes
unit/integration tests not covered in manual scenarios.
```

**Q: Nếu manual tìm thấy 3 bugs nhưng CI chỉ detect 1 bug?**  
A: **Combine**: Total 3 bugs (2 found by manual, 1 by CI, overlapping counted once)

**Q: Code coverage lấy từ đâu khi manual không đo được?**  
A: **Luôn lấy từ automated testing** (Jest/Istanbul) - đây là metric chuẩn

**Q: Performance metrics khác nhau quá nhiều, dùng số nào?**  
A: **Dùng manual testing numbers** vì realistic hơn (production-like environment)

**Q: Ai có quyền final decision khi số liệu conflict?**  
A: **QA Manager/Test Lead** - sau khi review cả 2 nguồn và consult với teams

**Q: Khi nào cần escalate?**  
A: Khi:
- Difference > 10% và không giải thích được
- Critical bugs found by one team but missed by other
- Fundamental disagreement về test results

---

## 📞 CONTACTS

**Questions about Manual Testing**:
- Team A Lead: [Email]
- Slack: #manual-testing

**Questions about Automated Testing**:
- Team B Lead: [Email]
- Slack: #ci-cd-testing

**Escalation**:
- QA Manager: [Email]
- Project Manager: [Email]

---

## 📝 REVISION HISTORY

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-12-21 | Initial document | QA Team |

---

## ⚠️ CRITICAL REMINDER

```
┌────────────────────────────────────────────────────────┐
│  🚨 BẮT BUỘC ĐỌC VÀ TUÂN THỦ                           │
│                                                         │
│  1. KHÔNG được tự ý merge số liệu giữa 2 teams        │
│  2. LUÔN document methodology khi report               │
│  3. BÁO CÁO TRUNG THỰC cả manual và automated         │
│  4. GIẢI THÍCH khi có differences                      │
│  5. SYNC thường xuyên giữa 2 teams                    │
│                                                         │
│  Vi phạm = Invalidate toàn bộ test results!           │
└────────────────────────────────────────────────────────┘
```

---

**Document Owner**: QA Manager  
**Last Review**: 21/12/2025  
**Next Review**: Quarterly or when process changes

---

*This document is mandatory reading for all testing team members.*
