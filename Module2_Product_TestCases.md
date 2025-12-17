## Module2 – Product Management (Quản lý sản phẩm)

**Test requirement**: Kiểm thử các chức năng quản lý sản phẩm: upload hình, tạo/sửa/xoá sản phẩm, xem danh sách, xem chi tiết, top sản phẩm.

**Tester**: (Điền tên bạn)

---

### Function A – Upload & Resize Product Images

#### PROD-IMG-001 – Upload tối đa 5 ảnh sản phẩm hợp lệ

- **Description**: Upload nhiều ảnh hợp lệ cho một sản phẩm (không vượt quá 5 ảnh).
- **Steps**:
  1. Mở màn hình thêm mới sản phẩm.
  2. Ở phần chọn ảnh, chọn lần lượt 3–5 file ảnh hợp lệ (định dạng .jpg/.png, dung lượng trong giới hạn hệ thống).
  3. Điền đầy đủ thông tin sản phẩm khác (tên, giá, v.v.).
  4. Bấm nút "Lưu" / "Tạo sản phẩm" để gửi form.
- **Expected Output**:
  - Hệ thống chấp nhận upload và không báo lỗi vượt quá số lượng file.
  - Backend gọi middleware `uploadProductImages` và `resizeProductImages` thành công.
  - Ảnh được upload lên Cloudinary, trong DB trường `images` của sản phẩm chứa danh sách URL ảnh.
- **Test data**:
  - 3–5 file ảnh hợp lệ.
- **Result**: Untested

#### PROD-IMG-002 – Upload vượt quá 5 ảnh sản phẩm

- **Description**: Thử upload nhiều hơn 5 ảnh cho một sản phẩm.
- **Steps**:
  1. Mở màn hình thêm mới sản phẩm.
  2. Ở phần chọn ảnh, chọn 6–7 file ảnh cùng lúc.
  3. Điền các thông tin còn lại và bấm "Lưu".
- **Expected Output**:
  - Hệ thống báo lỗi về việc vượt quá số lượng file cho phép.
  - Backend trả về lỗi với message "Vượt quá số lượng file quy định." (do `MulterError` LIMIT_UNEXPECTED_FILE).
  - Sản phẩm không được tạo mới (hoặc không lưu ảnh) khi upload vượt quá.
- **Test data**:
  - 6–7 ảnh.
- **Result**: Untested

#### PROD-IMG-003 – Upload ảnh bị lỗi (file hỏng hoặc không đúng định dạng)

- **Description**: Một trong các file tải lên bị hỏng hoặc không phải ảnh.
- **Steps**:
  1. Mở màn hình thêm mới sản phẩm.
  2. Chọn 1–2 ảnh hợp lệ và 1 file không phải ảnh (vd: file .txt).
  3. Bấm "Lưu" để gửi form.
- **Expected Output**:
  - Hệ thống báo lỗi upload thất bại.
  - Backend trả lỗi với message "Upload thất bại." từ middleware.
- **Test data**:
  - 1–2 ảnh hợp lệ + 1 file sai định dạng.
- **Result**: Untested

#### PROD-IMG-004 – Kết hợp ảnh upload mới và ảnh từ URL có sẵn

- **Description**: Vừa upload ảnh mới, vừa giữ lại/đưa thêm ảnh từ URL cũ của sản phẩm.
- **Steps**:
  1. Mở màn hình chỉnh sửa một sản phẩm đã có sẵn ảnh.
  2. Tại form, chọn thêm 1–2 ảnh mới từ máy.
  3. Đảm bảo trường URL ảnh cũ (`urlImages`) được gửi từ client (danh sách các URL đang dùng) dạng JSON.
  4. Bấm "Lưu".
- **Expected Output**:
  - Backend parse được `urlImages` từ body, không báo lỗi JSON.
  - Trường `images` trong DB chứa cả ảnh cũ và ảnh mới.
  - Không mất ảnh cũ nếu vẫn giữ trong `urlImages`.
- **Test data**:
  - `urlImages`: JSON array các URL ảnh cũ.
- **Result**: Untested

#### PROD-IMG-005 – Xoá toàn bộ ảnh sản phẩm trên cloud khi chỉnh sửa có ảnh mới

- **Description**: Chỉnh sửa sản phẩm theo kiểu "Edit" và thay toàn bộ ảnh mới, hệ thống cần xoá ảnh cũ trên Cloudinary.
- **Steps**:
  1. Chọn một sản phẩm trong hệ thống đã có nhiều ảnh.
  2. Mở màn hình chỉnh sửa sản phẩm.
  3. Chọn lại bộ ảnh mới để thay thế (upload ảnh mới).
  4. Gửi form lưu thay đổi.
- **Expected Output**:
  - Middleware `deleteImageCloud` được gọi khi `action = "Edit"` và có `req.files.images`.
  - Các ảnh cũ trên Cloudinary được xoá bằng `cloudinary.uploader.destroy` theo từng URL.
  - Trường `images` trong DB của sản phẩm cập nhật sang danh sách ảnh mới.
- **Test data**:
  - action: Edit
  - id sản phẩm có sẵn ảnh.
- **Result**: Untested

---

### Function B – aliasTopProducts (Top sản phẩm)

#### PROD-TOP-001 – Lấy top 5 sản phẩm được cấu hình sẵn

- **Description**: Gọi API top sản phẩm để lấy danh sách sản phẩm hot.
- **Steps**:
  1. Từ giao diện admin hoặc client, gọi endpoint dành cho top sản phẩm (vd: `/api/v1/products/top-5` tuỳ theo định nghĩa routes).
  2. Không truyền thêm query, để middleware `aliasTopProducts` tự set query.
