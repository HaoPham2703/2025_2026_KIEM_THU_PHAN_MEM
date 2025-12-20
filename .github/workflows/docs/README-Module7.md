# 🏷️ Module7 - Brand & Category Test Workflow

## 📋 Tổng quan

Workflow này tự động chạy test suite cho **Module 7 - Brand & Category Management** của dự án HCShop.

## 🎯 Scope Test

Module 7 bao gồm 2 phần chính:

### 🏷️ Brand Management (Quản lý thương hiệu)
- **Get All Brands** - Xem danh sách thương hiệu (Public)
- **Create Brand** - Thêm thương hiệu (Admin/Employee)
- **Update Brand** - Cập nhật thương hiệu (Admin/Employee)
- **Delete Brand** - Xóa thương hiệu (Admin/Employee)

### 📂 Category Management (Quản lý danh mục)
- **Get All Categories** - Xem danh sách danh mục (Protected)
- **Create Category** - Thêm danh mục (Admin/Employee)
- **Update Category** - Cập nhật danh mục (Admin/Employee)
- **Delete Category** - Xóa danh mục (Admin/Employee)

## 📊 Test Coverage

### Brand Tests (16 test cases)
- ✅ BRD-001 đến BRD-004: Get All Brands (Read operations)
- ✅ BRD-005 đến BRD-012: Create Brand (Validation, Permissions)
- ✅ BRD-013 đến BRD-016: Update Brand (Permissions, Not Found)
- ✅ BRD-017 đến BRD-020: Delete Brand (Permissions, Not Found)

### Category Tests (16 test cases)
- ✅ CAT-001 đến CAT-004: Get All Categories (Read operations)
- ✅ CAT-005 đến CAT-012: Create Category (Validation, Slug, Permissions)
- ✅ CAT-013 đến CAT-016: Update Category (Permissions, Not Found)
- ✅ CAT-017 đến CAT-020: Delete Category (Permissions, Not Found)

**Total:** 32 test cases

## 🚀 Trigger

Workflow chạy khi:
- **Push** vào branch `weblau`
- **Pull Request** vào branch `weblau`

## 🔧 Test Files

- `Back-end/tests/unit/controllers/brandController.test.js`
- `Back-end/tests/unit/controllers/categoryController.test.js`

## 🌍 Environment Variables

```yaml
NODE_ENV: test
JWT_SECRET: test-jwt-secret-key-for-module7-testing
JWT_EXPIRES_IN: 90d
JWT_COOKIE_EXPIRES_IN: 90
```

## 📦 Artifacts

Workflow tạo 2 artifacts:

1. **module7-brand-category-test-results**
   - File: `module7-test-results.json`
   - Retention: 30 days
   - Chứa kết quả chi tiết của tất cả test cases

2. **module7-brand-category-coverage**
   - Directory: `coverage-module7/`
   - Retention: 30 days
   - Chứa báo cáo code coverage

## 📊 Test Report

### GitHub Actions Summary

Workflow tự động tạo report trong GitHub Actions Summary bao gồm:

- 📊 **Test Summary:**
  - Total Tests
  - ✅ Passed
  - ❌ Failed

- ❌ **Failed Tests Details:**
  - Test name
  - Error message
  - Stack trace (nếu có)

### Pull Request Comments

Khi chạy từ Pull Request, workflow sẽ tự động comment kết quả test vào PR.

## 🔍 Chi Tiết Test

### Brand Management

#### Get All Brands (Public - Không cần đăng nhập)
- ✅ Xem danh sách brands
- ✅ Pagination
- ✅ Sort
- ✅ Search/Filter

#### Create Brand (Admin/Employee only)
- ✅ Admin create brand
- ✅ Employee create brand
- ❌ User không có quyền create
- ❌ Không đăng nhập
- ✅ Validation: required name
- ✅ Validation: min length (2 chars)
- ✅ Validation: max length (40 chars)
- ✅ Unique constraint

#### Update Brand (Admin/Employee only)
- ✅ Admin update brand
- ✅ Employee update brand
- ❌ User không có quyền update
- ❌ Brand không tồn tại

#### Delete Brand (Admin/Employee only)
- ✅ Admin delete brand
- ✅ Employee delete brand
- ❌ User không có quyền delete
- ❌ Brand không tồn tại

