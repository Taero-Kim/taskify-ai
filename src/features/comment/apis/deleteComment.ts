import { fetchData } from '@/shared/api/fetch'

export const deleteComment = (commentId: number) => {
  return fetchData<null>({
    method: 'DELETE',
    path: `/comments/${commentId}`,
    requiresAuth: true,
  })
}
