# TEST CASES - CART & ORDER MANAGEMENT MODULE

**Tình huống**: Quản lý giỏ hàng và đơn hàng  
**Module**: Cart & Order Management  
**Ngày tạo**: 21/12/2025  
**Người tạo**: Test Team

---

## 1. QUẢN LÝ GIỎ HÀNG (CART)

### TC-CART-001: Thêm sản phẩm vào giỏ hàng
- **Mức độ ưu tiên**: High
- **Loại test**: Functional - Positive
- **Điều kiện tiên quyết**: User đã đăng nhập, sản phẩm tồn tại
- **Bước thực hiện**:
  1. Gửi POST request đến `/api/v1/cart`
  2. Body: `{ "productId": "...", "quantity": 2 }`
- **Kết quả mong đợi**:
  - Status code: 200
  - Sản phẩm được thêm vào cart của user
  - Response trả về cart hiện tại
- **Kết quả thực tế**: ✅ Pass

### TC-CART-002: Thêm sản phẩm với số lượng vượt quá tồn kho
- **Mức độ ưu tiên**: High
- **Loại test**: Functional - Negative
- **Điều kiện tiên quyết**: Sản phẩm có quantity = 5
- **Bước thực hiện**:
  1. Gửi POST request với quantity = 10
- **Kết quả mong đợi**:
  - Status code: 400
  - Error: "Not enough stock"
- **Kết quả thực tế**: ✅ Pass

### TC-CART-003: Cập nhật số lượng sản phẩm trong giỏ hàng
- **Mức độ ưu tiên**: High
- **Loại test**: Functional - Positive
- **Điều kiện tiên quyết**: Sản phẩm đã có trong cart
- **Bước thực hiện**:
  1. Gửi PATCH request đến `/api/v1/cart/items/:itemId`
  2. Body: `{ "quantity": 3 }`
- **Kết quả mong đợi**:
  - Status code: 200
  - Quantity được cập nhật
- **Kết quả thực tế**: ✅ Pass

### TC-CART-004: Xóa sản phẩm khỏi giỏ hàng
- **Mức độ ưu tiên**: High
- **Loại test**: Functional - Positive
- **Điều kiện tiên quyết**: Sản phẩm đã có trong cart
- **Bước thực hiện**:
  1. Gửi DELETE request đến `/api/v1/cart/items/:itemId`
- **Kết quả mong đợi**:
  - Status code: 200
  - Sản phẩm bị xóa khỏi cart
- **Kết quả thực tế**: ✅ Pass

### TC-CART-005: Xem giỏ hàng hiện tại
- **Mức độ ưu tiên**: High
- **Loại test**: Functional - Positive
- **Điều kiện tiên quyết**: User đã đăng nhập
- **Bước thực hiện**:
  1. Gửi GET request đến `/api/v1/cart`
- **Kết quả mong đợi**:
  - Status code: 200
  - Response có danh sách items trong cart
  - Có tổng giá trị (totalPrice)
- **Kết quả thực tế**: ✅ Pass

### TC-CART-006: Xóa toàn bộ giỏ hàng
- **Mức độ ưu tiên**: Medium
- **Loại test**: Functional - Positive
- **Điều kiện tiên quyết**: Cart có items
- **Bước thực hiện**:
  1. Gửi DELETE request đến `/api/v1/cart`
- **Kết quả mong đợi**:
  - Status code: 200
  - Cart trống
- **Kết quả thực tế**: ✅ Pass

---

## 2. TẠO ĐỚN HÀNG (CREATE ORDER)

### TC-ORDER-001: Tạo đơn hàng với thanh toán balance
- **Mức độ ưu tiên**: High
- **Loại test**: Functional - Positive
- **Điều kiện tiên quyết**: Cart có items, balance đủ
- **Bước thực hiện**:
  1. Gửi POST request đến `/api/v1/orders`
  2. Body: `{ "payments": "balance", "address": "...", "phone": "..." }`
- **Kết quả mong đợi**:
  - Status code: 201
  - Order được tạo với status "pending"
  - Balance bị trừ
  - Quantity sản phẩm giảm
  - Cart được clear
- **Kết quả thực tế**: ✅ Pass

### TC-ORDER-002: Tạo đơn hàng với balance không đủ
- **Mức độ ưu tiên**: High
- **Loại test**: Functional - Negative
- **Điều kiện tiên quyết**: Cart có items, balance < totalPrice
- **Bước thực hiện**:
  1. Gửi POST request đến `/api/v1/orders`
  2. Body: payments = "balance"
- **Kết quả mong đợi**:
  - Status code: 400
  - Error: "Insufficient balance"
  - Order không được tạo
- **Kết quả thực tế**: ✅ Pass

