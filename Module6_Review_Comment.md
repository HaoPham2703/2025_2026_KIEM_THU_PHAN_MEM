# Module6 - Review & Comment (Đánh giá & Bình luận)

## Thông tin Module

|                      |                                                                                                    |
| -------------------- | -------------------------------------------------------------------------------------------------- |
| **Module Code**      | Module6                                                                                            |
| **Test Requirement** | Test các chức năng đánh giá và bình luận sản phẩm: CRUD Reviews, CRUD Comments, Like/Unlike       |
| **Tester**           | HaoPham                                                                                            |
| **Test Date**        | 18/12/2025 (GitHub Actions - Branch: weblau)                                                       |

---

## Thống kê Test Case

| Pass | Fail | Untested | N/A | Number of Test Cases |
| ---- | ---- | -------- | --- | -------------------- |
| 0    | 0    | 32       | 0   | 32                   |

> **Ghi chú:** Kết quả từ GitHub Actions - Branch `weblau` - Test Date: 18/12/2025

---

## Chi tiết Test Case

### Function A: Xem đánh giá sản phẩm (Get All Reviews)

| ID     | Test Case Description                      | Test Case Procedure                                                  | Expected Output                                                      | Test Data  | Result   | Test Date | Description             |
| ------ | ------------------------------------------ | -------------------------------------------------------------------- | -------------------------------------------------------------------- | ---------- | -------- | --------- | ----------------------- |
| REV-001 | Xem danh sách đánh giá của sản phẩm        | 1. GET /api/v1/products/:productId/reviews                            | 1. Trả về status 200<br>2. Trả về danh sách reviews                  | TestData01 | Untested |           | Không cần đăng nhập     |
| REV-002 | Xem reviews với query filter (rating)      | 1. GET /api/v1/products/:productId/reviews?rating=5                   | 1. Trả về status 200<br>2. Chỉ trả về reviews có rating = 5          | TestData02 | Untested |           | Filter by rating        |
| REV-003 | Xem reviews của sản phẩm không tồn tại     | 1. GET /api/v1/products/:invalidId/reviews                            | 1. Trả về status 200<br>2. Trả về empty array                        | TestData03 | Untested |           | No reviews found        |

---

### Function B: Tạo đánh giá (Create Review)

| ID     | Test Case Description                               | Test Case Procedure                                                                                | Expected Output                                                                | Test Data  | Result   | Test Date | Description                  |
| ------ | --------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ---------- | -------- | --------- | ---------------------------- |
| REV-004 | Tạo đánh giá thành công                             | 1. Đăng nhập với role=user<br>2. Đã mua sản phẩm (order Success)<br>3. POST /api/v1/reviews        | 1. Trả về status 201<br>2. Review được tạo<br>3. Product ratings được cập nhật | TestData04 | Untested |           | User đã mua sản phẩm         |
| REV-005 | Tạo review với rating 1-5 sao                       | 1. Đăng nhập<br>2. POST /api/v1/reviews với rating từ 1-5                                          | 1. Trả về status 201<br>2. Review được tạo với rating tương ứng                | TestData05 | Untested |           | Validation rating            |
| REV-006 | Tạo review thất bại - Chưa mua sản phẩm             | 1. Đăng nhập<br>2. POST /api/v1/reviews (chưa có order)                                            | 1. Trả về status 403<br>2. Message: "Vui lòng mua hàng trước khi đánh giá!!!"  | TestData06 | Untested |           | Middleware setProductUserIds |
| REV-007 | Tạo review thất bại - Order chưa Success            | 1. Đăng nhập<br>2. Có order nhưng status != "Success"<br>3. POST /api/v1/reviews                   | 1. Trả về status 403<br>2. Message: "Vui lòng mua hàng trước khi đánh giá!!!"  | TestData07 | Untested |           | Order must be Success        |
| REV-008 | Tạo review thất bại - Đã review rồi (duplicate)     | 1. Đăng nhập<br>2. Đã tạo review cho sản phẩm<br>3. POST /api/v1/reviews lần 2                     | 1. Trả về lỗi duplicate<br>2. Message về unique constraint                     | TestData08 | Untested |           | Unique index (product, user) |
| REV-009 | Tạo review thất bại - Thiếu review text             | 1. Đăng nhập<br>2. POST /api/v1/reviews không có review text                                       | 1. Trả về lỗi validation<br>2. Message: "Đánh giá không thể để trống!"         | TestData09 | Untested |           | Required field               |
| REV-010 | Tạo review thất bại - Rating ngoài phạm vi (1-5)    | 1. Đăng nhập<br>2. POST /api/v1/reviews với rating = 6                                             | 1. Trả về lỗi validation<br>2. Message về rating range                         | TestData10 | Untested |           | Min/Max validation           |
| REV-011 | Tạo review thất bại - Admin/Employee không được tạo | 1. Đăng nhập với role=admin hoặc employee<br>2. POST /api/v1/reviews                               | 1. Trả về status 403<br>2. Message: "You do not have permission..."            | TestData11 | Untested |           | Only user can review         |

