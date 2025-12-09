import React from 'react'
import RegisterForm from '../components/RegisterForm.jsx'

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-gray-100">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Join Our Community</h1>
          <p className="text-gray-600 mt-2">Register to start making a difference</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}