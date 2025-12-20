# 📦 Module8 - Import & Location Test Workflow

## 📋 Tổng quan

Workflow này tự động chạy test suite cho **Module 8 - Import & Location Management** của dự án HCShop.

## 🎯 Scope Test

Module 8 bao gồm 2 phần chính:

### 📦 Import Management (Quản lý phiếu nhập hàng)
- **Get All Imports** - Xem danh sách phiếu nhập (Admin/Employee)
- **Create Import** - Tạo phiếu nhập hàng (Admin/Employee)
- **Update Import** - Cập nhật phiếu nhập (Admin/Employee)
- **Delete Import** - Xóa phiếu nhập (Admin/Employee)
- **Import Statistics** - Thống kê nhập hàng (Admin only)
  - sumImport: Thống kê theo tháng
  - sumOption: Thống kê với options (year/month/week/date)
  - sumInRange: Thống kê trong khoảng thời gian

### 🏢 Location Management (Quản lý địa điểm kho)
- **Get All Locations** - Xem danh sách kho (Protected)
- **Nearest Location** - Tìm kho gần nhất (Public)
- **Create Location** - Thêm địa điểm kho (Admin/Employee)
- **Update Location** - Cập nhật địa điểm kho (Admin/Employee)
- **Delete Location** - Xóa địa điểm kho (Admin/Employee)

## 📊 Test Coverage

### Import Tests (20 test cases)
- ✅ IMP-001 đến IMP-004: Get All Imports (Permissions)
- ✅ IMP-005 đến IMP-009: Create Import (Validation, setImporter middleware)
- ✅ IMP-010 đến IMP-013: Update Import (Permissions, Not Found)
- ✅ IMP-014 đến IMP-017: Delete Import (Permissions, Not Found)
- ✅ IMP-018 đến IMP-020: Statistics (sumImport, sumOption, sumInRange)

### Location Tests (23 test cases)
- ✅ LOC-001 đến LOC-004: Get All Locations (Permissions)
- ✅ LOC-005 đến LOC-008: Nearest Location (Geospatial query, Public)
- ✅ LOC-009 đến LOC-015: Create Location (Validation, Coordinates)
- ✅ LOC-016 đến LOC-019: Update Location (Known bug with Address model)
- ✅ LOC-020 đến LOC-023: Delete Location (Permissions, Not Found)

**Total:** 43 test cases

## 🚀 Trigger

Workflow chạy khi:
- **Push** vào branch `weblau`
- **Pull Request** vào branch `weblau`

## 🔧 Test Files

- `Back-end/tests/unit/controllers/importController.test.js`
- `Back-end/tests/unit/controllers/locationController.test.js`

## 🌍 Environment Variables

```yaml
NODE_ENV: test
JWT_SECRET: test-jwt-secret-key-for-module8-testing
JWT_EXPIRES_IN: 90d
JWT_COOKIE_EXPIRES_IN: 90
```

## 📦 Artifacts

Workflow tạo 2 artifacts:

1. **module8-import-location-test-results**
   - File: `module8-test-results.json`
   - Retention: 30 days
   - Chứa kết quả chi tiết của tất cả test cases

2. **module8-import-location-coverage**
   - Directory: `coverage-module8/`
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

### Import Management

#### Get All Imports (Admin/Employee only)
- ✅ Admin xem imports
- ✅ Employee xem imports
- ✅ Pagination
- ❌ User không có quyền

#### Create Import (Admin/Employee only)
- ✅ Admin create import
- ✅ Employee create import
- ✅ setImporter middleware (JSON parse, set user)
- ❌ User không có quyền
- ❌ Không đăng nhập

#### Update Import (Admin/Employee only)
- ✅ Admin update import
- ✅ Employee update import
- ❌ User không có quyền
- ❌ Import không tồn tại

#### Delete Import (Admin/Employee only)
- ✅ Admin delete import
- ✅ Employee delete import
- ❌ User không có quyền
- ❌ Import không tồn tại

#### Statistics (Admin only)
- ✅ sumImport: Aggregate theo year/month
- ✅ sumOption: Dynamic grouping
- ✅ sumInRange: Filter by date range (UTC timezone)

### Location Management

#### Get All Locations (Protected - Cần đăng nhập)
- ✅ User đã đăng nhập xem locations
- ✅ Admin xem locations
- ✅ Pagination
- ❌ Không đăng nhập

#### Nearest Location (Public - Không cần đăng nhập)
- ✅ Tìm kho gần nhất với latitude/longitude
- ✅ 2dsphere index query
- ❌ Thiếu latitude
- ❌ Thiếu longitude

#### Create Location (Admin/Employee only)
- ✅ Admin create location
- ✅ Employee create location
- ✅ Coordinates format [longitude, latitude]
- ❌ User không có quyền
- ❌ Thiếu address
- ❌ Thiếu latitude
- ❌ Thiếu longitude