---

### Function C: Cập nhật đánh giá (Update Review)

| ID     | Test Case Description                      | Test Case Procedure                                                                  | Expected Output                                            | Test Data  | Result   | Test Date | Description            |
| ------ | ------------------------------------------ | ------------------------------------------------------------------------------------ | ---------------------------------------------------------- | ---------- | -------- | --------- | ---------------------- |
| REV-012 | Cập nhật review thành công                 | 1. Đăng nhập<br>2. PATCH /api/v1/reviews/:id (review của user)<br>3. Gửi dữ liệu mới | 1. Trả về status 200<br>2. Review được cập nhật             | TestData12 | Untested |           | User là owner          |
| REV-013 | Cập nhật review - Admin có thể update      | 1. Đăng nhập với role=admin<br>2. PATCH /api/v1/reviews/:id                          | 1. Trả về status 200<br>2. Review được cập nhật             | TestData13 | Untested |           | Admin permission       |
| REV-014 | Cập nhật review thất bại - Không phải owner | 1. Đăng nhập<br>2. PATCH /api/v1/reviews/:id (review của user khác)                 | 1. Trả về status 403<br>2. Message: "Bạn không có quyền..." | TestData14 | Untested |           | Middleware isOwner     |
| REV-015 | Cập nhật review thất bại - Review không tồn tại | 1. Đăng nhập<br>2. PATCH /api/v1/reviews/:invalidId                                 | 1. Trả về status 404<br>2. Message: "No document found"     | TestData15 | Untested |           | Not found              |

---

### Function D: Xóa đánh giá (Delete Review)

| ID     | Test Case Description                        | Test Case Procedure                                               | Expected Output                                                | Test Data  | Result   | Test Date | Description        |
| ------ | -------------------------------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------- | ---------- | -------- | --------- | ------------------ |
| REV-016 | Xóa review thành công                        | 1. Đăng nhập<br>2. DELETE /api/v1/reviews/:id (review của user)   | 1. Trả về status 204<br>2. Review bị xóa                       | TestData16 | Untested |           | User là owner      |
| REV-017 | Admin xóa review thành công                  | 1. Đăng nhập với role=admin<br>2. DELETE /api/v1/reviews/:id      | 1. Trả về status 204<br>2. Review bị xóa                       | TestData17 | Untested |           | Admin permission   |
| REV-018 | Xóa review thất bại - Không phải owner       | 1. Đăng nhập<br>2. DELETE /api/v1/reviews/:id (review của user khác) | 1. Trả về status 403<br>2. Message: "Bạn không có quyền..."    | TestData18 | Untested |           | Middleware isOwner |

---

### Function E: Xem bình luận sản phẩm (Get All Comments)

