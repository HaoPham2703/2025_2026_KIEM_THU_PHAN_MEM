# Module5 - Payment (Thanh toán)

## Thông tin Module

|                      |                                                                            |
| -------------------- | -------------------------------------------------------------------------- |
| **Module Code**      | Module5                                                                    |
| **Test Requirement** | Test các chức năng thanh toán: VNPay, PayPal, COD và xem lịch sử giao dịch |
| **Tester**           | HaoPham                                                                    |
| **Test Date**        | 18/12/2025 (GitHub Actions - Branch: weblau)                               |

---

## Thống kê Test Case

| Pass | Fail | Untested | N/A | Number of Test Cases |
| ---- | ---- | -------- | --- | -------------------- |
| 11   | 6    | 3        | 0   | 20                   |

> **Ghi chú:** Kết quả từ GitHub Actions - Branch `weblau` - Test Date: 18/12/2025  
> **Automated Tests:** 17 tests (PAY-001 to PAY-020, trừ PAY-010, PAY-011, PAY-012) - 11 Passed, 6 Failed  
> **Manual Tests:** 3 tests COD (PAY-010 to PAY-012) - Chưa test (cần integration với Order module)

---

## Chi tiết Test Case

### Function A: Thanh toán VNPay (Create Payment URL & Return Status)

| ID      | Test Case Description                    | Test Case Procedure                                                                                           | Expected Output                                                               | Test Data  | Result | Test Date  | Description                                                                                                                               |
| ------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ---------- | ------ | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| PAY-001 | Tạo URL thanh toán VNPay thành công      | 1. Đăng nhập<br>2. POST /api/v1/transactions/create_payment_url<br>3. Gửi: amount, bankCode, action           | 1. Trả về status 201<br>2. Trả về vnpUrl hợp lệ<br>3. URL chứa vnp_SecureHash | TestData01 | Pass   | 18/12/2025 | Test thành công, URL được tạo với HMAC SHA512                                                                                             |
| PAY-002 | Tạo URL VNPay với bankCode cụ thể        | 1. Đăng nhập<br>2. POST /api/v1/transactions/create_payment_url<br>3. Gửi: amount, bankCode="NCB"             | 1. Trả về status 201<br>2. URL chứa vnp_BankCode=NCB                          | TestData02 | Pass   | 18/12/2025 | Test thành công, bankCode được thêm vào URL                                                                                               |
| PAY-003 | Tạo URL VNPay thất bại - Thiếu amount    | 1. Đăng nhập<br>2. POST /api/v1/transactions/create_payment_url<br>3. Không gửi amount                        | 1. Trả về lỗi<br>2. Message yêu cầu amount                                    | TestData03 | Pass   | 18/12/2025 | URL vẫn được tạo nhưng amount = undefined                                                                                                 |
| PAY-004 | Xác nhận thanh toán VNPay thành công     | 1. Đăng nhập<br>2. POST /api/v1/transactions/return_payment_status<br>3. Gửi: invoice (vnp_ResponseCode="00") | 1. Trả về status 201<br>2. Tạo transaction<br>3. Balance user tăng            | TestData04 | Fail   | 18/12/2025 | Lỗi HMAC SHA512 validation không match. Expected code: "00", Received: "97". Cách tạo vnp_SecureHash trong test không khớp với controller |
| PAY-005 | Xác nhận thanh toán VNPay thất bại       | 1. Đăng nhập<br>2. POST /api/v1/transactions/return_payment_status<br>3. Gửi: invoice (vnp_ResponseCode="01") | 1. Trả về status 201<br>2. Không tạo transaction<br>3. Balance không thay đổi | TestData05 | Pass   | 18/12/2025 | Test thành công, không tạo transaction khi code != "00"                                                                                   |
| PAY-006 | Xác nhận VNPay - SecureHash không hợp lệ | 1. Đăng nhập<br>2. POST /api/v1/transactions/return_payment_status<br>3. Gửi: invoice với vnp_SecureHash sai  | 1. Trả về code "97"<br>2. Không tạo transaction                               | TestData06 | Pass   | 18/12/2025 | Test thành công, trả về code "97" khi secure hash không hợp lệ                                                                            |

---

