# DANH SÁCH TOÀN BỘ CÁC CHỨC NĂNG CỦA WEB

## 1. QUẢN LÝ XÁC THỰC VÀ NGƯỜI DÙNG (Authentication & User Management)

### 1.1. Đăng ký và Xác thực
- **POST** `/api/v1/users/signup` - Đăng ký tài khoản người dùng mới
- **POST** `/api/v1/users/signup-admin` - Đăng ký tài khoản admin
- **POST** `/api/v1/users/login` - Đăng nhập bằng email và mật khẩu
- **POST** `/api/v1/users/googleLogin` - Đăng nhập bằng Google (chỉ admin)
- **POST** `/api/v1/users/userLoginWith` - Đăng nhập bằng Google/Firebase (user)
- **GET** `/api/v1/users/logout` - Đăng xuất
- **POST** `/api/v1/users/verify` - Xác thực tài khoản bằng mã token

### 1.2. Quên mật khẩu và Đặt lại mật khẩu
- **POST** `/api/v1/users/forgotPassword` - Gửi mã reset mật khẩu qua email
- **POST** `/api/v1/users/verifyResetPass` - Xác thực mã reset mật khẩu
- **PATCH** `/api/v1/users/resetPassword/:token` - Đặt lại mật khẩu mới
- **PATCH** `/api/v1/users/updateMyPassword` - Cập nhật mật khẩu (yêu cầu đăng nhập)

### 1.3. Quản lý thông tin cá nhân
- **GET** `/api/v1/users/me` - Lấy thông tin người dùng hiện tại
- **PATCH** `/api/v1/users/updateMe` - Cập nhật thông tin cá nhân (name, avatar, gender, dateOfBirth, phone)
- **DELETE** `/api/v1/users/deleteMe` - Xóa tài khoản (chuyển trạng thái sang "ban")

### 1.4. Quản lý địa chỉ giao hàng
- **GET** `/api/v1/users/me/address` - Lấy danh sách địa chỉ của người dùng
- **PATCH** `/api/v1/users/createAddress` - Thêm địa chỉ mới
- **PATCH** `/api/v1/users/updateAddress` - Cập nhật địa chỉ
- **PATCH** `/api/v1/users/deleteAddress` - Xóa địa chỉ
- **PATCH** `/api/v1/users/setDefaultAddress` - Đặt địa chỉ mặc định

### 1.5. Quản lý người dùng (Admin/Employee)
- **GET** `/api/v1/users/getTableUser` - Lấy dữ liệu bảng người dùng (admin)
- **GET** `/api/v1/users` - Lấy danh sách tất cả người dùng (admin)
- **POST** `/api/v1/users` - Tạo người dùng mới (admin)
- **GET** `/api/v1/users/:id` - Lấy thông tin người dùng theo ID (admin)
- **PATCH** `/api/v1/users/:id` - Cập nhật thông tin người dùng (admin)
- **DELETE** `/api/v1/users/:id` - Xóa người dùng (admin)
- **PATCH** `/api/v1/users/changeState` - Thay đổi trạng thái người dùng (active/ban/verify)

---

## 2. QUẢN LÝ SẢN PHẨM (Product Management)

### 2.1. Xem sản phẩm
- **GET** `/api/v1/products` - Lấy danh sách sản phẩm (có filter, sort, pagination)
- **GET** `/api/v1/products/top-5-cheap` - Lấy top 5 sản phẩm rẻ nhất
- **GET** `/api/v1/products/:id` - Lấy chi tiết sản phẩm theo ID
- **GET** `/api/v1/products/getTableProduct` - Lấy dữ liệu bảng sản phẩm (admin)

### 2.2. Quản lý sản phẩm (Admin/Employee)
- **POST** `/api/v1/products` - Tạo sản phẩm mới (admin/employee)
  - Upload hình ảnh (tối đa 5 ảnh)
  - Hỗ trợ upload từ file hoặc URL
