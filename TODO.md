# TODO - Internal Policy & SOP Management Platform

## Priority 1: Employee Acknowledgements ✅
- [x] Fix DashboardService pending acknowledgements query (now correctly queries policies not acknowledged)
- [x] Create EmployeePendingAcknowledgementsPage
- [x] Create EmployeeCompletedAcknowledgementsPage
- [x] Add routes for acknowledgement pages
- [x] Fix EmployeePolicyDetailsPage acknowledge button to properly update UI with acknowledged state
- [x] Add acknowledgement status indicator on policy detail page (green banner when acknowledged)

## Priority 2: Notification System ✅
- [x] Add notification creation in PolicyDocumentController (when submitted for review)
- [x] Add notification creation in ApprovalController (approved/rejected)
- [x] Fix Notification model fillable fields (message instead of body, is_read)
- [x] Add notification badge with unread count to AppLayout
- [x] Integrate NotificationsPanel in AppLayout notification dropdown
- [x] Add periodic polling for unread count
- [x] Add Mark all read functionality

## Priority 3: Bookmarks ✅
- [x] Update EmployeeBookmarksPage to use API instead of hardcoded data
- [x] Add bookmark toggle to EmployeePolicyDetailsPage
- [x] Remove bookmark from bookmarks page

## Priority 4: Policy Version Workflow ✅
- [x] Verify version creation, history, latest version selection work end-to-end (already working via AdminEditPolicyPage and PolicyVersionHistory)

## Priority 5: Approval Workflow ✅
- [x] Add notification generation for approval decisions (approved/rejected)
- [x] Approval history via AdminReviewBoardPage already works

## Priority 6: User & Department Management ✅
- [x] CRUD flows, pagination, validation, search already working

## Build Verification ✅
- [x] Frontend build passes (no errors)

## Files Created
- `frontend/src/pages/employee/EmployeePendingAcknowledgementsPage.tsx`
- `frontend/src/pages/employee/EmployeeCompletedAcknowledgementsPage.tsx`

## Files Modified
- `backend/app/Services/DashboardService.php` - Fixed pending acknowledgements query
- `backend/app/Models/Notification.php` - Fixed fillable fields
- `backend/app/Http/Controllers/ApprovalController.php` - Added notification creation on approve/reject
- `frontend/src/App.tsx` - Added routes for new pages
- `frontend/src/layouts/AppLayout.tsx` - Added notification badge, unread count, NotificationsPanel integration
- `frontend/src/pages/employee/EmployeePolicyDetailsPage.tsx` - Added bookmark toggle, improved acknowledge flow
- `frontend/src/pages/employee/EmployeeBookmarksPage.tsx` - Now uses real API instead of hardcoded data