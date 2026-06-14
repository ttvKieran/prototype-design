import type { FloodSeverity, FloodStatus, ReportStatus } from '../types'

export const severityMeta: Record<
  FloodSeverity,
  { label: string; color: string; soft: string }
> = {
  light: {
    label: 'Ngập nhẹ',
    color: 'bg-emerald-500 text-white',
    soft: 'bg-emerald-50 text-emerald-700',
  },
  medium: {
    label: 'Ngập trung bình',
    color: 'bg-amber-500 text-white',
    soft: 'bg-amber-50 text-amber-700',
  },
  heavy: {
    label: 'Ngập nặng',
    color: 'bg-rose-600 text-white',
    soft: 'bg-rose-50 text-rose-700',
  },
}

export const floodStatusMeta: Record<
  FloodStatus,
  { label: string; className: string }
> = {
  unverified: {
    label: 'Chưa xác minh',
    className: 'bg-slate-100 text-slate-700',
  },
  verified: {
    label: 'Đã xác minh',
    className: 'bg-cyan-50 text-cyan-700',
  },
  resolved: {
    label: 'Đã hết ngập',
    className: 'bg-emerald-50 text-emerald-700',
  },
}

export const reportStatusMeta: Record<
  ReportStatus,
  { label: string; className: string }
> = {
  pending: {
    label: 'Chờ xử lý',
    className: 'bg-amber-50 text-amber-700',
  },
  verified: {
    label: 'Đã xác minh',
    className: 'bg-cyan-50 text-cyan-700',
  },
  rejected: {
    label: 'Bị từ chối',
    className: 'bg-rose-50 text-rose-700',
  },
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function formatShortDate(value: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
  }).format(new Date(value))
}
