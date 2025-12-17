## Module3 – Order Management (Quản lý đơn hàng & Thống kê)

**Test requirement**: Kiểm thử các chức năng tạo, xem, cập nhật trạng thái đơn hàng, kiểm tra quyền, và các API thống kê/báo cáo doanh thu.

**Tester**: (Điền tên bạn)

---

### Function A – checkStatusOrder (Kiểm tra quyền và trạng thái trước khi đổi trạng thái đơn hàng)

#### ORDER-STATUS-001 – User thường chỉ được huỷ đơn khi đơn chưa xử lý

- **Description**: User role `user` được phép huỷ đơn (status `Cancelled`) khi đơn đang ở trạng thái chưa xử lý.
- **Steps**:
  1. Đăng nhập bằng tài khoản role `user`.
  2. Vào màn hình "Đơn hàng của tôi".
  3. Chọn một đơn hàng còn ở trạng thái cho phép huỷ (ví dụ: `Pending` hoặc tương đương, `req.order.status != "Processed"`).
  4. Bấm nút "Huỷ đơn".
- **Expected Output**:
  - Middleware `checkStatusOrder` cho phép đi tiếp (không trả lỗi 403).
  - Hệ thống cập nhật trạng thái đơn sang `Cancelled` thành công.
- **Test data**:
  - user role: user
  - order.status hiện tại: Pending (hoặc chưa Processed)
  - body.status gửi lên: Cancelled
- **Result**: Untested

#### ORDER-STATUS-002 – User thường không được đổi sang trạng thái khác ngoài Cancelled

- **Description**: User role `user` không được phép đổi trạng thái đơn sang các trạng thái khác (Processed/Success/...).
- **Steps**:
  1. Đăng nhập bằng tài khoản role `user`.
  2. Vào màn hình chi tiết đơn hàng.
  3. Thử thực hiện thao tác thay đổi trạng thái đơn sang `Processed` hoặc bất kỳ trạng thái nào khác không phải `Cancelled` (nế u giao diện có bug cho phép thao tác này).
- **Expected Output**:
  - Middleware `checkStatusOrder` chặn lại và trả về lỗi 403 với message "Bạn không có quyền thực hiện.".
- **Test data**:
  - user role: user
  - body.status: một trạng thái khác `Cancelled`
- **Result**: Untested

#### ORDER-STATUS-003 – Không được thay đổi đơn đã Cancelled hoặc Success

- **Description**: Không cho phép sửa trạng thái đơn nếu đơn đã ở trạng thái `Cancelled` hoặc `Success`.
- **Steps**:
  1. Đăng nhập với tài khoản (user hoặc admin).
  2. Vào chi tiết một đơn hàng đã `Cancelled` hoặc `Success`.
  3. Thử đổi trạng thái đơn sang bất kỳ trạng thái khác.
- **Expected Output**:
  - Middleware trả lỗi 403 với message dạng "Đơn hàng nãy đã Cancelled" hoặc "Đơn hàng nãy đã Success".
  - Trạng thái đơn trong DB không thay đổi.
- **Test data**:
  - order.status ban đầu: Cancelled hoặc Success
  - body.status mới: bất kỳ
- **Result**: Untested

---

### Function B – CRUD Order (createOrder, getOrder, getAllOrders, updateOrder, deleteOrder, getTableOrder)

#### ORDER-CRUD-001 – Tạo đơn hàng mới hợp lệ

- **Description**: Người dùng tạo đơn hàng mới với giỏ hàng hợp lệ.
- **Steps**:
  1. Đăng nhập bằng tài khoản user.
  2. Thêm một số sản phẩm vào giỏ hàng.
  3. Tới bước thanh toán, nhập đầy đủ địa chỉ giao hàng và thông tin cần thiết.
  4. Bấm nút "Đặt hàng".
- **Expected Output**:
  - Backend gọi `createOrder` (factory.createOne) tạo bản ghi đơn hàng trong DB.
  - HTTP status 201 và trả về thông tin đơn hàng chứa danh sách sản phẩm, tổng tiền, trạng thái ban đầu (vd: Pending/Processing).
- **Test data**:
  - cart: danh sách sản phẩm hợp lệ
  - totalPrice: > 0
- **Result**: Untested

#### ORDER-CRUD-002 – Xem danh sách đơn hàng (admin)

