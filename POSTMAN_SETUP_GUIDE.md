# 📮 Postman Collection Setup Guide

## Quick Start

### Bước 1: Import Collection vào Postman

1. Mở **Postman**
2. Click **File** → **Import** (hoặc Ctrl+O)
3. Chọn file: `Postman_E-Commerce_API.postman_collection.json`
4. Click **Import**

### Bước 2: Cấu hình Environment Variables

1. Trong Postman, click **Environments** (trái màn hình)
2. Click **Create** (nút "+")
3. Đặt tên: `E-Commerce Local`
4. Thêm các variables sau:

| Variable | Initial Value | Current Value |
|----------|--------------|---------------|
| `baseUrl` | http://localhost:5100 | http://localhost:5100 |
| `token` | (để trống) | (tự động điền khi login) |
| `userId` | (để trống) | (tự động điền khi signup/login) |
| `productId` | (để trống) | (tự động điền khi get product) |
| `orderId` | (để trống) | (tự động điền khi create order) |

5. Click **Save**
6. Chọn environment này từ dropdown góc phải

### Bước 3: Start Backend Server

```powershell
cd Back-end
npm start
```

Server sẽ chạy trên http://localhost:5100

---

## 📋 Các Flows & Test Sequences

### 1️⃣ **Authentication Flow**

```
1. AUTH-002: Login
   → Copy token từ response vào environment
   → Dùng token cho các request tiếp theo

2. AUTH-004: Update My Password (Optional)
3. AUTH-005: Get My Info
```

**Test**: ✅ Đăng nhập thành công, nhận token

---

### 2️⃣ **Brand & Category Management Flow**

```
1. BRD-001: Create Brand (Admin)
   → brandId sẽ tự save vào environment

2. BRD-002: Get All Brands
3. BRD-003: Get Brand by ID (dùng {{brandId}})
4. BRD-004: Update Brand
5. BRD-005: Delete Brand

Tương tự với CAT-001, CAT-002, CAT-003
```

**Test**: ✅ CRUD brand/category thành công

---

### 3️⃣ **Product View Flow (Signup → Purchase)**

```
1. AUTH-001: Signup (new user)
   → Lưu token & userId

2. PROD-001: Get All Products
   → Xem danh sách sản phẩm (4 products seed)

3. PROD-002: Get Product by ID
   → productId sẽ tự save vào environment

4. PROD-003: Search Products
   → Search "monitor"

5. PROD-004: Filter by Brand
   → Filter "Dell"

6. PROD-005: Filter by Price Range
   → Lọc giá từ 1M đến 5M

7. PROD-006: Sort and Paginate
   → Sort theo giá, page 1, limit 10
```

**Test**: ✅ Xem sản phẩm, tìm kiếm, lọc, phân trang

---

### 4️⃣ **Order Flow (Mua hàng)**

```
1. (Từ flow trên) Có productId từ PROD-002

2. ORD-001: Create Order
   → Dùng {{productId}} & {{token}}
   → orderId sẽ tự save

3. ORD-002: Get My Orders
   → Xem danh sách đơn của user

4. ORD-003: Get Order by ID
   → Xem chi tiết đơn {{orderId}}

5. ORD-004: Update Order Status (Admin - đăng nhập admin)
   → Cập nhật status: processing, shipped, delivered

6. ORD-005: Cancel Order (Optional)
   → Hủy đơn nếu cần
```

**Test**: ✅ Tạo đơn hàng, xem, cập nhật trạng thái

---

### 5️⃣ **Payment Flow**

```
1. (Từ order flow) Có {{orderId}} từ ORD-001

2. PAY-002: Get User Balance
   → Kiểm tra số dư user

3. PAY-001: Get Transaction History
   → Xem lịch sử thanh toán

4. PAY-003: Create VNPay Payment URL (Optional)
   → Tạo URL thanh toán VNPay
```

**Test**: ✅ Kiểm tra số dư, lịch sử thanh toán

---

### 6️⃣ **Review & Comment Flow (Đánh giá)**

```
1. (Từ order flow) Có {{productId}} từ PROD-002

2. REV-001: Create Review
   → Viết review cho sản phẩm
   → reviewId sẽ tự save

3. REV-002: Get Reviews by Product
   → Xem tất cả review của sản phẩm

4. REV-003: Like Review
   → Like review {{reviewId}}

5. COM-001: Create Comment on Review
   → Bình luận trên review
   → commentId sẽ tự save

6. COM-002: Like Comment
   → Like comment {{commentId}}
```

**Test**: ✅ Viết review, bình luận, like

---

### 7️⃣ **User Management Flow**