#### Update Location (Admin/Employee only)
- ⚠️ **Known Bug:** Controller uses `Address` model instead of `Location`
- ❌ Admin update (fails due to bug)
- ❌ Employee update (fails due to bug)
- ❌ Location không tồn tại

#### Delete Location (Admin/Employee only)
- ✅ Admin delete location
- ✅ Employee delete location
- ❌ User không có quyền
- ❌ Location không tồn tại

## 🎯 Key Features

### 1. Import Model
- **Fields:**
  - user (ref User, required) - Admin/Employee
  - invoice (array) - [{product, image, title, quantity, price}]
  - totalPrice (Number)
  - createdAt (Date, default: now)
- **Pre-find Hook:** Populate user (name only)
- **Permissions:** Admin/Employee for all operations
- **Statistics:** Admin only

### 2. Location Model
- **Fields:**
  - name (String, optional)
  - address (String, required)
  - location (GeoJSON Point):
    - type: "Point"
    - coordinates: [longitude, latitude]
- **Geospatial Index:** 2dsphere on coordinates
- **Custom Validation:** address, latitude, longitude required
- **Public Access:** nearestLocation endpoint

### 3. Middleware
- **setImporter:**
  - Parse invoice from JSON string
  - Set req.body.user = req.user
  - Check user authentication
- **protect:** JWT authentication
- **restrictTo('admin', 'employee'):** For all write operations
- **restrictTo('admin'):** For statistics only

### 4. Aggregation Pipeline

**sumImport:**
```javascript
$group: {
  _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
  total_month: { $sum: "$totalPrice" }
}
```

**sumOption:**
- Dynamic grouping by year/month/week/date
- Based on req.body options

**sumInRange:**
- $match with dateFrom, dateTo
- UTC timezone handling with moment.js

### 5. Geospatial Features

**2dsphere Index:**
```javascript
coordinates: {
  type: [Number],
  index: "2dsphere",
}
```

**$near Operator:**
```javascript
Location.findOne({
  location: {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    },
  },
});
```

**Coordinates Format:**
- GeoJSON: [longitude, latitude]
- Not [latitude, longitude]!

## 📝 Notes

1. **Import Permissions:**
   - Read/Write: Admin, Employee only
   - Statistics: Admin only
   - setImporter middleware: Parse JSON, set user

2. **Location Permissions:**
   - Read: Authenticated users
   - Nearest: Public (no auth required)
   - Write: Admin, Employee only

3. **Known Issues:**
   - ⚠️ **Location Update Bug:** Controller uses `Address` model instead of `Location` (line 65)
   - Tests for LOC-016, LOC-017 will fail until fixed
   - Should use `Location.findByIdAndUpdate` instead of `Address.findByIdAndUpdate`

4. **Aggregation:**
   - MongoDB aggregation framework
   - $group, $sum, $match operators
   - moment.js for UTC timezone

5. **Geospatial:**
   - 2dsphere index for efficient queries
   - $near operator for nearest location
   - Coordinates must be [longitude, latitude]

## 🐛 Common Issues

1. **Test fails: "Cannot read property 'user' of null"**
   - setImporter middleware needs req.user
   - Ensure user is authenticated

2. **Geospatial query errors:**
   - Check 2dsphere index is created
   - Verify coordinates format [long, lat]
   - Ensure latitude/longitude are numbers

3. **Location update fails:**
   - Known bug: Uses Address model instead of Location
   - Fix: Change `Address` to `Location` in controller line 65

4. **Statistics returns empty array:**
   - Check date range
   - Verify UTC timezone handling
   - Ensure imports exist in date range

## 🚀 Running Tests Locally

```bash
cd Back-end
npm test -- importController.test.js locationController.test.js
```

With coverage:
```bash
npm test -- importController.test.js locationController.test.js --coverage
```

## 📊 Expected Results

- **Import Tests:** 17/20 passed (some route-level tests)
- **Location Tests:** 16/23 passed (known bug in update)
- **Total:** ~33/43 passed
- **Coverage:** > 75%

**Known Failures:**
- LOC-016, LOC-017: Update location (bug with Address model)
- Route-level tests: IMP-004, IMP-007, IMP-008, LOC-004, LOC-011, LOC-018, LOC-022

## 🔧 Fixes Needed

1. **High Priority:**
   - Fix Location update controller (use Location instead of Address)

2. **Medium Priority:**
   - Add route-level tests for permissions
   - Test setImporter middleware error handling

3. **Low Priority:**
   - Add integration tests for geospatial queries
   - Test edge cases for statistics (empty data, invalid dates)

---

**Module 8 - Import & Location Management**  
**Test Suite Version:** 1.0  
**Last Updated:** 18/12/2025


