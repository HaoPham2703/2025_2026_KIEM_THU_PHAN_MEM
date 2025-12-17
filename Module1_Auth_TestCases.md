## Module1 – Authentication & Authorization

**Module1**: Đăng ký, đăng nhập, xác thực tài khoản, quên/đặt lại mật khẩu, bảo vệ route, phân quyền, thay đổi trạng thái user.

**Test requirement**: Kiểm thử đầy đủ các luồng nghiệp vụ liên quan đến authentication & authorization của hệ thống.

**Tester**: (Điền tên bạn)

---

### Function A – Signup (Đăng ký người dùng)

#### AUTH-SIGNUP-001 – Đăng ký user mới với dữ liệu hợp lệ

- **ID**: AUTH-SIGNUP-001
- **Description**: Đăng ký tài khoản user mới với thông tin hợp lệ.
- **Steps**:
  1. Mở màn hình đăng ký tài khoản.
  2. Nhập họ tên là "Test User".
  3. Nhập email là "test@example.com" (chưa từng đăng ký trước đó).
  4. Nhập mật khẩu là "password123".
  5. Nhập lại mật khẩu xác nhận là "password123".
  6. Bấm nút "Đăng ký".
- **Expected Output**:
  - Hệ thống hiển thị thông báo đăng ký thành công.
  - User được tự động đăng nhập (nhận token / cookie `jwt`).
  - Trong dữ liệu trả về có trường `status = "success"`, có `token`.
  - Trong `data.user` có `name = "Test User"`, `email = "test@example.com"`, `active = "active"`.
  - Trong database tồn tại user với email trên, mật khẩu được lưu ở dạng mã hoá (không phải plaintext).
- **Test data**:
  - name: Test User
  - email: test@example.com
  - password: password123
  - passwordConfirm: password123
- **Result**: Untested
- **Note**: Dựa theo `authController.signup`.

#### AUTH-SIGNUP-002 – Đăng ký với email đã tồn tại

- **ID**: AUTH-SIGNUP-002
- **Description**: Đăng ký tài khoản mới với email đã được sử dụng.
- **Steps**:
  1. Đảm bảo trong hệ thống đã có 1 tài khoản với email "existing@example.com".
  2. Mở màn hình đăng ký tài khoản.
  3. Nhập họ tên bất kỳ (vd: "New User").
  4. Nhập email là "existing@example.com".
  5. Nhập mật khẩu và xác nhận mật khẩu hợp lệ, giống nhau.
  6. Bấm nút "Đăng ký".
- **Expected Output**:
  - Hệ thống báo lỗi email đã được đăng ký.
  - Không tạo thêm user mới trong database với email này.
  - Trong backend, lỗi có message "Email này đã được đăng ký." và statusCode = 500.
- **Test data**:
  - email: existing@example.com
- **Result**: Untested
- **Note**: Negative test.

#### AUTH-SIGNUP-003 – Password được hash trước khi lưu

- **ID**: AUTH-SIGNUP-003
- **Description**: Kiểm tra mật khẩu user không được lưu dưới dạng plaintext trong database.
- **Steps**:
  1. Thực hiện đăng ký user mới giống test AUTH-SIGNUP-001 với email khác (vd: "test2@example.com").
  2. Sau khi đăng ký thành công, dùng công cụ quản trị DB hoặc API nội bộ để xem chi tiết bản ghi user vừa tạo.
  3. Kiểm tra giá trị trường `password` trong database.
- **Expected Output**:
  - Trường `password` trong DB không trùng với chuỗi "password123" gõ vào.
  - Độ dài mật khẩu dạng mã hoá khoảng 60 ký tự (bcrypt).
- **Test data**:
  - email: test2@example.com
  - password: password123
- **Result**: Untested
- **Note**: Kiểm tra ở mức DB.

---

### Function B – SignupAdmin (Đăng ký admin)

#### AUTH-ADMIN-001 – Đăng ký admin mới với dữ liệu hợp lệ

