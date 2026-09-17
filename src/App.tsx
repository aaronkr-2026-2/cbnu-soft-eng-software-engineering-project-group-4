import { Navigate, Route, Routes } from 'react-router-dom'
import { DashboardPage } from '@/pages/DashboardPage'
import { LoginPage } from '@/pages/LoginPage'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
import { SimulatorPage } from '@/pages/SimulatorPage'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<DashboardPage />} />
      <Route path="/topics" element={<PlaceholderPage title="Topics" />} />
      <Route path="/progress" element={<PlaceholderPage title="My Progress" />} />
      <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
      <Route path="/simulator" element={<SimulatorPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
