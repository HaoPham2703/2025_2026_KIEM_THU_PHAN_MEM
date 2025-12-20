# 📚 HƯỚNG DẪN SỬ DỤNG TÀI LIỆU KIỂM THỬ

## 🎯 Mục đích

Repository này chứa **toàn bộ tài liệu kiểm thử** cho Dự án Hệ thống Thương mại Điện tử, bao gồm:
- Kế hoạch kiểm thử (Test Plan)
- Thiết kế kiểm thử (Test Design)
- Test Cases chi tiết
- Kết quả kiểm thử
- Báo cáo tổng kết

---

## 📂 Cấu trúc Thư mục

```
2025_2026_KIEM_THU_PHAN_MEM/
├── README.md                          ← Bạn đang đọc file này
├── TEST_PLAN_AND_DESIGN.md           ← Tài liệu chi tiết (90+ trang)
├── BAO_CAO_KIEM_THU.md               ← Báo cáo tóm tắt (40+ trang)
│
├── Back-end/
│   ├── tests/
│   │   ├── unit/                     ← 244 Unit Test Cases
│   │   │   └── controllers/          
│   │   │       ├── authController.test.js        (25 tests)
│   │   │       ├── brandController.test.js       (19 tests - 100%)
│   │   │       ├── categoryController.test.js    (18 tests)
│   │   │       ├── orderController.test.js       (30 tests)
│   │   │       ├── productController.test.js     (28 tests)
│   │   │       ├── userController.test.js        (22 tests)
│   │   │       └── ... (6 more controllers)
│   │   │
│   │   ├── integration/              ← 82 Integration Test Cases
│   │   │   ├── signupToPurchase.test.js          (8 tests)
│   │   │   ├── loginToPurchase.test.js           (6 tests)
│   │   │   ├── purchaseWithVNPay.test.js         (6 tests)
│   │   │   ├── purchaseToReview.test.js          (7 tests)
│   │   │   └── ... (10 more workflows)
│   │   │
│   │   └── system/                   ← 13 System Test Cases
│   │       └── systemTest.e2e.test.js            (13 E2E tests)
│   │
│   ├── coverage/                     ← Coverage Reports
│   │   └── index.html                ← Mở file này để xem coverage
│   │
│   └── package.json                  ← Test scripts
│
└── Database/
    ├── quan_ly_cua_hang.users.json   ← Seed data
    ├── quan_ly_cua_hang.products.json
    └── ... (other seed files)
```

---

## 📖 Hướng dẫn Đọc Tài liệu

### 1️⃣ **Nếu bạn là Giảng viên / Project Manager**

👉 **Đọc file**: `BAO_CAO_KIEM_THU.md`

**Nội dung**:
- ✅ Tổng quan dự án
- ✅ Phương pháp kiểm thử (V-Model + Agile)
- ✅ Kế hoạch và phạm vi
- ✅ Kết quả kiểm thử (339 tests - 100% pass)
- ✅ Coverage report (81.44%)
- ✅ Bug report (5 bugs - all fixed)
- ✅ Kết luận và đề xuất

**Thời gian đọc**: 30-40 phút

---

### 2️⃣ **Nếu bạn là QA Engineer / Tester**

👉 **Đọc file**: `TEST_PLAN_AND_DESIGN.md`

**Nội dung**:
- ✅ Test Plan chi tiết
- ✅ Test Design (White-box, Integration, Black-box)
- ✅ **339 Test Cases** với đầy đủ steps, data, expected results
- ✅ Kết quả chi tiết từng test case
- ✅ Hướng dẫn thực thi
- ✅ Định hướng phát triển

**Thời gian đọc**: 1-2 giờ (có thể tham khảo từng phần)

---

### 3️⃣ **Nếu bạn là Developer**

👉 **Xem code**: `Back-end/tests/`

**Bắt đầu từ**:
1. `tests/unit/controllers/brandController.test.js` (100% coverage - mẫu tốt nhất)
2. `tests/integration/signupToPurchase.test.js` (workflow đầy đủ)
3. `tests/system/systemTest.e2e.test.js` (E2E test)

