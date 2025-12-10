import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_DASHBOARD_METRICS, GET_TREND_ANALYSIS } from '../graphql/queries';
import MetricsCard from './MetricsCard';
import CategoryBreakdown from './CategoryBreakdown';
import TrendChart from './TrendChart';
import './Dashboard.css';

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState('7d'); // 7 days, 30 days, etc

  const { data: metricsData, loading: metricsLoading, error: metricsError } =
    useQuery(GET_DASHBOARD_METRICS);

  const { data: trendData, loading: trendLoading } =
    useQuery(GET_TREND_ANALYSIS, {
      variables: { timeframe },
    });

  const metrics = metricsData?.getDashboardMetrics;
  const trends = trendData?.getTrendAnalysis;

  if (metricsLoading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  if (metricsError) {
    return <div className="dashboard-error">Error loading dashboard: {metricsError.message}</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>📊 Community Dashboard</h1>
        <p className="subtitle">Monitor and manage civic issues in your community</p>

        <div className="timeframe-selector">
          <button
            className={`timeframe-btn ${timeframe === '7d' ? 'active' : ''}`}
            onClick={() => setTimeframe('7d')}
          >
            7 Days
          </button>
          <button
            className={`timeframe-btn ${timeframe === '30d' ? 'active' : ''}`}
            onClick={() => setTimeframe('30d')}
          >
            30 Days
          </button>
          <button
            className={`timeframe-btn ${timeframe === '90d' ? 'active' : ''}`}
            onClick={() => setTimeframe('90d')}
          >
            90 Days
          </button>
          <button
            className={`timeframe-btn ${timeframe === '1y' ? 'active' : ''}`}
            onClick={() => setTimeframe('1y')}
          >
            1 Year
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-section">
        <h2>Key Metrics</h2>
        <div className="metrics-grid">
          <MetricsCard
            title="Total Issues"
            value={metrics?.totalIssues || 0}
            icon="📝"
            color="#3b82f6"
          />
          <MetricsCard
            title="Resolved"
            value={metrics?.resolvedIssues || 0}
            icon="✅"
            color="#10b981"
            percentage={(metrics?.resolvedIssues / metrics?.totalIssues) * 100 || 0}
          />
          <MetricsCard
            title="Pending"
            value={metrics?.pendingIssues || 0}
            icon="⏳"
            color="#f59e0b"
            percentage={(metrics?.pendingIssues / metrics?.totalIssues) * 100 || 0}
          />
          <MetricsCard
            title="Avg Resolution Time"
            value={`${metrics?.averageResolutionTime || 0} hrs`}
            icon="⏱️"
            color="#8b5cf6"
          />
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="analytics-section">
        <div className="section-half">
          <h2>Issues by Category</h2>
          {metrics?.categoriesBreakdown ? (
            <CategoryBreakdown data={metrics.categoriesBreakdown} />
          ) : (
            <p>No category data available</p>
          )}
        </div>

        <div className="section-half">
          <h2>Status Distribution</h2>
          <div className="status-chart">
            {metrics?.statusDistribution?.map((item) => (
              <div key={item.status} className="status-item">
                <div className="status-label">{item.status}</div>
                <div className="status-bar-container">
                  <div
                    className="status-bar"
                    style={{ width: `${item.percentage}%` }}
                  >
                    {item.percentage > 5 && (
                      <span className="status-percentage">{item.percentage.toFixed(1)}%</span>
                    )}
                  </div>
                </div>
                <div className="status-count">{item.count} issues</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trends Section */}
      {trendLoading ? (
        <div className="loading">Loading trend analysis...</div>
      ) : trends ? (
        <div className="trends-section">
          <h2>📈 Trend Analysis</h2>

          <div className="trends-grid">
            <div className="trend-card">
              <h3>Top Categories</h3>
              <div className="trend-list">
                {trends.topCategories?.map((cat) => (
                  <div key={cat.category} className="trend-item">
                    <span className="trend-name">{cat.category}</span>
                    <span className="trend-count">{cat.count}</span>
                    <span className={`trend-indicator ${cat.trend}`}>
                      {cat.trend === 'up' ? '📈' : '📉'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="trend-card">
              <h3>Resolution Trends</h3>
              <div className="trend-list">
                {trends.resolutionTrends?.map((trend) => (
                  <div key={trend.period} className="trend-item">
                    <span className="trend-name">{trend.period}</span>
                    <span className="trend-data">
                      Avg: {trend.averageTime}h | Rate: {(trend.resolution_rate * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Recent Activity */}
      <div className="activity-section">
        <h2>📍 Activity Timeline</h2>
        {metrics?.timelineData && (
          <TrendChart data={metrics.timelineData} />
        )}
      </div>
    </div>
  );
}
