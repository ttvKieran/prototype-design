import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { useAppState } from '../hooks/useAppState'
import { AdminLayout } from '../layouts/AdminLayout'
import { MainLayout } from '../layouts/MainLayout'
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage'
import { AdminReportsPage } from '../pages/admin/AdminReportsPage'
import { SystemConfigPage } from '../pages/admin/SystemConfigPage'
import { AuthPage } from '../pages/AuthPage'
import { FloodMapPage } from '../pages/FloodMapPage'
import { FloodPointDetailPage } from '../pages/FloodPointDetailPage'
import { LandingPage } from '../pages/LandingPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { ProfilePage } from '../pages/ProfilePage'
import { ReportFloodPage } from '../pages/ReportFloodPage'
import { SafeRoutePage } from '../pages/SafeRoutePage'

function RequireUserAuth() {
  const { isAuthenticated } = useAppState()
  return isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />
}

function RequireAdminAuth() {
  const { isAuthenticated, isAdmin } = useAppState()
  if (!isAuthenticated) return <Navigate to="/auth" replace />
  return isAdmin ? <Outlet /> : <Navigate to="/home" replace />
}

function AuthRedirect() {
  const { isAuthenticated, isAdmin } = useAppState()
  if (!isAuthenticated) return <AuthPage />
  return <Navigate to={isAdmin ? '/admin' : '/home'} replace />
}

function HomeRedirect() {
  const { isAuthenticated, isAdmin } = useAppState()
  if (!isAuthenticated) return <Navigate to="/auth" replace />
  return <Navigate to={isAdmin ? '/admin' : '/home'} replace />
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/map" element={<FloodMapPage />} />
        <Route path="/flood-points/:id" element={<FloodPointDetailPage />} />
        <Route element={<RequireUserAuth />}>
          <Route path="/report" element={<ReportFloodPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route path="/route-planner" element={<SafeRoutePage />} />
        <Route path="/auth" element={<AuthRedirect />} />
      </Route>
      <Route element={<RequireAdminAuth />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
          <Route path="config" element={<SystemConfigPage />} />
        </Route>
      </Route>
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}