### Category Management

#### Get All Categories (Protected - Cần đăng nhập)
- ✅ User đã đăng nhập xem categories
- ✅ Pagination
- ✅ Sort
- ❌ Không đăng nhập

#### Create Category (Admin/Employee only)
- ✅ Admin create category (slug auto-generated)
- ✅ Employee create category
- ❌ User không có quyền create
- ✅ Validation: required name
- ✅ Validation: min length (2 chars)
- ✅ Validation: max length (40 chars)
- ✅ Unique constraint
- ✅ Slug generation (pre-save hook)

#### Update Category (Admin/Employee only)
- ✅ Admin update category
- ✅ Employee update category
- ❌ User không có quyền update
- ❌ Category không tồn tại

#### Delete Category (Admin/Employee only)
- ✅ Admin delete category
- ✅ Employee delete category
- ❌ User không có quyền delete
- ❌ Category không tồn tại

## 🎯 Key Features

### 1. Brand Model
- **Fields:** name (required, unique, 2-40 chars)
- **Public Read:** Không cần authentication
- **Write Operations:** Admin/Employee only

### 2. Category Model
- **Fields:** name (required, unique, 2-40 chars), slug (auto-generated)
- **Pre-save Hook:** Slugify name → slug
- **Protected Read:** Cần authentication
- **Write Operations:** Admin/Employee only

### 3. Factory Pattern
- Both controllers sử dụng `handlerFactory`:
  - `getAll()` - Pagination, Sort, Filter
  - `getOne()` - Get by ID
  - `createOne()` - Create with validation
  - `updateOne()` - Update with validation
  - `deleteOne()` - Soft/Hard delete

### 4. Middleware
- `protect` - JWT authentication
- `restrictTo('admin', 'employee')` - Role-based authorization

## 📝 Notes

1. **Brand vs Category Permissions:**
   - Brand Read: Public (no auth required)
   - Category Read: Protected (auth required)
   - Both Write: Admin/Employee only

2. **Slug Generation:**
   - Category tự động tạo slug từ name
   - Pre-save hook sử dụng `slugify` package
   - Example: "Test Category" → "test-category"

3. **Validation:**
   - Both models có validation giống nhau
   - Min length: 2 chars
   - Max length: 40 chars
   - Unique constraint trên name

4. **Error Codes:**
   - 200: Success (GET, PATCH)
   - 201: Created (POST)
   - 204: No Content (DELETE)
   - 400: Bad Request (Validation error)
   - 401: Unauthorized (No token)
   - 403: Forbidden (Wrong role)
   - 404: Not Found
   - 11000: Duplicate key (Mongoose)

## 🔗 Related Files

- Test Cases: `Module7_Brand_Category.md`
- Controller Tests: 
  - `brandController.test.js`
  - `categoryController.test.js`
- Controllers:
  - `Back-end/controllers/brandController.js`
  - `Back-end/controllers/categoryController.js`
- Models:
  - `Back-end/models/brandModel.js`
  - `Back-end/models/categoryModel.js`

## 📈 Success Criteria

- ✅ All 32 test cases pass
- ✅ Code coverage > 80%
- ✅ No linting errors
- ✅ All CRUD operations work correctly
- ✅ Permissions properly enforced
- ✅ Validation working as expected
- ✅ Slug generation for categories

## 🐛 Common Issues

1. **Test fails: "Schema hasn't been registered"**
   - Ensure Category/Brand models are imported in test setup
   - Check mongoose connection

2. **Authentication errors:**
   - Verify JWT_SECRET is set
   - Check user roles (admin/employee/user)

3. **Slug not generated:**
   - Check slugify package is installed
   - Verify pre-save hook in categoryModel

## 🚀 Running Tests Locally

```bash
cd Back-end
npm test -- brandController.test.js categoryController.test.js
```

With coverage:
```bash
npm test -- brandController.test.js categoryController.test.js --coverage
```

## 📊 Expected Results

- **Brand Tests:** 16/16 passed
- **Category Tests:** 16/16 passed
- **Total:** 32/32 passed (100%)
- **Coverage:** > 80%

---

**Module 7 - Brand & Category Management**  
**Test Suite Version:** 1.0  
**Last Updated:** 18/12/2025

