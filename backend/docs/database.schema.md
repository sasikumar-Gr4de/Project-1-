```sql
-- =========================================
-- USERS (Players, Coaches, Admins)
-- =========================================
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),

  -- Identity
  role text not null default 'player'
    check (role in ('player','coach','admin')),
  player_name text,
  date_of_birth date,
  position text,
  academy text,
  country text,
  avatar_url text,

  -- Contact/Auth
  email varchar,
  phone varchar,

  -- Stripe
  stripe_customer_id text,
  tier_plan text not null default 'free'
    check (tier_plan in ('free','basic','pro')),
  status text,

  -- Meta
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =========================================
-- AUTH OTP (Email / WhatsApp Login)
-- =========================================
create table if not exists public.auth_otp (
  id uuid primary key default gen_random_uuid(),
  email text,
  phone text,
  otp text not null,
  expires_at timestamptz not null,
  used boolean default false,
  created_at timestamptz default now()
);

create index if not exists idx_auth_otp_email on public.auth_otp(email);
create index if not exists idx_auth_otp_phone on public.auth_otp(phone);
create index if not exists idx_auth_otp_expires on public.auth_otp(expires_at);


-- =========================================
-- PLAYER IDENTITIES (Digital Passport)
-- =========================================
create table if not exists public.player_identity (
  player_id uuid primary key references public.users(id) on delete cascade,
  first_name text,
  last_name text,
  dob date,
  nationality text,
  height_cm int,
  weight_kg int,
  preferred_foot text check (preferred_foot in ('left','right','both')),
  positions text[],
  headshot_url text,
  guardian_name text,
  guardian_email text,
  guardian_phone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.player_passport (
  passport_id uuid primary key default gen_random_uuid(),
  player_id uuid references public.users(id) on delete cascade,
  current_club text,
  season text,
  squad_level text,
  shirt_number text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);


-- =========================================
-- PLAYER VERIFICATION DOCUMENTS
-- =========================================
create table if not exists public.player_verifications (
  verification_id uuid primary key default gen_random_uuid(),
  player_id uuid references public.users(id) on delete cascade,
  document_type text check (document_type in ('passport','club_letter','consent')),
  file_url text,
  status text default 'pending' check (status in ('pending','approved','rejected')),
  reviewed_by uuid references public.users(id),
  reviewed_at timestamptz,
  hash_sha256 text,
  created_at timestamptz default now()
);


create table if not exists public.player_metrics (
  metric_id uuid primary key default gen_random_uuid(),
  player_id uuid references public.users(id) on delete cascade,
  match_id uuid,
  date date,
  competition text,
  minutes int,
  gps_summary jsonb,
  event_summary jsonb,
  gr4de_score numeric,
  benchmarks jsonb,
  source text,
  raw_file_url text,
  created_at timestamptz default now()
);

create index if not exists idx_player_metrics_player_date
on public.player_metrics (player_id, date desc);

create table if not exists public.audit_logs (
  log_id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.users(id),
  entity text,
  entity_id uuid,
  action text,
  diff_json jsonb,
  created_at timestamptz default now()
);


-- =========================================
-- USER SUBSCRIPTIONS (Stripe)
-- =========================================
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,

  stripe_subscription_id text unique,
  stripe_customer_id text,

  plan_type text not null check(plan_type in ('free','basic','pro')),
  status text not null check(status in ('active','canceled','past_due','unpaid')),

  current_period_start timestamptz,
  current_period_end timestamptz,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =========================================
-- FEATURE MODULES (Premium Feature Flags)
-- =========================================
create table if not exists public.feature_modules (
  id serial primary key,
  module_key text unique,
  module_name text,
  description text
);

-- =========================================
-- PLAN-MODULE ACCESS MATRIX
-- =========================================
create table if not exists public.plan_module_access (
  plan text references public.users(tier_plan) on delete cascade,
  module_key text references public.feature_modules(module_key),
  primary key(plan, module_key)
);

create table if not exists public.player_reports (
  report_id uuid primary key default gen_random_uuid(),
  player_id uuid references public.users(id) on delete cascade,
  report_type text,
  period_start date,
  period_end date,
  summary_json jsonb,
  pdf_url text,
  created_at timestamptz default now(),
  unique(player_id, period_start, period_end, report_type)
);

create table if not exists public.player_media (
  media_id uuid primary key default gen_random_uuid(),
  player_id uuid references public.users(id) on delete cascade,
  media_type text check (media_type in ('video','image','link')),
  title text,
  description text,
  url text,
  created_at timestamptz default now()
);


-- =========================================
-- PLAYER RAW UPLOADS
-- =========================================
create table if not exists public.player_data (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references public.users(id) on delete cascade,
  match_id text,
  file_url text,
  file_type text check (file_type in ('video','gps','csv')),
  status text default 'uploaded' check(status in ('uploaded','parsed','failed')),
  metadata jsonb,
  created_at timestamptz default now()
);


create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  player_data_id uuid references public.player_data(id) on delete cascade,
  player_id uuid references public.users(id),
  event jsonb,
  created_at timestamptz default now()
);

create table if not exists public.gps_data (
  id uuid primary key default gen_random_uuid(),
  player_data_id uuid references public.player_data(id) on delete cascade,
  player_id uuid references public.users(id),
  metric jsonb,
  created_at timestamptz default now()
);

-- =========================================
-- PROCESSING QUEUE (Scoring Pipeline)
-- =========================================
create table if not exists public.processing_queue (
  id uuid primary key default gen_random_uuid(),
  player_data_id uuid references public.player_data(id),
  status text default 'pending'
    check(status in ('pending','processing','completed','failed')),
  logs text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.scores (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references public.users(id),
  player_data_id uuid references public.player_data(id),
  score_json jsonb,
  overall_score int,
  technical numeric,
  tactical numeric,
  physical numeric,
  mental numeric,
  growth_bonus numeric,
  created_at timestamptz default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references public.users(id),
  player_data_id uuid references public.player_data(id),
  pdf_url text,
  score_json jsonb,
  overall_score int check (overall_score between 0 and 100),
  status text default 'generated'
    check(status in ('generating','generated','failed')),
  created_at timestamptz default now()
);

create table if not exists public.benchmarks (
  id uuid primary key default gen_random_uuid(),
  position text,
  metric text,
  mean_value numeric,
  std_dev numeric,
  percentile_10 numeric,
  percentile_50 numeric,
  percentile_90 numeric,
  updated_at timestamptz default now()
);

create table if not exists public.trajectories (
  player_id uuid primary key references public.users(id),
  trend_slope numeric,
  velocity numeric,
  stability numeric,
  updated_at timestamptz default now()
);

create table if not exists public.tempo_events (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references public.users(id),
  match_id uuid,
  event jsonb,
  created_at timestamptz default now()
);

create table if not exists public.tempo_player_match (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references public.users(id),
  match_id uuid,
  tempo_index numeric,
  avg_pass_speed numeric,
  touch_to_pass numeric,
  sequences_per_min numeric,
  execution_accuracy numeric,
  created_at timestamptz default now()
);

create table if not exists public.tempo_benchmarks (
  id uuid primary key default gen_random_uuid(),
  position text,
  age_group text,
  metric text,
  mean numeric,
  std_dev numeric,
  created_at timestamptz default now()
);

create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id),
  type text check(type in ('email','whatsapp')),
  status text default 'pending',
  subject text,
  message text,
  metadata jsonb,
  created_at timestamptz default now()
);

create table if not exists public.passport_public_links (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references public.users(id),
  token text unique not null,
  expires_at timestamptz,
  is_active boolean default true,
  created_at timestamptz default now()
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
