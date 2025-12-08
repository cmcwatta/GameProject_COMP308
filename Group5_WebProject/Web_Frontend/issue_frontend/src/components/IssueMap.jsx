import { useEffect, useState } from 'react';

export default function IssueMap({ issues, userLocation, filters }) {
  const [mapInitialized, setMapInitialized] = useState(false);

  useEffect(() => {
    // In a real implementation, you would initialize Mapbox GL or Google Maps here
    // For now, we'll show a grid-based map view
    setMapInitialized(true);
  }, []);

  const getCategoryColor = (category) => {
    const colors = {
      'Pothole': '#EF4444',
      'Streetlight': '#FBBF24',
      'Flooding': '#0EA5E9',
      'Safety Hazard': '#F97316',
      'Accessibility': '#8B5CF6',
      'Other': '#6B7280',
    };
    return colors[category] || '#6B7280';
  };

  const getCategoryEmoji = (category) => {
    const emojis = {
      'Pothole': '🕳️',
      'Streetlight': '💡',
      'Flooding': '💧',
      'Safety Hazard': '⚠️',
      'Accessibility': '♿',
      'Other': '📌',
    };
    return emojis[category] || '📌';
  };

  const filteredIssues = issues.filter((issue) => {
    if (filters.category && issue.category !== filters.category) return false;
    if (filters.status && issue.status !== filters.status) return false;
    if (filters.priority && issue.priority !== filters.priority) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Map Legend */}
      <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-md border border-white/80">
        <h3 className="font-semibold text-gray-800 mb-3">Categories</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {['Pothole', 'Streetlight', 'Flooding', 'Safety Hazard', 'Accessibility', 'Other'].map(
            (category) => (
              <div key={category} className="flex items-center gap-2">
                <span className="text-2xl">{getCategoryEmoji(category)}</span>
                <span className="text-xs text-gray-700">{category}</span>
              </div>
            )
          )}
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-white/60 backdrop-blur-sm rounded-lg overflow-hidden shadow-md border border-white/80">
        {mapInitialized ? (
          <div className="relative w-full bg-gradient-to-br from-blue-100 to-cyan-50 h-96 flex items-center justify-center">
            {/* Map Grid with Issues */}
            <div className="w-full h-full relative overflow-hidden">
              {/* User Location */}
              {userLocation && (
                <div
                  className="absolute w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-lg"
                  style={{
                    left: `${((userLocation.lng + 180) / 360) * 100}%`,
                    top: `${((90 - userLocation.lat) / 180) * 100}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  title="Your Location"
                >
                  <div className="absolute inset-0 bg-blue-500 rounded-full animate-pulse opacity-75"></div>
                </div>
              )}

              {/* Issues */}
              {filteredIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="absolute w-8 h-8 rounded-full shadow-lg cursor-pointer hover:scale-125 transition transform -translate-x-1/2 -translate-y-1/2 group"
                  style={{
                    left: `${((issue.location.geopoint.coordinates[0] + 180) / 360) * 100}%`,
                    top: `${((90 - issue.location.geopoint.coordinates[1]) / 180) * 100}%`,
                    backgroundColor: getCategoryColor(issue.category),
                  }}
                  title={issue.title}
                >
                  <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity -top-12 left-0 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap pointer-events-none">
                    {issue.title}
                  </div>
                </div>
              ))}

              {/* Map Info */}
              {filteredIssues.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-center px-4">
                  <p>No issues found in the current filters. Try adjusting your search criteria.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-96 flex items-center justify-center text-gray-500">
            Loading map...
          </div>
        )}
      </div>

      {/* Issues Summary */}
      <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-md border border-white/80">
        <h3 className="font-semibold text-gray-800 mb-3">
          Issues in View ({filteredIssues.length})
        </h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {filteredIssues.length === 0 ? (
            <p className="text-gray-600 text-sm">No issues to display</p>
          ) : (
            filteredIssues.map((issue) => (
              <div
                key={issue.id}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/40 transition text-sm"
              >
                <span>{getCategoryEmoji(issue.category)}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">{issue.title}</p>
                  <p className="text-xs text-gray-600">{issue.location?.city}</p>
                </div>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded whitespace-nowrap">
                  {issue.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Note */}
      <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3 text-xs text-cyan-800">
        💡 In production, this map would use Mapbox GL JS or Google Maps for full interactive features.
      </div>
    </div>
  );
}
