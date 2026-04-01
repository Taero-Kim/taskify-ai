import { fetchData } from '@/shared/api/fetch'

import type { Invitation } from '@/features/dashboard/apis/dashboard.types'

type UpdateInvitationRequest = {
  inviteAccepted: boolean
}

export const updateInvitation = (invitationId: number, body: UpdateInvitationRequest) => {
  return fetchData<Invitation, UpdateInvitationRequest>({
    body,
    method: 'PUT',
    path: `/invitations/${invitationId}`,
    requiresAuth: true,
  })
}
