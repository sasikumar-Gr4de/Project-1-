```sql
-- Enable the uuid-ossp extension (run separately if permitted)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- Auto-generated UUID
  match_id UUID NOT NULL,
  player_id UUID NOT NULL,
  event_number INT,
  action_name VARCHAR(255),
  sub_action VARCHAR(255),
  timestamp TIMESTAMP NOT NULL, -- Changed to TIMESTAMP for proper time handling
  seconds DECIMAL(10,2),
  minute INT,
  period VARCHAR(255) CHECK (period IN ('First Half', 'Second Half', 'Extra Time', 'Penalty Shootout')), -- Enforced valid periods
  position_x DECIMAL(8,2) CHECK (position_x BETWEEN 0 AND 100), -- Pitch x-coordinate (0-100)
  position_y DECIMAL(8,2) CHECK (position_y BETWEEN 0 AND 68), -- Pitch y-coordinate (0-68, assuming standard width)
  position_x_end DECIMAL(8,2) CHECK (position_x_end BETWEEN 0 AND 100),
  position_y_end DECIMAL(8,2) CHECK (position_y_end BETWEEN 0 AND 68),
  outcome VARCHAR(1) CHECK (outcome IN ('t', 'f')), -- Enforced 't' or 'f'
  pass_length DECIMAL(8,2) CHECK (pass_length >= 0),
  pass_direction VARCHAR(255),
  body_part VARCHAR(255),
  shot_type VARCHAR(255),
  is_cross VARCHAR(1) CHECK (is_cross IN ('t', 'f')),
  key_pass VARCHAR(1) CHECK (key_pass IN ('t', 'f')),
  assist VARCHAR(1) CHECK (assist IN ('t', 'f')),
  under_pressure VARCHAR(1) CHECK (under_pressure IN ('t', 'f')),
  description VARCHAR(255),
  special_action VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (match_id) REFERENCES matches(match_id), -- Corrected to matches table
  FOREIGN KEY (player_id) REFERENCES players(player_id)
);

-- Create a trigger function to update created_at (if needed, though default handles insert)
CREATE OR REPLACE FUNCTION update_events_created_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.created_at IS NULL THEN
    NEW.created_at = CURRENT_TIMESTAMP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function on insert (optional, as DEFAULT handles this)
CREATE TRIGGER set_events_created_at
BEFORE INSERT ON events
FOR EACH ROW
EXECUTE FUNCTION update_events_created_at();

-- Example Data (based on events_total_63.csv, corrected timestamp format)
INSERT INTO events (id, match_id, player_id, event_number, action_name, sub_action, timestamp, seconds, minute, period, position_x, position_y, position_x_end, position_y_end, outcome, pass_length, pass_direction, body_part, shot_type, is_cross, key_pass, assist, under_pressure, description, special_action, created_at)
VALUES
  ('550e8404-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', '550e8401-e29b-41d4-a716-446655440001', 1, 'Pass', 'Short Pass', '2025-10-09 00:00:53', 53.00, 0, 'First Half', 54.93, 42.71, 64.78, 57.29, 't', 17.60, 'Forward', 'Right Foot', NULL, 'f', 'f', 'f', 'f', 'Simple Short Pass', 'No Special Action', '2025-10-09 16:30:31.864663'),
  ('550e8404-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', '550e8401-e29b-41d4-a716-446655440001', 2, 'Pass Receive', 'Short Pass Recieve', '2025-10-09 00:00:53', 53.00, 0, 'First Half', 64.78, 57.29, 64.78, 57.29, 't', 0.00, 'Lateral', 'Other', NULL, 'f', 'f', 'f', 'f', 'Received Simple Short Pass', 'No Special Action', '2025-10-09 16:30:31.864864'),
  ('550e8404-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', '550e8401-e29b-41d4-a716-446655440001', 3, 'Special Action', 'Long Pass', '2025-10-09 00:00:56', 56.00, 0, 'First Half', 64.78, 57.29, 25.37, 28.46, 'f', 0.00, 'Backward', 'Right Foot', NULL, 'f', 'f', 'f', 'f', 'Unsuccessful Long Pass', 'No Special Action', '2025-10-09 16:30:31.864969');

```
