export default function TrendAnalysis({ data }) {
  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Trend Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-md border border-white/80">
          <p className="text-xs text-gray-600 mb-1">7-Day Trend</p>
          <p className="text-2xl font-bold text-gray-800">{data.trend7Day}%</p>
          <p className="text-xs text-red-600 font-medium">↑ Increasing issues</p>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-md border border-white/80">
          <p className="text-xs text-gray-600 mb-1">30-Day Trend</p>
          <p className="text-2xl font-bold text-gray-800">{data.trend30Day}%</p>
          <p className="text-xs text-gray-500 font-medium">→ Stable</p>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-md border border-white/80">
          <p className="text-xs text-gray-600 mb-1">90-Day Trend</p>
          <p className="text-2xl font-bold text-gray-800">{data.trend90Day}%</p>
          <p className="text-xs text-green-600 font-medium">↓ Improving</p>
        </div>
      </div>

      {/* Issue Trend Chart */}
      <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 shadow-md border border-white/80">
        <h3 className="text-lg font-bold text-gray-800 mb-4">30-Day Issue Trend</h3>
        
        {/* Simple bar chart */}
        <div className="flex items-end justify-between gap-1 h-40 bg-gray-50 p-4 rounded">
          {data.dailyTrend.map((count, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
              <div
                className="w-full bg-gradient-to-t from-cyan-500 to-blue-400 rounded-t hover:from-cyan-600 hover:to-blue-500 transition-all cursor-pointer group-hover:shadow-lg"
                style={{ height: `${(count / Math.max(...data.dailyTrend)) * 100}%`, minHeight: '4px' }}
                title={`Day ${i + 1}: ${count} issues`}
              ></div>
              <span className="text-xs text-gray-500">D{i + 1}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 text-center mt-2">
          Average: {Math.round(data.dailyTrend.reduce((a, b) => a + b) / data.dailyTrend.length)} issues/day
        </p>
      </div>

      {/* Category Trends */}
      <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 shadow-md border border-white/80">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Category Growth Trends</h3>
        <div className="space-y-4">
          {Object.entries(data.categoryTrends).map(([category, trend]) => {
            const isIncreasing = trend > 0;
            const colors = {
              'Flooding': 'from-blue-400 to-blue-600',
              'Pothole': 'from-red-400 to-red-600',
              'Streetlight': 'from-yellow-400 to-yellow-600',
              'Safety Hazard': 'from-orange-400 to-orange-600',
              'Accessibility': 'from-purple-400 to-purple-600',
              'Other': 'from-gray-400 to-gray-600',
            };

            return (
              <div key={category}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{category}</span>
                  <span className={`text-sm font-bold ${isIncreasing ? 'text-red-600' : 'text-green-600'}`}>
                    {isIncreasing ? '↑' : '↓'} {Math.abs(trend)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${colors[category] || colors['Other']}`}
                    style={{ width: `${Math.min(Math.abs(trend), 100)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Predictions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50/60 backdrop-blur-sm rounded-lg p-6 shadow-md border border-blue-100">
          <h3 className="text-lg font-bold text-blue-700 mb-4">🔮 Next Week Prediction</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Expected Issue Count</p>
              <p className="text-2xl font-bold text-blue-600">127-156</p>
              <p className="text-xs text-gray-600">Based on historical patterns</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Most Likely Spike</p>
              <p className="text-lg font-bold text-blue-600">💧 Flooding (+42%)</p>
              <p className="text-xs text-gray-600">Heavy rain forecasted</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50/60 backdrop-blur-sm rounded-lg p-6 shadow-md border border-purple-100">
          <h3 className="text-lg font-bold text-purple-700 mb-4">🎯 Recommended Actions</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span>→</span>
              <span>Pre-position staff for flooding (downtown district)</span>
            </li>
            <li className="flex items-start gap-2">
              <span>→</span>
              <span>Increase chatbot flooding assistance</span>
            </li>
            <li className="flex items-start gap-2">
              <span>→</span>
              <span>Schedule extra teams for Pothole repairs</span>
            </li>
            <li className="flex items-start gap-2">
              <span>→</span>
              <span>Prepare emergency communication channels</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Seasonal Insights */}
      <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 shadow-md border border-white/80">
        <h3 className="text-lg font-bold text-gray-800 mb-4">📈 Seasonal Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Winter (Nov-Feb)</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p>• 40% more pothole reports</p>
              <p>• 25% increase in streetlight issues</p>
              <p>• Salt damage acceleration</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Summer (May-Aug)</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p>• 60% surge in flooding reports</p>
              <p>• Heat-related accessibility issues</p>
              <p>• Construction-related delays</p>
            </div>
          </div>
        </div>
      </div>

      {/* Resolution Time Trends */}
      <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 shadow-md border border-white/80">
        <h3 className="text-lg font-bold text-gray-800 mb-4">⏱️ Resolution Time Trends</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-sm text-gray-700 mb-1">Fastest</p>
            <p className="text-2xl font-bold text-green-600">2.1 days</p>
            <p className="text-xs text-gray-600">💧 Flooding issues</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <p className="text-sm text-gray-700 mb-1">Average</p>
            <p className="text-2xl font-bold text-yellow-600">4.2 days</p>
            <p className="text-xs text-gray-600">All categories</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <p className="text-sm text-gray-700 mb-1">Slowest</p>
            <p className="text-2xl font-bold text-orange-600">6.5 days</p>
            <p className="text-xs text-gray-600">♿ Accessibility issues</p>
          </div>
        </div>
      </div>
    </div>
  );
}
