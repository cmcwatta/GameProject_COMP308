import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthService } from '../services/authService.jsx'
import '../styles/profile.css'

export default function ProfileForm() {
  const [user, setUser] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    try {
      console.log("📝 ProfileForm: Loading user profile...");
      const result = await AuthService.getCurrentUser()
      console.log("📝 ProfileForm: Got result:", result);
      
      if (!result || !result.data) {
        throw new Error('No data returned from server');
      }
      
      if (!result.data.getCurrentUser) {
        console.error("📝 ProfileForm: getCurrentUser is undefined in response:", result.data);
        throw new Error('User data not found in response');
      }
      
      const userData = result.data.getCurrentUser;
      console.log("📝 ProfileForm: Setting user data:", userData);
      
      setUser(userData);
      setName(userData.name || '');
      setEmail(userData.email || '');
      setError('');
    } catch (err) {
      console.error("🚨 ProfileForm: Error loading profile:", err);
      setError(err.message || 'Failed to load profile');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')
    setUpdating(true)

    try {
      const { data } = await AuthService.updateProfile(name, email)
      setUser(data.updateProfile)
      setMessage('Profile updated successfully!')
    } catch (err) {
      setError(err.message || 'Update failed')
    } finally {
      setUpdating(false)
    }
  }

  const handleLogout = async () => {
    try {
      await AuthService.logout()
      AuthService.removeToken()
      navigate('/login')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h2 className="profile-title">Profile</h2>
          <button
            onClick={handleLogout}
            className="btn-secondary"
          >
            Logout
          </button>
        </div>

        {message && (
          <div className="profile-alert success">
            {message}
          </div>
        )}

        {error && (
          <div className="profile-alert error">
            {error}
          </div>
        )}

        <div className="user-info-section">
          <h3 className="user-info-title">User Information</h3>
          <div className="user-info-grid">
            <div className="info-item">
              <p className="info-label">Role</p>
              <p className="info-value">{user?.role}</p>
            </div>
            <div className="info-item">
              <p className="info-label">Member Since</p>
              <p className="info-value">
                {new Date(user?.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="profile-form">
          <div className="form-group">
            <label className="form-label">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <button
            type="submit"
            disabled={updating}
            className="btn-primary"
          >
            {updating ? 'Updating...' : 'Update Profile'}
          </button>
        </form>

        <div className="profile-footer">
          <p className="profile-footer-text">
            Need to report an issue?{' '}
            <a 
              href="http://localhost:3002" 
              className="profile-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Go to Issue Reporter
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}