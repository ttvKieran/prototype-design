import { SlidersHorizontal } from 'lucide-react'
import type { FloodSeverity, FloodStatus } from '../../types'

interface FilterValue {
  severity: FloodSeverity | 'all'
  status: FloodStatus | 'all'
  sort: 'latest' | 'confidence'
}

export function FloodFilters({
  value,
  onChange,
}: {
  value: FilterValue
  onChange: (next: FilterValue) => void
}) {
  return (
    <div className="panel p-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600">
          <SlidersHorizontal size={16} />
          Bộ lọc
        </div>
        <select
          className="h-10 rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-brand-400"
          value={value.severity}
          onChange={(e) => onChange({ ...value, severity: e.target.value as FilterValue['severity'] })}
        >
          <option value="all">Mức ngập</option>
          <option value="light">Ngập nhẹ</option>
          <option value="medium">Ngập trung bình</option>
          <option value="heavy">Ngập nặng</option>
        </select>
        <select
          className="h-10 rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-brand-400"
          value={value.status}
          onChange={(e) => onChange({ ...value, status: e.target.value as FilterValue['status'] })}
        >
          <option value="all">Trạng thái</option>
          <option value="unverified">Chưa xác minh</option>
          <option value="verified">Đã xác minh</option>
          <option value="resolved">Đã hết ngập</option>
        </select>
        <select
          className="h-10 rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-brand-400"
          value={value.sort}
          onChange={(e) => onChange({ ...value, sort: e.target.value as FilterValue['sort'] })}
        >
          <option value="latest">Mới nhất</option>
          <option value="confidence">Confidence</option>
        </select>
      </div>
    </div>
  )
}
