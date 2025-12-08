import { GoogleGenerativeAI } from '@google/generative-ai';
import aiConfig from '../config/config.js';

export class GameAdvisor {
  constructor() {
    this.genAI = new GoogleGenerativeAI(aiConfig.geminiApiKey);
    this.model = this.genAI.getGenerativeModel({ model: aiConfig.geminiModel });
  }

  /**
   * Get personalized game progression advice
   * @param {object} gameProfile - user's game profile
   * @returns {Promise<string>} advice text
   */
  async getProgressionAdvice(gameProfile) {
    const prompt = `
    Given this player's game profile:
    - Level: ${gameProfile.currentLevel}
    - Total XP: ${gameProfile.totalXP}
    - Current Streak: ${gameProfile.currentStreak} days
    - Leaderboard Rank: ${gameProfile.leaderboardRank}
    - Achievements Unlocked: ${gameProfile.unlockedAchievements?.length || 0}
    - Total Issues Reported: ${gameProfile.totalIssuesReported}
    - Title: ${gameProfile.title}
    
    Provide 2-3 specific, actionable pieces of advice on how to progress faster.
    Focus on their strengths and suggest next steps. Be encouraging!`;

    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Error generating progression advice:', error);
      throw new Error('Failed to generate progression advice');
    }
  }

  /**
   * Get achievement unlocking hints
   * @param {object} gameProfile - user's game profile
   * @param {array} achievementProgresses - progress toward achievements
   * @returns {Promise<array>} array of hints for close achievements
   */
  async getAchievementHints(gameProfile, achievementProgresses) {
    const closeAchievements = achievementProgresses
      .filter((ap) => ap.progressPercent >= 50 && ap.progressPercent < 100)
      .slice(0, 3);

    if (closeAchievements.length === 0) {
      return [];
    }

    const achievementList = closeAchievements
      .map((ap) => `- ${ap.achievement.name} (${ap.progressPercent}% complete)`)
      .join('\n');

    const prompt = `
    This player is close to unlocking these achievements:
    ${achievementList}
    
    For each achievement, provide a brief, non-spoiler hint on how to unlock it (1 sentence max each).
    Format: Achievement Name: Hint text`;

    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text().split('\n').filter((h) => h.trim());
    } catch (error) {
      console.error('Error generating achievement hints:', error);
      return [];
    }
  }

  /**
   * Recommend challenges based on player profile
   * @param {object} gameProfile - user's game profile
   * @param {array} activeChallenges - available challenges
   * @returns {Promise<array>} recommended challenges with reasons
   */
  async recommendChallenges(gameProfile, activeChallenges) {
    if (!activeChallenges || activeChallenges.length === 0) {
      return [];
    }

    const challengeSummary = activeChallenges
      .slice(0, 5)
      .map(
        (c) =>
          `- ${c.title} (Difficulty: ${c.difficulty}, XP: ${c.xpReward}, Category: ${c.category})`
      )
      .join('\n');

    const prompt = `
    Based on this player's profile:
    - Level: ${gameProfile.currentLevel}
    - Play Style: ${gameProfile.gameStats?.favoriteCategory || 'diverse'}
    - Total Issues Reported: ${gameProfile.totalIssuesReported}
    - Current Streak: ${gameProfile.currentStreak}
    
    From these available challenges:
    ${challengeSummary}
    
    Recommend 2-3 challenges that would be good fits. For each, explain in 1 sentence why it's a good match.
    Format: Challenge Title: Reason`;

    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text().split('\n').filter((r) => r.trim());
    } catch (error) {
      console.error('Error recommending challenges:', error);
      return [];
    }
  }

  /**
   * Get leaderboard insights and strategy
   * @param {object} gameProfile - user's game profile
   * @param {object} rankInfo - user's rank information
   * @returns {Promise<string>} strategy text
   */
  async getLeaderboardStrategy(gameProfile, rankInfo) {
    const prompt = `
    This player's leaderboard position:
    - Current Rank: ${rankInfo.rank}
    - Current Tier: ${rankInfo.tier}
    - XP: ${rankInfo.xp}
    - Points to Next Rank: ${rankInfo.pointsToNextRank}
    - Level: ${gameProfile.currentLevel}
    
    Provide 2-3 specific tips on how they can improve their leaderboard ranking.
    Focus on realistic, achievable goals. Be motivating!`;

    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Error generating leaderboard strategy:', error);
      throw new Error('Failed to generate leaderboard strategy');
    }
  }

  /**
   * Generate a personalized game summary
   * @param {object} gameProfile - user's game profile
   * @returns {Promise<string>} summary text
   */
  async generateGameSummary(gameProfile) {
    const prompt = `
    Write a brief, encouraging game summary for a player with this profile:
    - Level: ${gameProfile.currentLevel} (${gameProfile.title})
    - Total XP: ${gameProfile.totalXP}
    - Achievements: ${gameProfile.unlockedAchievements?.length || 0} unlocked
    - Current Streak: ${gameProfile.currentStreak} days
    - Rank: ${gameProfile.leaderboardRank}
    - Issues Reported: ${gameProfile.totalIssuesReported}
    
    Make it personal, acknowledge their progress, and end with an encouraging message (about 3 sentences).`;

    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Error generating game summary:', error);
      throw new Error('Failed to generate game summary');
    }
  }

  /**
   * Analyze player engagement and suggest improvements
   * @param {object} gameProfile - user's game profile
   * @returns {Promise<object>} analysis and suggestions
   */
  async analyzeEngagement(gameProfile) {
    const engagementScore = gameProfile.gameStats?.engagementScore || 0;
    const trustScore = gameProfile.gameStats?.trustScore || 0;

    const prompt = `
    Analyze this player's engagement:
    - Engagement Score: ${engagementScore}/100
    - Trust Score: ${trustScore}/100
    - Issues Reported: ${gameProfile.totalIssuesReported}
    - Comments: ${gameProfile.totalCommentsPosted}
    - Upvotes Received: ${gameProfile.totalUpvotesReceived}
    - Current Level: ${gameProfile.currentLevel}
    
    Provide:
    1. Overall engagement assessment (positive or constructive feedback)
    2. One specific action to improve engagement
    3. One strength to build upon
    
    Keep it concise and encouraging.`;

    try {
      const result = await this.model.generateContent(prompt);
      return {
        analysis: result.response.text(),
        engagementScore,
        trustScore,
        suggestedAction: 'Refer to analysis above',
      };
    } catch (error) {
      console.error('Error analyzing engagement:', error);
      throw new Error('Failed to analyze engagement');
    }
  }
}

export default GameAdvisor;
