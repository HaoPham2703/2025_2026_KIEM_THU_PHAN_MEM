# 🧪 HƯỚNG DẪN CHẠY TESTS

## 📋 Yêu cầu
- Node.js >= 18.x
- npm hoặc yarn
- MongoDB Memory Server (tự động tải khi chạy test lần đầu)

## 🚀 Cách chạy tests

### 1. Cài đặt dependencies (chỉ cần làm 1 lần)
```powershell
cd Back-end
npm install
```

### 2. Chạy test bằng npm scripts

#### Chạy TẤT CẢ tests
```powershell
npm test
```

#### Chạy tests Auth Controller (file cũ)
```powershell
npm test -- authController.test.js
```

#### Chạy tests Auth Controller COMPREHENSIVE (file mới - đầy đủ)
```powershell
npm test -- authController.comprehensive.test.js
```

#### Chạy với coverage
```powershell
npm run test:coverage
```

#### Chạy ở chế độ watch (tự động chạy lại khi file thay đổi)
```powershell
npm run test:watch
```

### 3. Chạy test bằng npx (trực tiếp)

```powershell
# Chạy file cụ thể
npx jest --runInBand tests/unit/controllers/authController.comprehensive.test.js

# Chạy với verbose output
npx jest --runInBand --verbose tests/unit/controllers/authController.comprehensive.test.js

# Chạy tất cả test auth
npx jest --runInBand tests/unit/controllers/authController*.test.js
```

### 4. Chạy bằng PowerShell scripts (đơn giản nhất)

```powershell
# Chạy auth tests
.\test-auth.ps1

# Chạy với options
.\run-tests.ps1 authController.comprehensive.test.js
.\run-tests.ps1 -Coverage
.\run-tests.ps1 -Watch
```

## 📊 Các Test Cases trong Auth Module

### File: `authController.comprehensive.test.js`

#### 1️⃣ SIGNUP - Đăng ký
- ✅ TC_SIGNUP_01: Tạo user mới thành công
- ✅ TC_SIGNUP_02: Lỗi email đã tồn tại
- ✅ TC_SIGNUP_03: Hash password đúng cách
- ✅ TC_SIGNUP_04: Validate password confirmation

#### 2️⃣ LOGIN - Đăng nhập
- ✅ TC_LOGIN_01: Đăng nhập thành công
- ✅ TC_LOGIN_02: Lỗi email không tồn tại
- ✅ TC_LOGIN_03: Lỗi password sai
- ✅ TC_LOGIN_04: Lỗi thiếu email
- ✅ TC_LOGIN_05: Lỗi thiếu password

#### 3️⃣ JWT TOKEN GENERATION
- ✅ TC_TOKEN_01: Tạo JWT token hợp lệ
- ✅ TC_TOKEN_02: Token có expiry time
- ✅ TC_TOKEN_03: Token chứa user ID

#### 4️⃣ PASSWORD VALIDATION
- ✅ TC_PASS_VALID_01: Độ dài >= 6 ký tự
- ✅ TC_PASS_VALID_02: Không có khoảng trắng
- ✅ TC_PASS_VALID_03: Password match confirmation

#### 5️⃣ CHANGE PASSWORD
- ✅ TC_CHANGE_PASS_01: Đổi password thành công
- ✅ TC_CHANGE_PASS_02: Lỗi old password sai
- ✅ TC_CHANGE_PASS_03: Tạo JWT token mới

#### 6️⃣ LOGOUT
- ✅ TC_LOGOUT_01: Xóa JWT cookie
- ✅ TC_LOGOUT_02: Return status 200
- ✅ TC_LOGOUT_03: Cookie expiry ngay lập tức

#### 7️⃣ PROTECT MIDDLEWARE
- ✅ TC_PROTECT_01: Cho phép với token hợp lệ
- ✅ TC_PROTECT_02: Lỗi không có token
- ✅ TC_PROTECT_03: Lỗi user không tồn tại
- ✅ TC_PROTECT_04: Lỗi password đã thay đổi

#### 8️⃣ RESTRICT TO ROLE
- ✅ TC_RESTRICT_01: Cho phép admin
- ✅ TC_RESTRICT_02: Từ chối user
- ✅ TC_RESTRICT_03: Multiple roles
- ✅ TC_RESTRICT_04: User undefined

## 🔧 Troubleshooting

### Lỗi: "jest not found"
```powershell
npm install
```

### Lỗi: MongoDB Memory Server không tải được
```powershell
# Set environment variable
$env:MONGOMS_DOWNLOAD_URL="https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-6.0.14.zip"
npm test
```

### Lỗi: Timeout
```powershell
# Tăng timeout trong jest.config.js
# testTimeout: 120000
```

### Xem output chi tiết
```powershell
npx jest --runInBand --verbose --no-coverage authController.comprehensive.test.js
```

## 📝 Ghi chú

- Tất cả tests sử dụng **MongoDB Memory Server** (in-memory database)
- Mỗi test được chạy **tuần tự** (`--runInBand`) để tránh conflict
- Database được **reset** sau mỗi test
- Environment variables được set trong `tests/setup.js`

## 📈 Expected Output

```
PASS  tests/unit/controllers/authController.comprehensive.test.js
  Auth Controller - Comprehensive Unit Tests
    SIGNUP - Đăng ký người dùng
      ✓ TC_SIGNUP_01: Nên tạo user mới thành công (XXXms)
      ✓ TC_SIGNUP_02: Nên trả lỗi 500 khi email đã tồn tại (XXXms)
      ✓ TC_SIGNUP_03: Nên hash password trước khi lưu (XXXms)
      ✓ TC_SIGNUP_04: Nên validate password confirmation (XXXms)
    LOGIN - Đăng nhập
      ✓ TC_LOGIN_01: Nên đăng nhập thành công (XXXms)
      ...

Test Suites: 1 passed, 1 total
Tests:       XX passed, XX total
```

## 🎯 Kết luận

File test comprehensive đã bao phủm đầy đủ các test cases theo yêu cầu:
- ✅ Register success
- ✅ Duplicate email  
- ✅ Login success
- ✅ Wrong password
- ✅ Token generation
- ✅ Password validation error
- ✅ Change password
- ✅ Logout

Tất cả functions được test với mocking database, bcrypt, và JWT.
