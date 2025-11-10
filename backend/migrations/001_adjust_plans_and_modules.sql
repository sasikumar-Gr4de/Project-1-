-- Adjust subscriptions plan_type check constraint to include 'free', 'basic', 'pro'
ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_plan_type_check;
ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_plan_type_check CHECK (
  plan_type = ANY (ARRAY['free'::text, 'basic'::text, 'pro'::text])
);

-- Create player_passport_shares table for public sharing
CREATE TABLE IF NOT EXISTS player_passport_shares (
  share_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES players(player_id) ON DELETE CASCADE,
  share_token TEXT UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  revoked_at timestamptz NULL,
  revoked_by uuid REFERENCES users(id)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_player_passport_shares_token ON player_passport_shares(share_token);
CREATE INDEX IF NOT EXISTS idx_player_passport_shares_player ON player_passport_shares(player_id);
CREATE INDEX IF NOT EXISTS idx_player_passport_shares_active ON player_passport_shares(is_active, expires_at);

-- Add verification workflow columns to player_verifications
ALTER TABLE player_verifications
  ADD COLUMN IF NOT EXISTS verification_badge TEXT CHECK (verification_badge IN ('identity_verified', 'club_verified')),
  ADD COLUMN IF NOT EXISTS badge_granted_at timestamptz NULL,
  ADD COLUMN IF NOT EXISTS badge_expires_at timestamptz NULL;

-- Add passport status tracking
ALTER TABLE players
  ADD COLUMN IF NOT EXISTS passport_status TEXT DEFAULT 'draft' CHECK (passport_status IN ('draft', 'pending_review', 'verified', 'rejected'));

-- Add guardian consent tracking for minors
ALTER TABLE player_identity
  ADD COLUMN IF NOT EXISTS guardian_consent_given BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS consent_date DATE NULL;

-- Add missing columns to processing_queue for idempotency and retry logic
ALTER TABLE processing_queue
  ADD COLUMN IF NOT EXISTS idempotency_key TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS last_retry_at timestamptz NULL,
  ADD COLUMN IF NOT EXISTS max_retries INT DEFAULT 3;

-- Add missing columns to player_reports for better tracking
ALTER TABLE player_reports
  ADD COLUMN IF NOT EXISTS processing_queue_id uuid REFERENCES processing_queue(id),
  ADD COLUMN IF NOT EXISTS gr4de_score NUMERIC,
  ADD COLUMN IF NOT EXISTS tempo_index NUMERIC;

-- Add missing columns to alerts for better tracking
ALTER TABLE alerts
  ADD COLUMN IF NOT EXISTS processing_queue_id uuid REFERENCES processing_queue(id),
  ADD COLUMN IF NOT EXISTS report_id uuid REFERENCES player_reports(report_id);

-- Insert default modules
INSERT INTO modules (name, key, description) VALUES
  ('Video Processing', 'video_processing', 'Upload and process video files'),
  ('GPS Processing', 'gps_processing', 'Upload and process GPS data'),
  ('Report Generation', 'report_generation', 'Generate performance reports'),
  ('Player Passport', 'passport', 'Digital player passport management'),
  ('Verification', 'verification', 'Document verification process'),
  ('Benchmarks', 'benchmarks', 'Performance benchmarking'),
  ('Admin Analytics', 'admin_analytics', 'Administrative analytics and reporting')
ON CONFLICT (key) DO NOTHING;

-- Insert default plans
INSERT INTO plans (key, name, price, tier) VALUES
  ('free', 'Free', 0, 0),
  ('basic', 'Basic', 29.99, 1),
  ('pro', 'Pro', 99.99, 2)
ON CONFLICT (key) DO NOTHING;

-- Insert plan_modules for free plan (limited modules)
INSERT INTO plan_modules (plan_id, module_id, limit_value)
SELECT p.id, m.id, CASE m.key
  WHEN 'video_processing' THEN 1
  WHEN 'gps_processing' THEN 1
  WHEN 'report_generation' THEN 1
  ELSE NULL
END
FROM plans p, modules m
WHERE p.key = 'free' AND m.key IN ('video_processing', 'gps_processing', 'report_generation')
ON CONFLICT (plan_id, module_id) DO NOTHING;

-- Insert plan_modules for basic plan
INSERT INTO plan_modules (plan_id, module_id, limit_value)
SELECT p.id, m.id, CASE m.key
  WHEN 'video_processing' THEN 5
  WHEN 'gps_processing' THEN 5
  WHEN 'report_generation' THEN 10
  WHEN 'passport' THEN NULL
  WHEN 'verification' THEN NULL
  WHEN 'benchmarks' THEN NULL
  ELSE NULL
END
FROM plans p, modules m
WHERE p.key = 'basic' AND m.key IN ('video_processing', 'gps_processing', 'report_generation', 'passport', 'verification', 'benchmarks')
ON CONFLICT (plan_id, module_id) DO NOTHING;

-- Insert plan_modules for pro plan (all modules, higher limits)
INSERT INTO plan_modules (plan_id, module_id, limit_value)
SELECT p.id, m.id, CASE m.key
  WHEN 'video_processing' THEN NULL -- unlimited
  WHEN 'gps_processing' THEN NULL
  WHEN 'report_generation' THEN NULL
  WHEN 'passport' THEN NULL
  WHEN 'verification' THEN NULL
  WHEN 'benchmarks' THEN NULL
  WHEN 'admin_analytics' THEN NULL
  ELSE NULL
END
FROM plans p, modules m
WHERE p.key = 'pro'
ON CONFLICT (plan_id, module_id) DO NOTHING;

-- Insert role_modules (admins have all access)
INSERT INTO role_modules (role, module_id, force_allow)
SELECT 'admin', m.id, TRUE
FROM modules m
ON CONFLICT (role, module_id) DO NOTHING;