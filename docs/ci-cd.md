# 🔄 CI/CD Pipeline - DualTech.1V1

## Overview

This document describes the Continuous Integration and Continuous Deployment (CI/CD) pipeline for DualTech.1V1, including automated testing, preview deployments, database migrations, and production releases.

---

## Pipeline Architecture

```
┌─────────────┐
│   Push to   │
│   GitHub    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│  GitHub Actions / Vercel        │
│  - Lint & Type Check            │
│  - Unit Tests                   │
│  - Build Next.js                │
└──────────────┬──────────────────┘
               │
               ├─────────────┬─────────────┐
               │             │             │
               ▼             ▼             ▼
         ┌─────────┐   ┌──────────┐   ┌─────────┐
         │ Preview │   │ Staging  │   │  Prod   │
         │ (PRs)   │   │ (main)   │   │ (merge) │
         └─────────┘   └──────────┘   └─────────┘
               │             │             │
               ▼             ▼             ▼
         ┌─────────────────────────────────────┐
         │  Automated Post-Deploy Checks       │
         │  - Health endpoints                 │
         │  - Database connectivity            │
         │  - Smoke tests                      │
         └─────────────────────────────────────┘
```

---

## 1. Repository Setup

### 1.1 Branch Strategy

```bash
main          # Production branch (protected)
  ├── develop # Staging branch
  └── feature/* # Feature branches
```

### 1.2 Branch Protection Rules

```bash
# GitHub Settings > Branches > Add rule

Branch: main
☑ Require pull request reviews (1 approval)
☑ Require status checks to pass
  - build
  - lint
  - type-check
  - test
☑ Require branches to be up to date
☑ Require conversation resolution
☐ Allow force pushes (DISABLED)
☐ Allow deletions (DISABLED)
```

---

## 2. Automated Testing

### 2.1 GitHub Actions Workflow

**`.github/workflows/ci.yml`**

```yaml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run ESLint
        run: npm run lint
  
  type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: TypeScript Check
        run: npx tsc --noEmit
  
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
        env:
          NODE_ENV: test
  
  build:
    runs-on: ubuntu-latest
    needs: [lint, type-check, test]
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: .next/
          retention-days: 1
```

### 2.2 Local Pre-commit Hooks

**`.husky/pre-commit`**

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run linting
npm run lint

# Run type checking
npx tsc --noEmit

# Run tests on changed files
npm test -- --bail --findRelatedTests
```

**Setup:**

```bash
npm install -D husky
npx husky install
npx husky add .husky/pre-commit "npm run lint && npx tsc --noEmit"
```

---

## 3. Preview Deployments (Pull Requests)

### 3.1 Automatic Preview on PR

```bash
# Vercel automatically deploys PRs to preview URLs
# Example: https://dualtech-pr-123.vercel.app

# Each PR gets:
- Unique preview URL
- Isolated environment
- Full functionality (connects to staging DB)
- Comment on PR with deployment URL
```

### 3.2 Preview Environment Variables

```bash
# Vercel Dashboard > Project > Settings > Environment Variables

# Preview environment:
NEXT_PUBLIC_SUPABASE_URL = https://staging-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = staging-anon-key
SUPABASE_SERVICE_ROLE_KEY = staging-service-role-key
BETTER_AUTH_SECRET = staging-secret
BETTER_AUTH_URL = https://dualtech-pr-*.vercel.app
LOG_LEVEL = debug
```

### 3.3 Preview Testing Checklist

```bash
# Automated checks (add to GitHub Actions)
- [ ] Build succeeds
- [ ] All pages load without errors
- [ ] API routes return expected status codes
- [ ] Database connectivity works
- [ ] Authentication flow functional

# Manual checks (reviewer)
- [ ] UI changes look correct
- [ ] New features work as expected
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Performance acceptable
```

---

## 4. Database Migration Pipeline

### 4.1 Migration Strategy

```bash
# Migrations run in order:
1. Create migration file: supabase/migrations/YYYYMMDDHHMMSS_description.sql
2. Test locally: supabase db reset
3. Commit to version control
4. Apply to staging: Supabase CLI or manual in SQL Editor
5. Verify staging works
6. Apply to production: Supabase CLI or manual in SQL Editor
7. Monitor production
```

### 4.2 Safe Migration Practices

```sql
-- ✅ GOOD: Backward compatible
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;

