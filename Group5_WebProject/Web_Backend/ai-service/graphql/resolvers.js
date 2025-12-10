import { GoogleGenerativeAI } from '@google/generative-ai';
import AnalyticsCache from '../models/AnalyticsCache.js';
import AISummary from '../models/AISummary.js';
import { config } from '../config/config.js';

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: config.GEMINI_MODEL });

const resolvers = {
    Query: {
        getDashboardMetrics: async () => {
            // Check cache first
            let cached = await AnalyticsCache.findOne({ type: 'dashboard_metrics' });
            if (cached) {
                return cached.data;
            }

            // In production, fetch from issue-service
            const metrics = {
                totalIssues: 127,
                openIssues: 45,
                resolvedIssues: 78,
                averageResolutionTime: 5.2,
                issuesByCategory: [
                    { category: 'accessibility', count: 34 },
                    { category: 'infrastructure', count: 56 },
                    { category: 'safety', count: 28 },
                    { category: 'sustainability', count: 9 }
                ],
                issuesByStatus: [
                    { status: 'open', count: 45 },
                    { status: 'in_progress', count: 28 },
                    { status: 'resolved', count: 78 }
                ]
            };

            // Cache for 1 hour
            await AnalyticsCache.create({
                type: 'dashboard_metrics',
                data: metrics,
                expiresAt: new Date(Date.now() + 60 * 60 * 1000)
            });

            return metrics;
        },

        getTrendAnalysis: async () => {
            const cached = await AnalyticsCache.findOne({ type: 'trend_analysis' });
            if (cached) {
                return cached.data;
            }

            const trends = {
                emergingIssues: [
                    { category: 'accessibility', count: 12, trend: 'rising' },
                    { category: 'sustainability', count: 8, trend: 'stable' }
                ],
                hotspots: [
                    { latitude: 40.7128, longitude: -74.0060, issueCount: 18, categories: ['accessibility', 'safety'] },
                    { latitude: 40.7505, longitude: -73.9972, issueCount: 12, categories: ['infrastructure'] }
                ],
                sentimentTrend: [
                    { timestamp: new Date('2025-12-07'), averageSentiment: -0.3 },
                    { timestamp: new Date('2025-12-08'), averageSentiment: -0.25 },
                    { timestamp: new Date('2025-12-09'), averageSentiment: -0.2 }
                ]
            };

            await AnalyticsCache.create({
                type: 'trend_analysis',
                data: trends,
                expiresAt: new Date(Date.now() + 60 * 60 * 1000)
            });

            return trends;
        },

        getIssueSummary: async (_, { issueId }) => {
            // Check cache
            const cached = await AISummary.findOne({ sourceId: issueId });
            if (cached) {
                return {
                    summary: cached.summary,
                    keyPoints: cached.keyPoints,
                    suggestedCategory: 'accessibility',
                    priority: 'high',
                    confidence: cached.confidence
                };
            }

            // Generate summary using Gemini (mock for now)
            const summary = {
                summary: 'Multiple accessibility barriers reported in downtown area affecting wheelchair users and elderly residents',
                keyPoints: [
                    'Curb cuts missing at main intersection',
                    'Elevator out of service at transit hub',
                    'Accessible parking spaces blocked by construction'
                ],
                suggestedCategory: 'accessibility',
                priority: 'high',
                confidence: 0.92
            };

            await AISummary.create({
                sourceId: issueId,
                sourceType: 'issue',
                summary: summary.summary,
                keyPoints: summary.keyPoints,
                confidence: summary.confidence,
                model: config.GEMINI_MODEL
            });

            return summary;
        },

        chatbot: async (_, { message, userId }) => {
            // In production, use LangGraph agent with proper tool integration
            const response = `
Based on current civic data, here's what I found:

${message.toLowerCase().includes('accessibility') ? 
    '- 34 accessibility issues are currently reported\n' +
    '- Hotspots: Downtown area (18 issues), Transit hub (6 issues)\n' +
    '- Trending: Rising (12 new issues this week)\n' +
    '- Average sentiment: -0.2 (improving)\n' +
    '- Recommended action: Prioritize curb cut installation'
    : 'Please ask about accessibility, infrastructure, safety, or sustainability issues.'}
            `.trim();

            return {
                response,
                sources: [
                    { issueId: '1', title: 'Curb cut missing at Main & 5th', relevance: 0.95 },
                    { issueId: '2', title: 'Elevator out of service downtown', relevance: 0.89 }
                ],
                suggestedActions: [
                    { type: 'contact', description: 'Contact accessibility coordinator' },
                    { type: 'schedule', description: 'Schedule assessment of downtown barriers' }
                ],
                confidence: 0.87
            };
        },

        classifyIssue: async (_, { description, category }) => {
            // Use Gemini to classify (mock implementation)
            try {
                const prompt = `Classify this civic issue: "${description}"\n
Return JSON with: suggestedCategory, confidence (0-1), suggestedPriority`;

                // For now, mock the response
                return {
                    suggestedCategory: category || 'accessibility',
                    confidence: 0.88,
                    alternativeCategories: [
                        { category: 'safety', confidence: 0.07 },
                        { category: 'infrastructure', confidence: 0.05 }
                    ],
                    suggestedPriority: 'high',
                    expectedResolutionTime: '5-7 days'
                };
            } catch (error) {
                console.error('Gemini API error:', error);
                return {
                    suggestedCategory: category || 'other',
                    confidence: 0.5,
                    alternativeCategories: [],
                    suggestedPriority: 'medium',
                    expectedResolutionTime: 'unknown'
                };
            }
        },

        analyzeSentiment: async (_, { issueId }) => {
            // Mock sentiment analysis (in production, use Gemini)
            return {
                overallSentiment: -0.3,
                score: -0.3,
                comments: [
                    { commentId: '1', sentiment: -0.5, score: -0.5 },
                    { commentId: '2', sentiment: 0.1, score: 0.1 },
                    { commentId: '3', sentiment: -0.4, score: -0.4 }
                ]
            };
        }
    },

    Mutation: {
        processChatbotMessage: async (_, { message, userId, context }, { user }) => {
            // Process message through LangGraph agent in production
            return {
                response: `Processing: ${message}`,
                sources: [],
                suggestedActions: [],
                confidence: 0.8
            };
        }
    }
};

export default resolvers;