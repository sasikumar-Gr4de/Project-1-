```sql
CREATE TABLE players (
  player_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(50) NOT NULL,
  date_of_birth DATE,
  position VARCHAR(50),
  height_cm DECIMAL(5,2),
  weight_kg DECIMAL(5,2),
  current_club UUID,
  nationality VARCHAR(50),
  status VARCHAR(20),
  jersey_number INT,
  avatar_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (current_club) REFERENCES clubs(club_id)
);

-- Example Data
INSERT INTO players (player_id, first_name, last_name, date_of_birth, position, height_cm, weight_kg, current_club, nationality, status, jersey_number)
VALUES
  ('550e8401-e29b-41d4-a716-446655440001', 'Miguel', 'Ángel Torres', '2008-04-01', 'Central Midfielder', 178.00, 71.00, '550e8403-e29b-41d4-a716-446655440004', 'Spanish', 'Active', 35);
```
