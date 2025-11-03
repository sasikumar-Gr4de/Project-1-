```sql
create table public.alerts (
  id uuid not null default extensions.uuid_generate_v4 (),
  user_id uuid not null,
  type text not null,
  status text null default 'pending'::text,
  subject text null,
  message text null,
  metadata jsonb null,
  sent_at timestamp with time zone null,
  created_at timestamp with time zone null default now(),
  constraint alerts_pkey primary key (id),
  constraint alerts_user_id_fkey foreign KEY (user_id) references users (id),
  constraint alerts_status_check check (
    (
      status = any (
        array['pending'::text, 'sent'::text, 'failed'::text]
      )
    )
  ),
  constraint alerts_type_check check (
    (
      type = any (array['email'::text, 'whatsapp'::text])
    )
  )
) TABLESPACE pg_default;

create table public.auth_otp (
  id uuid not null default extensions.uuid_generate_v4 (),
  email text null,
  phone text null,
  otp text not null,
  expires_at timestamp with time zone not null,
  used boolean null default false,
  created_at timestamp with time zone null default now(),
  constraint auth_otp_pkey primary key (id)
) TABLESPACE pg_default;

create index IF not exists idx_auth_otp_email on public.auth_otp using btree (email) TABLESPACE pg_default;

create index IF not exists idx_auth_otp_phone on public.auth_otp using btree (phone) TABLESPACE pg_default;

create index IF not exists idx_auth_otp_expires on public.auth_otp using btree (expires_at) TABLESPACE pg_default;

create table public.benchmarks (
  id uuid not null default extensions.uuid_generate_v4 (),
  position text not null,
  age_group text not null,
  averages_json jsonb not null,
  season text null,
  is_active boolean null default true,
  created_at timestamp with time zone null default now(),
  constraint benchmarks_pkey primary key (id)
) TABLESPACE pg_default;

create table public.player_data (
  id uuid not null default extensions.uuid_generate_v4 (),
  player_id uuid not null,
  gps_file text null,
  video_file text null,
  match_date date not null,
  notes text null,
  status text null default 'uploaded'::text,
  created_at timestamp with time zone null default now(),
  jersey_number integer null default 1,
  jersey_home_color text null,
  jersey_away_color text null,
  position text null,
  constraint player_data_pkey primary key (id),
  constraint player_data_user_id_fkey foreign KEY (player_id) references users (id),
  constraint player_data_status_check check (
    (
      status = any (
        array[
          'uploaded'::text,
          'processing'::text,
          'completed'::text,
          'failed'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

create table public.processing_queue (
  id uuid not null default extensions.uuid_generate_v4 (),
  player_data_id uuid not null,
  status text null default 'pending'::text,
  logs text null,
  started_at timestamp with time zone null,
  completed_at timestamp with time zone null,
  created_at timestamp with time zone null default now(),
  constraint processing_queue_pkey primary key (id),
  constraint processing_queue_player_data_id_fkey foreign KEY (player_data_id) references player_data (id),
  constraint processing_queue_status_check check (
    (
      status = any (
        array[
          'pending'::text,
          'processing'::text,
          'completed'::text,
          'failed'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

create table public.reports (
  id uuid not null default extensions.uuid_generate_v4 (),
  player_id uuid not null,
  player_data_id uuid not null,
  score_json jsonb not null,
  pdf_url text null,
  overall_score integer null,
  status text null default 'generated'::text,
  created_at timestamp with time zone null default now(),
  constraint reports_pkey primary key (id),
  constraint reports_player_data_id_fkey foreign KEY (player_data_id) references player_data (id),
  constraint reports_player_id_fkey foreign KEY (player_id) references users (id),
  constraint reports_overall_score_check check (
    (
      (overall_score >= 0)
      and (overall_score <= 100)
    )
  ),
  constraint reports_status_check check (
    (
      status = any (
        array[
          'generating'::text,
          'generated'::text,
          'failed'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

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

create table public.users (
  id uuid not null default gen_random_uuid (),
  role text not null default 'player'::text,
  player_name text null,
  date_of_birth date null,
  position text null,
  academy text null,
  tier_plan text not null default 'free'::text,
  country text null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  email character varying null,
  phone character varying null,
  avatar_url character varying null,
  stripe_customer_id text null,
  status text null,
  constraint users_pkey primary key (id),
  constraint users_role_check check (
    (
      role = any (
        array['player'::text, 'coach'::text, 'admin'::text]
      )
    )
  ),
  constraint users_tier_plan_check check (
    (
      tier_plan = any (
        array[
          'free'::text,
          'basic'::text,
          'pro'::text,
          'elite'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

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
