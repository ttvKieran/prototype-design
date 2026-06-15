import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet'
import { Button } from '../components/common/Button'
import { EmptyState } from '../components/common/EmptyState'
import { SeverityBadge } from '../components/common/SeverityBadge'
import { FloodStatusPill, ReportStatusPill } from '../components/common/StatusPill'
import { useAppState } from '../hooks/useAppState'
import { formatDateTime } from '../utils/format'

type AreaPost =
  | {
      id: string
      kind: 'flood-point'
      title: string
      body: string
      image: string
      time: string
      reporter: {
        name: string
        avatar: string
      }
      severity: 'light' | 'medium' | 'heavy'
      district: string
      address: string
      confirmations: number
      confidence: number
      nearbyLandmark: string
      status: React.ReactNode
      to: string
    }
  | {
      id: string
      kind: 'report'
      title: string
      body: string
      image: string
      time: string
      reporter: {
        name: string
        avatar: string
      }
      severity: 'light' | 'medium' | 'heavy'
      district: string
      address: string
      confirmations: number
      confidence: number
      nearbyLandmark: string
      status: React.ReactNode
      to: string
    }

export function FloodPointDetailPage() {
  const { id } = useParams()
  const { floodPoints, reports, confirmFloodPoint, resolveFloodPoint } = useAppState()
  const point = floodPoints.find((item) => item.id === id)

  if (!point) {
    return <EmptyState title="Không tìm thấy điểm ngập" description="Điểm ngập bạn đang xem có thể đã bị xóa khỏi mock data hoặc đường dẫn không hợp lệ." />
  }

  const relatedReports = reports.filter((report) => report.floodPointId === point.id)
  const nearbyPoints = floodPoints
    .filter((item) => item.id !== point.id && item.district === point.district)
    .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
  const mapPoints = [point, ...nearbyPoints]
  const sortedUpdates = [...point.updates].sort((a, b) => +new Date(a.time) - +new Date(b.time))
  const detectedAt = sortedUpdates[0]?.time ?? point.updatedAt
  const resolvedUpdate = [...point.updates]
    .reverse()
    .find((update) => update.title.toLowerCase().includes('hết ngập') || update.title.toLowerCase().includes('đã báo hết ngập'))
  const resolvedAt = point.status === 'resolved' ? resolvedUpdate?.time ?? point.updatedAt : null

  const areaPosts: AreaPost[] = [
    ...relatedReports.map((report) => ({
      id: `report-${report.id}`,
      kind: 'report' as const,
      title: `Bổ sung báo cáo cho ${point.name}`,
      body: report.description,
      image: report.image,
      time: report.submittedAt,
      reporter: {
        name: report.reporter.name,
        avatar: report.reporter.avatar,
      },
      severity: report.severity,
      district: point.district,
      address: point.address,
      confirmations: report.confirmations,
      confidence: point.confidence,
      nearbyLandmark: point.nearbyLandmark,
      status: <ReportStatusPill status={report.status} />,
      to: `/flood-points/${point.id}`,
    })),
    ...nearbyPoints.map((item) => {
      const linkedReport = reports.find((report) => report.floodPointId === item.id)

      return {
        id: `point-${item.id}`,
        kind: 'flood-point' as const,
        title: item.name,
        body: item.note,
        image: item.image,
        time: item.updatedAt,
        reporter: {
          name: item.reporter.name,
          avatar: item.reporter.avatar,
        },
        severity: item.severity,
        district: item.district,
        address: item.address,
        confirmations: item.confirmations,
        confidence: item.confidence,
        nearbyLandmark: item.nearbyLandmark,
        status: linkedReport ? <ReportStatusPill status={linkedReport.status} /> : <FloodStatusPill status={item.status} />,
        to: `/flood-points/${item.id}`,
      }
    }),
  ].sort((a, b) => +new Date(b.time) - +new Date(a.time))

  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="panel overflow-hidden">
          <img src={point.image} alt={point.name} className="h-72 w-full object-cover" />
          <div className="space-y-5 p-5 sm:p-6">
            <div className="flex flex-wrap gap-2">
              <SeverityBadge severity={point.severity} />
              <FloodStatusPill status={point.status} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-ink sm:text-3xl">{point.name}</h1>
              <p className="mt-2 text-sm text-slate-500 sm:text-base">{point.address}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[24px] bg-slate-50 p-4">
                <div className="text-sm text-slate-500">Độ tin cậy</div>
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
            <div className="flex flex-wrap gap-3 text-sm text-slate-500">
              <span>{point.district}</span>
              <span>Mốc gần nhất: {point.nearbyLandmark}</span>
              <span>Cập nhật {formatDateTime(point.updatedAt)}</span>
            </div>
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

        <aside className="panel p-5 sm:p-6">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Lịch sử hệ thống</div>
          <h2 className="mt-2 text-xl font-bold text-ink sm:text-2xl">Các mốc ghi nhận</h2>
          <div className="mt-6 space-y-4">
            <div className="rounded-[24px] border border-slate-100 bg-slate-50 p-4">
              <div className="text-sm font-medium text-slate-500">Thời điểm xác định ngập</div>
              <div className="mt-2 text-lg font-semibold text-ink">{formatDateTime(detectedAt)}</div>
            </div>
            <div className="rounded-[24px] border border-slate-100 bg-slate-50 p-4">
              <div className="text-sm font-medium text-slate-500">Thời điểm hết ngập</div>
              <div className="mt-2 text-lg font-semibold text-ink">{resolvedAt ? formatDateTime(resolvedAt) : 'Chưa ghi nhận'}</div>
            </div>
          </div>
        </aside>
      </section>

      <section className="panel p-5 sm:p-6">
        <div className="mb-4">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Bản đồ vị trí</div>
          <h2 className="mt-2 text-xl font-bold text-ink sm:text-2xl">Vị trí điểm ngập trên bản đồ</h2>
          <p className="mt-2 text-sm text-slate-500">Điểm đang xem được nhấn mạnh. Các điểm khác trong cùng khu vực được hiển thị để đối chiếu nhanh.</p>
        </div>
        <div className="overflow-hidden rounded-[28px] border border-slate-100">
          <MapContainer center={[point.lat, point.lng]} zoom={15} scrollWheelZoom className="h-[46vh] w-full sm:h-[52vh]">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {mapPoints.map((item) => {
              const isCurrentPoint = item.id === point.id

              return (
                <CircleMarker
                  key={item.id}
                  center={[item.lat, item.lng]}
                  radius={isCurrentPoint ? 14 : 9}
                  pathOptions={{
                    color: isCurrentPoint ? '#0f766e' : item.severity === 'heavy' ? '#e11d48' : item.severity === 'medium' ? '#f59e0b' : '#10b981',
                    fillColor: isCurrentPoint ? '#14b8a6' : item.severity === 'heavy' ? '#e11d48' : item.severity === 'medium' ? '#f59e0b' : '#10b981',
                    fillOpacity: isCurrentPoint ? 0.95 : 0.75,
                    weight: isCurrentPoint ? 4 : 2,
                  }}
                >
                  <Popup minWidth={260}>
                    <div className="space-y-3">
                      <img src={item.image} alt={item.name} className="h-32 w-full rounded-2xl object-cover" />
                      <div className="flex flex-wrap gap-2">
                        <SeverityBadge severity={item.severity} />
                        <FloodStatusPill status={item.status} />
                      </div>
                      <div>
                        <div className="text-base font-semibold text-ink">{item.name}</div>
                        <div className="text-sm text-slate-500">{item.address}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-2xl bg-slate-50 p-3">
                          <div className="text-slate-500">Độ tin cậy</div>
                          <div className="font-semibold text-ink">{item.confidence}%</div>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-3">
                          <div className="text-slate-500">Xác nhận</div>
                          <div className="font-semibold text-ink">{item.confirmations}</div>
                        </div>
                      </div>
                      <Link to={`/flood-points/${item.id}`}>
                        <Button fullWidth>{isCurrentPoint ? 'Đang xem điểm này' : 'Xem chi tiết điểm này'}</Button>
                      </Link>
                    </div>
                  </Popup>
                </CircleMarker>
              )
            })}
          </MapContainer>
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Bài đăng khu vực</div>
          <h2 className="mt-2 text-xl font-bold text-ink sm:text-2xl">Bài đăng cộng đồng liên quan tới khu vực này</h2>
        </div>

        {areaPosts.length ? (
          areaPosts.map((post) => (
            <article key={post.id} className="panel overflow-hidden p-0">
              <div className="p-5 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img src={post.reporter.avatar} alt={post.reporter.name} className="h-12 w-12 rounded-2xl object-cover sm:h-14 sm:w-14" />
                    <div>
                      <div className="text-sm font-semibold text-ink sm:text-base">{post.reporter.name}</div>
                      <div className="text-xs text-slate-500 sm:text-sm">
                        {post.district} • {formatDateTime(post.time)}
                      </div>
                    </div>
                  </div>
                  <SeverityBadge severity={post.severity} />
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {post.status}
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {post.kind === 'report' ? 'Bài đăng bổ sung' : 'Điểm ngập liên quan'}
                  </span>
                </div>

                <Link to={post.to} className="mt-5 block">
                  <h3 className="text-xl font-bold text-ink transition hover:text-brand-700 sm:text-2xl">{post.title}</h3>
                </Link>
                <p className="mt-2 text-xs text-slate-500 sm:text-sm">{post.address}</p>
                <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">{post.body}</p>

                <Link to={post.to} className="mt-6 block overflow-hidden rounded-[28px] border border-slate-100 bg-slate-50/70">
                  <img src={post.image} alt={post.title} className="h-64 w-full object-cover transition hover:opacity-95 sm:h-72" />
                </Link>

                <div className="mt-5 flex flex-wrap gap-3 text-xs text-slate-500 sm:text-sm">
                  <span>{post.confirmations} xác nhận</span>
                  <span>Độ tin cậy {post.confidence}%</span>
                  <span>Mốc gần nhất: {post.nearbyLandmark}</span>
                </div>
              </div>
            </article>
          ))
        ) : (
          <EmptyState title="Chưa có thêm bài đăng nào" description="Khi cộng đồng gửi thêm báo cáo hoặc có điểm ngập khác trong cùng khu vực, danh sách sẽ xuất hiện tại đây." />
        )}
      </section>
    </div>
  )
}
