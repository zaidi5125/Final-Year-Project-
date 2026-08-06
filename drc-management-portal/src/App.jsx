import AppRoutes from '@/routes'
import AppProviders from '@/store/AppProviders'

function App() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  )
}

export default App
