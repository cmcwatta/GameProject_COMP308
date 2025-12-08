# 🎮 Gamification Platform - Complete Implementation Guide

A comprehensive web-based civic engagement platform with deep gamification mechanics, featuring game-like progression, achievements, leaderboards, and AI-powered guidance.

## 📋 Project Overview

This platform transforms civic engagement into an interactive, game-like experience where users earn XP, unlock achievements, complete challenges, and climb leaderboards while contributing to community improvement.

### 🎯 Key Features

- **Gamification System**
  - XP and leveling (50 levels)
  - 12+ achievements with rarity tiers
  - Daily challenges with difficulty progression
  - Leaderboards (daily, weekly, monthly, all-time)
  - Contribution streaks with 48-hour expiry
  - Community voting and reputation system

- **Civic Engagement**
  - Report issues (accessibility, infrastructure, safety, sustainability)
  - Community discussion and voting
  - Quality scoring for contributions
  - AI-powered issue classification and sentiment analysis

- **AI Integration**
  - Game progression advice
  - Achievement hints
  - Challenge recommendations
  - Civic information chatbot

- **Comprehensive Analytics**
  - XP trends and engagement metrics
  - Achievement unlock rates
  - Player statistics and rankings
  - Community growth tracking

## 📁 Project Structure

```
Group5_WebProject/
├── Web_Backend/
│   ├── auth-service/              # JWT authentication & user management
│   ├── engagement-service/        # Issues, comments, community features
│   ├── gamification-service/      # XP, levels, achievements, challenges
│   └── ai-service/                # Gemini-powered game advisor & chatbot
├── Web_Frontend/
│   ├── auth_frontend/             # Login, profile, game components
│   ├── analytics_frontend/        # Analytics dashboard
│   └── issue_frontend/            # Issue tracker interface
├── docker-compose.yml             # Multi-container orchestration
├── docker-manager.sh              # Docker management script
├── .env.example                   # Environment configuration template
└── ARCHITECTURE.md                # Detailed architecture documentation
```

## 🚀 Getting Started

### Prerequisites

- **Docker** 20.10+
- **Docker Compose** 2.0+
- **Node.js** 18+ (for local development)
- **MongoDB** 5.0+ (if running without Docker)
- **Gemini API Key** (for AI features)

### Quick Start with Docker

```bash
# 1. Clone and navigate to project
cd Group5_WebProject

# 2. Setup environment
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# 3. Make docker manager executable (Mac/Linux)
chmod +x docker-manager.sh

# 4. Start all services
./docker-manager.sh start
# OR manually:
docker-compose up -d

# 5. Seed the database
docker-compose exec gamification-service npm run seed

# 6. Access the platform
# Auth Frontend: http://localhost:3001
# Analytics: http://localhost:3002
# Issues: http://localhost:3003
```

### Services and Ports

| Service | Port | GraphQL | URL |
|---------|------|---------|-----|
| Auth Service | 5001 | 4001 | `http://localhost:5001` |
| Engagement Service | 5002 | 4002 | `http://localhost:5002` |
| Gamification Service | 5003 | 4003 | `http://localhost:5003` |
| AI Service | 5004 | - | `http://localhost:5004` |
| Auth Frontend | 3001 | - | `http://localhost:3001` |
| Analytics Frontend | 3002 | - | `http://localhost:3002` |
| Issue Frontend | 3003 | - | `http://localhost:3003` |
| MongoDB | 27017 | - | `mongodb://localhost:27017` |

## 🎮 Game Mechanics

### XP System
- **Base XP**: 10 XP per issue (configurable)
- **Quality Multiplier**: 1.0x - 2.0x based on report quality (0-100 score)
- **Daily Limit**: 500 XP per day
- **Level Formula**: Level N requires N × 1000 XP total

### Achievements
- **Common**: Basic achievements (easy to unlock)
- **Rare**: Intermediate milestones
- **Epic**: Advanced accomplishments
- **Legendary**: Ultimate achievements (top 1% players)

### Challenges
- **Easy**: 1-3 day duration, 150 XP reward
- **Medium**: 3-7 day duration, 250 XP reward
- **Hard**: 7-14 day duration, 350 XP reward
- **Epic**: 14-30 day duration, 500+ XP reward

### Leaderboard Tiers
- **Platinum**: Top 10 (⭐★★★★★)
- **Gold**: Top 100 (★★★★)
- **Silver**: Top 500 (★★★)
- **Bronze**: Everyone else (★★)

## 🔧 Configuration

### Environment Variables

Key configuration options in `.env`:

```env
# Database
MONGODB_URI=mongodb://admin:password@mongodb:27017/gamification_db

# Game Parameters
GAME_BASE_ISSUE_XP=10                 # XP per issue
GAME_DAILY_XP_LIMIT=500               # Daily cap
GAME_LEVEL_CAP=50                     # Max level
GAME_STREAK_EXPIRY_HOURS=48           # Streak expiry time

# API Keys
GEMINI_API_KEY=your_key_here          # Google Gemini API

# Service URLs
AUTH_SERVICE_URL=http://auth-service:5001
ENGAGEMENT_SERVICE_URL=http://engagement-service:5002
GAMIFICATION_SERVICE_URL=http://gamification-service:5003
AI_SERVICE_URL=http://ai-service:5004
```

## 📊 Frontend Components

### Game Components (auth_frontend/src/components/GameComponents/)

