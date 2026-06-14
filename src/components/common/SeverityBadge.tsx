import type { FloodSeverity } from '../../types'
import { cn } from '../../utils/cn'
import { severityMeta } from '../../utils/format'

export function SeverityBadge({ severity }: { severity: FloodSeverity }) {
  const meta = severityMeta[severity]
  return <span className={cn('rounded-full px-3 py-1 text-xs font-semibold', meta.soft)}>{meta.label}</span>
}