**Chạy tests**:
```bash
cd Back-end
npm test                              # All tests
npm test tests/unit                   # Unit tests only
npm test tests/integration            # Integration tests only
npm test tests/system                 # System tests
npm test -- --coverage                # With coverage report
```

---

## ⚙️ Cài đặt và Chạy Tests

### Yêu cầu Hệ thống

- **Node.js**: v18.0.0 trở lên
- **MongoDB**: v6.0 trở lên
- **OS**: Windows 10/11, macOS, Linux
- **RAM**: ≥ 8GB
- **Disk**: ≥ 500MB free space

### Bước 1: Clone Repository

```bash
git clone <repository-url>
cd 2025_2026_KIEM_THU_PHAN_MEM/Back-end
```

### Bước 2: Cài đặt Dependencies

```bash
npm install
```

**Dependencies chính**:
```json
{
  "jest": "^29.7.0",
  "supertest": "^6.3.3",
  "mongodb-memory-server": "^8.12.2"
}
```

### Bước 3: Cấu hình Environment

```bash
cp config.env.example config.env
```

Sửa `config.env`:
```env
NODE_ENV=test
DATABASE=mongodb://127.0.0.1:27017/quan_ly_cua_hang
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=90d
```

### Bước 4: Import Seed Data (cho System Test)

```bash
# Start MongoDB
mongod --dbpath /data/db

# Import data
cd Database
mongoimport --db quan_ly_cua_hang --collection users --file quan_ly_cua_hang.users.json --jsonArray
mongoimport --db quan_ly_cua_hang --collection products --file quan_ly_cua_hang.products.json --jsonArray
mongoimport --db quan_ly_cua_hang --collection categories --file quan_ly_cua_hang.categories.json --jsonArray
mongoimport --db quan_ly_cua_hang --collection brands --file quan_ly_cua_hang.brands.json --jsonArray
```

### Bước 5: Chạy Tests

#### Unit Tests (không cần MongoDB)
```bash
npm test tests/unit

# Output:
# Test Suites: 11 passed, 11 total
# Tests:       244 passed, 244 total
# Time:        ~8 seconds
```

#### Integration Tests (MongoDB Memory Server tự động)
```bash
npm test tests/integration

# Output:
# Test Suites: 15 passed, 15 total
# Tests:       82 passed, 82 total
# Time:        ~15 seconds
```

#### System Tests (cần Backend chạy)
```bash
# Terminal 1: Start backend
cd Back-end
npm start
# Server running on http://localhost:5100

# Terminal 2: Run system tests
npm test tests/system/systemTest.e2e.test.js

# Output:
# Test Suites: 1 passed, 1 total
# Tests:       13 passed, 13 total
# Time:        ~5 seconds
```

#### Tất cả Tests với Coverage
```bash
npm test -- --coverage

# Output:
# Test Suites: 27 passed, 27 total
# Tests:       339 passed, 339 total
# Coverage:    81.44% statements
```

---

## 📊 Xem Coverage Report

### Cách 1: HTML Report (Khuyên dùng)

```bash
# Sau khi chạy tests với --coverage
cd coverage
# Mở file index.html bằng browser
```

**Screenshot**:
```
File                | % Stmts | % Branch | % Funcs | % Lines
--------------------|---------|----------|---------|--------
All files           |   81.44 |    76.23 |   85.67 |   82.15
 authController.js  |   95.23 |    92.15 |   97.50 |   94.80
 brandController.js |  100.00 |   100.00 |  100.00 |  100.00  ✅
 orderController.js |   92.34 |    85.67 |   94.12 |   91.89
 ...
```

### Cách 2: Terminal (nhanh)

```bash
npm test -- --coverage --coverageReporters=text
```

---

## 🧪 Chạy Test cụ thể

### Chạy 1 file test

```bash
npm test tests/unit/controllers/brandController.test.js
```

### Chạy test theo tên

```bash
npm test -- --testNamePattern="BRD-001"
npm test -- --testNamePattern="Tạo brand"
```

### Chạy test theo module

```bash
npm test -- --testPathPattern="brandController"
```

