import { fetchData } from '@/shared/api/fetch'

export type AuthUser = {
  createdAt: string
  email: string
  id: number
  nickname: string
  profileImageUrl: string | null
  updatedAt: string
}

export const getMyInfo = () => {
  return fetchData<AuthUser>({
    path: '/users/me',
    requiresAuth: true,
  })
}
