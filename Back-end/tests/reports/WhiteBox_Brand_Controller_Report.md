# White-Box Test Report – Brand Controller

Date: 2025-12-20
Project: Back-end (Node.js + Jest)
Scope: Brand module controller, model validation, service/factory paths, and query utilities involved in Brand listing.

## Objectives
- Validate internal code paths (branches, loops, and error handling) for Brand CRUD flows.
- Confirm response shapes and `next()` error propagation for not-found scenarios.
- Exercise query building utilities used by listing endpoints (filter/sort/paginate).
- Produce measurable coverage to guide further testing.

## Code Under Test
- Controller: [Back-end/controllers/brandController.js](../controllers/brandController.js)
- Factory/Service: [Back-end/controllers/handlerFactory.js](../controllers/handlerFactory.js)
- Model (business rules/validation): [Back-end/models/brandModel.js](../models/brandModel.js)
- Query utilities: [Back-end/utils/apiFeatures.js](../utils/apiFeatures.js)
- Test suite: [Back-end/tests/unit/controllers/brandController.test.js](../unit/controllers/brandController.test.js)

## Test Design (White-Box)
- Listing brands (public): cover `filter/sort/paginate`, and branch when `page > totalPage`.
- Get brand by ID: success path (200), not-found path via `next(new AppError(...))`.
- Create brand: success paths (admin/employee) and validation errors (required, minlength, maxlength, duplicate 11000).
- Update brand: success (admin/employee) and not-found (404 via `next`).
- Delete brand: success (admin/employee) and not-found (404 via `next`).

### Mapped Code Paths
- `brandController.getAllBrands` → `handlerFactory.getAll(Brand)` → `APIFeatures.filter().sort().limitFields().paginate()`; tested both normal and `page > totalPage` branches.
- `brandController.getBrand` → `handlerFactory.getOne(Brand)`; tested success and `!doc` branch.
- `brandController.createBrand` → `handlerFactory.createOne(Brand)`; Brand uses generic create path and relies on `brandModel` validation; exercised all key validators and duplicate.
- `brandController.updateBrand` → `handlerFactory.updateOne(Brand)`; Brand uses generic update path; tested success and `!doc` branch.
- `brandController.deleteBrand` → `handlerFactory.deleteOne(Brand)`; tested success and `!doc` branch.

## Executed Test Cases
- IDs: BRD-001, BRD-002, BRD-003, BRD-004, BRD-004A, BRD-004B, BRD-004C,
  BRD-005, BRD-006, BRD-009, BRD-010, BRD-011, BRD-012, BRD-013, BRD-014,
  BRD-016, BRD-017, BRD-018, BRD-020.

## Coverage Summary (from Jest)
- All files: Lines 58.38%, Branches 36.02%, Functions 48.07%, Statements 57.10%.
- Controller: Lines 47.05%, Branches 32.65%, Functions 66.66%.  
  • `brandController.js`: Lines 100%, Branches 100%, Functions 100%.
  • `handlerFactory.js`: Lines 44.09%, Branches 32.65%, Functions 66.66% (many branches belong to Product/Import/Review/Comment, not exercised by Brand tests).
- Models: Lines 63.41%, Branches 20.00%, Functions 13.04%.  
  • `brandModel.js`: Lines 100%, Branches 100%, Functions 100%.
- Utils: Lines 90.24%, Branches 72.22%, Functions 90.90%.  
  • `apiFeatures.js`: Lines 87.50%, Branches 75.00%, Functions 87.50% (default sort and field limiting covered).

> Note: The overall coverage reflects the entire Back-end; Brand tests focus on Brand-related paths. Lower coverage in `handlerFactory.js` corresponds to domain-specific branches (Product/Import/Review/Comment) not targeted here.

## Findings
- Brand controller paths are fully covered (100% for `brandController.js`).
- Validation rules (required, minlength, maxlength, unique) are covered via `brandModel`.
- Listing logic: pagination overflow branch (`page > totalPage`) exercised and verified.
- Error handling: 404 not-found branches for `getOne`, `updateOne`, `deleteOne` confirmed via `next()`.

## Recommendations (Next Steps)
- Add targeted tests for `apiFeatures` keyword search (`keyword` → regex path) to complement current `name` filter.
- Exercise `limitFields` with explicit `fields` query to validate partial projection behavior.
- For broader service coverage, add dedicated suites for Product/Import/Review/Comment to cover domain-specific branches inside `handlerFactory.js` (inventory adjustments, rating recalculations, threaded comments).

## Execution & Repro
- Run tests only for Brand with coverage:

```powershell
Push-Location "D:\KTPM\new\2025_2026_KIEM_THU_PHAN_MEM\Back-end"
npm test -- --coverage -- brandController
Pop-Location
```

- Jest config: [Back-end/jest.config.js](../jest.config.js) (coverage ignores `/tests/` & `/scripts/`).

## Conclusion
White-box tests for the Brand module thoroughly exercise controller flows, validation, and listing utilities. Coverage indicates strong confidence for Brand paths; further improvements should target shared factory branches specific to other domains and additional query utility scenarios.
