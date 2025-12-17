# TEST CASE

## Thông tin dự án

|                   |                                    |     |                       |            |
| ----------------- | ---------------------------------- | --- | --------------------- | ---------- |
| **Project Name**  | HCShop - Hệ thống bán hàng điện tử |     | **Creator**           | HaoPham    |
| **Project Code**  | HCSHOP_2024                        |     | **Reviewer/Approver** | -          |
| **Document Code** | HCSHOP_TestCase_v1.0               |     | **Issue Date**        | 18/12/2024 |
|                   |                                    |     | **Version**           | 1.0        |

---

## Record of Change

| Effective Date | Version | Change Item     | \*A,D,M | Change Description                          | Reference              |
| -------------- | ------- | --------------- | ------- | ------------------------------------------- | ---------------------- |
| 18/12/2024     | 1.0     | Initial Release | A       | Tạo mới tài liệu Test Case cho dự án HCShop | DANH_SACH_CHUC_NANG.md |
|                |         |                 |         |                                             |                        |
|                |         |                 |         |                                             |                        |
|                |         |                 |         |                                             |                        |
|                |         |                 |         |                                             |                        |

> **Ghi chú \*A,D,M:**
>
> - **A** = Added (Thêm mới)
> - **D** = Deleted (Xóa bỏ)
> - **M** = Modified (Chỉnh sửa)

---

## Test Environment Setup Description

### 1. Server Requirements

- **Back-end Server**: Node.js v18+ với Express.js
- **Port**: 3000 (hoặc cấu hình trong config.env)
- **API Base URL**: `http://localhost:3000/api/v1`

### 2. Database

- **Database**: MongoDB
- **Connection**: MongoDB Atlas hoặc Local MongoDB
- **Collections**: users, products, orders, reviews, comments, brands, categories, imports, locations, transactions

### 3. Web Browser

- Google Chrome (phiên bản mới nhất)
- Firefox (phiên bản mới nhất)
- Microsoft Edge (phiên bản mới nhất)

### 4. Front-end

- **Framework**: React + Vite
- **Port**: 5173 (development)
- **CSS**: Tailwind CSS + SCSS

### 5. Third-party Services

- **Cloudinary**: Upload và quản lý hình ảnh
- **VNPay**: Cổng thanh toán
- **PayPal**: Cổng thanh toán quốc tế
- **Firebase**: Xác thực Google OAuth
- **SMTP Server**: Gửi email (Nodemailer)

### 6. Test Tools

- **Unit Test**: Jest
- **API Test**: Postman / REST Client
- **E2E Test**: (nếu có)

---

## Danh sách các chức năng cần Test

