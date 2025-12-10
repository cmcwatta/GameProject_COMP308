import { gql } from '@apollo/client';

export const GET_DASHBOARD_METRICS = gql`
  query GetDashboardMetrics {
    getDashboardMetrics {
      totalIssues
      resolvedIssues
      pendingIssues
      averageResolutionTime
      categoriesBreakdown {
        category
        count
        percentage
      }
      statusDistribution {
        status
        count
        percentage
      }
      timelineData {
        date
        issuesCreated
        issuesResolved
      }
    }
  }
`;

export const GET_TREND_ANALYSIS = gql`
  query GetTrendAnalysis($timeframe: String!) {
    getTrendAnalysis(timeframe: $timeframe) {
      topCategories {
        category
        count
        trend
      }
      hotspots {
        latitude
        longitude
        issueCount
        severity
      }
      resolutionTrends {
        period
        averageTime
        resolution_rate
      }
    }
  }
`;

export const GET_HEATMAP_DATA = gql`
  query GetHeatmapData($bounds: BoundingBox!) {
    getHeatmapData(bounds: $bounds) {
      latitude
      longitude
      intensity
      issueCount
      category
    }
  }
`;