-- ✅ GOOD: Safe index creation
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_room_time 
ON messages(room_id, created_at DESC);

-- ✅ GOOD: Nullable new columns
ALTER TABLE users ADD COLUMN level INT DEFAULT 0;

-- ❌ BAD: Breaking change
ALTER TABLE profiles DROP COLUMN username; -- DON'T DO THIS

-- ❌ BAD: Blocks writes
CREATE INDEX idx_messages ON messages(room_id); -- Missing CONCURRENTLY

-- ❌ BAD: No default for required column
ALTER TABLE profiles ADD COLUMN required_field TEXT NOT NULL; -- FAILS
```

### 4.3 Migration Deployment

**GitHub Actions for Migrations:**

```yaml
# .github/workflows/deploy-migrations.yml
name: Deploy Migrations

on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy to'
        required: true
        type: choice
        options:
          - staging
          - production

jobs:
  deploy-migration:
    runs-on: ubuntu-latest
    environment: ${{ github.event.inputs.environment }}
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Supabase CLI
        run: |
          npm install -g supabase
      
      - name: Deploy to Supabase
        run: |
          supabase link --project-ref ${{ secrets.SUPABASE_PROJECT_REF }}
          supabase db push
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
      
      - name: Verify Migration
        run: |
          # Add verification queries
          supabase db remote exec "SELECT version FROM supabase_migrations.schema_migrations ORDER BY version DESC LIMIT 1;"
```

---

## 5. Production Deployment

### 5.1 Deployment Trigger

```bash
# Automatic on merge to main
1. PR approved and merged to main
2. GitHub Actions runs CI pipeline
3. Vercel detects push to main
4. Vercel builds and deploys to production
5. Automated health checks run
6. Deployment marked as success/failure
```

### 5.2 Production Checklist

```bash
# Pre-deployment
- [ ] All tests passing
- [ ] PR approved by 1+ reviewers
- [ ] Database migrations tested on staging
- [ ] Environment variables configured
- [ ] Rollback plan documented
- [ ] Team notified of deployment time

# During deployment
- [ ] Monitor deployment logs
- [ ] Watch error rates in real-time
- [ ] Check database connection pool

# Post-deployment (15 minutes)
- [ ] Smoke test critical paths
- [ ] Verify realtime working
- [ ] Check API response times
- [ ] Monitor error logs
- [ ] Verify database queries performing well
```

### 5.3 Automated Smoke Tests

**`.github/workflows/smoke-test.yml`**

```yaml
name: Smoke Tests

on:
  deployment_status:

jobs:
  smoke-test:
    runs-on: ubuntu-latest
    if: github.event.deployment_status.state == 'success'
    
    steps:
      - name: Test Homepage
        run: |
          curl -f https://dualtech1v1.com || exit 1
      
      - name: Test API Health
        run: |
          curl -f https://dualtech1v1.com/api/health || exit 1
      
      - name: Test Stats Endpoint
        run: |
          STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://dualtech1v1.com/api/supabase/stats)
          if [ $STATUS -ne 401 ] && [ $STATUS -ne 200 ]; then
            exit 1
          fi
      
      - name: Test Database Connection
        run: |
          curl -f https://dualtech1v1.com/api/supabase/rooms || exit 1
      
      - name: Notify on Failure
        if: failure()
        uses: 8398a7/action-slack@v3
        with:
          status: failure
          text: 'Smoke tests failed after deployment!'
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 6. Monitoring & Observability

### 6.1 Application Monitoring

```bash
# Vercel Analytics
- Page views
- Load times (Web Vitals)
- Error rates
- Function invocations
- Bandwidth usage

# Custom Metrics Endpoint
GET /api/observability/metrics
{
  "avgLatencies": {
    "/api/supabase/messages": 45,
    "/api/supabase/matches": 67,
    "/api/supabase/stats": 123
  },
  "percentiles": {
    "/api/supabase/messages": {
      "p50": 42,
      "p95": 89,
      "p99": 156
    }
  },
  "errorCounts": 3
}
```

### 6.2 Database Monitoring

```bash
# Supabase Dashboard > Reports

Monitor:
- Query performance (slow queries)
- Database size growth
- Connection pool usage
- Realtime connections
- API request volume
- Error rates
```

### 6.3 Alerting

**Vercel Deployment Notifications:**

```bash
# Vercel Dashboard > Project > Settings > Notifications

Configure:
- Deployment Started
- Deployment Ready
- Deployment Failed
- Deployment Error

Send to:
- Email
- Slack webhook
- Discord webhook
```

