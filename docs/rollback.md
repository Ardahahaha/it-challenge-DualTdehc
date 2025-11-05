# 🔄 Rollback Guide - DualTech.1V1

## Overview

This guide covers safe rollback procedures for production issues, including code deployment, database migrations, and data recovery.

---

## Quick Reference

| Issue | Command | Time |
|-------|---------|------|
| Bad deployment | `vercel rollback` | < 1 min |
| Database migration | Restore from backup | 5-10 min |
| Data corruption | Point-in-time recovery | 10-30 min |
| Full disaster | Full restore | 30-60 min |

---

## 1. Application Rollback (Vercel)

### 1.1 Identify Problem Deployment

```bash
# List recent deployments
vercel ls

# View logs of current deployment
vercel logs <deployment-url>

# Check error rate spike in Vercel Analytics
# Dashboard > Analytics > Errors
```

### 1.2 Instant Rollback to Previous Deployment

**Via Dashboard (Easiest):**

```bash
1. Go to Vercel Dashboard > Project > Deployments
2. Find last known good deployment (green checkmark)
3. Click "..." menu
4. Click "Promote to Production"
5. Confirm rollback
6. Verify at production URL
```

**Via CLI:**

```bash
# Rollback to previous deployment
vercel rollback

# Rollback to specific deployment
vercel promote <deployment-url> --prod

# Verify
curl https://your-app.vercel.app/api/health
```

### 1.3 Rollback Verification

```bash
# Check deployment ID
vercel inspect <deployment-url>

# Test critical paths
curl https://your-app.vercel.app/api/supabase/stats
curl https://your-app.vercel.app/api/supabase/rooms

# Monitor error logs for 5 minutes
vercel logs --follow | grep error

# Check Supabase logs
# Dashboard > Logs > Real-time logs
```

---

## 2. Database Migration Rollback

### 2.1 Identify Failed Migration

```sql
-- Check migration history (if using Supabase CLI)
SELECT * FROM supabase_migrations.schema_migrations
ORDER BY version DESC
LIMIT 10;

-- Check for errors
SELECT * FROM pg_stat_activity
WHERE state = 'idle in transaction (aborted)';
```

### 2.2 Rollback Options

**Option A: Restore from Automatic Backup (Last 24h)**

```bash
1. Supabase Dashboard > Database > Backups
2. Select backup before migration (hourly backups available)
3. Click "Restore"
4. Confirm (creates new project or restores in-place)
5. Wait for restoration (~5-10 minutes)
6. Verify data integrity
```

**Option B: Point-in-Time Recovery (PITR)**

```bash
# Available on Pro plan and above
1. Supabase Dashboard > Database > Backups
2. Click "Point in Time Recovery"
3. Select timestamp before failed migration
4. Click "Start Recovery"
5. Wait for completion (~10-30 minutes)
6. Verify data
```

**Option C: Manual Migration Reversal**

```sql
-- Example: Reverting XP functions migration
-- supabase/migrations/20250105000002_xp_skills_history_functions_ROLLBACK.sql

BEGIN;

-- Drop triggers
DROP TRIGGER IF EXISTS trg_match_complete_xp ON public.matches;

-- Drop functions
DROP FUNCTION IF EXISTS public.fn_match_complete_xp();
DROP FUNCTION IF EXISTS public.fn_add_xp(uuid, text, int, text);
DROP FUNCTION IF EXISTS public.fn_set_skill_level(uuid, int, int);
DROP FUNCTION IF EXISTS public.fn_write_history(uuid, public.history_kind, uuid);

-- Drop views
DROP VIEW IF EXISTS public.v_user_stats;
DROP VIEW IF EXISTS public.v_user_history_detailed;
DROP VIEW IF EXISTS public.v_user_skills_detailed;
DROP VIEW IF EXISTS public.v_user_xp_totals;

COMMIT;
```

### 2.3 Test After Rollback

```sql
-- Verify tables intact
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Check data counts
SELECT 
  (SELECT COUNT(*) FROM profiles) as profiles,
  (SELECT COUNT(*) FROM rooms) as rooms,
  (SELECT COUNT(*) FROM messages) as messages,
  (SELECT COUNT(*) FROM matches) as matches;

-- Test queries
SELECT * FROM profiles LIMIT 5;
SELECT * FROM messages ORDER BY created_at DESC LIMIT 10;
```

---

## 3. Data Recovery

### 3.1 Recover Deleted Data

**From Backup:**

```bash
# If data was deleted in last 24 hours
1. Restore to temporary project from backup
2. Export deleted data:
   pg_dump -h temp-project.supabase.co -U postgres \
     -t profiles -t messages --data-only > recovered_data.sql
3. Import to production:
   psql -h prod-project.supabase.co -U postgres < recovered_data.sql
```

**From PITR:**

