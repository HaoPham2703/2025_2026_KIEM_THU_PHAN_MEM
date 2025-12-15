# 📖 Hướng dẫn xem Test Logs trên GitHub Actions

## Cách xem log chi tiết các test failed

### 1. Xem trên GitHub Actions Interface

1. **Vào trang Actions:**
   - Click vào tab **"Actions"** trên repository của bạn
   - Chọn workflow run mới nhất (có thể thấy status: Success/Failure)

2. **Xem summary:**
   - Scroll xuống phần **"Summary"** (ở cuối trang)
   - Sẽ thấy bảng **"Test Results Summary"** với:
     - Tổng số tests
     - Số tests passed
     - Số tests failed
     - Danh sách các test failed (nếu có)

3. **Xem log chi tiết:**
   - Ở phần **"Jobs"** bên trái, click vào **"Test Backend"**
   - Hoặc scroll xuống phần jobs, click vào job **"Test Backend"**
   - Click vào step **"Run tests"** để xem log đầy đủ
   - Scroll xuống trong log để xem:
     - Test nào đang chạy
     - Test nào pass (✅)
     - Test nào fail (❌)
     - Lỗi cụ thể của từng test

### 2. Tải Test Results JSON

1. **Download artifacts:**
   - Scroll xuống cuối trang workflow run
   - Tìm phần **"Artifacts"**
   - Click vào **"test-results"** để download
   - File JSON chứa thông tin chi tiết về tất cả tests

2. **Parse JSON:**
   - Mở file `test-results.json`
   - Tìm các test có `"status": "failed"`
   - Xem `failureMessages` để biết lỗi cụ thể

### 3. Xem Coverage Report

1. **Download coverage:**
   - Tải artifact **"backend-coverage"**
   - Giải nén file

2. **Mở coverage report:**
   - Mở file `coverage/index.html` trong browser
   - Xem coverage chi tiết cho từng file
   - Xem các dòng code chưa được test

### 4. Các lỗi thường gặp trong test

#### Test fail với "Number of calls: 0"
- **Nguyên nhân:** Controller function không được gọi hoặc không trả về response
- **Giải pháp:** Kiểm tra xem controller có được import đúng không, có async/await đúng không

#### Test fail với "Cannot read properties of null"
- **Nguyên nhân:** Database query trả về null
- **Giải pháp:** Kiểm tra xem user có được tạo trong database chưa, có dùng đúng email không

#### Test fail với "expect(...).toHaveBeenCalledWith(...)"
- **Nguyên nhân:** Response không đúng format hoặc không được gọi
- **Giải pháp:** Kiểm tra mock setup, kiểm tra controller logic

### 5. Tips để debug nhanh

1. **Tìm test failed nhanh:**
   - Trong log, tìm dòng có `●` (bullet point) - đây là test đang fail
   - Tìm dòng có `FAIL` - đây là test suite failed

2. **Xem error message:**
   - Scroll xuống dưới mỗi test failed
   - Tìm phần `Expected:` và `Received:` để so sánh

3. **Check console logs:**
   - Nếu có `console.log` trong code, sẽ hiển thị trong log
   - Có thể thấy giá trị thực tế của variables

### 6. Ví dụ log output

```
FAIL tests/unit/controllers/authController.test.js
  Auth Controller - Đăng ký và Xác thực
    signup - Đăng ký người dùng
      ✕ nên tạo người dùng mới thành công (387 ms)

  ● Auth Controller - Đăng ký và Xác thực › signup - Đăng ký người dùng › nên tạo người dùng mới thành công

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    Expected: 201

    Number of calls: 0

      53 |       await authController.signup(req, res, next);
      54 |
    > 55 |       expect(res.status).toHaveBeenCalledWith(201);
         |                          ^
```

Trong ví dụ trên:
- Test `nên tạo người dùng mới thành công` đang fail
- Lỗi: `res.status` không được gọi với giá trị `201`
- Có thể controller không trả về response đúng

---

**Lưu ý:** Nếu không thấy log chi tiết, có thể test đã bị timeout hoặc có lỗi trong setup. Kiểm tra phần "Annotations" ở cuối workflow run để xem warnings/errors.

