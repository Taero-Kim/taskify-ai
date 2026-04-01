import { fetchData } from '@/shared/api/fetch'

import type { ColumnList } from '@/features/column/apis/column.types'

export const getColumns = (dashboardId: number) => {
  return fetchData<ColumnList>({
    path: '/columns',
    query: {
      dashboardId,
    },
    requiresAuth: true,
  })
}
