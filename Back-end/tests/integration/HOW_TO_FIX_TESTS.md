# Hướng dẫn sửa Integration Tests

## 🔍 Vấn đề chính

82/103 tests đang fail với các lỗi chính:

1. `Cannot read properties of null (reading 'inventory')` - 18 lần
2. `Cannot read properties of null (reading 'balance')` - 8 lần
3. `Cannot read properties of undefined (reading '_id')` - Nhiều lần
4. `expect(received).toBe(expected)` - Status code hoặc response structure không đúng

## 🔧 Pattern sửa chữa

### Pattern 1: Thêm null checks cho Product

**Trước:**

```javascript
const updatedProduct = await Product.findById(productId);
expect(updatedProduct.inventory).toBe(expected);
```

**Sau:**

```javascript
const updatedProduct = await Product.findById(productId);
expect(updatedProduct).toBeTruthy();
expect(updatedProduct.inventory).toBe(expected);
```

### Pattern 2: Thêm null checks cho User

**Trước:**

```javascript
const updatedUser = await User.findById(userId);
expect(updatedUser.balance).toBe(expected);
```

**Sau:**

```javascript
const updatedUser = await User.findById(userId);
expect(updatedUser).toBeTruthy();
expect(updatedUser.balance).toBe(expected);
```

### Pattern 3: Thêm null checks cho Order

**Trước:**

```javascript
const order = await Order.findById(orderId);
expect(order.status).toBe("Processed");
```

**Sau:**

```javascript
const order = await Order.findById(orderId);
expect(order).toBeTruthy();
expect(order.status).toBe("Processed");
```

### Pattern 4: Thêm checks cho response structure

**Trước:**

```javascript
const ordersResponse = await request(app).get("/api/v1/orders");
const firstOrderId = ordersResponse.body.data.data[0]._id;
```

**Sau:**

```javascript
const ordersResponse = await request(app).get("/api/v1/orders");
expect(ordersResponse.body.data).toBeDefined();
expect(ordersResponse.body.data.data).toBeDefined();
expect(Array.isArray(ordersResponse.body.data.data)).toBe(true);
expect(ordersResponse.body.data.data.length).toBeGreaterThan(0);
const firstOrderId = ordersResponse.body.data.data[0]._id;
```

### Pattern 5: Wait for async post-hooks

**Trước:**

```javascript
await createOrder();
const product = await Product.findById(productId);
```

**Sau:**

```javascript
await createOrder();
// Wait for post-hooks to complete
await new Promise((resolve) => setTimeout(resolve, 100));
const product = await Product.findById(productId);
```

## 📋 Checklist cho mỗi test file

Khi sửa một test file, đảm bảo:

- [ ] Tất cả `Product.findById()` có null check
- [ ] Tất cả `User.findById()` có null check
- [ ] Tất cả `Order.findById()` có null check
- [ ] Tất cả array access có length check
- [ ] Tất cả response.body.data có undefined check
- [ ] Status code assertions đúng với API
- [ ] Response structure assertions đúng với API

## 🚀 Cách sửa nhanh

1. Mở file test cần sửa
2. Tìm tất cả các dòng có pattern:
   - `await Product.findById(...)`
   - `await User.findById(...)`
   - `await Order.findById(...)`
   - `response.body.data.data[0]`
3. Thêm null/undefined checks trước khi access properties
4. Chạy test để verify

## 📝 Files đã sửa

- ✅ `loginToPurchase.test.js` - Đã thêm null checks
- ✅ `purchaseWithBalance.test.js` - Đã thêm null checks
- ⏳ Các file còn lại cần sửa tương tự

## 🔗 Tham khảo

- API Response Structure: Xem `Back-end/controllers/handlerFactory.js`
- Error Handling: Xem `Back-end/controllers/errorController.js`
- Test Examples: Xem các file đã sửa trong `Back-end/tests/integration/`
