import { fetchData } from '@/shared/api/fetch'

import type { Column } from '@/features/column/apis/column.types'

type UpdateColumnRequest = {
  title: string
}

export const updateColumn = (columnId: number, body: UpdateColumnRequest) => {
  return fetchData<Column, UpdateColumnRequest>({
    body,
    method: 'PUT',
    path: `/columns/${columnId}`,
    requiresAuth: true,
  })
}
