import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthService } from '../services/authService.jsx'

export default function AuthGuard({ children }) {
  const navigate = useNavigate()

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      navigate('/login')
    }
  }, [navigate])

  if (!AuthService.isAuthenticated()) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}