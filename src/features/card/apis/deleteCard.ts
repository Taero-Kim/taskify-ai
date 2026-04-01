import { fetchData } from '@/shared/api/fetch'

export const deleteCard = (cardId: number) => {
  return fetchData<null>({
    method: 'DELETE',
    path: `/cards/${cardId}`,
    requiresAuth: true,
  })
}
