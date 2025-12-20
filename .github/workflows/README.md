# GitHub Actions Workflows

## 📁 Cấu trúc thư mục

```
.github/workflows/
├── README.md                          # File này
├── test-unit-module1-auth.yml         # Unit tests - Module 1: Authentication
├── test-unit-module2-user.yml         # Unit tests - Module 2: User Management
├── test-unit-module3-product.yml      # Unit tests - Module 3: Product Management
├── test-unit-module4-cart-order.yml   # Unit tests - Module 4: Cart & Order
├── test-unit-module5-payment.yml      # Unit tests - Module 5: Payment
├── test-unit-module6-review-comment.yml # Unit tests - Module 6: Review & Comment
├── test-unit-module7-brand-category.yml # Unit tests - Module 7: Brand & Category
├── test-unit-module8-import-location.yml # Unit tests - Module 8: Import & Location
├── test-integration.yml               # Integration tests - Tất cả integration tests
└── docs/                               # Tài liệu cho các workflows
    ├── README-Integration-Tests.md
    ├── README-Module1.md
    ├── README-Module2.md
    ├── README-Module3.md
    ├── README-Module4.md
    ├── README-Module5.md
    ├── README-Module6.md
    ├── README-Module7.md
    └── README-Module8.md
```

## 🧪 Các loại Tests

### Unit Tests

- **Prefix:** `test-unit-moduleX-*.yml`
- **Mô tả:** Test từng module riêng lẻ (controller, model, middleware)
- **Chạy khi:** Push/PR vào branch `weblau`

### Integration Tests

- **File:** `test-integration.yml`
- **Mô tả:** Test flow nghiệp vụ hoàn chỉnh (đăng nhập → mua hàng, thanh toán, etc.)
- **Chạy khi:** Push/PR vào branch `weblau` hoặc chạy thủ công

## 📚 Tài liệu

Tất cả tài liệu chi tiết về từng workflow được lưu trong thư mục `docs/`:

- `README-Integration-Tests.md` - Hướng dẫn integration tests
- `README-ModuleX.md` - Chi tiết về module X

## 🚀 Cách sử dụng

### Chạy tự động

- Push code lên branch `weblau` → Tất cả workflows tự động chạy
- Tạo Pull Request vào `weblau` → Tất cả workflows tự động chạy

### Chạy thủ công

1. Vào tab **Actions** trên GitHub
2. Chọn workflow muốn chạy
3. Click **Run workflow**
4. Chọn branch và click **Run workflow**

## 📊 Xem kết quả

1. **GitHub Actions Summary:**

   - Vào tab **Actions** → Click vào workflow run → Xem **Summary**

2. **Test Artifacts:**

   - Download artifacts từ workflow run
   - Bao gồm: test results JSON, coverage reports

3. **PR Comments:**
   - Nếu chạy trên Pull Request, kết quả sẽ được comment tự động

## 🔧 Quy ước đặt tên

- **Unit tests:** `test-unit-module{number}-{module-name}.yml`
- **Integration tests:** `test-integration.yml`
- **Documentation:** `README-{ModuleName}.md` trong thư mục `docs/`

## 📝 Notes

- Tất cả workflows chạy trên `ubuntu-latest`
- Sử dụng Node.js 18.x
- MongoDB Memory Server cho tests (không cần DB thật)
- Email và Payment services được mock trong tests

---

**Last Updated:** 20/12/2025
