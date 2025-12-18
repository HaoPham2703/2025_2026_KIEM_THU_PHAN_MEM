# Module6 - Review & Comment (Đánh giá & Bình luận)

## Thông tin Module

|                      |                                                                                             |
| -------------------- | ------------------------------------------------------------------------------------------- |
| **Module Code**      | Module6                                                                                     |
| **Test Requirement** | Test các chức năng đánh giá và bình luận sản phẩm: CRUD Reviews, CRUD Comments, Like/Unlike |
| **Tester**           | HaoPham                                                                                     |
| **Test Date**        | 18/12/2025 (GitHub Actions - Branch: weblau)                                                |

---

## Thống kê Test Case

| Pass | Fail | Untested | N/A | Number of Test Cases |
| ---- | ---- | -------- | --- | -------------------- |
| 22   | 10   | 0        | 0   | 32                   |

> **Ghi chú:** Kết quả từ GitHub Actions - Branch `weblau` - Test Date: 18/12/2025  
> **Review Tests:** 18 tests (12 Pass, 6 Fail) - Pass rate: 66.67%  
> **Comment Tests:** 14 tests (10 Pass, 4 Fail) - Pass rate: 71.43%

---

## Chi tiết Test Case

### Function A: Xem đánh giá sản phẩm (Get All Reviews)

| ID      | Test Case Description                  | Test Case Procedure                                 | Expected Output                                             | Test Data  | Result | Test Date  | Description                                                                                     |
| ------- | -------------------------------------- | --------------------------------------------------- | ----------------------------------------------------------- | ---------- | ------ | ---------- | ----------------------------------------------------------------------------------------------- |
| REV-001 | Xem danh sách đánh giá của sản phẩm    | 1. GET /api/v1/products/:productId/reviews          | 1. Trả về status 200<br>2. Trả về danh sách reviews         | TestData01 | Fail   | 18/12/2025 | Lỗi: MissingSchemaError - Schema hasn't been registered for model "Category"                    |
| REV-002 | Xem reviews với query filter (rating)  | 1. GET /api/v1/products/:productId/reviews?rating=5 | 1. Trả về status 200<br>2. Chỉ trả về reviews có rating = 5 | TestData02 | Fail   | 18/12/2025 | Lỗi: expect(jest.fn()).toHaveBeenCalledWith(200), Number of calls: 0. Controller không được gọi |
| REV-003 | Xem reviews của sản phẩm không tồn tại | 1. GET /api/v1/products/:invalidId/reviews          | 1. Trả về status 200<br>2. Trả về empty array               | TestData03 | Fail   | 18/12/2025 | Lỗi: expect(jest.fn()).toHaveBeenCalledWith(200), Number of calls: 0. Controller không được gọi |

---

### Function B: Tạo đánh giá (Create Review)

