import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_ISSUE } from '../graphql/queries';
import './IssueReportingForm.css';

const CATEGORIES = [
  { value: 'ACCESSIBILITY', label: '♿ Accessibility' },
  { value: 'SAFETY', label: '🚨 Safety' },
  { value: 'INFRASTRUCTURE', label: '🏗️ Infrastructure' },
  { value: 'CLEANLINESS', label: '🧹 Cleanliness' },
  { value: 'TRAFFIC', label: '🚗 Traffic' },
  { value: 'OTHER', label: '⭐ Other' },
];

export default function IssueReportingForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'ACCESSIBILITY',
    latitude: null,
    longitude: null,
    address: '',
  });
  const [geolocationError, setGeolocationError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const [createIssue] = useMutation(CREATE_ISSUE, {
    onCompleted: (data) => {
      setSuccess('Issue reported successfully!');
      setFormData({
        title: '',
        description: '',
        category: 'ACCESSIBILITY',
        latitude: null,
        longitude: null,
        address: '',
      });
      setTimeout(() => setSuccess(''), 5000);
    },
    onError: (err) => {
      console.error('Error creating issue:', err);
    },
  });

  useEffect(() => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
        },
        (error) => {
          setGeolocationError('Unable to get your location. Please enter address manually.');
        }
      );
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.latitude || !formData.longitude) {
      setGeolocationError('Location is required. Please enable geolocation.');
      setLoading(false);
      return;
    }

    try {
      await createIssue({
        variables: {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          address: formData.address,
        },
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="issue-form-container">
      <div className="issue-form-card">
        <h2>Report an Issue</h2>
        <p className="subtitle">Help us improve our community by reporting accessibility and infrastructure issues</p>

        {success && <div className="success-message">{success}</div>}
        {geolocationError && <div className="error-message">{geolocationError}</div>}

        <form onSubmit={handleSubmit} className="issue-form">
          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="title">Issue Title *</label>
            <input
              id="title"
              type="text"
              name="title"
              placeholder="Brief description of the issue"
              value={formData.title}
              onChange={handleChange}
              disabled={loading}
              required
              maxLength={120}
            />
            <small>{formData.title.length}/120</small>
          </div>

          <div className="form-group">
            <label htmlFor="description">Detailed Description *</label>
            <textarea
              id="description"
              name="description"
              placeholder="Provide detailed information about the issue..."
              value={formData.description}
              onChange={handleChange}
              disabled={loading}
              required
              maxLength={1000}
              rows={5}
            />
            <small>{formData.description.length}/1000</small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="latitude">Latitude</label>
              <input
                id="latitude"
                type="number"
                name="latitude"
                placeholder="Latitude"
                value={formData.latitude || ''}
                onChange={handleChange}
                step="0.0001"
                readOnly
              />
              {formData.latitude && <small>✓ Location detected</small>}
            </div>

            <div className="form-group">
              <label htmlFor="longitude">Longitude</label>
              <input
                id="longitude"
                type="number"
                name="longitude"
                placeholder="Longitude"
                value={formData.longitude || ''}
                onChange={handleChange}
                step="0.0001"
                readOnly
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              type="text"
              name="address"
              placeholder="Street address (optional)"
              value={formData.address}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Reporting...' : 'Report Issue'}
          </button>
        </form>

        <div className="form-info">
          <h4>Why Report Issues?</h4>
          <ul>
            <li>📍 Help authorities identify and prioritize community needs</li>
            <li>🤝 Connect with other residents experiencing similar issues</li>
            <li>🎯 Get AI-powered suggestions and updates on resolution</li>
            <li>♿ Improve accessibility for everyone in the community</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
