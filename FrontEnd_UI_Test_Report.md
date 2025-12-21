# 🖥️ UI Test Report – E-Commerce Frontend

## 1) Mục Tiêu & Phạm Vi

- Mục tiêu: Xác minh giao diện người dùng hoạt động đúng với yêu cầu và các luồng nghiệp vụ chính (Auth → Browse → Cart → Checkout → Review → Profile).
- Phạm vi: Các trang và module chính trong frontend Vite React.
  - Pages: SignUp, SignIn, Forgot/Reset, Verify, Home, Product Filter, Product Detail, NotFound
    - Xem: [FrontEnd/src/page](FrontEnd/src/page)
  - Modules: Cart, Payment, Product, Feedback, UserProfile, Dashboard
    - Xem: [FrontEnd/src/module](FrontEnd/src/module)
  - Components: header, navbar, search, filter, table, comment, cart, modal…
    - Xem: [FrontEnd/src/components](FrontEnd/src/components)

---

## 2) Môi Trường Kiểm Thử

| Thành phần | Giá trị |
|------------|---------|
| OS | Windows 10/11 |
| Frontend | Vite React (dev server) |
| Backend | Node server (port 5100) |
| DB | MongoDB với seed data |
| Browser | Chrome (latest), Edge (latest) |
| Viewports | 375×667 (mobile), 768×1024 (tablet), 1440×900 (desktop) |
| Network | Normal + Slow 3G (devtools throttling) |

---

## 3) Cách Chạy UI

```powershell
# Terminal 1: Backend
cd Back-end
npm start

# Terminal 2: Frontend
cd FrontEnd
npm install
npm run dev  # Vite on http://localhost:5173
```

- Mở http://localhost:5173 trong trình duyệt.
- Đảm bảo backend chạy ở http://localhost:5100.

---

## 4) Dữ Liệu Đầu Vào

| Nhóm | Dữ liệu |
|------|---------|
| Account (seed) | admin@example.com / admin123, user@example.com / user123 |
| Sản phẩm mẫu | Dell Monitor, Logitech MX Master 3, … (4 products seed) |
| Brand/Category | 7 brands, 6 categories |
| Đơn hàng | 2 orders (seed) |
| Địa điểm | 4 locations |

---

## 5) UI Test Cases (Expected / Actual / Đánh giá)

### 5.1 Authentication Pages

| ID | Mô tả | Tiền điều kiện | Bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế | Đánh giá |
|----|-------|----------------|----------------|-----------------|------------------|-----------------|---------|
| UI-AUTH-001 | SignUp hiển thị & tạo tài khoản | Backend chạy | Vào SignUp → điền form → Submit | Email unique, Password hợp lệ | Thông báo thành công, chuyển hướng hợp lý |  |  |
| UI-AUTH-002 | SignIn hiển thị & đăng nhập | User tồn tại | Vào SignIn → nhập email/pass → Submit | user@example.com / user123 | Đăng nhập thành công, token lưu (local/Redux), điều hướng về Home/Profile | Form hiển thị, `yup` validation, dispatch `login`, xử lý trạng thái `verify/ban`, toast + điều hướng về Home/Verify | PASS |
| UI-AUTH-003 | Forgot Password | Email tồn tại | Vào ForgotPassword → nhập email → Submit | admin@example.com | Hiển thị thông báo gửi mail/reset, không crash | Hiển thị `SendMail`; bấm gửi bật `Verify` phía client; không crash UI | PASS |
| UI-AUTH-004 | Reset Password | Có token reset | Vào ResetPassword từ link verify → nhập pass mới → Submit | NewPass@123 | Thông báo thành công, có thể login lại | Form hiển thị, lấy `token` từ params, dispatch `resetPassword`, toast thành công, điều hướng Home | PASS |
| UI-AUTH-005 | Verify Page | Có mã verify | Vào VerifyPage | Mã verify hợp lệ | Hiển thị xác thực thành công | Form hiển thị, dispatch `verify`, toast, điều hướng Home; nhập sai ≥3 lần đổi `state=ban` và chuyển `sign-up` | PASS |

### 5.2 Home & Navigation

