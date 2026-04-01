import { fetchData } from '@/shared/api/fetch'

import type { Card } from '@/features/card/apis/card.types'

export const getCard = (cardId: number) => {
  return fetchData<Card>({
    path: `/cards/${cardId}`,
    requiresAuth: true,
  })
}
