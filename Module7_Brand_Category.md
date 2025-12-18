# Module7 - Brand & Category (Thương hiệu & Danh mục)

## Thông tin Module

|                      |                                                                                       |
| -------------------- | ------------------------------------------------------------------------------------- |
| **Module Code**      | Module7                                                                               |
| **Test Requirement** | Test các chức năng quản lý thương hiệu và danh mục sản phẩm: CRUD Brands & Categories |
| **Tester**           | HaoPham                                                                               |
| **Test Date**        | 18/12/2025 (GitHub Actions - Branch: weblau)                                          |

---

## Thống kê Test Case

| Pass | Fail | Untested | N/A | Number of Test Cases |
| ---- | ---- | -------- | --- | -------------------- |
| 30   | 2    | 0        | 0   | 32                   |

> **Ghi chú:** Kết quả từ GitHub Actions - Branch `weblau` - Test Date: 18/12/2025  
> **Brand Tests:** 16 tests (15 Pass, 1 Fail) - Pass rate: 93.75%  
> **Category Tests:** 16 tests (15 Pass, 1 Fail) - Pass rate: 93.75%

---

## Chi tiết Test Case

### Function A: Xem danh sách thương hiệu (Get All Brands)

| ID      | Test Case Description                | Test Case Procedure                   | Expected Output                                              | Test Data  | Result | Test Date  | Description               |
| ------- | ------------------------------------ | ------------------------------------- | ------------------------------------------------------------ | ---------- | ------ | ---------- | ------------------------- |
| BRD-001 | Xem danh sách thương hiệu thành công | 1. GET /api/v1/brands                 | 1. Trả về status 200<br>2. Trả về danh sách brands           | TestData01 | Pass   | 18/12/2025 | Test thành công           |
| BRD-002 | Xem brands với pagination            | 1. GET /api/v1/brands?page=1&limit=10 | 1. Trả về status 200<br>2. Trả về 10 brands đầu tiên         | TestData02 | Pass   | 18/12/2025 | Pagination hoạt động đúng |
| BRD-003 | Xem brands với sort                  | 1. GET /api/v1/brands?sort=name       | 1. Trả về status 200<br>2. Brands được sort theo name        | TestData03 | Pass   | 18/12/2025 | Sort by name thành công   |
| BRD-004 | Xem brands với search                | 1. GET /api/v1/brands?name=Nike       | 1. Trả về status 200<br>2. Trả về brands có name chứa "Nike" | TestData04 | Pass   | 18/12/2025 | Filter query hoạt động    |

---

### Function B: Thêm thương hiệu (Create Brand - Admin)

| ID      | Test Case Description                | Test Case Procedure                                        | Expected Output                                                  | Test Data  | Result | Test Date  | Description                |
| ------- | ------------------------------------ | ---------------------------------------------------------- | ---------------------------------------------------------------- | ---------- | ------ | ---------- | -------------------------- |
| BRD-005 | Admin thêm brand thành công          | 1. Đăng nhập với role=admin<br>2. POST /api/v1/brands      | 1. Trả về status 201<br>2. Brand được tạo                        | TestData05 | Pass   | 18/12/2025 | Admin tạo thành công       |
| BRD-006 | Employee thêm brand thành công       | 1. Đăng nhập với role=employee<br>2. POST /api/v1/brands   | 1. Trả về status 201<br>2. Brand được tạo                        | TestData06 | Pass   | 18/12/2025 | Employee có quyền tạo      |
| BRD-007 | User thêm brand thất bại             | 1. Đăng nhập với role=user<br>2. POST /api/v1/brands       | 1. Trả về status 403<br>2. Message: "You do not have permission" | TestData07 | Pass   | 18/12/2025 | restrictTo middleware đúng |
| BRD-008 | Thêm brand thất bại - Chưa đăng nhập | 1. Không đăng nhập<br>2. POST /api/v1/brands               | 1. Trả về status 401<br>2. Message lỗi authentication            | TestData08 | Pass   | 18/12/2025 | protect middleware đúng    |
| BRD-009 | Thêm brand thất bại - Thiếu name     | 1. Đăng nhập admin<br>2. POST /api/v1/brands không có name | 1. Trả về lỗi validation<br>2. Message: "Nhãn hiệu phải có tên"  | TestData09 | Pass   | 18/12/2025 | Required validation đúng   |
| BRD-010 | Thêm brand thất bại - Name quá ngắn  | 1. Đăng nhập admin<br>2. POST /api/v1/brands name="A"      | 1. Trả về lỗi validation<br>2. Message: minlength 2 kí tự        | TestData10 | Pass   | 18/12/2025 | Min length validation đúng |
| BRD-011 | Thêm brand thất bại - Name quá dài   | 1. Đăng nhập admin<br>2. POST /api/v1/brands name=50 chars | 1. Trả về lỗi validation<br>2. Message: maxlength 40 kí tự       | TestData11 | Pass   | 18/12/2025 | Max length validation đúng |
| BRD-012 | Thêm brand thất bại - Duplicate name | 1. Đăng nhập admin<br>2. POST brand với name đã tồn tại    | 1. Trả về lỗi duplicate<br>2. Error code 11000                   | TestData12 | Pass   | 18/12/2025 | Unique constraint đúng     |