```bash
# Pro plan: Point-in-time recovery
1. Create PITR restore point before deletion
2. Query recovered data
3. Copy to production via SQL
```

### 3.2 Recover from Data Corruption

```sql
-- Identify corrupt records
SELECT * FROM messages 
WHERE content IS NULL 
  OR content = '' 
  OR author_id IS NULL;

-- Backup corrupt data for analysis
CREATE TABLE messages_corrupt AS 
SELECT * FROM messages WHERE content IS NULL;

-- Delete corrupt records
DELETE FROM messages WHERE content IS NULL;

-- Restore from backup if needed
-- (Follow section 3.1)
```

---

## 4. Configuration Rollback

### 4.1 Environment Variables

**Revert to Previous Values:**

```bash
# View current production env vars
vercel env ls production

# Remove bad variable
vercel env rm VARIABLE_NAME production

# Add previous value
vercel env add VARIABLE_NAME production
# Enter: previous-value

# Redeploy to apply changes
vercel --prod
```

### 4.2 RLS Policy Rollback

```sql
-- Disable problematic policy
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;

-- Or drop specific policy
DROP POLICY IF EXISTS "messages_insert_author" ON messages;

-- Recreate old policy
CREATE POLICY "messages_insert_author" ON messages
  FOR INSERT
  WITH CHECK (author_id = auth.uid());

-- Re-enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
```

### 4.3 Rate Limit Adjustment

```typescript
// src/lib/rate-limit/index.ts
// Temporarily increase limits during incident

export const RateLimitPresets = {
  chat: {
    maxRequests: 100, // Increased from 30
    windowMs: 60 * 1000,
  },
  // ...
};

// Deploy: vercel --prod
// Revert once issue resolved
```

---

## 5. Incident Response Workflow

### 5.1 Detection

```bash
# Monitor for issues
1. Vercel Analytics shows error spike
2. User reports via support
3. Automated alerts (if configured)
4. Log monitoring shows errors
```

### 5.2 Assessment (5 minutes max)

```bash
# Check error logs
vercel logs --follow | grep error

# Check database
psql -h project.supabase.co -c "SELECT version();"

# Check API endpoints
curl https://your-app.vercel.app/api/supabase/stats

# Identify scope:
- Frontend only? → Vercel rollback
- Backend only? → Check recent changes
- Database? → Check migrations
- All systems? → Check Supabase status page
```

### 5.3 Decision Tree

```
Error Detected
    ↓
Affects < 10% users?
    YES → Monitor, prepare fix
    NO → IMMEDIATE ROLLBACK
    ↓
Rollback
    ↓
Verify Fix
    ↓
Root Cause Analysis
    ↓
Deploy Fixed Version
```

### 5.4 Rollback Execution (5-10 minutes)

```bash
# Step 1: Announce (if user-facing)
# Post status update on status page

# Step 2: Rollback code
vercel rollback

# Step 3: Rollback database (if needed)
# Supabase Dashboard > Database > Backups > Restore

# Step 4: Verify
curl https://your-app.vercel.app/api/health
# Check user-facing pages

# Step 5: Monitor
vercel logs --follow | grep error
# Watch for 15 minutes

# Step 6: Communicate
# Update status: "Incident resolved. Investigating root cause."
```

---

## 6. Rollback Testing

### 6.1 Test Rollback Procedure (Pre-Production)

```bash
# Create test deployment
vercel --preview

# Simulate failure
# (e.g., introduce intentional error)

# Practice rollback
vercel rollback

# Verify recovery
# Time the process
# Document lessons learned
```

### 6.2 Database Backup Testing

```bash
# Monthly drill
1. Restore latest backup to temporary project
2. Verify data integrity
3. Test application against restored DB
4. Document recovery time
5. Delete temporary project
```

---

## 7. Prevention Strategies

### 7.1 Pre-Deployment Checklist

- [ ] All tests passing locally
- [ ] Database migrations tested on staging
- [ ] Environment variables configured
- [ ] Rate limits appropriate
- [ ] RLS policies reviewed
- [ ] Backup created manually before deploy
- [ ] Rollback plan documented
- [ ] Team notified of deployment

### 7.2 Canary Deployments

```bash
# Deploy to preview first
vercel --preview

# Test for 30 minutes with real traffic

# If successful, promote
vercel promote <preview-url> --prod
```

### 7.3 Feature Flags

```typescript
// Use for risky features
export const FEATURES = {
  NEW_REALTIME_ENGINE: process.env.FEATURE_REALTIME === 'true',
  ADVANCED_MATCHMAKING: process.env.FEATURE_MATCHMAKING === 'true',
};

// Toggle via environment variables without redeployment
```

---

## 8. Post-Rollback Actions

### 8.1 Immediate (< 1 hour)

