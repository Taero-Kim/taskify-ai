export type CardAssignee = {
  id: number
  nickname: string
  profileImageUrl: string | null
}

export type Card = {
  assignee: CardAssignee | null
  columnId: number
  createdAt: string
  description: string
  dueDate: string | null
  id: number
  imageUrl: string | null
  tags: string[]
  teamId: string
  title: string
  updatedAt: string
}

export type CardListResponse = {
  cards: Card[]
  cursorId: number | null
  totalCount: number
}
