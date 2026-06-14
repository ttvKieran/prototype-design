import { ChartNoAxesColumn, CircleCheckBig, CircleX, FileStack, Star } from 'lucide-react'
import { EmptyState } from '../components/common/EmptyState'
import { MetricCard } from '../components/common/MetricCard'
import { ReportStatusPill } from '../components/common/StatusPill'
import { useAppState } from '../hooks/useAppState'
import { formatDateTime } from '../utils/format'

export function ProfilePage() {
  const { profile, reports } = useAppState()
  if (!profile) return null

  const myReports = reports.filter((report) => report.reporter.id === profile.id)

  return (
    <div className="space-y-6">
      <section className="panel p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <img src={profile.avatar} alt={profile.fullName} className="h-20 w-20 rounded-full object-cover" />
            <div>
              <h1 className="text-3xl font-bold text-ink">{profile.fullName}</h1>
              <p className="mt-1 text-slate-500">
                {profile.email} • {profile.phone} • {profile.district}
              </p>
            </div>
          </div>
          <div className="rounded-[24px] bg-brand-50 px-5 py-4 text-brand-900">
            <div className="text-sm">UserReputation</div>
            <div className="mt-1 text-3xl font-bold">{profile.reputation}/100</div>
          </div>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Báo cáo đã gửi" value={`${profile.sentReports}`} detail="Tổng số báo cáo cộng đồng đã tạo." icon={<FileStack size={20} />} />
        <MetricCard label="Được xác minh" value={`${profile.verifiedReports}`} detail="Báo cáo đã được xác nhận hợp lệ." icon={<CircleCheckBig size={20} />} />
        <MetricCard label="Bị từ chối" value={`${profile.rejectedReports}`} detail="Báo cáo sai thời điểm hoặc sai vị trí." icon={<CircleX size={20} />} />
        <MetricCard label="Điểm uy tín" value={`${profile.reputation}`} detail="Ảnh hưởng đến confidence score hệ thống." icon={<Star size={20} />} />
      </section>
      <section className="panel p-6">
        <div className="mb-5 flex items-center gap-3">
          <ChartNoAxesColumn size={20} className="text-brand-600" />
          <h2 className="text-xl font-semibold text-ink">Báo cáo gần đây</h2>
        </div>
        {myReports.length ? (
          <div className="space-y-4">
            {myReports.map((report) => (
              <div key={report.id} className="rounded-[24px] border border-slate-200 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="font-semibold text-ink">{report.description}</div>
                    <div className="mt-1 text-sm text-slate-500">{formatDateTime(report.submittedAt)}</div>
                  </div>
                  <ReportStatusPill status={report.status} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="Chưa có báo cáo mới" description="Khi bạn gửi báo cáo ngập, danh sách gần đây sẽ xuất hiện tại đây." />
        )}
      </section>
    </div>
  )
}
