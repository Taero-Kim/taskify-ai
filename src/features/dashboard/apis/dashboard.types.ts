export type Dashboard = {
  color: string
  createdAt: string
  createdByMe: boolean
  id: number
  title: string
  updatedAt: string
  userId: number
}

export type DashboardListResponse = {
  cursorId: number | null
  dashboards: Dashboard[]
  totalCount: number
}

export type Invitation = {
  createdAt: string
  dashboard: {
    id: number
    title: string
  }
  id: number
  inviteAccepted: boolean | null
  invitee: {
    email: string
    id: number
    nickname: string
  }
  inviter: {
    email: string
    id: number
    nickname: string
  }
  teamId: string
  updatedAt: string
}

export type InvitationListResponse = {
  cursorId: number | null
  invitations: Invitation[]
}
