```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
id UUID REFERENCES auth.users(id) PRIMARY KEY,
role TEXT NOT NULL DEFAULT 'player' CHECK (role IN ('player', 'coach', 'admin')),
player_name TEXT,
date_of_birth DATE,
position TEXT,
academy TEXT,
tier_plan TEXT NOT NULL DEFAULT 'free' CHECK (tier_plan IN ('free', 'basic', 'pro', 'elite')),
country TEXT,
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read their own data, admins can read all
CREATE POLICY "Users can view own profile" ON users
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
FOR SELECT USING (
EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Users can update their own data
CREATE POLICY "Users can update own profile" ON users
FOR UPDATE USING (auth.uid() = id);

-- Player data table
CREATE TABLE player_data (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
user_id UUID REFERENCES users(id) NOT NULL,
gps_file TEXT,
video_file TEXT,
match_date DATE NOT NULL,
notes TEXT,
status TEXT DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'processing', 'completed', 'failed')),
created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for player_data
ALTER TABLE player_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own player data" ON player_data
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own player data" ON player_data
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all player data" ON player_data
FOR SELECT USING (
EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Processing queue table
CREATE TABLE processing_queue (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
player_data_id UUID REFERENCES player_data(id) NOT NULL,
status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
logs TEXT,
started_at TIMESTAMPTZ,
completed_at TIMESTAMPTZ,
created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for processing_queue (admin only)
ALTER TABLE processing_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can access processing queue" ON processing_queue
FOR ALL USING (
EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Reports table
CREATE TABLE reports (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
player_id UUID REFERENCES users(id) NOT NULL,
player_data_id UUID REFERENCES player_data(id) NOT NULL,
score_json JSONB NOT NULL,
pdf_url TEXT,
overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
status TEXT DEFAULT 'generated' CHECK (status IN ('generating', 'generated', 'failed')),
created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for reports
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reports" ON reports
FOR SELECT USING (auth.uid() = player_id);

CREATE POLICY "Admins can view all reports" ON reports
FOR SELECT USING (
EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Benchmarks table
CREATE TABLE benchmarks (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
position TEXT NOT NULL,
age_group TEXT NOT NULL,
averages_json JSONB NOT NULL,
season TEXT,
is_active BOOLEAN DEFAULT true,
created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for benchmarks (read-only for authenticated users)
ALTER TABLE benchmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view benchmarks" ON benchmarks
FOR SELECT USING (auth.role() = 'authenticated' AND is_active = true);

-- Subscriptions table
CREATE TABLE subscriptions (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
user_id UUID REFERENCES users(id) NOT NULL,
stripe_subscription_id TEXT UNIQUE,
stripe_customer_id TEXT,
plan_type TEXT NOT NULL CHECK (plan_type IN ('basic', 'pro', 'elite')),
status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid')),
current_period_start TIMESTAMPTZ,
current_period_end TIMESTAMPTZ,
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions" ON subscriptions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all subscriptions" ON subscriptions
FOR SELECT USING (
EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Alerts table
CREATE TABLE alerts (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
user_id UUID REFERENCES users(id) NOT NULL,
type TEXT NOT NULL CHECK (type IN ('email', 'whatsapp')),
status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
subject TEXT,
message TEXT,
metadata JSONB,
sent_at TIMESTAMPTZ,
created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for alerts
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own alerts" ON alerts
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all alerts" ON alerts
FOR SELECT USING (
EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);


-- OTP table for authentication
CREATE TABLE auth_otp (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT,
    phone TEXT,
    otp TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_auth_otp_email ON auth_otp(email);
CREATE INDEX idx_auth_otp_phone ON auth_otp(phone);
CREATE INDEX idx_auth_otp_expires ON auth_otp(expires_at);

-- RLS for auth_otp (no direct user access needed)
ALTER TABLE auth_otp ENABLE ROW LEVEL SECURITY;
CREATE POLICY "No direct access to OTP table" ON auth_otp FOR ALL USING (false);

```

# GR4DE Platform Database Schema

## Tables Overview

### users

Extends Supabase auth.users with additional profile information.

### player_data

Stores uploaded files and match data for processing.

### processing_queue

Tracks the status of file processing jobs.

### reports

Stores generated player reports with scores and PDF URLs.

### benchmarks

Reference data for position and age group comparisons.

### subscriptions

Manages user subscription plans and billing.

### alerts

Tracks email and WhatsApp notifications.

### auth_otp

Handles OTP-based authentication.

## RLS Policies

All tables have Row Level Security enabled with appropriate policies:

- Users can only access their own data
- Admins have full access
- Processing queue is admin-only
- Benchmarks are read-only for authenticated users
