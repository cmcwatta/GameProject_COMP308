import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  MapPinIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();

  const features = [
    {
      icon: <ExclamationTriangleIcon className="h-8 w-8 text-blue-600" />,
      title: 'Report Issues',
      description: 'Submit and track community issues like potholes, broken streetlights, or safety hazards.',
      color: 'blue'
    },
    {
      icon: <MapPinIcon className="h-8 w-8 text-green-600" />,
      title: 'Geotag Reports',
      description: 'Pinpoint exact locations for faster response and resolution.',
      color: 'green'
    },
    {
      icon: <ChartBarIcon className="h-8 w-8 text-purple-600" />,
      title: 'Real-time Analytics',
      description: 'Track issue status, response times, and community trends.',
      color: 'purple'
    },
    {
      icon: <ChatBubbleLeftRightIcon className="h-8 w-8 text-orange-600" />,
      title: 'AI Chatbot',
      description: 'Get instant answers about municipal services and issue status.',
      color: 'orange'
    },
    {
      icon: <ClockIcon className="h-8 w-8 text-red-600" />,
      title: 'Track Progress',
      description: 'Monitor the status of your reports from submission to resolution.',
      color: 'red'
    },
    {
      icon: <CheckCircleIcon className="h-8 w-8 text-emerald-600" />,
      title: 'Verified Resolutions',
      description: 'Confirm when issues are resolved and provide feedback.',
      color: 'emerald'
    }
  ];

  const stats = [
    { value: '2,500+', label: 'Issues Resolved' },
    { value: '98%', label: 'Satisfaction Rate' },
    { value: '< 48h', label: 'Avg. Response Time' },
    { value: '15+', label: 'Municipal Departments' }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            Building Better Communities
            <span className="block text-blue-600">Together</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            A modern platform connecting residents, community advocates, and municipal staff 
            to report, track, and resolve local issues efficiently.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition shadow-lg"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition shadow-lg"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/login"
                  className="bg-white text-blue-600 border border-blue-600 px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-50 transition"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-50 py-12 rounded-2xl">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-800 mb-2">{stat.value}</div>
                <div className="text-blue-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Powerful Features for Every Role
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Designed to meet the needs of residents, community advocates, and municipal staff alike.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className={`w-16 h-16 rounded-full bg-${feature.color}-100 flex items-center justify-center mb-6`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 rounded-2xl p-8 md:p-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Three simple steps to make your community better
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-3xl font-bold text-blue-600 mx-auto mb-6">
              1
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Report</h3>
            <p className="text-gray-600">
              Submit an issue with photos and location. AI helps categorize it automatically.
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-3xl font-bold text-green-600 mx-auto mb-6">
              2
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Track</h3>
            <p className="text-gray-600">
              Follow your issue's progress with real-time updates and notifications.
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center text-3xl font-bold text-purple-600 mx-auto mb-6">
              3
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Resolve</h3>
            <p className="text-gray-600">
              Get notified when resolved and provide feedback to improve services.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Join thousands of residents and staff working together to build better communities.
          </p>
          <Link
            to={isAuthenticated ? "/dashboard" : "/register"}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-100 transition inline-block"
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Start Now - It\'s Free'}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;