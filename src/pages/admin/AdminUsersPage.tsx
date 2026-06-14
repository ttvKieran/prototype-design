import { Activity, BadgeCheck, Lock, Search, ShieldCheck, Unlock, UserRound } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '../../components/common/Button'
import { useAppState } from '../../hooks/useAppState'

export function AdminUsersPage() {
  const { reports, floodPoints, users, toggleUserLock } = useAppState()
  const [query, setQuery] = useState('')

  const filteredUsers = useMemo(() => {
    return users
      .map((user) => {
        const sentReports = reports.filter((report) => report.reporter.id === user.id).length
        const verifiedReports = reports.filter(
          (report) => report.reporter.id === user.id && report.status === 'verified',
        ).length
        const activeFloodPoints = floodPoints.filter((point) => point.reporter.id === user.id).length

        return {
          ...user,
          sentReports,
          verifiedReports,
          activeFloodPoints,
        }
      })
      .filter((user) =>
        `${user.name} ${user.role}`.toLowerCase().includes(query.trim().toLowerCase()),
      )
  }, [floodPoints, query, reports, users])

  return (
    <div className="space-y-5">
      <div className="panel p-4">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            className="field pl-11"
            placeholder="Tìm theo tên hoặc vai trò"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="panel p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Tổng người dùng</span>
            <UserRound size={18} className="text-brand-600" />
          </div>
          <div className="mt-3 text-3xl font-bold text-ink">{users.length}</div>
        </div>
        <div className="panel p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Tài khoản admin</span>
            <ShieldCheck size={18} className="text-brand-600" />
          </div>
          <div className="mt-3 text-3xl font-bold text-ink">
            {users.filter((user) => user.role === 'admin').length}
          </div>
        </div>
        <div className="panel p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Có báo cáo</span>
            <Activity size={18} className="text-brand-600" />
          </div>
          <div className="mt-3 text-3xl font-bold text-ink">
            {filteredUsers.filter((user) => user.sentReports > 0).length}
          </div>
        </div>
        <div className="panel p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Uy tín cao</span>
            <BadgeCheck size={18} className="text-brand-600" />
          </div>
          <div className="mt-3 text-3xl font-bold text-ink">
            {filteredUsers.filter((user) => user.reputation >= 85).length}
          </div>
        </div>
      </div>

      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4">Người dùng</th>
                <th className="px-6 py-4">Vai trò</th>
                <th className="px-6 py-4">Uy tín</th>
                <th className="px-6 py-4">Báo cáo đã gửi</th>
                <th className="px-6 py-4">Đã xác minh</th>
                <th className="px-6 py-4">Điểm ngập liên quan</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t border-slate-100">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-11 w-11 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-semibold text-ink">{user.name}</div>
                        <div className="text-xs text-slate-500">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 capitalize text-slate-700">{user.role}</td>
                  <td className="px-6 py-4 font-semibold text-ink">{user.reputation}/100</td>
                  <td className="px-6 py-4 text-slate-700">{user.sentReports}</td>
                  <td className="px-6 py-4 text-slate-700">{user.verifiedReports}</td>
                  <td className="px-6 py-4 text-slate-700">{user.activeFloodPoints}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        user.isLocked
                          ? 'bg-rose-50 text-rose-700'
                          : user.reputation >= 85
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {user.isLocked
                        ? 'Đã khóa'
                        : user.reputation >= 85
                          ? 'Tin cậy cao'
                          : 'Đang theo dõi'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      variant={user.isLocked ? 'secondary' : 'danger'}
                      className="h-10 px-4 text-xs"
                      onClick={() => {
                        toggleUserLock(user.id)
                        toast.success(
                          user.isLocked
                            ? `Đã mở khóa tài khoản ${user.name}`
                            : `Đã khóa tài khoản ${user.name}`,
                        )
                      }}
                    >
                      {user.isLocked ? (
                        <>
                          <Unlock size={14} className="mr-2" />
                          Mở khóa
                        </>
                      ) : (
                        <>
                          <Lock size={14} className="mr-2" />
                          Khóa
                        </>
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
