# Module5 - Payment (Thanh toán)

## Thông tin Module

|                      |                                                                                           |
| -------------------- | ----------------------------------------------------------------------------------------- |
| **Module Code**      | Module5                                                                                   |
| **Test Requirement** | Test các chức năng thanh toán: VNPay, PayPal, COD và xem lịch sử giao dịch              |
| **Tester**           | HaoPham                                                                                   |
| **Test Date**        | 18/12/2025 (GitHub Actions - Branch: weblau)                                              |

---

## Thống kê Test Case

| Pass | Fail | Untested | N/A | Number of Test Cases |
| ---- | ---- | -------- | --- | -------------------- |
| 0    | 0    | 20       | 0   | 20                   |

> **Ghi chú:** Kết quả từ GitHub Actions - Branch `weblau` - Test Date: 18/12/2025

---

## Chi tiết Test Case

### Function A: Thanh toán VNPay (Create Payment URL & Return Status)

| ID      | Test Case Description                          | Test Case Procedure                                                                              | Expected Output                                                                     | Test Data  | Result   | Test Date | Description                |
| ------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- | ---------- | -------- | --------- | -------------------------- |
| PAY-001 | Tạo URL thanh toán VNPay thành công            | 1. Đăng nhập<br>2. POST /api/v1/transactions/create_payment_url<br>3. Gửi: amount, bankCode, action | 1. Trả về status 201<br>2. Trả về vnpUrl hợp lệ<br>3. URL chứa vnp_SecureHash      | TestData01 | Untested |           | User đã đăng nhập          |
| PAY-002 | Tạo URL VNPay với bankCode cụ thể              | 1. Đăng nhập<br>2. POST /api/v1/transactions/create_payment_url<br>3. Gửi: amount, bankCode="NCB" | 1. Trả về status 201<br>2. URL chứa vnp_BankCode=NCB                               | TestData02 | Untested |           | Chỉ định ngân hàng         |
| PAY-003 | Tạo URL VNPay thất bại - Thiếu amount          | 1. Đăng nhập<br>2. POST /api/v1/transactions/create_payment_url<br>3. Không gửi amount           | 1. Trả về lỗi<br>2. Message yêu cầu amount                                         | TestData03 | Untested |           | Missing required field     |
| PAY-004 | Xác nhận thanh toán VNPay thành công           | 1. Đăng nhập<br>2. POST /api/v1/transactions/return_payment_status<br>3. Gửi: invoice (vnp_ResponseCode="00") | 1. Trả về status 201<br>2. Tạo transaction<br>3. Balance user tăng                 | TestData04 | Untested |           | vnp_ResponseCode = "00"    |
| PAY-005 | Xác nhận thanh toán VNPay thất bại             | 1. Đăng nhập<br>2. POST /api/v1/transactions/return_payment_status<br>3. Gửi: invoice (vnp_ResponseCode="01") | 1. Trả về status 201<br>2. Không tạo transaction<br>3. Balance không thay đổi      | TestData05 | Untested |           | vnp_ResponseCode != "00"   |
| PAY-006 | Xác nhận VNPay - SecureHash không hợp lệ       | 1. Đăng nhập<br>2. POST /api/v1/transactions/return_payment_status<br>3. Gửi: invoice với vnp_SecureHash sai | 1. Trả về code "97"<br>2. Không tạo transaction                                     | TestData06 | Untested |           | Security check failed      |

---

### Function B: Thanh toán PayPal (Return PayPal Status)

| ID      | Test Case Description                    | Test Case Procedure                                                                                | Expected Output                                                      | Test Data  | Result   | Test Date | Description         |
| ------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ---------- | -------- | --------- | ------------------- |
| PAY-007 | Xác nhận thanh toán PayPal thành công    | 1. Đăng nhập<br>2. POST /api/v1/transactions/return_paypal_status<br>3. Gửi: amount, invoicePayment | 1. Trả về status 201<br>2. Tạo transaction<br>3. Balance user tăng   | TestData07 | Untested |           | User đã đăng nhập   |
| PAY-008 | PayPal thất bại - Thiếu amount           | 1. Đăng nhập<br>2. POST /api/v1/transactions/return_paypal_status<br>3. Không gửi amount            | 1. Trả về lỗi validation<br>2. Message: "Không thể trống mục tiền nhận" | TestData08 | Untested |           | Missing required    |
| PAY-009 | PayPal thất bại - Amount <= 0            | 1. Đăng nhập<br>2. POST /api/v1/transactions/return_paypal_status<br>3. Gửi: amount = 0             | 1. Trả về lỗi validation<br>2. Message: "Tiền nhận phải lớn hơn 0"     | TestData09 | Untested |           | Validation rule     |

---

### Function C: Thanh toán COD (Cash On Delivery)

