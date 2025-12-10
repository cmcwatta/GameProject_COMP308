import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Welcome Back to Municipal Portal
        </h1>
        <p className="text-gray-600">
          Sign in to report issues, track resolutions, and engage with your community
        </p>
      </div>

      <LoginForm />

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Need help?{' '}
          <Link to="/help" className="text-blue-600 hover:text-blue-800">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;