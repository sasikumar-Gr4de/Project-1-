```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL,
  player_id UUID NOT NULL,
  event_number INT ,
  action_name VARCHAR(255),
  sub_action VARCHAR(255),
  timestamp VARCHAR(255),
  seconds DECIMAL(10,2),
  minute INT,
  period VARCHAR(255),
  position_x DECIMAL(8,2),
  position_y DECIMAL(8,2),
  position_x_end DECIMAL(8,2),
  position_y_end DECIMAL(8,2),
  outcome VARCHAR(1), -- 't' or 'f' for true/false
  pass_length DECIMAL(8,2),
  pass_direction VARCHAR(255),
  body_part VARCHAR(255),
  shot_type VARCHAR(255),
  is_cross VARCHAR(1),
  key_pass VARCHAR(1),
  assist VARCHAR(1),
  under_pressure VARCHAR(1),
  description VARCHAR(255),
  special_action VARCHAR(255),
  created_at TIMESTAMP,
  FOREIGN KEY (match_id) REFERENCES matches(match_id),
  FOREIGN KEY (player_id) REFERENCES players(player_id)
);

-- Example Data (based on events_total_63.csv)
INSERT INTO events (id, match_id, player_id, event_number, action_name, sub_action, timestamp, seconds, minute, period, position_x, position_y, position_x_end, position_y_end, outcome, pass_length, pass_direction, body_part, shot_type, is_cross, key_pass, assist, under_pressure, description, special_action, created_at)
VALUES
  (1, '550e8400-e29b-41d4-a716-446655440000', '550e8401-e29b-41d4-a716-446655440001', 1, 'Pass', 'Short Pass', '0:00:53', 53.00, 0, 'First Half', 54.93, 42.71, 64.78, 57.29, 't', 17.60, 'Forward', 'Right Foot', NULL, 'f', 'f', 'f', 'f', 'Simple Short Pass', 'No Special Action', '2025-10-09 16:30:31.864663'),
  (2, '550e8400-e29b-41d4-a716-446655440000', '550e8401-e29b-41d4-a716-446655440001', 2, 'Pass Receive', 'Short Pass Recieve', '0:00:53', 53.00, 0, 'First Half', 64.78, 57.29, 64.78, 57.29, 't', 0.00, 'Lateral', 'Other', NULL, 'f', 'f', 'f', 'f', 'Received Simple Short Pass', 'No Special Action', '2025-10-09 16:30:31.864864'),
  (3, '550e8400-e29b-41d4-a716-446655440000', '550e8401-e29b-41d4-a716-446655440001', 3, 'Special Action', 'Long Pass', '0:00:56', 56.00, 0, 'First Half', 64.78, 57.29, 25.37, 28.46, 'f', 0.00, 'Backward', 'Right Foot', NULL, 'f', 'f', 'f', 'f', 'Unsuccessful Long Pass', 'No Special Action', '2025-10-09 16:30:31.864969');

```
