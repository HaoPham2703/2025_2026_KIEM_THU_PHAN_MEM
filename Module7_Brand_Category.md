# Module7 - Brand & Category (Thương hiệu & Danh mục)

## Thông tin Module

|                      |                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------- |
| **Module Code**      | Module7                                                                                |
| **Test Requirement** | Test các chức năng quản lý thương hiệu và danh mục sản phẩm: CRUD Brands & Categories |
| **Tester**           | HaoPham                                                                                |
| **Test Date**        | 18/12/2025 (GitHub Actions - Branch: weblau)                                           |

---

## Thống kê Test Case

| Pass | Fail | Untested | N/A | Number of Test Cases |
| ---- | ---- | -------- | --- | -------------------- |
| 0    | 0    | 32       | 0   | 32                   |

> **Ghi chú:** Kết quả từ GitHub Actions - Branch `weblau` - Test Date: 18/12/2025  
> **Brand Tests:** 16 tests - CRUD operations for brands  
> **Category Tests:** 16 tests - CRUD operations for categories

---

## Chi tiết Test Case

### Function A: Xem danh sách thương hiệu (Get All Brands)

| ID       | Test Case Description                        | Test Case Procedure                        | Expected Output                                              | Test Data  | Result   | Test Date | Description                |
| -------- | -------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------ | ---------- | -------- | --------- | -------------------------- |
| BRD-001  | Xem danh sách thương hiệu thành công         | 1. GET /api/v1/brands                      | 1. Trả về status 200<br>2. Trả về danh sách brands          | TestData01 | Untested |           | Không cần đăng nhập        |
| BRD-002  | Xem brands với pagination                    | 1. GET /api/v1/brands?page=1&limit=10      | 1. Trả về status 200<br>2. Trả về 10 brands đầu tiên        | TestData02 | Untested |           | Query pagination           |
| BRD-003  | Xem brands với sort                          | 1. GET /api/v1/brands?sort=name            | 1. Trả về status 200<br>2. Brands được sort theo name       | TestData03 | Untested |           | Query sort                 |
| BRD-004  | Xem brands với search                        | 1. GET /api/v1/brands?name=Nike            | 1. Trả về status 200<br>2. Trả về brands có name chứa "Nike" | TestData04 | Untested |           | Query filter               |

---

### Function B: Thêm thương hiệu (Create Brand - Admin)

| ID       | Test Case Description                        | Test Case Procedure                                      | Expected Output                                                | Test Data  | Result   | Test Date | Description                |
| -------- | -------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------- | ---------- | -------- | --------- | -------------------------- |
| BRD-005  | Admin thêm brand thành công                  | 1. Đăng nhập với role=admin<br>2. POST /api/v1/brands   | 1. Trả về status 201<br>2. Brand được tạo                      | TestData05 | Untested |           | Admin có quyền             |
| BRD-006  | Employee thêm brand thành công               | 1. Đăng nhập với role=employee<br>2. POST /api/v1/brands | 1. Trả về status 201<br>2. Brand được tạo                      | TestData06 | Untested |           | Employee có quyền          |
| BRD-007  | User thêm brand thất bại                     | 1. Đăng nhập với role=user<br>2. POST /api/v1/brands     | 1. Trả về status 403<br>2. Message: "You do not have permission" | TestData07 | Untested |           | Middleware restrictTo      |
| BRD-008  | Thêm brand thất bại - Chưa đăng nhập         | 1. Không đăng nhập<br>2. POST /api/v1/brands             | 1. Trả về status 401<br>2. Message lỗi authentication          | TestData08 | Untested |           | Middleware protect         |
| BRD-009  | Thêm brand thất bại - Thiếu name             | 1. Đăng nhập admin<br>2. POST /api/v1/brands không có name | 1. Trả về lỗi validation<br>2. Message: "Nhãn hiệu phải có tên" | TestData09 | Untested |           | Required field             |
| BRD-010  | Thêm brand thất bại - Name quá ngắn          | 1. Đăng nhập admin<br>2. POST /api/v1/brands name="A"    | 1. Trả về lỗi validation<br>2. Message: minlength 2 kí tự      | TestData10 | Untested |           | Min length validation      |
| BRD-011  | Thêm brand thất bại - Name quá dài           | 1. Đăng nhập admin<br>2. POST /api/v1/brands name=50 chars | 1. Trả về lỗi validation<br>2. Message: maxlength 40 kí tự     | TestData11 | Untested |           | Max length validation      |
| BRD-012  | Thêm brand thất bại - Duplicate name         | 1. Đăng nhập admin<br>2. POST brand với name đã tồn tại  | 1. Trả về lỗi duplicate<br>2. Error code 11000                 | TestData12 | Untested |           | Unique constraint          |

