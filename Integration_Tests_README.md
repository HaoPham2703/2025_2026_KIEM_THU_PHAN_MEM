# 📋 HƯỚNG DẪN SỬ DỤNG INTEGRATION TESTS REPORT

## 📂 Cấu Trúc Files

Integration Tests Report đã được chia thành các module riêng để dễ quản lý và phù hợp với template Excel:

### 📄 File Tổng Hợp
- **[Integration_Tests_Report_SUMMARY.md](./Integration_Tests_Report_SUMMARY.md)** - Tổng hợp tất cả kết quả test, thống kê, và phân tích

### 📄 Files Module Chi Tiết
1. **[Integration_Auth_Flows.md](./Integration_Auth_Flows.md)** - Flow 7, 8 (4 test cases)
   - Quên mật khẩu → Reset → Đăng nhập
   - Đăng ký → Xác thực → Mua hàng

2. **[Integration_Order_Flows.md](./Integration_Order_Flows.md)** - Flow 1, 2, 3, 11 (10 test cases)
   - Đăng nhập → Mua hàng
   - Mua hàng → Nhận hàng → Đánh giá
   - Admin cập nhật trạng thái → Email
   - User hủy đơn → Hoàn tiền

3. **[Integration_Payment_Flows.md](./Integration_Payment_Flows.md)** - Flow 4, 5 (7 test cases)
   - Mua hàng → Thanh toán số dư
   - Mua hàng → Thanh toán VNPay → Xác nhận

4. **[Integration_Review_Flows.md](./Integration_Review_Flows.md)** - Flow 6 (3 test cases)
   - User đánh giá → Bình luận → Like comment

5. **[Integration_Product_Flows.md](./Integration_Product_Flows.md)** - Flow 9, 10 (10 test cases)
   - Admin: Nhập hàng → Tạo sản phẩm → Quản lý kho
   - Admin quản lý sản phẩm: Tạo → Cập nhật → Xóa

### 📄 File Gốc (Giữ nguyên để tham khảo)
- **[Integration_Tests_Report.md](./Integration_Tests_Report.md)** - File gốc chứa tất cả flows trong 1 file (360 dòng)

---

## 🎯 Cách Sử Dụng

### Khi cần xem tổng quan:
→ Mở **Integration_Tests_Report_SUMMARY.md**

### Khi cần xem chi tiết từng module:
→ Mở file module tương ứng (ví dụ: Integration_Order_Flows.md)

### Khi cần xem tất cả trong 1 file:
→ Mở **Integration_Tests_Report.md** (file gốc)

---

## 📊 Mapping Với Template Excel

| Excel Sheet | File Markdown | Mô tả |
|------------|---------------|-------|
| **Test Case List** | Integration_Tests_Report_SUMMARY.md (phần "Danh sách Module/Function") | Danh sách các function và module |
| **Module Sheet** | Integration_Auth_Flows.md, Integration_Order_Flows.md, etc. | Chi tiết test cases của từng module |
| **Test Report** | Integration_Tests_Report_SUMMARY.md (phần "Tổng Quan Test Results") | Tổng hợp kết quả test |

---

## 🔗 Liên Kết Nhanh

- [📊 Tổng Hợp](./Integration_Tests_Report_SUMMARY.md)
- [🔐 Authentication Flows](./Integration_Auth_Flows.md)
- [🛒 Order Management Flows](./Integration_Order_Flows.md)
- [💳 Payment Flows](./Integration_Payment_Flows.md)
- [⭐ Review & Comment Flows](./Integration_Review_Flows.md)
- [📦 Product Management Flows](./Integration_Product_Flows.md)

---

## 📝 Ghi Chú

- Tất cả các file đều có cùng format và cấu trúc
- Mỗi file module có thống kê riêng và phân tích lỗi
- File tổng hợp có so sánh với các module khác
- File gốc vẫn được giữ lại để tham khảo đầy đủ