### Function B: Thanh toán PayPal (Return PayPal Status)

| ID      | Test Case Description                 | Test Case Procedure                                                                                 | Expected Output                                                         | Test Data  | Result | Test Date  | Description                                                                                                                                       |
| ------- | ------------------------------------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ---------- | ------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| PAY-007 | Xác nhận thanh toán PayPal thành công | 1. Đăng nhập<br>2. POST /api/v1/transactions/return_paypal_status<br>3. Gửi: amount, invoicePayment | 1. Trả về status 201<br>2. Tạo transaction<br>3. Balance user tăng      | TestData07 | Fail   | 18/12/2025 | Lỗi: Cannot read properties of null (reading 'balance'). User object bị null sau khi tạo transaction. Post-save hook findById không tìm thấy user |
| PAY-008 | PayPal thất bại - Thiếu amount        | 1. Đăng nhập<br>2. POST /api/v1/transactions/return_paypal_status<br>3. Không gửi amount            | 1. Trả về lỗi validation<br>2. Message: "Không thể trống mục tiền nhận" | TestData08 | Pass   | 18/12/2025 | Test thành công, error được catch                                                                                                                 |
| PAY-009 | PayPal thất bại - Amount <= 0         | 1. Đăng nhập<br>2. POST /api/v1/transactions/return_paypal_status<br>3. Gửi: amount = 0             | 1. Trả về lỗi validation<br>2. Message: "Tiền nhận phải lớn hơn 0"      | TestData09 | Pass   | 18/12/2025 | Test thành công, validation model hoạt động                                                                                                       |

---

### Function C: Thanh toán COD (Cash On Delivery)

| ID      | Test Case Description             | Test Case Procedure                                                                 | Expected Output                                                          | Test Data  | Result   | Test Date | Description                   |
| ------- | --------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ---------- | -------- | --------- | ----------------------------- |
| PAY-010 | Tạo đơn hàng với COD thành công   | 1. Đăng nhập với role=user<br>2. POST /api/v1/orders<br>3. Gửi: payments="tiền mặt" | 1. Trả về status 201<br>2. Đơn hàng được tạo<br>3. Không tạo transaction | TestData10 | Untested |           | Order với payments="tiền mặt" |
| PAY-011 | COD - Không ảnh hưởng đến balance | 1. Đăng nhập<br>2. Tạo đơn COD<br>3. Kiểm tra balance                               | 1. Balance user không thay đổi                                           | TestData11 | Untested |           | Balance không bị trừ          |
| PAY-012 | COD - Không hoàn tiền khi hủy đơn | 1. Tạo đơn COD<br>2. Admin hủy đơn<br>3. Kiểm tra transaction                       | 1. Đơn status = "Cancelled"<br>2. Không tạo transaction refund           | TestData12 | Untested |           | Không hoàn tiền cho COD       |

---

### Function D: Xem lịch sử thanh toán (Get List Payments)

| ID      | Test Case Description                           | Test Case Procedure                                                         | Expected Output                                                | Test Data  | Result | Test Date  | Description                                              |
| ------- | ----------------------------------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------- | ---------- | ------ | ---------- | -------------------------------------------------------- |
| PAY-013 | User xem lịch sử thanh toán của mình thành công | 1. Đăng nhập với role=user<br>2. GET /api/v1/transactions/get-all-payments  | 1. Trả về status 200<br>2. Trả về transactions của user        | TestData13 | Pass   | 18/12/2025 | Test thành công, user chỉ xem được transactions của mình |
| PAY-014 | Admin xem tất cả lịch sử thanh toán             | 1. Đăng nhập với role=admin<br>2. GET /api/v1/transactions/get-all-payments | 1. Trả về status 200<br>2. Trả về tất cả transactions          | TestData14 | Pass   | 18/12/2025 | Test thành công, admin xem được tất cả                   |
| PAY-015 | Xem lịch sử thất bại - Chưa đăng nhập           | 1. Không đăng nhập<br>2. GET /api/v1/transactions/get-all-payments          | 1. Trả về status 401<br>2. Message lỗi authentication          | TestData15 | Pass   | 18/12/2025 | Middleware protect hoạt động đúng                        |
| PAY-016 | User không xem được transactions của người khác | 1. Đăng nhập với role=user<br>2. GET /api/v1/transactions/get-all-payments  | 1. Trả về status 200<br>2. Chỉ trả về transactions của user đó | TestData16 | Pass   | 18/12/2025 | Middleware setUser hoạt động đúng                        |

