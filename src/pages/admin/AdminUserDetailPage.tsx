import { ArrowLeft, BadgeCheck, Lock, MapPinned, ShieldCheck, Unlock } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '../../components/common/Button'
import { EmptyState } from '../../components/common/EmptyState'
import { ReportStatusPill } from '../../components/common/StatusPill'
import { SeverityBadge } from '../../components/common/SeverityBadge'
import { useAppState } from '../../hooks/useAppState'
import { formatDateTime } from '../../utils/format'

export function AdminUserDetailPage() {
  const { id } = useParams()
  const { users, reports, floodPoints, toggleUserLock } = useAppState()
  const user = users.find((item) => item.id === id)

  if (!user) {
    return (
      <EmptyState
        title="Không tìm thấy người dùng"
        description="Tài khoản bạn đang xem không tồn tại trong dữ liệu demo hiện tại."
      />
    )
  }

  const userReports = reports.filter((report) => report.reporter.id === user.id)
  const verifiedReports = userReports.filter((report) => report.status === 'verified').length
  const rejectedReports = userReports.filter((report) => report.status === 'rejected').length
  const linkedFloodPoints = floodPoints.filter((point) => point.reporter.id === user.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Link to="/admin/users">
          <Button variant="secondary" className="h-11 px-4">
            <ArrowLeft size={16} className="mr-2" />
            Quay lại danh sách user
          </Button>
        </Link>
        <Button
          variant={user.isLocked ? 'secondary' : 'danger'}
          className="h-11 px-4"
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
              <Unlock size={16} className="mr-2" />
              Mở khóa tài khoản
            </>
          ) : (
            <>
              <Lock size={16} className="mr-2" />
              Khóa tài khoản
            </>
          )}
        </Button>
      </div>

      <div className="panel p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <img src={user.avatar} alt={user.name} className="h-20 w-20 rounded-full object-cover" />
            <div>
              <h1 className="text-3xl font-bold text-ink">{user.name}</h1>
              <div className="mt-2 flex flex-wrap gap-2 text-sm">
                <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700 capitalize">
                  {user.role}
                </span>
                <span
                  className={`rounded-full px-3 py-1 font-medium ${
                    user.isLocked ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                  }`}
                >
                  {user.isLocked ? 'Đã khóa' : 'Đang hoạt động'}
                </span>
              </div>
            </div>
          </div>
          <div className="rounded-[24px] bg-brand-50 px-5 py-4 text-brand-900">
            <div className="text-sm">Uy tín hiện tại</div>
            <div className="mt-1 text-3xl font-bold">{user.reputation}/100</div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="panel p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Báo cáo đã gửi</span>
            <MapPinned size={18} className="text-brand-600" />
          </div>
          <div className="mt-3 text-3xl font-bold text-ink">{userReports.length}</div>
        </div>
        <div className="panel p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Đã xác minh</span>
            <BadgeCheck size={18} className="text-brand-600" />
          </div>
          <div className="mt-3 text-3xl font-bold text-ink">{verifiedReports}</div>
        </div>
        <div className="panel p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Bị từ chối</span>
            <ShieldCheck size={18} className="text-brand-600" />
          </div>
          <div className="mt-3 text-3xl font-bold text-ink">{rejectedReports}</div>
        </div>
        <div className="panel p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Điểm ngập liên quan</span>
            <MapPinned size={18} className="text-brand-600" />
          </div>
          <div className="mt-3 text-3xl font-bold text-ink">{linkedFloodPoints.length}</div>
        </div>
      </div>

      <div className="panel overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-xl font-semibold text-ink">Các báo cáo của người dùng</h2>
        </div>
        {userReports.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-4">Khu vực</th>
                  <th className="px-6 py-4">Mức độ</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4">Mô tả</th>
                  <th className="px-6 py-4">Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {userReports.map((report) => {
                  const point = floodPoints.find((item) => item.id === report.floodPointId)
                  return (
                    <tr key={report.id} className="border-t border-slate-100 align-top">
                      <td className="px-6 py-4 font-medium text-ink">
                        {point?.name ?? 'Điểm mới từ cộng đồng'}
                      </td>
                      <td className="px-6 py-4">
                        <SeverityBadge severity={report.severity} />
                      </td>
                      <td className="px-6 py-4">
                        <ReportStatusPill status={report.status} />
                      </td>
                      <td className="px-6 py-4 text-slate-600">{report.description}</td>
                      <td className="px-6 py-4 text-slate-500">
                        {formatDateTime(report.submittedAt)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6">
            <EmptyState
              title="Người dùng chưa có báo cáo"
              description="Khi người dùng gửi báo cáo cộng đồng, danh sách sẽ hiển thị tại đây để admin xem xét."
            />
          </div>
        )}
      </div>
    </div>
  )
}
