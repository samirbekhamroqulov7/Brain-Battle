-- Brain Battle PvP Database Setup
-- This script initializes all tables needed for the PvP game system

-- Users table (already exists, just ensure it has the right structure)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  auth_id TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  avatar_frame TEXT DEFAULT 'none',
  nickname_style TEXT DEFAULT 'normal',
  language TEXT DEFAULT 'en',
  sound_enabled BOOLEAN DEFAULT true,
  music_enabled BOOLEAN DEFAULT true,
  isGuest BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Games table - stores all available games
CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name_key TEXT NOT NULL,
  description_key TEXT,
  icon TEXT,
  is_pvp_enabled BOOLEAN DEFAULT true,
  min_players INTEGER DEFAULT 2,
  max_players INTEGER DEFAULT 2,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert the 11 PvP games
INSERT INTO games (slug, name_key, is_pvp_enabled) VALUES
  ('tic-tac-toe', 'games.ticTacToe', true),
  ('chess', 'games.chess', true),
  ('checkers', 'games.checkers', true),
  ('sudoku', 'games.sudoku', true),
  ('dots', 'games.dots', true),
  ('crossword', 'games.crossword', true),
  ('anagrams', 'games.anagrams', true),
  ('math-duel', 'games.mathDuel', true),
  ('puzzle-15', 'games.puzzle15', true),
  ('flags-quiz', 'games.flagsQuiz', true),
  ('memory-match', 'games.memoryMatch', true)
ON CONFLICT (slug) DO NOTHING;

-- Matches table - stores PvP match history
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id TEXT NOT NULL REFERENCES games(slug),
  mode TEXT DEFAULT 'pvp',
  status TEXT DEFAULT 'waiting',
  winner_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  finished_at TIMESTAMP,
  game_state JSONB DEFAULT '{}',
  result TEXT
);

-- Match participants table
CREATE TABLE IF NOT EXISTS match_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  score INTEGER DEFAULT 0,
  is_ready BOOLEAN DEFAULT false,
  joined_at TIMESTAMP DEFAULT NOW()
);

-- User game stats table - tracks performance per game
CREATE TABLE IF NOT EXISTS user_game_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL REFERENCES games(slug),
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  rating INTEGER DEFAULT 1000,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, game_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_matches_created_at ON matches(created_at);
CREATE INDEX IF NOT EXISTS idx_matches_winner_id ON matches(winner_id);
CREATE INDEX IF NOT EXISTS idx_match_participants_user_id ON match_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_match_participants_match_id ON match_participants(match_id);
CREATE INDEX IF NOT EXISTS idx_user_game_stats_user_id ON user_game_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_user_game_stats_game_id ON user_game_stats(game_id);

-- Enable Row Level Security
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_game_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for matches
CREATE POLICY "Users can view matches they participate in"
  ON matches FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM match_participants 
      WHERE match_participants.match_id = matches.id 
      AND match_participants.user_id = auth.uid()
    )
  );

-- RLS Policies for match participants
CREATE POLICY "Users can view match participants"
  ON match_participants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM matches 
      WHERE matches.id = match_participants.match_id 
      AND (
        EXISTS (
          SELECT 1 FROM match_participants mp 
          WHERE mp.match_id = matches.id 
          AND mp.user_id = auth.uid()
        )
      )
    )
  );

-- RLS Policies for user game stats
CREATE POLICY "Users can view all game stats"
  ON user_game_stats FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own stats"
  ON user_game_stats FOR UPDATE
  USING (user_id = auth.uid());
