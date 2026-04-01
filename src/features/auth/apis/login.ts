import { fetchData } from '@/shared/api/fetch'

import type { AuthUser } from '@/features/auth/apis/getMyInfo'

type LoginRequest = {
  email: string
  password: string
}

type LoginResponse = {
  accessToken: string
  user: AuthUser
}

export const login = (body: LoginRequest) => {
  return fetchData<LoginResponse, LoginRequest>({
    body,
    method: 'POST',
    path: '/auth/login',
  })
}
