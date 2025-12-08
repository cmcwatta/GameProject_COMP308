import { useState, useEffect } from 'react';
import './App.css';
import IssueReportForm from './components/IssueReportForm';
import IssueList from './components/IssueList';
import IssueMap from './components/IssueMap';
import ChatbotWidget from './components/ChatbotWidget';

function App() {
  const [activeTab, setActiveTab] = useState('map');
  const [issues, setIssues] = useState([]);
  const [filters, setFilters] = useState({
    category: null,
    status: null,
    priority: null,
  });
  const [showReportForm, setShowReportForm] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  // Get user location on mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => console.log('Location access denied')
      );
    }
  }, []);

  const handleIssueCreated = (newIssue) => {
    setIssues([newIssue, ...issues]);
    setShowReportForm(false);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-green-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🌍</div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Issue Tracker
              </h1>
            </div>
            <button
              onClick={() => setShowReportForm(!showReportForm)}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition font-medium"
            >
              + Report Issue
            </button>
          </div>
        </div>
      </header>

      {/* Report Form Modal */}
      {showReportForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Report a Civic Issue</h2>
              <button
                onClick={() => setShowReportForm(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <IssueReportForm
                userLocation={userLocation}
                onSuccess={handleIssueCreated}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 bg-white/60 backdrop-blur-sm p-3 rounded-lg w-fit border border-white/80">
          {[
            { id: 'map', label: '🗺️ Map', icon: 'Map View' },
            { id: 'list', label: '📋 List', icon: 'List View' },
            { id: 'trending', label: '🔥 Trending', icon: 'Trending' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        {activeTab === 'map' && (
          <div className="space-y-4">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-md border border-white/80 overflow-hidden">
              {userLocation ? (
                <IssueMap
                  issues={issues}
                  userLocation={userLocation}
                  filters={filters}
                />
              ) : (
                <div className="h-96 flex items-center justify-center text-gray-500">
                  Loading map... Please enable location access.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'list' && (
          <div className="space-y-4">
            <IssueList
              issues={issues}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>
        )}

        {activeTab === 'trending' && (
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-8 shadow-md border border-white/80">
            <div className="text-center py-12">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Trending Issues</h3>
              <p className="text-gray-600">Top civic issues by community engagement</p>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                  <div className="text-3xl font-bold text-blue-600 mb-2">156</div>
                  <div className="text-sm text-gray-700">Pothole Reports</div>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4">
                  <div className="text-3xl font-bold text-yellow-600 mb-2">89</div>
                  <div className="text-sm text-gray-700">Streetlight Issues</div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4">
                  <div className="text-3xl font-bold text-red-600 mb-2">34</div>
                  <div className="text-sm text-gray-700">Flooding Reports</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Chatbot Widget */}
      <ChatbotWidget />

      {/* Footer */}
      <footer className="bg-white/40 backdrop-blur-sm border-t border-gray-200/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-sm text-gray-600">
          <p>Together we build better communities. Report issues, engage solutions.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
