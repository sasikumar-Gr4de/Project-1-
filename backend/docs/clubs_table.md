```sql
CREATE TABLE clubs (
  club_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_name VARCHAR(100) NOT NULL,
  location VARCHAR(100),
  founded_year INT,
  mark_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Example Data
INSERT INTO clubs (club_id, club_name, location, founded_year)
VALUES
  ('550e8403-e29b-41d4-a716-446655440004', 'Real Madrid Juvenil A', 'Madrid, Spain', 1902);
```
