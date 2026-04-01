export type Column = {
  createdAt: string
  id: number
  teamId: string
  title: string
  updatedAt: string
}

type ColumnListResponse = {
  data: Column[] | null
  result: 'SUCCESS'
}

export type ColumnList = ColumnListResponse
