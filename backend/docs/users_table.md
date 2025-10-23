```sql
-- Enable the uuid-ossp extension (run this separately if you have admin privileges)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- Use uuid_generate_v4()
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    client_type VARCHAR(20) NOT NULL CHECK (client_type IN ('internal', 'external')),
    role VARCHAR(50) NOT NULL CHECK (role IN ('coach', 'player', 'parent', 'admin', 'data-reviewer', 'annotator')),
    phone_number VARCHAR(20),
    avatar_url VARCHAR(255), -- URL to user profile image
    reference_id UUID, -- Nullable; links to players.player_id or clubs.club_id based on role
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    CONSTRAINT chk_reference_id_role CHECK (
        (role IN ('admin', 'data-reviewer', 'annotator') AND reference_id IS NULL) OR
        (role IN ('coach', 'player', 'parent') AND reference_id IS NOT NULL)
    )
);

-- Create a trigger function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function on update
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```
