import { fetchData } from '@/shared/api/fetch'

import type { Comment } from '@/features/comment/apis/comment.types'

type UpdateCommentRequest = {
  content: string
}

export const updateComment = (commentId: number, body: UpdateCommentRequest) => {
  return fetchData<Comment, UpdateCommentRequest>({
    body,
    method: 'PUT',
    path: `/comments/${commentId}`,
    requiresAuth: true,
  })
}
