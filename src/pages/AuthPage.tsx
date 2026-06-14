import { LockKeyhole, LogIn, Mail } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '../components/common/Button'
import { LoadingCard } from '../components/common/LoadingCard'
import { useAppState } from '../hooks/useAppState'

export function AuthPage() {
  const navigate = useNavigate()
  const { login } = useAppState()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('minhanh.hn@safecomm.vn')
  const [password, setPassword] = useState('demo123')

  const handleLogin = () => {
    setLoading(true)
    window.setTimeout(() => {
      const result = login(email)
      setLoading(false)
      if (!result.success) {
        toast.error(result.reason ?? 'Đăng nhập thất bại')
        return
      }
      toast.success(`Đăng nhập ${result.role === 'admin' ? 'admin' : 'người dùng'} thành công`)
      navigate(result.role === 'admin' ? '/admin' : '/', { replace: true })
    }, 900)
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr,0.9fr]">
      <section className="panel-dark px-8 py-10">
        <p className="text-sm uppercase tracking-[0.32em] text-brand-200">Secure Access</p>
        <h1 className="mt-4 text-4xl font-bold">Đăng nhập để gửi báo cáo và theo dõi uy tín cá nhân.</h1>
        <p className="mt-4 text-slate-300">
          Hệ thống tự nhận diện vai trò theo tài khoản đăng nhập. User sẽ vào khu vực người dùng, admin sẽ vào dashboard quản trị.
        </p>
        <div className="mt-6 space-y-3 text-sm text-slate-300">
          <div>Tài khoản user: `minhanh.hn@safecomm.vn` / `demo123`</div>
          <div>Tài khoản admin: `admin@safecomm.vn` / `admin123`</div>
        </div>
      </section>
      <section className="panel p-6 sm:p-8">
        {loading ? (
          <div className="space-y-4">
            <LoadingCard />
            <LoadingCard />
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input className="field pl-11" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Mật khẩu</label>
              <div className="relative">
                <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input className="field pl-11" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
            <Button fullWidth onClick={handleLogin}>
              Đăng nhập
            </Button>
            <Button variant="secondary" fullWidth onClick={handleLogin}>
              <LogIn size={18} className="mr-2" />
              Đăng nhập với Google
            </Button>
            <p className="text-center text-sm text-slate-500">Chưa có tài khoản? Đăng ký ngay trong cùng form demo.</p>
          </div>
        )}
      </section>
    </div>
  )
}
