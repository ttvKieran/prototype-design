import { Link } from 'react-router-dom'
import { CircleMarker, MapContainer, Popup, TileLayer, Polyline } from 'react-leaflet'
import type { FloodPoint, SafeRoute } from '../../types'
import { severityMeta } from '../../utils/format'
import { Button } from '../common/Button'
import { FloodStatusPill } from '../common/StatusPill'

const severityColor = {
  light: '#10b981',
  medium: '#f59e0b',
  heavy: '#e11d48',
}

export function MapView({
  floodPoints,
  selectedId,
  route,
  currentPosition,
  showRouteEndpoints = false,
  height = 'h-[58vh]',
}: {
  floodPoints: FloodPoint[]
  selectedId?: string
  route?: SafeRoute
  currentPosition?: [number, number]
  showRouteEndpoints?: boolean
  height?: string
}) {
  return (
    <MapContainer center={[21.0285, 105.8342]} zoom={12} scrollWheelZoom className={`${height} w-full`}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {floodPoints.map((point) => (
        <CircleMarker
          key={point.id}
          center={[point.lat, point.lng]}
          radius={selectedId === point.id ? 14 : 10}
          pathOptions={{
            color: severityColor[point.severity],
            fillColor: severityColor[point.severity],
            fillOpacity: point.status === 'resolved' ? 0.35 : 0.8,
            weight: selectedId === point.id ? 4 : 2,
          }}
        >
          <Popup minWidth={260}>
            <div className="space-y-3">
              <img src={point.image} alt={point.name} className="h-32 w-full rounded-2xl object-cover" />
              <div className="flex flex-wrap gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${severityMeta[point.severity].color}`}>
                  {severityMeta[point.severity].label}
                </span>
                <FloodStatusPill status={point.status} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-ink">{point.name}</h3>
                <p className="text-sm text-slate-500">{point.address}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-slate-50 p-3">
                  <div className="text-slate-500">Confidence</div>
                  <div className="font-semibold text-ink">{point.confidence}%</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <div className="text-slate-500">Xác nhận</div>
                  <div className="font-semibold text-ink">{point.confirmations}</div>
                </div>
              </div>
              <Link to={`/flood-points/${point.id}`}>
                <Button fullWidth>Xem chi tiết</Button>
              </Link>
            </div>
          </Popup>
        </CircleMarker>
      ))}
      {route && (
        <Polyline positions={route.path} pathOptions={{ color: '#0ea5e9', weight: 5, opacity: 0.85 }} />
      )}
      {route && showRouteEndpoints && (
        <>
          <CircleMarker
            center={route.path[0]}
            radius={10}
            pathOptions={{ color: '#0f766e', fillColor: '#14b8a6', fillOpacity: 0.95, weight: 3 }}
          >
            <Popup>Điểm bắt đầu</Popup>
          </CircleMarker>
          <CircleMarker
            center={route.path[route.path.length - 1]}
            radius={10}
            pathOptions={{ color: '#1d4ed8', fillColor: '#3b82f6', fillOpacity: 0.95, weight: 3 }}
          >
            <Popup>Điểm đến</Popup>
          </CircleMarker>
        </>
      )}
      {currentPosition && (
        <CircleMarker
          center={currentPosition}
          radius={11}
          pathOptions={{ color: '#0369a1', fillColor: '#38bdf8', fillOpacity: 1, weight: 4 }}
        >
          <Popup>Vị trí hiện tại của bạn</Popup>
        </CircleMarker>
      )}
    </MapContainer>
  )
}
