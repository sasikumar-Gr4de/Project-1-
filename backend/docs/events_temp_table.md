```sql
-- Enable the uuid-ossp extension (run separately if permitted)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the events table
CREATE TABLE events_temp (
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


```