| ID      | Test Case Description                               | Test Case Procedure                                                                         | Expected Output                                                                | Test Data  | Result | Test Date  | Description                                                                                       |
| ------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ---------- | ------ | ---------- | ------------------------------------------------------------------------------------------------- |
| REV-004 | Tạo đánh giá thành công                             | 1. Đăng nhập với role=user<br>2. Đã mua sản phẩm (order Success)<br>3. POST /api/v1/reviews | 1. Trả về status 201<br>2. Review được tạo<br>3. Product ratings được cập nhật | TestData04 | Pass   | 18/12/2025 | Test thành công, middleware setProductUserIds và createReview hoạt động đúng                      |
| REV-005 | Tạo review với rating 1-5 sao                       | 1. Đăng nhập<br>2. POST /api/v1/reviews với rating từ 1-5                                   | 1. Trả về status 201<br>2. Review được tạo với rating tương ứng                | TestData05 | Fail   | 18/12/2025 | Lỗi: MissingSchemaError - Schema hasn't been registered for model "Category" khi populate product |
| REV-006 | Tạo review thất bại - Chưa mua sản phẩm             | 1. Đăng nhập<br>2. POST /api/v1/reviews (chưa có order)                                     | 1. Trả về status 403<br>2. Message: "Vui lòng mua hàng trước khi đánh giá!!!"  | TestData06 | Pass   | 18/12/2025 | Middleware setProductUserIds hoạt động đúng, chặn user chưa mua sản phẩm                          |
| REV-007 | Tạo review thất bại - Order chưa Success            | 1. Đăng nhập<br>2. Có order nhưng status != "Success"<br>3. POST /api/v1/reviews            | 1. Trả về status 403<br>2. Message: "Vui lòng mua hàng trước khi đánh giá!!!"  | TestData07 | Pass   | 18/12/2025 | Middleware check order status = "Success" hoạt động đúng                                          |
| REV-008 | Tạo review thất bại - Đã review rồi (duplicate)     | 1. Đăng nhập<br>2. Đã tạo review cho sản phẩm<br>3. POST /api/v1/reviews lần 2              | 1. Trả về lỗi duplicate<br>2. Message về unique constraint                     | TestData08 | Pass   | 18/12/2025 | Unique index (product, user) hoạt động đúng, error code 11000                                     |
| REV-009 | Tạo review thất bại - Thiếu review text             | 1. Đăng nhập<br>2. POST /api/v1/reviews không có review text                                | 1. Trả về lỗi validation<br>2. Message: "Đánh giá không thể để trống!"         | TestData09 | Pass   | 18/12/2025 | Model validation hoạt động đúng                                                                   |
| REV-010 | Tạo review thất bại - Rating ngoài phạm vi (1-5)    | 1. Đăng nhập<br>2. POST /api/v1/reviews với rating = 6                                      | 1. Trả về lỗi validation<br>2. Message về rating range                         | TestData10 | Pass   | 18/12/2025 | Min/Max validation hoạt động đúng                                                                 |
| REV-011 | Tạo review thất bại - Admin/Employee không được tạo | 1. Đăng nhập với role=admin hoặc employee<br>2. POST /api/v1/reviews                        | 1. Trả về status 403<br>2. Message: "You do not have permission..."            | TestData11 | Pass   | 18/12/2025 | Middleware setProductUserIds chặn admin/employee thành công                                       |

---

### Function C: Cập nhật đánh giá (Update Review)

| ID      | Test Case Description                           | Test Case Procedure                                                                  | Expected Output                                             | Test Data  | Result | Test Date  | Description                                                                                                           |
| ------- | ----------------------------------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------- | ---------- | ------ | ---------- | --------------------------------------------------------------------------------------------------------------------- |
| REV-012 | Cập nhật review thành công                      | 1. Đăng nhập<br>2. PATCH /api/v1/reviews/:id (review của user)<br>3. Gửi dữ liệu mới | 1. Trả về status 200<br>2. Review được cập nhật             | TestData12 | Pass   | 18/12/2025 | Test thành công, owner có thể cập nhật review của mình                                                                |
| REV-013 | Cập nhật review - Admin có thể update           | 1. Đăng nhập với role=admin<br>2. PATCH /api/v1/reviews/:id                          | 1. Trả về status 200<br>2. Review được cập nhật             | TestData13 | Fail   | 18/12/2025 | Lỗi: expect(jest.fn()).toHaveBeenCalledWith(200), Number of calls: 0. Admin update không hoạt động đúng               |
| REV-014 | Cập nhật review thất bại - Không phải owner     | 1. Đăng nhập<br>2. PATCH /api/v1/reviews/:id (review của user khác)                  | 1. Trả về status 403<br>2. Message: "Bạn không có quyền..." | TestData14 | Fail   | 18/12/2025 | Lỗi: TypeError - Cannot read properties of null (reading 'user'). Middleware isOwner gặp lỗi khi review được populate |
| REV-015 | Cập nhật review thất bại - Review không tồn tại | 1. Đăng nhập<br>2. PATCH /api/v1/reviews/:invalidId                                  | 1. Trả về status 404<br>2. Message: "No document found"     | TestData15 | Pass   | 18/12/2025 | Factory.updateOne hoạt động đúng, trả về lỗi 404                                                                      |

---

### Function D: Xóa đánh giá (Delete Review)