- **PATCH** `/api/v1/products/:id` - Cập nhật sản phẩm (admin/employee)
  - Upload/cập nhật hình ảnh
  - Xóa hình ảnh cũ trên Cloudinary
- **DELETE** `/api/v1/products/:id` - Xóa sản phẩm (admin/employee)
  - Xóa hình ảnh trên Cloudinary

---

## 3. QUẢN LÝ ĐƠN HÀNG (Order Management)

### 3.1. Tạo và xem đơn hàng
- **POST** `/api/v1/orders` - Tạo đơn hàng mới (user)
- **GET** `/api/v1/orders` - Lấy danh sách đơn hàng (user xem của mình, admin xem tất cả)
- **GET** `/api/v1/orders/:id` - Lấy chi tiết đơn hàng (chỉ owner hoặc admin)
- **GET** `/api/v1/orders/getTableOrder` - Lấy dữ liệu bảng đơn hàng (admin)

### 3.2. Cập nhật đơn hàng
- **PATCH** `/api/v1/orders/:id` - Cập nhật đơn hàng
  - User: chỉ có thể hủy đơn hàng (status = "Cancelled") khi chưa được xử lý
  - Admin/Employee: có thể cập nhật trạng thái đơn hàng
  - Gửi email thông báo khi cập nhật trạng thái
  - Khi hủy đơn hàng, tự động hoàn lại số lượng tồn kho

### 3.3. Thống kê đơn hàng (Admin)
- **GET** `/api/v1/orders/count` - Đếm số lượng đơn hàng theo trạng thái
- **POST** `/api/v1/orders/countOption` - Đếm đơn hàng theo trạng thái với tùy chọn (year/month/week/date)
- **POST** `/api/v1/orders/countStatusInRange` - Đếm đơn hàng theo trạng thái trong khoảng thời gian
- **GET** `/api/v1/orders/sum` - Tính tổng doanh thu theo tháng
- **POST** `/api/v1/orders/sumOption` - Tính doanh thu với tùy chọn (year/month/week/date)
- **POST** `/api/v1/orders/sumInRange` - Tính doanh thu trong khoảng thời gian
- **POST** `/api/v1/orders/topProduct` - Lấy top 5 sản phẩm bán chạy nhất
- **POST** `/api/v1/orders/topProductInRange` - Lấy top 5 sản phẩm bán chạy trong khoảng thời gian

---

## 4. QUẢN LÝ ĐÁNH GIÁ (Review Management)

### 4.1. Xem và tạo đánh giá
- **GET** `/api/v1/products/:productId/reviews` - Lấy danh sách đánh giá của sản phẩm
- **POST** `/api/v1/products/:productId/reviews` - Tạo đánh giá mới (user)
- **GET** `/api/v1/reviews/getTableReview` - Lấy dữ liệu bảng đánh giá (admin)

### 4.2. Cập nhật và xóa đánh giá
- **GET** `/api/v1/reviews/:id` - Lấy chi tiết đánh giá
- **PATCH** `/api/v1/reviews/:id` - Cập nhật đánh giá (chỉ owner hoặc admin/employee)
- **DELETE** `/api/v1/reviews/:id` - Xóa đánh giá (chỉ owner hoặc admin/employee)

---

## 5. QUẢN LÝ BÌNH LUẬN (Comment Management)

### 5.1. Xem và tạo bình luận
- **GET** `/api/v1/products/:productId/comments` - Lấy danh sách bình luận của sản phẩm
- **POST** `/api/v1/products/:productId/comments` - Tạo bình luận mới (user/employee/admin)
- **GET** `/api/v1/comments/getTableComment` - Lấy dữ liệu bảng bình luận (admin)

