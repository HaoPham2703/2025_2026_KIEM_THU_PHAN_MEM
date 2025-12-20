# Module5 - Payment Test Workflow

## 📋 Tổng quan

Workflow này tự động chạy test cho **Module 5 - Payment (Thanh toán)**, bao gồm:

- 💳 **VNPay Payment:** Tạo URL thanh toán và xác nhận callback
- 🌐 **PayPal Payment:** Xác nhận thanh toán PayPal
- 💵 **COD Payment:** Thanh toán khi nhận hàng (Cash On Delivery)
- 📜 **Transaction History:** Xem lịch sử giao dịch
- 🔄 **Auto Balance Update:** Post-save hook tự động cập nhật số dư

---

## 🎯 Mục đích

- Đảm bảo tất cả phương thức thanh toán hoạt động đúng
- Kiểm tra bảo mật (HMAC SHA512 cho VNPay)
- Kiểm tra quyền truy cập (User vs Admin)
- Kiểm tra business rules (balance update, refund, COD)
- Tạo báo cáo tự động sau mỗi lần commit

---

## ⚙️ Cấu hình Workflow

### Trigger

Workflow chạy khi:

- **Push** code lên branch `weblau`
- **Pull Request** vào branch `weblau`

```yaml
on:
  push:
    branches: [weblau]
  pull_request:
    branches: [weblau]
```

### Environment Variables

```yaml
env:
  NODE_ENV: test
  JWT_SECRET: test-jwt-secret-key-for-module5-testing
  JWT_EXPIRES_IN: 90d
  JWT_COOKIE_EXPIRES_IN: 90
  vnp_TmnCode: TEST_TMN_CODE
  vnp_HashSecret: TEST_SECRET_KEY
  vnp_Url: https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
  vnp_ReturnUrl: http://localhost:3000/payment/return
  vnp_Locale: vn
```

---

## 🧪 Test Coverage

### Payment Functions (20 tests)

| Function                  | Test Cases | Description                                |
| ------------------------- | ---------- | ------------------------------------------ |
| **VNPay Payment**         | 6 tests    | Create URL, Return status, Security       |
| **PayPal Payment**        | 3 tests    | Return status, Validation                 |
| **COD Payment**           | 3 tests    | Cash on delivery, Balance handling        |
| **Get List Payments**     | 4 tests    | View history, Permission check            |
| **Auto Update Balance**   | 4 tests    | Post-save hook, Balance accumulation      |

**Test IDs:** PAY-001 to PAY-020

---

## 📊 Workflow Steps

### 1. 📥 Checkout code

Tải source code từ repository

### 2. 🟢 Setup Node.js

Cài đặt Node.js 18.x với npm cache

### 3. 📦 Install dependencies

```bash
cd Back-end
npm install
```

### 4. 🧪 Run Module5 Tests

```bash
npm test -- transactionController.test.js --json --outputFile=module5-test-results.json
```

- **Test file:** `transactionController.test.js`
- **Output:** `module5-test-results.json`
- **Timeout:** 5 phút
- **Continue on error:** true (để tạo report)

### 5. 📊 Generate Test Report

Tạo báo cáo chi tiết bao gồm:

- 📈 Test Statistics (Total, Passed, Failed)
- 🎯 Test Coverage by Function
- ❌ Failed Tests Details (nếu có)
- 📚 Test Case Mapping

Báo cáo được ghi vào `$GITHUB_STEP_SUMMARY` và hiển thị trên GitHub Actions UI.

### 6. 📤 Upload Test Results

Upload `module5-test-results.json` làm artifact (lưu 30 ngày)

### 7. 📊 Generate Coverage

```bash
npm test -- transactionController.test.js --coverage --coverageDirectory=./coverage-module5
```

### 8. 📤 Upload Coverage

Upload coverage report làm artifact (lưu 30 ngày)

### 9. 💬 Comment PR with Results

Nếu là Pull Request, tự động comment kết quả test vào PR

### 10. ❌ Fail if tests failed

Workflow sẽ fail nếu có test nào không pass

---

## 📋 Test Case Details

Chi tiết test cases xem tại: [`Module5_Payment.md`](../../Module5_Payment.md)

### Test Case Structure

```
PAY-001 to PAY-006: VNPay Payment
  - Create Payment URL (3 tests)
  - Return Payment Status (3 tests)

PAY-007 to PAY-009: PayPal Payment
  - Return PayPal Status (3 tests)

PAY-010 to PAY-012: COD Payment
  - COD Order Creation (3 tests)

PAY-013 to PAY-016: Get List Payments
  - View History (4 tests)

PAY-017 to PAY-020: Auto Update Balance
  - Post-save Hook (4 tests)
```

### Payment Methods Tested

