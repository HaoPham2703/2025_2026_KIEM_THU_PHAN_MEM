# Module6 - Review & Comment Test Workflow

## 📋 Overview

This GitHub Actions workflow automatically tests the Review & Comment functionality of the HCShop application whenever changes are pushed or a pull request is created on the `weblau` branch.

## 🎯 Test Scope

### Review Functions (18 test cases)

- **Get All Reviews (REV-001 to REV-003):** 3 tests
  - Xem danh sách đánh giá
  - Filter by rating
  - Handle invalid product ID

- **Create Review (REV-004 to REV-011):** 8 tests
  - Tạo review thành công (phải mua sản phẩm trước)
  - Validation: rating 1-5, review text required
  - Business rule: User must have successful order
  - Unique constraint: 1 review per product per user
  - Permission: User only (not admin/employee)

- **Update Review (REV-012 to REV-015):** 4 tests
  - Cập nhật review (owner/admin)
  - Permission check: isOwner middleware

- **Delete Review (REV-016 to REV-018):** 3 tests
  - Xóa review (owner/admin)
  - Permission check

### Comment Functions (14 test cases)

- **Get All Comments (COM-001 to COM-002):** 2 tests
  - Xem danh sách bình luận
  - Handle invalid product ID

- **Create Comment (COM-003 to COM-006):** 4 tests
  - Tạo comment (không cần mua sản phẩm)
  - Nested comments (parent/child)
  - Validation: comment text required
  - Permission: User/Admin/Employee

- **Update Comment (COM-007 to COM-008):** 2 tests
  - Cập nhật comment (owner/admin)
  - Permission check

- **Delete Comment (COM-009 to COM-011):** 3 tests
  - Xóa comment (owner/admin)
  - Permission check

- **Like/Unlike Comment (COM-012 to COM-014):** 3 tests
  - Like comment (thêm user vào like array)
  - Unlike comment (xóa user khỏi like array)
  - Handle invalid comment ID

## 🚀 Workflow Triggers

- **Push** to `weblau` branch
- **Pull Request** to `weblau` branch

## 📊 Test Files

- `reviewController.test.js` - Review controller unit tests
- `commentController.test.js` - Comment controller unit tests

## 🔧 Environment Variables

```yaml
NODE_ENV: test
JWT_SECRET: test-jwt-secret-key-for-module6-testing
JWT_EXPIRES_IN: 90d
JWT_COOKIE_EXPIRES_IN: 90
```

## 📈 Workflow Steps

1. **📥 Checkout code** - Get latest code from repository
2. **🟢 Setup Node.js** - Install Node.js 18.x with npm cache
3. **📦 Install dependencies** - Run `npm install` in Back-end directory
4. **🧪 Run Module6 Tests** - Execute review and comment controller tests
5. **📊 Generate Test Report** - Create detailed test report in GitHub Step Summary
6. **📤 Upload Test Results** - Save test results as artifact (30 days retention)
7. **📊 Generate Coverage** - Create code coverage report for Module6
8. **📤 Upload Coverage** - Save coverage report as artifact
9. **💬 Comment PR with Results** - Post test results as PR comment (if PR)
10. **❌ Fail if tests failed** - Mark workflow as failed if any test fails

## 📋 Test Case Mapping

### Review Test Cases (REV-001 to REV-018)

| ID Range | Function | Description |
|----------|----------|-------------|
| REV-001 to REV-003 | Get All Reviews | Xem danh sách đánh giá sản phẩm |
| REV-004 to REV-011 | Create Review | Tạo đánh giá (phải mua sản phẩm) |
| REV-012 to REV-015 | Update Review | Cập nhật đánh giá (owner/admin) |
| REV-016 to REV-018 | Delete Review | Xóa đánh giá (owner/admin) |

### Comment Test Cases (COM-001 to COM-014)

| ID Range | Function | Description |
|----------|----------|-------------|
| COM-001 to COM-002 | Get All Comments | Xem danh sách bình luận |
| COM-003 to COM-006 | Create Comment | Tạo bình luận (không cần mua) |
| COM-007 to COM-008 | Update Comment | Cập nhật bình luận |
| COM-009 to COM-011 | Delete Comment | Xóa bình luận |
| COM-012 to COM-014 | Like/Unlike | Like/Unlike bình luận (toggle) |

