import { Activity, BadgeCheck, ClockAlert, UsersRound } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Area, AreaChart } from 'recharts'
import { MetricCard } from '../../components/common/MetricCard'
import { ReportStatusPill } from '../../components/common/StatusPill'
import { dailyReportStats, severityStats } from '../../data/mockData'
import { useAppState } from '../../hooks/useAppState'
import { formatDateTime } from '../../utils/format'

export function AdminDashboardPage() {
  const { floodPoints, reports } = useAppState()

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Tổng điểm ngập" value={`${floodPoints.length}`} detail="Bao gồm mọi điểm đang theo dõi trong hệ thống." icon={<Activity size={20} />} />
        <MetricCard label="Đã xác minh" value={`${floodPoints.filter((item) => item.status === 'verified').length}`} detail="Điểm ngập đã đạt ngưỡng kiểm chứng." icon={<BadgeCheck size={20} />} />
        <MetricCard label="Chờ xử lý" value={`${reports.filter((item) => item.status === 'pending').length}`} detail="Báo cáo cần admin xem xét hoặc xác minh thêm." icon={<ClockAlert size={20} />} />
        <MetricCard label="Người dùng hoạt động" value="1,248" detail="Người dùng tương tác trong 7 ngày gần nhất." icon={<UsersRound size={20} />} />
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.2fr,0.8fr]">
        <div className="panel p-6">
          <h3 className="text-lg font-semibold text-ink">Báo cáo theo ngày</h3>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyReportStats}>
                <defs>
                  <linearGradient id="reportGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.08} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Area type="monotone" dataKey="reports" stroke="#0284c7" fill="url(#reportGradient)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="panel p-6">
          <h3 className="text-lg font-semibold text-ink">Tỷ lệ mức độ ngập</h3>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={severityStats} dataKey="value" innerRadius={70} outerRadius={100} paddingAngle={4}>
                  {severityStats.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="panel overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-5">
          <h3 className="text-lg font-semibold text-ink">Báo cáo mới nhất</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4">Người gửi</th>
                <th className="px-6 py-4">Mô tả</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4">Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {reports.slice(0, 5).map((report) => (
                <tr key={report.id} className="border-t border-slate-100">
                  <td className="px-6 py-4 font-medium text-ink">{report.reporter.name}</td>
                  <td className="px-6 py-4 text-slate-600">{report.description}</td>
                  <td className="px-6 py-4">
                    <ReportStatusPill status={report.status} />
                  </td>
                  <td className="px-6 py-4 text-slate-500">{formatDateTime(report.submittedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
