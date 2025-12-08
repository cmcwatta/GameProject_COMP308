export default function SLAMonitor({ data }) {
  if (!data) return null;

  const categoryColors = {
    'Flooding': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', bar: 'bg-blue-400' },
    'Pothole': { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', bar: 'bg-red-400' },
    'Streetlight': { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', bar: 'bg-yellow-400' },
    'Safety Hazard': { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', bar: 'bg-orange-400' },
    'Accessibility': { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', bar: 'bg-purple-400' },
    'Other': { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', bar: 'bg-gray-400' },
  };

  return (
    <div className="space-y-6">
      {/* Overall SLA Compliance */}
      <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 shadow-md border border-white/80">
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Overall SLA Compliance</p>
            <p className="text-4xl font-bold text-green-600">{data.overallCompliance}%</p>
            <p className="text-sm text-gray-500 mt-1">This Month</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Trend:</p>
            <p className="text-lg font-bold text-green-600">↑ +3%</p>
            <p className="text-xs text-gray-500">vs last month</p>
          </div>
        </div>

        {/* Progress Ring */}
        <div className="flex justify-center mb-4">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="6" />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#22c55e"
                strokeWidth="6"
                strokeDasharray={`${2.512 * data.overallCompliance} 251.2`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-800">{data.overallCompliance}%</span>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-600">
          {data.onTrackCount} on-time • {data.atRiskCount} at-risk • {data.overdueCount} overdue
        </p>
      </div>

      {/* SLA by Category */}
      <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 shadow-md border border-white/80">
        <h3 className="text-lg font-bold text-gray-800 mb-4">SLA Performance by Category</h3>
        <div className="space-y-4">
          {Object.entries(data.byCategoryCompliance).map(([category, compliance]) => {
            const colors = categoryColors[category] || categoryColors['Other'];
            const status = compliance >= 90 ? '✅ Good' : compliance >= 75 ? '⚠️ At Risk' : '❌ Poor';
            const statusColor = compliance >= 90 ? 'text-green-600' : compliance >= 75 ? 'text-yellow-600' : 'text-red-600';

            return (
              <div key={category} className={`${colors.bg} ${colors.border} border rounded-lg p-4`}>
                <div className="flex justify-between items-center mb-2">
                  <h4 className={`font-medium ${colors.text}`}>{category}</h4>
                  <span className={`text-sm font-bold ${statusColor}`}>{status}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${colors.bar}`}
                    style={{ width: `${compliance}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-gray-600">{compliance}% compliance</span>
                  <span className="text-xs text-gray-500">SLA: {data.byCategorySLA[category]}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deadline Tracking */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50/60 backdrop-blur-sm rounded-lg p-4 shadow-md border border-green-100">
          <p className="text-sm font-bold text-green-700 mb-2">✅ On Track</p>
          <p className="text-3xl font-bold text-green-600">{data.onTrackCount}</p>
          <p className="text-xs text-gray-600 mt-1">Issues resolved within SLA</p>
        </div>

        <div className="bg-yellow-50/60 backdrop-blur-sm rounded-lg p-4 shadow-md border border-yellow-100">
          <p className="text-sm font-bold text-yellow-700 mb-2">⚠️ At Risk</p>
          <p className="text-3xl font-bold text-yellow-600">{data.atRiskCount}</p>
          <p className="text-xs text-gray-600 mt-1">Due within 24 hours</p>
        </div>

        <div className="bg-red-50/60 backdrop-blur-sm rounded-lg p-4 shadow-md border border-red-100">
          <p className="text-sm font-bold text-red-700 mb-2">❌ Overdue</p>
          <p className="text-3xl font-bold text-red-600">{data.overdueCount}</p>
          <p className="text-xs text-gray-600 mt-1">Missed SLA deadline</p>
        </div>
      </div>

      {/* Alert System */}
      <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 shadow-md border border-white/80">
        <h3 className="text-lg font-bold text-gray-800 mb-4">⏰ Critical Alerts</h3>
        <div className="space-y-2">
          {data.alerts.map((alert, i) => (
            <div key={i} className="flex items-start gap-3 pb-3 border-b border-gray-200 last:border-b-0">
              <span className="text-xl">{alert.severity === 'critical' ? '🔴' : '🟡'}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">{alert.message}</p>
                <p className="text-xs text-gray-500 mt-1">{alert.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