| ID     | Test Case Description                       | Test Case Procedure                                    | Expected Output                                        | Test Data  | Result   | Test Date | Description         |
| ------ | ------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------ | ---------- | -------- | --------- | ------------------- |
| COM-001 | Xem danh sách bình luận của sản phẩm        | 1. GET /api/v1/products/:productId/comments             | 1. Trả về status 200<br>2. Trả về danh sách comments   | TestData19 | Untested |           | Không cần đăng nhập |
| COM-002 | Xem comments của sản phẩm không tồn tại     | 1. GET /api/v1/products/:invalidId/comments             | 1. Trả về status 200<br>2. Trả về empty array          | TestData20 | Untested |           | No comments found   |

---

### Function F: Tạo bình luận (Create Comment)

| ID     | Test Case Description                          | Test Case Procedure                                                  | Expected Output                                                 | Test Data  | Result   | Test Date | Description                |
| ------ | ---------------------------------------------- | -------------------------------------------------------------------- | --------------------------------------------------------------- | ---------- | -------- | --------- | -------------------------- |
| COM-003 | Tạo comment thành công                         | 1. Đăng nhập<br>2. POST /api/v1/comments                             | 1. Trả về status 201<br>2. Comment được tạo                     | TestData21 | Untested |           | User đã đăng nhập          |
| COM-004 | Admin/Employee tạo comment thành công          | 1. Đăng nhập với role=admin<br>2. POST /api/v1/comments              | 1. Trả về status 201<br>2. Comment được tạo                     | TestData22 | Untested |           | Admin có thể comment       |
| COM-005 | Tạo comment thất bại - Thiếu comment text      | 1. Đăng nhập<br>2. POST /api/v1/comments không có comment            | 1. Trả về lỗi validation<br>2. Message: "Bình luận không thể để trống!" | TestData23 | Untested |           | Required field             |
| COM-006 | Tạo reply comment (parent comment)             | 1. Đăng nhập<br>2. POST /api/v1/comments với parent ID               | 1. Trả về status 201<br>2. Comment con được tạo             | TestData24 | Untested |           | Nested comment             |

---

### Function G: Cập nhật bình luận (Update Comment)

| ID     | Test Case Description                          | Test Case Procedure                                                      | Expected Output                                            | Test Data  | Result   | Test Date | Description        |
| ------ | ---------------------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------- | ---------- | -------- | --------- | ------------------ |
| COM-007 | Cập nhật comment thành công                    | 1. Đăng nhập<br>2. PATCH /api/v1/comments/:id (comment của user)         | 1. Trả về status 200<br>2. Comment được cập nhật           | TestData25 | Untested |           | User là owner      |
| COM-008 | Cập nhật comment thất bại - Không phải owner   | 1. Đăng nhập<br>2. PATCH /api/v1/comments/:id (comment của user khác)    | 1. Trả về status 403<br>2. Message: "Bạn không có quyền..." | TestData26 | Untested |           | Middleware isOwner |

---

### Function H: Xóa bình luận (Delete Comment)

| ID     | Test Case Description                      | Test Case Procedure                                                  | Expected Output                                            | Test Data  | Result   | Test Date | Description        |
| ------ | ------------------------------------------ | -------------------------------------------------------------------- | ---------------------------------------------------------- | ---------- | -------- | --------- | ------------------ |
| COM-009 | Xóa comment thành công                     | 1. Đăng nhập<br>2. DELETE /api/v1/comments/:id (comment của user)    | 1. Trả về status 204<br>2. Comment bị xóa                  | TestData27 | Untested |           | User là owner      |
| COM-010 | Admin xóa comment thành công               | 1. Đăng nhập với role=admin<br>2. DELETE /api/v1/comments/:id        | 1. Trả về status 204<br>2. Comment bị xóa                  | TestData28 | Untested |           | Admin permission   |
| COM-011 | Xóa comment thất bại - Không phải owner    | 1. Đăng nhập<br>2. DELETE /api/v1/comments/:id (comment của user khác) | 1. Trả về status 403<br>2. Message: "Bạn không có quyền..." | TestData29 | Untested |           | Middleware isOwner |

---

### Function I: Like/Unlike bình luận (Like Comment)

