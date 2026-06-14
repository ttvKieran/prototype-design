import { CloudRainWind, MapPinned, ShieldAlert, Waypoints } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/common/Button'
import { MetricCard } from '../components/common/MetricCard'
import { useAppState } from '../hooks/useAppState'

const features = [
  {
    icon: MapPinned,
    title: 'Bản đồ ngập thời gian thực',
    description: 'Theo dõi điểm ngập theo khu vực, trạng thái xác minh và mức độ nguy hiểm ngay trên bản đồ Hà Nội.',
  },
  {
    icon: CloudRainWind,
    title: 'Báo cáo cộng đồng',
    description: 'Người dân gửi hình ảnh minh chứng và vị trí ngập chỉ trong vài thao tác, tối ưu cho mobile WebView.',
  },
  {
    icon: Waypoints,
    title: 'Tìm đường tránh ngập',
    description: 'Mô phỏng tuyến đường an toàn, highlight điểm ngập gần lộ trình và cảnh báo khi đi vào vùng rủi ro.',
  },
  {
    icon: ShieldAlert,
    title: 'Cảnh báo hành trình',
    description: 'Phát thông báo khi người dùng di chuyển gần điểm ngập nặng đã xác minh bởi cộng đồng hoặc quản trị viên.',
  },
]

export function LandingPage() {
  const { floodPoints, reports } = useAppState()
  const activeFloods = floodPoints.filter((item) => item.status !== 'resolved').length

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[36px] bg-rain-grid px-6 py-8 text-white sm:px-8 lg:px-12 lg:py-12">
        <div className="grid items-center gap-8 lg:grid-cols-[1.15fr,0.85fr]">
          <div>
            <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-brand-100">
              Nền tảng hỗ trợ giám sát ngập lụt mùa mưa lũ tại Hà Nội
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">
              Quan sát ngập lụt theo thời gian thực, điều hướng an toàn và phối hợp xác minh cộng đồng.
            </h1>
            <p className="mt-5 max-w-2xl text-base text-slate-200 sm:text-lg">
              Giao diện demo được thiết kế cho báo cáo đồ án và vận hành thử nghiệm: bản đồ lớn, dữ liệu trực quan, hành vi mobile rõ ràng và cụm admin riêng.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/map">
                <Button className="w-full sm:w-auto">Xem bản đồ ngập</Button>
              </Link>
              <Link to="/report">
                <Button variant="ghost" className="w-full sm:w-auto">
                  Báo cáo điểm ngập
                </Button>
              </Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <MetricCard label="Điểm ngập đang hoạt động" value={`${activeFloods}`} detail="Tổng hợp từ cộng đồng và admin xác minh." icon={<MapPinned size={20} />} />
            <MetricCard label="Báo cáo hôm nay" value={`${reports.length}`} detail="Bao gồm chờ xử lý, đã xác minh và bị từ chối." icon={<CloudRainWind size={20} />} />
            <MetricCard label="Cảnh báo lộ trình" value="06" detail="Các cảnh báo gần tuyến đường trên thiết bị di động." icon={<ShieldAlert size={20} />} />
            <MetricCard label="Tỷ lệ xác minh" value="84%" detail="Tỷ lệ báo cáo được cộng đồng hoặc admin xác nhận." icon={<Waypoints size={20} />} />
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {features.map(({ icon: Icon, title, description }) => (
          <article key={title} className="panel p-6">
            <div className="mb-4 inline-flex rounded-2xl bg-brand-50 p-3 text-brand-700">
              <Icon size={22} />
            </div>
            <h2 className="text-xl font-semibold text-ink">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
          </article>
        ))}
      </section>
    </div>
  )
}