- **Expected Output**:
  - Request sau khi đi qua middleware sẽ có `limit = 5`, `sort = "-ratingsAverage,price"`, `fields = "name,price,priceDiscount,ratingsAverage,title"`.
  - Response trả về tối đa 5 sản phẩm với các field đã cấu hình.
- **Test data**:
  - N/A (sử dụng dữ liệu sản phẩm sẵn có trong DB).
- **Result**: Untested

---

### Function C – CRUD Product (getAll, getOne, create, update, delete, getTableProduct)

#### PROD-CRUD-001 – Tạo mới sản phẩm hợp lệ

- **Description**: Admin tạo mới một sản phẩm với đầy đủ thông tin hợp lệ.
- **Steps**:
  1. Đăng nhập bằng tài khoản có quyền quản lý sản phẩm.
  2. Mở màn hình "Thêm sản phẩm".
  3. Nhập các thông tin: tên sản phẩm, giá, số lượng tồn kho, mô tả cơ bản.
  4. (Tuỳ chọn) Upload một vài ảnh sản phẩm.
  5. Bấm "Lưu" / "Tạo".
- **Expected Output**:
  - Backend gọi `createProduct` (factory.createOne) lưu sản phẩm mới.
  - HTTP status 201, trả về đối tượng sản phẩm vừa tạo.
  - Sản phẩm hiển thị trong danh sách sản phẩm.
- **Test data**:
  - name: "Sản phẩm A"
  - price: giá hợp lệ (>0)
  - inventory: số lượng hợp lệ
- **Result**: Untested

#### PROD-CRUD-002 – Thiếu trường bắt buộc khi tạo sản phẩm

- **Description**: Tạo sản phẩm nhưng thiếu các trường bắt buộc (vd: không nhập tên).
- **Steps**:
  1. Mở màn hình thêm sản phẩm.
  2. Chỉ nhập giá, để trống tên sản phẩm.
  3. Bấm "Lưu".
- **Expected Output**:
  - Hệ thống báo lỗi validate (tên sản phẩm là bắt buộc).
  - Backend trả về lỗi 400 với thông tin lỗi từ Mongoose validator.
  - Không tạo sản phẩm mới trong DB.
- **Test data**:
  - name: (trống)
  - price: một số hợp lệ
- **Result**: Untested

#### PROD-CRUD-003 – Xem danh sách tất cả sản phẩm

- **Description**: Lấy danh sách sản phẩm với API getAll.
- **Steps**:
  1. Truy cập màn hình danh sách sản phẩm.
  2. Hệ thống gọi API `GET /products` (hoặc tương ứng) sử dụng `getAllProducts`.
- **Expected Output**:
  - Trả về HTTP 200 với mảng các sản phẩm.
  - Có hỗ trợ phân trang, lọc, sort (theo logic chung của `factory.getAll` nếu có).
- **Test data**:
  - N/A
- **Result**: Untested

#### PROD-CRUD-004 – Xem chi tiết 1 sản phẩm

- **Description**: Người dùng xem trang chi tiết sản phẩm.
- **Steps**:
  1. Tại danh sách sản phẩm, click vào một sản phẩm bất kỳ.
  2. Giao diện gọi API `GET /products/:id` với id tương ứng.
- **Expected Output**:
  - Backend dùng `getProduct` (factory.getOne) trả về chi tiết sản phẩm, kèm theo populate `reviews` nếu có.
  - HTTP status 200, dữ liệu đúng với sản phẩm đã chọn.
- **Test data**:
  - id: id một sản phẩm tồn tại trong DB.
- **Result**: Untested

#### PROD-CRUD-005 – Cập nhật thông tin sản phẩm

- **Description**: Admin chỉnh sửa thông tin một sản phẩm.
- **Steps**:
  1. Mở màn hình chi tiết sản phẩm.
  2. Bấm nút "Sửa".
  3. Thay đổi một số thông tin, ví dụ cập nhật giá hoặc tồn kho.
  4. Bấm "Lưu".
- **Expected Output**:
  - Backend dùng `updateProduct` (factory.updateOne) cập nhật sản phẩm.
  - HTTP status 200, trả về dữ liệu sản phẩm đã được cập nhật.
- **Test data**:
  - id sản phẩm tồn tại.
  - price mới, inventory mới.
- **Result**: Untested

#### PROD-CRUD-006 – Xoá sản phẩm

- **Description**: Admin xoá một sản phẩm khỏi hệ thống.
- **Steps**:
  1. Tại danh sách sản phẩm, chọn một sản phẩm.
  2. Bấm nút "Xoá" và xác nhận.
- **Expected Output**:
  - Backend gọi `deleteProduct` (factory.deleteOne) xoá sản phẩm khỏi DB.
  - HTTP status 204 hoặc 200 (tuỳ implement), không còn thấy sản phẩm trong danh sách.
- **Test data**:
  - id sản phẩm cần xoá.
- **Result**: Untested

#### PROD-CRUD-007 – Lấy dữ liệu dạng table cho Product (getTableProduct)

- **Description**: Lấy danh sách sản phẩm dạng bảng (có thể phục vụ DataTable trong admin).
- **Steps**:
  1. Từ màn hình danh sách sản phẩm dạng bảng, gọi API tương ứng với `getTableProduct`.
  2. Có thể truyền thêm filter/sort nếu hệ thống hỗ trợ.
- **Expected Output**:
  - Trả về HTTP 200 với cấu trúc dữ liệu phù hợp cho hiển thị bảng (bao gồm tổng số dòng, dữ liệu từng dòng...).
- **Test data**:
  - Tuỳ tham số filter/sort.
- **Result**: Untested

