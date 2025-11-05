# 🚀 Deployment Guide - DualTech.1V1

## Overview

This guide covers deploying DualTech.1V1 to production with Vercel (frontend) and Supabase (database/auth).

---

## Prerequisites

- [ ] Vercel account with CLI installed
- [ ] Supabase project created
- [ ] GitHub repository connected
- [ ] Environment variables prepared
- [ ] Database migrations ready

---

## 1. Supabase Setup

### 1.1 Create Supabase Project

```bash
# Via Dashboard
1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Choose organization, name, password, region
4. Wait for provisioning (~2 minutes)
```

### 1.2 Run Database Migrations

**Option A: SQL Editor (Recommended for first deploy)**

```bash
1. Go to SQL Editor in Supabase Dashboard
2. Click "New Query"
3. Copy/paste supabase/migrations/20250105000000_initial_schema.sql
4. Click "Run"
5. Repeat for 20250105000001_enable_rls.sql
6. Repeat for 20250105000002_xp_skills_history_functions.sql
```

**Option B: Supabase CLI**

```bash
# Install CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref <your-project-ref>

# Push migrations
supabase db push
```

### 1.3 Enable Realtime

```bash
1. Go to Database > Replication
2. Find "supabase_realtime" publication
3. Enable these tables:
   - ✅ messages
   - ✅ match_events
4. Click "Save"
```

### 1.4 Verify Tables

```sql
-- Run in SQL Editor
SELECT tablename FROM pg_catalog.pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Expected: profiles, rooms, messages, matches, match_events, 
-- xp_logs, skills, user_skills, history
```

---

## 2. Environment Variables

### 2.1 Get Supabase Credentials

```bash
# Supabase Dashboard > Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # Secret!
```

### 2.2 Set Environment Variables

**Vercel Dashboard:**

```bash
1. Go to Project Settings > Environment Variables
2. Add each variable:
   - NEXT_PUBLIC_SUPABASE_URL (Production, Preview, Development)
   - NEXT_PUBLIC_SUPABASE_ANON_KEY (Production, Preview, Development)
   - SUPABASE_SERVICE_ROLE_KEY (Production only!)
   - BETTER_AUTH_SECRET (Production, Preview, Development)
   - BETTER_AUTH_URL (Production: https://yourdomain.com)
   - LOG_LEVEL=info (Production)
3. Click "Save"
```

**Vercel CLI:**

```bash
# Production
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add BETTER_AUTH_SECRET production
vercel env add BETTER_AUTH_URL production
vercel env add LOG_LEVEL production

# Preview (optional)
vercel env add NEXT_PUBLIC_SUPABASE_URL preview
# ... repeat for preview
```

---

## 3. Vercel Deployment

### 3.1 Initial Deploy

**Via GitHub Integration (Recommended):**

```bash
1. Connect GitHub repository to Vercel
2. Import project
3. Configure:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: .next
4. Add environment variables (see 2.2)
5. Click "Deploy"
```

**Via CLI:**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to production
vercel --prod

# Follow prompts to configure project
```

### 3.2 Verify Deployment

```bash
# Check deployment status
vercel ls

# View logs
vercel logs <deployment-url>

# Test endpoints
curl https://your-app.vercel.app/api/supabase/stats
```

---

## 4. Post-Deployment Checks

### 4.1 Database Verification

```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Verify seed data
SELECT slug FROM rooms WHERE is_public = true;
-- Expected: dev, cyber, ai, networks, sysadmin

SELECT code FROM skills LIMIT 5;
-- Expected: python, javascript, docker, kubernetes, cybersecurity...
```

### 4.2 API Health Checks

```bash
# Test public endpoints
curl https://your-app.vercel.app/api/supabase/rooms

# Test stats endpoint (requires auth)
curl -H "Authorization: Bearer <token>" \
  https://your-app.vercel.app/api/supabase/stats

# Check rate limiting
for i in {1..35}; do 
  curl https://your-app.vercel.app/api/supabase/messages -X POST \
    -H "Content-Type: application/json" \
    -d '{"room_id":"xxx","content":"test"}'; 
done
# Should return 429 after 30 requests
```

### 4.3 Frontend Verification

```bash
# Visit production URL
1. Sign up for new account
2. Verify profile created in Supabase
3. Join a public room
4. Send a message
5. Check Supabase messages table
6. Create a match
7. Verify match in Supabase
```

### 4.4 Realtime Verification

```bash
# Open two browser windows (incognito + regular)
1. Window A: Login as User 1, join "dev" room
2. Window B: Login as User 2, join "dev" room
3. User 1 sends message
4. Verify User 2 receives message instantly (<150ms)
5. Check browser Network tab for WebSocket connection
```

---

## 5. Domain Configuration

### 5.1 Add Custom Domain

```bash
# Vercel Dashboard
1. Go to Project Settings > Domains
2. Add domain: dualtech1v1.com
3. Configure DNS:
   - Type: A
   - Name: @
   - Value: 76.76.21.21 (Vercel IP)
   
   - Type: CNAME
   - Name: www
   - Value: cname.vercel-dns.com

