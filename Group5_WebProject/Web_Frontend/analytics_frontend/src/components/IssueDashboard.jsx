export default function IssueDashboard({ data }) {
  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-md border border-white/80">
          <p className="text-xs text-gray-600 mb-1">Total Issues</p>
          <p className="text-2xl font-bold text-gray-800">{data.summary.totalIssues}</p>
          <p className="text-xs text-gray-500 mt-2">All time</p>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-md border border-white/80">
          <p className="text-xs text-gray-600 mb-1">Open</p>
          <p className="text-2xl font-bold text-blue-600">{data.summary.openIssues}</p>
          <p className="text-xs text-gray-500 mt-2">Needs action</p>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-md border border-white/80">
          <p className="text-xs text-gray-600 mb-1">Resolved</p>
          <p className="text-2xl font-bold text-green-600">{data.summary.resolvedIssues}</p>
          <p className="text-xs text-gray-500 mt-2">Closed</p>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-md border border-white/80">
          <p className="text-xs text-gray-600 mb-1">Avg Resolution</p>
          <p className="text-2xl font-bold text-gray-800">{data.summary.avgResolutionTime}</p>
          <p className="text-xs text-gray-500 mt-2">Time to resolve</p>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-md border border-white/80">
          <p className="text-xs text-gray-600 mb-1">SLA Compliance</p>
          <p className="text-2xl font-bold text-green-600">{data.summary.slaCompliance}%</p>
          <p className="text-xs text-gray-500 mt-2">On-time resolution</p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 shadow-md border border-white/80">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Issues by Category</h3>
        <div className="space-y-3">
          {Object.entries(data.categoryBreakdown).map(([category, count]) => {
            const total = Object.values(data.categoryBreakdown).reduce((a, b) => a + b, 0);
            const percentage = Math.round((count / total) * 100);
            const colors = {
              'Pothole': 'bg-red-400',
              'Streetlight': 'bg-yellow-400',
              'Flooding': 'bg-blue-400',
              'Safety Hazard': 'bg-orange-400',
              'Accessibility': 'bg-purple-400',
              'Other': 'bg-gray-400',
            };

            return (
              <div key={category}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">{category}</span>
                  <span className="text-sm font-bold text-gray-800">{count} ({percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${colors[category] || 'bg-gray-400'}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Staff Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 shadow-md border border-white/80">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Staff Performance</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Total Staff</span>
              <span className="font-bold text-gray-800">{data.staffMetrics.totalStaff}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Active Now</span>
              <span className="font-bold text-green-600">{data.staffMetrics.activeStaff}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Avg Issues/Staff</span>
              <span className="font-bold text-gray-800">{data.staffMetrics.avgIssuesPerStaff}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Response Time</span>
              <span className="font-bold text-gray-800">{data.staffMetrics.responseTime}</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 shadow-md border border-white/80">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {data.recentActivity.map((activity) => (
              <div key={activity.id} className="pb-3 border-b border-gray-200 last:border-b-0">
                <div className="flex items-start gap-2">
                  <span className="text-lg">
                    {activity.type === 'Issue Created' ? '🆕' :
                     activity.type === 'Status Updated' ? '✅' :
                     '⚠️'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
