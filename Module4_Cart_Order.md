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
| 25   | 5    | 10       | 0   | 40                   |

> **Ghi chú:** Kết quả từ GitHub Actions - Branch `weblau` - Test Date: 18/12/2025  
> **Automated Tests:** 30 tests (ORDER-001 to ORDER-030) - 25 Passed, 5 Failed  
> **Manual Tests:** 10 tests (CART-001 to CART-010) - Chưa test (Front-end Redux)

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

| ID        | Test Case Description                             | Test Case Procedure                                                                                      | Expected Output                                                                         | Test Data  | Result    | Test Date  | Description                          |
| --------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ---------- | --------- | ---------- | ------------------------------------ |
| ORDER-001 | Tạo đơn hàng thành công                           | 1. Đăng nhập với role=user<br>2. POST /api/v1/orders<br>3. Gửi: cart, address, receiver, phone, payments | 1. Trả về status 201<br>2. Đơn hàng được tạo<br>3. Inventory sản phẩm giảm              | TestData11 | ✅ Passed | 18/12/2025 | Test thành công                      |
| ORDER-002 | Tạo đơn hàng với thanh toán "số dư"               | 1. Đăng nhập<br>2. POST /api/v1/orders<br>3. Gửi payments = "số dư"                                      | 1. Đơn hàng được tạo<br>2. Balance user giảm                                            | TestData12 | ✅ Passed | 18/12/2025 | Test thành công                      |
| ORDER-003 | Tạo đơn hàng thất bại - Thiếu address             | 1. Đăng nhập<br>2. POST /api/v1/orders<br>3. Không gửi address                                           | 1. Trả về lỗi validation<br>2. Message: "Hóa đơn mua hàng phải có địa chỉ vận chuyển"   | TestData13 | ✅ Passed | 18/12/2025 | Validation đúng                      |
| ORDER-004 | Tạo đơn hàng thất bại - Thiếu receiver            | 1. Đăng nhập<br>2. POST /api/v1/orders<br>3. Không gửi receiver                                          | 1. Trả về lỗi validation<br>2. Message: "Hóa đơn mua hàng phải có thông tin người nhận" | TestData14 | ✅ Passed | 18/12/2025 | Validation đúng                      |
| ORDER-005 | Tạo đơn hàng thất bại - Chưa đăng nhập            | 1. Không đăng nhập<br>2. POST /api/v1/orders                                                             | 1. Trả về status 401<br>2. Message lỗi authentication                                   | TestData15 | ✅ Passed | 18/12/2025 | Middleware protect hoạt động đúng    |
| ORDER-006 | Tạo đơn hàng thất bại - Admin không được đặt hàng | 1. Đăng nhập với role=admin<br>2. POST /api/v1/orders                                                    | 1. Trả về status 403<br>2. Message: "Bạn không có quyền..."                             | TestData16 | ✅ Passed | 18/12/2025 | Middleware restrictTo hoạt động đúng |

---

### Function E: Xem danh sách đơn hàng (Get All Orders)

| ID        | Test Case Description                           | Test Case Procedure                                  | Expected Output                                               | Test Data  | Result    | Test Date  | Description                       |
| --------- | ----------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------- | ---------- | --------- | ---------- | --------------------------------- |
| ORDER-007 | User xem danh sách đơn hàng của mình thành công | 1. Đăng nhập với role=user<br>2. GET /api/v1/orders  | 1. Trả về status 200<br>2. Trả về danh sách đơn hàng của user | TestData17 | ✅ Passed | 18/12/2025 | Test thành công                   |
| ORDER-008 | Admin xem tất cả đơn hàng thành công            | 1. Đăng nhập với role=admin<br>2. GET /api/v1/orders | 1. Trả về status 200<br>2. Trả về tất cả đơn hàng             | TestData18 | ✅ Passed | 18/12/2025 | Test thành công                   |
| ORDER-009 | Xem đơn hàng thất bại - Chưa đăng nhập          | 1. Không đăng nhập<br>2. GET /api/v1/orders          | 1. Trả về status 401<br>2. Message lỗi authentication         | TestData19 | ✅ Passed | 18/12/2025 | Middleware protect hoạt động đúng |

---

### Function F: Xem chi tiết đơn hàng (Get Order)

