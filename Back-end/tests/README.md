# Hướng dẫn Testing

## Cấu trúc thư mục

```
tests/
├── unit/                    # Unit tests
│   └── controllers/         # Tests cho controllers
│       └── authController.test.js
├── integration/             # Integration tests (sẽ thêm sau)
├── helpers/                 # Helper functions cho testing
│   └── testHelpers.js
├── setup.js                 # Setup file cho Jest
└── README.md               # File này
```

## Chạy tests

```bash
# Chạy tất cả tests
npm test

# Chạy tests với watch mode
npm run test:watch

# Chạy tests với coverage report
npm run test:coverage
```

## Viết test mới

1. Tạo file test trong thư mục phù hợp:
   - Unit tests: `tests/unit/controllers/`
   - Integration tests: `tests/integration/`

2. Sử dụng helper functions từ `tests/helpers/testHelpers.js`

3. Đảm bảo file test có đuôi `.test.js`

## Test Coverage

Các test hiện tại bao gồm:
- ✅ Đăng ký và xác thực (authController)
- ⏳ Sẽ thêm các test khác...