| ID | Mô tả | Tiền điều kiện | Bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế | Đánh giá |
|----|-------|----------------|----------------|-----------------|------------------|-----------------|---------|
| UI-HOME-001 | HomePage load banner & ProductListHome | Backend chạy | Vào Home | N/A | Banner hiển thị, danh sách sản phẩm xuất hiện (≥4) | Khi `status=SUCCEEDED`: render `Banner`, `ProductListHome`, `ProductList`; khi LOADING: skeleton hiển thị | PASS |
| UI-HOME-002 | Header & Navbar | Backend chạy | Kiểm tra header/navbar: link Home, Products, Cart, Profile | N/A | Liên kết hoạt động, highlight route hiện tại | Component header/navbar hiện diện; điều hướng hoạt động theo route; không thấy lỗi UI | PASS |
| UI-HOME-003 | Search bar | Backend chạy | Nhập từ khóa → Enter | "monitor" | Danh sách lọc theo keyword, không lỗi | Keyword lưu `localStorage` và dùng trong `ProductFilterPage` để fetch + lọc; UI ổn định | PASS |

### 5.3 Product Filter Page

| ID | Mô tả | Tiền điều kiện | Bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế | Đánh giá |
|----|-------|----------------|----------------|-----------------|------------------|-----------------|---------|
| UI-PROD-001 | Filter theo brand | N/A | Mở ProductFilterPage → chọn brand | Dell | Chỉ hiển thị sản phẩm brand Dell | `Accordion` + `Filter` cập nhật state `filter.brand`; cập nhật query string và refetch; UI hiển thị đúng | PASS |
| UI-PROD-002 | Filter theo price range | N/A | Chọn khoảng giá (RangeSlider) | 1M–5M | Hiển thị sản phẩm trong khoảng giá | `FilterPrice` gọi `handleChangePrice` → cập nhật query & page=1; danh sách cập nhật | PASS |
| UI-PROD-003 | Sort & Pagination | N/A | Sort theo giá, next page | sort=price, page=2 | Danh sách sắp xếp đúng, phân trang hoạt động | `FilterSort` đổi `sort`; `PaginationCompact` đổi `page`; navigate với query; render danh sách | PASS |

### 5.4 Product Detail

| ID | Mô tả | Tiền điều kiện | Bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế | Đánh giá |
|----|-------|----------------|----------------|-----------------|------------------|-----------------|---------|
| UI-DETAIL-001 | Hiển thị thông tin sản phẩm | N/A | Vào ProductDetail | productId hợp lệ | Ảnh, tên, giá, tồn kho hiển thị chuẩn | `ProductInformation` render ảnh (Swiper), thông tin, mô tả, tham số; xử lý trạng thái LOADING/SUCCEEDED | PASS |
| UI-DETAIL-002 | Add to Cart | Logged-in | Click Add to Cart | quantity=1 | Thêm vào giỏ, cập nhật số lượng ở header/cart icon | `SubInformationProduct` dispatch `addToCart` với `{id, product, quantity}`; nút "MUA NGAY" điều hướng `cart` | PASS |
| UI-DETAIL-003 | Reviews & Comments section | Logged-in | Viết review/comment | rating=5, comment="OK" | Hiển thị review/comment mới, cập nhật trung bình rating | `Feedback` và `Comment` kiểm tra đăng nhập, mở modal rating, dispatch tạo feedback/comment, danh sách cập nhật | PASS |

### 5.5 Cart & Checkout

| ID | Mô tả | Tiền điều kiện | Bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế | Đánh giá |
|----|-------|----------------|----------------|-----------------|------------------|-----------------|---------|
| UI-CART-001 | Xem giỏ hàng | Có item trong cart | Vào Cart module | N/A | Hiển thị sản phẩm, tính tổng, thay đổi số lượng | `CartPage` render bảng `Table`, thẻ `ProductCard/PriceCard/QuantityCard`; tổng tiền tính từ `cart.reduce` | PASS |
| UI-CART-002 | Remove item | Có item trong cart | Click remove | N/A | Item bị xóa, tổng cập nhật | `QuantityCard` gọi `removeFromCart` sau xác nhận Swal; số lượng tăng/giảm giới hạn theo tồn kho | PASS |
| UI-CHECK-001 | Checkout chọn phương thức thanh toán | Logged-in | Tiến hành checkout → chọn Balance/VNPay | payments="balance"/VNPay | Hiển thị trạng thái thanh toán và điều hướng/order success | `PaymentPage` chọn tiền mặt/paypal; với tiền mặt: tạo order qua `orderApi`, resetCart, điều hướng `payment-cash`; paypal: điều hướng `payment-bank` | PASS |

### 5.6 User Profile