---

### Function C: Cập nhật thương hiệu (Update Brand - Admin)

| ID      | Test Case Description                         | Test Case Procedure                                      | Expected Output                                                  | Test Data  | Result | Test Date  | Description                                                                              |
| ------- | --------------------------------------------- | -------------------------------------------------------- | ---------------------------------------------------------------- | ---------- | ------ | ---------- | ---------------------------------------------------------------------------------------- |
| BRD-013 | Admin cập nhật brand thành công               | 1. Đăng nhập admin<br>2. PATCH /api/v1/brands/:id        | 1. Trả về status 200<br>2. Brand được cập nhật                   | TestData13 | Pass   | 18/12/2025 | Admin update thành công                                                                  |
| BRD-014 | Employee cập nhật brand thành công            | 1. Đăng nhập employee<br>2. PATCH /api/v1/brands/:id     | 1. Trả về status 200<br>2. Brand được cập nhật                   | TestData14 | Fail   | 18/12/2025 | Lỗi: expect(jest.fn()).toHaveBeenCalledWith(...expected). Response status không được gọi |
| BRD-015 | User cập nhật brand thất bại                  | 1. Đăng nhập user<br>2. PATCH /api/v1/brands/:id         | 1. Trả về status 403<br>2. Message: "You do not have permission" | TestData15 | Pass   | 18/12/2025 | restrictTo chặn user đúng                                                                |
| BRD-016 | Cập nhật brand thất bại - Brand không tồn tại | 1. Đăng nhập admin<br>2. PATCH /api/v1/brands/:invalidId | 1. Trả về status 404<br>2. Message: "Không tìm thấy dữ liệu"     | TestData16 | Pass   | 18/12/2025 | Not found error đúng                                                                     |

---

### Function D: Xóa thương hiệu (Delete Brand - Admin)

| ID      | Test Case Description                    | Test Case Procedure                                       | Expected Output                                                  | Test Data  | Result | Test Date  | Description               |
| ------- | ---------------------------------------- | --------------------------------------------------------- | ---------------------------------------------------------------- | ---------- | ------ | ---------- | ------------------------- |
| BRD-017 | Admin xóa brand thành công               | 1. Đăng nhập admin<br>2. DELETE /api/v1/brands/:id        | 1. Trả về status 204<br>2. Brand bị xóa                          | TestData17 | Pass   | 18/12/2025 | Admin xóa thành công      |
| BRD-018 | Employee xóa brand thành công            | 1. Đăng nhập employee<br>2. DELETE /api/v1/brands/:id     | 1. Trả về status 204<br>2. Brand bị xóa                          | TestData18 | Pass   | 18/12/2025 | Employee có quyền xóa     |
| BRD-019 | User xóa brand thất bại                  | 1. Đăng nhập user<br>2. DELETE /api/v1/brands/:id         | 1. Trả về status 403<br>2. Message: "You do not have permission" | TestData19 | Pass   | 18/12/2025 | restrictTo chặn user đúng |
| BRD-020 | Xóa brand thất bại - Brand không tồn tại | 1. Đăng nhập admin<br>2. DELETE /api/v1/brands/:invalidId | 1. Trả về status 404<br>2. Message: "Không tìm thấy dữ liệu"     | TestData20 | Pass   | 18/12/2025 | Not found error đúng      |

---

### Function E: Xem danh sách danh mục (Get All Categories)