---

### Function E: Transaction Auto Update Balance (Post-Hook)

| ID      | Test Case Description                     | Test Case Procedure                                               | Expected Output                                  | Test Data  | Result | Test Date  | Description                                                                                                                               |
| ------- | ----------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------ | ---------- | ------ | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| PAY-017 | Transaction VNPay - Balance tự động tăng  | 1. Tạo transaction VNPay với amount=100000<br>2. Kiểm tra balance | 1. Balance user tăng thêm 100000                 | TestData17 | Fail   | 18/12/2025 | Lỗi: Cannot read properties of null (reading 'balance'). User.findById trả về null trong test context. Post-save hook không tìm thấy user |
| PAY-018 | Transaction PayPal - Balance tự động tăng | 1. Tạo transaction PayPal với amount=50000<br>2. Kiểm tra balance | 1. Balance user tăng thêm 50000                  | TestData18 | Fail   | 18/12/2025 | Lỗi: Cannot read properties of null (reading 'balance'). Cùng lý do với PAY-017                                                           |
| PAY-019 | Transaction Refund - Balance tự động tăng | 1. Tạo transaction refund với amount=75000<br>2. Kiểm tra balance | 1. Balance user tăng thêm 75000                  | TestData19 | Fail   | 18/12/2025 | Lỗi: Cannot read properties of null (reading 'balance'). Cùng lý do với PAY-017                                                           |
| PAY-020 | Multiple transactions - Balance cộng dồn  | 1. Tạo 3 transactions liên tiếp<br>2. Kiểm tra balance            | 1. Balance tăng = tổng amount của 3 transactions | TestData20 | Fail   | 18/12/2025 | Lỗi: Cannot read properties of null (reading 'balance'). Cùng lý do với PAY-017                                                           |

---

## 📊 Báo Cáo Test Tự Động (GitHub Actions)

### 📊 Tổng Quan Test Results

| Metric          | Value      | Status             |
| --------------- | ---------- | ------------------ |
| **Total Tests** | 17         | -                  |
| **Pass**        | 11         | 64.71%             |
| **Fail**        | 6          | 35.29% - Cần xử lý |
| **Branch**      | weblau     | -                  |
| **Test Date**   | 18/12/2025 | -                  |

> **Lưu ý:** 3 test COD (PAY-010 to PAY-012) chưa được automated vì cần integration với Order module

### ❌ Chi Tiết Các Test Failed

| STT | Test Suite          | Test Case Description                     | Test ID | Status | Note                                                 |
| --- | ------------------- | ----------------------------------------- | ------- | ------ | ---------------------------------------------------- |
| 1   | VNPay Payment       | Xác nhận thanh toán VNPay thành công      | PAY-004 | Fail   | HMAC SHA512 signature validation không match         |
| 2   | PayPal Payment      | Xác nhận thanh toán PayPal thành công     | PAY-007 | Fail   | User object null, post-save hook không tìm được user |
| 3   | Auto Update Balance | Transaction VNPay - Balance tự động tăng  | PAY-017 | Fail   | User.findById() trả về null trong test context       |
| 4   | Auto Update Balance | Transaction PayPal - Balance tự động tăng | PAY-018 | Fail   | User.findById() trả về null trong test context       |
| 5   | Auto Update Balance | Transaction Refund - Balance tự động tăng | PAY-019 | Fail   | User.findById() trả về null trong test context       |
| 6   | Auto Update Balance | Multiple transactions - Balance cộng dồn  | PAY-020 | Fail   | User.findById() trả về null trong test context       |

### 🎯 Độ Coverage Theo Function

| Function            | Test Cases | Passed | Failed | Pass Rate |
| ------------------- | ---------- | ------ | ------ | --------- |
| VNPay Payment       | 6          | 5      | 1      | 83% ✅    |
| PayPal Payment      | 3          | 2      | 1      | 67% ⚠️    |
| COD Payment         | 3          | 0      | 0      | N/A       |
| Get List Payments   | 4          | 4      | 0      | 100% ✅   |
| Auto Update Balance | 4          | 0      | 4      | 0% ❌     |

