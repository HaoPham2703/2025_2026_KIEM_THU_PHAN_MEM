# KẾ HOẠCH KIỂM THỬ (ĐỊNH DẠNG MẪU)

Phiên bản: v1.0 — Ngày 2025-12-21 — Phạm vi Back-end (API) và System E2E.
Các số liệu bên dưới lấy từ bộ test hiện tại (Jest) của dự án.

## 1. Bảng đặc tả tính năng và số lượng test cases

| No | Name of features/functions | Outline of features/functions | Number of Test case (estimate, from test defs) | Note |
|----|----------------------------|--------------------------------|-----------------------------------------------|------|
| 1  | Auth & User Management | Signup, login, forgot/reset password, role/permission, profile, address | 74 | Gồm unit (auth/user controllers) + integration (signup/login/forgot/address). |
| 2  | Product Catalog & Admin CRUD | Product listing/detail, admin create/update/delete/import, checkout view | 47 | Unit product controller + integration view product, admin CRUD. |
| 3  | Cart/Order/Payment | Cart to order, balance/VNPay payment, refund/cancel, status email, statistics | 92 | Unit order/transaction + integration purchase, cancel/refund, VNPay, statistics, status email. |
| 4  | Review & Comment | Create/update review, like/comment flows, rating boundaries | 46 | Unit review/comment + integration purchase-to-review, review-comment-like. |
| 5  | Brand & Category | CRUD, duplicate guard, pagination/filter | 35 | Unit brand/category controllers. |
| 6  | Import & Location | Inventory import, location/address CRUD | 49 | Unit import/location + integration admin import, user address management. |
| 7  | System E2E | Signup → login → purchase → review (real DB) | 13 | tests/system/systemTest.e2e.test.js. |
|    | **Tổng cộng** | | **356** | Sum of all test definitions (it/test) in Back-end/tests. |

## 3.2 Acceptance Test Criteria

- Test coverage (statement): 81.44% (target ≥ 80%).
- Successful test coverage: 356/356 test cases pass (unit 244, integration 99, system 13).
- Defects: 0 open, 5 đã fix (BUG-001, BUG-002, BUG-003, BUG-004, BUG-012).
- Code review/UT exit: unit suite hoàn thành, không còn test đỏ.
- Handover: tài liệu và script đầy đủ, chạy được trên máy Windows + MongoDB cục bộ.

## 5. Test Strategy

- **Test types**: Function, Business Cycle, UI (API contract), Data/DB Integrity, Performance (planned), Security/Access Control (planned), Regression.
- **Function Testing**: chạy từng use case với dữ liệu hợp lệ/không hợp lệ; tool: Jest + supertest (API), MongoDB Memory Server cho unit/integration.
- **Business Cycle Testing**: mô phỏng luồng mua hàng nhiều bước (signup/login → add to cart → pay → review); log và dữ liệu kiểm soát bằng seed/test fixtures.
- **UI (API contract) Testing**: xác minh schema/fields trả về, mã trạng thái, thông báo lỗi khi input sai; kiểm tra điều hướng endpoint và auth header.
- **Data & DB Integrity**: kiểm tra CRUD và quan hệ (order-product, review-order, comment-review), xác minh ghi nhận đúng và rollback khi lỗi.
- **Performance (định hướng)**: dự kiến dùng k6/Artillery để đo throughput ở các API checkout, payment, sản phẩm; mục tiêu P95 < 800ms ở tải 50 RPS (chưa triển khai).
- **Security & Access Control (định hướng)**: kiểm tra role (admin/user), bảo vệ endpoint; kế hoạch bổ sung quét OWASP ZAP cho XSS/CSRF/IDOR.
- **Regression**: chạy toàn bộ 356 test trước khi release; ưu tiên các flow mua hàng, thanh toán, review, auth.
- **Completion criteria**: tất cả test kế hoạch đã chạy; không còn defect hở; log test lưu cùng báo cáo.
- **Special considerations**: mock Email/Cloudinary/VNPay trong unit/integration; System test cần MongoDB thật và seed data.