### 5.2. Cập nhật và xóa bình luận
- **GET** `/api/v1/comments/:id` - Lấy chi tiết bình luận
- **PATCH** `/api/v1/comments/:id` - Cập nhật bình luận (chỉ owner hoặc admin/employee)
- **DELETE** `/api/v1/comments/:id` - Xóa bình luận (chỉ owner hoặc admin/employee)
- **PATCH** `/api/v1/comments/setLike/:id` - Like/Unlike bình luận (user/employee/admin)

---

## 6. QUẢN LÝ DANH MỤC (Category Management)

### 6.1. Xem danh mục
- **GET** `/api/v1/categories` - Lấy danh sách tất cả danh mục
- **GET** `/api/v1/categories/:id` - Lấy chi tiết danh mục
- **GET** `/api/v1/categories/getTableCategory` - Lấy dữ liệu bảng danh mục (admin)

### 6.2. Quản lý danh mục (Admin/Employee)
- **POST** `/api/v1/categories` - Tạo danh mục mới (admin/employee)
- **PATCH** `/api/v1/categories/:id` - Cập nhật danh mục (admin/employee)
- **DELETE** `/api/v1/categories/:id` - Xóa danh mục (admin/employee)

---

## 7. QUẢN LÝ THƯƠNG HIỆU (Brand Management)

### 7.1. Xem thương hiệu
- **GET** `/api/v1/brands` - Lấy danh sách tất cả thương hiệu
- **GET** `/api/v1/brands/:id` - Lấy chi tiết thương hiệu
- **GET** `/api/v1/brands/getTableBrand` - Lấy dữ liệu bảng thương hiệu (admin)

### 7.2. Quản lý thương hiệu (Admin/Employee)
- **POST** `/api/v1/brands` - Tạo thương hiệu mới (admin/employee)
- **PATCH** `/api/v1/brands/:id` - Cập nhật thương hiệu (admin/employee)
- **DELETE** `/api/v1/brands/:id` - Xóa thương hiệu (admin/employee)

---

## 8. QUẢN LÝ NHẬP HÀNG (Import Management)

### 8.1. Xem nhập hàng
- **GET** `/api/v1/imports` - Lấy danh sách phiếu nhập hàng (admin/employee)
- **GET** `/api/v1/imports/:id` - Lấy chi tiết phiếu nhập hàng (admin/employee)
- **GET** `/api/v1/imports/getTableImport` - Lấy dữ liệu bảng nhập hàng (admin)

### 8.2. Quản lý nhập hàng (Admin/Employee)
- **POST** `/api/v1/imports` - Tạo phiếu nhập hàng mới (admin/employee)
- **PATCH** `/api/v1/imports/:id` - Cập nhật phiếu nhập hàng (admin/employee)
- **DELETE** `/api/v1/imports/:id` - Xóa phiếu nhập hàng (admin/employee)

### 8.3. Thống kê nhập hàng (Admin)
- **GET** `/api/v1/imports/sum` - Tính tổng chi phí nhập hàng theo tháng
- **POST** `/api/v1/imports/sumOption` - Tính chi phí nhập hàng với tùy chọn (year/month/week/date)
- **POST** `/api/v1/imports/sumInRange` - Tính chi phí nhập hàng trong khoảng thời gian

---

## 9. QUẢN LÝ ĐỊA ĐIỂM KHO (Location Management)

### 9.1. Xem địa điểm kho
- **GET** `/api/v1/locations` - Lấy danh sách tất cả địa điểm kho
- **GET** `/api/v1/locations/:id` - Lấy chi tiết địa điểm kho
- **GET** `/api/v1/locations/get-nearest-location` - Tìm kho gần nhất dựa trên tọa độ (latitude, longitude)
- **GET** `/api/v1/locations/get-table-locations` - Lấy dữ liệu bảng địa điểm kho (admin)

### 9.2. Quản lý địa điểm kho (Admin/Employee)
- **POST** `/api/v1/locations` - Tạo địa điểm kho mới (admin/employee)
- **PATCH** `/api/v1/locations/:id` - Cập nhật địa điểm kho (admin/employee)
- **DELETE** `/api/v1/locations/:id` - Xóa địa điểm kho (admin/employee)

