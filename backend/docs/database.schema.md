```sql
-- ROLE ENUM
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('player', 'coach', 'admin');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'player',
  ADD COLUMN IF NOT EXISTS tier_plan TEXT DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT NULL,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS avatar_url TEXT NULL;

create table public.subscriptions (
  id uuid not null default extensions.uuid_generate_v4 (),
  user_id uuid not null,
  stripe_subscription_id text null,
  stripe_customer_id text null,
  plan_type text not null,
  status text not null,
  current_period_start timestamp with time zone null,
  current_period_end timestamp with time zone null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint subscriptions_pkey primary key (id),
  constraint subscriptions_stripe_subscription_id_key unique (stripe_subscription_id),
  constraint subscriptions_user_id_fkey foreign KEY (user_id) references users (id),
  constraint subscriptions_plan_type_check check (
    (
      plan_type = any (array['basic'::text, 'pro'::text, 'elite'::text])
    )
  ),
  constraint subscriptions_status_check check (
    (
      status = any (
        array[
          'active'::text,
          'canceled'::text,
          'past_due'::text,
          'unpaid'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS players (
  player_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NULL REFERENCES users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS player_identity (
  player_id uuid PRIMARY KEY REFERENCES players(player_id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  dob DATE,
  nationality TEXT,
  height_cm INT,
  weight_kg INT,
  preferred_foot TEXT CHECK (preferred_foot IN ('left','right','both')),
  positions TEXT[],
  headshot_url TEXT,
  guardian_name TEXT,
  guardian_email TEXT,
  guardian_phone TEXT,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS player_passport (
  passport_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES players(player_id) ON DELETE CASCADE,
  current_club TEXT,
  season TEXT,
  squad_level TEXT,
  shirt_number TEXT,
  notes TEXT,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS player_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES players(player_id) ON DELETE CASCADE,
  video_url TEXT NULL,
  gps_url TEXT NULL,
  event_json jsonb NULL,
  match_date DATE,
  upload_source TEXT,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS processing_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_data_id uuid REFERENCES player_data(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending','processing','completed','failed')) DEFAULT 'pending',
  logs TEXT,
  retries INT DEFAULT 0,
  started_at timestamptz NULL,
  completed_at timestamptz NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS player_metrics (
  metric_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES players(player_id) ON DELETE CASCADE,
  match_id uuid,
  date DATE,
  competition TEXT,
  minutes INT,
  gps_summary jsonb,
  event_summary jsonb,
  gr4de_score NUMERIC,
  benchmarks jsonb,
  source TEXT,
  raw_file_url TEXT,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_player_metrics_player_date
  ON player_metrics (player_id, date DESC);

CREATE TABLE IF NOT EXISTS player_reports (
  report_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES players(player_id) ON DELETE CASCADE,
  report_type TEXT,
  period_start DATE,
  period_end DATE,
  summary_json jsonb,
  pdf_url TEXT,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT unique_report_period UNIQUE (player_id, period_start, period_end, report_type)
);

CREATE TABLE IF NOT EXISTS player_media (
  media_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES players(player_id) ON DELETE CASCADE,
  media_type TEXT CHECK (media_type IN ('video','image','link')),
  title TEXT,
  description TEXT,
  url TEXT,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS player_verifications (
  verification_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES players(player_id) ON DELETE CASCADE,
  document_type TEXT CHECK (document_type IN ('passport','club_letter','consent')),
  file_url TEXT,
  status TEXT CHECK (status IN ('pending','approved','rejected')) DEFAULT 'pending',
  reviewed_by uuid REFERENCES users(id),
  reviewed_at timestamptz,
  hash_sha256 TEXT,
  review_note TEXT,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tempo_benchmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level TEXT,
  position TEXT,
  avg_pass_speed NUMERIC,
  touch_time NUMERIC,
  sequences_per_min NUMERIC
);

CREATE TABLE IF NOT EXISTS tempo_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES players(player_id),
  match_id uuid,
  event_data jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tempo_player_match (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES players(player_id),
  match_id uuid,
  tempo_index NUMERIC,
  avg_pass_speed NUMERIC,
  touch_time NUMERIC,
  seq_rate NUMERIC,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tempo_match (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid,
  team_tempo NUMERIC,
  accuracy NUMERIC,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  key TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  price NUMERIC DEFAULT 0,
  tier INT NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS plan_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid REFERENCES plans(id) ON DELETE CASCADE,
  module_id uuid REFERENCES modules(id) ON DELETE CASCADE,
  limit_value INT NULL,
  UNIQUE (plan_id, module_id)
);

CREATE TABLE IF NOT EXISTS role_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role user_role NOT NULL,
  module_id uuid REFERENCES modules(id) ON DELETE CASCADE,
  force_allow BOOLEAN DEFAULT FALSE,
  force_deny BOOLEAN DEFAULT FALSE,
  UNIQUE (role, module_id)
);

CREATE TABLE IF NOT EXISTS user_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  module_key TEXT NOT NULL,
  used_count INT DEFAULT 0,
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, module_key, period_start, period_end)
);

CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  player_id uuid REFERENCES players(player_id),
  type TEXT CHECK (type IN ('email','whatsapp')),
  channel TEXT,
  subject TEXT,
  message TEXT,
  metadata jsonb,
  status TEXT CHECK (status IN ('pending','sent','failed')) DEFAULT 'pending',
  sent_at timestamptz NULL,
  error TEXT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  log_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES users(id),
  entity TEXT,
  entity_id uuid,
  action TEXT,
  diff_json jsonb,
  created_at timestamptz DEFAULT now()
);

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