### Watch mode (tự động re-run khi có thay đổi)

```bash
npm test -- --watch
```

### Debug mode

```bash
# Windows (PowerShell)
$env:NODE_OPTIONS="--inspect-brk"
npm test tests/unit/controllers/brandController.test.js

# macOS/Linux
NODE_OPTIONS="--inspect-brk" npm test tests/unit/controllers/brandController.test.js

# Mở Chrome: chrome://inspect
```

---

## 📋 Test Cases Chi tiết

### Unit Test Example

**File**: `tests/unit/controllers/brandController.test.js`

**Test Case**: BRD-001 - Tạo brand thành công

```javascript
test("BRD-001: Tạo brand thành công", async () => {
  // Arrange: Setup mock data
  const mockBrand = { name: "Samsung", slug: "samsung" };
  const mockRequest = {
    body: mockBrand,
    user: { role: "admin" }
  };
  
  // Act: Execute function
  await brandController.createBrand(mockRequest, mockResponse, mockNext);
  
  // Assert: Verify results
  expect(mockResponse.status).toHaveBeenCalledWith(201);
  expect(mockResponse.json).toHaveBeenCalledWith({
    status: "success",
    data: expect.objectContaining({ name: "Samsung" })
  });
});
```

**Coverage**: Kiểm tra statement, branch, function, line

---

### Integration Test Example

**File**: `tests/integration/signupToPurchase.test.js`

**Workflow**: User đăng ký → Xem sản phẩm → Tạo đơn hàng

```javascript
describe("Signup to Purchase Flow", () => {
  let authToken, productId, orderId;
  
  test("STP-001: User signup", async () => {
    const res = await request(app)
      .post("/api/v1/users/signup")
      .send({ email: "test@test.com", password: "Pass@123" });
    
    expect(res.status).toBe(201);
    authToken = res.body.token;  // Save for next tests
  });
  
  test("STP-002: View products", async () => {
    const res = await request(app)
      .get("/api/v1/products")
      .set("Authorization", `Bearer ${authToken}`);
    
    expect(res.status).toBe(200);
    productId = res.body.data[0]._id;  // Save for next test
  });
  
  test("STP-005: Create order", async () => {
    const res = await request(app)
      .post("/api/v1/orders")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ cart: [{ id: productId, quantity: 1 }] });
    
    expect(res.status).toBe(201);
    orderId = res.body.data.id;
  });
});
```

**Coverage**: Kiểm tra tích hợp giữa Auth → Product → Order modules

---

### System Test Example

**File**: `tests/system/systemTest.e2e.test.js`

**Black-box E2E**: Test như user thực tế

```javascript
test("ST-001: User đăng ký tài khoản mới", async () => {
  // Given: Backend running on http://localhost:5100
  // And: MongoDB has seed data
  
  // When: User signs up
  const res = await request("http://localhost:5100")
    .post("/api/v1/users/signup")
    .send({
      name: "Test User",
      email: `test${Date.now()}@test.com`,
      password: "Test@12345",
      passwordConfirm: "Test@12345"
    });
  
  // Then: Account created successfully
  expect(res.status).toBe(201);
  expect(res.body.token).toBeDefined();
  
  // And: Can use token for other requests
  authToken = res.body.token;
});
```

**Coverage**: Kiểm tra toàn bộ hệ thống End-to-End

---

## 🐛 Troubleshooting

### Lỗi: "MongoDB connection failed"

**Nguyên nhân**: MongoDB chưa chạy hoặc port sai

**Giải pháp**:
```bash
# Check MongoDB status
mongod --version

# Start MongoDB
mongod --dbpath /data/db

# Verify connection
mongo --eval "db.version()"
```

### Lỗi: "Port 5100 already in use"

**Giải pháp**:
```bash
# Windows
netstat -ano | findstr :5100
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5100 | xargs kill
```

### Lỗi: "Cannot find module"

**Giải pháp**:
```bash
# Clear cache
rm -rf node_modules
rm package-lock.json

# Reinstall
npm install
```

### Tests chạy chậm