| ID      | Test Case Description                  | Test Case Procedure                                                  | Expected Output                                             | Test Data  | Result | Test Date  | Description                                                   |
| ------- | -------------------------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------- | ---------- | ------ | ---------- | ------------------------------------------------------------- |
| REV-016 | Xóa review thành công                  | 1. Đăng nhập<br>2. DELETE /api/v1/reviews/:id (review của user)      | 1. Trả về status 204<br>2. Review bị xóa                    | TestData16 | Pass   | 18/12/2025 | Test thành công, owner có thể xóa review của mình             |
| REV-017 | Admin xóa review thành công            | 1. Đăng nhập với role=admin<br>2. DELETE /api/v1/reviews/:id         | 1. Trả về status 204<br>2. Review bị xóa                    | TestData17 | Pass   | 18/12/2025 | Test thành công, admin có quyền xóa mọi review                |
| REV-018 | Xóa review thất bại - Không phải owner | 1. Đăng nhập<br>2. DELETE /api/v1/reviews/:id (review của user khác) | 1. Trả về status 403<br>2. Message: "Bạn không có quyền..." | TestData18 | Pass   | 18/12/2025 | Middleware isOwner hoạt động đúng, chặn user không phải owner |

---

### Function E: Xem bình luận sản phẩm (Get All Comments)

| ID      | Test Case Description                   | Test Case Procedure                         | Expected Output                                      | Test Data  | Result | Test Date  | Description                                                    |
| ------- | --------------------------------------- | ------------------------------------------- | ---------------------------------------------------- | ---------- | ------ | ---------- | -------------------------------------------------------------- |
| COM-001 | Xem danh sách bình luận của sản phẩm    | 1. GET /api/v1/products/:productId/comments | 1. Trả về status 200<br>2. Trả về danh sách comments | TestData19 | Pass   | 18/12/2025 | Test thành công, trả về danh sách comments của sản phẩm        |
| COM-002 | Xem comments của sản phẩm không tồn tại | 1. GET /api/v1/products/:invalidId/comments | 1. Trả về status 200<br>2. Trả về empty array        | TestData20 | Pass   | 18/12/2025 | Test thành công, trả về empty array khi sản phẩm không tồn tại |

---

### Function F: Tạo bình luận (Create Comment)

| ID      | Test Case Description                     | Test Case Procedure                                       | Expected Output                                                         | Test Data  | Result | Test Date  | Description                                                                 |
| ------- | ----------------------------------------- | --------------------------------------------------------- | ----------------------------------------------------------------------- | ---------- | ------ | ---------- | --------------------------------------------------------------------------- |
| COM-003 | Tạo comment thành công                    | 1. Đăng nhập<br>2. POST /api/v1/comments                  | 1. Trả về status 201<br>2. Comment được tạo                             | TestData21 | Pass   | 18/12/2025 | Test thành công, user có thể tạo comment                                    |
| COM-004 | Admin/Employee tạo comment thành công     | 1. Đăng nhập với role=admin<br>2. POST /api/v1/comments   | 1. Trả về status 201<br>2. Comment được tạo                             | TestData22 | Pass   | 18/12/2025 | Test thành công, admin/employee có thể comment (không cần mua sản phẩm)     |
| COM-005 | Tạo comment thất bại - Thiếu comment text | 1. Đăng nhập<br>2. POST /api/v1/comments không có comment | 1. Trả về lỗi validation<br>2. Message: "Bình luận không thể để trống!" | TestData23 | Pass   | 18/12/2025 | Model validation hoạt động đúng                                             |
| COM-006 | Tạo reply comment (parent comment)        | 1. Đăng nhập<br>2. POST /api/v1/comments với parent ID    | 1. Trả về status 201<br>2. Comment con được tạo                         | TestData24 | Pass   | 18/12/2025 | Test thành công, nested comment hoạt động đúng, parent.children được update |

---

### Function G: Cập nhật bình luận (Update Comment)

| ID      | Test Case Description                        | Test Case Procedure                                                   | Expected Output                                             | Test Data  | Result | Test Date  | Description                                                                                                            |
| ------- | -------------------------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------- | ---------- | ------ | ---------- | ---------------------------------------------------------------------------------------------------------------------- |
| COM-007 | Cập nhật comment thành công                  | 1. Đăng nhập<br>2. PATCH /api/v1/comments/:id (comment của user)      | 1. Trả về status 200<br>2. Comment được cập nhật            | TestData25 | Pass   | 18/12/2025 | Test thành công, owner có thể cập nhật comment của mình                                                                |
| COM-008 | Cập nhật comment thất bại - Không phải owner | 1. Đăng nhập<br>2. PATCH /api/v1/comments/:id (comment của user khác) | 1. Trả về status 403<br>2. Message: "Bạn không có quyền..." | TestData26 | Fail   | 18/12/2025 | Lỗi: TypeError - Cannot read properties of null (reading 'user'). Middleware isOwner gặp lỗi khi comment được populate |

