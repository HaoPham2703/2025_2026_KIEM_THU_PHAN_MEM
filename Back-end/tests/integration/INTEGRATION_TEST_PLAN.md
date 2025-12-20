# Kế hoạch Integration Test cho Đồ án E-commerce

## 📋 Tổng quan

Integration Test kiểm tra sự tương tác giữa nhiều module/component trong hệ thống. Khác với Unit Test (test từng function riêng lẻ), Integration Test kiểm tra flow nghiệp vụ hoàn chỉnh.

---

## ✅ Đã hoàn thành

### 1. **Flow Đăng nhập --> Mua hàng** ✅

- **File:** `loginToPurchase.test.js`
- **Mô tả:** Test flow user đăng nhập và tạo đơn hàng
- **Các bước:**
  1. Đăng nhập để lấy token
  2. Tạo đơn hàng với token
  3. Kiểm tra inventory giảm
  4. Kiểm tra order được tạo
  5. Xem danh sách đơn hàng

---

## 🎯 Các Integration Test cần làm (Ưu tiên cao)

### 2. **Flow Đăng ký --> Xác thực --> Mua hàng**

- **File:** `signupToPurchase.test.js`
- **Mô tả:** Test flow user mới đăng ký, xác thực tài khoản, sau đó mua hàng
- **Các bước:**
  1. Đăng ký tài khoản mới
  2. Xác thực tài khoản bằng token (verify)
  3. Đăng nhập
  4. Tạo đơn hàng
  5. Kiểm tra order được tạo với user mới

### 3. **Flow Mua hàng --> Thanh toán VNPay --> Xác nhận**

- **File:** `purchaseWithVNPay.test.js`
- **Mô tả:** Test flow thanh toán qua VNPay
- **Các bước:**
  1. Đăng nhập
  2. Tạo đơn hàng với payments="vnpay"
  3. Tạo URL thanh toán VNPay
  4. Mô phỏng callback từ VNPay (vnp_ResponseCode="00")
  5. Kiểm tra transaction được tạo
  6. Kiểm tra balance user tăng
  7. Kiểm tra order status được cập nhật

### 4. **Flow Mua hàng --> Thanh toán số dư --> Kiểm tra balance**

- **File:** `purchaseWithBalance.test.js`
- **Mô tả:** Test flow thanh toán bằng số dư tài khoản
- **Các bước:**
  1. Đăng nhập (user có balance đủ)
  2. Tạo đơn hàng với payments="số dư"
  3. Kiểm tra balance user giảm đúng số tiền
  4. Kiểm tra order được tạo
  5. Kiểm tra không tạo transaction (vì dùng số dư)

### 6. **Flow Mua hàng --> Nhận hàng --> Đánh giá sản phẩm**

- **File:** `purchaseToReview.test.js`
- **Mô tả:** Test flow user mua hàng, nhận hàng, sau đó đánh giá
- **Các bước:**
  1. Đăng nhập
  2. Tạo đơn hàng
  3. Admin cập nhật order status = "Success"
  4. User tạo review cho sản phẩm đã mua
  5. Kiểm tra review được tạo
  6. Kiểm tra ratingsAverage của product được cập nhật

### 7. **Flow User hủy đơn --> Hoàn tiền --> Inventory tăng lại**

- **File:** `cancelOrderRefund.test.js`
- **Mô tả:** Test flow user hủy đơn hàng (không COD) và hoàn tiền
- **Các bước:**
  1. Đăng nhập
  2. Tạo đơn hàng với payments="vnpay" (đã thanh toán)
  3. User hủy đơn (status = "Cancelled")
  4. Kiểm tra transaction refund được tạo
  5. Kiểm tra balance user tăng lại
  6. Kiểm tra inventory sản phẩm tăng lại

### 8. **Flow Admin: Nhập hàng --> Tạo sản phẩm --> Quản lý kho**

- **File:** `adminImportProduct.test.js`
- **Mô tả:** Test flow admin nhập hàng và quản lý kho
- **Các bước:**
  1. Admin đăng nhập
  2. Tạo import (nhập hàng) với sản phẩm và số lượng
  3. Kiểm tra inventory sản phẩm tăng
  4. Kiểm tra import record được tạo
  5. Kiểm tra location (kho) được cập nhật

---

## 🎯 Các Integration Test cần làm (Ưu tiên trung bình)

### 9. **Flow Xem sản phẩm --> Thêm vào giỏ --> Thanh toán**

- **File:** `viewProductToCheckout.test.js`
- **Mô tả:** Test flow user xem sản phẩm, thêm vào giỏ, thanh toán
- **Các bước:**
  1. Đăng nhập
  2. Xem danh sách sản phẩm (GET /api/v1/products)
  3. Xem chi tiết sản phẩm (GET /api/v1/products/:id)
  4. Tạo đơn hàng (giả lập thêm vào giỏ)
  5. Thanh toán thành công

### 10. **Flow Admin cập nhật trạng thái đơn --> User nhận email**

- **File:** `orderStatusUpdateEmail.test.js`
- **Mô tả:** Test flow admin cập nhật trạng thái đơn, user nhận email
- **Các bước:**
  1. User tạo đơn hàng
  2. Admin đăng nhập
  3. Admin cập nhật order status = "Delivery"
  4. Kiểm tra email được gửi (mock)
  5. Kiểm tra order status được cập nhật