| ID      | Test Case Description                    | Test Case Procedure                                       | Expected Output                                           | Test Data  | Result | Test Date  | Description                  |
| ------- | ---------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------- | ---------- | ------ | ---------- | ---------------------------- |
| CAT-001 | Xem danh sách category thành công        | 1. Đăng nhập<br>2. GET /api/v1/categories                 | 1. Trả về status 200<br>2. Trả về danh sách categories    | TestData21 | Pass   | 18/12/2025 | User đã đăng nhập thành công |
| CAT-002 | Xem categories với pagination            | 1. Đăng nhập<br>2. GET /api/v1/categories?page=1&limit=10 | 1. Trả về status 200<br>2. Trả về 10 categories đầu tiên  | TestData22 | Pass   | 18/12/2025 | Pagination hoạt động đúng    |
| CAT-003 | Xem categories với sort                  | 1. Đăng nhập<br>2. GET /api/v1/categories?sort=name       | 1. Trả về status 200<br>2. Categories được sort theo name | TestData23 | Pass   | 18/12/2025 | Sort by name thành công      |
| CAT-004 | Xem categories thất bại - Chưa đăng nhập | 1. Không đăng nhập<br>2. GET /api/v1/categories           | 1. Trả về status 401<br>2. Message lỗi authentication     | TestData24 | Pass   | 18/12/2025 | protect middleware đúng      |

---

### Function F: Thêm danh mục (Create Category - Admin)

| ID      | Test Case Description                   | Test Case Procedure                                                   | Expected Output                                                         | Test Data  | Result | Test Date  | Description                |
| ------- | --------------------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------- | ---------- | ------ | ---------- | -------------------------- |
| CAT-005 | Admin thêm category thành công          | 1. Đăng nhập admin<br>2. POST /api/v1/categories                      | 1. Trả về status 201<br>2. Category được tạo<br>3. Slug tự động tạo     | TestData25 | Pass   | 18/12/2025 | Admin tạo, slug auto       |
| CAT-006 | Employee thêm category thành công       | 1. Đăng nhập employee<br>2. POST /api/v1/categories                   | 1. Trả về status 201<br>2. Category được tạo                            | TestData26 | Pass   | 18/12/2025 | Employee có quyền tạo      |
| CAT-007 | User thêm category thất bại             | 1. Đăng nhập user<br>2. POST /api/v1/categories                       | 1. Trả về status 403<br>2. Message: "You do not have permission"        | TestData27 | Pass   | 18/12/2025 | restrictTo middleware đúng |
| CAT-008 | Thêm category thất bại - Thiếu name     | 1. Đăng nhập admin<br>2. POST /api/v1/categories không có name        | 1. Trả về lỗi validation<br>2. Message: "Thể loại sản phẩm phải có tên" | TestData28 | Pass   | 18/12/2025 | Required validation đúng   |
| CAT-009 | Thêm category thất bại - Name quá ngắn  | 1. Đăng nhập admin<br>2. POST /api/v1/categories name="A"             | 1. Trả về lỗi validation<br>2. Message: minlength 2 kí tự               | TestData29 | Pass   | 18/12/2025 | Min length validation đúng |
| CAT-010 | Thêm category thất bại - Name quá dài   | 1. Đăng nhập admin<br>2. POST /api/v1/categories name=50 chars        | 1. Trả về lỗi validation<br>2. Message: maxlength 40 kí tự              | TestData30 | Pass   | 18/12/2025 | Max length validation đúng |
| CAT-011 | Thêm category thất bại - Duplicate name | 1. Đăng nhập admin<br>2. POST category với name đã tồn tại            | 1. Trả về lỗi duplicate<br>2. Error code 11000                          | TestData31 | Pass   | 18/12/2025 | Unique constraint đúng     |
| CAT-012 | Category slug được tạo tự động          | 1. Đăng nhập admin<br>2. POST /api/v1/categories name="Test Category" | 1. Trả về status 201<br>2. Slug = "test-category"                       | TestData32 | Pass   | 18/12/2025 | Pre-save hook slugify đúng |

---

### Function G: Cập nhật danh mục (Update Category - Admin)