---

## 10. QUẢN LÝ THANH TOÁN (Payment/Transaction Management)

### 10.1. Thanh toán VNPay
- **POST** `/api/v1/payments/create_payment_url` - Tạo URL thanh toán VNPay
- **POST** `/api/v1/payments/return_payment_status` - Xử lý callback từ VNPay sau thanh toán

### 10.2. Thanh toán PayPal
- **POST** `/api/v1/payments/return_paypal_status` - Xử lý callback từ PayPal sau thanh toán

### 10.3. Xem lịch sử thanh toán
- **GET** `/api/v1/payments/get-all-payments` - Lấy danh sách giao dịch thanh toán
  - User: chỉ xem được giao dịch của mình
  - Admin: xem được tất cả giao dịch

---

## 11. TRANG QUẢN TRỊ (Admin Dashboard Views)

### 11.1. Các trang view (EJS)
- **GET** `/` - Trang Dashboard chính
- **GET** `/login` - Trang đăng nhập admin
- **GET** `/signup` - Trang đăng ký admin
- **GET** `/analytics` - Trang phân tích thống kê
- **GET** `/users` - Trang quản lý người dùng
- **GET** `/products` - Trang quản lý sản phẩm
- **GET** `/orders` - Trang quản lý đơn hàng
- **GET** `/orders/:id` - Trang chi tiết đơn hàng
- **GET** `/imports` - Trang quản lý nhập hàng
- **GET** `/imports/:id` - Trang chi tiết phiếu nhập hàng
- **GET** `/brands` - Trang quản lý thương hiệu
- **GET** `/categories` - Trang quản lý danh mục
- **GET** `/reviews` - Trang quản lý đánh giá
- **GET** `/locations` - Trang quản lý kho

---

## 12. CHỨC NĂNG FRONT-END (React)

### 12.1. Trang công khai
- **GET** `/` - Trang chủ (HomePage)
- **GET** `/product` - Trang danh sách sản phẩm với filter (ProductFilterPage)
- **GET** `/:slug/:id` - Trang chi tiết sản phẩm (ProductDetail)
- **GET** `/cart` - Trang giỏ hàng (CartPage)
- **GET** `/checkout` - Trang thanh toán (PaymentPage)
- **GET** `/payment-cash` - Trang thanh toán tiền mặt (PaymentCash)
- **GET** `/payment-bank` - Trang thanh toán qua ngân hàng (PaymentBank)

### 12.2. Xác thực
- **GET** `/sign-in` - Trang đăng nhập (SignInPage)
- **GET** `/sign-up` - Trang đăng ký (SignUpPage)
- **GET** `/verify` - Trang xác thực tài khoản (VerifyPage)
- **GET** `/forgot-password` - Trang quên mật khẩu (ForgotPasswordPage)
- **GET** `/reset-password/:token` - Trang đặt lại mật khẩu (ResetPasswordPage)

### 12.3. Trang người dùng (yêu cầu đăng nhập)
- **GET** `/account` - Trang tài khoản cá nhân (UserAccount)
- **GET** `/account/orders` - Trang đơn hàng của tôi (UserOrder)
- **GET** `/account/orders/:id` - Trang chi tiết đơn hàng (InformationDetailOrder)
- **GET** `/account/address` - Trang quản lý địa chỉ (UserAddress)
- **GET** `/account/reset-password` - Trang đổi mật khẩu (UpdatePassword)
- **GET** `/account/chat` - Trang chat (ChatStream)

---

## 13. CÁC CHỨC NĂNG BỔ SUNG

### 13.1. Tính năng tìm kiếm và lọc
- Tìm kiếm sản phẩm theo tên
- Lọc sản phẩm theo:
  - Danh mục (Category)
  - Thương hiệu (Brand)
  - Khoảng giá
  - Đánh giá
  - Sắp xếp theo: giá, đánh giá, ngày tạo

