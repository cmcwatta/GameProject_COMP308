import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { 
  Bars3Icon, 
  XMarkIcon, 
  UserCircleIcon, 
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'municipal_staff':
        return 'bg-blue-100 text-blue-800';
      case 'community_advocate':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'municipal_staff':
        return 'Municipal Staff';
      case 'community_advocate':
        return 'Community Advocate';
      default:
        return 'Resident';
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="text-xl font-bold text-gray-800">
                Municipal Portal
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition">
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 transition">
                  Dashboard
                </Link>
                
                {user?.role === 'admin' && (
                  <Link to="/admin" className="text-gray-600 hover:text-blue-600 transition">
                    Admin Panel
                  </Link>
                )}
                
                {user?.role === 'municipal_staff' && (
                  <Link to="/staff" className="text-gray-600 hover:text-blue-600 transition">
                    Staff Portal
                  </Link>
                )}
                
                {user?.role === 'community_advocate' && (
                  <Link to="/advocate" className="text-gray-600 hover:text-blue-600 transition">
                    Advocate Hub
                  </Link>
                )}

                {/* User Menu */}
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center space-x-2 focus:outline-none">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <UserCircleIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-700">{user?.username}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor(user?.role)}`}>
                          {getRoleDisplayName(user?.role)}
                        </span>
                      </div>
                    </div>
                  </Menu.Button>
                  
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/profile"
                            className={`${
                              active ? 'bg-gray-100' : ''
                            } flex items-center px-4 py-2 text-sm text-gray-700`}
                          >
                            <UserCircleIcon className="h-4 w-4 mr-3" />
                            Your Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/settings"
                            className={`${
                              active ? 'bg-gray-100' : ''
                            } flex items-center px-4 py-2 text-sm text-gray-700`}
                          >
                            <Cog6ToothIcon className="h-4 w-4 mr-3" />
                            Settings
                          </Link>
                        )}
                      </Menu.Item>
                      <div className="border-t border-gray-200 my-1"></div>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={`${
                              active ? 'bg-gray-100' : ''
                            } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                          >
                            <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-600 hover:text-gray-900"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="space-y-3">
              <Link
                to="/"
                className="block text-gray-600 hover:text-blue-600 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block text-gray-600 hover:text-blue-600 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="block text-gray-600 hover:text-blue-600 py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  
                  {user?.role === 'municipal_staff' && (
                    <Link
                      to="/staff"
                      className="block text-gray-600 hover:text-blue-600 py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Staff Portal
                    </Link>
                  )}
                  
                  {user?.role === 'community_advocate' && (
                    <Link
                      to="/advocate"
                      className="block text-gray-600 hover:text-blue-600 py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Advocate Hub
                    </Link>
                  )}
                  
                  <Link
                    to="/profile"
                    className="block text-gray-600 hover:text-blue-600 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left text-red-600 hover:text-red-800 py-2"
                  >
                    Sign Out
                  </button>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                      Logged in as <span className="font-medium">{user?.username}</span>
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${getRoleBadgeColor(user?.role)}`}>
                      {getRoleDisplayName(user?.role)}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block text-gray-600 hover:text-blue-600 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;