---

### Function C: Cập nhật thương hiệu (Update Brand - Admin)

| ID       | Test Case Description                        | Test Case Procedure                                          | Expected Output                                                | Test Data  | Result   | Test Date | Description                |
| -------- | -------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------- | ---------- | -------- | --------- | -------------------------- |
| BRD-013  | Admin cập nhật brand thành công              | 1. Đăng nhập admin<br>2. PATCH /api/v1/brands/:id           | 1. Trả về status 200<br>2. Brand được cập nhật                 | TestData13 | Untested |           | Admin có quyền             |
| BRD-014  | Employee cập nhật brand thành công           | 1. Đăng nhập employee<br>2. PATCH /api/v1/brands/:id         | 1. Trả về status 200<br>2. Brand được cập nhật                 | TestData14 | Untested |           | Employee có quyền          |
| BRD-015  | User cập nhật brand thất bại                 | 1. Đăng nhập user<br>2. PATCH /api/v1/brands/:id             | 1. Trả về status 403<br>2. Message: "You do not have permission" | TestData15 | Untested |           | Middleware restrictTo      |
| BRD-016  | Cập nhật brand thất bại - Brand không tồn tại | 1. Đăng nhập admin<br>2. PATCH /api/v1/brands/:invalidId     | 1. Trả về status 404<br>2. Message: "Không tìm thấy dữ liệu"   | TestData16 | Untested |           | Not found                  |

---

### Function D: Xóa thương hiệu (Delete Brand - Admin)

| ID       | Test Case Description                        | Test Case Procedure                                      | Expected Output                                                | Test Data  | Result   | Test Date | Description                |
| -------- | -------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------- | ---------- | -------- | --------- | -------------------------- |
| BRD-017  | Admin xóa brand thành công                   | 1. Đăng nhập admin<br>2. DELETE /api/v1/brands/:id      | 1. Trả về status 204<br>2. Brand bị xóa                        | TestData17 | Untested |           | Admin có quyền             |
| BRD-018  | Employee xóa brand thành công                | 1. Đăng nhập employee<br>2. DELETE /api/v1/brands/:id    | 1. Trả về status 204<br>2. Brand bị xóa                        | TestData18 | Untested |           | Employee có quyền          |
| BRD-019  | User xóa brand thất bại                      | 1. Đăng nhập user<br>2. DELETE /api/v1/brands/:id        | 1. Trả về status 403<br>2. Message: "You do not have permission" | TestData19 | Untested |           | Middleware restrictTo      |
| BRD-020  | Xóa brand thất bại - Brand không tồn tại     | 1. Đăng nhập admin<br>2. DELETE /api/v1/brands/:invalidId | 1. Trả về status 404<br>2. Message: "Không tìm thấy dữ liệu"   | TestData20 | Untested |           | Not found                  |

---

### Function E: Xem danh sách danh mục (Get All Categories)

| ID       | Test Case Description                        | Test Case Procedure                         | Expected Output                                                  | Test Data  | Result   | Test Date | Description                |
| -------- | -------------------------------------------- | ------------------------------------------- | ---------------------------------------------------------------- | ---------- | -------- | --------- | -------------------------- |
| CAT-001  | Xem danh sách category thành công            | 1. Đăng nhập<br>2. GET /api/v1/categories   | 1. Trả về status 200<br>2. Trả về danh sách categories          | TestData21 | Untested |           | Người dùng đã đăng nhập    |
| CAT-002  | Xem categories với pagination                | 1. Đăng nhập<br>2. GET /api/v1/categories?page=1&limit=10 | 1. Trả về status 200<br>2. Trả về 10 categories đầu tiên        | TestData22 | Untested |           | Query pagination           |
| CAT-003  | Xem categories với sort                      | 1. Đăng nhập<br>2. GET /api/v1/categories?sort=name | 1. Trả về status 200<br>2. Categories được sort theo name       | TestData23 | Untested |           | Query sort                 |
| CAT-004  | Xem categories thất bại - Chưa đăng nhập     | 1. Không đăng nhập<br>2. GET /api/v1/categories | 1. Trả về status 401<br>2. Message lỗi authentication            | TestData24 | Untested |           | Middleware protect         |

