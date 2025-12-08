export default function HeatmapView({ data }) {
  if (!data) return null;

  const categories = ['Flooding', 'Pothole', 'Streetlight', 'Safety Hazard', 'Accessibility', 'Other'];
  const categoryEmojis = {
    'Flooding': '💧',
    'Pothole': '🕳️',
    'Streetlight': '💡',
    'Safety Hazard': '⚠️',
    'Accessibility': '♿',
    'Other': '📍',
  };

  return (
    <div className="space-y-6">
      {/* Heatmap Instructions */}
      <div className="bg-blue-50/60 backdrop-blur-sm rounded-lg p-4 shadow-md border border-blue-100">
        <p className="text-sm text-gray-700">
          🗺️ <strong>Geolocation Heatmap:</strong> Darker colors indicate higher concentration of issues. Filter by category to see specific problem hotspots in your city.
        </p>
      </div>

      {/* Category Filter */}
      <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-md border border-white/80">
        <p className="text-sm font-medium text-gray-700 mb-3">Filter by Category</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              className="px-3 py-1 text-sm rounded-full bg-white border-2 border-gray-300 text-gray-700 hover:border-cyan-500 hover:bg-cyan-50 transition-all"
            >
              {categoryEmojis[cat]} {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid-Based Heatmap Visualization */}
      <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 shadow-md border border-white/80">
        <p className="text-sm font-medium text-gray-700 mb-4">Issue Density Heatmap</p>
        
        {/* Simple grid heatmap */}
        <div className="grid grid-cols-6 gap-1 bg-gray-100 p-4 rounded">
          {Array.from({ length: 36 }).map((_, i) => {
            const randomIntensity = Math.random();
            const bgColor = 
              randomIntensity > 0.8 ? 'bg-red-600' :
              randomIntensity > 0.6 ? 'bg-orange-500' :
              randomIntensity > 0.4 ? 'bg-yellow-400' :
              randomIntensity > 0.2 ? 'bg-lime-400' :
              'bg-blue-300';

            return (
              <div
                key={i}
                className={`aspect-square ${bgColor} rounded opacity-75 hover:opacity-100 transition-opacity cursor-pointer`}
                title={`Zone ${i + 1}: ${Math.floor(randomIntensity * 50)} issues`}
              ></div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center gap-4 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-300 rounded"></div>
            <span className="text-xs text-gray-600">Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-lime-400 rounded"></div>
            <span className="text-xs text-gray-600">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
            <span className="text-xs text-gray-600">High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 rounded"></div>
            <span className="text-xs text-gray-600">Critical</span>
          </div>
        </div>
      </div>

      {/* Risk Zones Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-red-50/60 backdrop-blur-sm rounded-lg p-4 shadow-md border border-red-100">
          <p className="text-sm font-bold text-red-700 mb-2">🔴 Critical Zones</p>
          <ul className="text-xs text-gray-700 space-y-1">
            {data.criticalZones.map((zone, i) => (
              <li key={i}>• {zone.name} - {zone.issueCount} issues</li>
            ))}
          </ul>
        </div>

        <div className="bg-yellow-50/60 backdrop-blur-sm rounded-lg p-4 shadow-md border border-yellow-100">
          <p className="text-sm font-bold text-yellow-700 mb-2">🟡 At-Risk Zones</p>
          <ul className="text-xs text-gray-700 space-y-1">
            {data.atRiskZones.map((zone, i) => (
              <li key={i}>• {zone.name} - {zone.issueCount} issues</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
