# Brainstorm Plan - Internal Policy & SOP Management Platform

## Information gathered
- Workspace was empty initially; created:
  - `/internal-policy-sop/README.md` (monorepo overview)
  - `/TODO.md` (step tracker)
- No existing code to inspect; must generate full project from scratch.

## Architecture decisions (must-have)
- **Backend (Laravel 12, PHP 8.3)**
  - Clean architecture layering by folder namespace conventions:
    - Controllers: request/response orchestration
    - Requests: Form request validation
    - Resources: API Resources
    - Services: business use-cases
    - Repositories: persistence abstraction (Eloquent-based)
    - Models: Eloquent models
    - Policies/Middleware: RBAC enforcement (Admin/Employee)
  - Auth: Laravel Sanctum with JWT-like behavior using Sanctum SPA token/Personal access tokens.
    - Use API token auth (`auth:sanctum`).
  - Roles:
    - `Role` enum or table (`roles`): Admin, Employee
    - `users.role` relation
    - Role-based authorization via middleware + Laravel Policies.

- **Frontend (React 19, Vite)**
  - Folder structure required:
    - components, pages, layouts, hooks, services, context, routes, utils, assets
  - Auth:
    - Axios instance attaches Bearer token (Sanctum personal access token)
    - Context manages user + token
  - Routes:
    - PrivateRoute + RoleGuard for Admin/Employee.

- **DevOps / Deployment**
  - Docker:
    - `docker-compose.yml` includes:
      - `backend` (Laravel)
      - `frontend` (React) build or dev
      - `db` (PostgreSQL)
      - `nginx` reverse proxy
  - Backend Dockerfile:
    - PHP-FPM + nginx or PHP-FPM + external nginx
  - Frontend Dockerfile:
    - multi-stage build to nginx or serve with node.
  - Deployment:
    - Backend to Render (web + worker not needed unless background jobs)
    - Frontend to Vercel
    - Neon Postgres via Render/Postgres connection string.

## Plan (step-by-step code generation)
1. Create monorepo root structure:
   - `backend/` Laravel project skeleton + required config files
   - `frontend/` Vite+React skeleton + required config files
   - `infra/` docker + nginx configs
   - Root `docker-compose.yml` and `.env.example`

2. Backend generation tasks
   - Laravel folder structure + namespaces for Clean Architecture (by convention).
   - Install/enable Sanctum.
   - Create RBAC:
     - roles enum/table
     - middleware `EnsureRole`
     - authorization using policies for resources.
   - Entities (initial SOP domain):
     - departments, documents/policies, sops, approvals, versions
     - keep minimal but scalable models + migrations.
   - API endpoints (REST):
     - Auth: register/login/logout/me/token
     - Documents/SOP CRUD (Admin full; Employee read; optional approve)
     - Approval workflow: list, approve/reject
   - Add Requests/Resources:
     - e.g. StorePolicyRequest, UpdatePolicyRequest
   - Add repositories/services:
     - e.g. PolicyRepository (Eloquent), PolicyService (use-case)
   - Add seeders/factories for roles + sample data.

3. Docker/backend infra
   - Backend Dockerfile for production.
   - Nginx config to serve Laravel public and forward to PHP-FPM.
   - `docker-compose.yml` wiring with `depends_on` and volumes.

4. Frontend generation tasks
   - React Router DOM with nested routes.
   - Axios API client and interceptors.
   - Auth Context + Role guards.
   - Pages:
     - Login/Register
     - Dashboard
     - Policies/SOP lists
     - Create/edit (Admin)
     - Approval page (Employee/Admin depending on workflow)
     - Charts dashboard page (Chart.js)
   - Components + layouts: Sidebar/topbar.
   - Tailwind config + base styles.

5. Frontend Dockerfile
   - multi-stage build and serve via nginx or `node preview`.

6. Final integration
   - Ensure CORS config in backend for Vercel frontend.
   - Ensure Sanctum cookie/token settings.
   - Provide README with:
     - local dev via docker-compose
     - Render and Vercel deployment steps
     - env var list

7. Update TODO.md progress.

