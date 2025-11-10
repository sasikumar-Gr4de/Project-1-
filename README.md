# GR4DE Platform - Football Performance Analysis

A comprehensive football performance analysis platform that processes video footage and GPS data to generate detailed player reports using advanced AI and machine learning models.

## Architecture

### Server A: Main Application (Vercel)

- **Frontend**: React 19 + Vite, Tailwind CSS, Zustand state management
- **Backend**: Node.js ESM, Express 5, Supabase PostgreSQL
- **Authentication**: OTP-based (email/WhatsApp), JWT tokens
- **File Storage**: AWS S3 with presigned URLs
- **Payments**: Stripe integration

### Server B: Model Server (VPS)

- **Purpose**: AI/ML processing of video and GPS data
- **Security**: HMAC-signed requests with timestamp validation
- **Models**: Tempo analysis, scoring engine, computer vision

## Features

### Core Functionality

- **Video Upload**: Secure upload of match footage (MP4, MOV, AVI)
- **GPS Data**: Integration with tracking systems (Catapult, Playmaker, etc.)
- **Real-time Processing**: Queue-based analysis with status polling
- **Comprehensive Reports**: GR4DE Score, tempo analysis, technical/tactical/physical/mental metrics
- **PDF Generation**: Automated report generation with charts and insights

### User Management

- **Role-based Access**: Player, Coach, Admin permissions
- **Subscription Tiers**: Free, Basic, Pro with feature gating
- **Player Profiles**: Digital passports with verification
- **Team Management**: Coach oversight and analytics

### Admin Features

- **System Analytics**: Processing queue monitoring, user metrics
- **Content Management**: CMS integration with Sanity
- **Verification Workflow**: Document approval process
- **Subscription Management**: Stripe webhook handling

## API Endpoints

### Upload & Processing

- `POST /api/upload` - Upload video + GPS data
- `GET /api/queue/:id/status` - Poll processing status
- `POST /api/queue/:id/retry` - Retry failed processing (admin)

### Reports

- `GET /api/reports/:playerId` - List player reports
- `GET /api/reports/report/:reportId` - Get single report

### Features

- `GET /api/features` - Get enabled features for user plan

### Model Server

- `POST /api/v1/model/process` - Process video/GPS data (HMAC signed)

## Database Schema

### Core Tables

- `users` - Extended auth.users with profile data
- `players` - Player entities linked to users
- `player_data` - Uploaded match data (video, GPS, events)
- `processing_queue` - Analysis job queue
- `player_metrics` - Computed performance metrics
- `tempo_player_match` - Tempo analysis results
- `tempo_events` - Individual tempo events
- `player_reports` - Generated reports with PDF URLs
- `alerts` - Email/WhatsApp notifications

### Supporting Tables

- `modules` - Feature modules (video_processing, gps_processing, etc.)
- `plans` - Subscription plans (free, basic, pro)
- `plan_modules` - Plan-feature mappings
- `user_usage` - Feature usage tracking

## Environment Variables

### Main Application

```bash
# Database
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Authentication
JWT_SECRET=your_jwt_secret

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET=your_s3_bucket

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Model Server
MODEL_SERVER_URL=https://your-model-server.com
MODEL_SERVER_SECRET=your_hmac_secret

# Other
CLIENT_URL=https://your-frontend-url.com
SERVER_URL=https://your-backend-url.com
```

### Model Server

```bash
PORT=3001
MODEL_SERVER_SECRET=your_hmac_secret
```

## Testing

### End-to-End Test Flow

1. **Upload Test**: Submit video/GPS data via `POST /api/v1/uploads`
2. **Queue Verification**: Check `processing_queue` table has new record with `pending` status
3. **Model Server Call**: Verify HMAC-signed request sent to model server
4. **Mock Response**: Model server returns deterministic results
5. **Result Processing**: Backend stores data in `player_metrics`, `tempo_*` tables
6. **PDF Generation**: Report PDF created and uploaded to S3
7. **Alert Creation**: Email/WhatsApp alerts queued in `alerts` table
8. **Status Update**: Queue status updated to `completed`
9. **Frontend Update**: UI shows completion toast and navigates to report

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Model server tests
cd model-server
npm test

# Integration tests
cd tests
npm test
```

### Manual Testing Checklist

- [ ] Upload video file via frontend
- [ ] Verify presigned URL generation works
- [ ] Check queue polling updates status correctly
- [ ] Confirm report displays GR4DE score and tempo index
- [ ] Test PDF download functionality
- [ ] Verify admin retry functionality
- [ ] Test feature gating based on plan

## Setup Instructions

### Prerequisites

- Node.js 18+
- PostgreSQL (Supabase)
- AWS S3 bucket
- Stripe account
- VPS for model server

### Installation

1. **Clone Repository**

```bash
git clone https://github.com/your-org/gr4de-platform.git
cd gr4de-platform
```

2. **Backend Setup**

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

3. **Frontend Setup**

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

4. **Model Server Setup**

```bash
cd model-server
npm install
cp .env.example .env
# Edit .env with your configuration
npm start
```

5. **Database Migration**

```bash
# Run migrations in Supabase SQL editor
# backend/migrations/001_adjust_plans_and_modules.sql
```

### Deployment

1. **Vercel Deployment** (Frontend + Backend)

```bash
# Frontend
vercel --prod

# Backend API
vercel --prod backend/
```

2. **Model Server** (VPS)

```bash
# Use PM2 or similar for production
pm2 start model-server/index.js --name gr4de-model
```

## Development Workflow

### Upload Flow

1. User uploads video + GPS data via frontend
2. Frontend calls `POST /api/upload` with file URLs
3. Backend creates `player_data` and `processing_queue` records
4. Backend calls model server with HMAC-signed request
5. Model server processes data and returns results
6. Backend stores results in metrics/reports tables
7. Backend creates notification alerts
8. Frontend polls queue status and shows completion

### Security

- HMAC-SHA256 signatures for model server communication
- Timestamp validation (5-minute window)
- JWT authentication for API access
- Row-level security in Supabase
- File access via signed URLs only

## Testing

### End-to-End Test

1. Upload test video file via frontend
2. Verify queue creation and status polling
3. Confirm model server processing
4. Check report generation and PDF creation
5. Verify email/WhatsApp notifications
6. Test report viewing and download

### Manual Testing

```bash
# Test upload endpoint
curl -X POST http://localhost:5000/api/upload \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{"video_url":"https://example.com/video.mp4","match_date":"2024-01-01"}'

# Test queue status
curl http://localhost:5000/api/queue/QUEUE_ID/status \
  -H "Authorization: Bearer YOUR_JWT"
```

## Contributing

1. Follow existing code patterns and architecture
2. Maintain TypeScript/JavaScript consistency
3. Add tests for new features
4. Update documentation
5. Ensure security best practices

## License

Proprietary - GR4DE Platform
