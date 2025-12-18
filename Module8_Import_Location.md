# Module8 - Import & Location (Nhập hàng & Kho)

## Thông tin Module

|                      |                                                                                |
| -------------------- | ------------------------------------------------------------------------------ |
| **Module Code**      | Module8                                                                        |
| **Test Requirement** | Test các chức năng quản lý phiếu nhập hàng và địa điểm kho: CRUD & Statistics |
| **Tester**           | HaoPham                                                                        |
| **Test Date**        | 18/12/2025 (GitHub Actions - Branch: weblau)                                   |

---

## Thống kê Test Case

| Pass | Fail | Untested | N/A | Number of Test Cases |
| ---- | ---- | -------- | --- | -------------------- |
| 0    | 0    | 40       | 0   | 40                   |

> **Ghi chú:** Kết quả từ GitHub Actions - Branch `weblau` - Test Date: 18/12/2025  
> **Import Tests:** 20 tests - CRUD operations & statistics for imports  
> **Location Tests:** 20 tests - CRUD operations & nearest location

---

## Chi tiết Test Case

### Function A: Xem danh sách phiếu nhập (Get All Imports)

| ID      | Test Case Description                        | Test Case Procedure                          | Expected Output                                              | Test Data  | Result   | Test Date | Description                |
| ------- | -------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------ | ---------- | -------- | --------- | -------------------------- |
| IMP-001 | Admin xem danh sách phiếu nhập thành công    | 1. Đăng nhập admin<br>2. GET /api/v1/imports | 1. Trả về status 200<br>2. Trả về danh sách imports         | TestData01 | Untested |           | Admin có quyền             |
| IMP-002 | Employee xem danh sách phiếu nhập thành công | 1. Đăng nhập employee<br>2. GET /api/v1/imports | 1. Trả về status 200<br>2. Trả về danh sách imports         | TestData02 | Untested |           | Employee có quyền          |
| IMP-003 | Xem imports với pagination                   | 1. Đăng nhập admin<br>2. GET /api/v1/imports?page=1&limit=5 | 1. Trả về status 200<br>2. Trả về 5 imports đầu tiên        | TestData03 | Untested |           | Query pagination           |
| IMP-004 | User xem imports thất bại                    | 1. Đăng nhập user<br>2. GET /api/v1/imports  | 1. Trả về status 403<br>2. Message: "You do not have permission" | TestData04 | Untested |           | Middleware restrictTo      |

---

### Function B: Tạo phiếu nhập hàng (Create Import)

| ID      | Test Case Description                        | Test Case Procedure                                                                  | Expected Output                                                    | Test Data  | Result   | Test Date | Description                |
| ------- | -------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------ | ---------- | -------- | --------- | -------------------------- |
| IMP-005 | Admin tạo phiếu nhập thành công              | 1. Đăng nhập admin<br>2. POST /api/v1/imports<br>3. Gửi invoice, totalPrice         | 1. Trả về status 201<br>2. Import được tạo<br>3. User được set    | TestData05 | Untested |           | Admin tạo thành công       |
| IMP-006 | Employee tạo phiếu nhập thành công           | 1. Đăng nhập employee<br>2. POST /api/v1/imports<br>3. Gửi invoice, totalPrice      | 1. Trả về status 201<br>2. Import được tạo                        | TestData06 | Untested |           | Employee có quyền tạo      |
| IMP-007 | User tạo phiếu nhập thất bại                 | 1. Đăng nhập user<br>2. POST /api/v1/imports                                         | 1. Trả về status 403<br>2. Message: "You do not have permission"  | TestData07 | Untested |           | Middleware restrictTo      |
| IMP-008 | Tạo import thất bại - Thiếu user             | 1. Không đăng nhập<br>2. POST /api/v1/imports                                        | 1. Trả về status 401<br>2. Message lỗi authentication              | TestData08 | Untested |           | Middleware protect         |
| IMP-009 | Tạo import với invoice hợp lệ                | 1. Đăng nhập admin<br>2. POST /api/v1/imports với invoice array                      | 1. Trả về status 201<br>2. Invoice được parse JSON                | TestData09 | Untested |           | setImporter middleware     |

---

