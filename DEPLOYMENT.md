# Brain Battle PvP - Deployment Guide

Complete guide for deploying Brain Battle across web, mobile, and desktop platforms.

## Pre-Deployment Checklist

- [ ] All 11 games tested locally
- [ ] Supabase database set up with tables
- [ ] Environment variables configured
- [ ] Profile and settings pages working
- [ ] Statistics tracking functional
- [ ] Cross-device testing completed
- [ ] No console errors

## Web Deployment (Vercel)

### Prerequisites
- Vercel account
- GitHub repository (optional but recommended)

### Deploy Steps

1. **Connect GitHub Repository**
```bash
git push origin main
```

2. **Import Project to Vercel**
- Go to vercel.com
- Click "New Project"
- Select GitHub repository
- Click "Import"

3. **Configure Environment Variables**
In Vercel dashboard:
- Add `NEXT_PUBLIC_SUPABASE_URL`
- Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. **Deploy**
- Click "Deploy"
- Wait for build to complete
- Share the production URL

### Post-Deployment
```bash
# Test production build locally
npm run build
npm run start
```

## Mobile Deployment

### iOS Deployment

**Prerequisites**
- macOS with Xcode 14+
- Apple Developer account
- EAS Build account

**Steps**

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to EAS
eas login

# Build for iOS
eas build --platform ios --distribution app-store

# Submit to App Store (one-time setup)
eas submit --platform ios
```

### Android Deployment

**Prerequisites**
- Java Development Kit (JDK) 11+
- Android SDK
- Google Play Developer account
- EAS account

**Steps**

```bash
# Build for Android
eas build --platform android --distribution google-play

# Submit to Play Store
eas submit --platform android
```

## Desktop Deployment

### Build Electron App

```bash
# Install dependencies
npm install --save-dev electron electron-builder

# Build desktop app
npm run build:electron

# Output: dist/Brain Battle-1.0.0.dmg (macOS)
#         dist/Brain Battle-1.0.0.exe (Windows)
#         dist/brain-battle-1.0.0.AppImage (Linux)
```

### Code Signing (Optional)

```bash
# macOS code signing
export CSC_LINK=/path/to/certificate.p12
export CSC_KEY_PASSWORD=your-password
npm run build:electron
```

## Database Setup

### Step 1: Create Supabase Project

1. Go to supabase.com
2. Click "New Project"
3. Configure:
   - Organization: Select or create
   - Name: `brain-battle`
   - Password: Set strong password
   - Region: Select closest to users
4. Click "Create new project"

### Step 2: Run Database Migration

1. Go to SQL Editor
2. Copy contents of `scripts/setup-pvp-database.sql`
3. Paste into SQL editor
4. Click "Run"

### Step 3: Enable Row Level Security

1. Go to Authentication → Policies
2. For each table (matches, match_participants, user_game_stats):
   - Click "Enable RLS"
   - Add policies from setup script

### Step 4: Get Credentials

1. Go to Project Settings → API
2. Copy:
   - Project URL → NEXT_PUBLIC_SUPABASE_URL
   - Anon Key → NEXT_PUBLIC_SUPABASE_ANON_KEY
3. Add to `.env.local`

## Performance Optimization

### Frontend Optimization

```bash
# Analyze bundle size
npm run build
npm run analyze

# Expected sizes:
# - Initial page: <100KB
# - Game page: <50KB
# - Game component: <30KB
```

### Database Optimization

```sql
-- Verify indexes are created
SELECT indexname FROM pg_indexes WHERE tablename IN ('matches', 'match_participants', 'user_game_stats');

-- Verify query performance
EXPLAIN ANALYZE SELECT * FROM user_game_stats WHERE user_id = 'xxx';
```

### CDN Configuration

For images and assets:
- Use Vercel Edge Network (automatic)
- Set cache headers: `Cache-Control: public, max-age=31536000`
- Use `.webp` format for images

## Monitoring & Analytics

### Set Up Error Tracking

```bash
# Sentry integration
npm install @sentry/nextjs

# Configure in next.config.mjs
```

### Monitor Performance

- Check Vercel Analytics dashboard
- Monitor Supabase database metrics
- Track real-time user activity

### Logs

```bash
# View deployment logs
vercel logs

# View function logs
vercel logs --follow
```

## Testing Checklist

### Functional Testing
- [ ] All 11 games playable end-to-end
- [ ] Game selection works
- [ ] Results persist to database
- [ ] Profile stats update correctly
- [ ] Settings save properly
- [ ] Navigation works smoothly

### Cross-Platform Testing
- [ ] Web: Chrome, Firefox, Safari
- [ ] iOS: iPhone 14, iPhone 15 Pro
- [ ] Android: Pixel 6, Samsung S24
- [ ] Desktop: Windows 11, macOS 14, Ubuntu 22

### Performance Testing
- [ ] Game loads in <2 seconds
- [ ] Touch response <100ms
- [ ] No memory leaks in long play
- [ ] Offline functionality works
- [ ] Lighthouse score >90

### Security Testing
- [ ] No SQL injection vulnerabilities
- [ ] API routes protected with auth
- [ ] RLS policies enforce access control
- [ ] Environment variables not exposed
- [ ] HTTPS enforced in production

## Troubleshooting

### Build Failures

```bash
# Clear build cache
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection Issues

```bash
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Test connection
curl https://[PROJECT_ID].supabase.co/rest/v1/
```

### Game State Not Persisting

1. Check localStorage in DevTools
2. Verify Supabase RLS policies
3. Check network requests in DevTools
4. Review error logs

## Rollback Procedure

### Vercel Rollback
```bash
# View deployments
vercel list

# Rollback to previous
vercel rollback [DEPLOYMENT_ID]
```

### Database Rollback
```bash
# Via Supabase dashboard:
# 1. Go to Backups
# 2. Select restore point
# 3. Click "Restore"
```

## Support & Maintenance

### Regular Maintenance
- Monthly security updates
- Database optimization quarterly
- Mobile app store reviews
- Performance monitoring

### Contact & Issues
- GitHub Issues: bug reports
- Email: support@brainbattle.com
- Discord: Community server

---

Last Updated: January 2025
Version: 1.0.0