### 13.2. Tính năng giỏ hàng (Front-end)
- Thêm sản phẩm vào giỏ hàng
- Cập nhật số lượng sản phẩm
- Xóa sản phẩm khỏi giỏ hàng
- Tính tổng tiền giỏ hàng

### 13.3. Tính năng phân quyền
- **User**: Xem sản phẩm, đặt hàng, quản lý tài khoản, đánh giá, bình luận
- **Employee**: Tất cả quyền của User + Quản lý sản phẩm, danh mục, thương hiệu, nhập hàng, kho
- **Admin**: Tất cả quyền của Employee + Quản lý người dùng, xem thống kê, quản lý đơn hàng

### 13.4. Tính năng bảo mật
- JWT Authentication
- Password hashing (bcrypt)
- Rate limiting (1000 requests/hour)
- XSS protection
- NoSQL injection protection
- CORS configuration

### 13.5. Tính năng upload file
- Upload hình ảnh sản phẩm (tối đa 5 ảnh)
- Hỗ trợ upload từ file hoặc URL
- Tự động resize và upload lên Cloudinary
- Xóa hình ảnh cũ khi cập nhật/xóa sản phẩm

### 13.6. Tính năng email
- Gửi email xác thực tài khoản
- Gửi email reset mật khẩu
- Gửi email thông báo cập nhật trạng thái đơn hàng

---

## 14. DANH SÁCH API ENDPOINTS TÓM TẮT

### Authentication & User
- `POST /api/v1/users/signup`
- `POST /api/v1/users/signup-admin`
- `POST /api/v1/users/login`
- `POST /api/v1/users/googleLogin`
- `POST /api/v1/users/userLoginWith`
- `GET /api/v1/users/logout`
- `POST /api/v1/users/verify`
- `POST /api/v1/users/forgotPassword`
- `POST /api/v1/users/verifyResetPass`
- `PATCH /api/v1/users/resetPassword/:token`
- `PATCH /api/v1/users/updateMyPassword`
- `GET /api/v1/users/me`
- `PATCH /api/v1/users/updateMe`
- `DELETE /api/v1/users/deleteMe`
- `GET /api/v1/users/me/address`
- `PATCH /api/v1/users/createAddress`
- `PATCH /api/v1/users/updateAddress`
- `PATCH /api/v1/users/deleteAddress`
- `PATCH /api/v1/users/setDefaultAddress`
- `GET /api/v1/users/getTableUser` (admin)
- `GET /api/v1/users` (admin)
- `POST /api/v1/users` (admin)
- `GET /api/v1/users/:id` (admin)
- `PATCH /api/v1/users/:id` (admin)
- `DELETE /api/v1/users/:id` (admin)
- `PATCH /api/v1/users/changeState` (admin)

### Products
- `GET /api/v1/products`
- `GET /api/v1/products/top-5-cheap`
- `GET /api/v1/products/:id`
- `GET /api/v1/products/getTableProduct` (admin)
- `POST /api/v1/products` (admin/employee)
- `PATCH /api/v1/products/:id` (admin/employee)
- `DELETE /api/v1/products/:id` (admin/employee)

### Orders
- `POST /api/v1/orders` (user)
- `GET /api/v1/orders`
- `GET /api/v1/orders/:id`
- `PATCH /api/v1/orders/:id`
- `GET /api/v1/orders/getTableOrder` (admin)
- `GET /api/v1/orders/count` (admin)
- `POST /api/v1/orders/countOption` (admin)
- `POST /api/v1/orders/countStatusInRange` (admin)
- `GET /api/v1/orders/sum` (admin)
- `POST /api/v1/orders/sumOption` (admin)
- `POST /api/v1/orders/sumInRange` (admin)
- `POST /api/v1/orders/topProduct` (admin)
- `POST /api/v1/orders/topProductInRange` (admin)

