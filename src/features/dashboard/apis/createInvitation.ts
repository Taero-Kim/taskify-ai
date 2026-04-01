import { fetchData } from '@/shared/api/fetch'

type CreateInvitationRequest = {
  email: string
}

export const createInvitation = (dashboardId: number, body: CreateInvitationRequest) => {
  return fetchData({
    body,
    method: 'POST',
    path: `/dashboards/${dashboardId}/invitations`,
    requiresAuth: true,
  })
}