1. **VNPay (Cổng thanh toán Việt Nam):**

   - Tạo URL thanh toán với HMAC SHA512
   - Xác nhận callback từ VNPay
   - Kiểm tra vnp_SecureHash
   - Kiểm tra vnp_ResponseCode
   - Chỉ tạo transaction khi: code=00 và action=recharge

2. **PayPal (Cổng thanh toán quốc tế):**

   - Xác nhận thanh toán thành công
   - Validation amount
   - Tạo transaction và cập nhật balance

3. **COD (Cash On Delivery):**

   - Thanh toán khi nhận hàng
   - Không tạo transaction ngay
   - Không ảnh hưởng đến balance
   - Không hoàn tiền khi hủy đơn

4. **Transaction History:**

   - User xem transactions của mình
   - Admin xem tất cả transactions
   - Middleware setUser giới hạn quyền

5. **Auto Balance Update:**
   - Post-save hook tự động cập nhật balance
   - Balance tăng khi tạo transaction
   - Hỗ trợ vnpay, paypal, refund

---

## 🔍 Xem Kết quả Test

### Trên GitHub Actions UI

1. Vào tab **Actions** trên GitHub
2. Chọn workflow **Module5 - Payment Test**
3. Chọn run gần nhất
4. Xem **Summary** để thấy báo cáo chi tiết

### Download Artifacts

Artifacts có sẵn sau mỗi lần chạy:

- `module5-payment-test-results`: File JSON chứa kết quả test
- `module5-payment-coverage`: Báo cáo coverage

---

## ⚠️ Troubleshooting

### Test fails do VNPay configuration

**Lỗi:** `Cannot read property 'vnp_TmnCode' of undefined`

**Giải pháp:** Check environment variables trong workflow file.

### Test fails do crypto module

**Lỗi:** `crypto.createHmac is not a function`

**Giải pháp:** Node.js crypto module được mock đúng cách trong test.

### Balance not updating

**Lỗi:** Balance không tăng sau khi tạo transaction

**Giải pháp:** Kiểm tra post-save hook trong Transaction model.

### SecureHash validation fails

**Lỗi:** vnp_SecureHash không khớp

**Giải pháp:**

- Kiểm tra vnp_HashSecret
- Đảm bảo params được sort đúng thứ tự
- Verify HMAC SHA512 implementation

---

## 💡 Lưu ý

1. **VNPay Integration:**

   - Sử dụng sandbox environment trong test
   - Mock crypto functions (HMAC SHA512)
   - Test với valid và invalid secure hash

2. **PayPal Integration:**

   - Mock PayPal API responses
   - Test validation rules

3. **COD Business Rules:**

   - COD không tạo transaction ngay
   - Không hoàn tiền khi hủy đơn COD
   - Balance không bị trừ

4. **Balance Update:**

   - Post-save hook chạy tự động
   - Hỗ trợ tất cả payment methods
   - Cộng dồn balance với multiple transactions

5. **Security:**

   - HMAC SHA512 cho VNPay
   - Middleware protect trên tất cả routes
   - Middleware setUser giới hạn quyền

6. **Testing Strategy:**
   - Mock payment gateway APIs
   - Test với real database (MongoDB in-memory)
   - Test post-save hooks
   - Integration test với Order module

---

## 🚀 Chạy Test Locally

```bash
# Di chuyển vào thư mục Back-end
cd Back-end

# Cài dependencies
npm install

# Set environment variables
export vnp_TmnCode="TEST_TMN_CODE"
export vnp_HashSecret="TEST_SECRET_KEY"
export vnp_Url="https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"
export vnp_ReturnUrl="http://localhost:3000/payment/return"
export vnp_Locale="vn"

# Chạy test cho Module5
npm test -- transactionController.test.js

# Chạy test với coverage
npm test -- transactionController.test.js --coverage

# Chạy test với watch mode
npm test -- transactionController.test.js --watch
```

---

## 📚 Tài liệu tham khảo

- [Module5_Payment.md](../../Module5_Payment.md) - Chi tiết test cases
- [transactionController.js](../../Back-end/controllers/transactionController.js) - Source code
- [transactionController.test.js](../../Back-end/tests/unit/controllers/transactionController.test.js) - Test file
- [transactionModel.js](../../Back-end/models/transactionModel.js) - Transaction Model
- [VNPay Documentation](https://sandbox.vnpayment.vn/apis/) - VNPay API docs

---

## ✅ Success Criteria

Workflow được coi là **thành công** khi:

- ✅ Tất cả 20 test cases đều pass
- ✅ Code coverage >= 80%
- ✅ Không có linting errors
- ✅ Báo cáo được tạo thành công
- ✅ VNPay secure hash validation đúng
- ✅ Balance update hooks hoạt động
- ✅ Transaction history permissions đúng

---

**Last Updated:** 18/12/2025  
**Maintained by:** HaoPham  
**Module:** Module5 - Payment (Thanh toán)

