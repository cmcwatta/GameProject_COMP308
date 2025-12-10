import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthService } from '../services/authService.jsx'
import '../styles/login.css'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      console.log('Starting login...')
      const result = await AuthService.login(email, password)
      console.log('Login result:', result)
      
      if (!result) {
        throw new Error('No response from server')
      }
      
      if (!result.login) {
        console.error('Result object:', result)
        throw new Error('Login data not found in response')
      }
      
      if (result.login.token) {
        AuthService.setToken(result.login.token)
        console.log('Token saved, navigating to profile')
        navigate('/profile')
      } else {
        throw new Error('No token received from server')
      }
    } catch (err) {
      console.error('Caught error:', err)
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Sign in to your account</p>
        </div>
        
        {error && (
          <div className="login-error">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`login-button ${loading ? 'loading' : ''}`}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p className="footer-text">
            Don't have an account?{' '}
            <Link to="/register" className="footer-link">
              Create one
            </Link>
          </p>
        </div>

        <div className="demo-credentials">
          <p className="demo-label">Test Credentials:</p>
          <p className="demo-value">test@example.com / password123</p>
        </div>
      </div>
    </div>
  )
}