- **ID**: AUTH-ADMIN-001
- **Description**: Đăng ký tài khoản admin mới với thông tin hợp lệ.
- **Steps**:
  1. Mở màn hình hoặc gửi request API dùng để đăng ký admin (ví dụ `/signupAdmin`).
  2. Nhập họ tên "Admin User".
  3. Nhập email "admin@example.com" (chưa tồn tại).
  4. Nhập mật khẩu và xác nhận mật khẩu hợp lệ.
  5. Bấm nút "Đăng ký" (hoặc gửi request).
- **Expected Output**:
  - Hệ thống thông báo đăng ký admin thành công.
  - HTTP status 201, `status = "success"`.
  - Message trả về: "Đăng ký admin thành công!".
  - Trong `data.user`, role của user là `admin`, `active = "active"`.
- **Test data**:
  - email: admin@example.com
  - role mong muốn: admin
- **Result**: Untested

#### AUTH-ADMIN-002 – Đăng ký admin với email đã tồn tại

- **ID**: AUTH-ADMIN-002
- **Description**: Đăng ký admin mới với email đã tồn tại.
- **Steps**:
  1. Đảm bảo trong DB đã tồn tại admin với email "admin2@example.com".
  2. Mở màn hình / gửi request đăng ký admin.
  3. Nhập email "admin2@example.com" cùng mật khẩu hợp lệ.
  4. Bấm nút "Đăng ký".
- **Expected Output**:
  - Hệ thống báo lỗi email đã được đăng ký.
  - Trong backend: message "Email này đã được đăng ký.", statusCode = 500.
  - Không tạo thêm admin mới với email này.
- **Test data**:
  - email: admin2@example.com
- **Result**: Untested

---

### Function C – Login (Đăng nhập)

#### AUTH-LOGIN-001 – Đăng nhập với email và mật khẩu đúng

- **ID**: AUTH-LOGIN-001
- **Description**: User đăng nhập với thông tin hợp lệ.
- **Steps**:
  1. Đảm bảo trong hệ thống đã có user với email "login@example.com" và mật khẩu "password123", trạng thái `active`.
  2. Mở màn hình đăng nhập.
  3. Nhập email "login@example.com".
  4. Nhập mật khẩu "password123".
  5. Bấm nút "Đăng nhập".
- **Expected Output**:
  - Hệ thống cho phép đăng nhập, chuyển sang màn hình sau đăng nhập (dashboard...).
  - Backend trả về HTTP 200, `status = "success"`, có `token`.
  - Thông tin user trả về có `email = "login@example.com"`.
  - Cookie `jwt` được set.
- **Test data**:
  - email: login@example.com
  - password: password123
- **Result**: Untested

#### AUTH-LOGIN-002 – Thiếu mật khẩu khi đăng nhập

- **ID**: AUTH-LOGIN-002
- **Description**: Người dùng cố gắng đăng nhập nhưng không nhập mật khẩu.
- **Steps**:
  1. Mở màn hình đăng nhập.
  2. Nhập email "login@example.com".
  3. Để trống ô mật khẩu.
  4. Bấm nút "Đăng nhập".
- **Expected Output**:
  - Hệ thống hiển thị thông báo yêu cầu nhập cả email và mật khẩu.
  - Backend trả lỗi với message "Vui lòng cung cấp email và mật khẩu!", statusCode = 400.
- **Test data**:
  - email: login@example.com
  - password: (trống)
- **Result**: Untested

#### AUTH-LOGIN-003 – Đăng nhập với email không tồn tại

- **ID**: AUTH-LOGIN-003
- **Description**: Đăng nhập với email chưa từng đăng ký.
- **Steps**:
  1. Mở màn hình đăng nhập.
  2. Nhập email "nonexistent@example.com".
  3. Nhập mật khẩu bất kỳ (vd: "password123").
  4. Bấm nút "Đăng nhập".
- **Expected Output**:
  - Hệ thống thông báo sai email hoặc mật khẩu.
  - Backend trả lỗi message "Email hoặc mật khẩu không chính xác", statusCode = 401.
- **Test data**:
  - email: nonexistent@example.com
  - password: password123
- **Result**: Untested

#### AUTH-LOGIN-004 – Đăng nhập với mật khẩu sai

- **ID**: AUTH-LOGIN-004
- **Description**: Đăng nhập với mật khẩu không đúng.
- **Steps**:
  1. Mở màn hình đăng nhập.
  2. Nhập email "login@example.com" (đã tồn tại).
  3. Nhập mật khẩu sai, ví dụ "wrongpassword".
  4. Bấm "Đăng nhập".
- **Expected Output**:
  - Hệ thống báo lỗi đăng nhập thất bại, email hoặc mật khẩu không chính xác.
  - Backend: message "Email hoặc mật khẩu không chính xác", statusCode = 401.
- **Test data**:
  - email: login@example.com
  - password: wrongpassword
- **Result**: Untested

#### AUTH-LOGIN-005 – User ở trạng thái `verify` sẽ được active khi đăng nhập lần đầu

- **ID**: AUTH-LOGIN-005
- **Description**: User có trạng thái chờ xác thực (`verify`) sẽ được đổi sang `active` sau khi đăng nhập thành công.
- **Steps**:
  1. Đảm bảo có user với email "verify@example.com", mật khẩu hợp lệ, `active = "verify"`.
  2. Mở màn hình đăng nhập.
  3. Nhập email "verify@example.com" và mật khẩu đúng.
  4. Bấm "Đăng nhập".
  5. Sau khi đăng nhập, kiểm tra lại trạng thái user trong DB.
- **Expected Output**:
  - Đăng nhập thành công (HTTP 201 theo test).
  - Trạng thái `active` của user trong DB chuyển thành "active".
- **Test data**:
  - email: verify@example.com
  - password: password123
- **Result**: Untested

---

### Function D – VerifyUser (Xác thực tài khoản bằng mã)

#### AUTH-VERIFY-001 – Xác thực user với mã hợp lệ

- **ID**: AUTH-VERIFY-001
- **Description**: Người dùng nhập mã xác thực đúng để kích hoạt tài khoản.
- **Steps**:
  1. Đăng ký tài khoản và nhận được mã xác thực (giả lập bằng cách sinh mã và lưu vào DB).
  2. Mở màn hình nhập mã xác thực tài khoản.
  3. Nhập đúng mã xác thực đã gửi (ví dụ từ email/SMS).
  4. Bấm nút "Xác nhận".
- **Expected Output**:
  - Hệ thống thông báo xác thực tài khoản thành công.
  - HTTP status 200, response `status = "success"`.
  - Trong DB, user đổi `active` thành `active`, trường `userVerifyToken` được xoá.
- **Test data**:
  - encode: mã xác thực hợp lệ (chưa hash)
- **Result**: Untested

#### AUTH-VERIFY-002 – Xác thực với mã không hợp lệ

- **ID**: AUTH-VERIFY-002
- **Description**: Người dùng nhập sai mã xác thực.
- **Steps**:
  1. Mở màn hình nhập mã xác thực.
  2. Nhập một mã bất kỳ không trùng với mã hệ thống đã gửi (vd: "invalidtoken").
  3. Bấm "Xác nhận".
- **Expected Output**:
  - Hệ thống báo mã xác nhận không hợp lệ hoặc đã hết hạn.
  - Backend: message "Mã xác nhận không hợp lệ hoặc đã hết hạn", statusCode = 400.
- **Test data**:
  - encode: invalidtoken
- **Result**: Untested

---

### Function E – ForgotPassword (Quên mật khẩu)

#### AUTH-FORGOT-001 – Gửi email reset mật khẩu với email tồn tại

- **ID**: AUTH-FORGOT-001
- **Description**: Người dùng quên mật khẩu và yêu cầu gửi link/mã reset về email đã đăng ký.
- **Steps**:
  1. Mở màn hình "Quên mật khẩu".
  2. Nhập email "forgot@example.com" đã dùng để đăng ký trước đó.
  3. Bấm nút "Gửi" hoặc "Reset mật khẩu".
