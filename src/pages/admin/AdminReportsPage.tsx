import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '../../components/common/Button'
import { ReportStatusPill } from '../../components/common/StatusPill'
import { SeverityBadge } from '../../components/common/SeverityBadge'
import { useAppState } from '../../hooks/useAppState'
import type { FloodSeverity, ReportStatus } from '../../types'
import { formatDateTime } from '../../utils/format'

export function AdminReportsPage() {
  const { reports, floodPoints, verifyReport, rejectReport } = useAppState()
  const [status, setStatus] = useState<ReportStatus | 'all'>('all')
  const [severity, setSeverity] = useState<FloodSeverity | 'all'>('all')

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesStatus = status === 'all' ? true : report.status === status
      const matchesSeverity = severity === 'all' ? true : report.severity === severity
      return matchesStatus && matchesSeverity
    })
  }, [reports, severity, status])

  return (
    <div className="space-y-5">
      <div className="panel grid gap-3 p-4 md:grid-cols-2">
        <select className="field" value={status} onChange={(e) => setStatus(e.target.value as ReportStatus | 'all')}>
          <option value="all">Tất cả trạng thái</option>
          <option value="pending">Chờ xử lý</option>
          <option value="verified">Đã xác minh</option>
          <option value="rejected">Bị từ chối</option>
        </select>
        <select className="field" value={severity} onChange={(e) => setSeverity(e.target.value as FloodSeverity | 'all')}>
          <option value="all">Tất cả mức độ</option>
          <option value="light">Ngập nhẹ</option>
          <option value="medium">Ngập trung bình</option>
          <option value="heavy">Ngập nặng</option>
        </select>
      </div>
      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4">Người gửi</th>
                <th className="px-6 py-4">Khu vực</th>
                <th className="px-6 py-4">Mức độ</th>
                <th className="px-6 py-4">Confidence</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4">Thời gian gửi</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => {
                const point = floodPoints.find((item) => item.id === report.floodPointId)
                return (
                  <tr key={report.id} className="border-t border-slate-100 align-top">
                    <td className="px-6 py-4 font-medium text-ink">{report.reporter.name}</td>
                    <td className="px-6 py-4 text-slate-600">{point?.name ?? 'Điểm mới từ cộng đồng'}</td>
                    <td className="px-6 py-4">
                      <SeverityBadge severity={report.severity} />
                    </td>
                    <td className="px-6 py-4 text-slate-700">{point?.confidence ?? 61}%</td>
                    <td className="px-6 py-4">
                      <ReportStatusPill status={report.status} />
                    </td>
                    <td className="px-6 py-4 text-slate-500">{formatDateTime(report.submittedAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Button variant="secondary" className="h-10 px-4 text-xs">
                          Xem chi tiết
                        </Button>
                        <Button
                          className="h-10 px-4 text-xs"
                          onClick={() => {
                            verifyReport(report.id)
                            toast.success('Đã xác minh báo cáo')
                          }}
                        >
                          Xác minh
                        </Button>
                        <Button
                          variant="danger"
                          className="h-10 px-4 text-xs"
                          onClick={() => {
                            rejectReport(report.id)
                            toast.success('Đã vô hiệu hóa báo cáo')
                          }}
                        >
                          Vô hiệu hóa
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