| ID     | Test Case Description                    | Test Case Procedure                                             | Expected Output                                                        | Test Data  | Result   | Test Date | Description         |
| ------ | ---------------------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------- | -------- | --------- | ------------------- |
| COM-012 | Like comment thành công                  | 1. Đăng nhập<br>2. PATCH /api/v1/comments/setLike/:id           | 1. Trả về status 200<br>2. User ID được thêm vào like array            | TestData30 | Untested |           | First time like     |
| COM-013 | Unlike comment (toggle off)              | 1. Đăng nhập<br>2. Đã like<br>3. PATCH /api/v1/comments/setLike/:id | 1. Trả về status 200<br>2. User ID bị xóa khỏi like array              | TestData31 | Untested |           | Remove like         |
| COM-014 | Like comment thất bại - Comment không tồn tại | 1. Đăng nhập<br>2. PATCH /api/v1/comments/setLike/:invalidId    | 1. Trả về status 404<br>2. Message: "Không tìm thấy comment này"       | TestData32 | Untested |           | Not found           |

---

## Test Data

| Test Data ID | Data Description                                                                                                     |
| ------------ | -------------------------------------------------------------------------------------------------------------------- |
| TestData01   | GET /api/v1/products/:productId/reviews                                                                              |
| TestData02   | GET /api/v1/products/:productId/reviews?rating=5                                                                     |
| TestData03   | GET /api/v1/products/:invalidId/reviews                                                                              |
| TestData04   | POST /api/v1/reviews {product: productId, review: "Great product!", rating: 5} (user có order Success)              |
| TestData05   | POST /api/v1/reviews với rating: 1, 2, 3, 4, 5                                                                      |
| TestData06   | POST /api/v1/reviews {product, review, rating} (user chưa có order)                                                 |
| TestData07   | POST /api/v1/reviews (user có order nhưng status != "Success")                                                      |
| TestData08   | POST /api/v1/reviews lần 2 cho cùng sản phẩm                                                                        |
| TestData09   | POST /api/v1/reviews {product, rating: 5} (missing review text)                                                     |
| TestData10   | POST /api/v1/reviews {product, review: "Test", rating: 6}                                                           |
| TestData11   | POST /api/v1/reviews by admin/employee                                                                               |
| TestData12   | PATCH /api/v1/reviews/:id {review: "Updated review", rating: 4}                                                     |
| TestData13   | PATCH /api/v1/reviews/:id by admin                                                                                   |
| TestData14   | PATCH /api/v1/reviews/:id (review của user khác)                                                                    |
| TestData15   | PATCH /api/v1/reviews/:invalidId                                                                                     |
| TestData16   | DELETE /api/v1/reviews/:id by owner                                                                                  |
| TestData17   | DELETE /api/v1/reviews/:id by admin                                                                                  |
| TestData18   | DELETE /api/v1/reviews/:id (review của user khác)                                                                   |
| TestData19   | GET /api/v1/products/:productId/comments                                                                             |
| TestData20   | GET /api/v1/products/:invalidId/comments                                                                             |
| TestData21   | POST /api/v1/comments {product: productId, comment: "Nice product!"}                                                |
| TestData22   | POST /api/v1/comments by admin                                                                                       |
| TestData23   | POST /api/v1/comments {product: productId} (missing comment text)                                                   |
| TestData24   | POST /api/v1/comments {product, comment, parent: parentCommentId}                                                   |
| TestData25   | PATCH /api/v1/comments/:id {comment: "Updated comment"}                                                             |
| TestData26   | PATCH /api/v1/comments/:id (comment của user khác)                                                                  |
| TestData27   | DELETE /api/v1/comments/:id by owner                                                                                 |
| TestData28   | DELETE /api/v1/comments/:id by admin                                                                                 |
| TestData29   | DELETE /api/v1/comments/:id (comment của user khác)                                                                 |
| TestData30   | PATCH /api/v1/comments/setLike/:id (first time like)                                                                |
| TestData31   | PATCH /api/v1/comments/setLike/:id (unlike - already liked)                                                         |
| TestData32   | PATCH /api/v1/comments/setLike/:invalidId                                                                           |

