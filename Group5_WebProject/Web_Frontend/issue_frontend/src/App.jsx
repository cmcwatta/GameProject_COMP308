import { useState } from 'react'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('issues')

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🐛</div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Issue Tracker
              </h1>
            </div>
            <div className="text-sm font-medium text-gray-600">Report & Track Community Issues</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 bg-white/50 backdrop-blur-sm p-2 rounded-lg w-fit">
          {['issues', 'my-reports', 'trending'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md font-medium transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              {tab === 'issues' && '📋 All Issues'}
              {tab === 'my-reports' && '📝 My Reports'}
              {tab === 'trending' && '🔥 Trending'}
            </button>
          ))}
        </div>

        {/* Content Placeholder */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-8 shadow-sm border border-white/80">
          <p className="text-gray-600 text-center py-12">Issue tracking interface loading...</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/40 backdrop-blur-sm border-t border-gray-200/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-sm text-gray-600">
          <p>Help improve your community by reporting and resolving issues 🌟</p>
        </div>
      </footer>
    </div>
  )
}

export default App
