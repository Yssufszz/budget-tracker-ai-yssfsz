import React from 'react'
import { AuthProvider } from './context/AuthContext'
import Dashboard from './components/Dashboard'
import Auth from './components/Auth'
import { useAuth } from './context/AuthContext'
import 'bootstrap/dist/css/bootstrap.min.css'

function AppContent() {
  const { user } = useAuth()
  
  return (
    <div className="min-vh-100 bg-light">
      {user ? <Dashboard /> : <Auth />}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App