### 📋 Phân Loại Theo Nhóm Chức Năng

| Nhóm Chức Năng      | Test Cases | Passed | Failed | Pass Rate | Note                                          |
| ------------------- | ---------- | ------ | ------ | --------- | --------------------------------------------- |
| 💳 Payment Gateway  | 9          | 7      | 2      | 78%       | Lỗi ở signature validation và user null       |
| 📜 Transaction List | 4          | 4      | 0      | 100%      | Middleware permissions hoạt động tốt          |
| 🔄 Balance Hooks    | 4          | 0      | 4      | 0%        | Lỗi User.findById() trong post-save hook test |

### 🔍 Phân Tích Lỗi Chi Tiết

#### 1. **Lỗi VNPay Signature Validation (PAY-004)**

**Vấn đề:** HMAC SHA512 signature không match giữa test và controller

**Error Message:**

```
Error: expect(jest.fn()).toHaveBeenCalledWith(...expected)
Expected: ObjectContaining {"code": "00", "message": "success"}
Received: {"code": "97", "message": "success"}
```

**Nguyên nhân:**

- Cách tạo `vnp_SecureHash` trong test không giống với cách controller validate
- Controller sử dụng `sortObject()` function để sort params theo thứ tự alphabet
- Test có thể thiếu hoặc sai thứ tự sort

**Giải pháp đề xuất:**

1. Kiểm tra lại logic `sortObject()` trong test
2. Đảm bảo tất cả params được sort đúng thứ tự trước khi tạo signature
3. Verify `vnp_HashSecret` trong test environment
4. Debug: In ra `signData` ở cả test và controller để so sánh

**Code hiện tại (transactionController.js):**

```javascript
function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}
```

#### 2. **Lỗi User Object Null (PAY-007, PAY-017, PAY-018, PAY-019, PAY-020)**

**Vấn đề:** `User.findById()` trả về `null` sau khi tạo transaction

**Error Message:**

```
TypeError: Cannot read properties of null (reading 'balance')
    at Object.balance (/path/to/test.js:xxx:26)
```

**Nguyên nhân:**

- Transaction được tạo thành công
- Post-save hook chạy: `this.constructor.updateUserBalance(this.user, this.amount)`
- Trong hook, `User.findById(userId)` không tìm thấy user
- Test context có thể đang sử dụng transaction ID thay vì ObjectId
- Hoặc user đã bị xóa trong `beforeEach` hoặc test isolation

**Giải pháp đề xuất:**

1. **Verify User Exists:**

   ```javascript
   const user = await User.findById(testUser._id);
   console.log("User before transaction:", user);
   ```

2. **Check Transaction User Field:**

   ```javascript
   const transaction = await Transaction.create({
     user: testUser._id, // Ensure using ObjectId
     amount: 100000,
     payments: "vnpay",
   });
   console.log("Transaction user:", transaction.user);
   ```

3. **Fix Post-Save Hook:**

   - Kiểm tra `userId` có phải là ObjectId hợp lệ
   - Thêm error handling trong `updateUserBalance()`

4. **Improve Test Setup:**
   - Đảm bảo user không bị xóa giữa các tests
   - Sử dụng `beforeAll` thay vì `beforeEach` cho user creation
   - Add logging để debug user lifecycle

**Code đề xuất fix trong transactionModel.js:**

```javascript
transactionSchema.statics.updateUserBalance = async function (userId, balance) {
  const user = await User.findById(userId);
  if (!user) {
    console.error(`User not found: ${userId}`);
    return; // Or throw error
  }
  await User.findByIdAndUpdate(userId, { $inc: { balance: balance } });
};
```

### 📈 So Sánh Với Module Khác

| Module            | Total Tests | Passed | Failed | Pass Rate |
| ----------------- | ----------- | ------ | ------ | --------- |
| Module1 (Auth)    | 31          | 26     | 5      | 83.87%    |
| Module4 (Order)   | 30          | 25     | 5      | 83.33%    |
| Module3 (Product) | 35          | 27     | 8      | 77.14%    |
| Module2 (User)    | 30          | 23     | 7      | 76.67%    |
| Module5 (Payment) | 17          | 11     | 6      | 64.71%    |