```bash
- [ ] Verify service restored
- [ ] Check error logs cleared
- [ ] Monitor metrics return to normal
- [ ] Update status page
- [ ] Notify stakeholders
```

### 8.2 Short-term (< 24 hours)

```bash
- [ ] Root cause analysis
- [ ] Create fix in branch
- [ ] Add tests for regression
- [ ] Document incident
- [ ] Update rollback procedures if needed
```

### 8.3 Long-term (< 1 week)

```bash
- [ ] Deploy fixed version
- [ ] Conduct post-mortem meeting
- [ ] Update documentation
- [ ] Improve monitoring/alerting
- [ ] Train team on lessons learned
```

---

## 9. Rollback Scenarios

### Scenario A: Bad Code Deploy

```bash
Symptom: Frontend errors, 500 responses
Time to Fix: 1-2 minutes
Solution:
  1. vercel rollback
  2. Verify with curl
  3. Monitor logs
```

### Scenario B: Failed Database Migration

```bash
Symptom: Database errors, RLS violations
Time to Fix: 5-10 minutes
Solution:
  1. Supabase Dashboard > Backups > Restore
  2. Wait for restoration
  3. Verify with SQL queries
  4. Clear application cache
```

### Scenario C: Data Corruption

```bash
Symptom: Invalid data in tables
Time to Fix: 10-30 minutes
Solution:
  1. Identify corrupt records (SQL)
  2. Backup corrupt data for analysis
  3. Restore from PITR or backup
  4. Verify data integrity
  5. Update application logic to prevent recurrence
```

### Scenario D: Performance Degradation

```bash
Symptom: Slow responses, timeouts
Time to Fix: 5-15 minutes
Solution:
  1. Check for missing indexes (SQL)
  2. Check for N+1 queries (logs)
  3. Increase rate limits temporarily
  4. Scale database if needed (Supabase)
  5. Deploy performance fix
```

### Scenario E: Security Issue

```bash
Symptom: Unauthorized access detected
Time to Fix: IMMEDIATE
Solution:
  1. IMMEDIATE: Disable affected API routes
  2. Rotate compromised credentials
  3. Patch security vulnerability
  4. Deploy fix with strict testing
  5. Audit access logs
  6. Notify affected users if data exposed
```

---

## 10. Emergency Contacts

```bash
# Internal
- DevOps Lead: [contact]
- Database Admin: [contact]
- Security Lead: [contact]

# External
- Vercel Support: https://vercel.com/support
- Supabase Support: support@supabase.io
- Supabase Status: https://status.supabase.com
```

---

## 11. Rollback Log Template

```markdown
## Incident: [YYYY-MM-DD HH:MM]

**Severity:** [Critical/High/Medium/Low]
**Duration:** [XX minutes]
**Impact:** [X% of users affected]

**Timeline:**
- HH:MM - Issue detected
- HH:MM - Decision to rollback
- HH:MM - Rollback initiated
- HH:MM - Rollback completed
- HH:MM - Service verified restored

**Root Cause:**
[Brief description]

**Resolution:**
[What was rolled back]

**Prevention:**
[What will prevent this in future]

**Action Items:**
- [ ] Fix deployed
- [ ] Tests added
- [ ] Documentation updated
```

---

## 12. Success Criteria

Rollback is successful when:

- ✅ Application returns to normal operation
- ✅ Error rates return to baseline (<0.1%)
- ✅ API response times normal (<300ms p95)
- ✅ Realtime latency normal (<150ms)
- ✅ Users can complete critical flows
- ✅ No data loss occurred
- ✅ Logs show no errors for 15+ minutes
- ✅ Monitoring dashboards show green status

---

## Appendix: SQL Rollback Scripts

### Rollback XP/Skills/History Migration

```sql
-- supabase/rollbacks/20250105000002_ROLLBACK.sql
BEGIN;

DROP TRIGGER IF EXISTS trg_match_complete_xp ON public.matches;
DROP FUNCTION IF EXISTS public.fn_match_complete_xp();
DROP FUNCTION IF EXISTS public.fn_add_xp(uuid, text, int, text);
DROP FUNCTION IF EXISTS public.fn_set_skill_level(uuid, int, int);
DROP FUNCTION IF EXISTS public.fn_write_history(uuid, public.history_kind, uuid);
DROP VIEW IF EXISTS public.v_user_stats;
DROP VIEW IF EXISTS public.v_user_history_detailed;
DROP VIEW IF EXISTS public.v_user_skills_detailed;
DROP VIEW IF EXISTS public.v_user_xp_totals;

COMMIT;
```

### Rollback RLS Policies

```sql
-- supabase/rollbacks/20250105000001_ROLLBACK.sql
BEGIN;

-- Disable RLS on all tables
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.history DISABLE ROW LEVEL SECURITY;

COMMIT;

-- WARNING: Only use in emergency. Re-enable RLS ASAP with correct policies.
```