- **Description**: Admin xem danh sách tất cả đơn hàng.
- **Steps**:
  1. Đăng nhập bằng tài khoản admin.
  2. Vào màn hình quản lý đơn hàng.
  3. Giao diện gọi API `GET /orders` dùng `getAllOrders`.
- **Expected Output**:
  - Hệ thống hiển thị danh sách đơn hàng kèm phân trang/lọc nếu có.
  - HTTP status 200 với mảng dữ liệu đơn hàng.
- **Test data**:
  - N/A
- **Result**: Untested

#### ORDER-CRUD-003 – Xem chi tiết 1 đơn hàng

- **Description**: Xem chi tiết nội dung một đơn.
- **Steps**:
  1. Tại danh sách đơn hàng (user hoặc admin), chọn 1 đơn hàng.
  2. Giao diện gọi API `GET /orders/:id` dùng `getOrder`.
- **Expected Output**:
  - HTTP status 200, trả về đầy đủ thông tin đơn (cart, địa chỉ, trạng thái, tổng tiền...).
- **Test data**:
  - id: id đơn hàng tồn tại.
- **Result**: Untested

#### ORDER-CRUD-004 – Cập nhật trạng thái đơn hàng sang Cancelled và hoàn lại tồn kho

- **Description**: Khi đơn bị huỷ, hệ thống cộng lại số lượng tồn kho cho từng sản phẩm trong giỏ.
- **Steps**:
  1. Đảm bảo có một đơn hàng ở trạng thái có thể huỷ (chưa Success/Cancelled) với giỏ có ít nhất 1 sản phẩm.
  2. Đăng nhập (user được phép huỷ đúng điều kiện hoặc admin).
  3. Trên giao diện chi tiết đơn, chọn trạng thái "Huỷ đơn" và lưu.
  4. Sau khi cập nhật, kiểm tra tồn kho trong DB của từng sản phẩm trong giỏ.
- **Expected Output**:
  - Middleware `checkStatusOrder` cho phép (nếu đúng role/điều kiện).
  - Trong `updateOrder`, khi status = "Cancelled" sẽ loop qua `cart` và tăng `inventory` của từng sản phẩm tương ứng.
  - HTTP 200 với đơn đã được cập nhật trạng thái `Cancelled`.
- **Test data**:
  - body.status: Cancelled
  - order với cart gồm các product và quantity.
- **Result**: Untested

#### ORDER-CRUD-005 – Gửi email khi cập nhật trạng thái đơn hàng

- **Description**: Mỗi khi cập nhật trạng thái đơn (vd: từ Pending sang Processed/Success/Cancelled), hệ thống gửi email thông báo cho khách.
- **Steps**:
  1. Có sẵn 1 đơn hàng với email user hợp lệ.
  2. Đăng nhập admin, vào chi tiết đơn hàng.
  3. Đổi trạng thái đơn từ trạng thái hiện tại sang một trạng thái khác (vd: từ Pending sang Processed/Success).
  4. Lưu thay đổi.
  5. Kiểm tra email của khách hoặc log gửi mail trong hệ thống.
- **Expected Output**:
  - `updateOrder` sau khi lưu đơn sẽ gọi `mailTemplate` và `sendEmail` gửi email tới `doc.user.email` với subject "Cập nhật trạng thái đơn hàng".
  - Dù gửi mail có lỗi thì vẫn trả về response 200 với đơn đã được cập nhật (nhờ khối `finally`).
- **Test data**:
  - Một đơn hàng với thông tin user.email hợp lệ.
- **Result**: Untested

#### ORDER-CRUD-006 – Xoá đơn hàng

- **Description**: Admin xoá một đơn hàng khỏi hệ thống.
- **Steps**:
  1. Đăng nhập admin.
  2. Vào danh sách đơn hàng.
  3. Chọn một đơn cụ thể và bấm "Xoá".
- **Expected Output**:
  - Backend dùng `deleteOrder` (factory.deleteOne) xoá đơn khỏi DB.
  - HTTP 204/200, đơn không còn xuất hiện trong danh sách.
- **Test data**:
  - id: đơn cần xoá.
- **Result**: Untested

#### ORDER-CRUD-007 – Lấy dữ liệu đơn hàng dạng table (getTableOrder)

- **Description**: Lấy danh sách đơn hàng ở dạng bảng cho màn quản trị.
- **Steps**:
  1. Truy cập màn hình quản lý đơn ở dạng bảng.
  2. Giao diện gọi API tương ứng với `getTableOrder`.
