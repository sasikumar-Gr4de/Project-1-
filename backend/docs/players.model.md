-- Players table for storing player profiles and statistics
CREATE TABLE players (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
name VARCHAR(255) NOT NULL,
date_of_birth DATE NOT NULL,
nationality VARCHAR(100),
current_club VARCHAR(255),
primary_position VARCHAR(10) NOT NULL CHECK (primary_position IN ('GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST')),
height_cm INTEGER CHECK (height_cm BETWEEN 100 AND 250),
weight_kg DECIMAL(5,2) CHECK (weight_kg BETWEEN 30 AND 150),
preferred_foot VARCHAR(10) CHECK (preferred_foot IN ('Left', 'Right', 'Both')),
status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'injured', 'suspended', 'released')),
profile_picture TEXT,

    -- Performance metrics
    matches_played INTEGER DEFAULT 0 CHECK (matches_played >= 0),
    sense_score INTEGER CHECK (sense_score BETWEEN 0 AND 100),
    game_time INTEGER DEFAULT 0 CHECK (game_time >= 0), -- in minutes
    overall_ability INTEGER CHECK (overall_ability BETWEEN 0 AND 100),

    -- System fields
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);

-- Indexes for better performance
CREATE INDEX idx_players_name ON players(name);
CREATE INDEX idx_players_club ON players(current_club);
CREATE INDEX idx_players_position ON players(primary_position);
CREATE INDEX idx_players_status ON players(status);
CREATE INDEX idx_players_ability ON players(overall_ability DESC);
CREATE INDEX idx_players_created_at ON players(created_at DESC);

-- Row Level Security (RLS)
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Players are viewable by everyone" ON players
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert players" ON players
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update players they created" ON players
FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Admins can manage all players" ON players
FOR ALL USING (auth.uid() IN (
SELECT id FROM users WHERE role = 'admin'
));

-- Trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = NOW();
RETURN NEW;
END;

$$
language 'plpgsql';

CREATE TRIGGER update_players_updated_at
    BEFORE UPDATE ON players
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
$$