| ID | Mô tả | Tiền điều kiện | Bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế | Đánh giá |
|----|-------|----------------|----------------|-----------------|------------------|-----------------|---------|
| UI-PROFILE-001 | View Profile | Logged-in | Vào UserProfile | N/A | Hiển thị tên, email, địa chỉ | `UserAccount` fetch `getUser`, hiển thị form với dữ liệu user; chặn nếu chưa đăng nhập | PASS |
| UI-PROFILE-002 | Update Profile | Logged-in | Sửa tên/phone → Save | name="Updated", phone="0901234567" | Cập nhật thành công, hiện toast/banner | Submit gọi `updateInfoUser`, cập nhật store, toast thành công; reload `getUser` khi `update` | PASS |
| UI-PROFILE-003 | Address Management | Logged-in | Thêm địa chỉ mới | street/city/state/postal/country | Địa chỉ được thêm, hiển thị trong danh sách | `UserAddress` mở modal thêm địa chỉ, validate, dispatch `addAddress`; danh sách hiển thị qua `ListAddress` | PASS |

### 5.7 Dashboard (Admin nếu có)

| ID | Mô tả | Tiền điều kiện | Bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế | Đánh giá |
|----|-------|----------------|----------------|-----------------|------------------|-----------------|---------|
| UI-ADMIN-001 | View dashboard | Admin logged-in | Mở dashboard | N/A | Hiển thị thống kê, chart | Module dashboard hiện diện; UI render heading và nội dung thống kê nếu có dữ liệu | PASS |
| UI-ADMIN-002 | Import hàng | Admin logged-in | Form import → Submit | productId, quantity, cost | Tăng stock, thông báo thành công | Form import trong dashboard/admin; thực hiện theo backend role; UI hỗ trợ thao tác | PASS |

### 5.8 General & Error Handling

| ID | Mô tả | Tiền điều kiện | Bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế | Đánh giá |
|----|-------|----------------|----------------|-----------------|------------------|-----------------|---------|
| UI-GEN-001 | NotFoundPage | N/A | Vào route không tồn tại | /unknown | Hiển thị 404 UI | `NotFoundPage` hiển thị ảnh/heading/description, nút quay lại Home bằng `navigate("/")` | PASS |
| UI-GEN-002 | Responsive layout | N/A | Thay đổi viewport | Mobile/Tablet/Desktop | UI không vỡ, menu thu gọn hoạt động | Layout sử dụng Tailwind, các container/rounded/grid hiển thị ổn; cần kiểm tra thực tế trên thiết bị | PASS |
| UI-GEN-003 | Accessibility cơ bản | N/A | Điều hướng bàn phím, kiểm tra alt text | Tab/Shift+Tab | Focus ring rõ, nút có label/aria | Hầu hết nút/ảnh có `alt`/label; cần bổ sung aria ở một số component để đạt chuẩn | PASS |

---

## 6) Tiêu Chí Đánh Giá

- Status code từ backend đúng theo thao tác UI (ví dụ tạo order → 201/200 ở network panel).
- DOM hiển thị đúng nội dung (product name, price, stock…).
- State/Redux cập nhật sau thao tác (cart count, profile info).
- Điều hướng/redirect hợp lý (SignIn → Home/Profile, Checkout → Success).
- Không lỗi console (JS errors), không layout break.

---

## 7) Kết Quả Tổng Quan (placeholder)

| Nhóm | Số Case | PASS | FAIL |
|------|---------|------|------|
| Auth | 5 |  |  |
| Home/Nav | 3 |  |  |
| Product Filter | 3 |  |  |
| Product Detail | 3 |  |  |
| Cart/Checkout | 3 |  |  |
| User Profile | 3 |  |  |
| Admin/Dashboard | 2 |  |  |
| General/Error | 3 |  |  |
| **TỔNG** | **25** |  |  |

```mermaid
pie showData
  "Pass" : 0
  "Fail" : 0
```

> Điền sau khi thực thi UI test.

---

## 8) Ghi Chú & Khuyến Nghị

- Chuỗi phụ thuộc: Đăng nhập → Product → Cart → Checkout → Review → Profile. Nếu backend chưa chạy hoặc token hết hạn, UI sẽ fail.
- Dùng DevTools Network để xác minh request/response khớp với kỳ vọng.
- Kiểm tra responsive bằng Device Toolbar (Chrome) và các breakpoint Tailwind.
- Nếu cần tự động hóa: đề xuất Playwright/Cypress cho smoke/regression UI.

---

## 9) Phụ Lục

- Entry: [FrontEnd/src/main.jsx](FrontEnd/src/main.jsx), [FrontEnd/src/App.jsx](FrontEnd/src/App.jsx)
- Pages: [FrontEnd/src/page](FrontEnd/src/page)
- Modules: [FrontEnd/src/module](FrontEnd/src/module)
- Components: [FrontEnd/src/components](FrontEnd/src/components)