4. Wait for DNS propagation (~10 minutes)
5. Verify SSL certificate is issued
```

### 5.2 Update Environment Variables

```bash
# Update BETTER_AUTH_URL to custom domain
vercel env rm BETTER_AUTH_URL production
vercel env add BETTER_AUTH_URL production
# Enter: https://dualtech1v1.com
```

---

## 6. Monitoring Setup

### 6.1 Vercel Analytics

```bash
1. Go to Project > Analytics
2. Enable Web Analytics
3. Enable Speed Insights
4. Monitor:
   - Page views
   - Load times
   - Error rates
```

### 6.2 Supabase Monitoring

```bash
1. Go to Supabase Dashboard > Reports
2. Monitor:
   - Database size
   - Active connections
   - Query performance
   - API requests
   - Realtime connections
```

### 6.3 Custom Logging

```bash
# View structured logs in Vercel
vercel logs --follow

# Filter errors
vercel logs --follow | grep '"level":"error"'

# View performance metrics
curl https://your-app.vercel.app/api/observability/metrics
```

---

## 7. Performance Optimization

### 7.1 Database Indexes

```sql
-- Verify indexes exist
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Add missing indexes if needed
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_room_time 
ON messages(room_id, created_at DESC);
```

### 7.2 Edge Caching

```typescript
// Add to API routes for cacheable data
export const config = {
  runtime: 'edge',
};

// Add cache headers
return NextResponse.json(data, {
  headers: {
    'Cache-Control': 's-maxage=60, stale-while-revalidate',
  },
});
```

### 7.3 Image Optimization

```bash
# Ensure Next.js Image component is used
# Check next.config.ts has proper domains configured
images: {
  domains: ['supabase.co', 'your-cdn.com'],
},
```

---

## 8. Security Checklist

- [ ] SUPABASE_SERVICE_ROLE_KEY is production-only
- [ ] RLS policies enabled on all tables
- [ ] Rate limiting active on all mutations
- [ ] CORS configured correctly
- [ ] Environment variables encrypted
- [ ] SSL/TLS certificate valid
- [ ] API routes validate all inputs (Zod)
- [ ] Authentication required on protected routes
- [ ] XSS/CSRF protections enabled
- [ ] Database backups enabled (Supabase auto-backup)

---

## 9. Rollback Plan

See [rollback.md](./rollback.md) for detailed rollback procedures.

**Quick rollback:**

```bash
# Vercel - revert to previous deployment
vercel rollback

# Supabase - restore from backup
# Dashboard > Database > Backups > Restore
```

---

## 10. Troubleshooting

### Build Failures

```bash
# Check build logs
vercel logs <deployment-url> --build

# Common issues:
- Missing environment variables → Add in Vercel dashboard
- Type errors → Run `npm run type-check` locally
- Dependency issues → Delete node_modules, npm install
```

### Database Connection Issues

```bash
# Test connection
curl -X POST https://xxxxx.supabase.co/rest/v1/profiles \
  -H "apikey: <anon-key>" \
  -H "Authorization: Bearer <anon-key>"

# Check RLS policies
SELECT * FROM profiles; -- Should work with service role
```

### Realtime Not Working

```bash
# Check Realtime is enabled
1. Supabase Dashboard > Database > Replication
2. Verify tables are in supabase_realtime publication
3. Check browser console for WebSocket errors
4. Verify NEXT_PUBLIC_SUPABASE_URL is correct
```

### Rate Limiting Too Aggressive

```typescript
// Adjust in src/lib/rate-limit/index.ts
export const RateLimitPresets = {
  chat: {
    maxRequests: 50, // Increase from 30
    windowMs: 60 * 1000,
  },
  // ...
};

// Redeploy
vercel --prod
```

---

## 11. Continuous Deployment

### GitHub Actions (Optional)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - run: npm ci
      - run: npm run build
      - run: npm test
      
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 12. Success Criteria

Deployment is successful when:

- ✅ Application loads at production URL
- ✅ All API routes return 200 (authenticated routes return 401 without auth)
- ✅ Rate limiting returns 429 after threshold
- ✅ Realtime messages sync across clients <150ms
- ✅ Database queries complete <300ms (p95)
- ✅ Zero mock data in production
- ✅ User can register, login, send messages, create matches
- ✅ XP awards work and level up correctly
- ✅ All 9 tables exist in Supabase
- ✅ RLS policies active on all tables
- ✅ Logs show structured JSON format

---

## Support

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Issues:** GitHub Issues
- **Logs:** `vercel logs --follow`
