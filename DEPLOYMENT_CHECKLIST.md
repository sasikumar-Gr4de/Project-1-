# GR4DE Platform Deployment Checklist

## Pre-Deployment Verification

### 1. Database Migrations

- [ ] Run `backend/migrations/001_adjust_plans_and_modules.sql` in Supabase
- [ ] Verify all tables exist: users, players, player*data, processing_queue, player_metrics, tempo*\*, player_reports, alerts, modules, plans, plan_modules, role_modules
- [ ] Confirm subscriptions.plan_type constraint includes 'free', 'basic', 'pro'
- [ ] Check processing_queue has new columns: idempotency_key, last_retry_at, max_retries
- [ ] Verify player_reports has processing_queue_id, gr4de_score, tempo_index columns
- [ ] Confirm alerts table has processing_queue_id and report_id columns

### 2. Environment Variables

- [ ] Set MODEL_SERVER_URL (production VPS URL)
- [ ] Set MODEL_SERVER_SECRET (shared HMAC secret)
- [ ] Configure AWS S3 credentials and bucket
- [ ] Set Supabase credentials
- [ ] Configure Stripe keys
- [ ] Set JWT_SECRET and other auth variables

### 3. Model Server Setup

- [ ] Deploy model-server to VPS
- [ ] Install dependencies: `npm install`
- [ ] Set MODEL_SERVER_SECRET environment variable
- [ ] Start server: `npm start` or use PM2
- [ ] Verify health endpoint: `GET /health`
- [ ] Test HMAC verification with sample request

### 4. Backend Testing

- [ ] Run integration tests: `npm test`
- [ ] Verify API endpoints respond correctly:
  - `POST /api/v1/uploads`
  - `GET /api/v1/queue/:id/status`
  - `GET /api/v1/reports/:playerId`
  - `GET /api/v1/report/:reportId`
  - `GET /api/v1/features`
- [ ] Test HMAC signing to model server
- [ ] Verify S3 upload/download functionality

### 5. Frontend Verification

- [ ] Confirm existing stores/services unchanged
- [ ] Test upload page with mock data
- [ ] Verify queue polling works
- [ ] Check report display shows new metrics
- [ ] Confirm toast notifications appear
- [ ] Test existing auth flow remains intact

## Deployment Steps

### Phase 1: Backend Deployment

1. Deploy backend to Vercel/production
2. Run database migrations
3. Update environment variables
4. Verify API endpoints accessible

### Phase 2: Model Server Deployment

1. Deploy model server to VPS
2. Configure reverse proxy (nginx/Caddy)
3. Set up SSL certificate
4. Enable PM2 process management
5. Test HMAC authentication

### Phase 3: Frontend Deployment

1. Deploy frontend to Vercel
2. Update API URLs if changed
3. Test end-to-end flow with real data

## Post-Deployment Testing

### End-to-End Test

1. **Upload Flow**:

   - User uploads video via frontend
   - Verify presigned URL generation
   - Check player_data record created
   - Confirm processing_queue record created

2. **Processing Flow**:

   - Verify model server receives HMAC-signed request
   - Check model server returns valid response
   - Confirm backend stores results in all tables
   - Verify PDF generation and S3 upload

3. **Notification Flow**:

   - Check alerts table populated
   - Verify queue status updates to completed
   - Confirm frontend shows completion toast

4. **Report Display**:
   - Test report page loads new metrics
   - Verify PDF download works
   - Check tempo index and GR4DE score display

### Performance Testing

- [ ] Test concurrent uploads
- [ ] Verify queue processing doesn't block
- [ ] Check memory usage during PDF generation
- [ ] Monitor model server response times

### Security Verification

- [ ] Confirm HMAC signatures validated
- [ ] Verify signed S3 URLs expire correctly
- [ ] Check role-based access controls
- [ ] Test feature gating by plan

## Rollback Plan

### If Issues Detected

#### Option 1: Feature Flag Rollback

1. Set MODEL_SERVER_URL to empty string
2. Uploads will be accepted but processing skipped
3. Show "Processing temporarily unavailable" message
4. Users can still access existing reports

#### Option 2: Database Rollback

1. Create backup of current database state
2. Revert migrations in reverse order:
   ```sql
   -- Remove new columns
   ALTER TABLE processing_queue DROP COLUMN IF EXISTS idempotency_key;
   ALTER TABLE processing_queue DROP COLUMN IF EXISTS last_retry_at;
   ALTER TABLE processing_queue DROP COLUMN IF EXISTS max_retries;
   ALTER TABLE player_reports DROP COLUMN IF EXISTS processing_queue_id;
   ALTER TABLE player_reports DROP COLUMN IF EXISTS gr4de_score;
   ALTER TABLE player_reports DROP COLUMN IF EXISTS tempo_index;
   ALTER TABLE alerts DROP COLUMN IF EXISTS processing_queue_id;
   ALTER TABLE alerts DROP COLUMN IF EXISTS report_id;
   ```
3. Restore from backup if needed

#### Option 3: Full Rollback

1. Revert backend to previous version
2. Revert frontend to previous version
3. Keep database changes (they're additive only)
4. Model server can remain running (won't be called)

### Monitoring During Rollback

- [ ] Monitor error rates
- [ ] Check user upload attempts
- [ ] Verify existing reports still accessible
- [ ] Confirm auth flow unaffected

## Success Criteria

### Functional Requirements

- [ ] Users can upload video/GPS data
- [ ] Processing queue shows correct status
- [ ] Reports generate with GR4DE scores
- [ ] PDF downloads work
- [ ] Admin retry functionality works
- [ ] Feature gating respects plans

### Performance Requirements

- [ ] Upload response time < 5 seconds
- [ ] Queue polling updates within 10 seconds
- [ ] PDF generation < 30 seconds
- [ ] Model server response < 60 seconds

### Security Requirements

- [ ] All model server requests HMAC signed
- [ ] No sensitive data in logs
- [ ] S3 URLs properly signed and expired
- [ ] Role-based access enforced

## Go-Live Checklist

- [ ] All pre-deployment verifications complete
- [ ] End-to-end testing successful
- [ ] Performance benchmarks met
- [ ] Security audit passed
- [ ] Rollback procedures documented
- [ ] Monitoring alerts configured
- [ ] Support team briefed on new features
- [ ] User communication prepared

**Deployment Commander**: ********\_\_\_\_********
**Date**: ********\_\_\_\_********
**Approval**: ********\_\_\_\_********
