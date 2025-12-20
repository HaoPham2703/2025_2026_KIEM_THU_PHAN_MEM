# Module4 - Cart & Order Management Test Workflow

## 📋 Tổng quan

Workflow này tự động chạy test cho **Module 4 - Cart & Order Management**, bao gồm:

- 🛒 **Cart Functions (Front-end):** Quản lý giỏ hàng với Redux Slice
- 📦 **Order Management:** Tạo, xem, hủy đơn hàng
- 🔐 **Admin Functions:** Cập nhật trạng thái đơn hàng
- 📊 **Statistics:** Thống kê doanh thu và đơn hàng

---

## 🎯 Mục đích

- Đảm bảo tất cả chức năng giỏ hàng và đơn hàng hoạt động đúng
- Kiểm tra quyền truy cập (User, Admin, Employee)
- Kiểm tra business rules (hủy đơn, hoàn tiền, inventory)
- Kiểm tra validation và error handling
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
  JWT_SECRET: test-jwt-secret-key-for-module4-testing
  JWT_EXPIRES_IN: 90d
  JWT_COOKIE_EXPIRES_IN: 90
  EMAIL_HOST: smtp.gmail.com
  EMAIL_PORT: 587
  EMAIL_USERNAME: test@example.com
  EMAIL_PASSWORD: testpassword
  EMAIL_FROM: test@example.com
```

---

## 🧪 Test Coverage

### Cart Functions (Front-end - 10 tests)

| Function           | Test Cases | Description                    |
| ------------------ | ---------- | ------------------------------ |
| Add To Cart        | 4 tests    | Thêm sản phẩm vào giỏ hàng     |
| Set Quantity       | 3 tests    | Cập nhật số lượng sản phẩm     |
| Remove From Cart   | 3 tests    | Xóa sản phẩm khỏi giỏ          |

**Test IDs:** CART-001 to CART-010

### Order Management (30 tests)

| Function                    | Test Cases | Description                        |
| --------------------------- | ---------- | ---------------------------------- |
| Create Order                | 6 tests    | Tạo đơn hàng                       |
| Get All Orders              | 3 tests    | Xem danh sách đơn hàng             |
| Get Order                   | 4 tests    | Xem chi tiết đơn hàng              |
| Cancel Order (User)         | 4 tests    | Hủy đơn hàng (User only)           |
| Update Order Status (Admin) | 6 tests    | Cập nhật trạng thái (Admin/Employee)|
| Statistics (Admin)          | 7 tests    | Thống kê doanh thu và đơn hàng     |

**Test IDs:** ORDER-001 to ORDER-030

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

### 4. 🧪 Run Module4 Tests

```bash
npm test -- orderController.test.js --json --outputFile=module4-test-results.json
```

- **Test file:** `orderController.test.js`
- **Output:** `module4-test-results.json`
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

Upload `module4-test-results.json` làm artifact (lưu 30 ngày)

### 7. 📊 Generate Coverage

```bash
npm test -- orderController.test.js --coverage --coverageDirectory=./coverage-module4
```

### 8. 📤 Upload Coverage

Upload coverage report làm artifact (lưu 30 ngày)

### 9. 💬 Comment PR with Results

Nếu là Pull Request, tự động comment kết quả test vào PR

### 10. ❌ Fail if tests failed

Workflow sẽ fail nếu có test nào không pass

---

## 📋 Test Case Details

Chi tiết test cases xem tại: [`Module4_Cart_Order.md`](../../Module4_Cart_Order.md)

### Test Case Structure

```
CART-001 to CART-010: Cart Functions (Front-end)
  - Add To Cart (4 tests)
  - Set Quantity (3 tests)
  - Remove From Cart (3 tests)

ORDER-001 to ORDER-030: Order Functions (Back-end)
  - Create Order (6 tests)
  - Get All Orders (3 tests)
  - Get Order (4 tests)
  - Cancel Order (4 tests)
  - Update Order Status (6 tests)
  - Statistics (7 tests)