## 5.2 Test stages

| Type of Tests | Unit | Integration | System | Acceptance |
|---------------|------|-------------|--------|------------|
| Function Test | X | X | X | X |
| API/UI contract | X | X | X | |
| Performance | (planned) | X (planned) | X (planned) | |
| Load/Stress/Volume | | (planned) | X (planned) | |
| Security | X (role) | X (role) | X (planned scan) | |
| Data integrity | X | X | X | |
| Regression | X | X | X | X |

## 7. Resource

### 7.1 Human Resource

| Worker/Doer | Role | Responsibilities | Location |
|-------------|------|------------------|----------|
| Test Leader | Test Lead | Lập kế hoạch, phân công, review test case/report | Vietnam |
| Tester 1 | Tester | Viết & chạy Unit/Integration cho auth/product/order | Vietnam |
| Tester 2 | Tester | Viết & chạy System test, tổng hợp báo cáo | Vietnam |

### 7.2 Test management
- Test management: theo dõi bằng git + Jest output; log lưu kèm run.
- Defect management: ghi nhận/đóng trong bảng bug nội bộ (BUG-001..012) và cập nhật vào [BAO_CAO_KIEM_THU.md](BAO_CAO_KIEM_THU.md).

## 9. Test Environment

- **Hardware**: Laptop Windows 10/11, RAM ≥ 8GB, SSD ≥ 20GB trống cho MongoDB.
- **Software**: Node.js LTS, npm, MongoDB local; Jest + supertest; MongoDB Memory Server cho unit/integration; VS Code.
- **Infrastructure/Tools**: Jest (test runner), Supertest (API), MongoDB Memory Server, Git. Dự kiến thêm k6/Artillery (perf), OWASP ZAP (security).

## 11. Test Milestones

| Milestone | Status | Date |
|-----------|--------|------|
| Tạo & chạy Unit tests | Hoàn thành | 2025-12-20 |
| Tạo & chạy Integration tests | Hoàn thành | 2025-12-20 |
| Tạo & chạy System tests | Hoàn thành (13/13 pass) | 2025-12-21 |
| Báo cáo Test Plan/Design/Report | Hoàn thành | 2025-12-21 |
| Hiệu năng & Security test | Kế hoạch | Sau 2025-12 |

## 13. Deliverables

| No | Deliverables | Language | Delivered Date |
|----|--------------|----------|----------------|
| 1 | Test Plan & Design: [TEST_PLAN_AND_DESIGN.md](TEST_PLAN_AND_DESIGN.md) | Vietnamese | 2025-12-21 |
| 2 | Test Report: [BAO_CAO_KIEM_THU.md](BAO_CAO_KIEM_THU.md) | Vietnamese | 2025-12-21 |
| 3 | User Guide: [HUONG_DAN_SU_DUNG.md](HUONG_DAN_SU_DUNG.md) | Vietnamese | 2025-12-21 |
| 4 | Scenario overview: [TEST_SCENARIO_OVERVIEW.md](TEST_SCENARIO_OVERVIEW.md) | Vietnamese | 2025-12-21 |
| 5 | Unit test suite (244 cases) | Vietnamese/EN mix | 2025-12-20 |
| 6 | Integration test suite (99 cases) | Vietnamese/EN mix | 2025-12-20 |
| 7 | System test suite (13 cases) | Vietnamese/EN mix | 2025-12-21 |
| 8 | Defect log (BUG-001..012) | Vietnamese | 2025-12-21 |

Ghi chú: Content guideline dạng <> đã được loại bỏ; tất cả số liệu lấy từ bộ test thực tế (Back-end/tests, Jest). Nếu cần cập nhật mốc hoặc bổ sung perf/security, thêm vào các mục 5.1 và 11.