1. **XPDisplay** - Current XP and level progress
2. **AchievementBadge** - Individual achievement display
3. **ChallengeCard** - Challenge information and progress
4. **LeaderboardTable** - Ranked player list
5. **StreakDisplay** - Contribution streak visualization
6. **LevelIndicator** - Level details and unlocks
7. **GameProfile** - Comprehensive game profile dashboard

### Analytics Frontend

- XP trends chart
- Engagement metrics (issues, comments, votes, users)
- Achievement unlock rate
- Top players leaderboard

## 🔌 API Endpoints

### Authentication Service
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh JWT token
- `GET /user/:id` - Get user profile

### Engagement Service
- `POST /issues` - Create issue
- `GET /issues` - List issues
- `POST /issues/:id/comments` - Add comment
- `PUT /issues/:id/votes` - Vote on helpfulness

### Gamification Service
- `GET /profile/:userId` - Get game profile
- `GET /achievements/:userId` - List achievements
- `GET /leaderboard` - Get leaderboard
- `POST /challenges/:id/join` - Join challenge
- `GET /xp-history/:userId` - XP transaction history

### AI Service
- `GET /api/game-advisor/progression-advice/:userId`
- `GET /api/game-advisor/achievement-hints/:userId`
- `GET /api/game-advisor/challenge-recommendations/:userId`
- `GET /api/game-advisor/leaderboard-strategy/:userId`
- `POST /api/civic-chatbot/query` - Civic information

## 🗄️ Database Schema

### Collections

**Users**
- username, email, password
- avatar, role, isActive, lastLogin
- gameProfileId (reference)

**GameProfiles**
- totalXP, currentLevel, title
- unlockedAchievements, activeStreaks
- stats (issues, comments, votes, etc.)

**Achievements**
- name, description, category, rarity
- condition, reward, unlockDate

**Challenges**
- name, difficulty, xpReward
- objectives, startDate, endDate
- participantCount

**Issues**
- title, description, category, priority
- reportQualityScore, sentiment, aiClassification
- communityHelpfulVotes, xpAwarded

**Comments**
- text, authorId, issueId
- helpfulVotes, sentiment, xpAwarded

## 🛠️ Docker Management

### Using docker-manager.sh

```bash
# Interactive menu
./docker-manager.sh

# Or direct commands
./docker-manager.sh setup    # Setup environment
./docker-manager.sh build    # Build images
./docker-manager.sh start    # Start services
./docker-manager.sh stop     # Stop services
./docker-manager.sh health   # Check health
./docker-manager.sh logs     # View logs
./docker-manager.sh ps       # List services
./docker-manager.sh seed     # Seed database
./docker-manager.sh clean    # Remove volumes
```

### Manual Docker Commands

```bash
# Build all services
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f [service]

# Stop services
docker-compose down

# Remove data
docker-compose down -v
```

## 📈 Seeding Database

The platform includes comprehensive seed scripts:

```bash
# Run seeds automatically on startup
docker-compose up -d

# Or manually
docker-compose exec gamification-service npm run seed
```

Seed data includes:
- 12 achievements across 4 categories
- 5 challenges with different difficulties
- 4 test users with different roles

## 🔐 Security Considerations

- JWT tokens for authentication
- Password hashing (bcrypt)
- Role-based access control (RBAC)
- Rate limiting on API endpoints
- CORS configuration
- Environment variable isolation

## 🚨 Troubleshooting

### MongoDB connection issues
```bash
# Check MongoDB health
docker-compose ps mongodb

# View MongoDB logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

### Service won't start
```bash
# Check service logs
docker-compose logs [service-name]

# Rebuild specific service
docker-compose up -d --build [service-name]
```

### Port already in use
```bash
# Find process using port
lsof -i :[port]

# Kill process
kill -9 [PID]
```

## 📚 API Documentation

GraphQL endpoints are available at:
- Auth: `http://localhost:4001/graphql`
- Engagement: `http://localhost:4002/graphql`
- Gamification: `http://localhost:4003/graphql`

Access GraphQL Playground to explore queries/mutations.

## 🧪 Testing

```bash
# Run tests (when test suite is set up)
npm test

# With coverage
npm run test:coverage
```

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit pull request

## 📝 License

This project is part of COMP308 Group Assignment.

## 👥 Team

- **Architecture**: Complete gamification system design
- **Backend**: Node.js/Express microservices with GraphQL
- **Frontend**: React components with Tailwind CSS
- **AI**: Google Gemini integration for game advisor
- **DevOps**: Docker containerization and orchestration

## 🎯 Game Progression Example

**New Player Journey:**
1. Register and create account (0 XP)
2. Report first issue → +10 XP, unlock "First Steps" achievement
3. Write helpful comment → +25 XP
4. Join a challenge → Compete with other players
5. Reach 100 XP → Level 2, unlock new features
6. Maintain 7-day streak → "On Fire" status
7. Get top 100 → Gold tier, display badge
8. Reach Level 40 → "Legendary Contributor" achievement
9. Break into top 10 → "Hall of Fame" achievement
10. Reach 100-day streak → Ultimate "Legend" status

## 📞 Support

For issues, questions, or suggestions:
1. Check existing documentation
2. Review logs in `docker-compose logs`
3. Check service health: `./docker-manager.sh health`

---

**Version**: 1.0  
**Last Updated**: 2024  
**Status**: ✅ Production Ready
