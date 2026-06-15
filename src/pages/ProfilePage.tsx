import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronUp, MessageCircle, PenLine, Plus, Reply, ShieldCheck } from 'lucide-react'
import { Button } from '../components/common/Button'
import { EmptyState } from '../components/common/EmptyState'
import { FloodStatusPill, ReportStatusPill } from '../components/common/StatusPill'
import { SeverityBadge } from '../components/common/SeverityBadge'
import { useAppState } from '../hooks/useAppState'
import { formatDateTime } from '../utils/format'

type ThreadComment = {
  id: string
  author: string
  text: string
  createdAt: string
  replies?: ThreadComment[]
}

const seededComments: Record<string, ThreadComment[]> = {
  'fp-1': [
    {
      id: 'c-1',
      author: 'Ngọc',
      text: 'Mình vừa đi qua, đoạn này đúng là nên tránh xe máy.',
      createdAt: '2026-06-14T09:02:00+07:00',
      replies: [
        {
          id: 'c-1-r1',
          author: 'Hưng',
          text: 'Chuẩn, xe máy đi vào làn trong còn đỡ hơn.',
          createdAt: '2026-06-14T09:06:00+07:00',
        },
      ],
    },
    {
      id: 'c-2',
      author: 'Tùng',
      text: 'Ai đi hướng Phạm Hùng có thể vòng sớm để đỡ kẹt.',
      createdAt: '2026-06-14T09:10:00+07:00',
    },
  ],
  'fp-2': [
    {
      id: 'c-3',
      author: 'Mai',
      text: 'Đang có thêm người xác nhận, chắc sắp đủ ngưỡng verified.',
      createdAt: '2026-06-14T08:59:00+07:00',
      replies: [
        {
          id: 'c-3-r1',
          author: 'Lan',
          text: 'Mình vừa gửi thêm ảnh, chắc đủ điều kiện rồi.',
          createdAt: '2026-06-14T09:04:00+07:00',
        },
      ],
    },
  ],
}