---

### Function H: Xóa bình luận (Delete Comment)

| ID      | Test Case Description                   | Test Case Procedure                                                    | Expected Output                                             | Test Data  | Result | Test Date  | Description                                                   |
| ------- | --------------------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------- | ---------- | ------ | ---------- | ------------------------------------------------------------- |
| COM-009 | Xóa comment thành công                  | 1. Đăng nhập<br>2. DELETE /api/v1/comments/:id (comment của user)      | 1. Trả về status 204<br>2. Comment bị xóa                   | TestData27 | Pass   | 18/12/2025 | Test thành công, owner có thể xóa comment của mình            |
| COM-010 | Admin xóa comment thành công            | 1. Đăng nhập với role=admin<br>2. DELETE /api/v1/comments/:id          | 1. Trả về status 204<br>2. Comment bị xóa                   | TestData28 | Pass   | 18/12/2025 | Test thành công, admin có quyền xóa mọi comment               |
| COM-011 | Xóa comment thất bại - Không phải owner | 1. Đăng nhập<br>2. DELETE /api/v1/comments/:id (comment của user khác) | 1. Trả về status 403<br>2. Message: "Bạn không có quyền..." | TestData29 | Pass   | 18/12/2025 | Middleware isOwner hoạt động đúng, chặn user không phải owner |

---

### Function I: Like/Unlike bình luận (Like Comment)

| ID      | Test Case Description                         | Test Case Procedure                                                 | Expected Output                                                  | Test Data  | Result | Test Date  | Description                                                                                                                                 |
| ------- | --------------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------- | ---------- | ------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| COM-012 | Like comment thành công                       | 1. Đăng nhập<br>2. PATCH /api/v1/comments/setLike/:id               | 1. Trả về status 200<br>2. User ID được thêm vào like array      | TestData30 | Fail   | 18/12/2025 | Lỗi: expect(received).toContain(expected). Expected: string "69435fc06630585e7f099d04", Received: array [ObjectId]. Issue với type matching |
| COM-013 | Unlike comment (toggle off)                   | 1. Đăng nhập<br>2. Đã like<br>3. PATCH /api/v1/comments/setLike/:id | 1. Trả về status 200<br>2. User ID bị xóa khỏi like array        | TestData31 | Fail   | 18/12/2025 | Lỗi: expect(jest.fn()).toHaveBeenCalledWith(200), Number of calls: 0. Test phụ thuộc vào COM-012 fail                                       |
| COM-014 | Like comment thất bại - Comment không tồn tại | 1. Đăng nhập<br>2. PATCH /api/v1/comments/setLike/:invalidId        | 1. Trả về status 404<br>2. Message: "Không tìm thấy comment này" | TestData32 | Fail   | 18/12/2025 | Lỗi: TypeError - Cannot read properties of null (reading 'like'). likeComment controller không handle null comment đúng cách                |

---

## 📊 Báo Cáo Test Tự Động (GitHub Actions)

### 📊 Tổng Quan Test Results

| Metric          | Value      | Status             |
| --------------- | ---------- | ------------------ |
| **Total Tests** | 32         | -                  |
| **✅ Passed**   | 22         | 68.75%             |
| **❌ Failed**   | 10         | 31.25% - Cần xử lý |
| **Branch**      | weblau     | -                  |
| **Test Date**   | 18/12/2025 | -                  |

**Review Tests:** 18 tests (12 Pass, 6 Fail) - Pass rate: 66.67%  
**Comment Tests:** 14 tests (10 Pass, 4 Fail) - Pass rate: 71.43%

### ❌ Chi Tiết Các Test Failed

