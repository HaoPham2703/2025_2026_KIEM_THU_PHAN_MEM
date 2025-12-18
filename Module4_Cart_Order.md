# Module4 - Cart & Order Management (Quản lý Giỏ hàng & Đơn hàng)

## Thông tin Module

|                      |                                                                                                           |
| -------------------- | --------------------------------------------------------------------------------------------------------- |
| **Module Code**      | Module4                                                                                                   |
| **Test Requirement** | Test các chức năng giỏ hàng (Front-end) và quản lý đơn hàng: Tạo, Xem, Hủy, Cập nhật trạng thái, Thống kê |
| **Tester**           | HaoPham                                                                                                   |
| **Test Date**        | 18/12/2025 (GitHub Actions - Branch: weblau)                                                              |

---

## Thống kê Test Case

| Pass | Fail | Untested | N/A | Number of Test Cases |
| ---- | ---- | -------- | --- | -------------------- |
| 0    | 0    | 40       | 0   | 40                   |

> **Ghi chú:** Kết quả từ GitHub Actions - Branch `weblau` - Test Date: 18/12/2025

---

## Chi tiết Test Case

### Function A: Thêm vào giỏ hàng (Add To Cart - Front-end)

| ID       | Test Case Description                               | Test Case Procedure                                                 | Expected Output                                                                         | Test Data  | Result   | Test Date | Description             |
| -------- | --------------------------------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ---------- | -------- | --------- | ----------------------- |
| CART-001 | Thêm sản phẩm mới vào giỏ hàng thành công           | 1. Giỏ hàng trống<br>2. Dispatch addToCart với sản phẩm mới         | 1. Sản phẩm được thêm vào giỏ<br>2. localStorage được cập nhật<br>3. Show toast success | TestData01 | Untested |           | Không yêu cầu đăng nhập |
| CART-002 | Thêm sản phẩm đã tồn tại - Tăng số lượng            | 1. Giỏ hàng có sản phẩm<br>2. Dispatch addToCart với sản phẩm đã có | 1. Số lượng sản phẩm tăng<br>2. Show toast success                                      | TestData02 | Untested |           | Quantity < inventory    |
| CART-003 | Thêm sản phẩm vượt quá inventory                    | 1. Sản phẩm trong giỏ = inventory<br>2. Dispatch addToCart lần nữa  | 1. Số lượng không thay đổi<br>2. Show toast warning "Chỉ còn 1 sản phẩm"                | TestData03 | Untested |           | Quantity >= inventory   |
| CART-004 | Thêm sản phẩm vào giỏ hàng rỗng (localStorage null) | 1. localStorage.cart = null<br>2. Dispatch addToCart                | 1. Tạo giỏ hàng mới<br>2. Thêm sản phẩm thành công                                      | TestData04 | Untested |           | Initialize cart         |

---

### Function B: Cập nhật số lượng giỏ hàng (Set Quantity)

| ID       | Test Case Description                    | Test Case Procedure                                                 | Expected Output                                            | Test Data  | Result   | Test Date | Description       |
| -------- | ---------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------- | ---------- | -------- | --------- | ----------------- |
| CART-005 | Cập nhật số lượng sản phẩm thành công    | 1. Giỏ hàng có sản phẩm<br>2. Dispatch setQuantity với quantity mới | 1. Số lượng được cập nhật<br>2. localStorage được cập nhật | TestData05 | Untested |           | Giỏ có sản phẩm   |
| CART-006 | Cập nhật số lượng = 0                    | 1. Giỏ hàng có sản phẩm<br>2. Dispatch setQuantity với quantity = 0 | 1. Số lượng = 0<br>2. localStorage được cập nhật           | TestData06 | Untested |           | Edge case         |
| CART-007 | Cập nhật số lượng sản phẩm không tồn tại | 1. Giỏ hàng không có sản phẩm ID<br>2. Dispatch setQuantity         | 1. Giỏ hàng không thay đổi                                 | TestData07 | Untested |           | Product not found |