### 11. **Flow User đánh giá --> Bình luận --> Like comment**

- **File:** `reviewCommentLike.test.js`
- **Mô tả:** Test flow user đánh giá, bình luận, và like comment
- **Các bước:**
  1. User đăng nhập
  2. User tạo review cho sản phẩm đã mua
  3. User tạo comment cho sản phẩm
  4. User like comment
  5. Kiểm tra comment có user trong likes array

### 12. **Flow Quên mật khẩu --> Reset --> Đăng nhập**

- **File:** `forgotPasswordFlow.test.js`
- **Mô tả:** Test flow quên mật khẩu và reset
- **Các bước:**
  1. User gửi yêu cầu quên mật khẩu
  2. Nhận token reset (mock email)
  3. Xác thực token reset
  4. Đặt lại mật khẩu mới
  5. Đăng nhập với mật khẩu mới

---

## 🎯 Các Integration Test cần làm (Ưu tiên thấp)

### 13. **Flow Admin quản lý sản phẩm: Tạo --> Cập nhật --> Xóa**

- **File:** `adminProductCRUD.test.js`
- **Mô tả:** Test flow admin quản lý sản phẩm
- **Các bước:**
  1. Admin đăng nhập
  2. Tạo sản phẩm mới
  3. Cập nhật sản phẩm
  4. Xóa sản phẩm
  5. Kiểm tra sản phẩm bị xóa

### 14. **Flow Thống kê đơn hàng và doanh thu**

- **File:** `orderStatistics.test.js`
- **Mô tả:** Test flow admin xem thống kê
- **Các bước:**
  1. Tạo nhiều đơn hàng với các status khác nhau
  2. Admin đăng nhập
  3. Xem thống kê số lượng đơn theo status
  4. Xem thống kê doanh thu
  5. Xem top sản phẩm bán chạy

### 15. **Flow User quản lý địa chỉ: Thêm --> Cập nhật --> Xóa**

- **File:** `userAddressManagement.test.js`
- **Mô tả:** Test flow user quản lý địa chỉ giao hàng
- **Các bước:**
  1. User đăng nhập
  2. Thêm địa chỉ mới
  3. Đặt địa chỉ mặc định
  4. Cập nhật địa chỉ
  5. Xóa địa chỉ
  6. Tạo đơn hàng với địa chỉ đã lưu

---

## 📊 Tổng kết

| Priority               | Số lượng | Trạng thái |
| ---------------------- | -------- | ---------- |
| **Đã hoàn thành**      | 1        | ✅         |
| **Ưu tiên cao**        | 7        | ⏳         |
| **Ưu tiên trung bình** | 4        | ⏳         |
| **Ưu tiên thấp**       | 3        | ⏳         |
| **Tổng cộng**          | **15**   |            |

---

## 🔧 Cấu trúc thư mục đề xuất

```
Back-end/tests/integration/
├── loginToPurchase.test.js          ✅ Đã tạo
├── signupToPurchase.test.js        ⏳ Cần tạo
├── purchaseWithVNPay.test.js       ⏳ Cần tạo
├── purchaseWithBalance.test.js    ⏳ Cần tạo
├── purchaseToReview.test.js        ⏳ Cần tạo
├── cancelOrderRefund.test.js       ⏳ Cần tạo
├── adminImportProduct.test.js      ⏳ Cần tạo
├── viewProductToCheckout.test.js   ⏳ Cần tạo
├── orderStatusUpdateEmail.test.js  ⏳ Cần tạo
├── reviewCommentLike.test.js       ⏳ Cần tạo
├── forgotPasswordFlow.test.js      ⏳ Cần tạo
├── adminProductCRUD.test.js        ⏳ Cần tạo
├── orderStatistics.test.js         ⏳ Cần tạo
└── userAddressManagement.test.js   ⏳ Cần tạo
```

---

## 📝 Ghi chú

1. **Mock Services:**

   - Email service (đã mock trong loginToPurchase.test.js)
   - VNPay callbacks (cần mock)
   - Cloudinary upload (nếu test upload ảnh)

2. **Test Data:**

   - Mỗi test nên có beforeAll để tạo test data
   - afterAll để cleanup
   - Sử dụng MongoDB Memory Server (đã setup trong setup.js)

3. **Best Practices:**

   - Mỗi test độc lập, không phụ thuộc vào test khác
   - Test cả happy path và error cases
   - Kiểm tra database state sau mỗi bước quan trọng
   - Sử dụng supertest để test API endpoints thực tế

4. **Chạy test:**

   ```bash
   # Chạy tất cả integration tests
   npm test -- integration

   # Chạy một test cụ thể
   npm test -- loginToPurchase
   ```

---

## 🎓 Lợi ích của Integration Test

1. **Phát hiện lỗi tích hợp:** Tìm lỗi khi các module tương tác với nhau
2. **Kiểm tra business flow:** Đảm bảo flow nghiệp vụ hoạt động đúng
3. **Tự tin khi deploy:** Biết chắc hệ thống hoạt động end-to-end
4. **Tài liệu sống:** Test cases mô tả cách hệ thống hoạt động