| ID      | Test Case Description                       | Test Case Procedure                                                                   | Expected Output                                                            | Test Data  | Result   | Test Date | Description                    |
| ------- | ------------------------------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ---------- | -------- | --------- | ------------------------------ |
| PAY-010 | Tạo đơn hàng với COD thành công             | 1. Đăng nhập với role=user<br>2. POST /api/v1/orders<br>3. Gửi: payments="tiền mặt"   | 1. Trả về status 201<br>2. Đơn hàng được tạo<br>3. Không tạo transaction  | TestData10 | Untested |           | Order với payments="tiền mặt"  |
| PAY-011 | COD - Không ảnh hưởng đến balance           | 1. Đăng nhập<br>2. Tạo đơn COD<br>3. Kiểm tra balance                                  | 1. Balance user không thay đổi                                             | TestData11 | Untested |           | Balance không bị trừ           |
| PAY-012 | COD - Không hoàn tiền khi hủy đơn           | 1. Tạo đơn COD<br>2. Admin hủy đơn<br>3. Kiểm tra transaction                          | 1. Đơn status = "Cancelled"<br>2. Không tạo transaction refund            | TestData12 | Untested |           | Không hoàn tiền cho COD        |

---

### Function D: Xem lịch sử thanh toán (Get List Payments)

| ID      | Test Case Description                           | Test Case Procedure                                                 | Expected Output                                                      | Test Data  | Result   | Test Date | Description                |
| ------- | ----------------------------------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------- | ---------- | -------- | --------- | -------------------------- |
| PAY-013 | User xem lịch sử thanh toán của mình thành công | 1. Đăng nhập với role=user<br>2. GET /api/v1/transactions/get-all-payments | 1. Trả về status 200<br>2. Trả về transactions của user              | TestData13 | Untested |           | User đã đăng nhập          |
| PAY-014 | Admin xem tất cả lịch sử thanh toán             | 1. Đăng nhập với role=admin<br>2. GET /api/v1/transactions/get-all-payments | 1. Trả về status 200<br>2. Trả về tất cả transactions                | TestData14 | Untested |           | Role = admin               |
| PAY-015 | Xem lịch sử thất bại - Chưa đăng nhập           | 1. Không đăng nhập<br>2. GET /api/v1/transactions/get-all-payments          | 1. Trả về status 401<br>2. Message lỗi authentication                | TestData15 | Untested |           | Unauthorized               |
| PAY-016 | User không xem được transactions của người khác | 1. Đăng nhập với role=user<br>2. GET /api/v1/transactions/get-all-payments  | 1. Trả về status 200<br>2. Chỉ trả về transactions của user đó       | TestData16 | Untested |           | Middleware setUser hoạt động|

---

### Function E: Transaction Auto Update Balance (Post-Hook)

| ID      | Test Case Description                      | Test Case Procedure                                                | Expected Output                                      | Test Data  | Result   | Test Date | Description             |
| ------- | ------------------------------------------ | ------------------------------------------------------------------ | ---------------------------------------------------- | ---------- | -------- | --------- | ----------------------- |
| PAY-017 | Transaction VNPay - Balance tự động tăng   | 1. Tạo transaction VNPay với amount=100000<br>2. Kiểm tra balance  | 1. Balance user tăng thêm 100000                     | TestData17 | Untested |           | Post-save hook          |
| PAY-018 | Transaction PayPal - Balance tự động tăng  | 1. Tạo transaction PayPal với amount=50000<br>2. Kiểm tra balance  | 1. Balance user tăng thêm 50000                      | TestData18 | Untested |           | Post-save hook          |
| PAY-019 | Transaction Refund - Balance tự động tăng  | 1. Tạo transaction refund với amount=75000<br>2. Kiểm tra balance  | 1. Balance user tăng thêm 75000                      | TestData19 | Untested |           | Order cancelled refund  |
| PAY-020 | Multiple transactions - Balance cộng dồn   | 1. Tạo 3 transactions liên tiếp<br>2. Kiểm tra balance             | 1. Balance tăng = tổng amount của 3 transactions     | TestData20 | Untested |           | Accumulation test       |

---

## Test Data

