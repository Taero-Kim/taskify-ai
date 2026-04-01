import { fetchData } from '@/shared/api/fetch'

import type { AuthUser } from '@/features/auth/apis/getMyInfo'

type UpdateMyInfoRequest = {
  nickname?: string
  profileImageUrl?: string | null
}

export const updateMyInfo = (body: UpdateMyInfoRequest) => {
  return fetchData<AuthUser, UpdateMyInfoRequest>({
    body,
    method: 'PUT',
    path: '/users/me',
    requiresAuth: true,
  })
}
