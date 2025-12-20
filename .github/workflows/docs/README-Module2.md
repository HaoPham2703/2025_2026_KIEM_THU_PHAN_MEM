# 👤 Module2 - User Management Test Workflow

## 📋 Tổng Quan

Workflow này tự động chạy test cho **Module 2 - User Management** trên branch `weblau`.

## 🎯 Mục Đích

Test các chức năng quản lý người dùng bao gồm:
- ✅ Xem/Cập nhật thông tin cá nhân
- ✅ Quản lý địa chỉ giao hàng (CRUD)
- ✅ Xóa tài khoản
- ✅ Quản lý người dùng (Admin CRUD)

## 🔧 Cấu Hình

### Trigger Events

```yaml
on:
  push:
    branches: [weblau]
  pull_request:
    branches: [weblau]
```

**Workflow chạy khi:**
- Push code lên branch `weblau`
- Tạo hoặc cập nhật Pull Request vào branch `weblau`

### Environment Variables

```yaml
NODE_ENV: test
JWT_SECRET: test-jwt-secret-key-for-module2-testing
JWT_EXPIRES_IN: 90d
JWT_COOKIE_EXPIRES_IN: 90
```

## 📊 Test Coverage

### Function Groups

| Nhóm Chức Năng | Số Test Cases | Mô Tả |
|----------------|---------------|-------|
| **Personal Info** | 9 tests | Get Me, Update Me, Delete Me |
| **Address Management** | 12 tests | CRUD địa chỉ + Set Default |
| **Admin Functions** | 9 tests | User CRUD operations |
| **Tổng** | **30 tests** | Full coverage Module 2 |

### Test Case IDs

```
USER-001 to USER-003: Get Me (Xem thông tin cá nhân)
USER-004 to USER-007: Update Me (Cập nhật thông tin)
USER-008 to USER-009: Delete Me (Xóa tài khoản)
USER-010 to USER-012: Create Address (Thêm địa chỉ)
USER-013 to USER-014: Get User Address (Xem địa chỉ)
USER-015 to USER-016: Update Address (Cập nhật địa chỉ)
USER-017 to USER-019: Delete Address (Xóa địa chỉ)
USER-020 to USER-021: Set Default Address (Đặt địa chỉ mặc định)
USER-022 to USER-023: Get All Users (Admin)
USER-024 to USER-025: Get User (Admin)
USER-026 to USER-027: Update User (Admin)
USER-028 to USER-030: Delete User (Admin)
```

## 🚀 Workflow Steps

### 1. Setup & Dependencies
- Checkout code
- Setup Node.js 18.x
- Install npm dependencies với cache

### 2. Run Tests
```bash
npm test -- userController.test.js --json --outputFile=module2-test-results.json
```

### 3. Generate Reports
- Parse test results từ JSON
- Tạo summary report trên GitHub Actions
- Hiển thị:
  - ✅ Số tests passed
  - ❌ Số tests failed
  - 📊 Coverage by function
  - 🔴 Chi tiết các tests failed

### 4. Artifacts
Upload các artifacts:
- `module2-user-test-results` - JSON test results
- `module2-user-coverage` - Coverage report

Retention: **30 days**

### 5. PR Comment (nếu là Pull Request)
Tự động comment vào PR với:
- Tổng kết test results
- Số tests passed/failed
- Link đến workflow run

## 📖 Tài Liệu Liên Quan

- **Test Cases**: `Module2_User.md`
- **Test File**: `Back-end/tests/unit/controllers/userController.test.js`
- **Controller**: `Back-end/controllers/userController.js`
- **Routes**: `Back-end/routes/userRoutes.js`

## 🔍 Xem Kết Quả Test

### Trên GitHub Actions
1. Vào tab **Actions** của repository
2. Chọn workflow **"Module2 - User Management Tests"**
3. Xem chi tiết run gần nhất

### Download Artifacts
```bash
# Test Results JSON
gh run download <run-id> -n module2-user-test-results

# Coverage Report
gh run download <run-id> -n module2-user-coverage
```

## 🐛 Troubleshooting

### Test Failed?
1. Xem chi tiết trong **GitHub Actions logs**
2. Kiểm tra section **"Failed Tests Details"**
3. Xem error messages và stack traces
4. Fix code và push lại

### Workflow không chạy?
- Kiểm tra branch có đúng là `weblau` không
- Verify workflow file syntax
- Xem GitHub Actions permissions

### Environment Issues?
- Đảm bảo Node.js version 18.x
- Check npm dependencies
- Verify environment variables

## 📈 Metrics & Reports

### Test Summary Format
```markdown
| Metric         | Value | Status |
|----------------|-------|--------|
| Total Tests    | 30    | -      |
| Passed         | XX    | ✅     |
| Failed         | XX    | ❌     |
```

### Coverage by Function
```markdown
| Function          | Test Cases | Description |
|-------------------|-----------|-------------|
| Get Me            | 3 tests   | Xem thông tin cá nhân |
| Update Me         | 4 tests   | Cập nhật thông tin |
| Delete Me         | 2 tests   | Xóa tài khoản |
| Create Address    | 3 tests   | Thêm địa chỉ |
| ...               | ...       | ... |
```

## ⚡ Performance

- **Timeout**: 5 phút cho test suite
- **Caching**: npm dependencies được cache
- **Parallel**: Có thể chạy parallel với các modules khác

## 🔐 Security

- Test credentials chỉ dùng trong môi trường test
- JWT secrets khác với production
- Không expose sensitive data trong logs

## 🎓 Best Practices

1. **Luôn kiểm tra test locally trước khi push:**
   ```bash
   cd Back-end
   npm test -- userController.test.js
   ```

2. **Xem coverage report:**
   ```bash
   npm test -- userController.test.js --coverage
   ```

3. **Fix tests failed ngay lập tức:**
   - Không merge PR nếu tests failed
   - Prioritize fixing failed tests

4. **Update test cases khi thay đổi logic:**
   - Cập nhật `Module2_User.md`
   - Thêm/sửa test cases trong `userController.test.js`

## 📞 Support

Nếu gặp vấn đề, liên hệ:
- Check `Module2_User.md` để hiểu test cases
- Xem logs trong GitHub Actions
- Review code trong `userController.js`

---

**Created:** 18/12/2025  
**Last Updated:** 18/12/2025  
**Version:** 1.0.0

