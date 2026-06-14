import type { FloodStatus, ReportStatus } from '../../types'
import { cn } from '../../utils/cn'
import { floodStatusMeta, reportStatusMeta } from '../../utils/format'

export function FloodStatusPill({ status }: { status: FloodStatus }) {
  const meta = floodStatusMeta[status]
  return <span className={cn('rounded-full px-3 py-1 text-xs font-semibold', meta.className)}>{meta.label}</span>
}

export function ReportStatusPill({ status }: { status: ReportStatus }) {
  const meta = reportStatusMeta[status]
  return <span className={cn('rounded-full px-3 py-1 text-xs font-semibold', meta.className)}>{meta.label}</span>
}
