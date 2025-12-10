# Quick Start - All Services

## Status Update (Fixed E11000 Error)

The E11000 duplicate key error was caused by a unique index on `username` that no longer exists in our schema. 

**What was fixed:**
- ✅ Removed `username` field from User model (now using `name` instead)
- ✅ Dropped old unique indexes from MongoDB users collection
- ✅ Auth service now uses `name` and `email` as primary identifiers

## Start All Services Now

**Open 5 PowerShell terminals and run these commands:**

### Terminal 1: Auth Service
```powershell
cd "c:\Users\Chiang\Desktop\GameProject_COMP308\Group5_WebProject\Web_Backend\auth-service"
npm run dev
```

### Terminal 2: Issue Service  
```powershell
cd "c:\Users\Chiang\Desktop\GameProject_COMP308\Group5_WebProject\Web_Backend\issue-service"
npm run dev
```

### Terminal 3: AI Service
```powershell
cd "c:\Users\Chiang\Desktop\GameProject_COMP308\Group5_WebProject\Web_Backend\ai-service"
npm run dev
```

### Terminal 4: Gateway
```powershell
cd "c:\Users\Chiang\Desktop\GameProject_COMP308\Group5_WebProject\Web_Backend\gateway"
npm run dev
```

### Terminal 5: Auth Frontend
```powershell
cd "c:\Users\Chiang\Desktop\GameProject_COMP308\Group5_WebProject\Web_Frontend\auth_frontend"
npm run dev
```

## Test Registration & Login

1. **Go to:** http://localhost:3001/register
2. **Register with:**
   - Full Name: `John Doe`
   - Email: `john@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
3. **Click Register**
4. **Expected:** Success and redirect to profile page
5. **Then Test Login:** Go to /login with same credentials

## What Changed

### User Model (`auth-service/models/User.js`)
- **REMOVED:** `username` field with unique index
- **KEPT:** `email` field (unique identifier)
- **ADDED:** `name` required field
- **RESULT:** No more E11000 errors on duplicate null username

### Database Cleanup Done
- Dropped all indexes from users collection
- New indexes will be created automatically on next save

### GraphQL Schema Aligned
- Frontend mutations use `name` parameter
- Backend resolvers accept `name` parameter  
- User type returns `name` field
