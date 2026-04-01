import { fetchData } from '@/shared/api/fetch'

import type { Dashboard } from '@/features/dashboard/apis/dashboard.types'

type UpdateDashboardRequest = {
  color?: string
  title?: string
}

export const updateDashboard = (dashboardId: number, body: UpdateDashboardRequest) => {
  return fetchData<Dashboard, UpdateDashboardRequest>({
    body,
    method: 'PUT',
    path: `/dashboards/${dashboardId}`,
    requiresAuth: true,
  })
}