---

### Function C: Xóa sản phẩm khỏi giỏ (Remove From Cart)

| ID       | Test Case Description                  | Test Case Procedure                                                    | Expected Output                                         | Test Data  | Result   | Test Date | Description        |
| -------- | -------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------- | ---------- | -------- | --------- | ------------------ |
| CART-008 | Xóa sản phẩm khỏi giỏ hàng thành công  | 1. Giỏ hàng có sản phẩm<br>2. Dispatch removeFromCart với ID           | 1. Sản phẩm bị xóa khỏi giỏ<br>2. localStorage cập nhật | TestData08 | Untested |           | Giỏ có sản phẩm    |
| CART-009 | Xóa sản phẩm cuối cùng - Giỏ hàng rỗng | 1. Giỏ chỉ có 1 sản phẩm<br>2. Dispatch removeFromCart                 | 1. Giỏ hàng rỗng []<br>2. localStorage = []             | TestData09 | Untested |           | Cart becomes empty |
| CART-010 | Xóa sản phẩm không tồn tại trong giỏ   | 1. Giỏ hàng có sản phẩm<br>2. Dispatch removeFromCart ID không tồn tại | 1. Giỏ hàng không thay đổi                              | TestData10 | Untested |           | Product not found  |

---

### Function D: Tạo đơn hàng (Create Order)

| ID        | Test Case Description                             | Test Case Procedure                                                                                      | Expected Output                                                                         | Test Data  | Result   | Test Date | Description                        |
| --------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ---------- | -------- | --------- | ---------------------------------- |
| ORDER-001 | Tạo đơn hàng thành công                           | 1. Đăng nhập với role=user<br>2. POST /api/v1/orders<br>3. Gửi: cart, address, receiver, phone, payments | 1. Trả về status 201<br>2. Đơn hàng được tạo<br>3. Inventory sản phẩm giảm              | TestData11 | Untested |           | User đã đăng nhập, giỏ có sản phẩm |
| ORDER-002 | Tạo đơn hàng với thanh toán "số dư"               | 1. Đăng nhập<br>2. POST /api/v1/orders<br>3. Gửi payments = "số dư"                                      | 1. Đơn hàng được tạo<br>2. Balance user giảm                                            | TestData12 | Untested |           | User có đủ balance                 |
| ORDER-003 | Tạo đơn hàng thất bại - Thiếu address             | 1. Đăng nhập<br>2. POST /api/v1/orders<br>3. Không gửi address                                           | 1. Trả về lỗi validation<br>2. Message: "Hóa đơn mua hàng phải có địa chỉ vận chuyển"   | TestData13 | Untested |           | Missing required field             |
| ORDER-004 | Tạo đơn hàng thất bại - Thiếu receiver            | 1. Đăng nhập<br>2. POST /api/v1/orders<br>3. Không gửi receiver                                          | 1. Trả về lỗi validation<br>2. Message: "Hóa đơn mua hàng phải có thông tin người nhận" | TestData14 | Untested |           | Missing receiver                   |
| ORDER-005 | Tạo đơn hàng thất bại - Chưa đăng nhập            | 1. Không đăng nhập<br>2. POST /api/v1/orders                                                             | 1. Trả về status 401<br>2. Message lỗi authentication                                   | TestData15 | Untested |           | Unauthorized                       |
| ORDER-006 | Tạo đơn hàng thất bại - Admin không được đặt hàng | 1. Đăng nhập với role=admin<br>2. POST /api/v1/orders                                                    | 1. Trả về status 403<br>2. Message: "Bạn không có quyền..."                             | TestData16 | Untested |           | Only user can create order         |

---

### Function E: Xem danh sách đơn hàng (Get All Orders)