### Function C: Cập nhật phiếu nhập (Update Import)

| ID      | Test Case Description                         | Test Case Procedure                                          | Expected Output                                                | Test Data  | Result   | Test Date | Description                |
| ------- | --------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------- | ---------- | -------- | --------- | -------------------------- |
| IMP-010 | Admin cập nhật phiếu nhập thành công          | 1. Đăng nhập admin<br>2. PATCH /api/v1/imports/:id          | 1. Trả về status 200<br>2. Import được cập nhật               | TestData10 | Untested |           | Admin có quyền             |
| IMP-011 | Employee cập nhật phiếu nhập thành công       | 1. Đăng nhập employee<br>2. PATCH /api/v1/imports/:id       | 1. Trả về status 200<br>2. Import được cập nhật               | TestData11 | Untested |           | Employee có quyền          |
| IMP-012 | User cập nhật phiếu nhập thất bại             | 1. Đăng nhập user<br>2. PATCH /api/v1/imports/:id           | 1. Trả về status 403<br>2. Message: "You do not have permission" | TestData12 | Untested |           | Middleware restrictTo      |
| IMP-013 | Cập nhật import thất bại - Import không tồn tại | 1. Đăng nhập admin<br>2. PATCH /api/v1/imports/:invalidId   | 1. Trả về status 404<br>2. Message: "Không tìm thấy dữ liệu"  | TestData13 | Untested |           | Not found                  |

---

### Function D: Xóa phiếu nhập (Delete Import)

| ID      | Test Case Description                     | Test Case Procedure                                      | Expected Output                                                | Test Data  | Result   | Test Date | Description                |
| ------- | ----------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------- | ---------- | -------- | --------- | -------------------------- |
| IMP-014 | Admin xóa phiếu nhập thành công           | 1. Đăng nhập admin<br>2. DELETE /api/v1/imports/:id     | 1. Trả về status 204<br>2. Import bị xóa                      | TestData14 | Untested |           | Admin có quyền             |
| IMP-015 | Employee xóa phiếu nhập thành công        | 1. Đăng nhập employee<br>2. DELETE /api/v1/imports/:id  | 1. Trả về status 204<br>2. Import bị xóa                      | TestData15 | Untested |           | Employee có quyền          |
| IMP-016 | User xóa phiếu nhập thất bại              | 1. Đăng nhập user<br>2. DELETE /api/v1/imports/:id      | 1. Trả về status 403<br>2. Message: "You do not have permission" | TestData16 | Untested |           | Middleware restrictTo      |
| IMP-017 | Xóa import thất bại - Import không tồn tại | 1. Đăng nhập admin<br>2. DELETE /api/v1/imports/:invalidId | 1. Trả về status 404<br>2. Message: "Không tìm thấy dữ liệu"  | TestData17 | Untested |           | Not found                  |

---

### Function E: Thống kê nhập hàng (Statistics)

| ID      | Test Case Description                              | Test Case Procedure                                                    | Expected Output                                                | Test Data  | Result   | Test Date | Description                |
| ------- | -------------------------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------- | ---------- | -------- | --------- | -------------------------- |
| IMP-018 | Admin xem thống kê tổng chi phí theo tháng         | 1. Đăng nhập admin<br>2. GET /api/v1/imports/sum                      | 1. Trả về status 200<br>2. Trả về aggregate data theo tháng   | TestData18 | Untested |           | sumImport aggregation      |
| IMP-019 | Admin xem thống kê với option (year, month, week)  | 1. Đăng nhập admin<br>2. POST /api/v1/imports/sumOption<br>3. Gửi option | 1. Trả về status 200<br>2. Trả về aggregate theo option       | TestData19 | Untested |           | sumOption với body         |
| IMP-020 | Admin xem thống kê trong khoảng thời gian          | 1. Đăng nhập admin<br>2. POST /api/v1/imports/sumInRange<br>3. Gửi dateFrom, dateTo | 1. Trả về status 200<br>2. Trả về tổng trong range            | TestData20 | Untested |           | sumInRange với date range  |

---

### Function F: Xem danh sách kho (Get All Locations)