- **Expected Output**:
  - HTTP 200, cấu trúc dữ liệu phù hợp cho DataTable (bao gồm số dòng, dữ liệu từng dòng...).
- **Test data**:
  - Tuỳ filter/sort.
- **Result**: Untested

---

### Function C – isOwner & setUser (Kiểm tra chủ sở hữu đơn, tự set user)

#### ORDER-OWNER-001 – Tự gán user cho đơn hàng khi tạo mới

- **Description**: Khi user đã đăng nhập tạo đơn hàng, hệ thống tự gán user hiện tại vào đơn.
- **Steps**:
  1. Đăng nhập bằng tài khoản user.
  2. Tạo đơn hàng mới từ giao diện.
- **Expected Output**:
  - Middleware `setUser` kiểm tra `req.body.user`, nếu chưa có thì gán bằng `req.user`.
  - Bản ghi đơn hàng trong DB có trường user đúng với tài khoản đang đăng nhập.
- **Test data**:
  - User đăng nhập sẵn.
- **Result**: Untested

#### ORDER-OWNER-002 – Chỉ chủ đơn hoặc admin mới xem/sửa được đơn (tuỳ cấu hình routes)

- **Description**: Middleware `isOwner` kiểm tra quyền sở hữu đơn.
- **Steps**:
  1. Đăng nhập bằng user A, tạo một đơn hàng.
  2. Đăng nhập user B (không phải admin).
  3. Dùng user B truy cập/chỉnh sửa đơn hàng của user A.
- **Expected Output**:
  - `isOwner` (factory.checkPermission) chặn user B nếu không phải chủ đơn hoặc không có role thích hợp.
  - Trả về lỗi 403 (tuỳ implement trong handlerFactory).
- **Test data**:
  - user A, user B,
  - order.user = user A.
- **Result**: Untested

---

### Function D – Thống kê số lượng đơn theo trạng thái (countStatus, countStatusOption, countStatusInRange)

#### ORDER-STAT-001 – Đếm số đơn theo từng trạng thái (countStatus)

- **Description**: Lấy thống kê số lượng đơn cho từng trạng thái (Pending, Success, Cancelled,...).
- **Steps**:
  1. Đăng nhập admin.
  2. Từ màn hình dashboard, gọi API thống kê trạng thái (sử dụng `countStatus`).
- **Expected Output**:
  - API trả về HTTP 200 với mảng các bản ghi dạng `{ _id: <status>, count: <số lượng> }`.
- **Test data**:
  - Nhiều đơn với các trạng thái khác nhau.
- **Result**: Untested

#### ORDER-STAT-002 – Đếm số đơn theo trạng thái và theo năm/tháng/tuần/ngày (countStatusOption)

- **Description**: Lấy thống kê số lượng đơn chia theo thời gian và trạng thái.
- **Steps**:
  1. Ở dashboard admin, chọn filter (năm/tháng/tuần/ngày) mong muốn.
  2. Gửi request tới API tương ứng với `countStatusOption`, body chứa các cờ `year`, `month`, `week`, `date` tuỳ trường hợp.
- **Expected Output**:
  - API trả về HTTP 200 với mảng các bản ghi `_id` là object gồm status + các trường thời gian được chọn, kèm `count`.
- **Test data**:
  - body.year = true, hoặc body.month/week/date = true tuỳ test.
- **Result**: Untested

#### ORDER-STAT-003 – Đếm số đơn theo trạng thái trong khoảng ngày (countStatusInRange)

- **Description**: Đếm số đơn theo trạng thái trong một khoảng ngày cụ thể.
- **Steps**:
  1. Trên dashboard, nhập khoảng ngày từ `dateFrom` đến `dateTo`.
  2. Gửi request đến API `countStatusInRange` với các ngày đó trong body.
- **Expected Output**:
  - Backend chuyển `dateFrom/dateTo` sang khoảng thời gian 00:00–23:59 và lọc `createdAt` trong khoảng.
  - Trả về mảng các `_id.status` và `count` tương ứng.
- **Test data**:
  - dateFrom, dateTo: khoảng ngày có dữ liệu đơn.
- **Result**: Untested

---

### Function E – Thống kê doanh thu và top sản phẩm (sumRevenueOption, sumRevenue, topProduct, topProductInRange, sumInRange)

#### ORDER-REV-001 – Tổng doanh thu theo tuỳ chọn năm/tháng/tuần/ngày (sumRevenueOption)