| ID        | Test Case Description                           | Test Case Procedure                                  | Expected Output                                               | Test Data  | Result   | Test Date | Description       |
| --------- | ----------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------- | ---------- | -------- | --------- | ----------------- |
| ORDER-007 | User xem danh sách đơn hàng của mình thành công | 1. Đăng nhập với role=user<br>2. GET /api/v1/orders  | 1. Trả về status 200<br>2. Trả về danh sách đơn hàng của user | TestData17 | Untested |           | User đã đăng nhập |
| ORDER-008 | Admin xem tất cả đơn hàng thành công            | 1. Đăng nhập với role=admin<br>2. GET /api/v1/orders | 1. Trả về status 200<br>2. Trả về tất cả đơn hàng             | TestData18 | Untested |           | Role = admin      |
| ORDER-009 | Xem đơn hàng thất bại - Chưa đăng nhập          | 1. Không đăng nhập<br>2. GET /api/v1/orders          | 1. Trả về status 401<br>2. Message lỗi authentication         | TestData19 | Untested |           | Unauthorized      |

---

### Function F: Xem chi tiết đơn hàng (Get Order)

| ID        | Test Case Description                          | Test Case Procedure                                        | Expected Output                                                      | Test Data  | Result   | Test Date | Description            |
| --------- | ---------------------------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------- | ---------- | -------- | --------- | ---------------------- |
| ORDER-010 | User xem chi tiết đơn hàng của mình thành công | 1. Đăng nhập<br>2. GET /api/v1/orders/:id (order của user) | 1. Trả về status 200<br>2. Trả về chi tiết đơn hàng                  | TestData20 | Untested |           | Đơn hàng thuộc về user |
| ORDER-011 | Admin xem chi tiết bất kỳ đơn hàng nào         | 1. Đăng nhập với role=admin<br>2. GET /api/v1/orders/:id   | 1. Trả về status 200<br>2. Trả về chi tiết đơn hàng                  | TestData21 | Untested |           | Role = admin           |
| ORDER-012 | User xem đơn hàng không phải của mình          | 1. Đăng nhập<br>2. GET /api/v1/orders/:otherId             | 1. Trả về status 403<br>2. Message: "Bạn không có quyền..."          | TestData22 | Untested |           | Not owner              |
| ORDER-013 | Xem chi tiết đơn hàng không tồn tại            | 1. Đăng nhập<br>2. GET /api/v1/orders/:invalidId           | 1. Trả về status 404<br>2. Message: "No document found with that ID" | TestData23 | Untested |           | Order not found        |

---

### Function G: Hủy đơn hàng (Cancel Order - User)

| ID        | Test Case Description                                 | Test Case Procedure                                                                           | Expected Output                                                                | Test Data  | Result   | Test Date | Description           |
| --------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ---------- | -------- | --------- | --------------------- |
| ORDER-014 | User hủy đơn hàng ở trạng thái "Processed" thành công | 1. Đăng nhập<br>2. PATCH /api/v1/orders/:id<br>3. Body: {status: "Cancelled"}                 | 1. Trả về status 200<br>2. Order status = "Cancelled"<br>3. Inventory tăng lại | TestData24 | Untested |           | Status = "Processed"  |
| ORDER-015 | User không thể hủy đơn ở trạng thái "Waiting Goods"   | 1. Đăng nhập<br>2. PATCH /api/v1/orders/:id (Waiting Goods)<br>3. Body: {status: "Cancelled"} | 1. Trả về status 403<br>2. Message: "Bạn không có quyền thực hiện."            | TestData25 | Untested |           | Status != "Processed" |
| ORDER-016 | User không thể hủy đơn đã "Cancelled"                 | 1. Đăng nhập<br>2. PATCH /api/v1/orders/:id (Cancelled)<br>3. Body: {status: "Cancelled"}     | 1. Trả về status 403<br>2. Message: "Đơn hàng này đã Cancelled"                | TestData26 | Untested |           | Already cancelled     |
| ORDER-017 | User không thể hủy đơn đã "Success"                   | 1. Đăng nhập<br>2. PATCH /api/v1/orders/:id (Success)<br>3. Body: {status: "Cancelled"}       | 1. Trả về status 403<br>2. Message: "Đơn hàng này đã Success"                  | TestData27 | Untested |           | Already completed     |

