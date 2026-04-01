import { fetchData } from '@/shared/api/fetch'

import type { InvitationListResponse } from '@/features/dashboard/apis/dashboard.types'

type GetInvitationsParams = {
  cursorId?: number
  size?: number
}

export const getInvitations = ({ cursorId, size }: GetInvitationsParams) => {
  return fetchData<InvitationListResponse>({
    path: '/invitations',
    query: {
      cursorId,
      size,
    },
    requiresAuth: true,
  })
}
