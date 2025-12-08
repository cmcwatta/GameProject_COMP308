import { useState } from 'react';

export default function IssueReportForm({ userLocation, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Pothole',
    priority: 'Medium',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    latitude: userLocation?.lat || '',
    longitude: userLocation?.lng || '',
    photoUrl: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [aiClassification, setAiClassification] = useState(null);

  const categories = [
    'Pothole',
    'Streetlight',
    'Flooding',
    'Safety Hazard',
    'Accessibility',
    'Other',
  ];

  const priorities = ['Low', 'Medium', 'High', 'Critical'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getAiClassification = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5003/api/classify/issue',
        {
          title: formData.title,
          description: formData.description,
        }
      );
      setAiClassification(response.data.classification);
      setFormData((prev) => ({
        ...prev,
        category: response.data.classification.category,
        priority: response.data.classification.priority,
      }));
    } catch (err) {
      console.error('AI classification failed:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const mutation = `
        mutation {
          createIssue(
            title: "${formData.title.replace(/"/g, '\\"')}"
            description: "${formData.description.replace(/"/g, '\\"')}"
            category: "${formData.category}"
            priority: "${formData.priority}"
            address: "${formData.address}"
            city: "${formData.city}"
            state: "${formData.state || ''}"
            postalCode: "${formData.postalCode || ''}"
            latitude: ${formData.latitude}
            longitude: ${formData.longitude}
            photoUrl: "${formData.photoUrl || ''}"
          ) {
            id
            title
            description
            category
            priority
            status
            location {
              address
              city
            }
            createdAt
          }
        }
      `;

      const response = await fetch(
        'http://localhost:4002/graphql',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken') || ''}`,
          },
          body: JSON.stringify({ query: mutation }),
        }
      );

      const data = await response.json();
      if (data.errors) {
        setError(data.errors[0].message);
      } else {
        onSuccess(data.data.createIssue);
      }
    } catch (err) {
      setError('Failed to create issue. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const useCurrentLocation = () => {
    if (userLocation) {
      setFormData((prev) => ({
        ...prev,
        latitude: userLocation.lat,
        longitude: userLocation.lng,
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Issue Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Brief description of the issue"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Detailed Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Provide detailed information about the issue..."
          rows="4"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
        />
      </div>

      {/* AI Classification */}
      {formData.title && formData.description && (
        <button
          type="button"
          onClick={getAiClassification}
          className="w-full py-2 px-4 bg-cyan-100 text-cyan-700 rounded-lg hover:bg-cyan-200 transition font-medium text-sm"
        >
          🤖 Get AI Classification
        </button>
      )}

      {aiClassification && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm text-gray-700">
            <p>
              <strong>Category:</strong> {aiClassification.category} (
              {(aiClassification.confidence * 100).toFixed(0)}% confidence)
            </p>
            <p>
              <strong>Priority:</strong> {aiClassification.priority}
            </p>
            <p className="text-xs text-gray-600 mt-2">{aiClassification.reasoning}</p>
          </div>
        </div>
      )}

      {/* Category & Priority Row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
          >
            {priorities.map((pri) => (
              <option key={pri} value={pri}>
                {pri}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Location Section */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-800">📍 Location</h3>
          {userLocation && (
            <button
              type="button"
              onClick={useCurrentLocation}
              className="text-xs bg-cyan-100 text-cyan-700 px-3 py-1 rounded hover:bg-cyan-200 transition"
            >
              Use Current Location
            </button>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Street Address *
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="123 Main Street"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State/Province
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Postal Code
          </label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            placeholder="ZIP Code"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Latitude
            </label>
            <input
              type="number"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              step="0.0001"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Longitude
            </label>
            <input
              type="number"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              step="0.0001"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition text-sm"
            />
          </div>
        </div>
      </div>

      {/* Photo URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Photo URL (Optional)
        </label>
        <input
          type="url"
          name="photoUrl"
          value={formData.photoUrl}
          onChange={handleChange}
          placeholder="https://example.com/photo.jpg"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Submitting...' : '✓ Report Issue'}
      </button>
    </form>
  );
}
