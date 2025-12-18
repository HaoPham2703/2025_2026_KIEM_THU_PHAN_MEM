# Module3 - Product Management (Quản lý Sản phẩm)

## Thông tin Module

|                      |                                                                                                             |
| -------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Module Code**      | Module3                                                                                                     |
| **Test Requirement** | Test các chức năng quản lý sản phẩm: Xem danh sách, Chi tiết, Tìm kiếm, Lọc, CRUD sản phẩm (Admin/Employee) |
| **Tester**           | HaoPham                                                                                                     |
| **Test Date**        | 18/12/2025 (GitHub Actions - Branch: weblau)                                                                |

---

## Thống kê Test Case

| Pass | Fail | Untested | N/A | Number of Test Cases |
| ---- | ---- | -------- | --- | -------------------- |
| 0    | 0    | 35       | 0   | 35                   |

> **Ghi chú:** Kết quả từ GitHub Actions - Branch `weblau` - Test Date: 18/12/2025

---

## Chi tiết Test Case

### Function A: Xem danh sách sản phẩm (Get All Products)

| ID       | Test Case Description                    | Test Case Procedure                                          | Expected Output                                                     | Test Data  | Result   | Test Date | Description             |
| -------- | ---------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------- | ---------- | -------- | --------- | ----------------------- |
| PROD-001 | Xem danh sách sản phẩm thành công        | 1. Không cần đăng nhập<br>2. Gọi API GET /api/v1/products    | 1. Trả về status 200<br>2. Trả về danh sách sản phẩm                | TestData01 | Untested |           | Không yêu cầu đăng nhập |
| PROD-002 | Xem danh sách với pagination             | 1. Gọi API GET /api/v1/products?page=2&limit=10              | 1. Trả về status 200<br>2. Trả về 10 sản phẩm trang 2               | TestData02 | Untested |           | Pagination hoạt động    |
| PROD-003 | Xem danh sách với sort theo giá tăng dần | 1. Gọi API GET /api/v1/products?sort=price                   | 1. Trả về status 200<br>2. Sản phẩm được sắp xếp theo giá tăng      | TestData03 | Untested |           | Sort ascending          |
| PROD-004 | Xem danh sách với sort theo giá giảm dần | 1. Gọi API GET /api/v1/products?sort=-price                  | 1. Trả về status 200<br>2. Sản phẩm được sắp xếp theo giá giảm      | TestData04 | Untested |           | Sort descending         |
| PROD-005 | Xem danh sách với fields selection       | 1. Gọi API GET /api/v1/products?fields=title,price,promotion | 1. Trả về status 200<br>2. Chỉ trả về các field được chọn           | TestData05 | Untested |           | Select specific fields  |
| PROD-006 | Xem top 5 sản phẩm rẻ nhất               | 1. Gọi API GET /api/v1/products/top-5-cheap                  | 1. Trả về status 200<br>2. Trả về 5 sản phẩm rẻ nhất với rating cao | TestData06 | Untested |           | Alias route             |

---

### Function B: Xem chi tiết sản phẩm (Get Product)

| ID       | Test Case Description                            | Test Case Procedure                           | Expected Output                                                           | Test Data  | Result   | Test Date | Description           |
| -------- | ------------------------------------------------ | --------------------------------------------- | ------------------------------------------------------------------------- | ---------- | -------- | --------- | --------------------- |
| PROD-007 | Xem chi tiết sản phẩm thành công                 | 1. Gọi API GET /api/v1/products/:validId      | 1. Trả về status 200<br>2. Trả về thông tin chi tiết sản phẩm kèm reviews | TestData07 | Untested |           | Sản phẩm tồn tại      |
| PROD-008 | Xem chi tiết thất bại - Product ID không tồn tại | 1. Gọi API GET /api/v1/products/:invalidId    | 1. Trả về status 404<br>2. Message: "No document found with that ID"      | TestData08 | Untested |           | Product không tồn tại |
| PROD-009 | Xem chi tiết thất bại - Product ID không hợp lệ  | 1. Gọi API GET /api/v1/products/invalidformat | 1. Trả về status 500<br>2. Message lỗi cast ID                            | TestData09 | Untested |           | Invalid ObjectId      |

