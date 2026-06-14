import type { ReactNode } from 'react'

export function MetricCard({
  label,
  value,
  detail,
  icon,
}: {
  label: string
  value: string
  detail: string
  icon: ReactNode
}) {
  return (
    <div className="panel p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-slate-500">{label}</span>
        <div className="rounded-2xl bg-brand-50 p-3 text-brand-700">{icon}</div>
      </div>
      <div className="text-3xl font-bold text-ink">{value}</div>
      <p className="mt-2 text-sm text-slate-500">{detail}</p>
    </div>
  )
}
