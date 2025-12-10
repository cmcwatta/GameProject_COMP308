import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../shared/AuthContext';
import { useMutation } from '@apollo/client';
import { gql } from 'graphql-tag';
import toast from 'react-hot-toast';
import {
  MapPinIcon,
  PaperClipIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import './IssueReportPage.css';

const CREATE_ISSUE_MUTATION = gql`
  mutation CreateIssue($input: CreateIssueInput!) {
    createIssue(input: $input) {
      id
      title
      description
      status
      category
      priority
      location {
        address
        coordinates
      }
      createdAt
    }
  }
`;

const IssueReportPage = () => {
  const { user } = useAuth();
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const [createIssue, { loading: isSubmitting }] = useMutation(CREATE_ISSUE_MUTATION, {
    onCompleted: (data) => {
      console.log('Issue created successfully:', data);
      setSuccessData(data.createIssue);
      setIsSubmitSuccess(true);
      toast.success('✅ Issue reported successfully!');
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'pothole',
        priority: 'medium',
        location: { address: '', latitude: null, longitude: null }
      });
      setAttachments([]);
      setAttachmentPreviews([]);
      setErrors({});
    },
    onError: (error) => {
      console.error('Error submitting issue:', error);
      toast.error(`❌ ${error.message || 'Failed to submit issue. Please try again.'}`);
    }
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'pothole',
    priority: 'medium',
    location: {
      address: '',
      latitude: null,
      longitude: null
    }
  });

  const [attachments, setAttachments] = useState([]);
  const [attachmentPreviews, setAttachmentPreviews] = useState([]);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const categories = [
    { value: 'pothole', label: 'Pothole / Road Damage' },
    { value: 'street_light', label: 'Street Light Issue' },
    { value: 'garbage', label: 'Garbage / Debris' },
    { value: 'water', label: 'Water / Drainage' },
    { value: 'graffiti', label: 'Graffiti' },
    { value: 'vegetation', label: 'Tree / Vegetation' },
    { value: 'sidewalk', label: 'Sidewalk Damage' },
    { value: 'other', label: 'Other' }
  ];

  const priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' }
  ];

  useEffect(() => {
    if (!navigator.geolocation) return;
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({
          ...prev,
          location: { ...prev.location, latitude, longitude }
        }));
        toast.success('Location acquired successfully');
        setIsGettingLocation(false);
      },
      () => {
        setIsGettingLocation(false);
      }
    );
  }, []);

  const handleGetGeolocation = () => {
    if (!navigator.geolocation) return;
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({
          ...prev,
          location: { ...prev.location, latitude, longitude }
        }));
        toast.success('Location acquired successfully');
        setIsGettingLocation(false);
      },
      () => {
        setIsGettingLocation(false);
        toast.error('Location access denied');
      }
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'address') {
      setFormData(prev => ({
        ...prev,
        location: { ...prev.location, address: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const maxFileSize = 5 * 1024 * 1024;
    const validFiles = [];
    const newPreviews = [];
    let processedCount = 0;

    files.forEach(file => {
      if (file.size > maxFileSize) {
        toast.error(`File ${file.name} is too large (max 5MB)`);
        return;
      }

      validFiles.push(file);

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          newPreviews.push({ name: file.name, type: 'image', src: event.target.result });
          processedCount++;
          if (processedCount === validFiles.length) {
            setAttachmentPreviews(prev => [...prev, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      } else {
        newPreviews.push({ name: file.name, type: 'file' });
        processedCount++;
        if (processedCount === validFiles.length) {
          setAttachmentPreviews(prev => [...prev, ...newPreviews]);
        }
      }
    });

    setAttachments(prev => [...prev, ...validFiles]);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
    setAttachmentPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim() || formData.title.length < 5) newErrors.title = 'Title must be at least 5 characters';
    if (!formData.description.trim() || formData.description.length < 20) newErrors.description = 'Description must be at least 20 characters';
    if (!formData.location.address.trim()) newErrors.address = 'Location address is required';
    if (formData.location.latitude === null || formData.location.longitude === null) newErrors.location = 'Geolocation coordinates are required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    // Prepare variables for mutation
    const variables = {
      input: {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        latitude: formData.location.latitude,
        longitude: formData.location.longitude,
        address: formData.location.address,
        submitterId: user?.id,
        submitterName: user?.username
      }
    };

    // Call the mutation
    createIssue({ variables })
      .then((result) => {
        console.log('Issue created:', result.data);
        // Form will be reset by onSuccess callback
      })
      .catch((error) => {
        console.error('Error creating issue:', error);
      });
  };

  const getRoleColor = () => {
    switch (user?.role) {
      case 'resident': return '#3b82f6';
      case 'community_advocate': return '#10b981';
      case 'municipal_staff': return '#f43f5e';
      default: return '#667eea';
    }
  };

  const remainingAttachmentSlots = 5 - attachments.length;

  if (isSubmitSuccess) {
    return (
      <div className="issue-report-container">
        <div className="success-overlay">
          <div className="success-card">
            <button
              className="success-close-btn"
              onClick={() => setIsSubmitSuccess(false)}
              title="Close"
            >
              ✕
            </button>
            <div className="success-icon">✓</div>
            <h2>Issue Reported Successfully!</h2>
            <p className="success-subtitle">Thank you for reporting this issue</p>
            {successData && (
              <div className="success-details">
                <p><strong>{successData.title}</strong></p>
                <p className="issue-id">Issue ID: {successData.id?.substring(0, 8)}...</p>
                <p className="status-badge" style={{ 
                  backgroundColor: successData.status === 'open' ? '#3b82f6' : '#9ca3af' 
                }}>
                  {successData.status?.toUpperCase()}
                </p>
              </div>
            )}
            <p className="success-message">Your report has been submitted and is now visible to community members and municipal staff.</p>
            <button
              className="close-action-btn"
              onClick={() => setIsSubmitSuccess(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="issue-report-container">
      <form onSubmit={handleSubmit}>
        <div className="report-header">
          <h1>Report an Issue</h1>
          <p>Help your community by reporting problems you've noticed</p>
        </div>

        <div className="form-section">
          <h2>What's the issue?</h2>
          <div className="form-group">
            <label htmlFor="title">Issue Title *</label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Brief title of the issue"
              maxLength={100}
              className={errors.title ? 'error' : ''}
            />
            <span className="character-counter">{formData.title.length}/100</span>
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Detailed Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Provide a detailed description of the issue"
              maxLength={500}
              rows={6}
              className={errors.description ? 'error' : ''}
            />
            <span className="character-counter">{formData.description.length}/500</span>
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>
        </div>

        <div className="form-section">
          <h2>Classify the issue</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priority Level *</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
              >
                {priorities.map(pri => (
                  <option key={pri.value} value={pri.value}>{pri.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Location</h2>
          <div className="form-group">
            <label htmlFor="address">Address *</label>
            <input
              id="address"
              type="text"
              name="address"
              value={formData.location.address}
              onChange={handleInputChange}
              placeholder="Street address where issue is located"
              className={errors.address ? 'error' : ''}
            />
            {errors.address && <span className="error-message">{errors.address}</span>}
          </div>

          <div className="form-group">
            <button
              type="button"
              className="geo-button"
              onClick={handleGetGeolocation}
              disabled={isGettingLocation}
              style={{ borderColor: getRoleColor() }}
            >
              {isGettingLocation ? (
                <>
                  <ArrowPathIcon className="icon-spin" /> Getting location...
                </>
              ) : (
                <>
                  <MapPinIcon className="icon" /> Get Current Location
                </>
              )}
            </button>
          </div>

          {formData.location.latitude !== null && formData.location.longitude !== null && (
            <div className="coordinates-box">
              <CheckCircleIcon className="icon" style={{ color: '#10b981' }} />
              <div>
                <p className="coordinates-label">Coordinates</p>
                <p className="coordinates-value">{formData.location.latitude.toFixed(4)}, {formData.location.longitude.toFixed(4)}</p>
              </div>
            </div>
          )}
          {errors.location && <span className="error-message">{errors.location}</span>}
        </div>

        <div className="form-section">
          <h2>Evidence (Photos/Documents)</h2>
          <p className="section-description">Upload up to 5 files (5MB each) to support your report</p>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.txt"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />

          <button
            type="button"
            className="upload-button"
            onClick={() => fileInputRef.current?.click()}
            disabled={remainingAttachmentSlots === 0}
          >
            <PaperClipIcon className="icon" />
            Choose Files ({remainingAttachmentSlots} remaining)
          </button>

          {attachmentPreviews.length > 0 && (
            <div className="attachments-grid">
              {attachmentPreviews.map((preview, index) => (
                <div key={index} className="attachment-item">
                  {preview.type === 'image' ? (
                    <img src={preview.src} alt={preview.name} />
                  ) : (
                    <div className="file-icon">
                      <PaperClipIcon className="icon" />
                    </div>
                  )}
                  <p className="file-name">{preview.name}</p>
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeAttachment(index)}
                  >
                    <XMarkIcon className="icon" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {Object.keys(errors).length > 0 && (
          <div className="error-box">
            <ExclamationTriangleIcon className="icon" />
            <div>
              <p className="error-title">Please fix the following errors:</p>
              <ul>
                {Object.entries(errors).map(([key, message]) => (
                  <li key={key}>{message}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-button" 
            style={{ backgroundColor: getRoleColor() }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Issue Report'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default IssueReportPage;
