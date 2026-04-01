import { fetchData } from '@/shared/api/fetch'

export const deleteColumn = (columnId: number) => {
  return fetchData<null>({
    method: 'DELETE',
    path: `/columns/${columnId}`,
    requiresAuth: true,
  })
}