| No  | Function Name                   | Sheet Name          | Description                                            | Pre-Condition                                 |
| --- | ------------------------------- | ------------------- | ------------------------------------------------------ | --------------------------------------------- |
| 1   | Đăng ký tài khoản               | [Module1](#module1) | Đăng ký tài khoản người dùng mới với email và mật khẩu | Hệ thống hoạt động, Database kết nối          |
| 2   | Đăng nhập                       | [Module1](#module1) | Đăng nhập bằng email/password hoặc Google OAuth        | Tài khoản đã được đăng ký và xác thực         |
| 3   | Đăng xuất                       | [Module1](#module1) | Đăng xuất khỏi hệ thống                                | Người dùng đã đăng nhập                       |
| 4   | Xác thực tài khoản              | [Module1](#module1) | Xác thực tài khoản qua mã OTP gửi về email             | Người dùng đã đăng ký, chưa xác thực          |
| 5   | Quên mật khẩu                   | [Module1](#module1) | Gửi mã xác nhận để reset mật khẩu                      | Tài khoản đã tồn tại trong hệ thống           |
| 6   | Đặt lại mật khẩu                | [Module1](#module1) | Đặt mật khẩu mới sau khi xác nhận mã reset             | Đã nhận được mã reset hợp lệ                  |
| 7   | Đổi mật khẩu                    | [Module1](#module1) | Cập nhật mật khẩu khi đã đăng nhập                     | Người dùng đã đăng nhập                       |
| 8   | Xem thông tin cá nhân           | [Module2](#module2) | Lấy thông tin người dùng hiện tại                      | Người dùng đã đăng nhập                       |
| 9   | Cập nhật thông tin cá nhân      | [Module2](#module2) | Cập nhật name, avatar, gender, dateOfBirth, phone      | Người dùng đã đăng nhập                       |
| 10  | Xóa tài khoản                   | [Module2](#module2) | Vô hiệu hóa tài khoản (chuyển trạng thái ban)          | Người dùng đã đăng nhập                       |
| 11  | Thêm địa chỉ giao hàng          | [Module2](#module2) | Thêm địa chỉ mới vào danh sách địa chỉ                 | Người dùng đã đăng nhập                       |
| 12  | Xem danh sách địa chỉ           | [Module2](#module2) | Lấy tất cả địa chỉ của người dùng                      | Người dùng đã đăng nhập                       |
| 13  | Cập nhật địa chỉ                | [Module2](#module2) | Chỉnh sửa thông tin địa chỉ đã có                      | Người dùng đã đăng nhập, có ít nhất 1 địa chỉ |
| 14  | Xóa địa chỉ                     | [Module2](#module2) | Xóa địa chỉ khỏi danh sách                             | Người dùng đã đăng nhập, có ít nhất 1 địa chỉ |
| 15  | Đặt địa chỉ mặc định            | [Module2](#module2) | Đặt một địa chỉ làm địa chỉ giao hàng mặc định         | Người dùng đã đăng nhập, có ít nhất 1 địa chỉ |
| 16  | Quản lý người dùng (Admin)      | [Module2](#module2) | CRUD người dùng, thay đổi trạng thái                   | Đăng nhập với quyền Admin                     |
| 17  | Xem danh sách sản phẩm          | [Module3](#module3) | Lấy danh sách sản phẩm với filter, sort, pagination    | Không yêu cầu đăng nhập                       |
| 18  | Xem chi tiết sản phẩm           | [Module3](#module3) | Lấy thông tin chi tiết của một sản phẩm                | Sản phẩm tồn tại trong database               |
| 19  | Tìm kiếm sản phẩm               | [Module3](#module3) | Tìm kiếm sản phẩm theo tên                             | Không yêu cầu đăng nhập                       |
| 20  | Lọc sản phẩm                    | [Module3](#module3) | Lọc theo category, brand, khoảng giá, rating           | Có dữ liệu sản phẩm trong database            |
| 21  | Thêm sản phẩm (Admin)           | [Module3](#module3) | Tạo sản phẩm mới với hình ảnh                          | Đăng nhập với quyền Admin/Employee            |
| 22  | Cập nhật sản phẩm (Admin)       | [Module3](#module3) | Chỉnh sửa thông tin sản phẩm                           | Đăng nhập với quyền Admin/Employee            |
| 23  | Xóa sản phẩm (Admin)            | [Module3](#module3) | Xóa sản phẩm và hình ảnh liên quan                     | Đăng nhập với quyền Admin/Employee            |
| 24  | Thêm vào giỏ hàng               | [Module4](#module4) | Thêm sản phẩm vào giỏ hàng (Front-end)                 | Không yêu cầu đăng nhập                       |
| 25  | Cập nhật số lượng giỏ hàng      | [Module4](#module4) | Thay đổi số lượng sản phẩm trong giỏ                   | Giỏ hàng có sản phẩm                          |
| 26  | Xóa sản phẩm khỏi giỏ           | [Module4](#module4) | Xóa sản phẩm ra khỏi giỏ hàng                          | Giỏ hàng có sản phẩm                          |
| 27  | Tạo đơn hàng                    | [Module4](#module4) | Đặt hàng từ giỏ hàng                                   | Người dùng đã đăng nhập, giỏ hàng có sản phẩm |
| 28  | Xem danh sách đơn hàng          | [Module4](#module4) | Lấy danh sách đơn hàng của người dùng                  | Người dùng đã đăng nhập                       |
| 29  | Xem chi tiết đơn hàng           | [Module4](#module4) | Lấy thông tin chi tiết đơn hàng                        | Đơn hàng thuộc về người dùng hoặc Admin       |
| 30  | Hủy đơn hàng                    | [Module4](#module4) | Hủy đơn hàng chưa được xử lý                           | Đơn hàng ở trạng thái "Pending"               |
| 31  | Cập nhật trạng thái đơn (Admin) | [Module4](#module4) | Cập nhật trạng thái đơn hàng                           | Đăng nhập với quyền Admin/Employee            |
| 32  | Thống kê đơn hàng (Admin)       | [Module4](#module4) | Xem thống kê doanh thu, đơn hàng                       | Đăng nhập với quyền Admin                     |
| 33  | Thanh toán VNPay                | [Module5](#module5) | Thanh toán qua cổng VNPay                              | Người dùng đã đăng nhập, có đơn hàng          |
| 34  | Thanh toán PayPal               | [Module5](#module5) | Thanh toán qua PayPal                                  | Người dùng đã đăng nhập, có đơn hàng          |
| 35  | Thanh toán COD                  | [Module5](#module5) | Thanh toán khi nhận hàng                               | Người dùng đã đăng nhập, có đơn hàng          |
| 36  | Xem lịch sử thanh toán          | [Module5](#module5) | Lấy danh sách giao dịch thanh toán                     | Người dùng đã đăng nhập                       |
| 37  | Xem đánh giá sản phẩm           | [Module6](#module6) | Lấy danh sách đánh giá của sản phẩm                    | Sản phẩm tồn tại                              |
| 38  | Tạo đánh giá                    | [Module6](#module6) | Đánh giá sản phẩm (1-5 sao)                            | Người dùng đã đăng nhập, đã mua sản phẩm      |
| 39  | Cập nhật đánh giá               | [Module6](#module6) | Chỉnh sửa đánh giá đã tạo                              | Người dùng là owner của đánh giá              |
| 40  | Xóa đánh giá                    | [Module6](#module6) | Xóa đánh giá                                           | Người dùng là owner hoặc Admin                |
| 41  | Xem bình luận sản phẩm          | [Module6](#module6) | Lấy danh sách bình luận của sản phẩm                   | Sản phẩm tồn tại                              |
| 42  | Tạo bình luận                   | [Module6](#module6) | Thêm bình luận cho sản phẩm                            | Người dùng đã đăng nhập                       |
| 43  | Cập nhật bình luận              | [Module6](#module6) | Chỉnh sửa bình luận đã tạo                             | Người dùng là owner của bình luận             |
| 44  | Xóa bình luận                   | [Module6](#module6) | Xóa bình luận                                          | Người dùng là owner hoặc Admin                |
| 45  | Like/Unlike bình luận           | [Module6](#module6) | Thích hoặc bỏ thích bình luận                          | Người dùng đã đăng nhập                       |
| 46  | Xem danh sách thương hiệu       | [Module7](#module7) | Lấy tất cả thương hiệu                                 | Không yêu cầu đăng nhập                       |
| 47  | Thêm thương hiệu (Admin)        | [Module7](#module7) | Tạo thương hiệu mới                                    | Đăng nhập với quyền Admin/Employee            |
| 48  | Cập nhật thương hiệu (Admin)    | [Module7](#module7) | Chỉnh sửa thông tin thương hiệu                        | Đăng nhập với quyền Admin/Employee            |
| 49  | Xóa thương hiệu (Admin)         | [Module7](#module7) | Xóa thương hiệu                                        | Đăng nhập với quyền Admin/Employee            |
| 50  | Xem danh sách danh mục          | [Module7](#module7) | Lấy tất cả danh mục sản phẩm                           | Người dùng đã đăng nhập                       |
| 51  | Thêm danh mục (Admin)           | [Module7](#module7) | Tạo danh mục mới                                       | Đăng nhập với quyền Admin/Employee            |
| 52  | Cập nhật danh mục (Admin)       | [Module7](#module7) | Chỉnh sửa thông tin danh mục                           | Đăng nhập với quyền Admin/Employee            |
| 53  | Xóa danh mục (Admin)            | [Module7](#module7) | Xóa danh mục                                           | Đăng nhập với quyền Admin/Employee            |
| 54  | Xem danh sách phiếu nhập        | [Module8](#module8) | Lấy tất cả phiếu nhập hàng                             | Đăng nhập với quyền Admin/Employee            |
| 55  | Tạo phiếu nhập hàng             | [Module8](#module8) | Tạo phiếu nhập hàng mới                                | Đăng nhập với quyền Admin/Employee            |
| 56  | Cập nhật phiếu nhập             | [Module8](#module8) | Chỉnh sửa phiếu nhập hàng                              | Đăng nhập với quyền Admin/Employee            |
| 57  | Xóa phiếu nhập                  | [Module8](#module8) | Xóa phiếu nhập hàng                                    | Đăng nhập với quyền Admin/Employee            |
| 58  | Thống kê nhập hàng              | [Module8](#module8) | Xem thống kê chi phí nhập hàng                         | Đăng nhập với quyền Admin                     |
| 59  | Xem danh sách kho               | [Module8](#module8) | Lấy tất cả địa điểm kho                                | Người dùng đã đăng nhập                       |
| 60  | Tìm kho gần nhất                | [Module8](#module8) | Tìm kho gần vị trí hiện tại                            | Không yêu cầu đăng nhập                       |
| 61  | Thêm địa điểm kho               | [Module8](#module8) | Tạo địa điểm kho mới                                   | Đăng nhập với quyền Admin/Employee            |
| 62  | Cập nhật địa điểm kho           | [Module8](#module8) | Chỉnh sửa thông tin kho                                | Đăng nhập với quyền Admin/Employee            |
| 63  | Xóa địa điểm kho                | [Module8](#module8) | Xóa địa điểm kho                                       | Đăng nhập với quyền Admin/Employee            |

---

## Mapping Sheet Names

| Sheet Name                  | Module Description                        | Related APIs                                                               |
| --------------------------- | ----------------------------------------- | -------------------------------------------------------------------------- |
| <a id="module1"></a>Module1 | Xác thực và bảo mật (Authentication)      | /api/v1/users/signup, login, logout, verify, forgotPassword, resetPassword |
| <a id="module2"></a>Module2 | Quản lý người dùng (User Management)      | /api/v1/users/me, updateMe, address, CRUD Admin                            |
| <a id="module3"></a>Module3 | Quản lý sản phẩm (Product Management)     | /api/v1/products (GET, POST, PATCH, DELETE)                                |
| <a id="module4"></a>Module4 | Giỏ hàng & Đơn hàng (Cart & Order)        | Redux state, /api/v1/orders                                                |
| <a id="module5"></a>Module5 | Thanh toán (Payment)                      | /api/v1/payments (VNPay, PayPal, COD)                                      |
| <a id="module6"></a>Module6 | Đánh giá & Bình luận (Review & Comment)   | /api/v1/reviews, /api/v1/comments                                          |
| <a id="module7"></a>Module7 | Thương hiệu & Danh mục (Brand & Category) | /api/v1/brands, /api/v1/categories                                         |
| <a id="module8"></a>Module8 | Nhập hàng & Kho (Import & Location)       | /api/v1/imports, /api/v1/locations                                         |

---

## Ghi chú

1. **Roles trong hệ thống:**

   - `user`: Người dùng thông thường
   - `employee`: Nhân viên
   - `admin`: Quản trị viên

2. **Trạng thái đơn hàng:**

   - Pending (Chờ xử lý)
   - Processing (Đang xử lý)
   - Shipping (Đang giao)
   - Delivered (Đã giao)
   - Cancelled (Đã hủy)

3. **Trạng thái người dùng:**

   - active: Hoạt động
   - verify: Chờ xác thực
   - ban: Bị khóa

4. **Priority Test:**
   - High: Chức năng Authentication, Order, Payment
   - Medium: Product, User Management
   - Low: Review, Comment, Brand, Category