**Custom Alerts (GitHub Actions):**

```yaml
# .github/workflows/health-check.yml
name: Health Check

on:
  schedule:
    - cron: '*/15 * * * *'  # Every 15 minutes

jobs:
  health-check:
    runs-on: ubuntu-latest
    steps:
      - name: Check Production Health
        run: |
          RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://dualtech1v1.com)
          if [ $RESPONSE -ne 200 ]; then
            echo "Production is down! Status: $RESPONSE"
            exit 1
          fi
      
      - name: Alert on Failure
        if: failure()
        uses: 8398a7/action-slack@v3
        with:
          status: failure
          text: '🚨 Production health check failed!'
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 7. Secrets Management

### 7.1 GitHub Secrets

```bash
# GitHub Repository > Settings > Secrets and variables > Actions

Required secrets:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY (for migrations)
- SUPABASE_ACCESS_TOKEN (for Supabase CLI)
- BETTER_AUTH_SECRET
- SLACK_WEBHOOK_URL (optional, for alerts)
- VERCEL_TOKEN (for Vercel API)
- VERCEL_ORG_ID
- VERCEL_PROJECT_ID
```

### 7.2 Vercel Environment Variables

```bash
# Vercel Dashboard > Project > Settings > Environment Variables

# Separate values for:
- Production (secure, real data)
- Preview (staging DB, debug mode)
- Development (local .env.local)

# Security:
- Mark sensitive variables as "Encrypted"
- Use separate credentials per environment
- Rotate secrets quarterly
- Never log SUPABASE_SERVICE_ROLE_KEY
```

---

## 8. Performance Benchmarks

### 8.1 Target Metrics

```bash
# API Response Times (p95)
- GET /api/supabase/messages: < 100ms
- POST /api/supabase/messages: < 150ms
- GET /api/supabase/matches: < 200ms
- POST /api/supabase/matches: < 250ms
- GET /api/supabase/stats: < 300ms

# Realtime Latency
- Event send → receive: < 150ms

# Database Queries
- Simple SELECT: < 50ms
- Complex JOIN: < 200ms
- Aggregations: < 300ms

# Page Load (Web Vitals)
- FCP (First Contentful Paint): < 1.8s
- LCP (Largest Contentful Paint): < 2.5s
- CLS (Cumulative Layout Shift): < 0.1
- FID (First Input Delay): < 100ms
```

### 8.2 Performance Testing

```bash
# Load testing with k6
# tests/load/api-test.js

import http from 'k6/http';
import { check } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<300'], // 95% under 300ms
    http_req_failed: ['rate<0.01'],   // < 1% errors
  },
};

export default function () {
  let res = http.get('https://dualtech1v1.com/api/supabase/rooms');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 300ms': (r) => r.timings.duration < 300,
  });
}
```

**Run tests:**

```bash
npm install -g k6
k6 run tests/load/api-test.js
```

---

## 9. Deployment Frequency

### 9.1 Target Cadence

```bash
# Production Deployments
- Feature releases: 1-2x per week
- Bug fixes: As needed (same day)
- Security patches: Immediate
- Database migrations: 1x per week (off-peak)

# Preview Deployments
- Every PR: Automatic
- Every commit to PR: Automatic rebuild
```

### 9.2 Deployment Windows

```bash
# Preferred deployment times (UTC)
- Major releases: Tuesday-Thursday, 09:00-15:00
- Minor releases: Any weekday, 09:00-17:00
- Emergency fixes: Anytime

# Avoid deployments:
- Friday after 12:00 (weekend risk)
- During high-traffic events
- Major holidays
```

---

## 10. Rollback Procedures

See [rollback.md](./rollback.md) for detailed procedures.

**Quick rollback:**

```bash
# Automatic rollback on health check failure
vercel rollback

# Manual rollback
vercel promote <previous-deployment-url> --prod
```

---

## 11. Documentation Requirements

### 11.1 Required Documentation for Deployments

```bash
# Every major feature must include:
- [ ] README.md update (if user-facing)
- [ ] API documentation (if new endpoints)
- [ ] Database migration (if schema changes)
- [ ] Environment variable changes
- [ ] Rollback procedure (if complex)
- [ ] Testing instructions
```

### 11.2 Deployment Runbook

```markdown
## Feature: [Feature Name]