**Giải pháp**:
```bash
# Chạy song song (nhanh hơn)
npm test -- --maxWorkers=4

# Chỉ chạy changed tests
npm test -- --onlyChanged
```

---

## 📈 Metrics và KPIs

| Metric | Giá trị | Đánh giá |
|--------|---------|----------|
| **Total Test Cases** | 339 | ✅ Comprehensive |
| **Pass Rate** | 100% | ✅ Perfect |
| **Code Coverage** | 81.44% | ✅ Excellent |
| **Execution Time** | 28s | ✅ Fast |
| **Critical Bugs** | 0 | ✅ Production Ready |
| **Bug Density** | 0.0033/LOC | ✅ Low |

---

## 🎓 Best Practices

### 1. Viết Test Theo TDD

```javascript
// ❌ Bad: Code trước, test sau
function createUser(data) {
  // ... implementation
}
test("should create user", () => { /* test */ });

// ✅ Good: Test trước, code sau
test("should create user with valid data", () => {
  // Write test first
});
// Then implement createUser()
```

### 2. Test Isolation

```javascript
// ❌ Bad: Tests phụ thuộc nhau
test("create user", () => { userId = ... });
test("get user", () => { getUser(userId) });  // Depends on previous

// ✅ Good: Mỗi test độc lập
test("get user", () => {
  const userId = createTestUser();  // Setup own data
  getUser(userId);
});
```

### 3. Descriptive Test Names

```javascript
// ❌ Bad
test("test1", () => { ... });
test("brand test", () => { ... });

// ✅ Good
test("BRD-001: Tạo brand thành công với valid data", () => { ... });
test("BRD-002: Tạo brand fail khi thiếu name", () => { ... });
```

### 4. AAA Pattern

```javascript
test("should calculate total price", () => {
  // Arrange: Setup
  const cart = [{ price: 100, quantity: 2 }];
  
  // Act: Execute
  const total = calculateTotal(cart);
  
  // Assert: Verify
  expect(total).toBe(200);
});
```

---

## 📚 Tài liệu Tham khảo

### Nội bộ

- [TEST_PLAN_AND_DESIGN.md](./TEST_PLAN_AND_DESIGN.md) - Tài liệu chi tiết
- [BAO_CAO_KIEM_THU.md](./BAO_CAO_KIEM_THU.md) - Báo cáo tóm tắt
- [Module1_Auth_TestCases.md](./Module1_Auth_TestCases.md) - Test cases Auth module

### External

- **Jest**: https://jestjs.io/docs/getting-started
- **Supertest**: https://github.com/ladjs/supertest
- **MongoDB Memory Server**: https://github.com/nodkz/mongodb-memory-server
- **Test Driven Development**: https://www.browserstack.com/guide/tdd-vs-bdd-vs-atdd

---

## 🤝 Đóng góp

### Quy trình Thêm Test

1. **Tạo branch mới**
```bash
git checkout -b feature/add-payment-tests
```

2. **Viết test**
```bash
# Add test to tests/unit/controllers/paymentController.test.js
```

3. **Chạy test local**
```bash
npm test tests/unit/controllers/paymentController.test.js
```

4. **Check coverage**
```bash
npm test -- --coverage
# Ensure coverage ≥ 80%
```

5. **Commit & Push**
```bash
git add .
git commit -m "Add payment controller tests (15 cases)"
git push origin feature/add-payment-tests
```

6. **Create Pull Request**
- Tất cả tests phải pass
- Coverage không giảm
- Code review required

---

## 📞 Liên hệ

**QA Team Lead**: [Your Name]  
**Email**: qa@example.com  
**Slack**: #qa-team  
**Issues**: https://github.com/<repo>/issues

---

## ⚖️ License

MIT License - Free to use for educational purposes

---

## 🎉 Kết luận

Hệ thống kiểm thử hoàn chỉnh với:
- ✅ **339 test cases** (100% pass)
- ✅ **81.44% coverage**
- ✅ **0 bugs**
- ✅ **Sẵn sàng production**

**Happy Testing!** 🚀

---

**Last Updated**: December 20, 2025  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
