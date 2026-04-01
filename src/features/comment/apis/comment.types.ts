export type CommentAuthor = {
  id: number
  nickname: string
  profileImageUrl: string | null
}

export type Comment = {
  author: CommentAuthor
  cardId: number
  content: string
  createdAt: string
  id: number
  updatedAt: string
}

export type CommentListResponse = {
  comments: Comment[]
  cursorId: number | null
}
