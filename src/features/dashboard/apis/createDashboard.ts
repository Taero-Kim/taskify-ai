import { fetchData } from '@/shared/api/fetch'

import type { Dashboard } from '@/features/dashboard/apis/dashboard.types'

type CreateDashboardRequest = {
  color: string
  title: string
}

export const createDashboard = (body: CreateDashboardRequest) => {
  return fetchData<Dashboard, CreateDashboardRequest>({
    body,
    method: 'POST',
    path: '/dashboards',
    requiresAuth: true,
  })
}