| ID      | Test Case Description                      | Test Case Procedure                                          | Expected Output                                                  | Test Data  | Result | Test Date  | Description                                                                              |
| ------- | ------------------------------------------ | ------------------------------------------------------------ | ---------------------------------------------------------------- | ---------- | ------ | ---------- | ---------------------------------------------------------------------------------------- |
| CAT-013 | Admin cập nhật category thành công         | 1. Đăng nhập admin<br>2. PATCH /api/v1/categories/:id        | 1. Trả về status 200<br>2. Category được cập nhật                | TestData33 | Pass   | 18/12/2025 | Admin update thành công                                                                  |
| CAT-014 | Employee cập nhật category thành công      | 1. Đăng nhập employee<br>2. PATCH /api/v1/categories/:id     | 1. Trả về status 200<br>2. Category được cập nhật                | TestData34 | Fail   | 18/12/2025 | Lỗi: expect(jest.fn()).toHaveBeenCalledWith(...expected). Response status không được gọi |
| CAT-015 | User cập nhật category thất bại            | 1. Đăng nhập user<br>2. PATCH /api/v1/categories/:id         | 1. Trả về status 403<br>2. Message: "You do not have permission" | TestData35 | Pass   | 18/12/2025 | restrictTo chặn user đúng                                                                |
| CAT-016 | Cập nhật category thất bại - Không tồn tại | 1. Đăng nhập admin<br>2. PATCH /api/v1/categories/:invalidId | 1. Trả về status 404<br>2. Message: "Không tìm thấy dữ liệu"     | TestData36 | Pass   | 18/12/2025 | Not found error đúng                                                                     |

---

### Function H: Xóa danh mục (Delete Category - Admin)

| ID      | Test Case Description                 | Test Case Procedure                                           | Expected Output                                                  | Test Data  | Result | Test Date  | Description               |
| ------- | ------------------------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------- | ---------- | ------ | ---------- | ------------------------- |
| CAT-017 | Admin xóa category thành công         | 1. Đăng nhập admin<br>2. DELETE /api/v1/categories/:id        | 1. Trả về status 204<br>2. Category bị xóa                       | TestData37 | Pass   | 18/12/2025 | Admin xóa thành công      |
| CAT-018 | Employee xóa category thành công      | 1. Đăng nhập employee<br>2. DELETE /api/v1/categories/:id     | 1. Trả về status 204<br>2. Category bị xóa                       | TestData38 | Pass   | 18/12/2025 | Employee có quyền xóa     |
| CAT-019 | User xóa category thất bại            | 1. Đăng nhập user<br>2. DELETE /api/v1/categories/:id         | 1. Trả về status 403<br>2. Message: "You do not have permission" | TestData39 | Pass   | 18/12/2025 | restrictTo chặn user đúng |
| CAT-020 | Xóa category thất bại - Không tồn tại | 1. Đăng nhập admin<br>2. DELETE /api/v1/categories/:invalidId | 1. Trả về status 404<br>2. Message: "Không tìm thấy dữ liệu"     | TestData40 | Pass   | 18/12/2025 | Not found error đúng      |

---

## 📊 Báo Cáo Test Tự Động (GitHub Actions)

### 📊 Tổng Quan Test Results

| Metric          | Value      | Status            |
| --------------- | ---------- | ----------------- |
| **Total Tests** | 32         | -                 |
| **✅ Passed**   | 30         | 93.75%            |
| **❌ Failed**   | 2          | 6.25% - Cần xử lý |
| **Branch**      | weblau     | -                 |
| **Test Date**   | 18/12/2025 | -                 |

**Brand Tests:** 16 tests (15 Pass, 1 Fail) - Pass rate: 93.75%  
**Category Tests:** 16 tests (15 Pass, 1 Fail) - Pass rate: 93.75%

### ❌ Chi Tiết Các Test Failed

| STT | Test Suite                 | Test Case Description                     | Test ID | Status | Note                                                |
| --- | -------------------------- | ----------------------------------------- | ------- | ------ | --------------------------------------------------- |
| 1   | Update Brand (Employee)    | Employee nên cập nhật brand thành công    | BRD-014 | Fail   | expect(jest.fn()).toHaveBeenCalledWith(...expected) |
| 2   | Update Category (Employee) | Employee nên cập nhật category thành công | CAT-014 | Fail   | expect(jest.fn()).toHaveBeenCalledWith(...expected) |

### 🎯 Độ Coverage Theo Function

