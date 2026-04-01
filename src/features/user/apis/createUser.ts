import { fetchData } from '@/shared/api/fetch'

import type { AuthUser } from '@/features/auth/apis/getMyInfo'

type CreateUserRequest = {
  email: string
  nickname: string
  password: string
}

export const createUser = (body: CreateUserRequest) => {
  return fetchData<AuthUser, CreateUserRequest>({
    body,
    method: 'POST',
    path: '/users',
  })
}
