import { fetchData } from '@/shared/api/fetch'

export type DashboardMember = {
  createdAt: string
  email: string
  id: number
  isOwner: boolean
  nickname: string
  profileImageUrl: string | null
  updatedAt: string
  userId: number
}

type DashboardMemberListResponse = {
  members: DashboardMember[]
  totalCount: number
}

export const getMembers = (dashboardId: number, page = 1, size = 20) => {
  return fetchData<DashboardMemberListResponse>({
    path: '/members',
    query: {
      dashboardId,
      page,
      size,
    },
    requiresAuth: true,
  })
}