```
1. USER-001: Update My Profile
   → Cập nhật tên, phone

2. USER-002: Add Address
   → Thêm địa chỉ giao hàng

3. USER-003: Get My Addresses
   → Xem danh sách địa chỉ
```

**Test**: ✅ Cập nhật profile, quản lý địa chỉ

---

### 8️⃣ **Admin Functions Flow**

```
1. (Đăng nhập với admin account) AUTH-002
   → Email: admin@example.com
   → Password: admin123

2. ADMIN-001: Get All Users
   → Xem danh sách user

3. ADMIN-002: Get All Orders
   → Xem tất cả đơn hàng

4. ADMIN-003: Order Statistics
   → Thống kê đơn hàng (doanh thu, số lượng)

5. ADMIN-004: Import Products
   → Nhập hàng (tăng stock sản phẩm)

6. BRD-001: Create Brand (Admin)
   → Quản lý thương hiệu
```

**Test**: ✅ Admin các chức năng

---

## 🧪 Complete End-to-End Test Scenario

**Ngắn gọn: Signup → Browse → Order → Review → Đánh giá**

```
1. AUTH-001: Signup (tạo account mới)
2. PROD-001: Get All Products (xem sản phẩm)
3. PROD-002: Get Product by ID (xem chi tiết)
4. ORD-001: Create Order (mua hàng)
5. ORD-002: Get My Orders (xem đơn của tôi)
6. REV-001: Create Review (viết review)
7. COM-001: Create Comment (bình luận)
```

**Kỳ vọng**: ✅ 7/7 thành công (PASS)

---

## 💡 Tips & Tricks

### Auto-Extract từ Response

Các endpoint đã được setup tự động lưu variables:
- **Auth-002** → `token`, `userId`
- **PROD-002** → `productId`
- **ORD-001** → `orderId`
- **REV-001** → `reviewId`
- **BRD-001** → `brandId`

Bạn có thể dùng `{{variableName}}` trong URL/body của request tiếp theo.

### Debug Mode

Mở **Console** (Ctrl+Alt+C) để xem logs & responses:
```
✅ Signup success, token saved
✅ Brand created: Samsung
✅ Order created: 65f7a8b9c1d2e3f4g5h6i7
```

### Reuse Variables

```
URL: {{baseUrl}}/api/v1/orders/{{orderId}}
Header: Authorization: Bearer {{token}}
Body: "productId": "{{productId}}"
```

---

## ⚠️ Common Issues

### Issue 1: "401 Unauthorized"
**Solution**: Đảm bảo token được lưu vào environment sau khi login
- Run AUTH-002: Login trước
- Copy token từ response tab

### Issue 2: "No productId found"
**Solution**: Run PROD-002: Get Product by ID trước
- Nó sẽ auto-save productId

### Issue 3: "Backend server not running"
**Solution**: Start backend trước
```powershell
cd Back-end
npm start
```

### Issue 4: "MongoDB connection failed"
**Solution**: Start MongoDB
```powershell
mongod
```

---

## 📊 Request Statistics

| Folder | Requests | Est. Time |
|--------|----------|-----------|
| 🔐 Authentication | 5 | 2-3s |
| 🏢 Brand Management | 5 | 1-2s |
| 📂 Category Management | 3 | 1s |
| 📦 Product Management | 6 | 2-3s |
| 🛒 Order Management | 5 | 2-3s |
| 💳 Payment | 3 | 1-2s |
| ⭐ Review & Comment | 5 | 2-3s |
| 👤 User Management | 3 | 1-2s |
| 📊 Admin Functions | 4 | 2-3s |
| 🌍 Location Management | 2 | 1s |
| 🔗 Health & Status | 2 | <1s |
| **TOTAL** | **43** | **~18-23s** |

---

## 🚀 Next Steps

1. ✅ Import collection
2. ✅ Setup environment variables
3. ✅ Start backend + MongoDB
4. ✅ Run flows một cách tuần tự
5. ✅ Kiểm tra responses & status codes
6. ✅ Xem logs ở console
7. ✅ Ghi nhận kết quả (PASS/FAIL)

---

## 📞 Troubleshooting

**Cần help?**
- Xem response body & status code
- Check console logs (Ctrl+Alt+C)
- Verify token & environment variables
- Restart backend if needed

**Chạy lại?**
- Reset variables: Environment dropdown → Edit → Reset to initial values
- Xóa data: Stop backend, delete MongoDB data, start lại
- Logout: Cập nhật token = "" trong environment

---

**Phiên bản**: 1.0  
**Ngày**: December 21, 2025  
**Total Requests**: 43  
**Estimated Test Time**: ~18-23 seconds
