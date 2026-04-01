import { fetchData } from '@/shared/api/fetch'

import type { CommentListResponse } from '@/features/comment/apis/comment.types'

export const getComments = (cardId: number, cursorId?: number, size = 6) => {
  return fetchData<CommentListResponse>({
    path: '/comments',
    query: {
      cardId,
      cursorId,
      size,
    },
    requiresAuth: true,
  })
}
