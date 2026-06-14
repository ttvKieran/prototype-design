import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '../../components/common/Button'
import { useAppState } from '../../hooks/useAppState'
import { formatDateTime } from '../../utils/format'

export function SystemConfigPage() {
  const { systemConfig, systemConfigLogs, updateSystemConfig } = useAppState()
  const [form, setForm] = useState(systemConfig)

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr,1.05fr]">
      <section className="panel p-6">
        <h2 className="text-2xl font-bold text-ink">Cấu hình hệ thống</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {Object.entries(form).map(([key, value]) => (
            <label key={key} className="block">
              <span className="mb-2 block text-sm font-medium capitalize text-slate-600">{key}</span>
              {typeof value === 'boolean' ? (
                <select
                  className="field"
                  value={value ? 'true' : 'false'}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value === 'true' })}
                >
                  <option value="true">true</option>
                  <option value="false">false</option>
                </select>
              ) : (
                <input
                  className="field"
                  type="number"
                  step="0.01"
                  value={value}
                  onChange={(e) => setForm({ ...form, [key]: Number(e.target.value) })}
                />
              )}
            </label>
          ))}
        </div>
        <div className="mt-6">
          <Button
            onClick={() => {
              updateSystemConfig(form)
              toast.success('Đã lưu cấu hình hệ thống')
            }}
          >
            Lưu cấu hình
          </Button>
        </div>
      </section>

      <section className="panel overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-2xl font-bold text-ink">SystemConfigLog</h2>
        </div>
        <div className="space-y-4 p-6">
          {systemConfigLogs.map((log) => (
            <div key={log.id} className="rounded-[24px] border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="font-semibold text-ink">{log.changedBy}</div>
                <div className="text-xs text-slate-500">{formatDateTime(log.changedAt)}</div>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{log.summary}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
