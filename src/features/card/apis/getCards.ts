import { fetchData } from '@/shared/api/fetch'

import type { CardListResponse } from '@/features/card/apis/card.types'

export const getCards = (columnId: number, cursorId?: number, size = 6) => {
  return fetchData<CardListResponse>({
    path: '/cards',
    query: {
      columnId,
      cursorId,
      size,
    },
    requiresAuth: true,
  })
}
