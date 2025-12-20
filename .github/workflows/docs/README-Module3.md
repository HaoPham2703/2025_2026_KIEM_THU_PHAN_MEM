# Module3 - Product Management Test Workflow

## 📋 Tổng Quan

Workflow này tự động chạy test cho **Module 3 - Product Management** của dự án HCShop, bao gồm các chức năng quản lý sản phẩm.

## 🎯 Phạm Vi Test

### Function A: Xem danh sách sản phẩm (Get All Products)
- **6 test cases**: PROD-001 to PROD-006
- Test pagination, sorting, field selection, top products
- Không yêu cầu authentication

### Function B: Xem chi tiết sản phẩm (Get Product)
- **3 test cases**: PROD-007 to PROD-009
- Test xem chi tiết, product not found, invalid ID
- Không yêu cầu authentication

### Function C: Tìm kiếm sản phẩm (Search Products)
- **3 test cases**: PROD-010 to PROD-012
- Test full-text search theo title và description
- Không yêu cầu authentication

### Function D: Lọc sản phẩm (Filter Products)
- **6 test cases**: PROD-013 to PROD-018
- Test filter theo category, brand, price range, rating, inventory
- Test kết hợp nhiều filter

### Function E: Thêm sản phẩm (Create Product - Admin/Employee)
- **9 test cases**: PROD-019 to PROD-027
- Test tạo sản phẩm với role admin và employee
- Test validation (required fields, duplicate title, promotion)
- Test security (unauthorized, forbidden)

### Function F: Cập nhật sản phẩm (Update Product - Admin/Employee)
- **4 test cases**: PROD-028 to PROD-031
- Test cập nhật bởi admin và employee
- Test product not found, security

### Function G: Xóa sản phẩm (Delete Product - Admin/Employee)
- **4 test cases**: PROD-032 to PROD-035
- Test xóa sản phẩm bởi admin
- Test product not found, security

**Tổng cộng: 35 test cases**

## 🔄 Trigger Events

Workflow chạy khi:
- **Push** code lên branch `weblau`
- **Pull Request** vào branch `weblau`

## 🛠️ Môi Trường Test

- **Node.js**: v18.x
- **MongoDB**: v6.0
- **Test Framework**: Jest
- **Database**: mongodb://localhost:27017/hcshop-test

## 📊 Test Coverage

Workflow tự động:
1. ✅ Chạy tất cả 35 test cases
2. 📈 Tạo coverage report
3. 📝 Xuất kết quả ra GitHub Actions Summary
4. 💬 Comment kết quả vào Pull Request
5. 📦 Upload test results và coverage artifacts

## 📁 File Liên Quan

```
Demo_1/
├── Back-end/
│   ├── tests/
│   │   └── unit/
│   │       └── controllers/
│   │           └── productController.test.js    # File test
│   ├── controllers/
│   │   └── productController.js                 # Controller được test
│   ├── models/
│   │   └── productModel.js                      # Model sản phẩm
│   └── routes/
│       └── productRoutes.js                     # Routes
├── .github/
│   └── workflows/
│       ├── module3-product-test.yml             # Workflow file
│       └── README-Module3.md                    # File này
└── Module3_Product.md                           # Test case documentation
```

## 🚀 Cách Chạy Test Locally

### 1. Cài đặt dependencies
```bash
cd Back-end
npm install
```

### 2. Khởi động MongoDB
```bash
# Sử dụng Docker
docker run -d -p 27017:27017 --name mongodb mongo:6.0

# Hoặc MongoDB local
mongod
```

### 3. Set environment variables
```bash
export DATABASE=mongodb://localhost:27017/hcshop-test
export JWT_SECRET=test-secret-key
export JWT_EXPIRES_IN=90d
export JWT_COOKIE_EXPIRES_IN=90
```

### 4. Chạy test cho Module3
```bash
# Chạy test với coverage
npx jest tests/unit/controllers/productController.test.js --coverage

# Chạy test cụ thể
npx jest tests/unit/controllers/productController.test.js -t "PROD-001"

# Watch mode
npx jest tests/unit/controllers/productController.test.js --watch
```

## 📋 Test Case Mapping