- **Description**: Lấy tổng doanh thu (chỉ tính đơn `Success`) theo các mốc thời gian tuỳ chọn.
- **Steps**:
  1. Vào dashboard thống kê doanh thu.
  2. Chọn filter (ví dụ: theo năm, theo tháng...).
  3. Gửi request đến API `sumRevenueOption` với body chứa các cờ `year`, `month`, `week`, `date`.
- **Expected Output**:
  - API lọc các đơn `status = "Success"` và group theo các trường thời gian tương ứng.
  - Kết quả trả về gồm `_id` chứa các trường thời gian và `total_revenue` là tổng `totalPrice`.
- **Test data**:
  - Một số đơn `Success` với các ngày khác nhau.
- **Result**: Untested

#### ORDER-REV-002 – Tổng doanh thu theo tháng trong năm (sumRevenue)

- **Description**: Lấy tổng doanh thu mỗi tháng trong từng năm.
- **Steps**:
  1. Tại dashboard, gọi API doanh thu tổng theo tháng (sử dụng `sumRevenue`).
- **Expected Output**:
  - API lọc đơn `Success` và group theo năm/tháng từ `createdAt`.
  - Trả về `{ _id: { year, month }, total_revenue_month }`.
- **Test data**:
  - Một loạt đơn `Success` rải rác các tháng.
- **Result**: Untested

#### ORDER-REV-003 – Top sản phẩm bán chạy theo tuỳ chọn thời gian (topProduct)

- **Description**: Lấy top 5 sản phẩm bán chạy nhất trong toàn bộ dữ liệu (hoặc theo filter năm/tháng/tuần/ngày nếu có chọn).
- **Steps**:
  1. Trên dashboard top sản phẩm, chọn phạm vi thời gian (nếu có).
  2. Gửi request đến API `topProduct` với body có thể chứa `year`, `month`, `week`, `date`.
- **Expected Output**:
  - API unwind `cart` trong các đơn `Success`, group theo sản phẩm và tính tổng số lượng.
  - Trả về danh sách tối đa 5 sản phẩm, có `quantity`, `title`, `image`.
- **Test data**:
  - Nhiều đơn `Success` chứa các sản phẩm khác nhau.
- **Result**: Untested

#### ORDER-REV-004 – Đếm đơn theo trạng thái trong khoảng thời gian (countStatusInRange)

- **Description**: Kiểm tra API đếm đơn theo trạng thái trong khoảng ngày hoạt động đúng với edge case ngày bắt đầu/kết thúc.
- **Steps**:
  1. Tạo một số đơn với `createdAt` sát ranh giới ngày (đầu ngày, cuối ngày).
  2. Gửi request `countStatusInRange` với `dateFrom` và `dateTo` chứa đúng các ngày đó.
- **Expected Output**:
  - Chỉ các đơn có `createdAt` từ 00:00 ngày `dateFrom` đến 23:59 ngày `dateTo` (theo UTC) được tính.
- **Test data**:
  - dateFrom, dateTo, bộ đơn test.
- **Result**: Untested

#### ORDER-REV-005 – Top sản phẩm bán chạy trong khoảng ngày (topProductInRange)

- **Description**: Lấy top sản phẩm trong một khoảng ngày cụ thể.
- **Steps**:
  1. Chọn khoảng ngày `dateFrom`, `dateTo` trên dashboard.
  2. Gửi request đến API `topProductInRange` với hai ngày này trong body.
- **Expected Output**:
  - API lọc đơn `Success` có `createdAt` trong khoảng.
  - Unwind `cart` và group theo sản phẩm, sort `quantity` giảm dần, limit 5.
- **Test data**:
  - dateFrom, dateTo.
- **Result**: Untested

#### ORDER-REV-006 – Tổng doanh thu trong khoảng ngày (sumInRange)

- **Description**: Lấy tổng doanh thu từ các đơn `Success` trong một khoảng ngày.
- **Steps**:
  1. Chọn khoảng ngày từ – đến trên giao diện.
  2. Gửi request đến API `sumInRange` với `dateFrom`, `dateTo`.
- **Expected Output**:
  - API lọc đơn `Success` theo khoảng `createdAt`.
  - Group lại (không phân chia theo thời gian) và trả về `total_revenue` là tổng `totalPrice`.
- **Test data**:
  - dateFrom, dateTo.
- **Result**: Untested