---

### Function C: Tìm kiếm sản phẩm (Search Products)

| ID       | Test Case Description                      | Test Case Procedure                                       | Expected Output                                                                | Test Data  | Result   | Test Date | Description      |
| -------- | ------------------------------------------ | --------------------------------------------------------- | ------------------------------------------------------------------------------ | ---------- | -------- | --------- | ---------------- |
| PROD-010 | Tìm kiếm sản phẩm theo tên thành công      | 1. Gọi API GET /api/v1/products?search=laptop             | 1. Trả về status 200<br>2. Trả về các sản phẩm có chứa "laptop"                | TestData10 | Untested |           | Text search      |
| PROD-011 | Tìm kiếm sản phẩm theo từ khóa description | 1. Gọi API GET /api/v1/products?search=gaming             | 1. Trả về status 200<br>2. Trả về sản phẩm có "gaming" trong title/description | TestData11 | Untested |           | Full-text search |
| PROD-012 | Tìm kiếm không có kết quả                  | 1. Gọi API GET /api/v1/products?search=nonexistentproduct | 1. Trả về status 200<br>2. Trả về mảng rỗng []                                 | TestData12 | Untested |           | Empty result     |

---

### Function D: Lọc sản phẩm (Filter Products)

| ID       | Test Case Description                  | Test Case Procedure                                                                   | Expected Output                                                                       | Test Data  | Result   | Test Date | Description        |
| -------- | -------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ---------- | -------- | --------- | ------------------ |
| PROD-013 | Lọc sản phẩm theo category thành công  | 1. Gọi API GET /api/v1/products?category=:categoryId                                  | 1. Trả về status 200<br>2. Trả về sản phẩm thuộc category đó                          | TestData13 | Untested |           | Filter by category |
| PROD-014 | Lọc sản phẩm theo brand thành công     | 1. Gọi API GET /api/v1/products?brand=:brandId                                        | 1. Trả về status 200<br>2. Trả về sản phẩm thuộc brand đó                             | TestData14 | Untested |           | Filter by brand    |
| PROD-015 | Lọc sản phẩm theo khoảng giá           | 1. Gọi API GET /api/v1/products?price[gte]=10000000&price[lte]=20000000               | 1. Trả về status 200<br>2. Trả về sản phẩm có giá từ 10tr - 20tr                      | TestData15 | Untested |           | Price range filter |
| PROD-016 | Lọc sản phẩm theo rating tối thiểu     | 1. Gọi API GET /api/v1/products?ratingsAverage[gte]=4.5                               | 1. Trả về status 200<br>2. Trả về sản phẩm có rating >= 4.5                           | TestData16 | Untested |           | Rating filter      |
| PROD-017 | Lọc sản phẩm kết hợp nhiều điều kiện   | 1. Gọi API GET /api/v1/products?category=:id&price[lte]=15000000&sort=-ratingsAverage | 1. Trả về status 200<br>2. Trả về sản phẩm đúng category, giá <= 15tr, sort by rating | TestData17 | Untested |           | Multiple filters   |
| PROD-018 | Lọc sản phẩm theo inventory (còn hàng) | 1. Gọi API GET /api/v1/products?inventory[gt]=0                                       | 1. Trả về status 200<br>2. Trả về sản phẩm còn trong kho                              | TestData18 | Untested |           | In-stock products  |

---

### Function E: Thêm sản phẩm (Admin - Create Product)

