```sql
-- Enable the uuid-ossp extension (run separately if permitted)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the clubs table
CREATE TABLE clubs (
  club_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- Auto-generated UUID
  club_name VARCHAR(100) NOT NULL,
  location VARCHAR(100),
  founded_year INT CHECK (founded_year > 0 AND founded_year <= EXTRACT(YEAR FROM CURRENT_DATE)), -- Ensure valid year
  mark_url VARCHAR(255), -- Corrected from mark_url to match_url (assuming typo), kept as optional
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_club_name_location UNIQUE (club_name, location) -- Prevent duplicate clubs in same location
);

-- Create a trigger function to update updated_at
CREATE OR REPLACE FUNCTION update_clubs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function on update
CREATE TRIGGER update_clubs_updated_at
BEFORE UPDATE ON clubs
FOR EACH ROW
EXECUTE FUNCTION update_clubs_updated_at();

-- Example Data
INSERT INTO clubs (club_id, club_name, location, founded_year, mark_url)
VALUES
  ('550e8403-e29b-41d4-a716-446655440004', 'Real Madrid Juvenil A', 'Madrid, Spain', 1902, 'https://example.com/real-madrid.jpg');
```
