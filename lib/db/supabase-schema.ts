// SQL schema for Supabase PostgreSQL database
// This file contains all the CREATE TABLE statements

export const SUPABASE_SCHEMA = `
  -- Users table
  CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL UNIQUE,
    avatar_url TEXT,
    level INTEGER DEFAULT 1,
    coins INTEGER DEFAULT 0,
    is_guest BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
  );

  -- User settings table
  CREATE TABLE IF NOT EXISTS user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    sound_enabled BOOLEAN DEFAULT true,
    music_enabled BOOLEAN DEFAULT true,
    theme TEXT DEFAULT 'cyberpunk',
    language TEXT DEFAULT 'en',
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
  );

  -- Game ratings table (ELO system)
  CREATE TABLE IF NOT EXISTS game_ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    game_type TEXT NOT NULL,
    rating INTEGER DEFAULT 1200,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    draws INTEGER DEFAULT 0,
    last_updated TIMESTAMP DEFAULT now(),
    UNIQUE(user_id, game_type)
  );

  -- Rooms table (PvP match rooms)
  CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_type TEXT NOT NULL,
    status TEXT DEFAULT 'waiting',
    max_players INTEGER DEFAULT 2,
    created_at TIMESTAMP DEFAULT now(),
    started_at TIMESTAMP,
    finished_at TIMESTAMP
  );

  -- Room players junction table
  CREATE TABLE IF NOT EXISTS room_players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
    player_id UUID REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT now(),
    UNIQUE(room_id, player_id)
  );

  -- Game moves table
  CREATE TABLE IF NOT EXISTS game_moves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
    player_id UUID REFERENCES users(id) ON DELETE CASCADE,
    move_data JSONB,
    validation_status TEXT DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT now()
  );

  -- Game sessions table
  CREATE TABLE IF NOT EXISTS game_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
    game_type TEXT NOT NULL,
    winner_id UUID REFERENCES users(id),
    result TEXT NOT NULL,
    duration INTEGER,
    replay_available BOOLEAN DEFAULT false,
    session_data JSONB,
    created_at TIMESTAMP DEFAULT now()
  );

  -- Session results for each player
  CREATE TABLE IF NOT EXISTS session_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
    player_id UUID REFERENCES users(id) ON DELETE CASCADE,
    score INTEGER DEFAULT 0,
    rank INTEGER,
    created_at TIMESTAMP DEFAULT now()
  );

  -- Achievements table
  CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    achievement_type TEXT NOT NULL,
    reward_coins INTEGER DEFAULT 0,
    reward_xp INTEGER DEFAULT 0,
    unlocked_at TIMESTAMP DEFAULT now(),
    UNIQUE(user_id, achievement_type)
  );

  -- Clans table
  CREATE TABLE IF NOT EXISTS clans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    leader_id UUID REFERENCES users(id) ON DELETE SET NULL,
    level INTEGER DEFAULT 1,
    treasury INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT now()
  );

  -- Clan members junction table
  CREATE TABLE IF NOT EXISTS clan_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clan_id UUID REFERENCES clans(id) ON DELETE CASCADE,
    player_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT now(),
    UNIQUE(clan_id, player_id)
  );

  -- Tournaments table
  CREATE TABLE IF NOT EXISTS tournaments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_type TEXT NOT NULL,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'upcoming',
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    prize_pool INTEGER DEFAULT 0,
    max_participants INTEGER DEFAULT 64,
    created_at TIMESTAMP DEFAULT now()
  );

  -- Tournament participants
  CREATE TABLE IF NOT EXISTS tournament_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
    player_id UUID REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT now(),
    UNIQUE(tournament_id, player_id)
  );

  -- Tournament bracket matches
  CREATE TABLE IF NOT EXISTS tournament_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
    round INTEGER,
    player1_id UUID REFERENCES users(id),
    player2_id UUID REFERENCES users(id),
    winner_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT now()
  );

  -- Realtime messages/chat
  CREATE TABLE IF NOT EXISTS room_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message_type TEXT DEFAULT 'chat',
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now()
  );

  -- Create indexes for performance
  CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
  CREATE INDEX IF NOT EXISTS idx_game_ratings_user ON game_ratings(user_id);
  CREATE INDEX IF NOT EXISTS idx_rooms_status ON rooms(status);
  CREATE INDEX IF NOT EXISTS idx_game_moves_room ON game_moves(room_id);
  CREATE INDEX IF NOT EXISTS idx_sessions_created ON game_sessions(created_at);
  CREATE INDEX IF NOT EXISTS idx_achievements_user ON achievements(user_id);
  CREATE INDEX IF NOT EXISTS idx_clan_members_clan ON clan_members(clan_id);
  CREATE INDEX IF NOT EXISTS idx_tournament_participants_tournament ON tournament_participants(tournament_id);

  -- Enable RLS (Row Level Security) policies
  ALTER TABLE users ENABLE ROW LEVEL SECURITY;
  ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
  ALTER TABLE game_ratings ENABLE ROW LEVEL SECURITY;
  ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
  ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
  ALTER TABLE game_moves ENABLE ROW LEVEL SECURITY;
  ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
  ALTER TABLE room_messages ENABLE ROW LEVEL SECURITY;

  -- RLS Policies (allow public read, authenticated write)
  CREATE POLICY "Public can read users" ON users FOR SELECT USING (true);
  CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);
  CREATE POLICY "Users can read their settings" ON user_settings FOR SELECT USING (auth.uid() = user_id);
  CREATE POLICY "Users can update their settings" ON user_settings FOR UPDATE USING (auth.uid() = user_id);
  CREATE POLICY "Public can read ratings" ON game_ratings FOR SELECT USING (true);
  CREATE POLICY "Users can read their achievements" ON achievements FOR SELECT USING (auth.uid() = user_id);
  CREATE POLICY "Public can read rooms" ON rooms FOR SELECT USING (true);
  CREATE POLICY "Public can read moves" ON game_moves FOR SELECT USING (true);
  CREATE POLICY "Players can insert moves" ON game_moves FOR INSERT WITH CHECK (auth.uid() = player_id);
`
