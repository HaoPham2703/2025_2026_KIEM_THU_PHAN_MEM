# Integration Tests - GitHub Actions Workflow

## 📋 Tổng quan

Workflow này chạy tất cả các integration tests trong thư mục `Back-end/tests/integration/` trên GitHub Actions.

## 🚀 Cách sử dụng

### 1. Tự động chạy

Workflow sẽ tự động chạy khi:
- Push code lên branch `weblau`
- Tạo Pull Request vào branch `weblau`

### 2. Chạy thủ công

1. Vào tab **Actions** trên GitHub
2. Chọn workflow **Integration Tests**
3. Click **Run workflow**
4. Chọn branch và click **Run workflow**

## 📁 Các Integration Tests

Workflow sẽ chạy tất cả các file test trong `Back-end/tests/integration/`:

1. **loginToPurchase.test.js** - Flow đăng nhập → mua hàng
2. **signupToPurchase.test.js** - Flow đăng ký → mua hàng
3. **purchaseWithVNPay.test.js** - Flow mua hàng với VNPay
4. **purchaseWithPayPal.test.js** - Flow mua hàng với PayPal
5. **purchaseWithBalance.test.js** - Flow mua hàng bằng số dư
6. **purchaseToReview.test.js** - Flow mua hàng → đánh giá
7. **cancelOrderRefund.test.js** - Flow hủy đơn → hoàn tiền
8. **adminImportProduct.test.js** - Flow admin nhập hàng
9. **viewProductToCheckout.test.js** - Flow xem sản phẩm → checkout
10. **orderStatusUpdateEmail.test.js** - Flow cập nhật trạng thái đơn → gửi email
11. **reviewCommentLike.test.js** - Flow đánh giá → bình luận → like
12. **forgotPasswordFlow.test.js** - Flow quên mật khẩu
13. **adminProductCRUD.test.js** - Flow admin CRUD sản phẩm
14. **orderStatistics.test.js** - Flow xem thống kê đơn hàng
15. **userAddressManagement.test.js** - Flow quản lý địa chỉ người dùng

## ⚙️ Environment Variables

Workflow sử dụng các biến môi trường sau:

```yaml
NODE_ENV: test
JWT_SECRET: test-jwt-secret-key-for-integration-testing
JWT_EXPIRES_IN: 90d
JWT_COOKIE_EXPIRES_IN: 90
EMAIL_HOST: smtp.gmail.com
EMAIL_PORT: 587
EMAIL_USERNAME: test@example.com
EMAIL_PASSWORD: testpassword
EMAIL_FROM: test@example.com
VNP_TMN_CODE: test_tmn_code
VNP_HASH_SECRET: test_hash_secret
VNP_URL: https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNP_RETURN_URL: http://localhost:3000/api/v1/transactions/vnpay_return
PAYPAL_CLIENT_ID: test_paypal_client_id
PAYPAL_CLIENT_SECRET: test_paypal_client_secret
PAYPAL_MODE: sandbox
```

## 📊 Kết quả Test

### 1. GitHub Actions Summary

Sau khi chạy, kết quả sẽ hiển thị trong:
- **Actions tab** → Click vào workflow run → Xem **Summary**

### 2. Test Artifacts

Các file kết quả được lưu dưới dạng artifacts:
- `integration-test-results.json` - Kết quả test dạng JSON
- `coverage-integration/` - Coverage report

### 3. PR Comments

Nếu chạy trên Pull Request, kết quả sẽ được comment tự động vào PR.

## 🔧 Troubleshooting

### Test bị timeout

- Tăng `timeout-minutes` trong workflow (hiện tại là 15 phút)
- Kiểm tra xem có test nào chạy quá lâu không

### MongoDB Connection Error

- Integration tests sử dụng `mongodb-memory-server` tự động
- Không cần cấu hình MongoDB riêng

### Email Service Error

- Email service được mock trong tests
- Không cần cấu hình email thật

### Payment Gateway Error

- VNPay và PayPal sử dụng test credentials
- Không cần cấu hình payment gateway thật

## 📝 Notes

1. **MongoDB Memory Server**: Tests sử dụng in-memory MongoDB, không cần database thật
2. **Email Mocking**: Email service được mock, không gửi email thật
3. **Payment Mocking**: Payment gateways sử dụng test mode
4. **Test Isolation**: Mỗi test chạy độc lập, tự cleanup data

## 🚨 Lưu ý

- Không commit credentials thật vào code
- Sử dụng test credentials cho payment gateways
- Email service được mock, không gửi email thật
- Tests chạy trên MongoDB in-memory, không ảnh hưởng database thật

---

**Workflow File:** `.github/workflows/integration-tests.yml`  
**Last Updated:** 18/12/2025
