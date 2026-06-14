export type FloodSeverity = 'light' | 'medium' | 'heavy'
export type FloodStatus = 'unverified' | 'verified' | 'resolved'
export type ReportStatus = 'pending' | 'verified' | 'rejected'

export interface FloodUpdate {
  id: string
  time: string
  title: string
  detail: string
}

export interface UserSummary {
  id: string
  name: string
  avatar: string
  reputation: number
  role: 'citizen' | 'volunteer' | 'admin'
  isLocked: boolean
}

export interface FloodReport {
  id: string
  floodPointId: string
  reporter: UserSummary
  severity: FloodSeverity
  status: ReportStatus
  description: string
  image: string
  submittedAt: string
  confirmations: number
}

export interface FloodPoint {
  id: string
  name: string
  district: string
  address: string
  lat: number
  lng: number
  severity: FloodSeverity
  status: FloodStatus
  confidence: number
  confirmations: number
  updatedAt: string
  waterDepthCm: number
  image: string
  note: string
  reporter: UserSummary
  nearbyLandmark: string
  updates: FloodUpdate[]
}

export interface RouteAlert {
  floodPointId: string
  distanceM: number
  message: string
}

export interface SafeRoute {
  id: string
  origin: string
  destination: string
  distanceKm: number
  avoidedFloodPoints: number
  message: string
  path: [number, number][]
  alerts: RouteAlert[]
}

export interface UserProfile {
  id: string
  fullName: string
  email: string
  phone: string
  district: string
  avatar: string
  reputation: number
  joinedAt: string
  sentReports: number
  verifiedReports: number
  rejectedReports: number
  role: 'citizen' | 'admin'
  isLocked: boolean
}

export interface DailyReportStat {
  day: string
  reports: number
}

export interface SeverityStat {
  name: string
  value: number
  color: string
}

export interface SystemConfig {
  verifyThreshold: number
  expireThreshold: number
  floodExpireMinutes: number
  floodClusterRadiusM: number
  alertRadiusM: number
  lightFloodPenalty: number
  mediumFloodPenalty: number
  heavyFloodBlocked: boolean
}

export interface SystemConfigLog {
  id: string
  changedBy: string
  changedAt: string
  summary: string
}
