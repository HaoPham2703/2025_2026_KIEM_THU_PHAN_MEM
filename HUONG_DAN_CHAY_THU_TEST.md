# 🧪 HƯỚNG DẪN CHẠY THỬ TEST KHI VẤN ĐÁP ĐỒ ÁN


---

## 🎯 PHƯƠNG ÁN 1: CHẠY THỬ MỘT LUỒNG TEST CỤ THỂ

### ✅ Cách 1: Chạy Integration Test - Luồng Đăng ký → Mua hàng (KHUYÊN DÙNG)

Đây là luồng test đầy đủ nhất, thể hiện được toàn bộ flow từ đăng ký đến mua hàng:

```powershell
# Bước 1: Di chuyển vào thư mục Back-end
cd Back-end

# Bước 2: Chạy luồng test Đăng ký → Mua hàng
npm test -- tests/integration/signupToPurchase.test.js
```

**Kết quả mong đợi:**

- ✅ 8 test cases sẽ chạy
- ✅ Hiển thị flow: Đăng ký → Xác thực email → Đăng nhập → Thêm vào giỏ → Thanh toán
- ✅ Thời gian: ~10-15 giây

---

### ✅ Cách 2: Chạy Integration Test - Luồng Đăng nhập → Mua hàng

```powershell
cd Back-end
npm test -- tests/integration/loginToPurchase.test.js
```

**Kết quả:**

- ✅ 6 test cases
- ✅ Flow: Đăng nhập → Thêm vào giỏ → Thanh toán

---

### ✅ Cách 3: Chạy Integration Test - Luồng Mua hàng → Review

```powershell
cd Back-end
npm test -- tests/integration/purchaseToReview.test.js
```

**Kết quả:**

- ✅ 7 test cases
- ✅ Flow: Mua hàng → Nhận hàng → Đánh giá sản phẩm

---

### ✅ Cách 4: Chạy Unit Test - Module Auth (Nhanh, dễ hiểu)

```powershell
cd Back-end
npm test -- tests/unit/controllers/authController.comprehensive.test.js
```

**Kết quả:**

- ✅ ~25 test cases
- ✅ Test các chức năng: Đăng ký, Đăng nhập, Quên mật khẩu, Xác thực email
- ✅ Thời gian: ~5-8 giây

---

### ✅ Cách 5: Chạy Unit Test - Module Order (Test giỏ hàng và đơn hàng)

```powershell
cd Back-end
npm test -- tests/unit/controllers/orderController.test.js
```

**Kết quả:**

- ✅ ~30 test cases
- ✅ Test: Thêm vào giỏ, Cập nhật giỏ, Tạo đơn hàng, Hủy đơn hàng

---

## 🚀 PHƯƠNG ÁN 2: CHẠY THỬ CI/CD WORKFLOW TRÊN GITHUB

### 📌 Cách chạy CI trên GitHub Actions (KHUYÊN DÙNG khi thầy yêu cầu)

#### Bước 1: Truy cập GitHub Repository

1. Mở trình duyệt, vào repository của bạn trên GitHub
2. Click vào tab **"Actions"** (ở thanh menu trên cùng)

#### Bước 2: Chạy Workflow thủ công

1. Ở sidebar bên trái, click vào **"Integration Tests"** (workflow name)
2. Ở phía bên phải, click nút **"Run workflow"** (màu xanh)
3. Chọn branch: **weblau** (hoặc branch bạn đang làm việc)
4. Click **"Run workflow"** để xác nhận

#### Bước 3: Xem kết quả

1. Workflow sẽ bắt đầu chạy (có thể thấy status "yellow" - đang chạy)
2. Click vào run vừa tạo để xem chi tiết
3. Đợi ~2-3 phút để workflow hoàn thành
4. Xem kết quả:
   - ✅ **Green checkmark** = Tất cả tests pass
   - ❌ **Red X** = Có test fail (click vào để xem chi tiết)



## 📊 CÁC LUỒNG TEST CÓ SẴN

### Integration Tests (Test toàn bộ flow)