| ID       | Test Case Description                                  | Test Case Procedure                                                                                                           | Expected Output                                                          | Test Data  | Result   | Test Date | Description             |
| -------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ---------- | -------- | --------- | ----------------------- |
| PROD-019 | Admin thêm sản phẩm thành công với đầy đủ thông tin    | 1. Đăng nhập với role=admin<br>2. Gọi API POST /api/v1/products<br>3. Gửi: title, price, description, images, category, brand | 1. Trả về status 201<br>2. Sản phẩm được tạo thành công                  | TestData19 | Untested |           | Role = admin, full data |
| PROD-020 | Employee thêm sản phẩm thành công                      | 1. Đăng nhập với role=employee<br>2. Gọi API POST /api/v1/products<br>3. Gửi thông tin sản phẩm                               | 1. Trả về status 201<br>2. Sản phẩm được tạo thành công                  | TestData20 | Untested |           | Role = employee         |
| PROD-021 | Thêm sản phẩm với promotion                            | 1. Đăng nhập với role=admin<br>2. Gọi API POST /api/v1/products<br>3. Gửi: title, price, promotion (promotion < price)        | 1. Trả về status 201<br>2. Sản phẩm có giá khuyến mãi hợp lệ             | TestData21 | Untested |           | Promotion valid         |
| PROD-022 | Thêm sản phẩm thất bại - Thiếu trường bắt buộc (title) | 1. Đăng nhập với role=admin<br>2. Gọi API POST /api/v1/products<br>3. Gửi dữ liệu thiếu title                                 | 1. Trả về lỗi validation<br>2. Message: "Sản phẩm phải có tên phân biệt" | TestData22 | Untested |           | Missing required field  |
| PROD-023 | Thêm sản phẩm thất bại - Thiếu trường bắt buộc (price) | 1. Đăng nhập với role=admin<br>2. Gọi API POST /api/v1/products<br>3. Gửi dữ liệu thiếu price                                 | 1. Trả về lỗi validation<br>2. Message: "Vui lòng cung cấp giá sản phẩm" | TestData23 | Untested |           | Missing price           |
| PROD-024 | Thêm sản phẩm thất bại - Title trùng lặp               | 1. Đăng nhập với role=admin<br>2. Gọi API POST /api/v1/products<br>3. Gửi title đã tồn tại                                    | 1. Trả về lỗi duplicate<br>2. Message lỗi title unique                   | TestData24 | Untested |           | Duplicate title         |
| PROD-025 | Thêm sản phẩm thất bại - Promotion > Price             | 1. Đăng nhập với role=admin<br>2. Gọi API POST /api/v1/products<br>3. Gửi promotion > price                                   | 1. Trả về lỗi validation<br>2. Message: "Giá giảm phải nhỏ hơn giá gốc"  | TestData25 | Untested |           | Invalid promotion       |
| PROD-026 | Thêm sản phẩm thất bại - Không có quyền (User)         | 1. Đăng nhập với role=user<br>2. Gọi API POST /api/v1/products                                                                | 1. Trả về status 403<br>2. Message: "Bạn không có quyền..."              | TestData26 | Untested |           | Forbidden - role user   |
| PROD-027 | Thêm sản phẩm thất bại - Chưa đăng nhập                | 1. Không đăng nhập<br>2. Gọi API POST /api/v1/products                                                                        | 1. Trả về status 401<br>2. Message lỗi authentication                    | TestData27 | Untested |           | Unauthorized            |

---

### Function F: Cập nhật sản phẩm (Admin - Update Product)

