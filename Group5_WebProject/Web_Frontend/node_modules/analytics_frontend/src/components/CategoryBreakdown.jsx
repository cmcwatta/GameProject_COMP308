import React from 'react';

export default function CategoryBreakdown({ data }) {
  return (
    <div className="category-list">
      {data.map((item) => (
        <div key={item.category} className="category-item">
          <span className="category-name">{item.category}</span>
          <div className="category-bar">
            <div
              className="category-progress"
              style={{ width: `${item.percentage}%` }}
            />
          </div>
          <span className="category-count">{item.count}</span>
        </div>
      ))}
    </div>
  );
}
