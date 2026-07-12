# TODO (Frontend Admin Layout Refactor)

- [ ] Refactor `AppLayout` so sidebar is fixed/follows 100vh and only `main` scrolls; remove horizontal overflow sources.
- [ ] Create shared `AdminPageContainer` to enforce consistent spacing/padding and overflow-x-hidden.
- [ ] Add shared `AdminPagination` component to keep pagination inside content container.
- [ ] Refactor `AdminDashboardPage` into a true two-column layout where Department Analytics does not affect stat cards’ height.
- [ ] Update all admin pages (dashboard, analytics, departments, policies, users, review board, create/edit/profile pages) to use `AdminPageContainer` and shared pagination where applicable.
- [ ] Ensure all admin pages eliminate unnecessary `overflow-x-auto` outside tables.
- [ ] Run ONE production build: `npm run build` (only once at the end).