| Test ID Range | Function | Description |
|---------------|----------|-------------|
| PROD-001 - PROD-006 | Get All Products | Xem danh sách, pagination, sort, fields |
| PROD-007 - PROD-009 | Get Product | Xem chi tiết sản phẩm |
| PROD-010 - PROD-012 | Search Products | Tìm kiếm sản phẩm |
| PROD-013 - PROD-018 | Filter Products | Lọc sản phẩm theo nhiều tiêu chí |
| PROD-019 - PROD-027 | Create Product | Thêm sản phẩm (Admin/Employee) |
| PROD-028 - PROD-031 | Update Product | Cập nhật sản phẩm (Admin/Employee) |
| PROD-032 - PROD-035 | Delete Product | Xóa sản phẩm (Admin/Employee) |

## 🔍 API Endpoints Được Test

### Public Endpoints (Không cần authentication)
- `GET /api/v1/products` - Xem danh sách sản phẩm
- `GET /api/v1/products/top-5-cheap` - Top 5 sản phẩm rẻ nhất
- `GET /api/v1/products/:id` - Xem chi tiết sản phẩm

### Protected Endpoints (Yêu cầu Admin/Employee)
- `POST /api/v1/products` - Thêm sản phẩm mới
- `PATCH /api/v1/products/:id` - Cập nhật sản phẩm
- `DELETE /api/v1/products/:id` - Xóa sản phẩm

## 📊 Expected Results

### Success Criteria
- ✅ Tất cả 35 test cases pass
- ✅ Coverage >= 80%
- ✅ Không có lỗi lint
- ✅ Test execution time < 30s

### Test Statistics (Expected)
- **Total Tests**: 35
- **Passed**: 35 (100%)
- **Failed**: 0
- **Duration**: ~15-20 seconds

## 🐛 Debug Test Failures

Nếu test fail, kiểm tra:

1. **Database Connection**
   ```bash
   # Kiểm tra MongoDB đang chạy
   mongosh --eval "db.adminCommand('ping')"
   ```

2. **Environment Variables**
   ```bash
   # Kiểm tra biến môi trường
   echo $DATABASE
   echo $JWT_SECRET
   ```

3. **Test Data**
   ```bash
   # Xóa test database
   mongosh hcshop-test --eval "db.dropDatabase()"
   ```

4. **Dependencies**
   ```bash
   # Cài lại dependencies
   rm -rf node_modules package-lock.json
   npm install
   ```

## 📈 Coverage Report

Coverage report được tạo ở:
- **Console**: Hiển thị trong terminal
- **HTML**: `Back-end/coverage/lcov-report/index.html`
- **JSON**: `Back-end/coverage/coverage-final.json`

Để xem HTML report:
```bash
cd Back-end/coverage/lcov-report
open index.html  # macOS
xdg-open index.html  # Linux
start index.html  # Windows
```

## 🔐 Security Tests

Workflow test các security aspects:
- ✅ Authentication (protect middleware)
- ✅ Authorization (restrictTo middleware)
- ✅ Input validation
- ✅ Duplicate prevention (unique title)
- ✅ Business logic validation (promotion <= price)

## 📝 Ghi Chú

1. **Model Relationships**:
   - Product belongs to Category (ref)
   - Product belongs to Brand (ref)
   - Product has many Reviews (virtual populate)

2. **Validation Rules**:
   - Title: 10-200 ký tự, unique
   - Price: bắt buộc
   - Promotion: phải <= price
   - RatingsAverage: 1-5 sao

3. **Query Features**:
   - Pagination: `?page=1&limit=10`
   - Sort: `?sort=price` hoặc `?sort=-price`
   - Fields: `?fields=title,price`
   - Filter: `?category=id&price[gte]=10000000`
   - Search: `?search=keyword`

4. **Test Mocking**:
   - Factory functions được mock để test logic
   - Middleware (protect, restrictTo) được test qua integration

## 🔗 Liên Kết

- **Main Documentation**: [Module3_Product.md](../../Module3_Product.md)
- **Controller**: [productController.js](../../Back-end/controllers/productController.js)
- **Model**: [productModel.js](../../Back-end/models/productModel.js)
- **Routes**: [productRoutes.js](../../Back-end/routes/productRoutes.js)

## 👥 Maintainers

- **Tester**: HaoPham
- **Module**: Module3 - Product Management
- **Last Updated**: 18/12/2025

## 📞 Support

Nếu gặp vấn đề với workflow:
1. Kiểm tra logs trong GitHub Actions
2. Xem test results artifact
3. Chạy test locally để debug
4. Kiểm tra MongoDB connection
5. Verify environment variables