```

### Business Rules Tested

1. **Create Order:**

   - Chỉ user mới được tạo đơn hàng
   - Validation: address, receiver, phone, payments
   - Khi thanh toán "số dư": balance user giảm
   - Inventory sản phẩm giảm

2. **View Orders:**

   - User chỉ xem được đơn của mình
   - Admin xem được tất cả đơn hàng
   - Middleware `isOwner` check permission

3. **Cancel Order (User):**

   - User chỉ hủy được đơn ở trạng thái "Processed"
   - Không hủy được đơn "Waiting Goods", "Delivery", "Success", "Cancelled"
   - Khi hủy: inventory tăng lại

4. **Update Order Status (Admin/Employee):**

   - Admin/Employee cập nhật mọi trạng thái
   - Không cập nhật được đơn "Cancelled" hoặc "Success"
   - User không được cập nhật status khác "Cancelled"
   - Khi hủy đơn không COD: tạo transaction refund

5. **Statistics (Admin only):**
   - Thống kê số lượng đơn theo status
   - Thống kê doanh thu (chỉ đơn "Success")
   - Top 5 sản phẩm bán chạy
   - Thống kê theo khoảng thời gian

---

## 🔍 Xem Kết quả Test

### Trên GitHub Actions UI

1. Vào tab **Actions** trên GitHub
2. Chọn workflow **Module4 - Cart & Order Test**
3. Chọn run gần nhất
4. Xem **Summary** để thấy báo cáo chi tiết

### Download Artifacts

Artifacts có sẵn sau mỗi lần chạy:

- `module4-cart-order-test-results`: File JSON chứa kết quả test
- `module4-cart-order-coverage`: Báo cáo coverage

---

## ⚠️ Troubleshooting

### Test fails do MongoDB connection

**Lỗi:** `MongooseError: Operation 'orders.find()' timed out`

**Giải pháp:** GitHub Actions tự động setup MongoDB in-memory, không cần config.

### Test fails do missing environment variables

**Lỗi:** `Error: JWT_SECRET is not defined`

**Giải pháp:** Check `env` section trong workflow file.

### Test fails do missing dependencies

**Lỗi:** `Cannot find module 'moment'`

**Giải pháp:**

```bash
cd Back-end
npm install
```

### Email sending fails

**Lỗi:** Email không gửi được trong test

**Giải pháp:** Test environment dùng mock email, lỗi sẽ được catch và ignore.

---

## 📝 Order Status Flow

```
[User creates order] → Processed
                          ↓
                   Waiting Goods
                          ↓
[Admin/Employee]    Delivery
                          ↓
                       Success

[User/Admin can cancel] → Cancelled (only from "Processed" for User)
```

---

## 💡 Lưu ý

1. **Cart Functions (Front-end):**

   - Được test riêng biệt (Redux Slice)
   - Sử dụng localStorage để lưu giỏ hàng
   - Không yêu cầu authentication

2. **Order Functions (Back-end):**

   - Tất cả routes yêu cầu authentication (`protect` middleware)
   - Role-based access control
   - Business rules validation

3. **Payment Methods:**

   - `tiền mặt`: COD, không hoàn tiền khi hủy
   - `vnpay`, `paypal`: Online payment, hoàn tiền khi hủy
   - `số dư`: User balance, trừ tiền ngay khi tạo đơn

4. **Refund Policy:**
   - Chỉ hoàn tiền cho đơn không phải COD
   - Tạo transaction với payments="refund"
   - Xử lý trong `post findOneAndUpdate` hook của Order model

---

## 🚀 Chạy Test Locally

```bash
# Di chuyển vào thư mục Back-end
cd Back-end

# Cài dependencies
npm install

# Chạy test cho Module4
npm test -- orderController.test.js

# Chạy test với coverage
npm test -- orderController.test.js --coverage

# Chạy test với watch mode
npm test -- orderController.test.js --watch
```

---

## 📚 Tài liệu tham khảo

- [Module4_Cart_Order.md](../../Module4_Cart_Order.md) - Chi tiết test cases
- [orderController.js](../../Back-end/controllers/orderController.js) - Source code
- [orderController.test.js](../../Back-end/tests/unit/controllers/orderController.test.js) - Test file
- [cartSlice.js](../../FrontEnd/src/redux/cart/cartSlice.js) - Cart Redux Slice

---

## ✅ Success Criteria

Workflow được coi là **thành công** khi:

- ✅ Tất cả 40 test cases đều pass
- ✅ Code coverage >= 80%
- ✅ Không có linting errors
- ✅ Báo cáo được tạo thành công

---

**Last Updated:** 18/12/2025  
**Maintained by:** HaoPham  
**Module:** Module4 - Cart & Order Management

