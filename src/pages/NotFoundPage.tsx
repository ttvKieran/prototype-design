import { Link } from 'react-router-dom'
import { Button } from '../components/common/Button'

export function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="panel max-w-lg p-8 text-center">
        <div className="text-sm uppercase tracking-[0.32em] text-brand-600">404</div>
        <h1 className="mt-3 text-4xl font-bold text-ink">Không tìm thấy trang</h1>
        <p className="mt-3 text-slate-500">Đường dẫn không tồn tại trong bản demo frontend này.</p>
        <Link to="/" className="mt-6 inline-block">
          <Button>Quay về trang chủ</Button>
        </Link>
      </div>
    </div>
  )
}
