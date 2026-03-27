import { createBrowserRouter } from 'react-router-dom'

import App from '@/app/App'
import { DashboardEditPage } from '@/pages/dashboard-edit'
import { DashboardPage } from '@/pages/dashboard'
import { LoginPage } from '@/pages/login'
import { MainPage } from '@/pages/main'
import { MyDashboardPage } from '@/pages/mydashboard'
import { MyPage } from '@/pages/mypage'
import { NotFoundPage } from '@/pages/not-found'
import { SignupPage } from '@/pages/signup'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'signup',
        element: <SignupPage />,
      },
      {
        path: 'mydashboard',
        element: <MyDashboardPage />,
      },
      {
        path: 'dashboard/:dashboardId',
        element: <DashboardPage />,
      },
      {
        path: 'dashboard/:dashboardId/edit',
        element: <DashboardEditPage />,
      },
      {
        path: 'mypage',
        element: <MyPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
