import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { AuthGuard } from './routes/AuthGuard'
import { RoleGuard } from './routes/RoleGuard'
import LoginPage from './pages/auth/LoginPage'
import EmployeeDashboardPage from './pages/employee/EmployeeDashboardPage'
import EmployeePoliciesPage from './pages/employee/EmployeePoliciesPage'
import EmployeePolicyDetailsPage from './pages/employee/EmployeePolicyDetailsPage'
import EmployeeSearchPage from './pages/employee/EmployeeSearchPage'
import EmployeeBookmarksPage from './pages/employee/EmployeeBookmarksPage'
import EmployeeProfilePage from './pages/employee/EmployeeProfilePage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminDepartmentsPage from './pages/admin/AdminDepartmentsPage'
import AdminReviewBoardPage from './pages/admin/AdminReviewBoardPage'
import AdminPoliciesPage from './pages/admin/AdminPoliciesPage'
import AdminCreatePolicyPage from './pages/admin/AdminCreatePolicyPage'
import AdminEditPolicyPage from './pages/admin/AdminEditPolicyPage'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import AdminProfilePage from './pages/admin/AdminProfilePage'

export default function App() {
  const { role } = useAuth()

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to={
              role === 'Admin'
                ? '/admin/dashboard'
                : role === 'Employee'
                ? '/employee/dashboard'
                : '/login'
            }
            replace
          />
        }
      />

      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/employee"
        element={
          <AuthGuard>
            <RoleGuard roles={['Employee']}>
              <Outlet />
            </RoleGuard>
          </AuthGuard>
        }
      >
        <Route path="dashboard" element={<EmployeeDashboardPage />} />
        <Route path="policies" element={<EmployeePoliciesPage />} />
        <Route path="policies/:id" element={<EmployeePolicyDetailsPage />} />
        <Route path="search" element={<EmployeeSearchPage />} />
        <Route path="bookmarks" element={<EmployeeBookmarksPage />} />
        <Route path="profile" element={<EmployeeProfilePage />} />
      </Route>

      <Route
        path="/admin"
        element={
          <AuthGuard>
            <RoleGuard roles={['Admin']}>
              <Outlet />
            </RoleGuard>
          </AuthGuard>
        }
      >
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="departments" element={<AdminDepartmentsPage />} />
        <Route path="policies" element={<AdminPoliciesPage />} />
        <Route path="policies/new" element={<AdminCreatePolicyPage />} />
        <Route path="policies/:id/edit" element={<AdminEditPolicyPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="review-board" element={<AdminReviewBoardPage />} />
        <Route path="profile" element={<AdminProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

