import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  LocateFixed,
  Navigation,
  Route as RouteIcon,
  ShieldCheck,
  Waves,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '../components/common/Button'
import { MapView } from '../components/map/MapView'
import { useAppState } from '../hooks/useAppState'

export function SafeRoutePage() {
  const { floodPoints, safeRoutes } = useAppState()
  const [route] = useState(safeRoutes[0])
  const [origin, setOrigin] = useState(route.origin)
  const [destination, setDestination] = useState(route.destination)
  const [showGpsPrompt, setShowGpsPrompt] = useState(false)
  const [usingCurrentLocation, setUsingCurrentLocation] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const [navigationStep, setNavigationStep] = useState(0)
  const [isPlannerOpen, setIsPlannerOpen] = useState(false)
  const [isInsightsOpen, setIsInsightsOpen] = useState(false)
  const [routeReady, setRouteReady] = useState(true)
  const arrivalToastShownRef = useRef(false)

  const currentPosition = useMemo<[number, number]>(() => {
    if (!usingCurrentLocation && !isNavigating) {
      return route.path[0]
    }

    const index = Math.min(navigationStep, route.path.length - 1)
    return route.path[index]
  }, [isNavigating, navigationStep, route.path, usingCurrentLocation])

  const remainingDistanceKm = useMemo(() => {
    const segments = route.path.length - 1
    const remainingSegments = Math.max(segments - navigationStep, 0)
    return ((route.distanceKm / segments) * remainingSegments).toFixed(1)
  }, [navigationStep, route.distanceKm, route.path.length])

  const currentInstruction = useMemo(() => {
    const instructions = [
      'Rời điểm xuất phát và đi thẳng 400 m theo tuyến đã điều chỉnh.',
      'Giữ bên phải để tránh cụm ngập gần Phạm Văn Đồng.',
      'Tiếp tục thẳng 1,2 km, hệ thống đang né điểm ngập nặng phía trước.',
      'Rẽ nhẹ trái theo hướng trung tâm để giữ khoảng cách an toàn với điểm ngập.',
      'Tiếp tục đi thẳng, điểm đến ở phía trước khoảng 300 m.',
    ]

    return instructions[Math.min(navigationStep, instructions.length - 1)]
  }, [navigationStep])

  const hasArrived = isNavigating && navigationStep >= route.path.length - 1

  useEffect(() => {
    if (!isNavigating) return

    if (navigationStep >= route.path.length - 1) {
      if (!arrivalToastShownRef.current) {
        toast.success('Bạn đã tới nơi. Lộ trình an toàn đã hoàn tất.')
        arrivalToastShownRef.current = true
      }
      return
    }

    const timer = window.setTimeout(() => {
      setNavigationStep((step) => step + 1)
    }, 1800)

    return () => window.clearTimeout(timer)
  }, [isNavigating, navigationStep, route.path.length])

  const progress = ((navigationStep + 1) / route.path.length) * 100

  const handleUseCurrentLocation = () => {
    setShowGpsPrompt(true)
  }

  const confirmGps = () => {
    setShowGpsPrompt(false)
    setUsingCurrentLocation(true)
    setNavigationStep(0)
    setOrigin('Vị trí hiện tại của bạn')
    setIsPlannerOpen(true)
    toast.success('Đã bật GPS giả lập và lấy vị trí hiện tại')
  }

  const handleSearchRoute = () => {
    setRouteReady(true)
    setIsPlannerOpen(false)
    toast.success('Đã cập nhật tuyến đường an toàn')
  }

  const handleStartNavigation = () => {
    if (!usingCurrentLocation) {
      toast.warning('Hãy bật vị trí hiện tại trước khi bắt đầu dẫn đường')
      return
    }

    setIsNavigating(true)
    arrivalToastShownRef.current = false
    setNavigationStep(0)
    toast.success('Bắt đầu dẫn đường tránh ngập')
  }

  return (
    <>
      <div className="space-y-5">
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setIsPlannerOpen((open) => !open)}
            className="panel w-full p-4 text-left"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="text-xs font-semibold uppercase tracking-[0.26em] text-brand-600">Tuyến tránh ngập</div>
                <div className="mt-2 truncate text-lg font-semibold text-ink">
                  {origin} <span className="text-slate-400">→</span> {destination}
                </div>
                <div className="mt-1 text-sm text-slate-500">
                  {route.distanceKm} km • tránh {route.avoidedFloodPoints} điểm ngập
                </div>
              </div>
              {isPlannerOpen ? <ChevronUp className="text-slate-500" size={18} /> : <ChevronDown className="text-slate-500" size={18} />}
            </div>
          </button>

          {isPlannerOpen && (
            <section className="panel space-y-4 p-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">Điểm bắt đầu</label>
                <input className="field" value={origin} readOnly />
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <Button variant="secondary" onClick={handleUseCurrentLocation}>
                    <LocateFixed size={17} className="mr-2" />
                    Chọn vị trí hiện tại
                  </Button>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    {usingCurrentLocation ? 'GPS đã sẵn sàng' : 'Chưa bật GPS'}
                  </div>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">Điểm đến</label>
                <input
                  className="field"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchRoute()
                    }
                  }}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Button fullWidth onClick={handleSearchRoute}>
                  <ShieldCheck size={17} className="mr-2" />
                  Tìm đường an toàn
                </Button>
                <Button variant="secondary" fullWidth onClick={handleStartNavigation}>
                  <Navigation size={17} className="mr-2" />
                  Bắt đầu di chuyển
                </Button>
              </div>
            </section>
          )}

          <div className="panel overflow-hidden p-3">
            <MapView
              floodPoints={floodPoints}
              route={routeReady ? route : undefined}
              currentPosition={currentPosition}
              showRouteEndpoints={routeReady}
              height="h-[64vh]"
            />
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setIsInsightsOpen((open) => !open)}>
              <RouteIcon size={17} className="mr-2" />
              {isInsightsOpen ? 'Ẩn chi tiết lộ trình' : 'Xem chi tiết lộ trình'}
            </Button>
            <Button className="flex-1" onClick={handleStartNavigation}>
              <Navigation size={17} className="mr-2" />
              Bắt đầu di chuyển
            </Button>
          </div>

          {isInsightsOpen && (
            <section className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="panel p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <RouteIcon size={16} />
                    Tổng quãng đường
                  </div>
                  <div className="mt-2 text-3xl font-bold text-ink">{route.distanceKm} km</div>
                </div>
                <div className="panel p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Navigation size={16} />
                    Điểm ngập đã tránh
                  </div>
                  <div className="mt-2 text-3xl font-bold text-ink">{route.avoidedFloodPoints}</div>
                </div>
                <div className="panel p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Waves size={16} />
                    Vị trí hiện tại
                  </div>
                  <div className="mt-2 text-sm font-medium text-slate-700">
                    {usingCurrentLocation
                      ? `${currentPosition[0].toFixed(5)}, ${currentPosition[1].toFixed(5)}`
                      : 'Chưa lấy vị trí hiện tại'}
                  </div>
                </div>
              </div>
              <div className="panel bg-amber-50 p-5 text-amber-900">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <AlertTriangle size={16} />
                  Cảnh báo tuyến
                </div>
                <p className="mt-2 text-sm leading-6">{route.message}</p>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                {route.alerts.map((alert) => {
                  const point = floodPoints.find((item) => item.id === alert.floodPointId)
                  if (!point) return null
                  return (
                    <div key={alert.floodPointId} className="panel p-5">
                      <div className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">Điểm gần tuyến</div>
                      <h3 className="mt-2 text-lg font-semibold text-ink">{point.name}</h3>
                      <p className="mt-2 text-sm text-slate-500">{alert.message}</p>
                      <div className="mt-3 text-sm font-medium text-slate-700">Khoảng cách: {alert.distanceM} m</div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}
        </div>
      </div>
      {showGpsPrompt && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-slate-950/45 px-4">
          <div className="panel max-w-md p-6">
            <div className="mb-4 inline-flex rounded-2xl bg-brand-50 p-3 text-brand-700">
              <LocateFixed size={22} />
            </div>
            <h2 className="text-2xl font-bold text-ink">Bật vị trí hiện tại?</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Ứng dụng muốn truy cập GPS để xác định điểm bắt đầu và mô phỏng di chuyển theo lộ trình an toàn. Đây là popup giả lập cho bản demo.
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
      {isNavigating && (
        <div className="fixed inset-0 z-[1300] bg-slate-950">
          <MapView
            floodPoints={floodPoints}
            route={route}
            currentPosition={currentPosition}
            showRouteEndpoints
            height="h-screen"
          />
          <div className="pointer-events-none fixed inset-x-0 top-0 z-[1301] p-4">
            <div className="mx-auto flex max-w-3xl items-start justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsNavigating(false)
                  arrivalToastShownRef.current = false
                }}
                className="pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-slate-950/72 text-white backdrop-blur"
              >
                <X size={18} />
              </button>
              <div className="pointer-events-auto rounded-[28px] border border-white/15 bg-slate-950/72 px-5 py-4 text-right text-white backdrop-blur">
                <div className="text-xs uppercase tracking-[0.24em] text-cyan-200">Còn lại</div>
                <div className="mt-1 text-3xl font-bold">{remainingDistanceKm} km</div>
              </div>
            </div>
          </div>
          <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[1301] p-4">
            <div className="mx-auto max-w-3xl rounded-[32px] border border-white/15 bg-white/96 p-5 shadow-soft">
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-600">Hướng dẫn đi</div>
              <div className="mt-2 text-xl font-bold text-ink">
                {hasArrived ? 'Bạn đã đến nơi. Xác nhận để kết thúc điều hướng.' : currentInstruction}
              </div>
              <div className="mt-4 h-2 rounded-full bg-slate-200">
                <div className="h-2 rounded-full bg-brand-500 transition-all duration-700" style={{ width: `${progress}%` }} />
              </div>
              {hasArrived && (
                <div className="pointer-events-auto mt-4">
                  <Button
                    fullWidth
                    onClick={() => {
                      setIsNavigating(false)
                      arrivalToastShownRef.current = false
                      toast.success('Đã hoàn thành lộ trình và thoát điều hướng')
                    }}
                  >
                    Hoàn thành lộ trình
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