| STT | Test Suite          | Test Case Description                          | Test ID | Status | Note                                                             |
| --- | ------------------- | ---------------------------------------------- | ------- | ------ | ---------------------------------------------------------------- |
| 1   | Get All Reviews     | Xem danh sách đánh giá của sản phẩm thành công | REV-001 | Fail   | MissingSchemaError: Schema hasn't been registered for "Category" |
| 2   | Get All Reviews     | Xem reviews với query filter (rating=5)        | REV-002 | Fail   | expect(jest.fn()).toHaveBeenCalledWith(200), calls: 0            |
| 3   | Get All Reviews     | Xem reviews của sản phẩm không tồn tại         | REV-003 | Fail   | expect(jest.fn()).toHaveBeenCalledWith(200), calls: 0            |
| 4   | Create Review       | Tạo review với rating 1-5 sao                  | REV-005 | Fail   | MissingSchemaError: Schema hasn't been registered for "Category" |
| 5   | Update Review       | Admin có thể update review                     | REV-013 | Fail   | expect(jest.fn()).toHaveBeenCalledWith(200), calls: 0            |
| 6   | Update Review       | Không phải owner cố update                     | REV-014 | Fail   | TypeError: Cannot read properties of null (reading 'user')       |
| 7   | Update Comment      | Không phải owner cố update                     | COM-008 | Fail   | TypeError: Cannot read properties of null (reading 'user')       |
| 8   | Like/Unlike Comment | Like comment thành công                        | COM-012 | Fail   | Type mismatch: ObjectId vs string trong like array               |
| 9   | Like/Unlike Comment | Unlike comment (toggle off)                    | COM-013 | Fail   | Test phụ thuộc vào COM-012 fail                                  |
| 10  | Like/Unlike Comment | Like comment thất bại - Comment không tồn tại  | COM-014 | Fail   | TypeError: Cannot read properties of null (reading 'like')       |

### 🎯 Độ Coverage Theo Function

| Function            | Test Cases | Passed | Failed | Pass Rate |
| ------------------- | ---------- | ------ | ------ | --------- |
| Get All Reviews     | 3          | 0      | 3      | 0% ❌     |
| Create Review       | 8          | 7      | 1      | 87.5% ✅  |
| Update Review       | 4          | 2      | 2      | 50% ⚠️    |
| Delete Review       | 3          | 3      | 0      | 100% ✅   |
| Get All Comments    | 2          | 2      | 0      | 100% ✅   |
| Create Comment      | 4          | 4      | 0      | 100% ✅   |
| Update Comment      | 2          | 1      | 1      | 50% ⚠️    |
| Delete Comment      | 3          | 3      | 0      | 100% ✅   |
| Like/Unlike Comment | 3          | 0      | 3      | 0% ❌     |

### 📋 Phân Loại Theo Nhóm Chức Năng

| Nhóm Chức Năng   | Test Cases | Passed | Failed | Pass Rate | Note                                                 |
| ---------------- | ---------- | ------ | ------ | --------- | ---------------------------------------------------- |
| ⭐ Review Read   | 3          | 0      | 3      | 0%        | Lỗi MissingSchemaError cho Category model            |
| ⭐ Review Write  | 15         | 12     | 3      | 80%       | Create/Update/Delete hoạt động tốt, trừ admin update |
| 💬 Comment Read  | 2          | 2      | 0      | 100%      | GetAll hoạt động hoàn hảo                            |
| 💬 Comment Write | 9          | 8      | 1      | 89%       | Create/Delete tốt, Update có lỗi isOwner middleware  |
| 👍 Like Feature  | 3          | 0      | 3      | 0%        | Lỗi nghiêm trọng: type mismatch và null handling     |

### 🔍 Phân Tích Lỗi Chi Tiết

#### 1. **Lỗi MissingSchemaError - Category Model (REV-001, REV-005)**

**Vấn đề:** Schema chưa được register cho model "Category"

**Error Message:**

```
MissingSchemaError: Schema hasn't been registered for model "Category".
Use mongoose.model(name, schema)
```

**Nguyên nhân:**

- Product model có reference đến Category
- Khi populate product trong review, mongoose cần Category schema
- Test environment chưa import/register Category model

**Giải pháp đề xuất:**

1. **Import Category model trong test setup:**

   ```javascript
   const Category = require("../../../models/categoryModel");
   const Brand = require("../../../models/brandModel");
   ```

2. **Hoặc mock Category/Brand khi tạo Product:**

   ```javascript
   // Create real category and brand
   const testCategory = await Category.create({ name: "Test Category" });
   const testBrand = await Brand.create({ name: "Test Brand" });

   testProduct = await Product.create({
     category: testCategory._id,
     brand: testBrand._id,
     // ... other fields
   });
   ```

#### 2. **Lỗi isOwner Middleware - Cannot read 'user' (REV-014, COM-008)**

