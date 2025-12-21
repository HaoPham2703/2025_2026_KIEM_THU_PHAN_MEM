# TEST CASES - PRODUCT MANAGEMENT MODULE

**Tình huống**: Quản lý sản phẩm  
**Module**: Product Management  
**Ngày tạo**: 21/12/2025  
**Người tạo**: Test Team

---

## 1. XEM DANH SÁCH SẢN PHẨM (GET PRODUCTS)

### TC-PROD-001: Lấy danh sách sản phẩm không filter
- **Mức độ ưu tiên**: High
- **Loại test**: Functional - Positive
- **Điều kiện tiên quyết**: Có ít nhất 1 sản phẩm trong database
- **Bước thực hiện**:
  1. Gửi GET request đến `/api/v1/products`
- **Kết quả mong đợi**:
  - Status code: 200
  - Response có danh sách sản phẩm
  - Mỗi sản phẩm có đầy đủ fields: _id, name, price, description, images, category, brand, etc.
- **Kết quả thực tế**: ✅ Pass

### TC-PROD-002: Lấy sản phẩm với pagination
- **Mức độ ưu tiên**: High
- **Loại test**: Functional - Positive
- **Điều kiện tiên quyết**: Có ít nhất 20 sản phẩm
- **Bước thực hiện**:
  1. Gửi GET request đến `/api/v1/products?page=2&limit=10`
- **Kết quả mong đợi**:
  - Status code: 200
  - Response trả về 10 sản phẩm (trang 2)
  - Có pagination metadata (total, pages, current page)
- **Kết quả thực tế**: ✅ Pass

### TC-PROD-003: Filter sản phẩm theo giá
- **Mức độ ưu tiên**: High
- **Loại test**: Functional - Positive
- **Điều kiện tiên quyết**: Có sản phẩm với nhiều mức giá khác nhau
- **Bước thực hiện**:
  1. Gửi GET request đến `/api/v1/products?price[gte]=100&price[lte]=500`
- **Kết quả mong đợi**:
  - Status code: 200
  - Tất cả sản phẩm trả về có giá từ 100-500
- **Kết quả thực tế**: ✅ Pass

### TC-PROD-004: Filter sản phẩm theo category
- **Mức độ ưu tiên**: High
- **Loại test**: Functional - Positive
- **Điều kiện tiên quyết**: Có sản phẩm thuộc nhiều categories
- **Bước thực hiện**:
  1. Gửi GET request đến `/api/v1/products?category=Electronics`
- **Kết quả mong đợi**:
  - Status code: 200
  - Tất cả sản phẩm thuộc category Electronics
- **Kết quả thực tế**: ✅ Pass

### TC-PROD-005: Sort sản phẩm theo giá tăng dần
- **Mức độ ưu tiên**: Medium
- **Loại test**: Functional - Positive
- **Điều kiện tiên quyết**: Có nhiều sản phẩm
- **Bước thực hiện**:
  1. Gửi GET request đến `/api/v1/products?sort=price`
- **Kết quả mong đợi**:
  - Status code: 200
  - Sản phẩm được sắp xếp theo giá tăng dần
- **Kết quả thực tế**: ✅ Pass

### TC-PROD-006: Sort sản phẩm theo giá giảm dần
- **Mức độ ưu tiên**: Medium
- **Loại test**: Functional - Positive
- **Điều kiện tiên quyết**: Có nhiều sản phẩm
- **Bước thực hiện**:
  1. Gửi GET request đến `/api/v1/products?sort=-price`
- **Kết quả mong đợi**:
  - Status code: 200
  - Sản phẩm được sắp xếp theo giá giảm dần
- **Kết quả thực tế**: ✅ Pass

### TC-PROD-007: Search sản phẩm theo tên
- **Mức độ ưu tiên**: High
- **Loại test**: Functional - Positive
- **Điều kiện tiên quyết**: Có sản phẩm trong database
- **Bước thực hiện**:
  1. Gửi GET request đến `/api/v1/products?search=iPhone`
- **Kết quả mong đợi**:
  - Status code: 200
  - Trả về sản phẩm có tên chứa "iPhone"
- **Kết quả thực tế**: ✅ Pass

### TC-PROD-008: Lấy top 5 sản phẩm rẻ nhất
- **Mức độ ưu tiên**: Medium
- **Loại test**: Functional - Positive
- **Điều kiện tiên quyết**: Có ít nhất 5 sản phẩm
- **Bước thực hiện**:
  1. Gửi GET request đến `/api/v1/products/top-5-cheap`
- **Kết quả mong đợi**:
  - Status code: 200
  - Trả về đúng 5 sản phẩm rẻ nhất
  - Sắp xếp theo giá tăng dần
- **Kết quả thực tế**: ✅ Pass

---

## 2. XEM CHI TIẾT SẢN PHẨM (GET PRODUCT BY ID)