### Reviews
- `GET /api/v1/products/:productId/reviews`
- `POST /api/v1/products/:productId/reviews` (user)
- `GET /api/v1/reviews/:id`
- `PATCH /api/v1/reviews/:id` (owner/admin/employee)
- `DELETE /api/v1/reviews/:id` (owner/admin/employee)
- `GET /api/v1/reviews/getTableReview` (admin)

### Comments
- `GET /api/v1/products/:productId/comments`
- `POST /api/v1/products/:productId/comments` (user/employee/admin)
- `GET /api/v1/comments/:id`
- `PATCH /api/v1/comments/:id` (owner/admin/employee)
- `DELETE /api/v1/comments/:id` (owner/admin/employee)
- `PATCH /api/v1/comments/setLike/:id` (user/employee/admin)
- `GET /api/v1/comments/getTableComment` (admin)

### Categories
- `GET /api/v1/categories`
- `GET /api/v1/categories/:id`
- `GET /api/v1/categories/getTableCategory` (admin)
- `POST /api/v1/categories` (admin/employee)
- `PATCH /api/v1/categories/:id` (admin/employee)
- `DELETE /api/v1/categories/:id` (admin/employee)

### Brands
- `GET /api/v1/brands`
- `GET /api/v1/brands/:id`
- `GET /api/v1/brands/getTableBrand` (admin)
- `POST /api/v1/brands` (admin/employee)
- `PATCH /api/v1/brands/:id` (admin/employee)
- `DELETE /api/v1/brands/:id` (admin/employee)

### Imports
- `GET /api/v1/imports` (admin/employee)
- `GET /api/v1/imports/:id` (admin/employee)
- `GET /api/v1/imports/getTableImport` (admin)
- `POST /api/v1/imports` (admin/employee)
- `PATCH /api/v1/imports/:id` (admin/employee)
- `DELETE /api/v1/imports/:id` (admin/employee)
- `GET /api/v1/imports/sum` (admin)
- `POST /api/v1/imports/sumOption` (admin)
- `POST /api/v1/imports/sumInRange` (admin)

### Locations
- `GET /api/v1/locations`
- `GET /api/v1/locations/:id`
- `GET /api/v1/locations/get-nearest-location`
- `GET /api/v1/locations/get-table-locations` (admin)
- `POST /api/v1/locations` (admin/employee)
- `PATCH /api/v1/locations/:id` (admin/employee)
- `DELETE /api/v1/locations/:id` (admin/employee)

### Payments/Transactions
- `POST /api/v1/payments/create_payment_url`
- `POST /api/v1/payments/return_payment_status`
- `POST /api/v1/payments/return_paypal_status`
- `GET /api/v1/payments/get-all-payments`

---

## GHI CHÚ CHO UNIT TEST

### Các test case cần kiểm tra:

1. **Authentication Tests**
   - Đăng ký thành công/thất bại
   - Đăng nhập thành công/thất bại
   - Xác thực token
   - Quên mật khẩu và reset
   - Đổi mật khẩu

2. **Authorization Tests**
   - Kiểm tra quyền truy cập theo role (user/employee/admin)
   - Kiểm tra middleware protect
   - Kiểm tra middleware restrictTo

3. **CRUD Tests**
   - Tạo, đọc, cập nhật, xóa cho tất cả các entity
   - Validation tests
   - Error handling tests

4. **Business Logic Tests**
   - Logic đặt hàng (kiểm tra tồn kho)
   - Logic cập nhật trạng thái đơn hàng
   - Logic tính toán doanh thu
   - Logic tìm kho gần nhất

5. **Integration Tests**
   - Upload file
   - Gửi email
   - Thanh toán VNPay/PayPal
   - Tích hợp Cloudinary

6. **Edge Cases**
   - Dữ liệu không hợp lệ
   - Dữ liệu null/undefined
   - Giới hạn số lượng
   - Timeout scenarios

