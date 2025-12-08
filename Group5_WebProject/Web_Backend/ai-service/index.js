import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import config from './config/config.js';
import GameAdvisor from './agents/gameAdvisor.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize GameAdvisor
const gameAdvisor = new GameAdvisor();

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(config.mongodbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ AI Service: MongoDB connected');
  } catch (error) {
    console.error('✗ AI Service: MongoDB connection failed', error);
    process.exit(1);
  }
};

// ============================================================================
// HEALTH CHECK ENDPOINTS
// ============================================================================

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'ai-service',
    timestamp: new Date().toISOString(),
  });
});

// ============================================================================
// GAME ADVISOR ENDPOINTS
// ============================================================================

/**
 * GET /api/game-advisor/progression-advice/:userId
 * Get personalized level progression strategy
 */
app.get('/api/game-advisor/progression-advice/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch user game profile from gamification service
    const profileResponse = await fetch(`${config.gamificationServiceURL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            getGameProfile(userId: "${userId}") {
              totalXP
              currentLevel
              title
              stats {
                issuesReported
                commentsWritten
                challengesCompleted
              }
            }
          }
        `,
      }),
    });

    const { data } = await profileResponse.json();
    const gameProfile = data.getGameProfile;

    const advice = await gameAdvisor.getProgressionAdvice(gameProfile);

    res.json({
      userId,
      advice,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error getting progression advice:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/game-advisor/achievement-hints/:userId
 * Get non-spoiler hints for achievements
 */
app.get('/api/game-advisor/achievement-hints/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch achievements near completion
    const achievementResponse = await fetch(`${config.gamificationServiceURL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            getGameProfile(userId: "${userId}") {
              totalXP
              currentLevel
            }
            getNearbyAchievements(userId: "${userId}") {
              id
              name
              category
              progress
            }
          }
        `,
      }),
    });

    const { data } = await achievementResponse.json();
    const hints = await gameAdvisor.getAchievementHints(data.getGameProfile, data.getNearbyAchievements);

    res.json({
      userId,
      hints,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error getting achievement hints:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/game-advisor/challenge-recommendations/:userId
 * Get personalized challenge recommendations
 */
app.get('/api/game-advisor/challenge-recommendations/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch user profile and active challenges
    const [profileResponse, challengesResponse] = await Promise.all([
      fetch(`${config.gamificationServiceURL}/graphql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `query { getGameProfile(userId: "${userId}") { currentLevel stats { challengesCompleted } } }`,
        }),
      }),
      fetch(`${config.gamificationServiceURL}/graphql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `query { getActiveChallenges { id name difficulty xpReward } }`,
        }),
      }),
    ]);

    const profileData = await profileResponse.json();
    const challengesData = await challengesResponse.json();

    const recommendations = await gameAdvisor.recommendChallenges(
      profileData.data.getGameProfile,
      challengesData.data.getActiveChallenges
    );

    res.json({
      userId,
      recommendations,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error getting challenge recommendations:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/game-advisor/leaderboard-strategy/:userId
 * Get personalized ranking improvement strategy
 */
app.get('/api/game-advisor/leaderboard-strategy/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch user rank and leaderboard context
    const rankResponse = await fetch(`${config.gamificationServiceURL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            getGameProfile(userId: "${userId}") {
              totalXP
              currentLevel
              title
            }
            getUserRank(userId: "${userId}", timeRange: "all-time") {
              rank
              tier
              nearbyPlayers {
                username
                xp
              }
            }
          }
        `,
      }),
    });

    const rankData = await rankResponse.json();
    const strategy = await gameAdvisor.getLeaderboardStrategy(
      rankData.data.getGameProfile,
      rankData.data.getUserRank
    );

    res.json({
      userId,
      strategy,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error getting leaderboard strategy:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/game-advisor/game-summary/:userId
 * Generate encouraging summary of player progress
 */
app.get('/api/game-advisor/game-summary/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch complete game profile
    const profileResponse = await fetch(`${config.gamificationServiceURL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            getGameProfile(userId: "${userId}") {
              totalXP
              currentLevel
              title
              unlockedAchievements
              streaks {
                currentStreak
              }
              stats {
                issuesReported
                commentsWritten
                challengesCompleted
                helpfulVotes
              }
            }
          }
        `,
      }),
    });

    const profileData = await profileResponse.json();
    const summary = await gameAdvisor.generateGameSummary(profileData.data.getGameProfile);

    res.json({
      userId,
      summary,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error generating game summary:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/game-advisor/engagement-analysis/:userId
 * Analyze user engagement and provide suggestions
 */
app.get('/api/game-advisor/engagement-analysis/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch engagement metrics
    const engagementResponse = await fetch(`${config.engagementServiceURL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            getUserEngagementMetrics(userId: "${userId}") {
              issuesReported
              commentsWritten
              helpfulVotes
              averageResponseTime
              lastActivityDate
              communityRating
            }
          }
        `,
      }),
    });

    const gameProfileResponse = await fetch(`${config.gamificationServiceURL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            getGameProfile(userId: "${userId}") {
              totalXP
              currentLevel
              stats
            }
          }
        `,
      }),
    });

    const engagementData = await engagementResponse.json();
    const profileData = await gameProfileResponse.json();

    const analysis = await gameAdvisor.analyzeEngagement(profileData.data.getGameProfile);

    res.json({
      userId,
      engagement: engagementData.data.getUserEngagementMetrics,
      analysis,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error analyzing engagement:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// CIVIC CHATBOT ENDPOINTS
// ============================================================================

/**
 * POST /api/civic-chatbot/query
 * General civic information and accessibility guidance
 */
app.post('/api/civic-chatbot/query', async (req, res) => {
  try {
    const { query, context } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const response = await gameAdvisor.model.generateContent({
      contents: [{
        parts: [{
          text: `${config.civicChatbotSystemPrompt}\n\nUser query: ${query}\n\nContext: ${JSON.stringify(context || {})}`,
        }],
      }],
    });

    const answer = response.response.text();

    res.json({
      query,
      answer,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error processing chatbot query:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/civic-chatbot/issue-classification
 * AI-powered issue classification
 */
app.post('/api/civic-chatbot/issue-classification', async (req, res) => {
  try {
    const { description, title } = req.body;

    if (!description) {
      return res.status(400).json({ error: 'Description is required' });
    }

    const response = await gameAdvisor.model.generateContent({
      contents: [{
        parts: [{
          text: `Classify the following civic issue into one of: accessibility, infrastructure, safety, sustainability, other\n\nTitle: ${title}\nDescription: ${description}\n\nRespond with: {category: "...", confidence: 0-1, reasoning: "..."}`,
        }],
      }],
    });

    const result = JSON.parse(response.response.text());

    res.json({
      classification: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error classifying issue:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/civic-chatbot/sentiment-analysis
 * Analyze sentiment of civic content
 */
app.post('/api/civic-chatbot/sentiment-analysis', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const response = await gameAdvisor.model.generateContent({
      contents: [{
        parts: [{
          text: `Analyze sentiment of this civic engagement text: "${text}"\n\nRespond with JSON: {sentiment: "positive|neutral|negative", score: 0-1, summary: "..."}`,
        }],
      }],
    });

    const result = JSON.parse(response.response.text());

    res.json({
      sentiment: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// ERROR HANDLING & SERVER STARTUP
// ============================================================================

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path,
  });
});

// Start server
const PORT = process.env.PORT || 5004;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║    AI SERVICE STARTED SUCCESSFULLY     ║
╠════════════════════════════════════════╣
║ Port: ${PORT}                             ║
║ Game Advisor: Ready                    ║
║ Civic Chatbot: Ready                   ║
║ Gemini Model: ${config.geminiModel}    ║
╚════════════════════════════════════════╝
    ╠════════════════════════════════════════╣
║ Gamification Service: ${config.gamificationServiceURL}
║ Engagement Service: ${config.engagementServiceURL}
║ Auth Service: ${config.authServiceURL}
╚════════════════════════════════════════╝`);
  });
});

export default app;
