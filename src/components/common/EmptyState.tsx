export function EmptyState({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="panel flex min-h-48 flex-col items-center justify-center p-8 text-center">
      <div className="mb-4 rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">Chưa có dữ liệu</div>
      <h3 className="text-xl font-semibold text-ink">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-slate-500">{description}</p>
    </div>
  )
}
