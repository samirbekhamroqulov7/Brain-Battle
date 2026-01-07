# Brain Battle - Deployment & Launch Guide

## Phase 1: Local Development Setup

### 1. Environment Variables
Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
DATABASE_URL=your_postgres_url
REDIS_URL=your_redis_url
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001

# Monetization
NEXT_PUBLIC_GOOGLE_ADSENSE_ID=ca-pub-xxxxxxxxxxxxxxxx
NEXT_PUBLIC_GOOGLE_ADMOB_ID=ca-pub-xxxxxxxxxxxxxxxx
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 2. Install Dependencies
```bash
npm install
# Install additional for real-time:
npm install socket.io socket.io-client redis
# For 3D:
npm install three @react-three/fiber @react-three/drei
```

### 3. Setup Supabase
1. Create project at supabase.com
2. Copy SQL schema from `lib/db/supabase-schema.ts`
3. Run in Supabase SQL editor
4. Enable Row Level Security policies
5. Create Realtime subscriptions for game tables

### 4. Start Development
```bash
npm run dev
# Open http://localhost:3000
```

## Phase 2: Testing

### Game Testing Checklist

**Each Game Needs:**
- [ ] Move validation (no invalid moves allowed)
- [ ] Win condition detection
- [ ] Draw condition detection
- [ ] Real-time synchronization (2 clients)
- [ ] Disconnect/reconnect handling
- [ ] Game state persistence
- [ ] Score tracking
- [ ] Performance under 100ms latency

**Run Tests:**
```bash
npm run test
# Specific game test:
npm run test -- --testPathPattern=tic-tac-toe
```

### Load Testing
```bash
# Install artillery
npm install -g artillery

# Run load test
artillery quick --count 100 --num 10 http://localhost:3000/api/pvp/matchmake
```

## Phase 3: Deployment to Vercel

### 1. Connect GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git push -u origin main
```

### 2. Create Vercel Project
1. Go to vercel.com
2. Import GitHub repo
3. Add environment variables (copy from `.env.local`)
4. Deploy

### 3. Custom Domain
```
Vercel Project Settings → Domains
Add your custom domain
Update DNS records
```

## Phase 4: Backend Deployment

### Option A: AWS EC2 + Socket.io
```bash
# Server setup
npm init -y
npm install express socket.io cors
# Create socket-server.js for real-time

# Deploy with PM2
npm install -g pm2
pm2 start socket-server.js
pm2 startup
```

### Option B: Heroku
```bash
heroku create brain-battle-backend
git push heroku main
heroku config:set REDIS_URL=...
```

## Phase 5: Mobile Deployment

### iOS (App Store)
1. Create Apple Developer account
2. Use Capacitor or React Native Web
3. Create `.ipa` build
4. Submit to App Store

### Android (Google Play)
1. Create Google Play Developer account
2. Build APK/AAB:
```bash
npm install -g @capacitor/cli
npx cap init
npx cap build android
```
3. Submit APK to Play Store

## Phase 6: Monitoring & Analytics

### Sentry (Error Tracking)
```bash
npm install @sentry/nextjs
```

### LogRocket (Session Replay)
```bash
npm install logrocket
```

### Vercel Analytics
- Auto-enabled in Vercel projects
- Monitor Core Web Vitals

## Phase 7: Optimization

### Performance
```bash
npm run build
npm run analyze  # Bundle size analysis
```

### Database Optimization
```sql
-- Add indexes for common queries
CREATE INDEX idx_ratings_leaderboard ON game_ratings(game_type, rating DESC);
CREATE INDEX idx_sessions_player ON game_sessions(player_id, created_at DESC);
```

## Phase 8: Go Live Checklist

**Before Launch:**
- [ ] All 10 games fully tested
- [ ] Matchmaking stable (< 5s)
- [ ] Database backups configured
- [ ] Monitoring/alerts setup
- [ ] Support email configured
- [ ] Privacy policy updated
- [ ] Terms of service ready
- [ ] Ads networks configured
- [ ] Social media accounts ready

**Day 1 (Launch):**
- [ ] Deploy frontend to Vercel
- [ ] Deploy backend servers
- [ ] Enable ad networks
- [ ] Start monitoring metrics
- [ ] Post social media announcements
- [ ] Monitor error tracking

## Monitoring Commands

```bash
# Check logs
vercel logs

# Monitor socket connections
tail -f server.log | grep "connected"

# Database health
SELECT COUNT(*) FROM users;
SELECT AVG(rating) FROM game_ratings;
