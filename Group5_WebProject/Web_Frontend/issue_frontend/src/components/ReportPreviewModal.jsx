import React from 'react';
import {
  MapPinIcon,
  TagIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  PhotoIcon,
  XMarkIcon,
  CheckCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import './ReportPreviewModal.css';

const ReportPreviewModal = ({
  formData,
  attachments,
  onClose,
  onSubmit,
  isSubmitting,
  roleColor
}) => {
  const getCategoryLabel = (value) => {
    const categories = {
      pothole: 'Pothole / Road Damage',
      street_light: 'Street Light Issue',
      garbage: 'Garbage / Debris',
      water: 'Water / Drainage',
      graffiti: 'Graffiti',
      vegetation: 'Tree / Vegetation',
      sidewalk: 'Sidewalk Damage',
      other: 'Other'
    };
    return categories[value] || value;
  };

  const getPriorityLabel = (value) => {
    const labels = {
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      critical: 'Critical'
    };
    return labels[value] || value;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return '#ef4444';
      case 'high':
        return '#f97316';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-section">
            <CheckCircleIcon className="modal-header-icon" />
            <h2 className="modal-title">Review Your Report</h2>
          </div>
          <button
            onClick={onClose}
            className="modal-close-button"
            aria-label="Close modal"
          >
            <XMarkIcon />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Issue Title & Description */}
          <div className="preview-section">
            <h3 className="preview-section-title">Issue Details</h3>
            <div className="preview-card">
              <div className="preview-item">
                <DocumentTextIcon className="preview-icon" />
                <div>
                  <p className="preview-label">Title</p>
                  <p className="preview-value">{formData.title}</p>
                </div>
              </div>
              <div className="preview-item">
                <ExclamationTriangleIcon className="preview-icon" />
                <div>
                  <p className="preview-label">Description</p>
                  <p className="preview-value preview-description">{formData.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Classification */}
          <div className="preview-section">
            <h3 className="preview-section-title">Classification</h3>
            <div className="preview-card preview-row">
              <div className="preview-item">
                <TagIcon className="preview-icon" />
                <div>
                  <p className="preview-label">Category</p>
                  <p className="preview-value">{getCategoryLabel(formData.category)}</p>
                </div>
              </div>
              <div className="preview-item">
                <ExclamationTriangleIcon className="preview-icon" />
                <div>
                  <p className="preview-label">Priority</p>
                  <div className="preview-priority-badge" style={{ borderColor: getPriorityColor(formData.priority), backgroundColor: `${getPriorityColor(formData.priority)}15` }}>
                    <span style={{ color: getPriorityColor(formData.priority) }}>
                      {getPriorityLabel(formData.priority)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="preview-section">
            <h3 className="preview-section-title">Location</h3>
            <div className="preview-card">
              <div className="preview-item">
                <MapPinIcon className="preview-icon" />
                <div style={{ flex: 1 }}>
                  <p className="preview-label">Address</p>
                  <p className="preview-value">{formData.location.address}</p>
                </div>
              </div>
              {formData.location.latitude && formData.location.longitude && (
                <div className="preview-coordinates">
                  <div className="coordinates-dot" style={{ backgroundColor: roleColor }}></div>
                  <div>
                    <p className="coordinates-title">GPS Coordinates</p>
                    <p className="coordinates-text">
                      {formData.location.latitude.toFixed(6)}° N, {formData.location.longitude.toFixed(6)}° E
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="preview-section">
              <h3 className="preview-section-title">
                <PhotoIcon />
                Attachments ({attachments.length})
              </h3>
              <div className="preview-attachments-grid">
                {attachments.map((attachment, index) => (
                  <div key={index} className="preview-attachment-item">
                    {attachment.type === 'image' ? (
                      <img src={attachment.src} alt={attachment.name} className="preview-attachment-image" />
                    ) : (
                      <div className="preview-attachment-file">
                        <DocumentTextIcon />
                        <p>{attachment.name.split('.').pop()?.toUpperCase()}</p>
                      </div>
                    )}
                    <p className="preview-attachment-name">{attachment.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary Box */}
          <div className="preview-summary">
            <CheckCircleIcon />
            <p>All information looks good? Click <strong>Submit Report</strong> to proceed.</p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="modal-button modal-button-secondary"
          >
            Back to Edit
          </button>
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="modal-button modal-button-primary"
            style={{ backgroundColor: roleColor }}
          >
            {isSubmitting ? (
              <>
                <ArrowPathIcon className="spin" />
                Submitting...
              </>
            ) : (
              'Submit Report'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportPreviewModal;