---

### Function H: Cập nhật trạng thái đơn hàng (Admin - Update Order Status)

| ID        | Test Case Description                             | Test Case Procedure                                                                           | Expected Output                                                                 | Test Data  | Result   | Test Date | Description            |
| --------- | ------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ---------- | -------- | --------- | ---------------------- |
| ORDER-018 | Admin cập nhật trạng thái đơn hàng thành công     | 1. Đăng nhập với role=admin<br>2. PATCH /api/v1/orders/:id<br>3. Body: {status: "Delivery"}   | 1. Trả về status 200<br>2. Order status được cập nhật<br>3. Gửi email           | TestData28 | Untested |           | Role = admin           |
| ORDER-019 | Employee cập nhật trạng thái đơn hàng thành công  | 1. Đăng nhập với role=employee<br>2. PATCH /api/v1/orders/:id<br>3. Body: {status: "Success"} | 1. Trả về status 200<br>2. Order status được cập nhật                           | TestData29 | Untested |           | Role = employee        |
| ORDER-020 | Admin hủy đơn hàng - Hoàn tiền nếu không phải COD | 1. Đăng nhập với role=admin<br>2. PATCH /api/v1/orders/:id<br>3. Body: {status: "Cancelled"}  | 1. Order status = "Cancelled"<br>2. Tạo transaction refund<br>3. Inventory tăng | TestData30 | Untested |           | payments != "tiền mặt" |
| ORDER-021 | Admin không thể cập nhật đơn đã "Cancelled"       | 1. Đăng nhập với role=admin<br>2. PATCH /api/v1/orders/:id (Cancelled)                        | 1. Trả về status 403<br>2. Message: "Đơn hàng này đã Cancelled"                 | TestData31 | Untested |           | Already cancelled      |
| ORDER-022 | Admin không thể cập nhật đơn đã "Success"         | 1. Đăng nhập với role=admin<br>2. PATCH /api/v1/orders/:id (Success)                          | 1. Trả về status 403<br>2. Message: "Đơn hàng này đã Success"                   | TestData32 | Untested |           | Already completed      |
| ORDER-023 | User không thể cập nhật status khác "Cancelled"   | 1. Đăng nhập với role=user<br>2. PATCH /api/v1/orders/:id<br>3. Body: {status: "Delivery"}    | 1. Trả về status 403<br>2. Message: "Bạn không có quyền thực hiện."             | TestData33 | Untested |           | User can only cancel   |

---

### Function I: Thống kê đơn hàng (Admin - Statistics)

| ID        | Test Case Description                            | Test Case Procedure                                                                                | Expected Output                                             | Test Data  | Result   | Test Date | Description      |
| --------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ---------- | -------- | --------- | ---------------- |
| ORDER-024 | Thống kê số lượng đơn hàng theo status           | 1. Đăng nhập với role=admin<br>2. GET /api/v1/orders/count                                         | 1. Trả về status 200<br>2. Trả về count theo từng status    | TestData34 | Untested |           | Role = admin     |
| ORDER-025 | Thống kê số lượng đơn theo tùy chọn (year/month) | 1. Đăng nhập với role=admin<br>2. POST /api/v1/orders/countOption<br>3. Body: {year: true}         | 1. Trả về status 200<br>2. Trả về count theo year, status   | TestData35 | Untested |           | With options     |
| ORDER-026 | Thống kê tổng doanh thu                          | 1. Đăng nhập với role=admin<br>2. GET /api/v1/orders/sum                                           | 1. Trả về status 200<br>2. Trả về tổng revenue theo tháng   | TestData36 | Untested |           | Sum revenue      |
| ORDER-027 | Thống kê doanh thu theo tùy chọn                 | 1. Đăng nhập với role=admin<br>2. POST /api/v1/orders/sumOption<br>3. Body: {month: true}          | 1. Trả về status 200<br>2. Trả về revenue theo month        | TestData37 | Untested |           | With options     |
| ORDER-028 | Thống kê top sản phẩm bán chạy                   | 1. Đăng nhập với role=admin<br>2. POST /api/v1/orders/topProduct                                   | 1. Trả về status 200<br>2. Trả về top 5 sản phẩm            | TestData38 | Untested |           | Top products     |
| ORDER-029 | Thống kê đơn hàng trong khoảng thời gian         | 1. Đăng nhập với role=admin<br>2. POST /api/v1/orders/statusInRange<br>3. Body: {dateFrom, dateTo} | 1. Trả về status 200<br>2. Trả về count trong khoảng ngày   | TestData39 | Untested |           | Date range       |
| ORDER-030 | Thống kê doanh thu trong khoảng thời gian        | 1. Đăng nhập với role=admin<br>2. POST /api/v1/orders/sumInRange<br>3. Body: {dateFrom, dateTo}    | 1. Trả về status 200<br>2. Trả về tổng revenue trong khoảng | TestData40 | Untested |           | Revenue in range |