| ID        | Test Case Description                          | Test Case Procedure                                        | Expected Output                                                      | Test Data  | Result    | Test Date  | Description                                                                           |
| --------- | ---------------------------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------- | ---------- | --------- | ---------- | ------------------------------------------------------------------------------------- |
| ORDER-010 | User xem chi tiết đơn hàng của mình thành công | 1. Đăng nhập<br>2. GET /api/v1/orders/:id (order của user) | 1. Trả về status 200<br>2. Trả về chi tiết đơn hàng                  | TestData20 | ❌ Failed | 18/12/2025 | Lỗi: Mock factory.getOne không gọi res.status(200). Expected: 200, Number of calls: 0 |
| ORDER-011 | Admin xem chi tiết bất kỳ đơn hàng nào         | 1. Đăng nhập với role=admin<br>2. GET /api/v1/orders/:id   | 1. Trả về status 200<br>2. Trả về chi tiết đơn hàng                  | TestData21 | ❌ Failed | 18/12/2025 | Lỗi: Mock factory.getOne không gọi res.status(200). Expected: 200, Number of calls: 0 |
| ORDER-012 | User xem đơn hàng không phải của mình          | 1. Đăng nhập<br>2. GET /api/v1/orders/:otherId             | 1. Trả về status 403<br>2. Message: "Bạn không có quyền..."          | TestData22 | ✅ Passed | 18/12/2025 | Middleware isOwner hoạt động đúng                                                     |
| ORDER-013 | Xem chi tiết đơn hàng không tồn tại            | 1. Đăng nhập<br>2. GET /api/v1/orders/:invalidId           | 1. Trả về status 404<br>2. Message: "No document found with that ID" | TestData23 | ✅ Passed | 18/12/2025 | Test thành công                                                                       |

---

### Function G: Hủy đơn hàng (Cancel Order - User)

| ID        | Test Case Description                                 | Test Case Procedure                                                                           | Expected Output                                                                | Test Data  | Result    | Test Date  | Description                                                                                                               |
| --------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ---------- | --------- | ---------- | ------------------------------------------------------------------------------------------------------------------------- |
| ORDER-014 | User hủy đơn hàng ở trạng thái "Processed" thành công | 1. Đăng nhập<br>2. PATCH /api/v1/orders/:id<br>3. Body: {status: "Cancelled"}                 | 1. Trả về status 200<br>2. Order status = "Cancelled"<br>3. Inventory tăng lại | TestData24 | ✅ Passed | 18/12/2025 | Test thành công, inventory được hoàn trả                                                                                  |
| ORDER-015 | User không thể hủy đơn ở trạng thái "Waiting Goods"   | 1. Đăng nhập<br>2. PATCH /api/v1/orders/:id (Waiting Goods)<br>3. Body: {status: "Cancelled"} | 1. Trả về status 403<br>2. Message: "Bạn không có quyền thực hiện."            | TestData25 | ✅ Passed | 18/12/2025 | Middleware checkStatusOrder hoạt động đúng                                                                                |
| ORDER-016 | User không thể hủy đơn đã "Cancelled"                 | 1. Đăng nhập<br>2. PATCH /api/v1/orders/:id (Cancelled)<br>3. Body: {status: "Cancelled"}     | 1. Trả về status 403<br>2. Message: "Đơn hàng này đã Cancelled"                | TestData26 | ❌ Failed | 18/12/2025 | Lỗi: Middleware check sai logic. Expected message: "Đơn hàng nãy đã Cancelled", Received: "Bạn không có quyền thực hiện." |
| ORDER-017 | User không thể hủy đơn đã "Success"                   | 1. Đăng nhập<br>2. PATCH /api/v1/orders/:id (Success)<br>3. Body: {status: "Cancelled"}       | 1. Trả về status 403<br>2. Message: "Đơn hàng này đã Success"                  | TestData27 | ❌ Failed | 18/12/2025 | Lỗi: Middleware check sai logic. Expected message: "Đơn hàng nãy đã Success", Received: "Bạn không có quyền thực hiện."   |

---

### Function H: Cập nhật trạng thái đơn hàng (Admin - Update Order Status)

