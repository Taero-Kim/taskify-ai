import { fetchData } from '@/shared/api/fetch'

import type { Column } from '@/features/column/apis/column.types'

type CreateColumnRequest = {
  dashboardId: number
  title: string
}

export const createColumn = (body: CreateColumnRequest) => {
  return fetchData<Column, CreateColumnRequest>({
    body,
    method: 'POST',
    path: '/columns',
    requiresAuth: true,
  })
}
