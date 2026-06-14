import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

export function BottomSheet({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}) {
  return (
    <>
      <button
        type="button"
        aria-label="Đóng danh sách điểm ngập"
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-[998] bg-slate-950/25 transition md:hidden',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
      />
      <div
        className={cn(
          'fixed inset-x-0 bottom-0 z-[999] flex max-h-[72vh] flex-col rounded-t-[28px] border border-slate-200 bg-white p-4 shadow-soft transition md:hidden',
          open ? 'translate-y-0' : 'translate-y-full',
        )}
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-slate-200" />
            <p className="text-sm font-semibold text-ink">{title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600"
          >
            <X size={18} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-6 [touch-action:pan-y]">
          {children}
        </div>
      </div>
    </>
  )
}