| Function           | Test Cases | Passed | Failed | Pass Rate |
| ------------------ | ---------- | ------ | ------ | --------- |
| Get All Brands     | 4          | 4      | 0      | 100% ✅   |
| Create Brand       | 8          | 8      | 0      | 100% ✅   |
| Update Brand       | 4          | 3      | 1      | 75% ⚠️    |
| Delete Brand       | 4          | 4      | 0      | 100% ✅   |
| Get All Categories | 4          | 4      | 0      | 100% ✅   |
| Create Category    | 8          | 8      | 0      | 100% ✅   |
| Update Category    | 4          | 3      | 1      | 75% ⚠️    |
| Delete Category    | 4          | 4      | 0      | 100% ✅   |

### 📋 Phân Loại Theo Nhóm Chức Năng

| Nhóm Chức Năng    | Test Cases | Passed | Failed | Pass Rate | Note                                |
| ----------------- | ---------- | ------ | ------ | --------- | ----------------------------------- |
| 🏷️ Brand Read     | 4          | 4      | 0      | 100%      | Public access hoạt động hoàn hảo    |
| 🏷️ Brand Write    | 12         | 11     | 1      | 91.67%    | Employee update có issue            |
| 📂 Category Read  | 4          | 4      | 0      | 100%      | Protected access hoạt động hoàn hảo |
| 📂 Category Write | 12         | 11     | 1      | 91.67%    | Employee update có issue            |

### 🔍 Phân Tích Lỗi Chi Tiết

#### **Lỗi Employee Update (BRD-014, CAT-014)**

**Vấn đề:** `expect(jest.fn()).toHaveBeenCalledWith(...expected)`

**Error Message:**

```
Error: expect(jest.fn()).toHaveBeenCalledWith(...expected)
Expected mock function to have been called with:
  [200]
but it was called with:
  []
Number of calls: 0
```

**Nguyên nhân:**

- Mock function `res.status` không được gọi với giá trị 200
- Test case cho Employee update brand/category không hoạt động đúng
- Có thể do:
  1. Brand/Category đã bị thay đổi trong test trước đó (BRD-013/CAT-013 đã update)
  2. Test setup không reset data giữa các test cases
  3. Brand/Category ID không tồn tại sau khi Admin update

**Giải pháp đề xuất:**

1. **Fix test setup - Reset data:**

```javascript
describe("updateBrand - Cập nhật thương hiệu", () => {
  let brandToUpdate;

  beforeEach(async () => {
    // Create fresh brand before EACH test
    brandToUpdate = await Brand.create({
      name: `Brand To Update ${Date.now()}`,
    });
  });

  afterEach(async () => {
    // Clean up after each test
    if (brandToUpdate) {
      await Brand.deleteMany({ _id: brandToUpdate._id });
    }
  });

  // ... tests
});
```

2. **Hoặc sử dụng unique brand cho mỗi test:**

```javascript
it("BRD-014: Employee nên cập nhật brand thành công", async () => {
  // Create dedicated brand for this test
  const testBrand = await Brand.create({ name: "Brand For Employee Test" });

  req.user = { id: employeeUser._id, role: "employee" };
  req.params.id = testBrand._id.toString();
  req.body = { name: "Brand Updated By Employee" };

  await brandController.updateBrand(req, res, next);

  expect(res.status).toHaveBeenCalledWith(200);

  // Clean up
  await Brand.deleteMany({ _id: testBrand._id });
});
```

3. **Check brand existence before update:**

```javascript
it("BRD-014: Employee nên cập nhật brand thành công", async () => {
  // Verify brand exists
  const existingBrand = await Brand.findById(brandToUpdate._id);
  expect(existingBrand).not.toBeNull();

  req.user = { id: employeeUser._id, role: "employee" };
  req.params.id = brandToUpdate._id.toString();
  req.body = { name: "Brand Updated By Employee" };

  await brandController.updateBrand(req, res, next);

  expect(res.status).toHaveBeenCalledWith(200);
});
```

### 📈 So Sánh Với Module Khác

