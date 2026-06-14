import { ArrowLeft, BarChart3, FileWarning, LogOut, Settings2 } from 'lucide-react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Button } from '../components/common/Button'
import { useAppState } from '../hooks/useAppState'

const items = [
  { to: '/admin', label: 'Dashboard', icon: BarChart3, end: true },
  { to: '/admin/reports', label: 'Báo cáo', icon: FileWarning },
  { to: '/admin/config', label: 'Cấu hình', icon: Settings2 },
]

export function AdminLayout() {
  const navigate = useNavigate()
  const { profile, logout } = useAppState()

  return (
    <div className="grid min-h-screen gap-6 lg:grid-cols-[280px,1fr]">
      <aside className="panel-dark p-6">
        <div className="mb-8">
          <div className="text-sm uppercase tracking-[0.32em] text-brand-200">Control Room</div>
          <h1 className="mt-3 text-2xl font-bold">FloodOps Admin</h1>
          <p className="mt-2 text-sm text-slate-300">Điều phối xác minh, cảnh báo và cấu hình hệ thống cho thành phố Hà Nội.</p>
        </div>
        <div className="space-y-2">
          {items.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-white text-storm' : 'text-slate-300 hover:bg-white/10'}`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </div>
      </aside>
      <section className="space-y-6 py-6 pr-0 lg:pr-6">
        <div className="panel flex items-center justify-between p-4">
          <div>
            <p className="text-sm text-slate-500">Trung tâm giám sát mùa mưa lũ</p>
            <h2 className="text-2xl font-bold text-ink">Bảng điều phối hệ thống</h2>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="hidden md:block">
              <Button variant="secondary" className="h-11 px-4">
                <ArrowLeft size={16} className="mr-2" />
                Về trang user
              </Button>
            </Link>
            <div className="hidden rounded-2xl bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-700 md:block">
              {profile?.fullName ?? 'Admin'} • Chế độ demo
            </div>
            <Button
              variant="secondary"
              className="h-11 px-4"
              onClick={() => {
                logout()
                navigate('/auth', { replace: true })
              }}
            >
              <LogOut size={16} className="mr-2" />
              Đăng xuất
            </Button>
          </div>
        </div>
        <Outlet />
      </section>
    </div>
  )
}
