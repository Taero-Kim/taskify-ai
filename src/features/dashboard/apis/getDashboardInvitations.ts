import { fetchData } from '@/shared/api/fetch'

import type { Invitation } from '@/features/dashboard/apis/dashboard.types'

type DashboardInvitationListResponse = {
  invitations: Invitation[]
  totalCount: number
}

export const getDashboardInvitations = (dashboardId: number, page = 1, size = 5) => {
  return fetchData<DashboardInvitationListResponse>({
    path: `/dashboards/${dashboardId}/invitations`,
    query: {
      page,
      size,
    },
    requiresAuth: true,
  })
}
