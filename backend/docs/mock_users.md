```sql
-- Insert mock users for different roles
INSERT INTO users (email, full_name, client_type, role, phone_number, avatar_url, reference_id, last_login, email_verified, is_active) VALUES
-- Admin users (reference_id is NULL)
('admin1@sportsapp.com', 'John Smith', 'internal', 'admin', '+1-555-0101', 'https://example.com/avatars/admin1.jpg', NULL, '2024-01-15 10:30:00', TRUE, TRUE),
('admin2@sportsapp.com', 'Sarah Johnson', 'internal', 'admin', '+1-555-0102', 'https://example.com/avatars/admin2.jpg', NULL, '2024-01-14 14:20:00', TRUE, TRUE),

-- Data Reviewer users
('reviewer1@sportsapp.com', 'Mike Chen', 'internal', 'data-reviewer', '+1-555-0103', 'https://example.com/avatars/reviewer1.jpg', NULL, '2024-01-13 09:15:00', TRUE, TRUE),
('reviewer2@sportsapp.com', 'Emily Davis', 'internal', 'data-reviewer', '+1-555-0104', 'https://example.com/avatars/reviewer2.jpg', NULL, '2024-01-12 16:45:00', TRUE, TRUE),

-- Annotator users
('annotator1@sportsapp.com', 'David Wilson', 'internal', 'annotator', '+1-555-0105', 'https://example.com/avatars/annotator1.jpg', NULL, '2024-01-11 11:00:00', TRUE, TRUE),
('annotator2@sportsapp.com', 'Lisa Brown', 'internal', 'annotator', '+1-555-0106', 'https://example.com/avatars/annotator2.jpg', NULL, '2024-01-10 13:30:00', TRUE, TRUE),

-- Coach users (external with reference_id)
('coach.miller@team.com', 'Robert Miller', 'external', 'coach', '+1-555-0201', 'https://example.com/avatars/coach1.jpg', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-01-14 08:45:00', TRUE, TRUE),
('coach.garcia@team.com', 'Maria Garcia', 'external', 'coach', '+1-555-0202', 'https://example.com/avatars/coach2.jpg', 'b2c3d4e5-f6g7-8901-bcde-f23456789012', '2024-01-13 15:20:00', TRUE, TRUE),

-- Player users (external with reference_id)
('player.jones@team.com', 'James Jones', 'external', 'player', '+1-555-0301', 'https://example.com/avatars/player1.jpg', 'c3d4e5f6-g7h8-9012-cdef-345678901234', '2024-01-15 12:00:00', TRUE, TRUE),
('player.wang@team.com', 'Sophia Wang', 'external', 'player', '+1-555-0302', 'https://example.com/avatars/player2.jpg', 'd4e5f6g7-h8i9-0123-defg-456789012345', '2024-01-14 19:30:00', TRUE, TRUE),
('player.singh@team.com', 'Arjun Singh', 'external', 'player', '+1-555-0303', 'https://example.com/avatars/player3.jpg', 'e5f6g7h8-i9j0-1234-efgh-567890123456', '2024-01-13 17:15:00', FALSE, TRUE),

-- Parent users (external with reference_id)
('parent.wilson@family.com', 'Jennifer Wilson', 'external', 'parent', '+1-555-0401', 'https://example.com/avatars/parent1.jpg', 'f6g7h8i9-j0k1-2345-fghi-678901234567', '2024-01-12 10:00:00', TRUE, TRUE),
('parent.martinez@family.com', 'Carlos Martinez', 'external', 'parent', '+1-555-0402', 'https://example.com/avatars/parent2.jpg', 'g7h8i9j0-k1l2-3456-ghij-789012345678', '2024-01-11 14:45:00', TRUE, TRUE),

-- Inactive user example
('inactive.user@example.com', 'Thomas Reed', 'external', 'player', '+1-555-9999', 'https://example.com/avatars/inactive.jpg', 'h8i9j0k1-l2m3-4567-hijk-890123456789', '2023-12-01 09:00:00', TRUE, FALSE),

-- User with no phone number
('coach.lee@team.com', 'Andrew Lee', 'external', 'coach', NULL, 'https://example.com/avatars/coach3.jpg', 'i9j0k1l2-m3n4-5678-ijkl-901234567890', '2024-01-10 16:00:00', FALSE, TRUE);
```