### TC-PROD-009: Lấy chi tiết sản phẩm với ID hợp lệ
- **Mức độ ưu tiên**: High
- **Loại test**: Functional - Positive
- **Điều kiện tiên quyết**: Sản phẩm tồn tại
- **Bước thực hiện**:
  1. Gửi GET request đến `/api/v1/products/:id` với valid ID
- **Kết quả mong đợi**:
  - Status code: 200
  - Response có đầy đủ thông tin sản phẩm
  - Bao gồm reviews, ratings nếu có
- **Kết quả thực tế**: ✅ Pass

### TC-PROD-010: Lấy sản phẩm với ID không tồn tại
- **Mức độ ưu tiên**: High
- **Loại test**: Functional - Negative
- **Điều kiện tiên quyết**: ID không tồn tại
- **Bước thực hiện**:
  1. Gửi GET request đến `/api/v1/products/000000000000000000000000`
- **Kết quả mong đợi**:
  - Status code: 404
  - Error message: "Product not found"
- **Kết quả thực tế**: ✅ Pass

### TC-PROD-011: Lấy sản phẩm với ID không hợp lệ
- **Mức độ ưu tiên**: Medium
- **Loại test**: Functional - Negative
- **Điều kiện tiên quyết**: Không có
- **Bước thực hiện**:
  1. Gửi GET request đến `/api/v1/products/invalid-id`
- **Kết quả mong đợi**:
  - Status code: 400
  - Error message về invalid ObjectId
- **Kết quả thực tế**: ✅ Pass

---

## 3. TẠO SẢN PHẨM (CREATE PRODUCT - ADMIN)

### TC-PROD-012: Tạo sản phẩm với dữ liệu hợp lệ (Admin)
- **Mức độ ưu tiên**: High
- **Loại test**: Functional - Positive
- **Điều kiện tiên quyết**: Đăng nhập với role admin
- **Bước thực hiện**:
  1. Gửi POST request đến `/api/v1/products`
  2. Header: `Authorization: Bearer {admin-token}`
  3. Body: Product data hợp lệ
- **Kết quả mong đợi**:
  - Status code: 201
  - Sản phẩm được tạo trong database
  - Response trả về sản phẩm vừa tạo
- **Kết quả thực tế**: ✅ Pass

### TC-PROD-013: Tạo sản phẩm với role user
- **Mức độ ưu tiên**: High
- **Loại test**: Security - Negative
- **Điều kiện tiên quyết**: Đăng nhập với role user
- **Bước thực hiện**:
  1. Gửi POST request đến `/api/v1/products`
  2. Header: `Authorization: Bearer {user-token}`
  3. Body: Product data hợp lệ
- **Kết quả mong đợi**:
  - Status code: 403
  - Error message: "You do not have permission"
- **Kết quả thực tế**: ✅ Pass

### TC-PROD-014: Tạo sản phẩm thiếu trường bắt buộc
- **Mức độ ưu tiên**: High
- **Loại test**: Functional - Negative
- **Điều kiện tiên quyết**: Đăng nhập với role admin
- **Bước thực hiện**:
  1. Gửi POST request đến `/api/v1/products`
  2. Body: Thiếu field "name"
- **Kết quả mong đợi**:
  - Status code: 400
  - Error message về required field
- **Kết quả thực tế**: ✅ Pass

### TC-PROD-015: Tạo sản phẩm với giá âm
- **Mức độ ưu tiên**: Medium
- **Loại test**: Functional - Negative
- **Điều kiện tiên quyết**: Đăng nhập với role admin
- **Bước thực hiện**:
  1. Gửi POST request đến `/api/v1/products`
  2. Body: `price: -100`
- **Kết quả mong đợi**:
  - Status code: 400
  - Error message: "Price must be positive"
- **Kết quả thực tế**: ✅ Pass

### TC-PROD-016: Tạo sản phẩm với quantity âm
- **Mức độ ưu tiên**: Medium
- **Loại test**: Functional - Negative
- **Điều kiện tiên quyết**: Đăng nhập với role admin
- **Bước thực hiện**:
  1. Gửi POST request đến `/api/v1/products`
  2. Body: `quantity: -10`
- **Kết quả mong đợi**:
  - Status code: 400
  - Error message: "Quantity must be non-negative"
- **Kết quả thực tế**: ✅ Pass

---

## 4. CẬP NHẬT SẢN PHẨM (UPDATE PRODUCT - ADMIN)

### TC-PROD-017: Cập nhật sản phẩm thành công (Admin)
- **Mức độ ưu tiên**: High
- **Loại test**: Functional - Positive
- **Điều kiện tiên quyết**: Sản phẩm tồn tại, đăng nhập admin
- **Bước thực hiện**:
  1. Gửi PATCH request đến `/api/v1/products/:id`
  2. Header: `Authorization: Bearer {admin-token}`
  3. Body: `{ "price": 999, "name": "Updated Product" }`