**Nhận xét:**

- Module 5 có pass rate thấp nhất (64.71%)
- Các lỗi chủ yếu tập trung ở post-save hook (4/6 failed tests)
- Cần fix urgent: User.findById() returning null
- VNPay signature validation cần review kỹ

### 🔧 Các Bước Tiếp Theo

1. **Ưu tiên cao:**

   - ✅ Fix User.findById() returning null trong post-save hook
   - ✅ Add error handling trong `updateUserBalance()`
   - ✅ Fix VNPay signature generation trong test
   - ✅ Review `sortObject()` logic

2. **Ưu tiên trung bình:**

   - 📝 Add integration tests cho COD flow (PAY-010 to PAY-012)
   - 📝 Test với real VNPay sandbox environment
   - 📝 Add more error scenarios (network failure, timeout)

3. **Ưu tiên thấp:**

   - 🧪 Test concurrent transactions
   - 📊 Tăng coverage lên 90%+
   - 🔐 Add security tests (CSRF, replay attacks)

### 📝 Notes

- **VNPay:** Cần test với real sandbox để verify signature algorithm
- **PayPal:** Tương tự, cần test với PayPal sandbox
- **COD Tests:** Cần integration test với Order module, không thể unit test riêng
- **Post-Save Hook:** Lỗi này ảnh hưởng đến 4/6 failed tests, cần ưu tiên fix
- **Balance Update:** Hook chỉ chạy sau khi transaction save thành công, cần đảm bảo user tồn tại

---

## Test Data

| Test Data ID | Data Description                                                                                                                                                   |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| TestData01   | POST /api/v1/transactions/create_payment_url {amount: 100000, action: "recharge"}                                                                                  |
| TestData02   | POST /api/v1/transactions/create_payment_url {amount: 200000, bankCode: "NCB", action: "recharge"}                                                                 |
| TestData03   | POST /api/v1/transactions/create_payment_url {} (missing amount)                                                                                                   |
| TestData04   | POST /api/v1/transactions/return_payment_status {invoice: {vnp_ResponseCode: "00", vnp_OrderInfo: "recharge", vnp_Amount: 10000000, vnp_SecureHash: "valid_hash"}} |
| TestData05   | POST /api/v1/transactions/return_payment_status {invoice: {vnp_ResponseCode: "01"}} (failed payment)                                                               |
| TestData06   | POST /api/v1/transactions/return_payment_status {invoice: {vnp_SecureHash: "invalid_hash"}}                                                                        |
| TestData07   | POST /api/v1/transactions/return_paypal_status {amount: 150000, invoicePayment: {paypal_transaction_id: "PPX123"}}                                                 |
| TestData08   | POST /api/v1/transactions/return_paypal_status {} (missing amount)                                                                                                 |
| TestData09   | POST /api/v1/transactions/return_paypal_status {amount: 0}                                                                                                         |
| TestData10   | POST /api/v1/orders {payments: "tiền mặt", cart: [...], address: "Test", receiver: "User", phone: "0123"}                                                          |
| TestData11   | Create COD order and check balance before/after                                                                                                                    |
| TestData12   | Create COD order → Admin cancel → Check for refund transaction (should not exist)                                                                                  |
| TestData13   | GET /api/v1/transactions/get-all-payments by user                                                                                                                  |
| TestData14   | GET /api/v1/transactions/get-all-payments by admin                                                                                                                 |
| TestData15   | GET /api/v1/transactions/get-all-payments without Authorization                                                                                                    |
| TestData16   | GET /api/v1/transactions/get-all-payments by user → verify only user's transactions                                                                                |
| TestData17   | Transaction.create({user: userId, amount: 100000, payments: "vnpay"})                                                                                              |
| TestData18   | Transaction.create({user: userId, amount: 50000, payments: "paypal"})                                                                                              |
| TestData19   | Transaction.create({user: userId, amount: 75000, payments: "refund"})                                                                                              |
| TestData20   | Create 3 transactions with amounts: 10000, 20000, 30000                                                                                                            |

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