- **Expected Output**:
  - Hệ thống hiển thị thông báo đã gửi email khôi phục mật khẩu.
  - Backend: HTTP 200, `status = "success"`, `message = "Token sent to email!"`.
  - Trong DB, user có `passwordResetToken` và `passwordResetExpires` được set.
- **Test data**:
  - email: forgot@example.com
- **Result**: Untested

#### AUTH-FORGOT-002 – Quên mật khẩu với email không tồn tại

- **ID**: AUTH-FORGOT-002
- **Description**: Người dùng nhập email không tồn tại khi yêu cầu quên mật khẩu.
- **Steps**:
  1. Mở màn hình "Quên mật khẩu".
  2. Nhập email "nonexistent@example.com".
  3. Bấm nút gửi yêu cầu.
- **Expected Output**:
  - Hệ thống báo không tìm thấy tài khoản tương ứng.
  - Backend: message "Tài khoản này không tồn tại. Vui lòng đăng ký để sử dụng", statusCode = 404.
- **Test data**:
  - email: nonexistent@example.com
- **Result**: Untested

---

### Function F – VerifyResetPass (Xác thực token reset mật khẩu)

#### AUTH-VRESET-001 – Token reset mật khẩu hợp lệ

- **ID**: AUTH-VRESET-001
- **Description**: Người dùng truy cập link hoặc nhập mã reset mật khẩu còn hạn và hợp lệ.
- **Steps**:
  1. Thực hiện luồng quên mật khẩu để hệ thống sinh token reset cho user (hoặc mock sẵn trong DB).
  2. Từ email, người dùng click vào link hoặc nhập mã reset đúng lên màn hình xác thực reset mật khẩu.
  3. Gửi request xác thực token (ví dụ `/verifyResetPass`) với token hợp lệ.
- **Expected Output**:
  - Hệ thống xác nhận token hợp lệ, cho phép chuyển sang bước nhập mật khẩu mới.
  - Backend: HTTP 200, `status = "success"`, trả về `hashedToken` dùng cho bước tiếp theo.
- **Test data**:
  - token: mã reset hợp lệ
- **Result**: Untested

#### AUTH-VRESET-002 – Token reset mật khẩu không hợp lệ hoặc đã hết hạn

- **ID**: AUTH-VRESET-002
- **Description**: Người dùng sử dụng token reset sai hoặc đã hết hạn.
- **Steps**:
  1. Mở màn hình xác thực reset mật khẩu.
  2. Nhập một token không khớp với token trong hệ thống (vd: "invalidtoken") hoặc token đã hết hạn.
  3. Bấm nút xác nhận.
- **Expected Output**:
  - Hệ thống báo token không hợp lệ hoặc đã hết hạn.
  - Backend: message "Token không hợp lệ hoặc đã hết hạn", statusCode = 400.
- **Test data**:
  - token: invalidtoken
- **Result**: Untested

---

### Function G – ResetPassword (Đặt lại mật khẩu)

#### AUTH-RESET-001 – Đặt lại mật khẩu với token hợp lệ

- **ID**: AUTH-RESET-001
- **Description**: Người dùng nhập mật khẩu mới sau khi xác thực token hợp lệ.
- **Steps**:
  1. Người dùng truy cập link đặt lại mật khẩu từ email (link có chứa token hợp lệ).
  2. Màn hình hiển thị form nhập mật khẩu mới.
  3. Nhập mật khẩu mới "newpassword123".
  4. Nhập lại mật khẩu xác nhận "newpassword123".
  5. Bấm nút "Đổi mật khẩu".
  6. Sau khi đổi xong, thử đăng nhập lại bằng mật khẩu mới.