| Test Data ID | Data Description                                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------------------------------- |
| TestData01   | POST /api/v1/transactions/create_payment_url {amount: 100000, action: "recharge"}                                  |
| TestData02   | POST /api/v1/transactions/create_payment_url {amount: 200000, bankCode: "NCB", action: "recharge"}                 |
| TestData03   | POST /api/v1/transactions/create_payment_url {} (missing amount)                                                   |
| TestData04   | POST /api/v1/transactions/return_payment_status {invoice: {vnp_ResponseCode: "00", vnp_OrderInfo: "recharge", vnp_Amount: 10000000, vnp_SecureHash: "valid_hash"}} |
| TestData05   | POST /api/v1/transactions/return_payment_status {invoice: {vnp_ResponseCode: "01"}} (failed payment)              |
| TestData06   | POST /api/v1/transactions/return_payment_status {invoice: {vnp_SecureHash: "invalid_hash"}}                       |
| TestData07   | POST /api/v1/transactions/return_paypal_status {amount: 150000, invoicePayment: {paypal_transaction_id: "PPX123"}} |
| TestData08   | POST /api/v1/transactions/return_paypal_status {} (missing amount)                                                 |
| TestData09   | POST /api/v1/transactions/return_paypal_status {amount: 0}                                                         |
| TestData10   | POST /api/v1/orders {payments: "tiền mặt", cart: [...], address: "Test", receiver: "User", phone: "0123"}         |
| TestData11   | Create COD order and check balance before/after                                                                    |
| TestData12   | Create COD order → Admin cancel → Check for refund transaction (should not exist)                                  |
| TestData13   | GET /api/v1/transactions/get-all-payments by user                                                                  |
| TestData14   | GET /api/v1/transactions/get-all-payments by admin                                                                 |
| TestData15   | GET /api/v1/transactions/get-all-payments without Authorization                                                    |
| TestData16   | GET /api/v1/transactions/get-all-payments by user → verify only user's transactions                                |
| TestData17   | Transaction.create({user: userId, amount: 100000, payments: "vnpay"})                                             |
| TestData18   | Transaction.create({user: userId, amount: 50000, payments: "paypal"})                                             |
| TestData19   | Transaction.create({user: userId, amount: 75000, payments: "refund"})                                             |
| TestData20   | Create 3 transactions with amounts: 10000, 20000, 30000                                                            |

---

## Ghi chú

1. **Payment Methods:**

   - **VNPay:** Cổng thanh toán trực tuyến Việt Nam
     - `createPaymentUrl`: Tạo URL để redirect user đến VNPay
     - `returnPaymentStatus`: Xác nhận kết quả thanh toán từ VNPay callback
   - **PayPal:** Cổng thanh toán quốc tế
     - `returnPaypalStatus`: Xác nhận kết quả thanh toán từ PayPal
   - **COD (Cash On Delivery):** Thanh toán khi nhận hàng
     - Được xử lý khi tạo order với `payments="tiền mặt"`
     - Không tạo transaction ngay
     - Không hoàn tiền khi hủy đơn

2. **Transaction API Endpoints:**

   - POST `/api/v1/transactions/create_payment_url` - Tạo URL VNPay (Protected)
   - POST `/api/v1/transactions/return_payment_status` - Callback VNPay (Protected)
   - POST `/api/v1/transactions/return_paypal_status` - Callback PayPal (Protected)
   - GET `/api/v1/transactions/get-all-payments` - Xem lịch sử (Protected)

3. **VNPay Integration:**

   - Sử dụng HMAC SHA512 để tạo secure hash
   - Parameters: vnp_TmnCode, vnp_HashSecret, vnp_Url, vnp_ReturnUrl
   - Response codes:
     - `00`: Giao dịch thành công
     - `01`: Giao dịch chưa hoàn tất
     - `97`: Chữ ký không hợp lệ
   - OrderInfo: "recharge" (nạp tiền vào tài khoản)

4. **Transaction Model:**

   - **Fields:** user, amount, createdAt, payments, order, invoicePayment
   - **Payments enum:** ["vnpay", "paypal", "refund"]
   - **Post-save hook:** Tự động cập nhật user balance khi tạo transaction
   - **Validation:**
     - amount phải > 0
     - user bắt buộc
     - payments bắt buộc

5. **Business Rules:**

   - Tất cả routes yêu cầu authentication (protect middleware)
   - User chỉ xem được transactions của mình (setUser middleware)
   - Admin xem được tất cả transactions
   - Balance tự động tăng khi tạo transaction (post-save hook)
   - VNPay chỉ tạo transaction khi:
     - vnp_ResponseCode = "00" (thành công)
     - vnp_OrderInfo = "recharge" (nạp tiền)
     - vnp_SecureHash hợp lệ
   - COD không tạo transaction khi tạo đơn
   - Refund transaction được tạo tự động khi hủy đơn (không phải COD)

6. **Security:**

   - HMAC SHA512 signature validation cho VNPay
   - Middleware protect trên tất cả routes
   - Middleware setUser để giới hạn quyền truy cập
   - Environment variables cho VNPay credentials

7. **Integration với Order:**
   - Khi tạo đơn với `payments="số dư"`: balance user giảm (trong Order model)
   - Khi hủy đơn không phải COD: tạo transaction refund (trong Order model post-hook)
   - COD không ảnh hưởng đến balance và transaction

8. **Testing Notes:**
   - Mock VNPay API calls
   - Mock crypto functions (HMAC SHA512)
   - Mock environment variables
   - Test post-save hook với real database
   - Test integration với Order module

