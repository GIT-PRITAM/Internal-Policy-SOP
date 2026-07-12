# Edit Plan - Admin User Management Module (replace mocks with live APIs)

## Information gathered
### Backend support (exists)
From `backend/routes/api.php` and `backend/app/Http/Controllers/UserController.php`:
- `GET /api/v1/users` with pagination + search
  - query params: `per_page` (default 10), `search` (matches `name` + `email` via ilike)
- `GET /api/v1/users/{id}`
- `POST /api/v1/users` with validation:
  - `name`, `email` (unique), `password` (min 8), `role_id` (exists), `department_id` nullable
- `PUT /api/v1/users/{id}` with validation:
  - supports updating `name`, `email`, `password` (optional), `role_id`, `department_id`
- `DELETE /api/v1/users/{id}`

From `backend/routes/api.php`:
- Departments API exists: `GET /api/v1/departments` (needed for department assignment UI)

### Frontend status
`frontend/src/pages/admin/AdminUsersPage.tsx` currently:
- Uses a hardcoded `const users = [...]` array (mock/static data)
- Renders a table without loading/search/pagination/CRUD

Frontend API client exists: `frontend/src/services/api.ts` (includes `listUsers`, `createUser`, `updateUser`, `deleteUser`).
Toast UI exists: `frontend/src/hooks/useToast.tsx`.

### Missing/unsupported backend filters
Current `GET /users` only supports `search` and pagination. No dedicated query params for role/department/status are exposed in the controller, so the UI will not invent these filters.

## Plan
### File-level changes
1. **Update** `frontend/src/pages/admin/AdminUsersPage.tsx`
   - Replace mock `users` constant with live `listUsers({ page, per_page, search })`.
   - Implement:
     - Search input (uses backend `search`)
     - Pagination controls (Prev/Next + last_page)
     - Loading state (table skeleton/placeholder)
     - Empty state (no users)
     - Error state (inline message + toast)
   - Add action buttons (keeps current design language):
     - Delete user: confirmation dialog + toast; then refresh list.
   - Implement CRUD UI using lightweight modals/forms **only if** existing modal components are already present; otherwise implement minimal modal UX in-page without redesign.
     - Create user button opens modal with fields:
       - name, email, password, role_id, department_id
     - Edit action opens modal prefilled by `GET /users/{id}` (or reuse data if already included)
   - Role + Department assignment:
     - Map role_id -> display label using existing Role data if available in the frontend.
     - If roles list is not available from an endpoint, use role_id display as fallback but **do not invent** role endpoints.
     - For departments dropdown, call `listDepartments({ per_page: 100 })`.

2. **If roles list endpoint is missing in frontend**
   - Keep role assignment UI to role_id numeric select ONLY if roles array endpoint doesn’t exist.
   - Do NOT invent a new roles API.

### Testing / verification steps (after edits)
- Frontend:
  - `cd frontend && npm run build`
  - `cd frontend && npx tsc -p tsconfig.json --noEmit`
- Manual checks (in running app):
  - Admin can load users list
  - Search returns filtered results
  - Pagination works
  - Create/edit/delete update the table (no mocks)
  - Delete requires confirmation

## Dependent files to inspect (may be edited if needed)
- `frontend/src/pages/admin/AdminUsersPage.tsx` (primary)
- Possibly reuse existing UI components under:
  - `frontend/src/components/ui/*` (Badge/EmptyState)
  - `frontend/src/components/sections/*`

## Followup steps
- Run build + typecheck.
- Verify no remaining mock/static user rendering.