- **Expected Output**:
  - Hệ thống thông báo đặt lại mật khẩu thành công.
  - Backend: HTTP 200, trả về `status = "success"`.
  - Trong DB, các trường `passwordResetToken` và `passwordResetExpires` bị xoá.
  - Đăng nhập bằng mật khẩu mới thành công, mật khẩu cũ không dùng được nữa.
- **Test data**:
  - token: token hợp lệ tương ứng với user
  - password: newpassword123
  - passwordConfirm: newpassword123
- **Result**: Untested

#### AUTH-RESET-002 – Đặt lại mật khẩu với token không hợp lệ

- **ID**: AUTH-RESET-002
- **Description**: Người dùng truy cập link đặt lại mật khẩu với token sai hoặc đã hết hạn.
- **Steps**:
  1. Mở trang đặt lại mật khẩu bằng một link có token không hợp lệ (vd: bị sửa tay, hết hạn...).
  2. Nhập mật khẩu mới và xác nhận như bình thường.
  3. Bấm nút "Đổi mật khẩu".
- **Expected Output**:
  - Hệ thống hiển thị lỗi, không đổi được mật khẩu.
  - Backend: message chứa nội dung "không hợp lệ hoặc đã hết hạn", statusCode = 400.
- **Test data**:
  - token: invalidtoken
  - password: newpassword123
  - passwordConfirm: newpassword123
- **Result**: Untested

---

### Function H – UpdatePassword (Cập nhật mật khẩu khi đang đăng nhập)

#### AUTH-UPDPASS-001 – Cập nhật mật khẩu với mật khẩu hiện tại đúng

- **ID**: AUTH-UPDPASS-001
- **Description**: User đã đăng nhập đổi mật khẩu bằng cách nhập đúng mật khẩu hiện tại.
- **Steps**:
  1. Đăng nhập vào hệ thống bằng tài khoản hợp lệ (vd: email "updatepass@example.com", mật khẩu "oldpassword").
  2. Vào trang "Đổi mật khẩu" trong tài khoản cá nhân.
  3. Nhập mật khẩu hiện tại là "oldpassword".
  4. Nhập mật khẩu mới "newpassword123".
  5. Nhập lại mật khẩu mới "newpassword123".
  6. Bấm nút "Lưu" hoặc "Đổi mật khẩu".
  7. Đăng xuất và thử đăng nhập lại bằng mật khẩu mới.
- **Expected Output**:
  - Hệ thống thông báo đổi mật khẩu thành công.
  - Backend: HTTP 200, trả về `status = "success"`.
  - Trong DB, mật khẩu được cập nhật sang giá trị mới.
  - Đăng nhập bằng mật khẩu mới thành công, mật khẩu cũ không còn dùng được.
- **Test data**:
  - passwordCurrent: oldpassword
  - password: newpassword123
  - passwordConfirm: newpassword123
- **Result**: Untested

#### AUTH-UPDPASS-002 – Cập nhật mật khẩu với mật khẩu hiện tại sai

- **ID**: AUTH-UPDPASS-002
- **Description**: User nhập sai mật khẩu hiện tại khi đổi mật khẩu.
- **Steps**:
  1. Đăng nhập vào hệ thống.
  2. Vào trang "Đổi mật khẩu".
  3. Nhập mật khẩu hiện tại sai (vd: "wrongpassword").
  4. Nhập mật khẩu mới và xác nhận mật khẩu mới đúng định dạng.
  5. Bấm "Lưu".
- **Expected Output**:
  - Hệ thống báo mật khẩu hiện tại không chính xác, không đổi mật khẩu.
  - Backend: message "Mật khẩu hiện tại chưa chính xác.", statusCode = 401.
- **Test data**:
  - passwordCurrent: wrongpassword
  - password: newpassword123
  - passwordConfirm: newpassword123
- **Result**: Untested

---

### Function I – Logout (Đăng xuất)

#### AUTH-LOGOUT-001 – Đăng xuất thành công

- **ID**: AUTH-LOGOUT-001
- **Description**: Người dùng đăng xuất khỏi hệ thống.
- **Steps**:
  1. Đăng nhập vào hệ thống.
  2. Trên giao diện, bấm nút "Đăng xuất".
