import React from 'react'
import LoginForm from '../components/LoginForm.jsx'

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Civic Engagement Platform</h1>
          <p className="text-gray-600 mt-2">Login to report and track community issues</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}