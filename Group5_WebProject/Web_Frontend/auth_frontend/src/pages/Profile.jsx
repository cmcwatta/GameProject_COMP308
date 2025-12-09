import React from 'react'
import ProfileForm from '../components/ProfileForm.jsx'

export default function Profile() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-gray-100 py-10">
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Your Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account and preferences</p>
        </div>
        <ProfileForm />
      </div>
    </div>
  )
}