| ID      | Test Case Description                    | Test Case Procedure                             | Expected Output                                              | Test Data  | Result   | Test Date | Description                |
| ------- | ---------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------ | ---------- | -------- | --------- | -------------------------- |
| LOC-001 | User xem danh sách kho thành công        | 1. Đăng nhập user<br>2. GET /api/v1/locations  | 1. Trả về status 200<br>2. Trả về danh sách locations       | TestData21 | Untested |           | User đã đăng nhập          |
| LOC-002 | Admin xem danh sách kho thành công       | 1. Đăng nhập admin<br>2. GET /api/v1/locations | 1. Trả về status 200<br>2. Trả về danh sách locations       | TestData22 | Untested |           | Admin có quyền             |
| LOC-003 | Xem locations với pagination             | 1. Đăng nhập<br>2. GET /api/v1/locations?page=1&limit=5 | 1. Trả về status 200<br>2. Trả về 5 locations đầu tiên      | TestData23 | Untested |           | Query pagination           |
| LOC-004 | Xem locations thất bại - Chưa đăng nhập  | 1. Không đăng nhập<br>2. GET /api/v1/locations | 1. Trả về status 401<br>2. Message lỗi authentication        | TestData24 | Untested |           | Middleware protect         |

---

### Function G: Tìm kho gần nhất (Nearest Location)

| ID      | Test Case Description                          | Test Case Procedure                                                       | Expected Output                                                            | Test Data  | Result   | Test Date | Description                |
| ------- | ---------------------------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ---------- | -------- | --------- | -------------------------- |
| LOC-005 | Tìm kho gần nhất thành công                    | 1. GET /api/v1/locations/nearest?latitude=10.8&longitude=106.7           | 1. Trả về status 201<br>2. Trả về nearestLocation và listLocation         | TestData25 | Untested |           | Không cần đăng nhập        |
| LOC-006 | Tìm kho gần nhất với tọa độ hợp lệ             | 1. GET /api/v1/locations/nearest?latitude=21.03&longitude=105.85         | 1. Trả về status 201<br>2. nearestLocation là kho gần nhất                | TestData26 | Untested |           | 2dsphere index query       |
| LOC-007 | Tìm kho gần nhất thất bại - Thiếu latitude     | 1. GET /api/v1/locations/nearest?longitude=106.7                          | 1. Trả về lỗi<br>2. Message về thiếu tham số                              | TestData27 | Untested |           | Missing required param     |
| LOC-008 | Tìm kho gần nhất thất bại - Thiếu longitude    | 1. GET /api/v1/locations/nearest?latitude=10.8                            | 1. Trả về lỗi<br>2. Message về thiếu tham số                              | TestData28 | Untested |           | Missing required param     |

---

### Function H: Thêm địa điểm kho (Create Location)

| ID      | Test Case Description                        | Test Case Procedure                                                             | Expected Output                                                | Test Data  | Result   | Test Date | Description                |
| ------- | -------------------------------------------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------- | ---------- | -------- | --------- | -------------------------- |
| LOC-009 | Admin thêm location thành công               | 1. Đăng nhập admin<br>2. POST /api/v1/locations<br>3. Gửi name, address, lat, long | 1. Trả về status 201<br>2. Location được tạo với coordinates  | TestData29 | Untested |           | Admin có quyền             |
| LOC-010 | Employee thêm location thành công            | 1. Đăng nhập employee<br>2. POST /api/v1/locations<br>3. Gửi đầy đủ thông tin   | 1. Trả về status 201<br>2. Location được tạo                  | TestData30 | Untested |           | Employee có quyền          |
| LOC-011 | User thêm location thất bại                  | 1. Đăng nhập user<br>2. POST /api/v1/locations                                  | 1. Trả về status 403<br>2. Message: "You do not have permission" | TestData31 | Untested |           | Middleware restrictTo      |
| LOC-012 | Thêm location thất bại - Thiếu address       | 1. Đăng nhập admin<br>2. POST /api/v1/locations không có address                | 1. Trả về status 400<br>2. Message: "Vui lòng cung cấp đầy đủ thông tin" | TestData32 | Untested |           | Custom validation          |
| LOC-013 | Thêm location thất bại - Thiếu latitude      | 1. Đăng nhập admin<br>2. POST /api/v1/locations không có latitude               | 1. Trả về status 400<br>2. Message: "Vui lòng cung cấp đầy đủ thông tin" | TestData33 | Untested |           | Custom validation          |
| LOC-014 | Thêm location thất bại - Thiếu longitude     | 1. Đăng nhập admin<br>2. POST /api/v1/locations không có longitude              | 1. Trả về status 400<br>2. Message: "Vui lòng cung cấp đầy đủ thông tin" | TestData34 | Untested |           | Custom validation          |
| LOC-015 | Location coordinates được tạo đúng format    | 1. Đăng nhập admin<br>2. POST /api/v1/locations với lat=10.8, long=106.7        | 1. Trả về status 201<br>2. coordinates: [106.7, 10.8]         | TestData35 | Untested |           | [longitude, latitude]      |