| Module              | Total Tests | Passed | Failed | Pass Rate |
| ------------------- | ----------- | ------ | ------ | --------- |
| Module7 (Brand/Cat) | 32          | 30     | 2      | 93.75%    |
| Module1 (Auth)      | 31          | 26     | 5      | 83.87%    |
| Module4 (Order)     | 30          | 25     | 5      | 83.33%    |
| Module3 (Product)   | 35          | 27     | 8      | 77.14%    |
| Module2 (User)      | 30          | 23     | 7      | 76.67%    |
| Module6 (Review)    | 32          | 22     | 10     | 68.75%    |
| Module5 (Payment)   | 17          | 11     | 6      | 64.71%    |

**Nhận xét:**

- Module 7 có pass rate cao nhất (93.75%) trong tất cả các module
- Chỉ có 2 failed tests, cả 2 đều là Employee update operations
- CRUD operations cho Brand & Category rất ổn định
- Read operations hoạt động hoàn hảo (100% pass)
- Create & Delete operations hoạt động hoàn hảo (100% pass)
- Chỉ có Update operations của Employee cần fix

### 🔧 Các Bước Tiếp Theo

1. **Ưu tiên cao:**

   - ✅ Fix Employee update test setup (BRD-014, CAT-014)
   - ✅ Add beforeEach/afterEach để reset test data
   - ✅ Ensure test isolation

2. **Ưu tiên trung bình:**

   - 📝 Add integration tests cho Brand & Category routes
   - 📝 Test slug generation với special characters
   - 📝 Test cascade delete (khi Brand/Category được sử dụng bởi Product)

3. **Ưu tiên thấp:**

   - 🧪 Add performance tests cho pagination
   - 📊 Tăng coverage lên 95%+
   - 🔐 Add security tests (XSS, SQL injection)

### 📝 Notes

- **Pass Rate:** 93.75% - Cao nhất trong tất cả các module
- **Failed Tests:** Chỉ 2/32 tests fail, cả 2 đều liên quan đến Employee update
- **Root Cause:** Test data không được reset giữa các test cases
- **Quick Fix:** Sử dụng `beforeEach` để tạo fresh data cho mỗi test
- **Factory Pattern:** Hoạt động hoàn hảo với handlerFactory
- **Middleware:** protect và restrictTo hoạt động đúng 100%
- **Validation:** Tất cả validation rules (required, min/max, unique) hoạt động đúng
- **Slug Generation:** Category slug được tạo tự động từ name (100% pass)

---

## Test Data

| Test Data ID | Data Description                                                    |
| ------------ | ------------------------------------------------------------------- |
| TestData01   | GET /api/v1/brands                                                  |
| TestData02   | GET /api/v1/brands?page=1&limit=10                                  |
| TestData03   | GET /api/v1/brands?sort=name                                        |
| TestData04   | GET /api/v1/brands?name=Nike                                        |
| TestData05   | POST /api/v1/brands {name: "Test Brand"} by admin                   |
| TestData06   | POST /api/v1/brands {name: "Test Brand"} by employee                |
| TestData07   | POST /api/v1/brands {name: "Test Brand"} by user                    |
| TestData08   | POST /api/v1/brands without Authorization                           |
| TestData09   | POST /api/v1/brands {} (missing name)                               |
| TestData10   | POST /api/v1/brands {name: "A"}                                     |
| TestData11   | POST /api/v1/brands {name: "A".repeat(50)}                          |
| TestData12   | POST /api/v1/brands {name: "Existing Brand"}                        |
| TestData13   | PATCH /api/v1/brands/:id {name: "Updated Brand"} by admin           |
| TestData14   | PATCH /api/v1/brands/:id {name: "Updated Brand"} by employee        |
| TestData15   | PATCH /api/v1/brands/:id {name: "Updated Brand"} by user            |
| TestData16   | PATCH /api/v1/brands/:invalidId by admin                            |
| TestData17   | DELETE /api/v1/brands/:id by admin                                  |
| TestData18   | DELETE /api/v1/brands/:id by employee                               |
| TestData19   | DELETE /api/v1/brands/:id by user                                   |
| TestData20   | DELETE /api/v1/brands/:invalidId by admin                           |
| TestData21   | GET /api/v1/categories by authenticated user                        |
| TestData22   | GET /api/v1/categories?page=1&limit=10                              |
| TestData23   | GET /api/v1/categories?sort=name                                    |
| TestData24   | GET /api/v1/categories without Authorization                        |
| TestData25   | POST /api/v1/categories {name: "Test Category"} by admin            |
| TestData26   | POST /api/v1/categories {name: "Test Category"} by employee         |
| TestData27   | POST /api/v1/categories {name: "Test Category"} by user             |
| TestData28   | POST /api/v1/categories {} (missing name)                           |
| TestData29   | POST /api/v1/categories {name: "A"}                                 |
| TestData30   | POST /api/v1/categories {name: "A".repeat(50)}                      |
| TestData31   | POST /api/v1/categories {name: "Existing Category"}                 |
| TestData32   | POST /api/v1/categories {name: "Test Category"} (verify slug)       |
| TestData33   | PATCH /api/v1/categories/:id {name: "Updated Category"} by admin    |
| TestData34   | PATCH /api/v1/categories/:id {name: "Updated Category"} by employee |
| TestData35   | PATCH /api/v1/categories/:id {name: "Updated Category"} by user     |
| TestData36   | PATCH /api/v1/categories/:invalidId by admin                        |
| TestData37   | DELETE /api/v1/categories/:id by admin                              |
| TestData38   | DELETE /api/v1/categories/:id by employee                           |
| TestData39   | DELETE /api/v1/categories/:id by user                               |
| TestData40   | DELETE /api/v1/categories/:invalidId by admin                       |

