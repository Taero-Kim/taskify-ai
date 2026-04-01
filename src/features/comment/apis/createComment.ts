import { fetchData } from '@/shared/api/fetch'

import type { Comment } from '@/features/comment/apis/comment.types'

type CreateCommentRequest = {
  cardId: number
  columnId: number
  content: string
  dashboardId: number
}

export const createComment = (body: CreateCommentRequest) => {
  return fetchData<Comment, CreateCommentRequest>({
    body,
    method: 'POST',
    path: '/comments',
    requiresAuth: true,
  })
}