---

### Function I: Cập nhật địa điểm kho (Update Location)

| ID      | Test Case Description                           | Test Case Procedure                                          | Expected Output                                                | Test Data  | Result   | Test Date | Description                |
| ------- | ----------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------- | ---------- | -------- | --------- | -------------------------- |
| LOC-016 | Admin cập nhật location thành công              | 1. Đăng nhập admin<br>2. PATCH /api/v1/locations/:id        | 1. Trả về status 200<br>2. Location được cập nhật             | TestData36 | Untested |           | Admin có quyền             |
| LOC-017 | Employee cập nhật location thành công           | 1. Đăng nhập employee<br>2. PATCH /api/v1/locations/:id     | 1. Trả về status 200<br>2. Location được cập nhật             | TestData37 | Untested |           | Employee có quyền          |
| LOC-018 | User cập nhật location thất bại                 | 1. Đăng nhập user<br>2. PATCH /api/v1/locations/:id         | 1. Trả về status 403<br>2. Message: "You do not have permission" | TestData38 | Untested |           | Middleware restrictTo      |
| LOC-019 | Cập nhật location thất bại - Location không tồn tại | 1. Đăng nhập admin<br>2. PATCH /api/v1/locations/:invalidId | 1. Trả về status 404<br>2. Message: "Không tìm thấy địa chỉ này" | TestData39 | Untested |           | Not found                  |

---

### Function J: Xóa địa điểm kho (Delete Location)

| ID      | Test Case Description                      | Test Case Procedure                                       | Expected Output                                                | Test Data  | Result   | Test Date | Description                |
| ------- | ------------------------------------------ | --------------------------------------------------------- | -------------------------------------------------------------- | ---------- | -------- | --------- | -------------------------- |
| LOC-020 | Admin xóa location thành công              | 1. Đăng nhập admin<br>2. DELETE /api/v1/locations/:id    | 1. Trả về status 204<br>2. Location bị xóa                    | TestData40 | Untested |           | Admin có quyền             |
| LOC-021 | Employee xóa location thành công           | 1. Đăng nhập employee<br>2. DELETE /api/v1/locations/:id | 1. Trả về status 204<br>2. Location bị xóa                    | TestData41 | Untested |           | Employee có quyền          |
| LOC-022 | User xóa location thất bại                 | 1. Đăng nhập user<br>2. DELETE /api/v1/locations/:id     | 1. Trả về status 403<br>2. Message: "You do not have permission" | TestData42 | Untested |           | Middleware restrictTo      |
| LOC-023 | Xóa location thất bại - Location không tồn tại | 1. Đăng nhập admin<br>2. DELETE /api/v1/locations/:invalidId | 1. Trả về status 404<br>2. Message: "Không tìm thấy dữ liệu"  | TestData43 | Untested |           | Not found                  |

---

## Test Data

