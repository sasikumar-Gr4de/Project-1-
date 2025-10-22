```sql
CREATE TABLE matches (
  match_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  home_club_id UUID NOT NULL,
  away_club_id UUID NOT NULL,
  match_date TIMESTAMP NOT NULL,
  venue VARCHAR(100),
  competition VARCHAR(100), -- e.g., 'La Liga Juvenil'
  match_status VARCHAR(20) NOT NULL CHECK (match_status IN ('scheduled', 'ongoing', 'completed', 'postponed')),
  score_home INT,
  score_away INT,
  duration_minutes INT, -- e.g., 90
  video_url VARCHAR(255), -- URL to match video footage
  tagged_by UUID, -- User who tagged the match data, nullable
  qa_status VARCHAR(20), -- e.g., 'pending', 'approved', 'rejected'
  notes TEXT, -- Additional comments or observations
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (home_club_id) REFERENCES clubs(club_id),
  FOREIGN KEY (away_club_id) REFERENCES clubs(club_id),
  FOREIGN KEY (tagged_by) REFERENCES users(id)
);

-- Example Data
INSERT INTO matches (match_id, home_club_id, away_club_id, match_date, venue, competition, match_status, score_home, score_away, duration_minutes, video_url, tagged_by, qa_status, notes)
VALUES
  ('550e8400-e29b-41d4-a716-446655440000', '550e8403-e29b-41d4-a716-446655440004', '550e8404-e29b-41d4-a716-446655440005', '2025-10-09 16:30:00', 'Santiago Bernabeu, Madrid, Spain', 'La Liga Juvenil', 'completed', 2, 1, 90, 'https://example.com/video/match1.mp4', '550e8405-e29b-41d4-a716-446655440007', 'approved', 'Reviewed by annotator, all events verified'),
  ('550e8401-e29b-41d4-a716-446655440001', '550e8404-e29b-41d4-a716-446655440005', '550e8403-e29b-41d4-a716-446655440004', '2025-10-09 19:00:00', 'Camp Nou, Barcelona, Spain', 'La Liga Juvenil', 'completed', 1, 2, 90, 'https://example.com/video/match63.mp4', '550e8404-e29b-41d4-a716-446655440006', 'pending', 'QA in progress, check final 15min events');
```
