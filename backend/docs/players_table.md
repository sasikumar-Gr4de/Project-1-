```sql
-- Enable the uuid-ossp extension (run separately if permitted)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the players table
CREATE TABLE players (
  player_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- Auto-generated UUID
  full_name VARCHAR(100) NOT NULL, -- Increased length for full names
  date_of_birth DATE NOT NULL, -- Made NOT NULL for required data
  position VARCHAR(50) NOT NULL CHECK (position IN ('Goalkeeper', 'Defender', 'Midfielder', 'Forward', 'Central Midfielder')), -- Enforced valid positions
  height_cm DECIMAL(5,2) CHECK (height_cm > 0 AND height_cm <= 250), -- Positive height constraint
  weight_kg DECIMAL(5,2) CHECK (weight_kg > 0 AND weight_kg <= 200), -- Positive weight constraint
  current_club UUID, -- Nullable to allow free agents
  nationality VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('Active', 'Inactive', 'Injured', 'Retired')), -- Enforced valid statuses
  jersey_number INT CHECK (jersey_number BETWEEN 1 AND 99), -- Realistic jersey number range
  avatar_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (current_club) REFERENCES clubs(club_id) ON DELETE SET NULL -- Allows club deletion without losing player
);

-- Create trigger function to update updated_at
CREATE OR REPLACE FUNCTION update_players_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function on update
CREATE TRIGGER update_players_updated_at
BEFORE UPDATE ON players
FOR EACH ROW
EXECUTE FUNCTION update_players_updated_at();

-- Example Data
INSERT INTO players (player_id, full_name, date_of_birth, position, height_cm, weight_kg, current_club, nationality, status, jersey_number, avatar_url)
VALUES
  ('550e8401-e29b-41d4-a716-446655440001', 'Miguel Ángel Torres', '2008-04-01', 'Central Midfielder', 178.00, 71.00, '550e8403-e29b-41d4-a716-446655440004', 'Spanish', 'Active', 35, 'https://example.com/avatar.jpg');
```
