# Module1 - Authentication Tests Workflow

## 🎯 Mục đích

Workflow này tự động chạy test cho **Module1 - Authentication** mỗi khi có thay đổi trên branch `weblau`.

## 🚀 Kích hoạt Workflow

### Tự động kích hoạt khi:

1. **Push code** lên branch `weblau` với các file:
   - `Back-end/controllers/authController.js`
   - `Back-end/models/userModel.js`
   - `Back-end/routes/userRoutes.js`
   - `Back-end/tests/unit/controllers/authController.test.js`
   - `Module1_Auth.md`

2. **Tạo Pull Request** vào branch `weblau`

### Ví dụ:

```bash
# Sửa code authentication
git checkout weblau
git add Back-end/controllers/authController.js
git commit -m "Update authentication logic"
git push origin weblau

# → GitHub Actions sẽ tự động chạy test Module1
```

## 📊 Kết quả Test

### Workflow sẽ hiển thị:

#### 1. **Test Statistics**
```
| Metric        | Value | Status               |
|---------------|-------|----------------------|
| 📝 Total Tests | 31    | -                    |
| ✅ Passed      | 31    | 🎉 All tests passed! |
| ❌ Failed      | 0     | ✨ Perfect!          |
```

#### 2. **Test Coverage by Function**
```
| Function              | Test Cases | Status |
|-----------------------|-----------|--------|
| Signup                | 3 tests   | ✅     |
| SignupAdmin           | 2 tests   | ✅     |
| Login                 | 5 tests   | ✅     |
| VerifyUser            | 2 tests   | ✅     |
| ForgotPassword        | 2 tests   | ✅     |
| VerifyResetPass       | 2 tests   | ✅     |
| ResetPassword         | 2 tests   | ✅     |
| UpdatePassword        | 2 tests   | ✅     |
| Logout                | 1 test    | ✅     |
| Protect Middleware    | 5 tests   | ✅     |
| RestrictTo Middleware | 3 tests   | ✅     |
| ChangeStateUser       | 2 tests   | ✅     |
```

#### 3. **Test Case Mapping**
- **AUTH-001 to AUTH-005**: Signup tests (P & N)
- **AUTH-006 to AUTH-011**: Login tests (P & N)
- **AUTH-012**: Logout test (P)
- **AUTH-013 to AUTH-014**: Verify User tests
- **AUTH-015 to AUTH-016**: Forgot Password tests
- **AUTH-017 to AUTH-018**: Verify Reset Pass tests
- **AUTH-019 to AUTH-020**: Reset Password tests
- **AUTH-021 to AUTH-022**: Update Password tests
- **AUTH-023 to AUTH-024**: Protect Middleware tests (S)
- **AUTH-025**: RestrictTo Middleware test (S)

**Legend:**
- P = Positive Test (9 tests)
- N = Negative Test (13 tests)
- S = Security Test (3 tests)

## 📦 Artifacts

Sau khi chạy xong, workflow sẽ tạo các artifacts:

### 1. **module1-auth-test-results**
- File: `module1-test-results.json`
- Retention: 30 ngày
- Chứa: Kết quả chi tiết của tất cả test cases

### 2. **module1-auth-coverage**
- Folder: `coverage-module1/`
- Retention: 30 ngày
- Chứa: Coverage report HTML

### Cách download:
1. Vào workflow run → **Actions** tab
2. Scroll xuống phần **Artifacts**
3. Click để download

## 💬 Pull Request Comments

Khi tạo PR, bot sẽ tự động comment kết quả:

```markdown
## 🔐 Module1 - Authentication Test Results

| Metric        | Value |
|---------------|-------|
| 📝 Total Tests | 31    |
| ✅ Passed      | 31    |
| ❌ Failed      | 0     |

### 🎉 All tests passed!
Module1 Authentication is working perfectly! ✨

📖 **Details:** Check the workflow run for full report.
```

## 🔧 Configuration

### Environment Variables:
```yaml
NODE_ENV: test
JWT_SECRET: test-jwt-secret-key-for-module1-testing
JWT_EXPIRES_IN: 90d
JWT_COOKIE_EXPIRES_IN: 90
EMAIL_HOST: smtp.gmail.com
EMAIL_PORT: 587
EMAIL_USERNAME: test@example.com
EMAIL_PASSWORD: testpassword
EMAIL_FROM: test@example.com
```

### Timeout:
- Test execution: 5 minutes

## 📖 Tài liệu liên quan

- [Module1_Auth.md](../../Module1_Auth.md) - Chi tiết test cases
- [Test_Case_List.md](../../Test_Case_List.md) - Danh sách tất cả modules
- [authController.test.js](../../Back-end/tests/unit/controllers/authController.test.js) - Test implementation

## 🎓 Hướng dẫn Debug

### Nếu test fail:

1. **Xem log chi tiết:**
   - Vào workflow run
   - Click step "🧪 Run Module1 Authentication Tests"
   - Xem output để biết test nào fail

2. **Download test results:**
   - Download artifact `module1-auth-test-results`
   - Mở file JSON để xem chi tiết

3. **Chạy local:**
   ```bash
   cd Back-end
   npm test -- authController.test.js
   ```

4. **Xem coverage:**
   - Download artifact `module1-auth-coverage`
   - Mở `index.html` trong browser

## ✅ Best Practices

1. **Luôn test local trước khi push:**
   ```bash
   npm test -- authController.test.js
   ```

2. **Kiểm tra coverage:**
   ```bash
   npm test -- authController.test.js --coverage
   ```

3. **Cập nhật Module1_Auth.md** khi thêm test case mới

4. **Xem kết quả trước khi merge PR**

## 🚦 Status Badge

Thêm badge này vào README.md:

```markdown
![Module1 Auth Tests](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/module1-auth-test.yml/badge.svg?branch=weblau)
```

## 📞 Support

Nếu có vấn đề với workflow, check:
1. Logs trong GitHub Actions
2. File `.github/workflows/module1-auth-test.yml`
3. Test file: `Back-end/tests/unit/controllers/authController.test.js`