| ID        | Test Case Description                             | Test Case Procedure                                                                           | Expected Output                                                                 | Test Data  | Result    | Test Date  | Description                                                                                                                                     |
| --------- | ------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ---------- | --------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| ORDER-018 | Admin cập nhật trạng thái đơn hàng thành công     | 1. Đăng nhập với role=admin<br>2. PATCH /api/v1/orders/:id<br>3. Body: {status: "Delivery"}   | 1. Trả về status 200<br>2. Order status được cập nhật<br>3. Gửi email           | TestData28 | ✅ Passed | 18/12/2025 | Test thành công, email được gửi                                                                                                                 |
| ORDER-019 | Employee cập nhật trạng thái đơn hàng thành công  | 1. Đăng nhập với role=employee<br>2. PATCH /api/v1/orders/:id<br>3. Body: {status: "Success"} | 1. Trả về status 200<br>2. Order status được cập nhật                           | TestData29 | ✅ Passed | 18/12/2025 | Test thành công                                                                                                                                 |
| ORDER-020 | Admin hủy đơn hàng - Hoàn tiền nếu không phải COD | 1. Đăng nhập với role=admin<br>2. PATCH /api/v1/orders/:id<br>3. Body: {status: "Cancelled"}  | 1. Order status = "Cancelled"<br>2. Tạo transaction refund<br>3. Inventory tăng | TestData30 | ❌ Failed | 18/12/2025 | Lỗi: Mock updateOrder không gọi res.status(200). Expected: 200, Number of calls: 0. Note: Transaction refund được tạo trong post-hook của model |
| ORDER-021 | Admin không thể cập nhật đơn đã "Cancelled"       | 1. Đăng nhập với role=admin<br>2. PATCH /api/v1/orders/:id (Cancelled)                        | 1. Trả về status 403<br>2. Message: "Đơn hàng này đã Cancelled"                 | TestData31 | ✅ Passed | 18/12/2025 | Middleware checkStatusOrder hoạt động đúng                                                                                                      |
| ORDER-022 | Admin không thể cập nhật đơn đã "Success"         | 1. Đăng nhập với role=admin<br>2. PATCH /api/v1/orders/:id (Success)                          | 1. Trả về status 403<br>2. Message: "Đơn hàng này đã Success"                   | TestData32 | ✅ Passed | 18/12/2025 | Middleware checkStatusOrder hoạt động đúng                                                                                                      |
| ORDER-023 | User không thể cập nhật status khác "Cancelled"   | 1. Đăng nhập với role=user<br>2. PATCH /api/v1/orders/:id<br>3. Body: {status: "Delivery"}    | 1. Trả về status 403<br>2. Message: "Bạn không có quyền thực hiện."             | TestData33 | ✅ Passed | 18/12/2025 | Middleware checkStatusOrder hoạt động đúng                                                                                                      |

---

### Function I: Thống kê đơn hàng (Admin - Statistics)

| ID        | Test Case Description                            | Test Case Procedure                                                                                | Expected Output                                             | Test Data  | Result    | Test Date  | Description                 |
| --------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ---------- | --------- | ---------- | --------------------------- |
| ORDER-024 | Thống kê số lượng đơn hàng theo status           | 1. Đăng nhập với role=admin<br>2. GET /api/v1/orders/count                                         | 1. Trả về status 200<br>2. Trả về count theo từng status    | TestData34 | ✅ Passed | 18/12/2025 | Test thành công             |
| ORDER-025 | Thống kê số lượng đơn theo tùy chọn (year/month) | 1. Đăng nhập với role=admin<br>2. POST /api/v1/orders/countOption<br>3. Body: {year: true}         | 1. Trả về status 200<br>2. Trả về count theo year, status   | TestData35 | ✅ Passed | 18/12/2025 | Aggregation pipeline đúng   |
| ORDER-026 | Thống kê tổng doanh thu                          | 1. Đăng nhập với role=admin<br>2. GET /api/v1/orders/sum                                           | 1. Trả về status 200<br>2. Trả về tổng revenue theo tháng   | TestData36 | ✅ Passed | 18/12/2025 | Test thành công             |
| ORDER-027 | Thống kê doanh thu theo tùy chọn                 | 1. Đăng nhập với role=admin<br>2. POST /api/v1/orders/sumOption<br>3. Body: {month: true}          | 1. Trả về status 200<br>2. Trả về revenue theo month        | TestData37 | ✅ Passed | 18/12/2025 | Aggregation pipeline đúng   |
| ORDER-028 | Thống kê top sản phẩm bán chạy                   | 1. Đăng nhập với role=admin<br>2. POST /api/v1/orders/topProduct                                   | 1. Trả về status 200<br>2. Trả về top 5 sản phẩm            | TestData38 | ✅ Passed | 18/12/2025 | Test thành công             |
| ORDER-029 | Thống kê đơn hàng trong khoảng thời gian         | 1. Đăng nhập với role=admin<br>2. POST /api/v1/orders/statusInRange<br>3. Body: {dateFrom, dateTo} | 1. Trả về status 200<br>2. Trả về count trong khoảng ngày   | TestData39 | ✅ Passed | 18/12/2025 | Date range filter hoạt động |
| ORDER-030 | Thống kê doanh thu trong khoảng thời gian        | 1. Đăng nhập với role=admin<br>2. POST /api/v1/orders/sumInRange<br>3. Body: {dateFrom, dateTo}    | 1. Trả về status 200<br>2. Trả về tổng revenue trong khoảng | TestData40 | ✅ Passed | 18/12/2025 | Date range filter hoạt động |

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