---

### Function F: Thêm danh mục (Create Category - Admin)

| ID       | Test Case Description                        | Test Case Procedure                                          | Expected Output                                                | Test Data  | Result   | Test Date | Description                |
| -------- | -------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------- | ---------- | -------- | --------- | -------------------------- |
| CAT-005  | Admin thêm category thành công               | 1. Đăng nhập admin<br>2. POST /api/v1/categories             | 1. Trả về status 201<br>2. Category được tạo<br>3. Slug tự động tạo | TestData25 | Untested |           | Admin có quyền, slug auto  |
| CAT-006  | Employee thêm category thành công            | 1. Đăng nhập employee<br>2. POST /api/v1/categories          | 1. Trả về status 201<br>2. Category được tạo                   | TestData26 | Untested |           | Employee có quyền          |
| CAT-007  | User thêm category thất bại                  | 1. Đăng nhập user<br>2. POST /api/v1/categories              | 1. Trả về status 403<br>2. Message: "You do not have permission" | TestData27 | Untested |           | Middleware restrictTo      |
| CAT-008  | Thêm category thất bại - Thiếu name          | 1. Đăng nhập admin<br>2. POST /api/v1/categories không có name | 1. Trả về lỗi validation<br>2. Message: "Thể loại sản phẩm phải có tên" | TestData28 | Untested |           | Required field             |
| CAT-009  | Thêm category thất bại - Name quá ngắn       | 1. Đăng nhập admin<br>2. POST /api/v1/categories name="A"    | 1. Trả về lỗi validation<br>2. Message: minlength 2 kí tự      | TestData29 | Untested |           | Min length validation      |
| CAT-010  | Thêm category thất bại - Name quá dài        | 1. Đăng nhập admin<br>2. POST /api/v1/categories name=50 chars | 1. Trả về lỗi validation<br>2. Message: maxlength 40 kí tự     | TestData30 | Untested |           | Max length validation      |
| CAT-011  | Thêm category thất bại - Duplicate name      | 1. Đăng nhập admin<br>2. POST category với name đã tồn tại   | 1. Trả về lỗi duplicate<br>2. Error code 11000                 | TestData31 | Untested |           | Unique constraint          |
| CAT-012  | Category slug được tạo tự động               | 1. Đăng nhập admin<br>2. POST /api/v1/categories name="Test Category" | 1. Trả về status 201<br>2. Slug = "test-category"              | TestData32 | Untested |           | Pre-save hook slugify      |

---

### Function G: Cập nhật danh mục (Update Category - Admin)

| ID       | Test Case Description                        | Test Case Procedure                                              | Expected Output                                                | Test Data  | Result   | Test Date | Description                |
| -------- | -------------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------- | ---------- | -------- | --------- | -------------------------- |
| CAT-013  | Admin cập nhật category thành công           | 1. Đăng nhập admin<br>2. PATCH /api/v1/categories/:id           | 1. Trả về status 200<br>2. Category được cập nhật              | TestData33 | Untested |           | Admin có quyền             |
| CAT-014  | Employee cập nhật category thành công        | 1. Đăng nhập employee<br>2. PATCH /api/v1/categories/:id         | 1. Trả về status 200<br>2. Category được cập nhật              | TestData34 | Untested |           | Employee có quyền          |
| CAT-015  | User cập nhật category thất bại              | 1. Đăng nhập user<br>2. PATCH /api/v1/categories/:id             | 1. Trả về status 403<br>2. Message: "You do not have permission" | TestData35 | Untested |           | Middleware restrictTo      |
| CAT-016  | Cập nhật category thất bại - Không tồn tại   | 1. Đăng nhập admin<br>2. PATCH /api/v1/categories/:invalidId     | 1. Trả về status 404<br>2. Message: "Không tìm thấy dữ liệu"   | TestData36 | Untested |           | Not found                  |

---

### Function H: Xóa danh mục (Delete Category - Admin)

