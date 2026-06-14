/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from 'react'
import {
  demoAdminProfile,
  demoUserProfile,
  floodPointsSeed,
  initialSystemConfig,
  reportsSeed,
  safeRoutesSeed,
  systemConfigLogsSeed,
  usersSeed,
} from '../data/mockData'
import type { FloodPoint, FloodReport, FloodSeverity, SystemConfig, SystemConfigLog, UserProfile, UserSummary } from '../types'

interface NewReportInput {
  name?: string
  district?: string
  address: string
  lat: number
  lng: number
  severity: FloodSeverity
  description: string
  image: string
}

interface AppStateValue {
  floodPoints: FloodPoint[]
  reports: FloodReport[]
  safeRoutes: typeof safeRoutesSeed
  users: UserSummary[]
  profile: UserProfile | null
  isAuthenticated: boolean
  isAdmin: boolean
  systemConfig: SystemConfig
  systemConfigLogs: SystemConfigLog[]
  login: (email: string) => { success: boolean; role?: 'citizen' | 'admin'; reason?: string }
  logout: () => void
  toggleUserLock: (id: string) => void
  submitReport: (input: NewReportInput) => string
  confirmFloodPoint: (id: string) => void
  resolveFloodPoint: (id: string) => void
  verifyReport: (id: string) => void
  rejectReport: (id: string) => void
  updateSystemConfig: (next: SystemConfig) => void
}

const AppStateContext = createContext<AppStateValue | null>(null)

export function AppStateProvider({ children }: PropsWithChildren) {
  const [floodPoints, setFloodPoints] = useState(floodPointsSeed)
  const [reports, setReports] = useState(reportsSeed)
  const [systemConfig, setSystemConfig] = useState(initialSystemConfig)
  const [systemConfigLogs, setSystemConfigLogs] = useState(systemConfigLogsSeed)
  const [users, setUsers] = useState(usersSeed)
  const [profile, setProfile] = useState<UserProfile | null>(null)

  const login = (email: string) => {
    const normalizedEmail = email.trim().toLowerCase()
    const targetProfile =
      normalizedEmail === demoAdminProfile.email.toLowerCase()
        ? demoAdminProfile
        : normalizedEmail === demoUserProfile.email.toLowerCase()
          ? demoUserProfile
          : demoUserProfile
    const userState = users.find((user) => user.id === targetProfile.id)

    if (userState?.isLocked) {
      return { success: false, reason: 'Tài khoản này đang bị khóa' }
    }

    setProfile({
      ...targetProfile,
      isLocked: userState?.isLocked ?? targetProfile.isLocked,
    })
    return { success: true, role: targetProfile.role }
  }

  const logout = () => {
    setProfile(null)
  }

  const toggleUserLock = (id: string) => {
    setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, isLocked: !user.isLocked } : user)))

    setProfile((prev) => {
      if (!prev || prev.id !== id) return prev
      return { ...prev, isLocked: !prev.isLocked }
    })
  }

  const submitReport = (input: NewReportInput) => {
    const activeProfile = profile ?? demoUserProfile
    const inferredDistrict =
      input.district?.trim() ||
      input.address
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean)
        .at(-1) ||
      'Hà Nội'
    const inferredName =
      input.name?.trim() ||
      input.address
        .split(',')
        .map((part) => part.trim())
        .find(Boolean) ||
      'Điểm ngập mới'
    const pointId = `fp-${Date.now()}`
    const reportId = `rp-${Date.now()}`
    const createdAt = new Date().toISOString()
    const floodPoint: FloodPoint = {
      id: pointId,
      name: inferredName,
      district: inferredDistrict,
      address: input.address,
      lat: input.lat,
      lng: input.lng,
      severity: input.severity,
      status: 'unverified',
      confidence: 61,
      confirmations: 1,
      updatedAt: createdAt,
      waterDepthCm: input.severity === 'heavy' ? 40 : input.severity === 'medium' ? 22 : 10,
      image: input.image,
      note: input.description,
      reporter: {
        id: activeProfile.id,
        name: activeProfile.fullName,
        avatar: activeProfile.avatar,
        reputation: activeProfile.reputation,
        role: 'citizen',
        isLocked: false,
      },
      nearbyLandmark: 'Vị trí do người dùng chọn',
      updates: [
        {
          id: `up-${Date.now()}`,
          time: createdAt,
          title: 'Báo cáo mới được gửi',
          detail: input.description,
        },
      ],
    }

    const report: FloodReport = {
      id: reportId,
      floodPointId: pointId,
      reporter: floodPoint.reporter,
      severity: input.severity,
      status: 'pending',
      description: input.description,
      image: input.image,
      submittedAt: createdAt,
      confirmations: 1,
    }

    setFloodPoints((prev) => [floodPoint, ...prev])
    setReports((prev) => [report, ...prev])
    return pointId
  }

  const confirmFloodPoint = (id: string) => {
    setFloodPoints((prev) =>
      prev.map((point) =>
        point.id === id
          ? {
              ...point,
              status: 'verified',
              confirmations: point.confirmations + 1,
              confidence: Math.min(99, point.confidence + 5),
              updatedAt: new Date().toISOString(),
              updates: [
                {
                  id: `up-${Date.now()}`,
                  time: new Date().toISOString(),
                  title: 'Người dùng xác nhận còn ngập',
                  detail: 'Điểm ngập được cộng đồng xác nhận mới.',
                },
                ...point.updates,
              ],
            }
          : point,
      ),
    )
  }

  const resolveFloodPoint = (id: string) => {
    setFloodPoints((prev) =>
      prev.map((point) =>
        point.id === id
          ? {
              ...point,
              status: 'resolved',
              updatedAt: new Date().toISOString(),
              updates: [
                {
                  id: `up-${Date.now()}`,
                  time: new Date().toISOString(),
                  title: 'Đã báo hết ngập',
                  detail: 'Cộng đồng cập nhật mặt đường đã thông thoáng hơn.',
                },
                ...point.updates,
              ],
            }
          : point,
      ),
    )
  }

  const setReportStatus = (id: string, status: FloodReport['status']) => {
    setReports((prev) => prev.map((report) => (report.id === id ? { ...report, status } : report)))
  }

  const updateSystemConfig = (next: SystemConfig) => {
    setSystemConfig(next)
    setSystemConfigLogs((prev) => [
      {
        id: `cfg-${Date.now()}`,
        changedBy: 'Lê Thu Hà',
        changedAt: new Date().toISOString(),
        summary: `Cập nhật ngưỡng verify=${next.verifyThreshold}, alertRadiusM=${next.alertRadiusM}, heavyFloodBlocked=${next.heavyFloodBlocked ? 'bật' : 'tắt'}.`,
      },
      ...prev,
    ])
  }

  const value: AppStateValue = {
    floodPoints,
    reports,
    safeRoutes: safeRoutesSeed,
    users,
    profile,
    isAuthenticated: Boolean(profile),
    isAdmin: profile?.role === 'admin',
    systemConfig,
    systemConfigLogs,
    login,
    logout,
    toggleUserLock,
    submitReport,
    confirmFloodPoint,
    resolveFloodPoint,
    verifyReport: (id: string) => setReportStatus(id, 'verified'),
    rejectReport: (id: string) => setReportStatus(id, 'rejected'),
    updateSystemConfig,
  }

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const context = useContext(AppStateContext)

  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider')
  }

  return context
}
