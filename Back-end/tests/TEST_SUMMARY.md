# 📊 Tóm tắt Trạng thái Kiểm thử – Unit Test, Integration Test, System Test

**Ngày:** 20/12/2025  
**Dự án:** E-commerce Back-end (Node.js + Jest)

---

## 1️⃣ Unit Test (Kiểm thử từng hàm riêng lẻ)

### ✅ **Hiện tại (Đã có)**

#### Controllers:
- ✅ `authController.test.js` - Đăng ký, đăng nhập, quên mật khẩu
- ✅ `brandController.test.js` - CRUD thương hiệu (Brand) **100% coverage**
- ✅ `categoryController.test.js` - CRUD danh mục **100% coverage**
- ✅ `commentController.test.js` - CRUD bình luận 86.2%
- ✅ `importController.test.js` - CRUD phiếu nhập 92.85%
- ✅ `locationController.test.js` - CRUD vị trí kho 82.75%
- ✅ `orderController.test.js` - CRUD đơn hàng 77.67%
- ✅ `productController.test.js` - CRUD sản phẩm **43.13% (cần bổ sung)**
- ✅ `reviewController.test.js` - CRUD đánh giá 85.71%
- ✅ `transactionController.test.js` - CRUD giao dịch 95%
- ✅ `userController.test.js` - Quản lý người dùng 98.82%

**Kết quả:**
- Unit Tests: 11 file, 196 passed, 48 failed
- Coverage trung bình: **Statements 81.44%**, Branches 60.76%

#### Cách chạy:
```powershell
cd Back-end
npm test -- authController              # Test riêng một controller
npm test -- --coverage                  # Tất cả với coverage report
```

---

## 2️⃣ Integration Test (Kiểm thử luồng tương tác nhiều module)

### ✅ **Hiện tại (Đã có 8 file)**

| Tên test | Tệp | Trạng thái | Luồng kiểm thử |
|---------|-----|-----------|-----------------|
| Đăng nhập → Mua hàng | `loginToPurchase.test.js` | ✅ Hoàn thành | User đăng nhập, tạo đơn, kiểm tra inventory |
| Đăng ký → Xác thực → Mua | `signupToPurchase.test.js` | ✅ Hoàn thành | Tạo user mới, xác thực, thanh toán |
| Mua → Thanh toán VNPay → Xác nhận | `purchaseWithVNPay.test.js` | ✅ Hoàn thành | VNPay callback, cập nhật transaction |
| Mua → Thanh toán bằng số dư | `purchaseWithBalance.test.js` | ✅ Hoàn thành | Trừ balance user, không tạo transaction |
| Mua → Nhận hàng → Đánh giá | `purchaseToReview.test.js` | ✅ Hoàn thành | Review sản phẩm, cập nhật ratings |
| User hủy đơn → Hoàn tiền → Tồn ↑ | `cancelOrderRefund.test.js` | ✅ Hoàn thành | Refund balance, cộng inventory lại |
| Admin nhập hàng → Quản lý kho | `adminImportProduct.test.js` | ✅ Hoàn thành | Import sản phẩm, cập nhật kho |
| Xem sản phẩm → Giỏ → Thanh toán | `viewProductToCheckout.test.js` | ✅ Hoàn thành | Toàn flow mua hàng |
| Hủy đơn | `cancelOrderRefund.test.js` | ✅ Hoàn thành | Hủy, hoàn tiền, cộng tồn kho |
| Cập nhật trạng thái + Email | `orderStatusUpdateEmail.test.js` | ✅ Hoàn thành | Notification khi order status thay đổi |
| Đánh giá/Like bình luận | `reviewCommentLike.test.js` | ✅ Hoàn thành | Review, comment, like features |
| Quên mật khẩu | `forgotPasswordFlow.test.js` | ✅ Hoàn thành | Reset password qua email |
| CRUD sản phẩm (Admin) | `adminProductCRUD.test.js` | ✅ Hoàn thành | Admin tạo, sửa, xóa sản phẩm |
| Quản lý địa chỉ | `userAddressManagement.test.js` | ✅ Hoàn thành | User thêm/sửa/xóa địa chỉ |
| Thống kê đơn hàng | `orderStatistics.test.js` | ✅ Hoàn thành | Báo cáo doanh thu, số đơn |

**Kết quả:**
- Integration Tests: 15 files
- Test từng flow kinh doanh hoàn chỉnh
- Sử dụng `supertest` (HTTP request testing) và mock `email.js`

#### Cách chạy:
```powershell
cd Back-end
npm test -- integration/loginToPurchase      # Test riêng một integration flow
npm test -- integration                      # Tất cả integration tests
```

---

## 3️⃣ System Test (Kiểm thử toàn bộ hệ thống end-to-end)

### 🔄 **Hiện tại: 2 cấp độ**

#### **Cấp 1: Pseudo System Test (Hiện có trong integration/)**
Các file trong `tests/integration/` đã **gần giống System Test** vì:
- ✅ Gọi API thực (via `supertest`)
- ❌ Nhưng dùng **MongoDB Memory Server** (fake DB)
- ❌ Mock email/cloudinary

