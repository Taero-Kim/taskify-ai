import { fetchData } from '@/shared/api/fetch'

export const deleteDashboardInvitation = (dashboardId: number, invitationId: number) => {
  return fetchData<null>({
    method: 'DELETE',
    path: `/dashboards/${dashboardId}/invitations/${invitationId}`,
    requiresAuth: true,
  })
}