**Vấn đề:** `Cannot read properties of null (reading 'user')`

**Error Message:**

```
TypeError: Cannot read properties of null (reading 'user')
    at Object.toHaveBeenCalledWith
```

**Nguyên nhân:**

- Middleware `isOwner` (factory.checkPermission) tìm document bằng `findById`
- Document được populate với user
- Trong test context, populate có thể return null
- Middleware không check null trước khi access `.user`

**Giải pháp đề xuất:**

1. **Fix handlerFactory.js checkPermission:**

   ```javascript
   exports.checkPermission = (Model) =>
     catchAsync(async (req, res, next) => {
       const doc = await Model.findById(req.params.id);

       if (!doc) {
         return next(new AppError("Không tìm thấy dữ liệu với ID này", 404));
       }

       // Check if user owns the document or is admin/employee
       if (
         doc.user.toString() !== req.user.id &&
         req.user.role !== "admin" &&
         req.user.role !== "employee"
       ) {
         return next(
           new AppError("Bạn không có quyền thực hiện hành động này", 403)
         );
       }

       next();
     });
   ```

2. **Ensure populate in test:**
   - Make sure document is properly populated before calling isOwner

#### 3. **Lỗi Like/Unlike Feature - Type Mismatch (COM-012, COM-013, COM-014)**

**Vấn đề:** Type mismatch giữa ObjectId và string trong like array

**Error Message (COM-012):**

```
expect(received).toContain(expected) // indexOf
Expected value: "69435fc06630585e7f099d04"
Received array: ["69435fc06630585e7f099d04"]
```

**Error Message (COM-014):**

```
TypeError: Cannot read properties of null (reading 'like')
```

**Nguyên nhân:**

- `like` array chứa ObjectId nhưng test expect string
- `likeComment` controller không check null comment
- Toggle logic filter by ObjectId nhưng compare as string

**Giải pháp đề xuất:**

1. **Fix commentController.js likeComment:**

   ```javascript
   exports.likeComment = catchAsync(async (req, res, next) => {
     const data = await Comment.findById(req.params.id);

     if (!data) {
       return next(new AppError("Không tìm thấy comment này", 404));
     }

     const like = data.like || [];
     const userId = req.user.id.toString();

     // Filter and compare as strings
     let result = like.filter((u) => u.toString() !== userId);

     // If no change, add user (first time like)
     if (result.length === like.length) {
       result.push(req.user.id);
     }

     data.like = result;
     await data.save({ validateBeforeSave: false });

     res.status(200).json({
       status: "success",
       message: "Cập nhật like thành công",
       data: { data: data },
     });
   });
   ```

2. **Fix test expectation:**
   ```javascript
   // Convert ObjectId to string for comparison
   expect(jsonCall.data.data.like.map((id) => id.toString())).toContain(
     userForLike._id.toString()
   );
   ```

#### 4. **Lỗi Controller Not Called (REV-002, REV-003, REV-013, COM-013)**

**Vấn đề:** `expect(jest.fn()).toHaveBeenCalledWith(200), Number of calls: 0`

**Nguyên nhân:**

- Previous error trong test flow làm controller không được gọi
- Test dependencies: REV-002, REV-003 depend on REV-001 setup
- COM-013 depends on COM-012 success

**Giải pháp:**

- Fix các lỗi fundamental trước (MissingSchemaError, isOwner, likeComment)
- Các test này sẽ pass sau khi fix root causes

### 📈 So Sánh Với Module Khác

| Module            | Total Tests | Passed | Failed | Pass Rate |
| ----------------- | ----------- | ------ | ------ | --------- |
| Module1 (Auth)    | 31          | 26     | 5      | 83.87%    |
| Module4 (Order)   | 30          | 25     | 5      | 83.33%    |
| Module3 (Product) | 35          | 27     | 8      | 77.14%    |
| Module2 (User)    | 30          | 23     | 7      | 76.67%    |
| Module6 (Review)  | 32          | 22     | 10     | 68.75%    |
| Module5 (Payment) | 17          | 11     | 6      | 64.71%    |

**Nhận xét:**

- Module 6 có pass rate thứ 5/6 (68.75%)
- Review Read functions có pass rate 0% (critical issue)
- Like/Unlike feature có pass rate 0% (critical issue)
- Delete operations hoạt động hoàn hảo (100%)
- Create operations hoạt động tốt (87.5% - 100%)