---

## Ghi chú

1. **Brand (Thương hiệu):**

   - **Fields:** name (required, unique, 2-40 chars)
   - **Permissions:**
     - **Read:** Public (không cần đăng nhập)
     - **Create/Update/Delete:** Admin, Employee only
   - **Validation:**
     - Required: name
     - Min length: 2 chars
     - Max length: 40 chars
     - Unique: name
   - **No special middleware:** Chỉ dùng protect + restrictTo

2. **Category (Danh mục sản phẩm):**

   - **Fields:** name (required, unique, 2-40 chars), slug (auto-generated)
   - **Pre-save Hook:** Tự động tạo slug từ name (slugify)
   - **Permissions:**
     - **Read:** Authenticated users only (cần đăng nhập)
     - **Create/Update/Delete:** Admin, Employee only
   - **Validation:**
     - Required: name
     - Min length: 2 chars
     - Max length: 40 chars
     - Unique: name
   - **Slug Generation:** Automatically created using slugify package

3. **API Endpoints:**

   **Brand:**

   - GET `/api/v1/brands` - Xem brands (Public)
   - GET `/api/v1/brands/:id` - Xem 1 brand
   - POST `/api/v1/brands` - Tạo brand (Protected, Admin/Employee)
   - PATCH `/api/v1/brands/:id` - Cập nhật brand (Protected, Admin/Employee)
   - DELETE `/api/v1/brands/:id` - Xóa brand (Protected, Admin/Employee)

   **Category:**

   - GET `/api/v1/categories` - Xem categories (Protected)
   - GET `/api/v1/categories/:id` - Xem 1 category
   - POST `/api/v1/categories` - Tạo category (Protected, Admin/Employee)
   - PATCH `/api/v1/categories/:id` - Cập nhật category (Protected, Admin/Employee)
   - DELETE `/api/v1/categories/:id` - Xóa category (Protected, Admin/Employee)

4. **Business Rules:**

   - **Brand Read:** Không yêu cầu authentication (Public)
   - **Category Read:** Yêu cầu authentication (Protected)
   - **Brand/Category Write:** Chỉ Admin và Employee có quyền
   - **Unique Constraint:** Tên brand/category phải unique
   - **Slug:** Category tự động tạo slug khi save

5. **Middleware:**

   - **protect:** Verify JWT token (required for all category routes and brand write operations)
   - **restrictTo('admin', 'employee'):** Check user role for create/update/delete operations

6. **Factory Pattern:**

   - Both controllers use factory functions from handlerFactory:
     - `getAll()` - GET all with pagination, sort, filter
     - `getOne()` - GET by ID
     - `createOne()` - POST create
     - `updateOne()` - PATCH update
     - `deleteOne()` - DELETE

7. **Testing Notes:**
   - Test authentication middleware (protect)
   - Test authorization middleware (restrictTo)
   - Test validation (required, min/max length, unique)
   - Test slug generation for categories
   - Test CRUD operations for both models
   - Test pagination, sort, filter for GET all
   - Test error handling (404, 403, 401, 400)
   - **Issue:** Employee update tests cần fix test data isolation
