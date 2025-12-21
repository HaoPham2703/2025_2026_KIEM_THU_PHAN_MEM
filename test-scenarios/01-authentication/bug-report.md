# BUG REPORT - AUTHENTICATION MODULE

**Dự án**: E-Commerce System  
**Module**: Authentication & Authorization  
**Ngày báo cáo**: 21/12/2025  
**Người báo cáo**: Test Team  
**Phiên bản**: 1.0.0

---

## BUG SUMMARY

| Tổng số bugs | Critical | High | Medium | Low | Fixed | Open |
|-------------|----------|------|--------|-----|-------|------|
| 3 | 0 | 0 | 1 | 2 | 3 | 0 |

---

## BUG-AUTH-001: Login returns 302 redirect instead of JSON response

### Thông tin cơ bản
- **Bug ID**: BUG-AUTH-001
- **Severity**: Medium
- **Priority**: High
- **Status**: ✅ Fixed
- **Reported by**: Tester A
- **Reported date**: 2025-12-19
- **Fixed date**: 2025-12-20
- **Fixed by**: Developer B
- **Component**: authController.js - login function

### Mô tả lỗi
Khi đăng nhập thành công qua API, thay vì trả về JSON response với status 200, hệ thống trả về HTTP 302 redirect. Điều này gây lỗi cho các API client và frontend applications không xử lý redirect.

### Bước tái hiện
1. Gửi POST request đến `/api/v1/users/login`
2. Body: `{ "email": "user@test.com", "password": "Test@123" }`
3. Quan sát response

### Kết quả thực tế
```
Status: 302 Found
Location: /
Set-Cookie: jwt=...
```

### Kết quả mong đợi
```json
Status: 200 OK
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "data": {
    "user": {
      "id": "...",
      "name": "...",
      "email": "...",
      "role": "..."
    }
  }
}
```

### Root Cause
Code trong authController.js có `res.redirect('/')` thay vì `res.json()`

### Fix Applied
```javascript
// Before:
res.redirect('/');

// After:
res.status(200).json({
  status: 'success',
  token,
  data: { user }
});
```

### Test Coverage
- ✅ TC-AUTH-007: Login với thông tin hợp lệ
- ✅ Regression test passed
- ✅ Integration test updated

### Related Issues
- Ảnh hưởng đến: Frontend login flow
- Liên quan: Mobile app authentication

---

## BUG-AUTH-002: Reset token expiration error message không rõ ràng

### Thông tin cơ bản
- **Bug ID**: BUG-AUTH-002
- **Severity**: Low
- **Priority**: Medium
- **Status**: ✅ Fixed
- **Reported by**: Tester C
- **Reported date**: 2025-12-19
- **Fixed date**: 2025-12-20
- **Fixed by**: Developer D
- **Component**: authController.js - resetPassword function

### Mô tả lỗi
Khi token reset password hết hạn, error message trả về là "Token is invalid or has expired" - quá chung chung. User không biết chính xác token đã hết hạn hay token sai.

### Bước tái hiện
1. Request forgot password để tạo reset token
2. Đợi token hết hạn (>10 phút)
3. Gửi PATCH request đến `/api/v1/users/resetPassword/:token`
4. Body: `{ "password": "NewPass@123", "passwordConfirm": "NewPass@123" }`
5. Quan sát error message

### Kết quả thực tế
```json
{
  "status": "error",
  "message": "Token is invalid or has expired"
}
```

### Kết quả mong đợi
```json
{
  "status": "error",
  "message": "Password reset token has expired. Please request a new one.",
  "code": "TOKEN_EXPIRED"
}
```

### Root Cause
Code không phân biệt giữa invalid token và expired token

### Fix Applied
```javascript
// Before:
if (!user || !user.passwordResetExpires || user.passwordResetExpires < Date.now()) {
  return next(new AppError('Token is invalid or has expired', 400));
}

// After:
if (!user) {
  return next(new AppError('Token is invalid', 400));
}
if (!user.passwordResetExpires || user.passwordResetExpires < Date.now()) {
  return next(new AppError('Password reset token has expired. Please request a new one.', 400));
}
```

### Test Coverage
- ✅ TC-AUTH-016: Token hết hạn
- ✅ Error message validation added

### Impact
- Cải thiện UX
- User hiểu rõ hơn lý do lỗi

---

## BUG-AUTH-003: Verify email template thiếu logo và styling

### Thông tin cơ bản
- **Bug ID**: BUG-AUTH-003
- **Severity**: Low
- **Priority**: Low
- **Status**: ✅ Fixed
- **Reported by**: Tester E
- **Reported date**: 2025-12-20
- **Fixed date**: 2025-12-21
- **Fixed by**: Developer F
- **Component**: views/email/verifyEmail.pug

### Mô tả lỗi
Email xác thực tài khoản gửi đến user không có logo công ty và styling kém, trông không professional.

### Bước tái hiện
1. Đăng ký tài khoản mới
2. Kiểm tra email verification được gửi
3. Quan sát layout và styling

### Kết quả thực tế
- Email plain text không có logo
- Không có branding
- Link xác thực là plain text URL

### Kết quả mong đợi
- Email có logo công ty
- Styling đẹp, professional
- Button xác thực thay vì plain link
- Footer với thông tin liên hệ