| File Test                     | Số Test Cases | Mô tả                                     |
| ----------------------------- | ------------- | ----------------------------------------- |
| `signupToPurchase.test.js`    | 8             | Đăng ký → Xác thực → Đăng nhập → Mua hàng |
| `loginToPurchase.test.js`     | 6             | Đăng nhập → Mua hàng                      |
| `purchaseToReview.test.js`    | 7             | Mua hàng → Nhận hàng → Review             |
| `purchaseWithBalance.test.js` | 5             | Mua hàng bằng số dư tài khoản             |
| `purchaseWithVNPay.test.js`   | 6             | Mua hàng thanh toán qua VNPay             |
| `cancelOrderRefund.test.js`   | 5             | Hủy đơn hàng → Hoàn tiền                  |
| `adminProductCRUD.test.js`    | 8             | Admin quản lý sản phẩm (CRUD)             |
| `adminImportProduct.test.js`  | 6             | Admin nhập hàng                           |
| `forgotPasswordFlow.test.js`  | 4             | Quên mật khẩu → Reset                     |

### Unit Tests (Test từng chức năng riêng lẻ)

| Module  | File Test                              | Số Test Cases |
| ------- | -------------------------------------- | ------------- |
| Auth    | `authController.comprehensive.test.js` | ~25           |
| User    | `userController.test.js`               | ~22           |
| Product | `productController.test.js`            | ~28           |
| Order   | `orderController.test.js`              | ~30           |
| Review  | `reviewController.test.js`             | ~20           |
| Payment | `transactionController.test.js`        | ~20           |

---

## ⚡ LỆNH NHANH - COPY & PASTE

### Chạy một luồng test cụ thể:

```powershell
cd Back-end
npm test -- tests/integration/signupToPurchase.test.js
```

### Chạy tất cả integration tests:

```powershell
cd Back-end
npm test -- tests/integration
```

### Chạy với coverage (hiển thị % code được test):

```powershell
cd Back-end
npm test -- tests/integration/signupToPurchase.test.js --coverage
```

### Chạy tất cả tests:

```powershell
cd Back-end
npm test
```

---

## 🎯 KHUYẾN NGHỊ KHI VẤN ĐÁP

### ✅ Nên làm:

1. **Chuẩn bị trước**: Test thử các lệnh trước khi bảo vệ
2. **Chọn luồng phù hợp**:
   - Nếu thầy muốn xem flow đầy đủ → Dùng `signupToPurchase.test.js`
   - Nếu thầy muốn xem nhanh → Dùng `authController.comprehensive.test.js`
3. **Giải thích rõ ràng**: Nói rõ test đang làm gì, test cái gì
4. **Chạy CI nếu có thời gian**: Thể hiện được quy trình DevOps

### ❌ Tránh:

1. Không chạy test khi chưa test thử trước
2. Không giải thích mơ hồ về test đang chạy
3. Không để lỗi dependency (nhớ `npm install` trước)

---

## 🔧 XỬ LÝ LỖI THƯỜNG GẶP

### Lỗi: "Cannot find module"

```powershell
cd Back-end
npm install
```

### Lỗi: "Jest not found"

```powershell
cd Back-end
npm install --save-dev jest
```

### Lỗi: "MongoDB connection failed"

- Test tự động dùng MongoDB Memory Server, không cần setup MongoDB
- Nếu vẫn lỗi, kiểm tra file `jest.config.js`

### Test chạy quá lâu

- Bình thường: Mỗi test file ~10-30 giây
- Nếu > 1 phút: Có thể có vấn đề, kiểm tra lại

---

## 📝 GHI CHÚ QUAN TRỌNG

1. **Tất cả tests đều dùng MongoDB Memory Server** → Không cần cài MongoDB
2. **Tests tự động cleanup** → Không ảnh hưởng database thật
3. **CI/CD workflow** đã được cấu hình sẵn → Chỉ cần click "Run workflow"
4. **Coverage report** tự động tạo trong thư mục `coverage/`

---

## 🎓 CÂU TRẢ LỜI MẪU KHI THẦY HỎI

**Thầy: "Chạy cho thầy thử 1 luồng"**

> "Dạ thầy, em sẽ chạy luồng test từ đăng ký đến mua hàng. Đây là integration test test toàn bộ flow của hệ thống."

**Thầy: "Chạy thử CI"**

> "Dạ thầy, em sẽ chạy CI/CD workflow trên GitHub Actions. Workflow này sẽ tự động chạy tất cả integration tests và tạo báo cáo kết quả."

**Thầy: "Test này test cái gì?"**

> "Dạ thầy, test này test luồng [tên luồng]. Cụ thể là: [liệt kê các bước]. Tất cả các test cases đều pass, chứng tỏ chức năng hoạt động đúng."

---

**Chúc bạn bảo vệ đồ án thành công! 🎉**