**Deployment Date:** YYYY-MM-DD  
**Deployed By:** [Name]  
**Related PRs:** #123, #456

### Changes
- Added XYZ feature
- Modified ABC endpoint
- New database table: `new_table`

### Pre-deployment
- [x] Tests passing
- [x] Database migration created
- [x] Environment variables updated
- [x] Team notified

### Post-deployment
- [x] Smoke tests passed
- [x] Monitoring shows normal metrics
- [x] No user reports of issues

### Rollback Plan
If issues occur: `vercel rollback` + restore DB from backup
```

---

## 12. Compliance & Audit

### 12.1 Audit Logging

```bash
# All deployments logged automatically by:
- GitHub Actions (workflow runs)
- Vercel (deployment history)
- Supabase (database change logs)

# Query deployment history:
vercel ls --json > deployments.json
```

### 12.2 Change Approval Process

```bash
# For production deployments:
1. Developer creates PR
2. Automated tests run
3. Code review by 1+ team members
4. PR approved
5. Merge to main (triggers deployment)
6. Automated health checks
7. Manual verification within 15 minutes
```

---

## 13. Disaster Recovery

### 13.1 Backup Strategy

```bash
# Automated Backups (Supabase)
- Hourly snapshots (last 24 hours)
- Daily backups (last 7 days)
- Weekly backups (last 4 weeks)

# Manual Backups
- Before major migrations
- Before schema changes
- Before bulk data operations

# Application Backups (Vercel)
- All deployments retained for 90 days
- Git history for full recovery
```

### 13.2 Recovery Time Objectives

```bash
# RTO (Recovery Time Objective)
- Application rollback: 5 minutes
- Database restore: 30 minutes
- Full disaster recovery: 2 hours

# RPO (Recovery Point Objective)
- Data loss tolerance: < 1 hour (hourly backups)
```

---

## 14. Success Metrics

### 14.1 CI/CD Performance

```bash
# Target metrics:
- Build time: < 5 minutes
- Test execution: < 3 minutes
- Deployment time: < 2 minutes
- Total PR → Production: < 30 minutes

# Reliability:
- Deployment success rate: > 95%
- Rollback rate: < 5%
- Mean time to recovery: < 15 minutes
```

### 14.2 Quality Metrics

```bash
# Code quality:
- Test coverage: > 80%
- Linting errors: 0
- Type errors: 0
- Security vulnerabilities: 0 high/critical

# Performance:
- Failed deployments: < 5%
- Build failures: < 10%
- Flaky tests: < 2%
```

---

## 15. Continuous Improvement

### 15.1 Monthly Review

```bash
# Analyze:
- Deployment frequency
- Failure rates
- Rollback frequency
- Build times
- Test reliability

# Actions:
- Optimize slow tests
- Fix flaky tests
- Update documentation
- Improve automation
```

### 15.2 Quarterly Goals

```bash
Q1 2025:
- [ ] Achieve < 3 minute build times
- [ ] Implement automated performance testing
- [ ] Zero production incidents from deployments
- [ ] 90%+ test coverage on critical paths

Q2 2025:
- [ ] Implement blue-green deployments
- [ ] Add automated security scanning
- [ ] Integrate error tracking (Sentry)
- [ ] Set up centralized logging
```

---

## Appendix: CI/CD Checklist

### Pre-Deployment Checklist

```bash
- [ ] All tests passing locally
- [ ] Linting passes
- [ ] TypeScript compiles without errors
- [ ] Database migrations tested
- [ ] Environment variables configured
- [ ] PR approved by reviewer
- [ ] No merge conflicts
- [ ] Feature flagged (if risky)
- [ ] Rollback plan documented
- [ ] Team notified (if major release)
```

### Post-Deployment Checklist

```bash
- [ ] Deployment succeeded
- [ ] Health checks passing
- [ ] No error spikes in logs
- [ ] API response times normal
- [ ] Database queries performing well
- [ ] Realtime connections working
- [ ] User-facing pages load correctly
- [ ] Monitoring shows green status
- [ ] No user reports of issues (15 min)
- [ ] Deployment logged in runbook
```

---

## Support & Resources

- **Vercel Docs:** https://vercel.com/docs
- **GitHub Actions:** https://docs.github.com/en/actions
- **Supabase CLI:** https://supabase.com/docs/guides/cli
- **Next.js Deployment:** https://nextjs.org/docs/deployment