### Root Cause
Template email chưa được thiết kế đầy đủ

### Fix Applied
- Thêm logo vào header
- Implement responsive email template
- Thêm button styling cho verification link
- Thêm footer với contact info

### Test Coverage
- ✅ Visual testing
- ✅ Email rendering test trên các email clients

### Impact
- Cải thiện professional image
- Tăng trust của users

---

## BUGS FOUND IN PREVIOUS VERSIONS (Reference Only)

### BUG-AUTH-004: Password không được hash khi signup (CRITICAL - FIXED IN v0.9)

**Severity**: Critical  
**Status**: ✅ Fixed (v0.9.0)  
**Description**: Password được lưu dưới dạng plain text trong database

**Fix**: Implement bcrypt hashing trong User model pre-save middleware

---

### BUG-AUTH-005: JWT secret hardcoded in code (HIGH - FIXED IN v0.8)

**Severity**: High  
**Status**: ✅ Fixed (v0.8.5)  
**Description**: JWT secret key bị hardcode trong source code thay vì sử dụng environment variable

**Fix**: Move JWT secret sang config.env file

---

## KNOWN ISSUES & WORKAROUNDS

### ISSUE-001: Rate limiting có thể bypass qua proxy

**Severity**: Medium  
**Status**: 🔄 Known Issue  
**Description**: Rate limiting hiện tại dựa trên IP address, có thể bypass bằng cách sử dụng proxy hoặc VPN

**Workaround**: Hiện tại chưa có workaround. Đang nghiên cứu fingerprinting solution.

**Plan**: Sẽ implement device fingerprinting trong version 1.1.0

---

### ISSUE-002: Social login chưa test đầy đủ

**Severity**: Low  
**Status**: 🔄 Known Issue  
**Description**: Google login chỉ được test trên admin role, chưa test đầy đủ cho user role

**Workaround**: Hiện tại limit social login cho admin only

**Plan**: Mở rộng test coverage cho social login trong sprint tiếp theo

---

## BUG TRENDS

### Bugs by Category
```
Authentication Logic:   1 bug (33%)
Error Messages:         1 bug (33%)
UI/UX:                 1 bug (33%)
```

### Bugs by Severity
```
Critical:  0 bugs (0%)
High:      0 bugs (0%)
Medium:    1 bug (33%)
Low:       2 bugs (67%)
```

### Fix Time Analysis
```
Average fix time: 8 hours
Fastest fix:      4 hours (BUG-AUTH-002)
Slowest fix:      12 hours (BUG-AUTH-003)
```

---

## TESTING GAPS IDENTIFIED

### 1. Social Authentication
- ❌ Chưa test Google login cho user role
- ❌ Chưa test Facebook login
- ❌ Chưa test Apple login
- ❌ Chưa test error handling khi OAuth provider fail

### 2. Edge Cases
- ❌ Chưa test behavior khi database connection lost
- ❌ Chưa test concurrent login từ nhiều devices
- ❌ Chưa test session timeout handling
- ❌ Chưa test maximum login attempts

### 3. Performance
- ⚠️ Chưa test với > 1000 concurrent users
- ⚠️ Chưa test password hashing performance với cost factor cao
- ⚠️ Chưa load test forgot password email sending

### 4. Security
- ⚠️ Chưa penetration test đầy đủ
- ⚠️ Chưa test CSRF protection
- ⚠️ Chưa test session hijacking scenarios

---

## RECOMMENDATIONS

### Immediate Actions
1. ✅ Fix tất cả bugs đã report (COMPLETED)
2. 🔄 Thêm test cases cho social login
3. 🔄 Implement better rate limiting
4. 🔄 Add security headers

### Future Improvements
1. Implement 2FA (Two-Factor Authentication)
2. Add biometric authentication support
3. Implement SSO (Single Sign-On)
4. Add CAPTCHA cho login form sau nhiều failed attempts
5. Implement session management dashboard cho users

---

## BUG PREVENTION MEASURES

### Code Review Checklist
- ✅ Authentication logic được review bởi ≥2 developers
- ✅ Security implications được đánh giá
- ✅ Error handling được implement đầy đủ
- ✅ Test coverage ≥90%

### Testing Strategy
- ✅ Unit tests cho mọi authentication functions
- ✅ Integration tests cho authentication flows
- ✅ Security tests cho vulnerability scanning
- ✅ Performance tests cho concurrent operations

### Monitoring
- ✅ Log tất cả failed login attempts
- ✅ Alert khi có abnormal pattern (brute force)
- ✅ Track password reset requests
- ✅ Monitor token generation/validation

---

## ATTACHMENTS

### Screenshots
- `bug-auth-001-screenshot.png`: Login redirect issue
- `bug-auth-003-email.png`: Email template before fix

### Logs
- `bug-auth-001.log`: Request/response logs
- `bug-auth-002.log`: Error logs

### Code Diffs
- `bug-auth-001.diff`: Login fix
- `bug-auth-002.diff`: Error message improvement
- `bug-auth-003.diff`: Email template update

---

## SIGN-OFF

**Prepared by**: Test Lead  
**Reviewed by**: Development Lead  
**Approved by**: Product Owner  

**Date**: 21/12/2025

---

**End of Bug Report**