- **Kết quả mong đợi**:
  - Status code: 200
  - Sản phẩm được cập nhật trong database
  - Response trả về sản phẩm đã cập nhật
- **Kết quả thực tế**: ✅ Pass

### TC-PROD-018: Cập nhật sản phẩm với role user
- **Mức độ ưu tiên**: High
- **Loại test**: Security - Negative
- **Điều kiện tiên quyết**: Đăng nhập với role user
- **Bước thực hiện**:
  1. Gửi PATCH request đến `/api/v1/products/:id`
  2. Header: `Authorization: Bearer {user-token}`
- **Kết quả mong đợi**:
  - Status code: 403
  - Error message về permission
- **Kết quả thực tế**: ✅ Pass

### TC-PROD-019: Cập nhật sản phẩm không tồn tại
- **Mức độ ưu tiên**: Medium
- **Loại test**: Functional - Negative
- **Điều kiện tiên quyết**: Đăng nhập admin
- **Bước thực hiện**:
  1. Gửi PATCH request đến `/api/v1/products/000000000000000000000000`
- **Kết quả mong đợi**:
  - Status code: 404
  - Error message: "Product not found"
- **Kết quả thực tế**: ✅ Pass

---

## 5. XÓA SẢN PHẨM (DELETE PRODUCT - ADMIN)

### TC-PROD-020: Xóa sản phẩm thành công (Admin)
- **Mức độ ưu tiên**: High
- **Loại test**: Functional - Positive
- **Điều kiện tiên quyết**: Sản phẩm tồn tại, đăng nhập admin
- **Bước thực hiện**:
  1. Gửi DELETE request đến `/api/v1/products/:id`
  2. Header: `Authorization: Bearer {admin-token}`
- **Kết quả mong đợi**:
  - Status code: 204 hoặc 200
  - Sản phẩm bị xóa khỏi database
- **Kết quả thực tế**: ✅ Pass

### TC-PROD-021: Xóa sản phẩm với role user
- **Mức độ ưu tiên**: High
- **Loại test**: Security - Negative
- **Điều kiện tiên quyết**: Đăng nhập user
- **Bước thực hiện**:
  1. Gửi DELETE request đến `/api/v1/products/:id`
  2. Header: `Authorization: Bearer {user-token}`
- **Kết quả mong đợi**:
  - Status code: 403
  - Sản phẩm không bị xóa
- **Kết quả thực tế**: ✅ Pass

### TC-PROD-022: Xóa sản phẩm không tồn tại
- **Mức độ ưu tiên**: Medium
- **Loại test**: Functional - Negative
- **Điều kiện tiên quyết**: Đăng nhập admin
- **Bước thực hiện**:
  1. Gửi DELETE request đến `/api/v1/products/000000000000000000000000`
- **Kết quả mong đợi**:
  - Status code: 404
- **Kết quả thực tế**: ✅ Pass

---

## 6. UPLOAD ẢNH SẢN PHẨM (UPLOAD IMAGES)

### TC-PROD-023: Upload ảnh sản phẩm thành công
- **Mức độ ưu tiên**: High
- **Loại test**: Functional - Positive
- **Điều kiện tiên quyết**: Đăng nhập admin, có file ảnh hợp lệ
- **Bước thực hiện**:
  1. Gửi POST request đến `/api/v1/products/:id/images`
  2. Header: `Authorization: Bearer {admin-token}`
  3. Body: multipart/form-data với images
- **Kết quả mong đợi**:
  - Status code: 200
  - Images được upload và URL được trả về
- **Kết quả thực tế**: ✅ Pass

### TC-PROD-024: Upload file không phải ảnh
- **Mức độ ưu tiên**: Medium
- **Loại test**: Functional - Negative
- **Điều kiện tiên quyết**: Đăng nhập admin
- **Bước thực hiện**:
  1. Gửi POST request với file .txt hoặc .pdf
- **Kết quả mong đợi**:
  - Status code: 400
  - Error: "Only image files allowed"
- **Kết quả thực tế**: ✅ Pass

### TC-PROD-025: Upload ảnh quá lớn (>5MB)
- **Mức độ ưu tiên**: Medium
- **Loại test**: Functional - Negative
- **Điều kiện tiên quyết**: Đăng nhập admin
- **Bước thực hiện**:
  1. Gửi POST request với file ảnh >5MB
- **Kết quả mong đợi**:
  - Status code: 400
  - Error: "File too large"
- **Kết quả thực tế**: ✅ Pass

---

## TÓM TẮT

**Tổng số test cases**: 25  
**Passed**: 25  
**Failed**: 0  
**Tỷ lệ pass**: 100%

**Phân loại theo chức năng**:
- Xem sản phẩm: 11 test cases
- Tạo sản phẩm: 5 test cases
- Cập nhật sản phẩm: 3 test cases
- Xóa sản phẩm: 3 test cases
- Upload ảnh: 3 test cases
