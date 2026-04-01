import { fetchData } from '@/shared/api/fetch'

export const deleteMember = (memberId: number) => {
  return fetchData<null>({
    method: 'DELETE',
    path: `/members/${memberId}`,
    requiresAuth: true,
  })
}