---

## Ghi chú

1. **Review (Đánh giá sản phẩm):**

   - **Fields:** review (text), rating (1-5), product, user, createdAt, updateAt
   - **Unique Index:** (product, user) - Mỗi user chỉ review 1 lần cho mỗi sản phẩm
   - **Pre-condition:** User phải mua sản phẩm và order status = "Success"
   - **Post-save Hook:** Tự động tính toán và cập nhật Product ratings:
     - ratingsQuantity: Tổng số reviews
     - ratingsAverage: Trung bình rating
     - eachRating: [1 sao, 2 sao, 3 sao, 4 sao, 5 sao]
   - **Populate:** User (name, avatar)

2. **Comment (Bình luận sản phẩm):**

   - **Fields:** comment (text), product, user, like (array), parent, children, createdAt, updateAt
   - **No Pre-condition:** Không cần mua sản phẩm
   - **Nested Comments:** Hỗ trợ parent/children (reply)
   - **Like Feature:** Array chứa user IDs đã like
   - **Populate:** User (name, avatar, role), Children comments

3. **API Endpoints:**

   **Review:**
   - GET `/api/v1/products/:productId/reviews` - Xem reviews (Public)
   - POST `/api/v1/reviews` - Tạo review (Protected, User only)
   - GET `/api/v1/reviews/:id` - Xem 1 review
   - PATCH `/api/v1/reviews/:id` - Cập nhật review (Protected, Owner/Admin)
   - DELETE `/api/v1/reviews/:id` - Xóa review (Protected, Owner/Admin)

   **Comment:**
   - GET `/api/v1/products/:productId/comments` - Xem comments (Public)
   - POST `/api/v1/comments` - Tạo comment (Protected)
   - GET `/api/v1/comments/:id` - Xem 1 comment
   - PATCH `/api/v1/comments/:id` - Cập nhật comment (Protected, Owner/Admin)
   - DELETE `/api/v1/comments/:id` - Xóa comment (Protected, Owner/Admin)
   - PATCH `/api/v1/comments/setLike/:id` - Like/Unlike comment (Protected)

4. **Business Rules - Review:**

   - Middleware `setProductUserIds`:
     - Check user có order không
     - Check order status = "Success"
     - Check sản phẩm có trong order
     - Chỉ user đã mua và đơn hàng thành công mới được review
   - Middleware `isOwner`:
     - Check user là owner của review
     - Admin/Employee cũng có thể update/delete
   - Rating validation: 1-5 sao (min: 1, max: 5)
   - Review text bắt buộc
   - Unique constraint: 1 user chỉ review 1 lần cho 1 sản phẩm

5. **Business Rules - Comment:**

   - Không cần middleware check purchase (khác với Review)
   - User, Admin, Employee đều có thể comment
   - Middleware `isOwner` cho update/delete
   - Like/Unlike toggle:
     - Nếu user chưa like: thêm user ID vào array
     - Nếu user đã like: xóa user ID khỏi array
   - Nested comments: parent/children relationship

6. **Permissions:**

   **Review:**
   - **Create:** User only (phải mua sản phẩm)
   - **Read:** Public
   - **Update:** Owner, Admin, Employee
   - **Delete:** Owner, Admin, Employee

   **Comment:**
   - **Create:** User, Admin, Employee (không cần mua)
   - **Read:** Public
   - **Update:** Owner, Admin, Employee
   - **Delete:** Owner, Admin, Employee
   - **Like:** User, Admin, Employee (authenticated)

7. **Post-Save Hooks:**

   - **Review:** Tự động cập nhật Product ratings sau khi tạo/update/delete review
   - **Aggregation:** Tính toán nRating, avgRating, eachRating (5 levels)

8. **Testing Notes:**
   - Mock Order data để test review pre-condition
   - Test unique constraint (duplicate review)
   - Test rating validation (1-5)
   - Test like/unlike toggle logic
   - Test nested comments (parent/children)
   - Test post-save hook (ratings calculation)
   - Test permissions (owner vs admin)

