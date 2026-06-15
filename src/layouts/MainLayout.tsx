import { LogOut, MapPinned, MessageSquareMore, Route, ShieldCheck, UserCircle2 } from 'lucide-react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAppState } from '../hooks/useAppState'
import { Button } from '../components/common/Button'

const navItems = [
  { to: '/home', label: 'Cộng đồng', icon: MessageSquareMore },
  { to: '/map', label: 'Bản đồ ngập', icon: MapPinned },
  { to: '/route-planner', label: 'Tránh ngập', icon: Route },
  { to: '/profile', label: 'Hồ sơ', icon: UserCircle2 },
]

export function MainLayout() {
  const navigate = useNavigate()
  const { profile, isAuthenticated, logout } = useAppState()

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-[1000] border-b border-white/60 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/home" className="flex items-center gap-3">
            <div className="rounded-2xl bg-brand-500 p-3 text-white">
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Ha Noi Flood Watch</div>
              <div className="text-lg font-bold text-ink">Quản lý bản đồ ngập lụt</div>
            </div>
          </Link>
          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? 'bg-brand-600 text-white shadow-soft' : 'text-slate-600 hover:bg-slate-100'}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          {isAuthenticated && profile ? (
            <button
              type="button"
              onClick={() => {
                logout()
                navigate('/auth', { replace: true })
              }}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-soft md:hidden"
              aria-label="Đăng xuất"
            >
              <LogOut size={18} />
            </button>
          ) : (
            <Link
              to="/auth"
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-brand-500 px-4 text-sm font-semibold text-white shadow-soft md:hidden"
            >
              Đăng nhập
            </Link>
          )}
          {isAuthenticated && profile ? (
            <div className="hidden items-center gap-3 rounded-full bg-slate-50 px-3 py-2 md:flex">
              <img src={profile.avatar} alt={profile.fullName} className="h-10 w-10 rounded-full object-cover" />
              <div>
                <div className="text-sm font-semibold text-ink">{profile.fullName}</div>
                <div className="text-xs text-slate-500">Uy tín {profile.reputation}/100</div>
              </div>
              <Button
                variant="secondary"
                className="h-10 px-4"
                onClick={() => {
                  logout()
                  navigate('/auth', { replace: true })
                }}
              >
                <LogOut size={16} className="mr-2" />
                Đăng xuất
              </Button>
            </div>
          ) : (
            <Link to="/auth" className="hidden md:block">
              <Button>Đăng nhập</Button>
            </Link>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <nav className="fixed inset-x-3 bottom-3 z-[1000] grid grid-cols-4 rounded-[28px] border border-white/80 bg-white/95 p-2 shadow-soft md:hidden">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium ${isActive ? 'bg-brand-600 text-white shadow-soft' : 'text-slate-500'}`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
