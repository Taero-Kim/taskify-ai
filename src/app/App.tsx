import { Outlet } from 'react-router-dom'

import { AppProviders } from '@/app/providers'

const App = () => {
  return (
    <AppProviders>
      <Outlet />
    </AppProviders>
  )
}

export default App