| ID       | Test Case Description                              | Test Case Procedure                                                                                | Expected Output                                                      | Test Data  | Result   | Test Date | Description       |
| -------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ---------- | -------- | --------- | ----------------- |
| PROD-028 | Admin cập nhật sản phẩm thành công                 | 1. Đăng nhập với role=admin<br>2. Gọi API PATCH /api/v1/products/:id<br>3. Gửi dữ liệu cập nhật    | 1. Trả về status 200<br>2. Sản phẩm được cập nhật                    | TestData28 | Untested |           | Role = admin      |
| PROD-029 | Employee cập nhật sản phẩm thành công              | 1. Đăng nhập với role=employee<br>2. Gọi API PATCH /api/v1/products/:id<br>3. Gửi dữ liệu cập nhật | 1. Trả về status 200<br>2. Sản phẩm được cập nhật                    | TestData29 | Untested |           | Role = employee   |
| PROD-030 | Cập nhật sản phẩm thất bại - Product không tồn tại | 1. Đăng nhập với role=admin<br>2. Gọi API PATCH /api/v1/products/:invalidId                        | 1. Trả về status 404<br>2. Message: "No document found with that ID" | TestData30 | Untested |           | Product not found |
| PROD-031 | Cập nhật sản phẩm thất bại - Không có quyền (User) | 1. Đăng nhập với role=user<br>2. Gọi API PATCH /api/v1/products/:id                                | 1. Trả về status 403<br>2. Message: "Bạn không có quyền..."          | TestData31 | Untested |           | Forbidden         |

---

### Function G: Xóa sản phẩm (Admin - Delete Product)

| ID       | Test Case Description                         | Test Case Procedure                                                          | Expected Output                                                      | Test Data  | Result   | Test Date | Description       |
| -------- | --------------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------- | ---------- | -------- | --------- | ----------------- |
| PROD-032 | Admin xóa sản phẩm thành công                 | 1. Đăng nhập với role=admin<br>2. Gọi API DELETE /api/v1/products/:id        | 1. Trả về status 204<br>2. Sản phẩm được xóa khỏi database           | TestData32 | Untested |           | Role = admin      |
| PROD-033 | Xóa sản phẩm thất bại - Product không tồn tại | 1. Đăng nhập với role=admin<br>2. Gọi API DELETE /api/v1/products/:invalidId | 1. Trả về status 404<br>2. Message: "No document found with that ID" | TestData33 | Untested |           | Product not found |
| PROD-034 | Xóa sản phẩm thất bại - Không có quyền (User) | 1. Đăng nhập với role=user<br>2. Gọi API DELETE /api/v1/products/:id         | 1. Trả về status 403<br>2. Message: "Bạn không có quyền..."          | TestData34 | Untested |           | Forbidden         |
| PROD-035 | Xóa sản phẩm thất bại - Chưa đăng nhập        | 1. Không đăng nhập<br>2. Gọi API DELETE /api/v1/products/:id                 | 1. Trả về status 401<br>2. Message lỗi authentication                | TestData35 | Untested |           | Unauthorized      |

---

## Test Data

