```sql
-- Enable the uuid-ossp extension (run separately if permitted)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the matches table
CREATE TABLE matches (
  match_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- Auto-generated UUID
  home_club_id UUID NOT NULL,
  away_club_id UUID NOT NULL,
  match_date TIMESTAMP NOT NULL,
  venue VARCHAR(100),
  competition VARCHAR(100) NOT NULL, -- e.g., 'La Liga Juvenil'
  match_status VARCHAR(20) NOT NULL CHECK (match_status IN ('scheduled', 'ongoing', 'completed', 'postponed', 'cancelled')),
  score_home INT CHECK (score_home >= 0), -- Non-negative scores
  score_away INT CHECK (score_away >= 0), -- Non-negative scores
  duration_minutes INT CHECK (duration_minutes > 0 AND duration_minutes <= 120), -- Realistic match duration (90-120 min)
  video_url VARCHAR(255), -- URL to match video footage
  tagged_by UUID, -- User who tagged the match data, nullable
  qa_status VARCHAR(20) CHECK (qa_status IN ('pending', 'approved', 'rejected', 'in_progress')), -- e.g., 'pending', 'approved', 'rejected'
  notes TEXT, -- Additional comments or observations
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_home_away_different CHECK (home_club_id != away_club_id), -- Prevent same team playing both sides
  CONSTRAINT chk_match_status_score CHECK (
    (match_status IN ('scheduled', 'postponed', 'cancelled') AND score_home IS NULL AND score_away IS NULL) OR
    (match_status IN ('ongoing', 'completed') AND score_home IS NOT NULL AND score_away IS NOT NULL)
  ),
  FOREIGN KEY (home_club_id) REFERENCES clubs(club_id) ON DELETE RESTRICT,
  FOREIGN KEY (away_club_id) REFERENCES clubs(club_id) ON DELETE RESTRICT,
  FOREIGN KEY (tagged_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Create a trigger function to update updated_at
CREATE OR REPLACE FUNCTION update_matches_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function on update
CREATE TRIGGER update_matches_updated_at
BEFORE UPDATE ON matches
FOR EACH ROW
EXECUTE FUNCTION update_matches_updated_at();

-- Example Data
INSERT INTO matches (match_id, home_club_id, away_club_id, match_date, venue, competition, match_status, score_home, score_away, duration_minutes, video_url, tagged_by, qa_status, notes)
VALUES
  ('550e8400-e29b-41d4-a716-446655440000', '550e8403-e29b-41d4-a716-446655440004', '550e8404-e29b-41d4-a716-446655440005', '2025-10-09 16:30:00+07', 'Santiago Bernabeu, Madrid, Spain', 'La Liga Juvenil', 'completed', 2, 1, 90, 'https://example.com/video/match1.mp4', '550e8405-e29b-41d4-a716-446655440007', 'approved', 'Reviewed by annotator, all events verified'),
  ('550e8401-e29b-41d4-a716-446655440001', '550e8404-e29b-41d4-a716-446655440005', '550e8403-e29b-41d4-a716-446655440004', '2025-10-09 19:00:00+07', 'Camp Nou, Barcelona, Spain', 'La Liga Juvenil', 'completed', 1, 2, 90, 'https://example.com/video/match63.mp4', '550e8404-e29b-41d4-a716-446655440006', 'pending', 'QA in progress, check final 15min events');
```
