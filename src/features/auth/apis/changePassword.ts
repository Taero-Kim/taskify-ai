import { fetchData } from '@/shared/api/fetch'

type ChangePasswordRequest = {
  newPassword: string
  password: string
}

export const changePassword = (body: ChangePasswordRequest) => {
  return fetchData<null, ChangePasswordRequest>({
    body,
    method: 'PUT',
    path: '/auth/password',
    requiresAuth: true,
  })
}