- **Expected Output**:
  - Hệ thống đưa người dùng về màn hình đăng nhập hoặc trang public.
  - Cookie `jwt` trên trình duyệt được đặt lại thành giá trị `loggedout` với `httpOnly = true`, thời gian hết hạn rất gần.
  - Backend trả về HTTP 200 với `{ status: "success" }`.
- **Test data**:
  - N/A
- **Result**: Untested

---

### Function J – Protect (Middleware bảo vệ route)

#### AUTH-PROTECT-001 – Cho phép truy cập với token hợp lệ trong header

- **ID**: AUTH-PROTECT-001
- **Description**: Truy cập vào API bảo vệ bằng JWT với token hợp lệ đặt trong header.
- **Steps**:
  1. Đăng nhập và lấy token JWT hợp lệ.
  2. Gửi request tới một API yêu cầu đăng nhập (vd: `/api/v1/users/me`) và set header `Authorization: Bearer <token>`.
  3. Quan sát phản hồi.
- **Expected Output**:
  - Hệ thống cho phép truy cập, trả về dữ liệu tương ứng.
  - Trong middleware, `req.user` được gán thông tin user, `next()` được gọi bình thường.
- **Test data**:
  - Header Authorization: Bearer <valid_token>
- **Result**: Untested

#### AUTH-PROTECT-002 – Cho phép truy cập với token hợp lệ trong cookie

- **ID**: AUTH-PROTECT-002
- **Description**: Truy cập API bảo vệ khi token được lưu trong cookie.
- **Steps**:
  1. Đăng nhập qua giao diện để trình duyệt được set cookie `jwt`.
  2. Từ cùng trình duyệt đó, truy cập API hoặc trang yêu cầu đăng nhập.
- **Expected Output**:
  - Hệ thống cho phép truy cập.
  - Middleware đọc token từ cookie, gán `req.user` và cho đi tiếp.
- **Test data**:
  - Cookie jwt: <valid_token>
- **Result**: Untested

#### AUTH-PROTECT-003 – Không có token → từ chối truy cập

- **ID**: AUTH-PROTECT-003
- **Description**: Người dùng truy cập API yêu cầu đăng nhập nhưng không có token.
- **Steps**:
  1. Mở trình duyệt ở chế độ ẩn danh hoặc xoá cookie.
  2. Gửi request tới API cần đăng nhập (vd: `/api/v1/users/me`) mà không có header Authorization, không có cookie jwt.
- **Expected Output**:
  - Hệ thống báo lỗi yêu cầu đăng nhập.
  - Backend: message "Bạn chưa đăng nhập hoặc đăng ký. Vui lòng thực hiện!!!", statusCode = 401.
- **Test data**:
  - Không gửi token
- **Result**: Untested

#### AUTH-PROTECT-004 – Token hợp lệ nhưng user không còn tồn tại

- **ID**: AUTH-PROTECT-004
- **Description**: Token chứa ID user không còn trong hệ thống (user bị xoá).
- **Steps**:
  1. Tạo 1 user, generate token JWT cho user đó.
  2. Xoá user đó khỏi DB.
  3. Dùng token cũ để gọi API bảo vệ.
- **Expected Output**:
  - Hệ thống báo lỗi không tìm thấy user tương ứng với token.
  - Backend: message "Token người dùng không còn tồn tại.", statusCode = 401.
- **Test data**:
  - Token có id user đã bị xoá
- **Result**: Untested

#### AUTH-PROTECT-005 – User đổi mật khẩu sau khi tạo token

- **ID**: AUTH-PROTECT-005
- **Description**: User đã đổi mật khẩu sau khi token được tạo nên token cũ không còn hợp lệ.
- **Steps**:
  1. Đăng nhập để lấy token JWT.
  2. Đổi mật khẩu user bằng chức năng đổi mật khẩu.
  3. Dùng lại token cũ để truy cập API bảo vệ.