---

## Test Data

| Test Data ID | Data Description                                                                                                                                   |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| TestData01   | addToCart({id: "prod1", product: {inventory: 10}, quantity: 1}) - giỏ hàng trống                                                                   |
| TestData02   | addToCart({id: "prod1", quantity: 1}) - sản phẩm đã có trong giỏ, quantity < inventory                                                             |
| TestData03   | addToCart({id: "prod1", quantity: 1}) - sản phẩm trong giỏ quantity = inventory                                                                    |
| TestData04   | addToCart với localStorage.cart = null                                                                                                             |
| TestData05   | setQuantity({id: "prod1", quantity: 3})                                                                                                            |
| TestData06   | setQuantity({id: "prod1", quantity: 0})                                                                                                            |
| TestData07   | setQuantity({id: "nonexistent", quantity: 5})                                                                                                      |
| TestData08   | removeFromCart("prod1") - giỏ có nhiều sản phẩm                                                                                                    |
| TestData09   | removeFromCart("prod1") - giỏ chỉ có 1 sản phẩm                                                                                                    |
| TestData10   | removeFromCart("nonexistent")                                                                                                                      |
| TestData11   | POST /api/v1/orders {cart: [...], address: "123 Street", receiver: "Nguyen Van A", phone: "0123456789", payments: "tiền mặt", totalPrice: 1000000} |
| TestData12   | POST /api/v1/orders {payments: "số dư"} - user có balance đủ                                                                                       |
| TestData13   | POST /api/v1/orders {} (missing address)                                                                                                           |
| TestData14   | POST /api/v1/orders {} (missing receiver)                                                                                                          |
| TestData15   | POST /api/v1/orders without Authorization header                                                                                                   |
| TestData16   | POST /api/v1/orders by admin role                                                                                                                  |
| TestData17   | GET /api/v1/orders by user                                                                                                                         |
| TestData18   | GET /api/v1/orders by admin                                                                                                                        |
| TestData19   | GET /api/v1/orders without Authorization                                                                                                           |
| TestData20   | GET /api/v1/orders/:validId (order belongs to user)                                                                                                |
| TestData21   | GET /api/v1/orders/:validId by admin                                                                                                               |
| TestData22   | GET /api/v1/orders/:otherId (order belongs to another user)                                                                                        |
| TestData23   | GET /api/v1/orders/:invalidId                                                                                                                      |
| TestData24   | PATCH /api/v1/orders/:id {status: "Cancelled"} - order status = "Processed"                                                                        |
| TestData25   | PATCH /api/v1/orders/:id {status: "Cancelled"} - order status = "Waiting Goods"                                                                    |
| TestData26   | PATCH /api/v1/orders/:id {status: "Cancelled"} - order status = "Cancelled"                                                                        |
| TestData27   | PATCH /api/v1/orders/:id {status: "Cancelled"} - order status = "Success"                                                                          |
| TestData28   | PATCH /api/v1/orders/:id {status: "Delivery"} by admin                                                                                             |
| TestData29   | PATCH /api/v1/orders/:id {status: "Success"} by employee                                                                                           |
| TestData30   | PATCH /api/v1/orders/:id {status: "Cancelled"} by admin - order payments = "vnpay"                                                                 |
| TestData31   | PATCH /api/v1/orders/:id - order status = "Cancelled"                                                                                              |
| TestData32   | PATCH /api/v1/orders/:id - order status = "Success"                                                                                                |
| TestData33   | PATCH /api/v1/orders/:id {status: "Delivery"} by user                                                                                              |
| TestData34   | GET /api/v1/orders/count                                                                                                                           |
| TestData35   | POST /api/v1/orders/countOption {year: true}                                                                                                       |
| TestData36   | GET /api/v1/orders/sum                                                                                                                             |
| TestData37   | POST /api/v1/orders/sumOption {month: true}                                                                                                        |
| TestData38   | POST /api/v1/orders/topProduct {}                                                                                                                  |
| TestData39   | POST /api/v1/orders/statusInRange {dateFrom: "2025-01-01", dateTo: "2025-12-31"}                                                                   |
| TestData40   | POST /api/v1/orders/sumInRange {dateFrom: "2025-01-01", dateTo: "2025-12-31"}                                                                      |