## 📊 Báo Cáo Test Tự Động (GitHub Actions)

### 📊 Tổng Quan Test Results

| Metric          | Value      | Status             |
| --------------- | ---------- | ------------------ |
| **Total Tests** | 30         | -                  |
| **✅ Passed**   | 25         | 83.33%             |
| **❌ Failed**   | 5          | 16.67% - Cần xử lý |
| **Branch**      | weblau     | -                  |
| **Test Date**   | 18/12/2025 | -                  |

### ❌ Chi Tiết Các Test Failed

| STT | Test Suite   | Test Case Description                             | Test ID   | Status    | Note                                                  |
| --- | ------------ | ------------------------------------------------- | --------- | --------- | ----------------------------------------------------- |
| 1   | Get Order    | User xem chi tiết đơn hàng của mình thành công    | ORDER-010 | ❌ Failed | Mock factory.getOne không gọi res.status(200)         |
| 2   | Get Order    | Admin xem chi tiết bất kỳ đơn hàng nào            | ORDER-011 | ❌ Failed | Mock factory.getOne không gọi res.status(200)         |
| 3   | Cancel Order | User không thể hủy đơn đã "Cancelled"             | ORDER-016 | ❌ Failed | Middleware check sai logic, trả về message không đúng |
| 4   | Cancel Order | User không thể hủy đơn đã "Success"               | ORDER-017 | ❌ Failed | Middleware check sai logic, trả về message không đúng |
| 5   | Update Order | Admin hủy đơn hàng - Hoàn tiền nếu không phải COD | ORDER-020 | ❌ Failed | Mock updateOrder không gọi res.status(200)            |

### 🎯 Độ Coverage Theo Function

| Function       | Test Cases | Passed | Failed | Pass Rate |
| -------------- | ---------- | ------ | ------ | --------- |
| Create Order   | 6          | 6      | 0      | 100% ✅   |
| Get All Orders | 3          | 3      | 0      | 100% ✅   |
| Get Order      | 4          | 2      | 2      | 50% ❌    |
| Cancel Order   | 4          | 2      | 2      | 50% ❌    |
| Update Order   | 6          | 5      | 1      | 83% ✅    |
| Statistics     | 7          | 7      | 0      | 100% ✅   |

### 📋 Phân Loại Theo Nhóm Chức Năng

| Nhóm Chức Năng      | Test Cases | Passed | Failed | Pass Rate | Note                                      |
| ------------------- | ---------- | ------ | ------ | --------- | ----------------------------------------- |
| 📦 Order Management | 13         | 11     | 2      | 85%       | Lỗi ở Get Order (mock factory)            |
| ❌ Cancel Order     | 4          | 2      | 2      | 50%       | Lỗi ở middleware check status             |
| 🔄 Update Status    | 6          | 5      | 1      | 83%       | Lỗi ở updateOrder với refund              |
| 📊 Statistics       | 7          | 7      | 0      | 100%      | Tất cả aggregation pipeline hoạt động tốt |

### 🔍 Phân Tích Lỗi Chi Tiết

#### 1. **Lỗi Mock Factory (ORDER-010, ORDER-011)**

