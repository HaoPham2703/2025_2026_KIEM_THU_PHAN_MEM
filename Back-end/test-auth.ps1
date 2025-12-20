# Script nhanh để test Auth Controller
# Sử dụng: .\test-auth.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Testing Auth Controller" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location $PSScriptRoot

# Test comprehensive file
Write-Host "Running comprehensive auth tests..." -ForegroundColor Green
npx jest --runInBand tests/unit/controllers/authController.comprehensive.test.js --verbose

Write-Host ""
Write-Host "Test completed!" -ForegroundColor Green
