# Script chạy thử một luồng test - Dùng khi thầy yêu cầu demo
# Sử dụng: .\chay-thu-luong-test.ps1 [số]

param(
    [int]$LuaChon = 0
)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   CHẠY THỬ LUỒNG TEST - DEMO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($LuaChon -eq 0) {
    Write-Host "Chọn luồng test muốn chạy:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Đăng ký → Mua hàng (KHUYÊN DÙNG - Đầy đủ nhất)" -ForegroundColor Green
    Write-Host "2. Đăng nhập → Mua hàng" -ForegroundColor Green
    Write-Host "3. Mua hàng → Review" -ForegroundColor Green
    Write-Host "4. Mua hàng bằng số dư" -ForegroundColor Green
    Write-Host "5. Mua hàng thanh toán VNPay" -ForegroundColor Green
    Write-Host "6. Hủy đơn hàng → Hoàn tiền" -ForegroundColor Green
    Write-Host "7. Admin quản lý sản phẩm (CRUD)" -ForegroundColor Green
    Write-Host "8. Admin nhập hàng" -ForegroundColor Green
    Write-Host "9. Quên mật khẩu → Reset" -ForegroundColor Green
    Write-Host "10. Unit Test - Module Auth (Nhanh)" -ForegroundColor Green
    Write-Host "11. Unit Test - Module Order" -ForegroundColor Green
    Write-Host ""
    
    $LuaChon = Read-Host "Nhập số (1-11)"
}

# Di chuyển vào thư mục Back-end
$BackEndPath = Join-Path $PSScriptRoot "Back-end"
if (-not (Test-Path $BackEndPath)) {
    Write-Host "❌ Không tìm thấy thư mục Back-end!" -ForegroundColor Red
    exit 1
}

Set-Location $BackEndPath

# Kiểm tra node_modules
if (-not (Test-Path "node_modules")) {
    Write-Host "⚠️  Đang cài đặt dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

# Chọn file test tương ứng
$TestFile = switch ($LuaChon) {
    1 { "tests/integration/signupToPurchase.test.js"; break }
    2 { "tests/integration/loginToPurchase.test.js"; break }
    3 { "tests/integration/purchaseToReview.test.js"; break }
    4 { "tests/integration/purchaseWithBalance.test.js"; break }
    5 { "tests/integration/purchaseWithVNPay.test.js"; break }
    6 { "tests/integration/cancelOrderRefund.test.js"; break }
    7 { "tests/integration/adminProductCRUD.test.js"; break }
    8 { "tests/integration/adminImportProduct.test.js"; break }
    9 { "tests/integration/forgotPasswordFlow.test.js"; break }
    10 { "tests/unit/controllers/authController.comprehensive.test.js"; break }
    11 { "tests/unit/controllers/orderController.test.js"; break }
    default { 
        Write-Host "❌ Lựa chọn không hợp lệ!" -ForegroundColor Red
        exit 1
    }
}

# Mô tả luồng test
$MoTa = switch ($LuaChon) {
    1 { "Đăng ký → Xác thực email → Đăng nhập → Mua hàng" }
    2 { "Đăng nhập → Thêm vào giỏ → Thanh toán" }
    3 { "Mua hàng → Nhận hàng → Đánh giá sản phẩm" }
    4 { "Mua hàng bằng số dư tài khoản" }
    5 { "Mua hàng thanh toán qua VNPay" }
    6 { "Hủy đơn hàng → Hoàn tiền" }
    7 { "Admin quản lý sản phẩm (Tạo, Đọc, Sửa, Xóa)" }
    8 { "Admin nhập hàng vào kho" }
    9 { "Quên mật khẩu → Reset password" }
    10 { "Unit Test - Module Auth (Đăng ký, Đăng nhập, Quên mật khẩu)" }
    11 { "Unit Test - Module Order (Giỏ hàng, Đơn hàng)" }
}

Write-Host "📋 Luồng test: $MoTa" -ForegroundColor Cyan
Write-Host "📁 File: $TestFile" -ForegroundColor Gray
Write-Host ""
Write-Host "🚀 Đang chạy test..." -ForegroundColor Yellow
Write-Host ""

# Chạy test
$command = "npm test -- $TestFile"
Invoke-Expression $command

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ Hoàn thành!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

