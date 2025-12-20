# Integration Tests - Fixes Needed

## 🔍 Vấn đề chính

1. **Status Code Assertions**: Một số test expect status code không đúng với API thực tế
2. **Response Structure**: Response structure không khớp với expectations
3. **Null/Undefined Errors**: Truy cập properties của null/undefined objects
4. **Test Isolation**: Tests không được isolate đúng cách, data bị ảnh hưởng lẫn nhau

## 📋 Các lỗi thường gặp

### 1. Status Code Issues

- Login với password sai: API trả về 401 ✅ (đúng)
- Order creation: API trả về 201 ✅ (đúng)
- Error responses: API trả về status "error" ✅ (đúng)

### 2. Response Structure Issues

- Order creation response: `{status: "success", data: {id, totalPrice}}` ✅
- Get order response: `{status: "success", data: {data: order}}` ✅
- Error response: `{status: "error", message: "..."}` ✅

### 3. Null/Undefined Issues

- `Cannot read properties of null (reading 'inventory')` - Product không được refresh
- `Cannot read properties of null (reading 'balance')` - User không được refresh
- `Cannot read properties of undefined (reading '_id')` - Order không được tạo đúng

## 🔧 Cách sửa

### Pattern 1: Refresh data sau mỗi operation

```javascript
// ❌ Wrong
const product = await Product.findById(productId);
expect(product.inventory).toBe(expected);

// ✅ Correct
const updatedProduct = await Product.findById(productId);
expect(updatedProduct).toBeTruthy();
expect(updatedProduct.inventory).toBe(expected);
```

### Pattern 2: Check null trước khi access

```javascript
// ❌ Wrong
expect(order.cart[0].product._id).toBe(productId);

// ✅ Correct
expect(order).toBeTruthy();
expect(order.cart).toBeDefined();
expect(order.cart.length).toBeGreaterThan(0);
expect(order.cart[0].product._id).toBe(productId);
```

### Pattern 3: Wait for async operations

```javascript
// ❌ Wrong
await createOrder();
const product = await Product.findById(productId);

// ✅ Correct
await createOrder();
// Wait a bit for post-hooks to complete
await new Promise((resolve) => setTimeout(resolve, 100));
const product = await Product.findById(productId);
```

### Pattern 4: Use proper response structure

```javascript
// Order creation response
expect(response.body.data.id).toBeDefined();
expect(response.body.data.totalPrice).toBe(expected);

// Get order response
expect(response.body.data.data).toBeDefined();
expect(response.body.data.data._id).toBe(orderId);
```

## 📝 Checklist cho mỗi test file

- [ ] All status code assertions match API
- [ ] All response structure assertions match API
- [ ] All null checks added before property access
- [ ] Data refreshed after async operations
- [ ] Test isolation ensured (cleanup in afterAll)
- [ ] Wait for post-hooks if needed
