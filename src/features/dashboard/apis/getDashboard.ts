import { fetchData } from '@/shared/api/fetch'

import type { Dashboard } from '@/features/dashboard/apis/dashboard.types'

export const getDashboard = (dashboardId: number) => {
  return fetchData<Dashboard>({
    path: `/dashboards/${dashboardId}`,
    requiresAuth: true,
  })
}
