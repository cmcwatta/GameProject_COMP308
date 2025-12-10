import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import './AuthForm.css';

const RegisterForm = ({ selectedRole }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'resident'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  // Set role from selectedRole prop when it changes
  useEffect(() => {
    if (selectedRole) {
      setFormData(prev => ({
        ...prev,
        role: selectedRole
      }));
    }
  }, [selectedRole]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };
      
      const result = await register(userData);
      
      if (result.success) {
        toast.success('Registration successful!');
        
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
        toast.error(result.error || 'Registration failed');
      }
    } catch (error) {
      toast.error('An error occurred during registration');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleColor = () => {
    switch (formData.role) {
      case 'resident':
        return '#3b82f6';
      case 'community_advocate':
        return '#10b981';
      case 'municipal_staff':
        return '#f43f5e';
      default:
        return '#667eea';
    }
  };

  const getRoleLabel = () => {
    return formData.role.replace('_', ' ').toUpperCase();
  };

  return (
    <div className="register-form-wrapper">
      <form onSubmit={handleSubmit} className="register-form">
        {/* Role Badge */}
        <div className="role-badge" style={{ borderColor: getRoleColor() }}>
          <span className="role-badge-dot" style={{ backgroundColor: getRoleColor() }}></span>
          <span className="role-badge-text">{getRoleLabel()}</span>
        </div>

        {/* Username Field */}
        <div className="form-group">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Choose a unique username"
            className={`form-input ${errors.username ? 'error' : ''}`}
            disabled={isLoading}
          />
          {errors.username && <p className="form-error">{errors.username}</p>}
        </div>

        {/* Email Field */}
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className={`form-input ${errors.email ? 'error' : ''}`}
            disabled={isLoading}
          />
          {errors.email && <p className="form-error">{errors.email}</p>}
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
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
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

        {/* Confirm Password Field */}
        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <div className="password-input-wrapper">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="password-toggle"
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="icon" />
              ) : (
                <EyeIcon className="icon" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="form-error">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="submit-button"
          style={{ backgroundColor: getRoleColor() }}
        >
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Creating Account...
            </>
          ) : (
            `Create Account as ${getRoleLabel()}`
          )}
        </button>

        {/* Password Requirements */}
        <div className="password-requirements">
          <p className="requirements-title">Password must contain:</p>
          <ul className="requirements-list">
            <li className={formData.password.length >= 6 ? 'met' : ''}>
              ✓ At least 6 characters
            </li>
          </ul>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;