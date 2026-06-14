import { Clock3, MapPin, ShieldCheck } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '../components/common/Button'
import { EmptyState } from '../components/common/EmptyState'
import { SeverityBadge } from '../components/common/SeverityBadge'
import { FloodStatusPill, ReportStatusPill } from '../components/common/StatusPill'
import { useAppState } from '../hooks/useAppState'
import { formatDateTime } from '../utils/format'

export function FloodPointDetailPage() {
  const { id } = useParams()
  const { floodPoints, reports, confirmFloodPoint, resolveFloodPoint } = useAppState()
  const point = floodPoints.find((item) => item.id === id)

  if (!point) {
    return <EmptyState title="Không tìm thấy điểm ngập" description="Điểm ngập bạn đang xem có thể đã bị xóa khỏi mock data hoặc đường dẫn không hợp lệ." />
  }

  const relatedReports = reports.filter((report) => report.floodPointId === point.id)

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
      <section className="space-y-6">
        <div className="panel overflow-hidden">
          <img src={point.image} alt={point.name} className="h-72 w-full object-cover" />
          <div className="space-y-5 p-6">
            <div className="flex flex-wrap gap-2">
              <SeverityBadge severity={point.severity} />
              <FloodStatusPill status={point.status} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-ink">{point.name}</h1>
              <p className="mt-2 text-slate-500">{point.address}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[24px] bg-slate-50 p-4">
                <div className="text-sm text-slate-500">Confidence</div>
                <div className="mt-2 text-2xl font-bold text-ink">{point.confidence}%</div>
                <div className="mt-3 h-2 rounded-full bg-slate-200">
                  <div className="h-2 rounded-full bg-brand-500" style={{ width: `${point.confidence}%` }} />
                </div>
              </div>
              <div className="rounded-[24px] bg-slate-50 p-4">
                <div className="text-sm text-slate-500">Mực nước ước tính</div>
                <div className="mt-2 text-2xl font-bold text-ink">{point.waterDepthCm} cm</div>
              </div>
              <div className="rounded-[24px] bg-slate-50 p-4">
                <div className="text-sm text-slate-500">Lượt xác nhận</div>
                <div className="mt-2 text-2xl font-bold text-ink">{point.confirmations}</div>
              </div>
            </div>
            <p className="rounded-[24px] bg-brand-50 p-4 text-sm leading-6 text-brand-900">{point.note}</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={() => {
                  confirmFloodPoint(point.id)
                  toast.success('Đã xác nhận điểm còn ngập')
                }}
              >
                Xác nhận còn ngập
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  resolveFloodPoint(point.id)
                  toast.success('Đã cập nhật điểm đã hết ngập')
                }}
              >
                Báo đã hết ngập
              </Button>
            </div>
          </div>
        </div>

        <div className="panel p-6">
          <h2 className="text-xl font-semibold text-ink">Lịch sử cập nhật</h2>
          <div className="mt-6 space-y-4">
            {point.updates.map((update) => (
              <div key={update.id} className="relative border-l border-brand-200 pl-5">
                <div className="absolute -left-[6px] top-1 h-3 w-3 rounded-full bg-brand-500" />
                <div className="text-sm text-slate-500">{formatDateTime(update.time)}</div>
                <div className="mt-1 font-semibold text-ink">{update.title}</div>
                <div className="mt-1 text-sm text-slate-500">{update.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <aside className="space-y-6">
        <div className="panel p-6">
          <h2 className="text-xl font-semibold text-ink">Người báo cáo chính</h2>
          <div className="mt-5 flex items-center gap-4">
            <img src={point.reporter.avatar} alt={point.reporter.name} className="h-16 w-16 rounded-full object-cover" />
            <div>
              <div className="text-lg font-semibold text-ink">{point.reporter.name}</div>
              <div className="text-sm text-slate-500">Vai trò: {point.reporter.role}</div>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            <div className="rounded-[24px] bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <ShieldCheck size={16} />
                Điểm uy tín
              </div>
              <div className="mt-2 text-3xl font-bold text-ink">{point.reporter.reputation}/100</div>
            </div>
            <div className="rounded-[24px] bg-slate-50 p-4 text-sm text-slate-600">
              <div className="mb-2 flex items-center gap-2">
                <MapPin size={16} />
                Mốc gần nhất
              </div>
              {point.nearbyLandmark}
            </div>
            <div className="rounded-[24px] bg-slate-50 p-4 text-sm text-slate-600">
              <div className="mb-2 flex items-center gap-2">
                <Clock3 size={16} />
                Cập nhật lần cuối
              </div>
              {formatDateTime(point.updatedAt)}
            </div>
          </div>
        </div>

        <div className="panel p-6">
          <h2 className="text-xl font-semibold text-ink">Báo cáo liên quan</h2>
          <div className="mt-5 space-y-4">
            {relatedReports.map((report) => (
              <div key={report.id} className="rounded-[24px] border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={report.reporter.avatar} alt={report.reporter.name} className="h-10 w-10 rounded-full object-cover" />
                    <div>
                      <div className="font-semibold text-ink">{report.reporter.name}</div>
                      <div className="text-xs text-slate-500">{formatDateTime(report.submittedAt)}</div>
                    </div>
                  </div>
                  <ReportStatusPill status={report.status} />
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{report.description}</p>
              </div>
            ))}
            {!relatedReports.length && (
              <EmptyState title="Chưa có báo cáo liên quan" description="Hãy khuyến khích cộng đồng gửi thêm hình ảnh và xác nhận để tăng độ tin cậy." />
            )}
          </div>
        </div>
      </aside>
    </div>
  )
}
