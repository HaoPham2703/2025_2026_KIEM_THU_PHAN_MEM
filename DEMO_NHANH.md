# ⚡ DEMO NHANH - KHI THẦY YÊU CẦU CHẠY TEST

## 🎯 Tình huống: "Chạy cho thầy thử 1 luồng hay chạy thử CI"

---

## ✅ CÁCH 1: Chạy thử một luồng test (NHANH NHẤT - 30 giây)

### Option A: Dùng script tự động (KHUYÊN DÙNG)

```powershell
.\chay-thu-luong-test.ps1
```

→ Chọn số 1 (Đăng ký → Mua hàng) → Enter

### Option B: Chạy trực tiếp

```powershell
cd Back-end
npm test -- tests/integration/signupToPurchase.test.js
```

**Giải thích cho thầy:**

> "Dạ thầy, em vừa chạy luồng test từ đăng ký đến mua hàng. Test này kiểm tra toàn bộ flow: user đăng ký → xác thực email → đăng nhập → thêm vào giỏ → thanh toán. Có 8 test cases, tất cả đều pass."

---

## ✅ CÁCH 2: Chạy thử CI/CD trên GitHub (2-3 phút)

### Các bước:

1. Mở GitHub → Tab **"Actions"**
2. Click **"Integration Tests"** (sidebar trái)
3. Click **"Run workflow"** (góc phải trên)
4. Chọn branch **"weblau"** → Click **"Run workflow"**
5. Đợi 2-3 phút → Xem kết quả

**Giải thích cho thầy:**

> "Dạ thầy, em vừa chạy CI/CD workflow. Hệ thống sẽ tự động chạy tất cả integration tests, tạo báo cáo và coverage report. Kết quả sẽ hiển thị trong vài phút."

---

## 📋 CÁC LUỒNG TEST CÓ SẴN

| Số  | Luồng Test           | Lệnh                                                                      |
| --- | -------------------- | ------------------------------------------------------------------------- |
| 1   | Đăng ký → Mua hàng   | `npm test -- tests/integration/signupToPurchase.test.js`                  |
| 2   | Đăng nhập → Mua hàng | `npm test -- tests/integration/loginToPurchase.test.js`                   |
| 3   | Mua hàng → Review    | `npm test -- tests/integration/purchaseToReview.test.js`                  |
| 10  | Unit Test - Auth     | `npm test -- tests/unit/controllers/authController.comprehensive.test.js` |

---

## 🎬 KỊCH BẢN TRÌNH BÀY

### Khi thầy nói: "Chạy cho thầy thử 1 luồng"

**Bạn làm:**

1. Mở PowerShell
2. Chạy: `.\chay-thu-luong-test.ps1`
3. Chọn số 1
4. Đợi test chạy xong (~15 giây)

**Bạn nói:**

> "Dạ thầy, em vừa chạy luồng test từ đăng ký đến mua hàng. Test này có 8 test cases, tất cả đều pass. Luồng này test toàn bộ flow: đăng ký → xác thực email → đăng nhập → thêm vào giỏ → thanh toán."

---

### Khi thầy nói: "Chạy thử CI"

**Bạn làm:**

1. Mở GitHub → Tab "Actions"
2. Click "Integration Tests" → "Run workflow"
3. Chọn branch → "Run workflow"
4. Chỉ cho thầy thấy workflow đang chạy

**Bạn nói:**

> "Dạ thầy, em vừa kích hoạt CI/CD workflow. Hệ thống đang tự động chạy tất cả integration tests. Kết quả sẽ có trong vài phút. Workflow này giúp đảm bảo chất lượng code trước khi merge vào main branch."

---

## ⚠️ LƯU Ý QUAN TRỌNG

1. ✅ **Test trước khi bảo vệ**: Chạy thử các lệnh trước để đảm bảo không lỗi
2. ✅ **Chuẩn bị sẵn**: Mở PowerShell và GitHub trước khi vào phòng
3. ✅ **Giải thích rõ ràng**: Nói rõ test đang làm gì
4. ❌ **Tránh**: Chạy test lần đầu khi đang bảo vệ

---

## 🔧 XỬ LÝ LỖI NHANH

**Lỗi: "Cannot find module"**

```powershell
cd Back-end
npm install
```

**Lỗi: "Jest not found"**

```powershell
cd Back-end
npm install --save-dev jest
```

---

**Xem hướng dẫn chi tiết tại:** `HUONG_DAN_CHAY_THU_TEST.md`
