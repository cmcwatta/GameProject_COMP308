import { useState, useEffect } from 'react';

export default function IssueList({ issues, filters, onFilterChange }) {
  const [localIssues, setLocalIssues] = useState(issues);
  const [filteredIssues, setFilteredIssues] = useState(issues);
  const [expandedId, setExpandedId] = useState(null);
  const [localFilters, setLocalFilters] = useState({
    category: null,
    status: null,
    priority: null,
    search: '',
  });

  useEffect(() => {
    setLocalIssues(issues);
  }, [issues]);

  useEffect(() => {
    let filtered = localIssues;

    if (localFilters.category) {
      filtered = filtered.filter((i) => i.category === localFilters.category);
    }
    if (localFilters.status) {
      filtered = filtered.filter((i) => i.status === localFilters.status);
    }
    if (localFilters.priority) {
      filtered = filtered.filter((i) => i.priority === localFilters.priority);
    }
    if (localFilters.search) {
      const search = localFilters.search.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.title.toLowerCase().includes(search) ||
          i.description.toLowerCase().includes(search)
      );
    }

    setFilteredIssues(filtered);
    onFilterChange(localFilters);
  }, [localFilters, localIssues]);

  const handleFilterChange = (filterKey, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [filterKey]: value || null,
    }));
  };

  const handleUpvote = async (issueId) => {
    try {
      const mutation = `
        mutation {
          upvoteIssue(issueId: "${issueId}") {
            id
            upvotes
          }
        }
      `;

      await axios.post('http://localhost:5002/graphql', { query: mutation }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      setLocalIssues((prev) =>
        prev.map((i) =>
          i.id === issueId ? { ...i, upvotes: (i.upvotes || 0) + 1 } : i
        )
      );
    } catch (err) {
      console.error('Upvote failed:', err);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Open': 'bg-blue-100 text-blue-800',
      'Assigned': 'bg-yellow-100 text-yellow-800',
      'In Progress': 'bg-purple-100 text-purple-800',
      'Resolved': 'bg-green-100 text-green-800',
      'Closed': 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Low': 'text-green-600',
      'Medium': 'text-yellow-600',
      'High': 'text-orange-600',
      'Critical': 'text-red-600',
    };
    return colors[priority] || 'text-gray-600';
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

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-md border border-white/80 space-y-4">
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Search issues..."
            value={localFilters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition text-sm"
          />

          <select
            value={localFilters.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition text-sm"
          >
            <option value="">All Categories</option>
            {['Pothole', 'Streetlight', 'Flooding', 'Safety Hazard', 'Accessibility', 'Other'].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={localFilters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition text-sm"
          >
            <option value="">All Status</option>
            {['Open', 'Assigned', 'In Progress', 'Resolved', 'Closed'].map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          <select
            value={localFilters.priority || ''}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition text-sm"
          >
            <option value="">All Priority</option>
            {['Low', 'Medium', 'High', 'Critical'].map((pri) => (
              <option key={pri} value={pri}>
                {pri}
              </option>
            ))}
          </select>
        </div>

        <div className="text-sm text-gray-600">
          Showing {filteredIssues.length} of {localIssues.length} issues
        </div>
      </div>

      {/* Issues List */}
      <div className="space-y-3">
        {filteredIssues.length === 0 ? (
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-8 text-center text-gray-500 shadow-md border border-white/80">
            <p>No issues found. Try adjusting your filters.</p>
          </div>
        ) : (
          filteredIssues.map((issue) => (
            <div
              key={issue.id}
              className="bg-white/60 backdrop-blur-sm rounded-lg shadow-md border border-white/80 overflow-hidden hover:shadow-lg transition"
            >
              {/* Issue Summary */}
              <div
                onClick={() =>
                  setExpandedId(expandedId === issue.id ? null : issue.id)
                }
                className="p-4 cursor-pointer hover:bg-white/40 transition"
              >
                <div className="flex items-start gap-4">
                  <div className="text-2xl">{getCategoryEmoji(issue.category)}</div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-gray-800">{issue.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(issue.status)}`}>
                        {issue.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {issue.description}
                    </p>
                    <div className="flex gap-3 mt-2 text-xs text-gray-500 flex-wrap">
                      <span>{issue.category}</span>
                      <span>•</span>
                      <span className={`font-medium ${getPriorityColor(issue.priority)}`}>
                        {issue.priority}
                      </span>
                      <span>•</span>
                      <span>📍 {issue.location?.city}</span>
                      <span>•</span>
                      <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpvote(issue.id);
                      }}
                      className="text-2xl hover:scale-110 transition mb-2"
                    >
                      👍 {issue.upvotes || 0}
                    </button>
                    <div className="text-xs text-gray-500">
                      {issue.commentCount || 0} comments
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === issue.id && (
                <div className="border-t border-white/50 p-4 bg-white/30 space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Full Description</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {issue.description}
                    </p>
                  </div>

                  {issue.photoUrl && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Photo</h4>
                      <img
                        src={issue.photoUrl}
                        alt="Issue"
                        className="max-w-xs rounded-lg"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600">Location</p>
                      <p className="font-medium text-gray-800">
                        {issue.location?.address}
                      </p>
                      <p className="text-sm text-gray-700">
                        {issue.location?.city}, {issue.location?.state}
                      </p>
                    </div>

                    {issue.slaDeadline && (
                      <div>
                        <p className="text-xs text-gray-600">SLA Deadline</p>
                        <p className="font-medium text-gray-800">
                          {new Date(issue.slaDeadline).toLocaleDateString()}
                        </p>
                        <p className={`text-xs font-medium ${
                          issue.slaStatus === 'On Track' ? 'text-green-600' :
                          issue.slaStatus === 'At Risk' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {issue.slaStatus}
                        </p>
                      </div>
                    )}
                  </div>

                  <button className="w-full py-2 px-4 bg-cyan-100 text-cyan-700 rounded-lg hover:bg-cyan-200 transition font-medium text-sm">
                    View Details & Comments
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