| Test Data ID | Data Description                                                                                                                                   |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| TestData01   | GET /api/v1/products (no query params)                                                                                                             |
| TestData02   | GET /api/v1/products?page=2&limit=10                                                                                                               |
| TestData03   | GET /api/v1/products?sort=price                                                                                                                    |
| TestData04   | GET /api/v1/products?sort=-price                                                                                                                   |
| TestData05   | GET /api/v1/products?fields=title,price,promotion                                                                                                  |
| TestData06   | GET /api/v1/products/top-5-cheap                                                                                                                   |
| TestData07   | GET /api/v1/products/:validProductId (existing product with reviews)                                                                               |
| TestData08   | GET /api/v1/products/:nonexistentId (valid ObjectId but not in database)                                                                           |
| TestData09   | GET /api/v1/products/invalidformat (not a valid MongoDB ObjectId)                                                                                  |
| TestData10   | GET /api/v1/products?search=laptop                                                                                                                 |
| TestData11   | GET /api/v1/products?search=gaming                                                                                                                 |
| TestData12   | GET /api/v1/products?search=nonexistentproduct                                                                                                     |
| TestData13   | GET /api/v1/products?category=:validCategoryId                                                                                                     |
| TestData14   | GET /api/v1/products?brand=:validBrandId                                                                                                           |
| TestData15   | GET /api/v1/products?price[gte]=10000000&price[lte]=20000000                                                                                       |
| TestData16   | GET /api/v1/products?ratingsAverage[gte]=4.5                                                                                                       |
| TestData17   | GET /api/v1/products?category=:id&price[lte]=15000000&sort=-ratingsAverage                                                                         |
| TestData18   | GET /api/v1/products?inventory[gt]=0                                                                                                               |
| TestData19   | POST /api/v1/products {title: "Laptop Gaming Asus ROG Strix G15", price: 25000000, description: "...", category: ":categoryId", brand: ":brandId"} |
| TestData20   | POST /api/v1/products by employee role                                                                                                             |
| TestData21   | POST /api/v1/products {title: "...", price: 20000000, promotion: 18000000}                                                                         |
| TestData22   | POST /api/v1/products {price: 10000000, description: "..."} (missing title)                                                                        |
| TestData23   | POST /api/v1/products {title: "Test Product"} (missing price)                                                                                      |
| TestData24   | POST /api/v1/products {title: "Existing Product Title"}                                                                                            |
| TestData25   | POST /api/v1/products {title: "...", price: 10000000, promotion: 12000000}                                                                         |
| TestData26   | POST /api/v1/products by user role                                                                                                                 |
| TestData27   | POST /api/v1/products without Authorization header                                                                                                 |
| TestData28   | PATCH /api/v1/products/:id {price: 30000000, inventory: 50}                                                                                        |
| TestData29   | PATCH /api/v1/products/:id by employee role                                                                                                        |
| TestData30   | PATCH /api/v1/products/:invalidId                                                                                                                  |
| TestData31   | PATCH /api/v1/products/:id by user role                                                                                                            |
| TestData32   | DELETE /api/v1/products/:validId by admin                                                                                                          |
| TestData33   | DELETE /api/v1/products/:invalidId                                                                                                                 |
| TestData34   | DELETE /api/v1/products/:id by user role                                                                                                           |
| TestData35   | DELETE /api/v1/products/:id without Authorization                                                                                                  |

---

## Ghi chú

1. **API Endpoints:**

   - GET `/api/v1/products` - Xem danh sách sản phẩm (public)
   - GET `/api/v1/products/top-5-cheap` - Top 5 sản phẩm rẻ nhất (public)
   - GET `/api/v1/products/:id` - Xem chi tiết sản phẩm (public)
   - POST `/api/v1/products` - Thêm sản phẩm (Admin/Employee only)
   - PATCH `/api/v1/products/:id` - Cập nhật sản phẩm (Admin/Employee only)
   - DELETE `/api/v1/products/:id` - Xóa sản phẩm (Admin/Employee only)

2. **Trường bắt buộc khi tạo sản phẩm:**

   - `title`: Tên sản phẩm (10-200 ký tự, unique)
   - `price`: Giá sản phẩm

3. **Trường tùy chọn:**

   - `promotion`: Giá khuyến mãi (phải <= price)
   - `description`: Mô tả sản phẩm
   - `images`: Mảng URL hình ảnh
   - `category`: ObjectId của category
   - `brand`: ObjectId của brand
   - `inventory`: Số lượng tồn kho
   - `color`, `cpu`, `ram`, `os`, `weight`, `screen`, `graphicCard`, `battery`, `demand`: Thông số kỹ thuật

4. **Query Features:**

   - **Pagination**: `?page=1&limit=10`
   - **Sort**: `?sort=price` (tăng dần), `?sort=-price` (giảm dần)
   - **Fields**: `?fields=title,price,promotion`
   - **Filter**: `?category=id&brand=id&price[gte]=10000000&price[lte]=20000000`
   - **Search**: `?search=keyword` (full-text search)

5. **Roles có quyền quản lý sản phẩm:**

   - `admin`: Quản trị viên
   - `employee`: Nhân viên

6. **Validation Rules:**
   - Title: 10-200 ký tự, unique
   - Price: Bắt buộc
   - Promotion: Phải <= price
   - RatingsAverage: 1-5 sao
