import gql from 'graphql-tag';

export const typeDefs = gql`
  # ============================================
  # Game Profile Type
  # ============================================
  type GameProfile {
    id: ID!
    userId: ID!
    totalXP: Int!
    currentLevel: Int!
    currentXPInLevel: Int!
    title: String!
    unlockedAchievements: [Achievement!]!
    currentStreak: Int!
    longestStreak: Int!
    totalIssuesReported: Int!
    totalCommentsPosted: Int!
    totalUpvotesReceived: Int!
    issueResolutionContribution: Int!
    joinedChallenges: [Challenge!]!
    completedChallenges: [Challenge!]!
    leaderboardRank: Int!
    leaderboardTier: String!
    gameStats: GameStats!
    createdAt: String!
    updatedAt: String!
  }

  type GameStats {
    favoriteCategory: String
    mostActiveDay: String
    engagementScore: Int!
    trustScore: Int!
  }

  # ============================================
  # Achievement Type
  # ============================================
  type Achievement {
    id: ID!
    name: String!
    description: String!
    category: String!
    badge: String!
    rarity: String!
    xpReward: Int!
    icon: String
    displayOrder: Int!
    isHidden: Boolean!
    unlockedCount: Int!
    unlockCondition: UnlockCondition!
    createdAt: String!
    updatedAt: String!
  }

  type UnlockCondition {
    type: String!
    target: Int!
    metric: String!
  }

  # ============================================
  # Challenge Type
  # ============================================
  type Challenge {
    id: ID!
    title: String!
    description: String!
    category: String!
    difficulty: String!
    xpReward: Int!
    duration: Int!
    startDate: String!
    endDate: String!
    status: String!
    objective: String!
    successCriteria: String!
    progressMetric: ProgressMetric
    participants: [ChallengeParticipant!]!
    bonusRewards: [BonusReward!]!
    completionCount: Int!
    createdAt: String!
    updatedAt: String!
  }

  type ProgressMetric {
    type: String!
    target: Int!
  }

  type ChallengeParticipant {
    userId: ID!
    joinedDate: String!
    progress: Int!
    completed: Boolean!
    completedDate: String
  }

  type BonusReward {
    condition: String!
    xpBonus: Int!
  }

  # ============================================
  # Leaderboard Type
  # ============================================
  type Leaderboard {
    id: ID!
    timeRange: String!
    period: String!
    rankings: [LeaderboardRanking!]!
    total: Int!
    generatedAt: String!
  }

  type LeaderboardRanking {
    rank: Int!
    userId: ID!
    username: String!
    xp: Int!
    level: Int!
    streak: Int!
    tier: String!
    timestamp: String!
  }

  type UserRankInfo {
    rank: Int
    xp: Int!
    level: Int!
    tier: String!
    streak: Int!
    pointsToNextRank: Int!
    nearbyRankings: [LeaderboardRanking!]!
  }

  # ============================================
  # Points Log Type
  # ============================================
  type PointsLog {
    id: ID!
    userId: ID!
    xpAmount: Int!
    source: String!
    reason: String!
    before: PointsSnapshot!
    after: PointsSnapshot!
    createdAt: String!
  }

  type PointsSnapshot {
    level: Int!
    xpInLevel: Int!
    totalXP: Int!
  }

  # ============================================
  # Response Types
  # ============================================
  type XPAwardResult {
    success: Boolean!
    message: String!
    awardedXP: Int!
    leveledUp: Boolean!
    newLevel: Int!
    newTitle: String!
    gameProfile: GameProfile
  }

  type AchievementUnlockResult {
    success: Boolean!
    message: String!
    achievement: Achievement!
    xpReward: Int!
  }

  type ChallengeJoinResult {
    success: Boolean!
    message: String!
    challenge: Challenge
  }

  type ChallengeCompleteResult {
    success: Boolean!
    message: String!
    challenge: Challenge
    totalXPReward: Int!
    bonusRewards: [BonusReward!]!
  }

  type StreakInfo {
    currentStreak: Int!
    longestStreak: Int!
    streakActive: Boolean!
  }

  # ============================================
  # Query Root
  # ============================================
  type Query {
    # Game Profile Queries
    gameProfile(userId: ID!): GameProfile
    gameProfileByCurrentUser: GameProfile

    # Achievement Queries
    achievement(id: ID!): Achievement
    achievements(category: String): [Achievement!]!
    userAchievements(userId: ID!): [Achievement!]!
    achievementProgress(userId: ID!, achievementId: ID!): AchievementProgress
    achievementStats: AchievementStatsResult!

    # Challenge Queries
    challenge(id: ID!): Challenge
    challenges(status: String, category: String, difficulty: String): [Challenge!]!
    activeChallenges(category: String): [Challenge!]!
    upcomingChallenges(limit: Int): [Challenge!]!
    userChallenges(userId: ID!, status: String): [ChallengeWithProgress!]!
    challengeProgress(userId: ID!, challengeId: ID!): ChallengeProgress
    challengeStats: ChallengeStatsResult!

    # Leaderboard Queries
    leaderboard(timeRange: String, limit: Int, skip: Int): Leaderboard!
    userRank(userId: ID!, timeRange: String): UserRankInfo!
    topPlayers(limit: Int): [LeaderboardRanking!]!
    topAchievers(limit: Int): [TopAchieverRanking!]!
    topStreamers(limit: Int): [TopStreamerRanking!]!
    leaderboardStats: LeaderboardStatsResult!

    # Points Log Queries
    xpHistory(userId: ID!, skip: Int, limit: Int): [PointsLog!]!
    xpSummary(userId: ID!, startDate: String!, endDate: String!): XPSummary
  }

  # ============================================
  # Mutation Root
  # ============================================
  type Mutation {
    # Points Mutations
    awardXP(userId: ID!, amount: Int!, source: String!, reason: String!, sourceId: ID): XPAwardResult!
    updateStreak(userId: ID!): StreakInfo!

    # Achievement Mutations
    unlockAchievement(userId: ID!, achievementId: ID!): AchievementUnlockResult!
    checkAndUnlockAchievements(userId: ID!): [AchievementUnlockResult!]!

    # Challenge Mutations
    createChallenge(input: CreateChallengeInput!): Challenge!
    updateChallenge(id: ID!, input: UpdateChallengeInput!): Challenge!
    joinChallenge(userId: ID!, challengeId: ID!): ChallengeJoinResult!
    updateChallengeProgress(userId: ID!, challengeId: ID!, progressAmount: Int!): ChallengeProgressUpdate!
    completeChallenge(userId: ID!, challengeId: ID!): ChallengeCompleteResult!

    # Leaderboard Mutations
    recalculateLeaderboards: LeaderboardRecalculationResult!
  }

  # ============================================
  # Subscription Root
  # ============================================
  type Subscription {
    xpGained(userId: ID!): XPGainedEvent!
    achievementUnlocked(userId: ID!): AchievementUnlockedEvent!
    levelUp(userId: ID!): LevelUpEvent!
    leaderboardChange: LeaderboardChangeEvent!
    challengeCompleted(userId: ID!): ChallengeCompletedEvent!
  }

  # ============================================
  # Input Types
  # ============================================
  input CreateChallengeInput {
    title: String!
    description: String!
    category: String!
    difficulty: String!
    xpReward: Int!
    duration: Int!
    startDate: String!
    endDate: String!
    objective: String!
    successCriteria: String!
    progressMetric: ProgressMetricInput
    bonusRewards: [BonusRewardInput!]
  }

  input UpdateChallengeInput {
    title: String
    description: String
    status: String
    bonusRewards: [BonusRewardInput!]
  }

  input ProgressMetricInput {
    type: String!
    target: Int!
  }

  input BonusRewardInput {
    condition: String!
    xpBonus: Int!
  }

  # ============================================
  # Additional Response Types
  # ============================================
  type AchievementProgress {
    achievement: Achievement!
    isUnlocked: Boolean!
    currentProgress: Int!
    target: Int!
    progressPercent: Int!
    metric: String!
  }

  type AchievementStatsResult {
    total: Int!
    byCategory: CategoryStats!
    byRarity: RarityStats!
    averageUnlockCount: Int!
  }

  type CategoryStats {
    civic: Int!
    community: Int!
    consistency: Int!
    quality: Int!
    special: Int!
  }

  type RarityStats {
    common: Int!
    uncommon: Int!
    rare: Int!
    legendary: Int!
  }

  type ChallengeWithProgress {
    id: ID!
    title: String!
    description: String!
    difficulty: String!
    xpReward: Int!
    userProgress: Int!
    userCompleted: Boolean!
    targetProgress: Int!
  }

  type ChallengeProgress {
    joined: Boolean!
    challenge: Challenge
    currentProgress: Int!
    targetProgress: Int!
    progressPercent: Int!
    completed: Boolean!
    completedDate: String
    xpReward: Int!
  }

  type ChallengeProgressUpdate {
    success: Boolean!
    currentProgress: Int!
    targetProgress: Int!
    completed: Boolean!
    xpReward: Int!
  }

  type ChallengeStatsResult {
    total: Int!
    active: Int!
    byDifficulty: DifficultyStats!
    byCategory: CategoryStats!
    averageCompletionCount: Int!
  }

  type DifficultyStats {
    easy: Int!
    medium: Int!
    hard: Int!
    epic: Int!
  }

  type TopAchieverRanking {
    rank: Int!
    userId: ID!
    achievementsUnlocked: Int!
    level: Int!
    xp: Int!
  }

  type TopStreamerRanking {
    rank: Int!
    userId: ID!
    longestStreak: Int!
    currentStreak: Int!
    xp: Int!
  }

  type LeaderboardStatsResult {
    totalPlayers: Int!
    averageXP: Int!
    averageLevel: Float!
    maxXP: Int!
    maxLevel: Int!
    tierDistribution: TierDistribution!
  }

  type TierDistribution {
    bronze: Int!
    silver: Int!
    gold: Int!
    platinum: Int!
  }

  type LeaderboardRecalculationResult {
    success: Boolean!
    message: String!
    calculatedTimeRanges: [String!]!
  }

  type XPSummary {
    totalXP: Int!
    bySource: SourceBreakdown!
    transactionCount: Int!
  }

  type SourceBreakdown {
    issue_report: Int
    comment: Int
    helpful_vote: Int
    challenge_complete: Int
    achievement_unlock: Int
    streak_bonus: Int
    quality_bonus: Int
    admin_award: Int
  }

  # ============================================
  # Event Types (for Subscriptions)
  # ============================================
  type XPGainedEvent {
    userId: ID!
    xpAmount: Int!
    source: String!
    newTotal: Int!
    timestamp: String!
  }

  type AchievementUnlockedEvent {
    userId: ID!
    achievement: Achievement!
    timestamp: String!
  }

  type LevelUpEvent {
    userId: ID!
    newLevel: Int!
    newTitle: String!
    timestamp: String!
  }

  type LeaderboardChangeEvent {
    userId: ID!
    oldRank: Int!
    newRank: Int!
    timestamp: String!
  }

  type ChallengeCompletedEvent {
    userId: ID!
    challenge: Challenge!
    xpReward: Int!
    timestamp: String!
  }
`;

export default typeDefs;