| ID       | Test Case Description                        | Test Case Procedure                                          | Expected Output                                                | Test Data  | Result   | Test Date | Description                |
| -------- | -------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------- | ---------- | -------- | --------- | -------------------------- |
| CAT-017  | Admin xóa category thành công                | 1. Đăng nhập admin<br>2. DELETE /api/v1/categories/:id      | 1. Trả về status 204<br>2. Category bị xóa                     | TestData37 | Untested |           | Admin có quyền             |
| CAT-018  | Employee xóa category thành công             | 1. Đăng nhập employee<br>2. DELETE /api/v1/categories/:id    | 1. Trả về status 204<br>2. Category bị xóa                     | TestData38 | Untested |           | Employee có quyền          |
| CAT-019  | User xóa category thất bại                   | 1. Đăng nhập user<br>2. DELETE /api/v1/categories/:id        | 1. Trả về status 403<br>2. Message: "You do not have permission" | TestData39 | Untested |           | Middleware restrictTo      |
| CAT-020  | Xóa category thất bại - Không tồn tại        | 1. Đăng nhập admin<br>2. DELETE /api/v1/categories/:invalidId | 1. Trả về status 404<br>2. Message: "Không tìm thấy dữ liệu"   | TestData40 | Untested |           | Not found                  |

---

## Test Data

| Test Data ID | Data Description                                                     |
| ------------ | -------------------------------------------------------------------- |
| TestData01   | GET /api/v1/brands                                                   |
| TestData02   | GET /api/v1/brands?page=1&limit=10                                   |
| TestData03   | GET /api/v1/brands?sort=name                                         |
| TestData04   | GET /api/v1/brands?name=Nike                                         |
| TestData05   | POST /api/v1/brands {name: "Test Brand"} by admin                    |
| TestData06   | POST /api/v1/brands {name: "Test Brand"} by employee                 |
| TestData07   | POST /api/v1/brands {name: "Test Brand"} by user                     |
| TestData08   | POST /api/v1/brands without Authorization                            |
| TestData09   | POST /api/v1/brands {} (missing name)                                |
| TestData10   | POST /api/v1/brands {name: "A"}                                      |
| TestData11   | POST /api/v1/brands {name: "A".repeat(50)}                           |
| TestData12   | POST /api/v1/brands {name: "Existing Brand"}                         |
| TestData13   | PATCH /api/v1/brands/:id {name: "Updated Brand"} by admin           |
| TestData14   | PATCH /api/v1/brands/:id {name: "Updated Brand"} by employee        |
| TestData15   | PATCH /api/v1/brands/:id {name: "Updated Brand"} by user            |
| TestData16   | PATCH /api/v1/brands/:invalidId by admin                             |
| TestData17   | DELETE /api/v1/brands/:id by admin                                   |
| TestData18   | DELETE /api/v1/brands/:id by employee                                |
| TestData19   | DELETE /api/v1/brands/:id by user                                    |
| TestData20   | DELETE /api/v1/brands/:invalidId by admin                            |
| TestData21   | GET /api/v1/categories by authenticated user                         |
| TestData22   | GET /api/v1/categories?page=1&limit=10                               |
| TestData23   | GET /api/v1/categories?sort=name                                     |
| TestData24   | GET /api/v1/categories without Authorization                         |
| TestData25   | POST /api/v1/categories {name: "Test Category"} by admin             |
| TestData26   | POST /api/v1/categories {name: "Test Category"} by employee          |
| TestData27   | POST /api/v1/categories {name: "Test Category"} by user              |
| TestData28   | POST /api/v1/categories {} (missing name)                            |
| TestData29   | POST /api/v1/categories {name: "A"}                                  |
| TestData30   | POST /api/v1/categories {name: "A".repeat(50)}                       |
| TestData31   | POST /api/v1/categories {name: "Existing Category"}                  |
| TestData32   | POST /api/v1/categories {name: "Test Category"} (verify slug)        |
| TestData33   | PATCH /api/v1/categories/:id {name: "Updated Category"} by admin    |
| TestData34   | PATCH /api/v1/categories/:id {name: "Updated Category"} by employee |
| TestData35   | PATCH /api/v1/categories/:id {name: "Updated Category"} by user     |
| TestData36   | PATCH /api/v1/categories/:invalidId by admin                         |
| TestData37   | DELETE /api/v1/categories/:id by admin                               |
| TestData38   | DELETE /api/v1/categories/:id by employee                            |
| TestData39   | DELETE /api/v1/categories/:id by user                                |
| TestData40   | DELETE /api/v1/categories/:invalidId by admin                        |

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

