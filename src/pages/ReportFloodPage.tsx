import { Crosshair, LocateFixed } from 'lucide-react'
import { useState } from 'react'
import { MapContainer, TileLayer, useMapEvents, CircleMarker } from 'react-leaflet'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '../components/common/Button'
import { useAppState } from '../hooks/useAppState'
import type { FloodSeverity } from '../types'

function MapSelector({
  position,
  onChange,
}: {
  position: [number, number]
  onChange: (pos: [number, number]) => void
}) {
  useMapEvents({
    click(event) {
      onChange([event.latlng.lat, event.latlng.lng])
    },
  })

  return <CircleMarker center={position} radius={10} pathOptions={{ color: '#0ea5e9', fillColor: '#0ea5e9', fillOpacity: 0.85 }} />
}

export function ReportFloodPage() {
  const navigate = useNavigate()
  const { submitReport } = useAppState()
  const [severity, setSeverity] = useState<FloodSeverity>('medium')
  const [position, setPosition] = useState<[number, number]>([21.0278, 105.8342])
  const [showGpsPrompt, setShowGpsPrompt] = useState(false)
  const [usingCurrentLocation, setUsingCurrentLocation] = useState(false)
  const [image, setImage] = useState('https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1000&q=80')
  const [form, setForm] = useState({
    address: 'Phố Hàng Bài, Hoàn Kiếm',
    description: '',
  })

  const confirmGps = () => {
    setShowGpsPrompt(false)
    setUsingCurrentLocation(true)
    setPosition([21.02814, 105.83655])
    setForm((prev) => ({
      ...prev,
      address: 'Vị trí hiện tại của bạn, khu vực trung tâm Hà Nội',
    }))
    toast.success('Đã bật GPS giả lập và lấy vị trí hiện tại')
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr,1.05fr]">
      <section className="panel p-6">
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">Mức độ ngập</label>
            <select className="field" value={severity} onChange={(e) => setSeverity(e.target.value as FloodSeverity)}>
              <option value="light">Ngập nhẹ</option>
              <option value="medium">Ngập trung bình</option>
              <option value="heavy">Ngập nặng</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">Địa chỉ</label>
            <input className="field" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Button variant="secondary" onClick={() => setShowGpsPrompt(true)}>
                <LocateFixed size={17} className="mr-2" />
                Chọn vị trí hiện tại
              </Button>
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                {usingCurrentLocation ? 'GPS đã sẵn sàng' : 'Chưa bật GPS'}
              </div>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">Mô tả</label>
            <textarea
              className="min-h-32 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
              placeholder="Ví dụ: nước ngập gần nửa bánh xe máy, xe con đi chậm, khu vực đang mưa to..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">Ảnh minh chứng (URL demo)</label>
            <input className="field" value={image} onChange={(e) => setImage(e.target.value)} />
          </div>
          <Button
            fullWidth
            onClick={() => {
              const pointId = submitReport({
                ...form,
                severity,
                lat: position[0],
                lng: position[1],
                description: form.description || 'Báo cáo ngập mới từ người dùng.',
                image,
              })
              toast.success('Đã gửi báo cáo thành công')
              navigate(`/flood-points/${pointId}`)
            }}
          >
            Gửi báo cáo ngập
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-brand-600">Map Picker</p>
          <h1 className="mt-2 text-3xl font-bold text-ink">Chọn vị trí trực tiếp trên bản đồ</h1>
        </div>
        <div className="panel overflow-hidden p-3">
          <MapContainer center={position} zoom={13} scrollWheelZoom className="h-[58vh] w-full">
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapSelector position={position} onChange={setPosition} />
          </MapContainer>
        </div>
        <div className="grid gap-4 md:grid-cols-[240px,1fr]">
          <img src={image} alt="Preview" className="panel h-44 w-full object-cover p-2" />
          <div className="panel p-5">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Crosshair size={16} />
              Tọa độ đã chọn
            </div>
            <div className="mt-2 text-xl font-semibold text-ink">
              {position[0].toFixed(5)}, {position[1].toFixed(5)}
            </div>
            <div className="mt-3 rounded-2xl bg-brand-50 px-4 py-3 text-sm text-brand-900">
              {usingCurrentLocation
                ? 'Điểm báo cáo đang bám theo vị trí hiện tại của bạn.'
                : 'Bạn có thể chạm trực tiếp lên bản đồ hoặc dùng GPS giả lập để chọn nhanh.'}
            </div>
          </div>
        </div>
      </section>
      {showGpsPrompt && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-slate-950/45 px-4">
          <div className="panel max-w-md p-6">
            <div className="mb-4 inline-flex rounded-2xl bg-brand-50 p-3 text-brand-700">
              <LocateFixed size={22} />
            </div>
            <h2 className="text-2xl font-bold text-ink">Bật vị trí hiện tại?</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Ứng dụng muốn truy cập GPS để tự động điền điểm báo cáo gần vị trí của bạn. Đây là popup giả lập cho bản demo frontend.
            </p>
            <div className="mt-6 flex gap-3">
              <Button variant="secondary" fullWidth onClick={() => setShowGpsPrompt(false)}>
                Để sau
              </Button>
              <Button fullWidth onClick={confirmGps}>
                Cho phép
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