---

## Ghi chú

1. **Cart Functions (Front-end - Redux Slice):**

   - `addToCart`: Thêm sản phẩm vào giỏ hàng (localStorage)
   - `setQuantity`: Cập nhật số lượng sản phẩm
   - `removeFromCart`: Xóa sản phẩm khỏi giỏ
   - `resetCart`: Xóa toàn bộ giỏ hàng
   - `getCart`: Lấy giỏ hàng từ localStorage

2. **Order API Endpoints:**

   - POST `/api/v1/orders` - Tạo đơn hàng (User only)
   - GET `/api/v1/orders` - Xem danh sách đơn hàng
   - GET `/api/v1/orders/:id` - Xem chi tiết đơn hàng
   - PATCH `/api/v1/orders/:id` - Cập nhật trạng thái đơn hàng
   - GET `/api/v1/orders/count` - Thống kê số lượng đơn (Admin)
   - POST `/api/v1/orders/countOption` - Thống kê theo option (Admin)
   - GET `/api/v1/orders/sum` - Thống kê doanh thu (Admin)
   - POST `/api/v1/orders/sumOption` - Thống kê doanh thu theo option (Admin)
   - POST `/api/v1/orders/topProduct` - Top sản phẩm bán chạy (Admin)
   - POST `/api/v1/orders/statusInRange` - Thống kê trong khoảng thời gian (Admin)
   - POST `/api/v1/orders/sumInRange` - Doanh thu trong khoảng thời gian (Admin)

3. **Order Status Flow:**

   - `Processed` → `Waiting Goods` → `Delivery` → `Success`
   - `Cancelled` có thể từ `Processed` (user) hoặc bất kỳ status nào (admin)

4. **Payment Methods:**

   - `tiền mặt`: COD
   - `vnpay`: VNPay
   - `paypal`: PayPal
   - `số dư`: User balance

5. **Business Rules:**

   - User chỉ có thể hủy đơn ở trạng thái `Processed`
   - Admin/Employee có thể cập nhật mọi trạng thái
   - Khi hủy đơn: inventory sản phẩm tăng lại
   - Khi hủy đơn không COD: tạo transaction refund
   - Khi tạo đơn với "số dư": balance user giảm

6. **Validation Rules:**
   - Order phải có: user, address, receiver, phone, payments, cart
   - Chỉ user mới có thể tạo đơn hàng
   - User chỉ xem được đơn hàng của mình
   - Admin xem được tất cả đơn hàng
