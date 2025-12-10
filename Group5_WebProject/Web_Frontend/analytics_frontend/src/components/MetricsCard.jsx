import React from 'react';

export default function MetricsCard({ title, value, icon, color, percentage }) {
  return (
    <div className="metrics-card" style={{ borderTop: `4px solid ${color}` }}>
      <div className="metrics-card-icon">{icon}</div>
      <div className="metrics-card-title">{title}</div>
      <div className="metrics-card-value" style={{ color }}>
        {value}
      </div>
      {percentage !== undefined && (
        <div className="metrics-card-percentage">
          {percentage.toFixed(1)}% of total
        </div>
      )}
    </div>
  );
}
