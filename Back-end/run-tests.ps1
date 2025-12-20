# Script PowerShell để chạy Jest tests
# Sử dụng: .\run-tests.ps1 [test-file-name]

param(
    [string]$TestFile = "",
    [switch]$Watch,
    [switch]$Coverage
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   JEST TEST RUNNER - Auth Module" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Change to Back-end directory
Set-Location $PSScriptRoot

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

# Build command
$command = "npx jest --runInBand"

if ($TestFile) {
    $command += " $TestFile"
    Write-Host "Running test file: $TestFile" -ForegroundColor Green
} else {
    Write-Host "Running all tests..." -ForegroundColor Green
}

if ($Watch) {
    $command += " --watch"
    Write-Host "Watch mode enabled" -ForegroundColor Yellow
}

if ($Coverage) {
    $command += " --coverage"
    Write-Host "Coverage mode enabled" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Command: $command" -ForegroundColor Gray
Write-Host ""

# Run the command
Invoke-Expression $command
