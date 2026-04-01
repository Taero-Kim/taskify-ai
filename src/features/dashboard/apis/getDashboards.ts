import { fetchData } from '@/shared/api/fetch'

import type { DashboardListResponse } from '@/features/dashboard/apis/dashboard.types'

type GetDashboardsParams = {
  navigationMethod: 'infiniteScroll' | 'pagination'
  page?: number
  size?: number
}

export const getDashboards = ({ navigationMethod, page, size }: GetDashboardsParams) => {
  return fetchData<DashboardListResponse>({
    path: '/dashboards',
    query: {
      navigationMethod,
      page,
      size,
    },
    requiresAuth: true,
  })
}
