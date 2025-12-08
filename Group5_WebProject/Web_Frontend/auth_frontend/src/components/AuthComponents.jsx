import React, { useState } from 'react';
import axios from 'axios';

const AuthComponents = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Resident');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const mutation = isSignUp
        ? `
          mutation {
            register(
              email: "${email}"
              name: "${name}"
              password: "${password}"
              phone: "${phone || ''}"
              role: "${role}"
            ) {
              token
              user {
                id
                email
                name
                role
              }
            }
          }
        `
        : `
          mutation {
            login(email: "${email}", password: "${password}") {
              token
              user {
                id
                email
                name
                role
              }
            }
          }
        `;

      const response = await axios.post(
        'http://localhost:5001/graphql',
        { query: mutation },
        { withCredentials: true }
      );

      const data = response.data;

      if (data.errors) {
        setMessage(`Error: ${data.errors[0].message}`);
      } else {
        const token = data.data[isSignUp ? 'register' : 'login'].token;
        localStorage.setItem('authToken', token);
        localStorage.setItem('userRole', role);
        setMessage(`${isSignUp ? 'Sign up' : 'Sign in'} successful! Redirecting...`);
        setTimeout(() => {
          window.location.href = 'http://localhost:3003/';
        }, 1500);
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (provider) => {
    try {
      setIsLoading(true);
      if (provider === 'google') {
        // In production, initialize Google OAuth flow
        console.log('Google OAuth login initiated');
        // window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
      } else if (provider === 'github') {
        // In production, initialize GitHub OAuth flow
        console.log('GitHub OAuth login initiated');
        // window.location.href = `${process.env.REACT_APP_API_URL}/auth/github`;
      }
      setMessage(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login not yet configured`);
    } catch (error) {
      setMessage(`${provider} login failed`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-800">
          {isSignUp ? 'Join Civic Hub' : 'Welcome Back'}
        </h2>
        <p className="text-gray-600">
          {isSignUp
            ? 'Help improve your community by reporting civic issues'
            : 'Sign in to your account'}
        </p>
      </div>

      {/* Auth Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
        {/* OAuth Options */}
        <div className="space-y-3">
          <p className="text-center text-sm text-gray-600">Sign in with</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleOAuthLogin('google')}
              disabled={isLoading}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <span>🔵</span> Google
            </button>
            <button
              type="button"
              onClick={() => handleOAuthLogin('github')}
              disabled={isLoading}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <span>⚫</span> GitHub
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or continue with email</span>
          </div>
        </div>

        {/* Form Fields */}
        {isSignUp && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required={isSignUp}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone (Optional)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
          />
        </div>

        {isSignUp && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
            >
              <option value="Resident">Resident</option>
              <option value="Community Advocate">Community Advocate</option>
              <option value="Municipal Staff">Municipal Staff</option>
            </select>
            <p className="text-xs text-gray-500 mt-2">
              {role === 'Resident' && 'Report and discuss civic issues in your community'}
              {role === 'Community Advocate' && 'Lead community initiatives and organize volunteers'}
              {role === 'Municipal Staff' && 'Manage and resolve reported issues'}
            </p>
          </div>
        )}

        {/* Message Display */}
        {message && (
          <div
            className={`p-3 rounded-lg text-sm ${
              message.includes('Error') || message.includes('failed')
                ? 'bg-red-50 text-red-700'
                : 'bg-green-50 text-green-700'
            }`}
          >
            {message}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
        </button>
      </form>

      {/* Toggle Sign In/Up */}
      <div className="text-center space-y-4">
        <button
          onClick={() => {
            setIsSignUp(!isSignUp);
            setMessage('');
          }}
          className="text-cyan-600 hover:text-cyan-700 font-medium transition"
        >
          {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
        </button>

        {/* Info Section */}
        {isSignUp && (
          <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 text-sm text-gray-700">
            <p className="font-semibold text-cyan-900 mb-2">What's your role?</p>
            <ul className="space-y-1 text-xs">
              <li>
                <strong>Resident:</strong> Report issues and engage with your community
              </li>
              <li>
                <strong>Advocate:</strong> Organize initiatives and mentor volunteers
              </li>
              <li>
                <strong>Staff:</strong> Manage, prioritize, and resolve issues
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthComponents;