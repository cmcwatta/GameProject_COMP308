# Quick Reference Guide - Gamification Platform

## 🚀 Start Quickly

```bash
# One-command startup
cd Group5_WebProject
./docker-manager.sh start

# Access the platform
# Auth: http://localhost:3001
# Analytics: http://localhost:3002
# Issues: http://localhost:3003
```

## 📍 Service Ports

```
Auth Service: 5001 (GraphQL: 4001)
Engagement Service: 5002 (GraphQL: 4002)
Gamification Service: 5003 (GraphQL: 4003)
AI Service: 5004
MongoDB: 27017
```

## 📂 Key Files to Modify

| Purpose | File Path |
|---------|-----------|
| Game Parameters | `.env` (GAME_* vars) |
| Achievements | `Web_Backend/gamification-service/scripts/seed.js` |
| Challenges | `Web_Backend/gamification-service/scripts/seed.js` |
| Frontend Styling | `Web_Frontend/*/src/*.css` |
| API Configuration | `Web_Backend/*/config/config.js` |

## 🎮 Game Values (Tunable)

```env
GAME_BASE_ISSUE_XP=10              # XP per issue
GAME_DAILY_XP_LIMIT=500            # Daily cap
GAME_LEVEL_CAP=50                  # Max level
GAME_STREAK_EXPIRY_HOURS=48        # Streak expiry
```

## 🔥 Common Commands

```bash
# View service logs
docker-compose logs -f [service]

# Rebuild a service
docker-compose up -d --build [service]

# Execute command in container
docker-compose exec [service] npm run [command]

# Connect to MongoDB
docker-compose exec mongodb mongosh -u admin -p

# Check service health
curl http://localhost:[PORT]/health
```

## 📊 GraphQL Queries

### Get Game Profile
```graphql
query {
  getGameProfile(userId: "123") {
    totalXP
    currentLevel
    unlockedAchievements {
      name
      rarity
    }
  }
}
```

### Get Leaderboard
```graphql
query {
  getLeaderboard(timeRange: "all-time", limit: 10) {
    rank
    userId
    username
    totalXP
    tier
  }
}
```

### Join Challenge
```graphql
mutation {
  joinChallenge(challengeId: "123") {
    id
    status
    joinDate
  }
}
```

## 🎯 Achievement Categories

- `engagement` - User activity
- `civic_focus` - Issue category specific
- `progression` - Level/XP based
- `special` - Special conditions

## 🏅 Achievement Rarities

- `common` - 50 XP (easy)
- `rare` - 100-250 XP (medium)
- `epic` - 500-600 XP (hard)
- `legendary` - 1000+ XP (very hard)

## 🏆 Leaderboard Tiers

| Tier | Position | Requirements |
|------|----------|--------------|
| Platinum | Top 10 | ⭐★★★★★ |
| Gold | Top 100 | ★★★★ |
| Silver | Top 500 | ★★★ |
| Bronze | Everyone | ★★ |

## 🧪 Testing API Endpoints

```bash
# Health check
curl http://localhost:5001/health

# Game advisor advice
curl http://localhost:5004/api/game-advisor/progression-advice/[userId]

# Civic chatbot
curl -X POST http://localhost:5004/api/civic-chatbot/query \
  -H "Content-Type: application/json" \
  -d '{"query":"What is accessibility?"}'
```

## 🔄 Database Backup & Restore

```bash
# Backup
docker-compose exec mongodb mongodump --out /backup

# Restore
docker-compose exec mongodb mongorestore /backup
```

## 🐛 Debugging

```bash
# Check running containers
docker-compose ps

# View real-time logs
docker-compose logs -f

# Inspect network
docker network ls
docker network inspect [network-id]

# Execute shell in container
docker-compose exec [service] sh
```

## 📱 Frontend Component Import