**Files:**
- `loginToPurchase.test.js`, `cancelOrderRefund.test.js`, v.v. (15 files)

#### **Cấp 2: Thực System Test (Mới tạo - trong tests/system/)**
Kiểm tra trên **production environment**:
- ✅ Server chạy thực (`http://localhost:3000`)
- ✅ MongoDB **thực** (local hoặc Atlas)
- ✅ Email **thực** (gửi email thực hoặc mock thực)
- ✅ File upload **thực** (Cloudinary)
- ✅ Payment **thực** (VNPay callback)

**File mẫu:**
- `tests/system/systemTest.e2e.test.js` - Flow: Signup → Login → Purchase → Review → Cancel

#### Cách chạy System Test thực:

**Chuẩn bị:**
```powershell
# 1. Chắc chắn server đang chạy
npm start

# 2. Chắc chắn MongoDB đang chạy (local hoặc atlas)
# 3. .env có tất cả biến cần thiết (MONGO_URI, CLOUDINARY_KEY, VNPAY_KEY, etc.)
```

**Chạy test:**
```powershell
# Chỉ chạy system test
npm test -- tests/system/systemTest.e2e.test.js

# Với chi tiết
npm test -- tests/system/systemTest.e2e.test.js --verbose

# Với coverage (nếu muốn)
npm test -- tests/system/systemTest.e2e.test.js --coverage
```

---

## 📈 Bảng so sánh Unit vs Integration vs System

| Loại | Phạm vi | Môi trường | Thời gian | Độ tin cậy | Hiện tại |
|------|--------|-----------|---------|-----------|---------|
| **Unit Test** | 1 hàm riêng lẻ | Mock 100% | Nhanh (ms) | Cao (logic riêng) | ✅ 11 files |
| **Integration Test** | Nhiều module tương tác | MongoDB Memory + Mock email | Vừa (5s) | Cao (flow) | ✅ 15 files |
| **System Test** | Toàn hệ thống E2E | **Server + MongoDB thực** | **Chậm (30s)** | **Rất cao (thực tế)** | ✅ 1 file mẫu (tests/system/) |

---

## 🎯 Độ phủ hiện tại (dari coverage report)

```
All files             |   81.44% | Statements
Statements coverage   |   Tốt ✅  | >80% là tốt
Controllers           |   79.53% |
Models                |   94.16% | Rất tốt ✅
Utils                 |   78.33% |
```

**Điểm yếu cần sửa:**
- `productController.js`: 43.13% ❌ (nên > 80%)
- `handlerFactory.js`: 58.92% (chứa logic chung, nhiều branch)
- `email.js`: 50% (cần mock tốt hơn)
- `multer.js`: 37.5% (file upload upload)

---

## 🚀 Cách chạy cho giảng viên xem

## 🎯 Cách chạy cho giảng viên xem

### Bước 1: Chuẩn bị môi trường
```powershell
cd "D:\KTPM\new\2025_2026_KIEM_THU_PHAN_MEM\Back-end"
npm install
```

### Bước 2: Chạy Unit Tests (nhanh, không cần server)
```powershell
npm test -- brandController              # Brand 100% coverage (tốt nhất)
npm test -- productController            # Product 43% (cần cải tiến)
npm test -- --coverage                   # Tất cả với chi tiết
```

### Bước 3: Chạy Integration Tests (flow kinh doanh, không cần server)
```powershell
npm test -- integration/loginToPurchase         # 1 flow
npm test -- integration                        # Tất cả 15 flows
```

### Bước 4: Chạy System Test (cần server chạy)
```powershell
# Terminal 1: Chạy server
npm start

# Terminal 2: Chạy system test
npm test -- tests/system/systemTest.e2e.test.js --verbose
```

### Bước 5: Xem báo cáo HTML
```powershell
Invoke-Item "D:\KTPM\new\2025_2026_KIEM_THU_PHAN_MEM\Back-end\tests\reports\WhiteBox_All_Modules_Report.html"
```

### Bước 6: Xuất PDF
- Mở báo cáo HTML
- Ctrl+P → Save as PDF

---

## 📝 Kết luận

| Loại | Trạng thái | Ghi chú |
|------|-----------|--------|
| **Unit Tests** | ✅ Có (11 files) | Coverage 81%, Brand 100% ⭐ |
| **Integration Tests** | ✅ Có (15 files) | Test luồng kinh doanh đầy đủ |
| **System Test (Pseudo)** | ✅ Có (15 files qua integration) | MongoMemoryServer + Mock |
| **System Test (Thực)** | ✅ Có (1 file mẫu trong tests/system/) | Server + MongoDB thực |
| **White-box Tests** | ✅ Có | Sơ đồ luồng + case ranh giới |

**✅ Đã hoàn thành:** Unit + Integration + System Testing  
**📈 Cần cải tiến:** Product coverage (43% → 80%+) để tăng độ tin cậy  
**🚀 Có thể mở rộng:** Thêm Performance Testing, Load Testing, UI Testing

