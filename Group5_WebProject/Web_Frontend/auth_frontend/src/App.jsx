import { useState } from 'react';
import AuthComponents from './components/AuthComponents';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🏛️</div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Civic Hub
              </h1>
            </div>
            <div className="text-sm text-gray-500">Community Engagement Platform</div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="min-h-screen pt-8 pb-12">
        <div className="max-w-2xl mx-auto px-4">
          <AuthComponents />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/40 backdrop-blur-sm border-t border-gray-200/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-sm text-gray-600">
          <p>Making civic engagement fun and rewarding 🎮✨</p>
        </div>
      </footer>
    </div>
  );
}

export default App;