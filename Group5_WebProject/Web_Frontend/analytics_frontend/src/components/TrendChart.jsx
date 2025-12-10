import React from 'react';

export default function TrendChart({ data }) {
  // Simple bar chart representation
  const maxIssues = Math.max(...data.map((d) => Math.max(d.issuesCreated, d.issuesResolved)));

  return (
    <div style={{ padding: '20px 0' }}>
      {data.map((item, index) => (
        <div key={index} style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '8px', fontSize: '0.9rem', color: '#6b7280' }}>
            {item.date}
          </div>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', height: '60px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <div
                style={{
                  width: '100%',
                  height: `${(item.issuesCreated / maxIssues) * 60}px`,
                  background: '#f59e0b',
                  borderRadius: '4px 4px 0 0',
                }}
              />
              <small style={{ marginTop: '5px', color: '#6b7280' }}>Created</small>
              <small style={{ fontWeight: 'bold', color: '#1f2937' }}>{item.issuesCreated}</small>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <div
                style={{
                  width: '100%',
                  height: `${(item.issuesResolved / maxIssues) * 60}px`,
                  background: '#10b981',
                  borderRadius: '4px 4px 0 0',
                }}
              />
              <small style={{ marginTop: '5px', color: '#6b7280' }}>Resolved</small>
              <small style={{ fontWeight: 'bold', color: '#1f2937' }}>{item.issuesResolved}</small>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
