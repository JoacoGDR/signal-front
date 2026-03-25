import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Connections } from './pages/Connections/Connections'
import { Inbox } from './pages/Inbox/Inbox'
import { Leads } from './pages/Leads/Leads'
import { Login } from './pages/Login/Login'
import { OAuthCallback } from './pages/OAuthCallback/OAuthCallback'
import { Register } from './pages/Register/Register'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/oauth/callback/:platform" element={<OAuthCallback />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/inbox" replace />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="leads" element={<Leads />} />
          <Route path="connections" element={<Connections />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