| Test Data ID | Data Description                                                                              |
| ------------ | --------------------------------------------------------------------------------------------- |
| TestData01   | GET /api/v1/imports by admin                                                                  |
| TestData02   | GET /api/v1/imports by employee                                                               |
| TestData03   | GET /api/v1/imports?page=1&limit=5                                                            |
| TestData04   | GET /api/v1/imports by user (no permission)                                                   |
| TestData05   | POST /api/v1/imports {invoice: [{...}], totalPrice: 1000000} by admin                        |
| TestData06   | POST /api/v1/imports {invoice: [{...}], totalPrice: 500000} by employee                      |
| TestData07   | POST /api/v1/imports by user (no permission)                                                  |
| TestData08   | POST /api/v1/imports without Authorization                                                    |
| TestData09   | POST /api/v1/imports with valid invoice array                                                 |
| TestData10   | PATCH /api/v1/imports/:id {totalPrice: 1500000} by admin                                     |
| TestData11   | PATCH /api/v1/imports/:id {totalPrice: 800000} by employee                                   |
| TestData12   | PATCH /api/v1/imports/:id by user (no permission)                                             |
| TestData13   | PATCH /api/v1/imports/:invalidId by admin                                                     |
| TestData14   | DELETE /api/v1/imports/:id by admin                                                           |
| TestData15   | DELETE /api/v1/imports/:id by employee                                                        |
| TestData16   | DELETE /api/v1/imports/:id by user (no permission)                                            |
| TestData17   | DELETE /api/v1/imports/:invalidId by admin                                                    |
| TestData18   | GET /api/v1/imports/sum by admin                                                              |
| TestData19   | POST /api/v1/imports/sumOption {year: true, month: true} by admin                            |
| TestData20   | POST /api/v1/imports/sumInRange {dateFrom: "2025-01-01", dateTo: "2025-12-31"} by admin      |
| TestData21   | GET /api/v1/locations by user                                                                 |
| TestData22   | GET /api/v1/locations by admin                                                                |
| TestData23   | GET /api/v1/locations?page=1&limit=5                                                          |
| TestData24   | GET /api/v1/locations without Authorization                                                   |
| TestData25   | GET /api/v1/locations/nearest?latitude=10.8&longitude=106.7 (Public)                          |
| TestData26   | GET /api/v1/locations/nearest?latitude=21.03&longitude=105.85                                 |
| TestData27   | GET /api/v1/locations/nearest?longitude=106.7 (missing latitude)                              |
| TestData28   | GET /api/v1/locations/nearest?latitude=10.8 (missing longitude)                               |
| TestData29   | POST /api/v1/locations {name: "Kho HCM", address: "123 Nguyen Hue", lat: 10.8, long: 106.7} by admin |
| TestData30   | POST /api/v1/locations {name: "Kho HN", address: "456 Ba Dinh", lat: 21.03, long: 105.85} by employee |
| TestData31   | POST /api/v1/locations by user (no permission)                                                |
| TestData32   | POST /api/v1/locations without address                                                        |
| TestData33   | POST /api/v1/locations without latitude                                                       |
| TestData34   | POST /api/v1/locations without longitude                                                      |
| TestData35   | POST /api/v1/locations (verify coordinates format [long, lat])                                |
| TestData36   | PATCH /api/v1/locations/:id {name: "Kho HCM Updated"} by admin                                |
| TestData37   | PATCH /api/v1/locations/:id {address: "789 Le Loi"} by employee                               |
| TestData38   | PATCH /api/v1/locations/:id by user (no permission)                                            |
| TestData39   | PATCH /api/v1/locations/:invalidId by admin                                                    |
| TestData40   | DELETE /api/v1/locations/:id by admin                                                          |
| TestData41   | DELETE /api/v1/locations/:id by employee                                                       |
| TestData42   | DELETE /api/v1/locations/:id by user (no permission)                                           |
| TestData43   | DELETE /api/v1/locations/:invalidId by admin                                                   |

---

## Ghi chú

1. **Import (Phiếu nhập hàng):**

   - **Fields:**
     - user (required, ref User) - Admin/Employee
     - invoice (array) - [{product, image, title, quantity, price}]
     - totalPrice (Number)
     - createdAt (Date, default: now)
   - **Permissions:**
     - **Read:** Admin, Employee only
     - **Create/Update/Delete:** Admin, Employee only
     - **Statistics:** Admin only
   - **Middleware:**
     - `setImporter`: Parse invoice JSON, set req.body.user = req.user
     - `protect`: Authentication required
     - `restrictTo('admin', 'employee')`: Role-based access
   - **Pre-find Hook:** Populate user (name only)

2. **Location (Địa điểm kho):**

   - **Fields:**
     - name (String, optional)
     - address (String, required) - "Không thể trống địa chỉ"
     - location (GeoJSON Point):
       - type: "Point"
       - coordinates: [longitude, latitude] - 2dsphere index
   - **Permissions:**
     - **Read:** Authenticated users
     - **Nearest:** Public (no authentication required)
     - **Create/Update/Delete:** Admin, Employee only
   - **Geospatial Query:**
     - `$near` operator with 2dsphere index
     - Format: coordinates [longitude, latitude]
   - **Custom Validation:**
     - Must provide: address, latitude, longitude
     - Error: "Vui lòng cung cấp đầy đủ thông tin"

3. **API Endpoints:**

   **Import:**
   - GET `/api/v1/imports` - Xem imports (Protected, Admin/Employee)
   - POST `/api/v1/imports` - Tạo import (Protected, Admin/Employee)
   - GET `/api/v1/imports/:id` - Xem 1 import
   - PATCH `/api/v1/imports/:id` - Cập nhật import (Protected, Admin/Employee)
   - DELETE `/api/v1/imports/:id` - Xóa import (Protected, Admin/Employee)
   - GET `/api/v1/imports/sum` - Thống kê theo tháng (Protected, Admin)
   - POST `/api/v1/imports/sumOption` - Thống kê với option (Protected, Admin)
   - POST `/api/v1/imports/sumInRange` - Thống kê trong range (Protected, Admin)

   **Location:**
   - GET `/api/v1/locations` - Xem locations (Protected)
   - GET `/api/v1/locations/nearest?latitude=X&longitude=Y` - Tìm kho gần nhất (Public)
   - POST `/api/v1/locations` - Tạo location (Protected, Admin/Employee)
   - GET `/api/v1/locations/:id` - Xem 1 location
   - PATCH `/api/v1/locations/:id` - Cập nhật location (Protected, Admin/Employee)
   - DELETE `/api/v1/locations/:id` - Xóa location (Protected, Admin/Employee)

4. **Business Rules:**

   **Import:**
   - Chỉ Admin và Employee có quyền xem/tạo/sửa/xóa phiếu nhập
   - Statistics chỉ Admin có quyền
   - Invoice được parse từ JSON string (middleware setImporter)
   - User được tự động set từ req.user
   - Aggregate statistics theo year/month/week/date
   - sumInRange sử dụng moment.js để xử lý timezone

   **Location:**
   - Read: Cần authentication
   - Nearest: Public access (không cần authentication)
   - Write: Admin và Employee only
   - Coordinates phải theo format [longitude, latitude]
   - 2dsphere index cho geospatial queries
   - Custom validation: address, latitude, longitude bắt buộc

5. **Middleware:**

   - **protect:** Verify JWT token (required for imports và location read/write)
   - **restrictTo('admin', 'employee'):** For all import/location write operations
   - **restrictTo('admin'):** For import statistics only
   - **setImporter:** Parse invoice JSON và set user (custom middleware for import)

6. **Aggregation Pipeline:**

   **sumImport:**
   ```javascript
   $group: {
     _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
     total_month: { $sum: "$totalPrice" }
   }
   ```

   **sumOption:**
   - Dynamic grouping by year/month/week/date based on req.body

   **sumInRange:**
   - $match với dateFrom, dateTo
   - UTC timezone handling với moment.js

7. **Geospatial Features:**

   - **2dsphere Index:** Cho location.coordinates
   - **$near Operator:** Tìm location gần nhất dựa trên latitude/longitude
   - **GeoJSON Format:** {type: "Point", coordinates: [long, lat]}
   - **nearestLocation:** Trả về cả nearestLocation và listLocation

8. **Testing Notes:**
   - Test authentication middleware (protect)
   - Test authorization middleware (restrictTo - admin/employee/admin only)
   - Test setImporter middleware (JSON parse, user set)
   - Test aggregation pipelines (sum, sumOption, sumInRange)
   - Test geospatial queries ($near, 2dsphere)
   - Test coordinates format [longitude, latitude]
   - Test custom validation (address, lat, long required)
   - Test error handling (404, 403, 401, 400)
   - Test date range with moment.js (UTC timezone)
   - Test pagination, sort, filter for GET all