- **Expected Output**:
  - Hệ thống yêu cầu đăng nhập lại.
  - Backend: message "Tài khoản gần đây đã thay đổi mật khẩu! Xin vui lòng đăng nhập lại.", statusCode = 401.
- **Test data**:
  - Token cũ, password đã đổi
- **Result**: Untested

---

### Function K – RestrictTo (Phân quyền theo role)

#### AUTH-ROLE-001 – User có role `admin` được phép truy cập

- **ID**: AUTH-ROLE-001
- **Description**: Chỉ admin mới được phép truy cập một số chức năng.
- **Steps**:
  1. Đăng nhập bằng tài khoản có role `admin`.
  2. Truy cập vào một màn hình hoặc API chỉ dành cho admin (vd: quản lý user).
- **Expected Output**:
  - Hệ thống cho phép truy cập bình thường.
  - Middleware `restrictTo('admin', 'employee')` cho phép đi tiếp, không trả lỗi.
- **Test data**:
  - role: admin
- **Result**: Untested

#### AUTH-ROLE-002 – User role `user` bị từ chối truy cập

- **ID**: AUTH-ROLE-002
- **Description**: User thường (role `user`) truy cập vào chức năng chỉ cho admin.
- **Steps**:
  1. Đăng nhập bằng tài khoản role `user`.
  2. Thử truy cập vào trang/API chỉ dành cho admin.
- **Expected Output**:
  - Hệ thống hiển thị thông báo không có quyền.
  - Backend: message "Bạn không có quyền thực hiện", statusCode = 403.
- **Test data**:
  - role: user
- **Result**: Untested

#### AUTH-ROLE-003 – Không có thông tin user vẫn bị từ chối truy cập

- **ID**: AUTH-ROLE-003
- **Description**: Trường hợp middleware phân quyền được gọi nhưng không có `req.user` (chưa đăng nhập).
- **Steps**:
  1. Truy cập trực tiếp vào API chỉ dành cho admin mà không đăng nhập.
- **Expected Output**:
  - Hệ thống báo không có quyền truy cập.
  - Backend: message "Bạn không có quyền thực hiện", statusCode = 403.
- **Test data**:
  - Không có user đăng nhập
- **Result**: Untested

---

### Function L – ChangeStateUser (Thay đổi trạng thái user)

#### AUTH-STATE-001 – Thay đổi trạng thái user thành `ban` với token hợp lệ

- **ID**: AUTH-STATE-001
- **Description**: User đăng nhập hợp lệ và thay đổi trạng thái tài khoản (ví dụ tự khóa/bị khoá).
- **Steps**:
  1. Đăng nhập để có token (hoặc cookie `jwt`) hợp lệ.
  2. Gửi yêu cầu tới chức năng thay đổi trạng thái user (vd: `/changeStateUser`) kèm theo trạng thái mới, ví dụ `ban`.
  3. Có thể thực hiện qua màn hình quản trị hoặc API.
- **Expected Output**:
  - Backend trả về HTTP 200, `status = "success"`.
  - Trong DB, trường `active` của user chuyển thành `ban`.
- **Test data**:
  - Cookie jwt: token hợp lệ của user
  - state: ban
- **Result**: Untested

#### AUTH-STATE-002 – Token không hợp lệ khi đổi trạng thái user

- **ID**: AUTH-STATE-002
- **Description**: Thử thay đổi trạng thái user nhưng token không hợp lệ.
- **Steps**:
  1. Gửi request tới API đổi trạng thái user với cookie `jwt` là một chuỗi sai (vd: "invalidtoken").
  2. Truyền `state = "ban"` trong body.
- **Expected Output**:
  - Hệ thống báo lỗi xác thực, không thay đổi trạng thái user trong DB.
  - Backend gọi `next()` với lỗi (token không decode được hoặc không tìm thấy user).
- **Test data**:
  - Cookie jwt: invalidtoken
  - state: ban
- **Result**: Untested

