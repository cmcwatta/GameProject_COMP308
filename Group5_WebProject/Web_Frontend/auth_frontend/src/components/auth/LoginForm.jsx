import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import './AuthForm.css';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);

    try {
      const result = await login(username, password);
      
      if (result.success) {
        toast.success('Login successful!');
        
        // Redirect based on role
        switch (result.user.role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'municipal_staff':
            navigate('/staff');
            break;
          case 'community_advocate':
            navigate('/advocate');
            break;
          default:
            navigate('/dashboard');
        }
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch (error) {
      toast.error('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-form-wrapper">
      <form onSubmit={handleSubmit} className="register-form">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
      <p className="text-sm text-gray-600 mb-8">Sign in to your account</p>

      {/* Username Field */}
      <div className="form-group">
        <label htmlFor="username" className="form-label">
          Username or Email
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            if (errors.username) setErrors({ ...errors, username: '' });
          }}
          placeholder="Enter your username or email"
          className={`form-input ${errors.username ? 'error' : ''}`}
          disabled={isLoading}
        />
        {errors.username && <p className="form-error">{errors.username}</p>}
      </div>

      {/* Password Field */}
      <div className="form-group">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <div className="password-input-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors({ ...errors, password: '' });
            }}
            placeholder="Enter your password"
            className={`form-input ${errors.password ? 'error' : ''}`}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="password-toggle"
          >
            {showPassword ? (
              <EyeSlashIcon className="icon" />
            ) : (
              <EyeIcon className="icon" />
            )}
          </button>
        </div>
        {errors.password && <p className="form-error">{errors.password}</p>}
      </div>

      {/* Remember Me */}
      <div className="flex items-center justify-between mb-8">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-2 border-gray-300 accent-blue-600"
          />
          <span className="text-sm text-gray-600">Remember me</span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="submit-button"
        style={{ backgroundColor: '#667eea' }}
      >
        {isLoading ? (
          <>
            <span className="spinner"></span>
            Logging in...
          </>
        ) : (
          'Login to Your Account'
        )}
      </button>
      </form>
    </div>
  );
};

export default LoginForm;