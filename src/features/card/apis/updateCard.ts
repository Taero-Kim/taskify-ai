import { fetchData } from '@/shared/api/fetch'

import type { Card } from '@/features/card/apis/card.types'

type UpdateCardRequest = {
  assigneeUserId?: number | null
  columnId?: number
  description?: string
  dueDate?: string | null
  imageUrl?: string | null
  tags?: string[]
  title?: string
}

export const updateCard = (cardId: number, body: UpdateCardRequest) => {
  return fetchData<Card, UpdateCardRequest>({
    body,
    method: 'PUT',
    path: `/cards/${cardId}`,
    requiresAuth: true,
  })
}
