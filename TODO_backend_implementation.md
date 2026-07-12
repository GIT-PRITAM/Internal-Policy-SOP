# Backend Implementation Checklist (Laravel 12)

- [ ] Create backend application structure (Laravel skeleton)
- [ ] Configure Sanctum token auth
- [ ] Create RBAC: roles + user.role relationship + middleware (EnsureRole)
- [ ] Create policies for SOP/Policy resources
- [ ] Implement REST controllers, form requests, API resources
- [ ] Implement services + repositories
- [ ] Add migrations + models + seeders/factories for:
  - Admin, Employees
  - Departments
  - Policies, Policy Versions
  - Bookmarks, Acknowledgements
  - Notifications
  - Dashboard analytics (aggregates)
- [ ] Add CORS config for Vercel frontend
- [ ] Add Docker wiring validation

