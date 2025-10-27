```sql
-- Enable the uuid-ossp extension (run separately if permitted)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the match_info table
CREATE TABLE match_info (
  match_info_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- Unique identifier for each record
  match_id UUID NOT NULL,
  club_id UUID NOT NULL,
  player_id UUID NOT NULL,
  position VARCHAR(50) NOT NULL,
  start_time DECIMAL(10,2) NOT NULL CHECK (start_time >= 0), -- Start time in minutes (0-90+)
  end_time DECIMAL(10,2) CHECK (end_time IS NULL OR end_time > start_time), -- End time in minutes, must be after start_time
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_match_player CHECK (UNIQUE (match_id, player_id)), -- Prevent duplicate player entries per match
  FOREIGN KEY (match_id) REFERENCES matches(match_id) ON DELETE CASCADE,
  FOREIGN KEY (club_id) REFERENCES clubs(club_id) ON DELETE RESTRICT,
  FOREIGN KEY (player_id) REFERENCES players(player_id) ON DELETE RESTRICT
);

-- Create a trigger function to update updated_at
CREATE OR REPLACE FUNCTION update_match_info_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function on update
CREATE TRIGGER update_match_info_updated_at
BEFORE UPDATE ON match_info
FOR EACH ROW
EXECUTE FUNCTION update_match_info_updated_at();
```
