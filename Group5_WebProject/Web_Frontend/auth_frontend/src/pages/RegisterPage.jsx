import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage = () => {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Join Your Community Portal
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Create an account to report local issues, track resolutions, and connect with municipal services.
          Choose your role to get started.
        </p>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-blue-600 text-2xl">🏡</span>
          </div>
          <h3 className="font-semibold text-lg mb-2">Resident</h3>
          <p className="text-gray-600 text-sm mb-4">
            Report issues, track status, receive alerts
          </p>
          <Link 
            to="/register?role=resident" 
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Register as Resident →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-green-600 text-2xl">👥</span>
          </div>
          <h3 className="font-semibold text-lg mb-2">Community Advocate</h3>
          <p className="text-gray-600 text-sm mb-4">
            Monitor trends, support residents, coordinate initiatives
          </p>
          <Link 
            to="/register?role=community_advocate" 
            className="text-green-600 hover:text-green-800 text-sm font-medium"
          >
            Register as Advocate →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">🏛️</span>
          </div>
          <h3 className="font-semibold text-lg mb-2">Municipal Staff</h3>
          <p className="text-gray-600 text-sm mb-4">
            Manage issues, update status, provide resolutions
          </p>
          <Link 
            to="/register?role=municipal_staff" 
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Register as Staff →
          </Link>
        </div>
      </div>

      <RegisterForm />

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;