## 🔍 Key Features Tested

### Review Business Rules

1. **Pre-condition Check (setProductUserIds middleware):**
   - User must have an order
   - Order status must be "Success"
   - Product must be in the order
   - Only users who purchased can review

2. **Validation:**
   - Rating: 1-5 (required)
   - Review text: Required, không thể để trống
   - Unique constraint: 1 review per product per user

3. **Permissions:**
   - Create: User only (not admin/employee)
   - Update/Delete: Owner, Admin, Employee

4. **Post-Save Hook:**
   - Auto update Product ratings:
     - `ratingsQuantity`: Total reviews
     - `ratingsAverage`: Average rating
     - `eachRating`: [1⭐, 2⭐, 3⭐, 4⭐, 5⭐]

### Comment Business Rules

1. **No Pre-condition:**
   - Không cần mua sản phẩm
   - User/Admin/Employee đều có thể comment

2. **Validation:**
   - Comment text: Required

3. **Nested Comments:**
   - Parent/Child relationship
   - Reply to existing comments

4. **Like/Unlike Toggle:**
   - First click: Add user ID to `like` array
   - Second click: Remove user ID from `like` array

5. **Permissions:**
   - Create: User, Admin, Employee
   - Update/Delete: Owner, Admin, Employee
   - Like: Any authenticated user

## 📊 Report Format

The workflow generates a detailed report including:

1. **Test Statistics:**
   - Total tests run
   - Passed tests count
   - Failed tests count

2. **Test Coverage by Function:**
   - Review functions (18 tests)
   - Comment functions (14 tests)

3. **Failed Tests Details:**
   - Test name
   - Error message
   - Stack trace (first 500 chars)

4. **Test Case Mapping:**
   - Link to Module6_Review_Comment.md
   - Test case IDs (REV-XXX, COM-XXX)
   - Function groups

## 🎯 Success Criteria

- All 32 tests must pass (18 Review + 14 Comment)
- No validation errors
- Pre-condition checks work correctly
- Permissions enforced properly
- Post-save hooks execute successfully
- Like/Unlike toggle works correctly

## 📝 Test Data

All test data is defined in `Module6_Review_Comment.md` with IDs from `TestData01` to `TestData32`.

## 🔗 Related Files

- `Back-end/controllers/reviewController.js` - Review controller
- `Back-end/controllers/commentController.js` - Comment controller
- `Back-end/routes/reviewRoutes.js` - Review routes
- `Back-end/routes/commentRoutes.js` - Comment routes
- `Back-end/models/reviewModel.js` - Review model & hooks
- `Back-end/models/commentModel.js` - Comment model
- `Back-end/tests/unit/controllers/reviewController.test.js` - Review tests
- `Back-end/tests/unit/controllers/commentController.test.js` - Comment tests
- `Module6_Review_Comment.md` - Test case documentation

## ⚠️ Important Notes

1. **Review Pre-condition:**
   - Mock Order data để test review pre-condition
   - User must have order with status "Success"
   - Product must be in order cart

2. **Unique Constraint:**
   - Test duplicate review scenario
   - 1 user chỉ review 1 lần cho mỗi sản phẩm

3. **Rating Validation:**
   - Min: 1, Max: 5
   - Test boundary values (0, 6)

4. **Post-Save Hook:**
   - Test ratings calculation
   - Verify product ratings update automatically

5. **Like/Unlike Toggle:**
   - Test add user to like array
   - Test remove user from like array
   - Verify toggle behavior

6. **Nested Comments:**
   - Test parent/child relationship
   - Test reply functionality

## 🚦 Viewing Results

### In GitHub Actions

1. Go to **Actions** tab in GitHub
2. Select the workflow run
3. View **Summary** for detailed report
4. Download artifacts for test results and coverage

### In Pull Request

Test results are automatically commented on the PR with:
- Total tests count
- Passed/Failed counts
- Link to full report

## 🔄 CI/CD Integration

This workflow is part of the automated testing suite:
- Runs automatically on every push
- Prevents merging if tests fail
- Provides immediate feedback on code quality
- Tracks test history over time

## 📞 Support

For issues or questions about this workflow, please:
1. Check test logs in GitHub Actions
2. Review `Module6_Review_Comment.md` for test specifications
3. Check controller and model files for business logic
4. Contact: HaoPham (Tester)