```javascript
// Import game components
import XPDisplay from './components/GameComponents/XPDisplay';
import AchievementBadge from './components/GameComponents/AchievementBadge';
import ChallengeCard from './components/GameComponents/ChallengeCard';
import LeaderboardTable from './components/GameComponents/LeaderboardTable';
import StreakDisplay from './components/GameComponents/StreakDisplay';
import LevelIndicator from './components/GameComponents/LevelIndicator';
import GameProfile from './components/GameProfile';

// Use in component
<XPDisplay userId={userId} />
<LeaderboardTable players={players} currentUserId={userId} />
```

## 🔑 Environment Variables Needed

```env
# Required
MONGODB_URI=mongodb://admin:password@mongodb:27017/gamification_db
JWT_SECRET=your_secret_key
GEMINI_API_KEY=AIzaSyAy7BUWkBM1EG_AXCAUk8ulXGXU6Wi3LkY

# Optional (defaults provided)
GAME_BASE_ISSUE_XP=10
GAME_DAILY_XP_LIMIT=500
GAME_LEVEL_CAP=50
```

## 📈 Performance Tips

1. **Query Optimization**
   - Use indexes on frequently queried fields
   - Limit returned fields with GraphQL selection
   - Implement pagination

2. **Caching**
   - Cache leaderboard calculations
   - Cache achievement definitions
   - Use Redis for session data

3. **Frontend**
   - Lazy load components
   - Memoize expensive calculations
   - Use React.lazy() for route-based splitting

## 🔐 Security Checklist

- [ ] Change JWT_SECRET in production
- [ ] Use strong MongoDB password
- [ ] Enable HTTPS/SSL
- [ ] Set CORS properly
- [ ] Validate all user inputs
- [ ] Rate limit API endpoints
- [ ] Use environment variables for secrets
- [ ] Keep dependencies updated

## 🎓 File Structure Quick Map

```
├── Web_Backend/
│   ├── gamification-service/
│   │   ├── models/          ← Data schemas
│   │   ├── engines/         ← Game logic
│   │   ├── graphql/         ← API definitions
│   │   └── scripts/         ← Database seeds
│   ├── ai-service/
│   │   ├── agents/          ← AI logic
│   │   └── config/          ← Configuration
│   └── [other-services]
├── Web_Frontend/
│   ├── [frontend]/src/
│   │   ├── components/      ← React components
│   │   └── assets/          ← Images/static
│   └── [other-frontends]
├── docker-compose.yml       ← Container config
└── .env                     ← Environment vars
```

## 🎯 Quick Customization

### Change XP Rewards
Edit `Web_Backend/gamification-service/config/config.js`:
```javascript
game: {
  xp: {
    baseIssueXP: 10,        // Change this
    dailyLimit: 500,        // Or this
  }
}
```

### Add New Achievement
Edit seed script and add to `achievementsData`:
```javascript
{
  name: 'Your Achievement',
  description: 'Description',
  rarity: 'epic',
  symbol: '🎯',
  condition: { type: 'custom', value: 10 },
  reward: 500,
}
```

### Customize Styling
Modify component CSS in `components/GameComponents/*.jsx`:
```css
/* Find .xp-display, .achievement-badge, etc. */
/* Change colors, sizes, animations */
```

## ✅ Pre-Deployment Checklist

- [ ] All .env variables set
- [ ] Database seeded
- [ ] Services health checks passing
- [ ] Frontend builds complete
- [ ] API endpoints responding
- [ ] Logs clean (no errors)
- [ ] Security credentials updated
- [ ] Documentation updated

## 📞 Emergency Recovery

```bash
# If services won't start
docker-compose down -v              # Remove everything
docker-compose up --build           # Rebuild

# If database is corrupted
docker volume rm [project]_mongo_data
docker-compose up                   # Recreate

# If port is in use
sudo lsof -i :[PORT]
sudo kill -9 [PID]
```

---

**Keep this guide handy for rapid development and troubleshooting!**