export function ProfilePage() {
  const { profile, floodPoints, reports } = useAppState()
  const [isEditing, setIsEditing] = useState(false)
  const [draftProfile, setDraftProfile] = useState({
    fullName: profile?.fullName || '',
    phone: profile?.phone || '',
    district: profile?.district || '',
  })
  const [commentsByPoint, setCommentsByPoint] = useState(seededComments)
  const [draftComments, setDraftComments] = useState<Record<string, string>>({})
  const [replyTargets, setReplyTargets] = useState<Record<string, { commentId: string; author: string } | null>>({})
  const [openedThreads, setOpenedThreads] = useState<Record<string, boolean>>({})
  const [openedReplies, setOpenedReplies] = useState<Record<string, Record<string, boolean>>>({})

  if (!profile) return null

  const myFloodPosts = useMemo(
    () =>
      floodPoints
        .filter((point) => point.reporter.id === profile.id)
        .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt)),
    [floodPoints, profile.id],
  )

  function addReplyToTree(comments: ThreadComment[], targetId: string, reply: ThreadComment): ThreadComment[] {
    return comments.map((comment) => {
      if (comment.id === targetId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), reply],
        }
      }

      if (comment.replies?.length) {
        return {
          ...comment,
          replies: addReplyToTree(comment.replies, targetId, reply),
        }
      }

      return comment
    })
  }

  function countComments(comments: ThreadComment[]): number {
    return comments.reduce((total, comment) => total + 1 + countComments(comment.replies || []), 0)
  }

  function submitComment(pointId: string) {
    const content = (draftComments[pointId] || '').trim()
    if (!content) return

    const newComment: ThreadComment = {
      id: `profile-comment-${Date.now()}`,
      author: 'Bạn',
      text: content,
      createdAt: new Date().toISOString(),
    }
    const replyTarget = replyTargets[pointId]

    setCommentsByPoint((prev) => ({
      ...prev,
      [pointId]: replyTarget
        ? addReplyToTree(prev[pointId] || [], replyTarget.commentId, newComment)
        : [...(prev[pointId] || []), newComment],
    }))
    setOpenedThreads((prev) => ({
      ...prev,
      [pointId]: true,
    }))
    if (replyTarget) {
      setOpenedReplies((prev) => ({
        ...prev,
        [pointId]: {
          ...(prev[pointId] || {}),
          [replyTarget.commentId]: true,
        },
      }))
    }
    setDraftComments((prev) => ({
      ...prev,
      [pointId]: '',
    }))
    setReplyTargets((prev) => ({
      ...prev,
      [pointId]: null,
    }))
  }

  function toggleThread(pointId: string) {
    setOpenedThreads((prev) => ({
      ...prev,
      [pointId]: !prev[pointId],
    }))
  }

  function toggleReplies(pointId: string, commentId: string) {
    setOpenedReplies((prev) => ({
      ...prev,
      [pointId]: {
        ...(prev[pointId] || {}),
        [commentId]: !(prev[pointId] || {})[commentId],
      },
    }))
  }

  function renderComment(pointId: string, comment: ThreadComment, depth = 0): React.ReactNode {
    const isNested = depth > 0
    const hasReplies = !!comment.replies?.length
    const isReplyOpen = !!openedReplies[pointId]?.[comment.id]

    return (
      <div
        key={comment.id}
        className={`rounded-2xl border border-slate-100 bg-white px-4 py-3 text-xs text-slate-600 sm:text-sm ${isNested ? 'ml-5 mt-3 border-l-4 border-l-brand-100' : ''}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="mr-2 font-semibold text-ink">{comment.author}</span>
            <span className="text-[11px] text-slate-400 sm:text-xs">{formatDateTime(comment.createdAt)}</span>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            {hasReplies && (
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-100 sm:text-xs"
                onClick={() => toggleReplies(pointId, comment.id)}
              >
                {isReplyOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {isReplyOpen ? 'Ẩn phản hồi' : `Xem ${comment.replies?.length} phản hồi`}
              </button>
            )}
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold text-brand-700 transition hover:bg-brand-50 sm:text-xs"
              onClick={() => {
                setOpenedThreads((prev) => ({
                  ...prev,
                  [pointId]: true,
                }))
                setReplyTargets((prev) => ({
                  ...prev,
                  [pointId]: {
                    commentId: comment.id,
                    author: comment.author,
                  },
                }))
              }}
            >
              <Reply size={14} />
              Trả lời
            </button>
          </div>
        </div>
        <div className="mt-2 leading-6">{comment.text}</div>
        {hasReplies && isReplyOpen && <div className="mt-3 space-y-3">{comment.replies?.map((reply) => renderComment(pointId, reply, depth + 1))}</div>}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="panel p-5 sm:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-center gap-4">
            <img src={profile.avatar} alt={profile.fullName} className="h-16 w-16 rounded-full object-cover sm:h-20 sm:w-20" />
            <div>
              <h1 className="text-2xl font-bold text-ink sm:text-3xl">{profile.fullName}</h1>
              <p className="mt-1 text-sm text-slate-500">{profile.email}</p>
              <p className="mt-1 text-sm text-slate-500">
                {profile.phone} • {profile.district}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/report">
              <Button className="h-11 px-5">
                <Plus size={16} className="mr-2" />
                Tạo báo cáo
              </Button>
            </Link>
            <Button variant="secondary" className="h-11 px-5" onClick={() => setIsEditing((value) => !value)}>
              <PenLine size={16} className="mr-2" />
              {isEditing ? 'Đóng chỉnh sửa' : 'Chỉnh sửa thông tin cá nhân'}
            </Button>
          </div>
        </div>

        <div className="mt-6 rounded-[24px] bg-brand-50 px-5 py-4 text-brand-900">
          <div className="flex items-center gap-2 text-sm font-medium">
            <ShieldCheck size={16} />
            Điểm uy tín cộng đồng
          </div>
          <div className="mt-2 text-2xl font-bold sm:text-3xl">{profile.reputation}/100</div>
        </div>

        {isEditing && (
          <div className="mt-6 grid gap-4 rounded-[28px] border border-slate-100 bg-slate-50/80 p-5 md:grid-cols-2">
            <div>
              <div className="mb-2 text-sm font-semibold text-slate-700">Họ và tên</div>
              <input
                className="field"
                value={draftProfile.fullName}
                onChange={(event) => setDraftProfile((prev) => ({ ...prev, fullName: event.target.value }))}
              />
            </div>
            <div>
              <div className="mb-2 text-sm font-semibold text-slate-700">Số điện thoại</div>
              <input
                className="field"
                value={draftProfile.phone}
                onChange={(event) => setDraftProfile((prev) => ({ ...prev, phone: event.target.value }))}
              />
            </div>
            <div className="md:col-span-2">
              <div className="mb-2 text-sm font-semibold text-slate-700">Khu vực thường theo dõi</div>
              <input
                className="field"
                value={draftProfile.district}
                onChange={(event) => setDraftProfile((prev) => ({ ...prev, district: event.target.value }))}
              />
            </div>
            <div className="flex justify-end gap-3 md:col-span-2">
              <Button variant="secondary" className="h-11 px-5" onClick={() => setIsEditing(false)}>
                Hủy
              </Button>
              <Button className="h-11 px-5" onClick={() => setIsEditing(false)}>
                Lưu tạm
              </Button>
            </div>
          </div>
        )}
      </section>

      <section className="space-y-5">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Bài đăng của tôi</div>
          <h2 className="mt-2 text-xl font-bold text-ink sm:text-2xl">Những điểm ngập bạn đã đăng</h2>
        </div>

        {myFloodPosts.length ? (
          myFloodPosts.map((point) => {
            const linkedReport = reports.find((report) => report.floodPointId === point.id)
            const comments = commentsByPoint[point.id] || []
            const replyTarget = replyTargets[point.id]
            const isThreadOpen = !!openedThreads[point.id]
            const commentCount = countComments(comments)

            return (
              <article key={point.id} className="panel overflow-hidden p-0">
                <div className="p-5 sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img src={point.reporter.avatar} alt={point.reporter.name} className="h-12 w-12 rounded-2xl object-cover sm:h-14 sm:w-14" />
                      <div>
                        <div className="text-sm font-semibold text-ink sm:text-base">{point.reporter.name}</div>
                        <div className="text-xs text-slate-500 sm:text-sm">
                          {point.district} • {formatDateTime(point.updatedAt)}
                        </div>
                      </div>
                    </div>
                    <SeverityBadge severity={point.severity} />
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <FloodStatusPill status={point.status} />
                    {linkedReport && <ReportStatusPill status={linkedReport.status} />}
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {point.waterDepthCm} cm
                    </span>
                  </div>

                  <Link to={`/flood-points/${point.id}`} className="mt-5 block">
                    <h3 className="text-xl font-bold text-ink transition hover:text-brand-700 sm:text-2xl">{point.name}</h3>
                  </Link>
                  <p className="mt-2 text-xs text-slate-500 sm:text-sm">{point.address}</p>
                  <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">{point.note}</p>

                  <Link to={`/flood-points/${point.id}`} className="mt-6 block overflow-hidden rounded-[28px] border border-slate-100 bg-slate-50/70">
                    <img src={point.image} alt={point.name} className="h-64 w-full object-cover transition hover:opacity-95 sm:h-72" />
                  </Link>

                  <div className="mt-5 flex flex-wrap gap-3 text-xs text-slate-500 sm:text-sm">
                    <span>{point.confirmations} xác nhận</span>
                    <span>Độ tin cậy {point.confidence}%</span>
                    <span>Mốc gần nhất: {point.nearbyLandmark}</span>
                  </div>

                  <div className="mt-6 rounded-[24px] border border-slate-100 bg-slate-50/80 p-4">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                      onClick={() => toggleThread(point.id)}
                    >
                      <span className="flex items-center gap-2">
                        <MessageCircle size={16} />
                        Xem bình luận
                        <span className="text-slate-400">({commentCount})</span>
                      </span>
                      {isThreadOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {isThreadOpen && (
                      <>
                        <div className="mb-3 mt-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
                          <MessageCircle size={16} />
                          Bình luận cấp 1
                        </div>
                        <div className="space-y-3">
                          {comments.map((comment) => renderComment(point.id, comment))}
                        </div>
                        {replyTarget && (
                          <div className="mt-4 flex items-center justify-between rounded-2xl bg-brand-50 px-4 py-3 text-sm text-brand-900">
                            <span>Đang trả lời bình luận của {replyTarget.author}</span>
                            <button
                              type="button"
                              className="font-semibold text-brand-700"
                              onClick={() =>
                                setReplyTargets((prev) => ({
                                  ...prev,
                                  [point.id]: null,
                                }))
                              }
                            >
                              Hủy
                            </button>
                          </div>
                        )}
                        {!comments.length && (
                          <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-500">
                            Chưa có bình luận nào cho bài đăng này.
                          </div>
                        )}
                        <div className="mt-4 space-y-3">
                          <textarea
                            value={draftComments[point.id] || ''}
                            onChange={(event) =>
                              setDraftComments((prev) => ({
                                ...prev,
                                [point.id]: event.target.value,
                              }))
                            }
                            placeholder={replyTarget ? `Trả lời ${replyTarget.author}` : 'Viết bình luận cho bài đăng này'}
                            className="field min-h-[92px] py-3 text-sm"
                          />
                          <div className="flex justify-end">
                            <Button className="h-11 px-5" onClick={() => submitComment(point.id)}>
                              {replyTarget ? 'Gửi trả lời' : 'Gửi bình luận'}
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </article>
            )
          })
        ) : (
          <EmptyState title="Bạn chưa có bài đăng nào" description="Khi bạn tạo báo cáo ngập mới, bài đăng sẽ xuất hiện ở đây giống như trên trang cộng đồng." />
        )}
      </section>
    </div>
  )
}