### 🔧 Các Bước Tiếp Theo

1. **Ưu tiên cao (Critical):**

   - ✅ Fix MissingSchemaError: Import Category & Brand models trong test setup
   - ✅ Fix likeComment controller: Add null check và fix type comparison
   - ✅ Fix isOwner middleware: Add null check cho document

2. **Ưu tiên trung bình:**

   - 📝 Review admin update permission logic (REV-013)
   - 📝 Test với real populate data
   - 📝 Add integration tests cho nested comments

3. **Ưu tiên thấp:**

   - 🧪 Test post-save hook (ratings calculation)
   - 📊 Tăng coverage lên 90%+
   - 🔐 Add security tests (XSS in comment/review text)

### 📝 Notes

- **Review Pre-condition:** setProductUserIds middleware hoạt động hoàn hảo (100% pass)
- **Unique Constraint:** Test duplicate review pass (REV-008)
- **Nested Comments:** Parent/child relationship hoạt động tốt (COM-006 pass)
- **Permissions:** Delete operations có permissions tốt nhất
- **Critical Issues:**
  - MissingSchemaError blocking 2 tests
  - Like feature completely broken (0/3 pass)
  - isOwner middleware needs null handling

---

## Test Data

| Test Data ID | Data Description                                                                                       |
| ------------ | ------------------------------------------------------------------------------------------------------ |
| TestData01   | GET /api/v1/products/:productId/reviews                                                                |
| TestData02   | GET /api/v1/products/:productId/reviews?rating=5                                                       |
| TestData03   | GET /api/v1/products/:invalidId/reviews                                                                |
| TestData04   | POST /api/v1/reviews {product: productId, review: "Great product!", rating: 5} (user có order Success) |
| TestData05   | POST /api/v1/reviews với rating: 1, 2, 3, 4, 5                                                         |
| TestData06   | POST /api/v1/reviews {product, review, rating} (user chưa có order)                                    |
| TestData07   | POST /api/v1/reviews (user có order nhưng status != "Success")                                         |
| TestData08   | POST /api/v1/reviews lần 2 cho cùng sản phẩm                                                           |
| TestData09   | POST /api/v1/reviews {product, rating: 5} (missing review text)                                        |
| TestData10   | POST /api/v1/reviews {product, review: "Test", rating: 6}                                              |
| TestData11   | POST /api/v1/reviews by admin/employee                                                                 |
| TestData12   | PATCH /api/v1/reviews/:id {review: "Updated review", rating: 4}                                        |
| TestData13   | PATCH /api/v1/reviews/:id by admin                                                                     |
| TestData14   | PATCH /api/v1/reviews/:id (review của user khác)                                                       |
| TestData15   | PATCH /api/v1/reviews/:invalidId                                                                       |
| TestData16   | DELETE /api/v1/reviews/:id by owner                                                                    |
| TestData17   | DELETE /api/v1/reviews/:id by admin                                                                    |
| TestData18   | DELETE /api/v1/reviews/:id (review của user khác)                                                      |
| TestData19   | GET /api/v1/products/:productId/comments                                                               |
| TestData20   | GET /api/v1/products/:invalidId/comments                                                               |
| TestData21   | POST /api/v1/comments {product: productId, comment: "Nice product!"}                                   |
| TestData22   | POST /api/v1/comments by admin                                                                         |
| TestData23   | POST /api/v1/comments {product: productId} (missing comment text)                                      |
| TestData24   | POST /api/v1/comments {product, comment, parent: parentCommentId}                                      |
| TestData25   | PATCH /api/v1/comments/:id {comment: "Updated comment"}                                                |
| TestData26   | PATCH /api/v1/comments/:id (comment của user khác)                                                     |
| TestData27   | DELETE /api/v1/comments/:id by owner                                                                   |
| TestData28   | DELETE /api/v1/comments/:id by admin                                                                   |
| TestData29   | DELETE /api/v1/comments/:id (comment của user khác)                                                    |
| TestData30   | PATCH /api/v1/comments/setLike/:id (first time like)                                                   |
| TestData31   | PATCH /api/v1/comments/setLike/:id (unlike - already liked)                                            |
| TestData32   | PATCH /api/v1/comments/setLike/:invalidId                                                              |

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
