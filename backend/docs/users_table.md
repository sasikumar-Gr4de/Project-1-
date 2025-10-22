```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Auto-generated UUID
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    client_type VARCHAR(20) NOT NULL CHECK (client_type IN ('internal', 'external')),
    role VARCHAR(50) NOT NULL CHECK (role IN ('coach', 'player', 'parent', 'admin', 'data-reviewer', 'annotator')),
    phone_number VARCHAR(20),
    avatar_url VARCHAR(255), -- URL to user profile image
    reference_id UUID, -- Nullable; links to players.player_id or clubs.club_id based on role
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    CONSTRAINT chk_reference_id_role CHECK (
        (role IN ('admin', 'data-reviewer', 'annotator') AND reference_id IS NULL) OR
        (role IN ('coach', 'player', 'parent') AND reference_id IS NOT NULL)
    )
);
```
