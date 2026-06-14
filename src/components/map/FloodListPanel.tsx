import { Link } from 'react-router-dom'
import type { FloodPoint } from '../../types'
import { formatDateTime } from '../../utils/format'
import { Button } from '../common/Button'
import { SeverityBadge } from '../common/SeverityBadge'
import { FloodStatusPill } from '../common/StatusPill'

export function FloodListPanel({
  points,
  selectedId,
  onSelect,
}: {
  points: FloodPoint[]
  selectedId?: string
  onSelect: (id: string) => void
}) {
  return (
    <div className="space-y-3">
      {points.map((point) => (
        <button
          key={point.id}
          type="button"
          onClick={() => onSelect(point.id)}
          className={`w-full rounded-[24px] border p-4 text-left transition ${selectedId === point.id ? 'border-brand-300 bg-brand-50/60' : 'border-slate-200 bg-white hover:border-brand-200'}`}
        >
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <SeverityBadge severity={point.severity} />
            <FloodStatusPill status={point.status} />
          </div>
          <h3 className="text-base font-semibold text-ink">{point.name}</h3>
          <p className="mt-1 text-sm text-slate-500">{point.address}</p>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700">Confidence {point.confidence}%</span>
            <span className="text-slate-500">{formatDateTime(point.updatedAt)}</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-slate-500">{point.confirmations} lượt xác nhận</span>
            <Link to={`/flood-points/${point.id}`} onClick={(event) => event.stopPropagation()}>
              <Button variant="secondary" className="h-10 px-4 text-xs">
                Xem chi tiết
              </Button>
            </Link>
          </div>
        </button>
      ))}
    </div>
  )
}
