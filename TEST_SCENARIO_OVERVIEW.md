# TỔ CHỨC TEST THEO TÌNH HUỐNG

Tài liệu này gom nhóm **test cases / test data / test report / bug report** theo từng tình huống kiểm thử (scenario-based). Dùng cho việc tra cứu nhanh khi review hoặc demo.

## 1. Phân tầng & Mục tiêu

- **Unit Test (White-box)**: Bao phủ logic hàm/controller, branch & boundary.
- **Integration Test (API/Workflow)**: Bao phủ luồng nghiệp vụ giữa các module.
- **System Test (Black-box E2E)**: Bao phủ hành trình người dùng thực tế trên môi trường thật.

## 2. Bảng tình huống tổng hợp

| Mức kiểm thử | Tình huống chính | Test cases tiêu biểu | Test data | Test report | Bug report |
|--------------|------------------|----------------------|-----------|-------------|------------|
| **Unit** | Brand CRUD (pagination, duplicate, invalid ID) | BRD-001..019 | Mock brand objects, invalid IDs | Jest output + coverage | BUG-012 (duplicate guard) – fixed |
| **Unit** | Auth (signup, login, reset, role) | AUTH-001..020 | Mock users, tokens, expired tokens | Jest output + coverage | BUG-001 (302 redirect) – fixed |
| **Unit** | Order (create, status, inventory rollback) | ORD-001..030 | Mock cart, products, balance | Jest output + coverage | BUG-003 (balance check) – fixed |
| **Integration** | Signup → Purchase | STP-001..008 | Seed users/products, in-memory DB | Jest verbose logs | None |
| **Integration** | Purchase with VNPay | VNP-001..006 | VNPay callback params (success/fail) | Jest verbose logs | None |
| **Integration** | Purchase → Review → Comment | PTR-001..007 | Orders, reviews, comments seed | Jest verbose logs | None |
| **Integration** | Admin Product CRUD | ADM-P-001..008 | Admin token, product payloads | Jest verbose logs | None |
| **Integration** | Forgot Password Flow | FPF-001..004 | Reset tokens, email mock | Jest verbose logs | None |
| **System** | E2E: Signup → Login → Purchase → Review | ST-001..012 | Real Mongo seed (5 users, 4 products, 6 categories, 7 brands) | Jest E2E log | BUG-004 (user info structure) – fixed |

## 3. Test data theo tình huống

### 3.1 Unit Test
- **Auth**: email hợp lệ/không hợp lệ, password yếu/mạnh, token hết hạn, role user/admin.
- **Brand**: name null, name duplicate, name quá ngắn/quá dài, invalid ObjectId.
- **Order**: cart rỗng, tồn kho không đủ, balance = 0, status transitions.

### 3.2 Integration Test
- **Signup→Purchase**: email duy nhất, cart tối thiểu 1 item, payment: balance.
- **VNPay**: callback `vnp_ResponseCode` = "00" (success), khác "00" (fail), chữ ký sai.
- **Review flow**: order hợp lệ trước khi review, rating biên (1, 5), comment/like.

### 3.3 System Test (Real DB)
- Seed sẵn: 5 users, 4 products, 6 categories, 7 brands, 2 orders.
- Tạo user mới với email `test{timestamp}@test.com`, password `Test@12345`.
- Order với payments = "balance"; cart quantity = 1.

## 4. Test report theo tình huống

- **Unit & Integration**: xem Jest output và coverage:
  - Chạy: `npm test -- --coverage`
  - Report: `coverage/index.html` (HTML), `coverage/lcov.info` (raw)
- **System**: xem log E2E:
  - Chạy: `npm test tests/system/systemTest.e2e.test.js -- --verbose`
  - Log nằm trong console (đã in trạng thái từng bước)
- **Tổng hợp**: 
  - [TEST_PLAN_AND_DESIGN.md](TEST_PLAN_AND_DESIGN.md)
  - [BAO_CAO_KIEM_THU.md](BAO_CAO_KIEM_THU.md)

## 5. Bug report theo tình huống

| Bug ID | Tình huống | Mô tả | Trạng thái |
|--------|------------|-------|------------|
| BUG-001 | Auth signup | Trả 302 redirect thay vì JSON | Đã fix |
| BUG-002 | Categories | Thiếu auth protect | Đã fix |
| BUG-003 | Order balance | Tạo order khi balance = 0 trả 500 | Đã fix |
| BUG-004 | User info | Response structure không đồng nhất | Đã fix |
| BUG-012 | Brand duplicate | Không chặn tên brand trùng | Đã fix |

## 6. Cách tìm test nhanh theo tình huống

- **Theo file**: xem cây thư mục trong `Back-end/tests/` (unit / integration / system).
- **Theo tên test**: `npm test -- --testNamePattern="<ID hoặc mô tả>"` (vd: `BRD-001`, `Signup`, `VNPay`).
- **Theo file cụ thể**: `npm test tests/integration/signupToPurchase.test.js`.
- **Theo module**: `npm test -- --testPathPattern="productController"`.

## 7. Ghi chú

- Tất cả external services (Email, Cloudinary, VNPay) đã được **mock** trong test để chạy ổn định.
- Unit/Integration dùng **MongoDB Memory Server**; System Test dùng **MongoDB thật + seed data**.
- Pass rate hiện tại: **100% (339/339)**, Coverage: **81.44%**.
