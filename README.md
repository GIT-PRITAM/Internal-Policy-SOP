# Internal Policy & SOP Management Platform

Monorepo:
- `backend/` - Laravel 12 REST API with Sanctum (Bearer tokens) + RBAC (Admin/Employee)
- `frontend/` - React 19 SPA with Tailwind, Router, Axios, Role guards
- `infra/` - Nginx configs

## Local development (Docker Compose)
1. Copy env:
   - `cp .env.example .env`
   - Set `APP_KEY` using `cd backend && php artisan key:generate --show`
2. Start:
   - `docker compose up --build`
3. Backend API should be reachable via:
   - `http://localhost:8080/api`
4. Frontend should be reachable via:
   - `http://localhost:8080/`

## Deployment
- Frontend: Vercel
  - Build command: `npm run build`
  - Output: `dist`
  - Set env var(s) used by frontend (API base URL).
- Backend: Render
  - Build: composer install + php artisan migrate
  - Set env vars from `.env.example` but replace DB_HOST with Neon connection details.

## Auth
- Sanctum Personal Access Token
- Frontend sends: `Authorization: Bearer <token>`
