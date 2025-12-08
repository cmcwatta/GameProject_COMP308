import React, { useState, useEffect } from 'react';
import './App.css';
import IssueDashboard from './components/IssueDashboard';
import HeatmapView from './components/HeatmapView';
import ChatbotInterface from './components/ChatbotInterface';
import SLAMonitor from './components/SLAMonitor';
import TrendAnalysis from './components/TrendAnalysis';

/**
 * Analytics Frontend - Staff Dashboard
 * Real-time civic issue management and analytics
 */
function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [timeRange, setTimeRange] = useState('30days');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);

        // Mock data for analytics dashboard
        const mockData = {
          summary: {
            totalIssues: 456,
            openIssues: 123,
            resolvedIssues: 289,
            avgResolutionTime: '3.2 days',
            slaCompliance: 87,
          },
          categoryBreakdown: {
            'Pothole': 156,
            'Streetlight': 89,
            'Flooding': 34,
            'Safety Hazard': 98,
            'Accessibility': 45,
            'Other': 34,
          },
          recentActivity: [
            { id: 1, type: 'Issue Created', title: 'Large pothole on Main St', time: '5 mins ago' },
            { id: 2, type: 'Status Updated', title: 'Streetlight repaired on Oak Ave', time: '15 mins ago' },
            { id: 3, type: 'SLA Alert', title: 'Critical: Flooding issue approaching deadline', time: '1 hour ago' },
          ],
          staffMetrics: {
            totalStaff: 12,
            activeStaff: 8,
            avgIssuesPerStaff: 9.5,
            responseTime: '2.1 hours',
          },
          criticalZones: [
            { name: 'Downtown District', issueCount: 42 },
            { name: 'Waterfront Area', issueCount: 28 },
            { name: 'Industrial Zone', issueCount: 18 },
          ],
          atRiskZones: [
            { name: 'North Bridge', issueCount: 15 },
            { name: 'East Side', issueCount: 12 },
          ],
          overallCompliance: 87,
          onTrackCount: 267,
          atRiskCount: 34,
          overdueCount: 23,
          byCategoryCompliance: {
            'Flooding': 95,
            'Pothole': 81,
            'Streetlight': 88,
            'Safety Hazard': 85,
            'Accessibility': 72,
            'Other': 80,
          },
          byCategorySLA: {
            'Flooding': '24 hours',
            'Pothole': '120 hours',
            'Streetlight': '72 hours',
            'Safety Hazard': '48 hours',
            'Accessibility': '96 hours',
            'Other': '144 hours',
          },
          alerts: [
            { severity: 'critical', message: '8 flooding issues overdue', action: 'Immediate escalation needed' },
            { severity: 'warning', message: '5 safety issues approaching deadline', action: 'Assign additional staff' },
            { severity: 'warning', message: '3 accessibility issues overdue', action: 'Schedule follow-up' },
          ],
          trend7Day: 12,
          trend30Day: 5,
          trend90Day: -8,
          dailyTrend: [18, 22, 19, 25, 28, 21, 32, 26, 29, 24, 33, 27, 31, 25, 28, 32, 26, 29, 24, 27, 30, 25, 29, 26, 31, 28, 32, 27, 30, 25],
          categoryTrends: {
            'Flooding': 8,
            'Pothole': -3,
            'Streetlight': 2,
            'Safety Hazard': 5,
            'Accessibility': -2,
            'Other': 1,
          },
        };

        setAnalyticsData(mockData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load analytics');
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange, selectedCategory]);

  const userRole = localStorage.getItem('userRole') || 'Municipal Staff';
  const isStaff = userRole === 'Municipal Staff';

  if (!isStaff) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-green-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
          <div className="text-4xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Staff Only</h1>
          <p className="text-gray-600 mb-6">
            The analytics dashboard is only available to municipal staff members.
          </p>
          <a
            href="/issues"
            className="inline-block px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
          >
            Back to Issues
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-green-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="text-2xl">📊</div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Staff Analytics
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none text-sm"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="alltime">All Time</option>
              </select>
              <div className="text-sm text-gray-600">
                👤 {userRole}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white/40 backdrop-blur-sm border-b border-white/80 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {[
              { id: 'dashboard', label: '📈 Dashboard', icon: 'dashboard' },
              { id: 'heatmap', label: '🗺️ Heatmap', icon: 'map' },
              { id: 'sla', label: '⏰ SLA Monitor', icon: 'clock' },
              { id: 'trends', label: '📉 Trends', icon: 'chart' },
              { id: 'chatbot', label: '🤖 AI Insights', icon: 'ai' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`px-4 py-3 font-medium whitespace-nowrap transition border-b-2 ${
                  activeView === tab.id
                    ? 'border-cyan-600 text-cyan-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">Loading analytics...</div>
          </div>
        ) : (
          <>
            {activeView === 'dashboard' && analyticsData && (
              <IssueDashboard data={analyticsData} />
            )}

            {activeView === 'heatmap' && analyticsData && (
              <HeatmapView data={analyticsData} selectedCategory={selectedCategory} />
            )}

            {activeView === 'sla' && analyticsData && (
              <SLAMonitor data={analyticsData} />
            )}

            {activeView === 'trends' && analyticsData && (
              <TrendAnalysis data={analyticsData} timeRange={timeRange} />
            )}

            {activeView === 'chatbot' && analyticsData && (
              <ChatbotInterface data={analyticsData} />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/40 backdrop-blur-sm border-t border-gray-200/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-sm text-gray-600">
          <p>Staff Dashboard • Real-time civic issue management and analytics</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