### TC-ORDER-003: Tạo đơn hàng với giỏ hàng rỗng
- **Mức độ ưu tiên**: High
- **Loại test**: Functional - Negative
- **Điều kiện tiên quyết**: Cart trống
- **Bước thực hiện**:
  1. Gửi POST request đến `/api/v1/orders`
- **Kết quả mong đợi**:
  - Status code: 400
  - Error: "Cart is empty"
- **Kết quả thực tế**: ✅ Pass

### TC-ORDER-004: Tạo đơn hàng với thanh toán VNPay
- **Mức độ ưu tiên**: High
- **Loại test**: Functional - Positive
- **Điều kiện tiên quyết**: Cart có items
- **Bước thực hiện**:
  1. Gửi POST request với payments = "vnpay"
- **Kết quả mong đợi**:
  - Status code: 200
  - Response có VNPay payment URL
  - Order được tạo với status "pending"
- **Kết quả thực tế**: ✅ Pass

### TC-ORDER-005: Tạo đơn hàng thiếu địa chỉ giao hàng
- **Mức độ ưu tiên**: Medium
- **Loại test**: Functional - Negative
- **Điều kiện tiên quyết**: Cart có items
- **Bước thực hiện**:
  1. Gửi POST request không có field address
- **Kết quả mong đợi**:
  - Status code: 400
  - Error về required field
- **Kết quả thực tế**: ✅ Pass

### TC-ORDER-006: Tạo đơn hàng với sản phẩm hết hàng
- **Mức độ ưu tiên**: High
- **Loại test**: Functional - Negative
- **Điều kiện tiên quyết**: Cart có sản phẩm quantity = 0
- **Bước thực hiện**:
  1. Gửi POST request đến `/api/v1/orders`
- **Kết quả mong đợi**:
  - Status code: 400
  - Error: "Product out of stock"
  - Order không được tạo
- **Kết quả thực tế**: ✅ Pass

---

## 3. XEM ĐỚN HÀNG (GET ORDERS)

### TC-ORDER-007: Xem danh sách đơn hàng của user
- **Mức độ ưu tiên**: High
- **Loại test**: Functional - Positive
- **Điều kiện tiên quyết**: User đã đăng nhập
- **Bước thực hiện**:
  1. Gửi GET request đến `/api/v1/orders`
- **Kết quả mong đợi**:
  - Status code: 200
  - Response có danh sách orders của user
  - Mỗi order có status, totalPrice, items
- **Kết quả thực tế**: ✅ Pass

### TC-ORDER-008: Xem chi tiết đơn hàng
- **Mức độ ưu tiên**: High
- **Loại test**: Functional - Positive
- **Điều kiện tiên quyết**: Order tồn tại
- **Bước thực hiện**:
  1. Gửi GET request đến `/api/v1/orders/:id`
- **Kết quả mong đợi**:
  - Status code: 200
  - Response có đầy đủ thông tin order
- **Kết quả thực tế**: ✅ Pass

### TC-ORDER-009: User xem đơn hàng của user khác
- **Mức độ ưu tiên**: High
- **Loại test**: Security - Negative
- **Điều kiện tiên quyết**: Order thuộc về user khác
- **Bước thực hiện**:
  1. User A gửi GET request đến order của User B
- **Kết quả mong đợi**:
  - Status code: 403
  - Error: "You can only view your own orders"
- **Kết quả thực tế**: ✅ Pass

### TC-ORDER-010: Admin xem tất cả đơn hàng
- **Mức độ ưu tiên**: High
- **Loại test**: Functional - Positive
- **Điều kiện tiên quyết**: Đăng nhập admin
- **Bước thực hiện**:
  1. Gửi GET request đến `/api/v1/orders/all` (admin route)
- **Kết quả mong đợi**:
  - Status code: 200
  - Response có tất cả orders trong hệ thống
- **Kết quả thực tế**: ✅ Pass

---

## 4. CẬP NHẬT TRẠNG THÁI ĐỚN HÀNG (UPDATE ORDER STATUS)

### TC-ORDER-011: Admin cập nhật trạng thái đơn hàng
- **Mức độ ưu tiên**: High
- **Loại test**: Functional - Positive
- **Điều kiện tiên quyết**: Order tồn tại, đăng nhập admin
- **Bước thực hiện**:
  1. Gửi PATCH request đến `/api/v1/orders/:id/status`
  2. Body: `{ "status": "shipping" }`
- **Kết quả mong đợi**:
  - Status code: 200
  - Order status được cập nhật
- **Kết quả thực tế**: ✅ Pass

### TC-ORDER-012: User cập nhật trạng thái đơn hàng
- **Mức độ ưu tiên**: High
- **Loại test**: Security - Negative
- **Điều kiện tiên quyết**: Đăng nhập user
- **Bước thực hiện**:
  1. User gửi PATCH request cập nhật status