**Vấn đề:** Mock function `factory.getOne()` không gọi `res.status(200)`

**Error Message:**

```
Error: expect(jest.fn()).toHaveBeenCalledWith(...expected)
Expected: 200
Number of calls: 0
```

**Nguyên nhân:** Mock factory chưa đầy đủ, cần implement mock đúng cách để gọi `res.status(200).json(...)`

**Giải pháp đề xuất:**

- Sửa mock trong test để đảm bảo `res.status` được gọi
- Hoặc test trực tiếp với controller thực thay vì mock factory

#### 2. **Lỗi Middleware Check Status (ORDER-016, ORDER-017)**

**Vấn đề:** Middleware `checkStatusOrder` trả về message không đúng với expected

**Error Message:**

```
Expected: ObjectContaining {"message": "Đơn hàng nãy đã Cancelled", "statusCode": 403}
Received: [Error: Bạn không có quyền thực hiện.]
```

**Nguyên nhân:** Logic trong middleware kiểm tra điều kiện sai, ưu tiên check role trước khi check order status

**Giải pháp đề xuất:**

- Sửa logic trong `checkStatusOrder` middleware
- Kiểm tra order status trước, sau đó mới kiểm tra quyền của user

**Code hiện tại (orderController.js):**

```javascript
exports.checkStatusOrder = catchAsync(async (req, res, next) => {
  if (
    req.user.role == "user" &&
    ((req.body.status == "Cancelled" && req.order.status != "Processed") ||
      req.body.status != "Cancelled")
  ) {
    return next(new AppError("Bạn không có quyền thực hiện.", 403));
  }
  if (req.order.status == "Cancelled" || req.order.status == "Success") {
    return next(new AppError(`Đơn hàng nãy đã ${req.order.status}`, 403));
  }
  next();
});
```

**Đề xuất sửa:** Đổi thứ tự check, kiểm tra order status trước

#### 3. **Lỗi Mock Update Order (ORDER-020)**

**Vấn đề:** Mock `updateOrder` không gọi `res.status(200)`

**Error Message:**

```
Error: expect(jest.fn()).toHaveBeenCalledWith(...expected)
Expected: 200
Number of calls: 0
```

**Nguyên nhân:** Tương tự ORDER-010 và ORDER-011, mock chưa đầy đủ

### 📈 So Sánh Với Module Khác

| Module            | Total Tests | Passed | Failed | Pass Rate |
| ----------------- | ----------- | ------ | ------ | --------- |
| Module1 (Auth)    | 31          | 26     | 5      | 83.87%    |
| Module2 (User)    | 30          | 23     | 7      | 76.67%    |
| Module3 (Product) | 35          | 27     | 8      | 77.14%    |
| Module4 (Order)   | 30          | 25     | 5      | 83.33%    |

**Nhận xét:**

- Module 4 có pass rate tốt thứ 2 (83.33%), chỉ sau Module 1
- Số lượng test fail ít nhất (5 tests)
- Các lỗi chủ yếu do mock chưa đầy đủ, không phải lỗi logic nghiêm trọng

### 🔧 Các Bước Tiếp Theo

1. **Ưu tiên cao:**

   - ✅ Sửa middleware `checkStatusOrder` để kiểm tra order status trước
   - ✅ Fix mock factory.getOne() và updateOrder() trong test
   - ✅ Re-run test để verify fix

2. **Ưu tiên trung bình:**

   - 📝 Thêm integration test cho flow hoàn chỉnh (create → update → cancel)
   - 📝 Thêm test cho edge cases (concurrent updates, race conditions)
   - 📝 Test performance với large dataset (1000+ orders)

3. **Ưu tiên thấp:**
   - 🧪 Thêm test cho Cart functions (Front-end Redux Slice) - 10 tests
   - 📊 Tăng coverage lên 90%+
   - 🔐 Thêm security tests (SQL injection, XSS)

### 📝 Notes

- **Cart Tests (CART-001 to CART-010):** Chưa có automated tests vì là Front-end Redux Slice, cần test riêng với Jest + Redux Testing Library
- **Transaction Refund:** Logic tạo transaction refund nằm trong `post findOneAndUpdate` hook của Order model, không test được trực tiếp trong unit test
- **Email Sending:** Test đã mock email service, không gửi email thật trong test environment

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
