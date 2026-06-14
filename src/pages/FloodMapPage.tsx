import { ListFilter } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button } from '../components/common/Button'
import { BottomSheet } from '../components/common/BottomSheet'
import { FloodFilters } from '../components/map/FloodFilters'
import { FloodListPanel } from '../components/map/FloodListPanel'
import { MapView } from '../components/map/MapView'
import { useAppState } from '../hooks/useAppState'

export function FloodMapPage() {
  const { floodPoints } = useAppState()
  const [selectedId, setSelectedId] = useState<string | undefined>(floodPoints[0]?.id)
  const [isMobileListOpen, setIsMobileListOpen] = useState(false)
  const [filters, setFilters] = useState<{
    severity: 'all' | 'light' | 'medium' | 'heavy'
    status: 'all' | 'unverified' | 'verified' | 'resolved'
    sort: 'latest' | 'confidence'
  }>({
    severity: 'all',
    status: 'all',
    sort: 'latest',
  })

  const filteredPoints = useMemo(() => {
    return [...floodPoints]
      .filter((point) => (filters.severity === 'all' ? true : point.severity === filters.severity))
      .filter((point) => (filters.status === 'all' ? true : point.status === filters.status))
      .sort((a, b) => {
        if (filters.sort === 'confidence') {
          return b.confidence - a.confidence
        }

        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      })
  }, [filters, floodPoints])

  return (
    <div className="space-y-5 pb-28 md:pb-0">
      <FloodFilters value={filters} onChange={setFilters} />
      <div className="md:hidden">
        <Button variant="secondary" fullWidth onClick={() => setIsMobileListOpen(true)}>
          <ListFilter size={17} className="mr-2" />
          Mở danh sách điểm ngập
        </Button>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1fr,360px]">
        <MapView floodPoints={filteredPoints} selectedId={selectedId} height="h-[68vh]" />
        <aside className="panel hidden max-h-[68vh] overflow-y-auto p-4 lg:block">
          <FloodListPanel points={filteredPoints} selectedId={selectedId} onSelect={setSelectedId} />
        </aside>
      </div>
      <BottomSheet open={isMobileListOpen} onClose={() => setIsMobileListOpen(false)} title="Danh sách điểm ngập">
        <FloodListPanel
          points={filteredPoints}
          selectedId={selectedId}
          onSelect={(id) => {
            setSelectedId(id)
            setIsMobileListOpen(false)
          }}
        />
      </BottomSheet>
    </div>
  )
}