- **Kết quả mong đợi**:
  - Status code: 403
  - Order status không thay đổi
- **Kết quả thực tế**: ✅ Pass

### TC-ORDER-013: Cập nhật trạng thái không hợp lệ
- **Mức độ ưu tiên**: Medium
- **Loại test**: Functional - Negative
- **Điều kiện tiên quyết**: Đăng nhập admin
- **Bước thực hiện**:
  1. Gửi PATCH request với status = "invalid_status"
- **Kết quả mong đợi**:
  - Status code: 400
  - Error về invalid status value
- **Kết quả thực tế**: ✅ Pass

### TC-ORDER-014: Cập nhật từ "delivered" về "pending"
- **Mức độ ưu tiên**: Medium
- **Loại test**: Business Logic - Negative
- **Điều kiện tiên quyết**: Order đã có status = "delivered"
- **Bước thực hiện**:
  1. Gửi PATCH request với status = "pending"
- **Kết quả mong đợi**:
  - Status code: 400
  - Error: "Cannot change status of completed order"
- **Kết quả thực tế**: ✅ Pass

---

## 5. HỦY ĐỚN HÀNG (CANCEL ORDER)

### TC-ORDER-015: User hủy đơn hàng đang pending
- **Mức độ ưu tiên**: High
- **Loại test**: Functional - Positive
- **Điều kiện tiên quyết**: Order status = "pending"
- **Bước thực hiện**:
  1. Gửi PATCH request đến `/api/v1/orders/:id/cancel`
- **Kết quả mong đợi**:
  - Status code: 200
  - Order status = "cancelled"
  - Balance được hoàn (nếu đã thanh toán)
  - Quantity sản phẩm được hoàn
- **Kết quả thực tế**: ✅ Pass

### TC-ORDER-016: User hủy đơn hàng đang shipping
- **Mức độ ưu tiên**: Medium
- **Loại test**: Business Logic - Negative
- **Điều kiện tiên quyết**: Order status = "shipping"
- **Bước thực hiện**:
  1. Gửi PATCH request cancel
- **Kết quả mong đợi**:
  - Status code: 400
  - Error: "Cannot cancel order in shipping"
- **Kết quả thực tế**: ✅ Pass

### TC-ORDER-017: User hủy đơn hàng của user khác
- **Mức độ ưu tiên**: High
- **Loại test**: Security - Negative
- **Điều kiện tiên quyết**: Order thuộc user khác
- **Bước thực hiện**:
  1. User A gửi cancel request cho order của User B
- **Kết quả mong đợi**:
  - Status code: 403
  - Order không bị hủy
- **Kết quả thực tế**: ✅ Pass

---

## 6. THANH TOÁN VNPAY (VNPAY CALLBACK)

### TC-VNPAY-001: VNPay callback thành công
- **Mức độ ưu tiên**: High
- **Loại test**: Integration - Positive
- **Điều kiện tiên quyết**: Order đã tạo với VNPay
- **Bước thực hiện**:
  1. Gửi GET request đến `/api/v1/orders/vnpay-return`
  2. Query params: vnp_ResponseCode=00, vnp_SecureHash=...
- **Kết quả mong đợi**:
  - Order status = "paid"
  - Transaction được tạo
  - Redirect về success page
- **Kết quả thực tế**: ✅ Pass

### TC-VNPAY-002: VNPay callback thất bại
- **Mức độ ưu tiên**: High
- **Loại test**: Integration - Negative
- **Điều kiện tiên quyết**: Order đã tạo với VNPay
- **Bước thực hiện**:
  1. Gửi GET request với vnp_ResponseCode != 00
- **Kết quả mong đợi**:
  - Order status = "cancelled"
  - Balance và quantity được rollback
  - Redirect về failure page
- **Kết quả thực tế**: ✅ Pass

### TC-VNPAY-003: VNPay callback với chữ ký sai
- **Mức độ ưu tiên**: High
- **Loại test**: Security - Negative
- **Điều kiện tiên quyết**: Order đã tạo
- **Bước thực hiện**:
  1. Gửi GET request với vnp_SecureHash không hợp lệ
- **Kết quả mong đợi**:
  - Status code: 400
  - Error: "Invalid signature"
  - Order không được cập nhật
- **Kết quả thực tế**: ✅ Pass

---

## TÓM TẮT

**Tổng số test cases**: 20  
**Passed**: 20  
**Failed**: 0  
**Tỷ lệ pass**: 100%

**Phân loại theo chức năng**:
- Giỏ hàng: 6 test cases
- Tạo đơn hàng: 6 test cases
- Xem đơn hàng: 4 test cases
- Cập nhật trạng thái: 4 test cases
- Hủy đơn hàng: 3 test cases
- VNPay: 3 test cases
