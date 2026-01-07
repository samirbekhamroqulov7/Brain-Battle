# Brain Battle - PvP Multiplayer Game Platform

Brain Battle is a high-performance, cross-platform multiplayer gaming platform featuring 11 unique PvP games optimized for web, mobile (iOS/Android), and desktop devices.

## Features

### 11 Complete PvP Games
1. **Tic-Tac-Toe** - Classic strategy game with symbol selection
2. **Chess** - Ultimate strategy game with full board gameplay
3. **Checkers** - Piece-based strategy game
4. **Sudoku** - Number placement puzzle with difficulty levels
5. **Dots** - Point-accumulating tactical game
6. **Crossword** - Collaborative word puzzle solving
7. **Anagrams** - Word unscrambling challenges
8. **Math Duel** - Quick arithmetic problem solving
9. **15 Puzzle** - Tile arrangement puzzle
10. **Flags Quiz** - Country identification game
11. **Memory Match** - Card matching game

### Architecture Highlights

#### Game Flow for Each Game
- **Selection Screen**: Players choose preferences (colors, symbols, difficulty)
- **Game Screen**: Real-time gameplay with live score tracking
- **Result Screen**: Win/loss/draw outcomes with statistics

#### Technology Stack
- **Frontend**: Next.js 16, React 19.2, TypeScript, Tailwind CSS v4
- **Backend**: Supabase PostgreSQL, Real-time APIs
- **Authentication**: Guest mode + Supabase Auth
- **Deployment**: Vercel (Web), EAS Build (Mobile), Electron (Desktop)

#### Responsive Design
- Mobile-first approach
- Touch-optimized controls
- Safe area padding for notched devices
- Works on phones, tablets, and desktop
- Ready for APK/AAB distribution

### Cross-Platform Support

#### Web
- Run in any modern browser
- No installation required
- Progressive Web App (PWA) enabled

#### Mobile (iOS/Android)
- Build with EAS: `eas build --platform ios` / `eas build --platform android`
- Install as native app via App Store/Play Store
- Full offline support with localStorage

#### Desktop (Windows/Mac/Linux)
- Package with Electron
- Native application experience
- Desktop-specific features

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Vercel account (for deployment)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd brain-battle

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional: For production auth
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Database Setup

1. Go to Supabase dashboard
2. Create a new project
3. Run the SQL setup script from `scripts/setup-pvp-database.sql`
4. Enable Row Level Security (RLS) on all game tables
5. Update `.env.local` with your Supabase credentials

### Local Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

## Game Development Guide

### Adding a New PvP Game

1. **Create Game Component**
```tsx
// components/games/pvp/my-game/game.tsx
export function MyGamePvP() {
  const [gamePhase, setGamePhase] = useState<"selection" | "playing" | "result">("selection")
  
  // Implement game logic
  
  return (
    // Game UI
  )
}
```

2. **Create Page Route**
```tsx
// app/pvp/my-game/page.tsx
export default function MyGamePage() {
  return (
    <PvPGameWrapper gameTitle="My Game" gameType="my-game">
      <MyGamePvP />
    </PvPGameWrapper>
  )
}
```

3. **Register in Game Loader**
Update `lib/pvp/game-loader.ts`:
```typescript
export const AVAILABLE_PVP_GAMES = {
  // ...existing games...
  "my-game": { name: "My Game", description: "...", icon: "IconName" },
}
```

4. **Add Database Entry**
```sql
INSERT INTO games (slug, name_key, is_pvp_enabled)
VALUES ('my-game', 'games.myGame', true);
```

## Game Design Requirements

Each PvP game must follow this structure:

### Screens Required
- **Selection Screen**: Let players customize (choose symbols, colors, difficulty)
- **Game Screen**: Display game board/interface with real-time scores
- **Result Screen**: Show win/loss/draw with match statistics

### State Management
```typescript
type GamePhase = "selection" | "playing" | "result"
type GameResult = "win" | "loss" | "draw"
```

### Performance Guidelines
- Games must load in <2 seconds
- Touch response time <100ms
- Support 2 simultaneous players
- Persist game state to localStorage for offline play

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Build for Mobile

```bash
# Prerequisites: EAS CLI
npm install -g eas-cli

# Build iOS
eas build --platform ios

# Build Android
eas build --platform android

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

### Build for Desktop

```bash
# Install Electron
npm install --save-dev electron electron-builder

# Build desktop app
npm run build:electron
```

## Testing

### Test Game Flows
1. Navigate to `/pvp`
2. Select any game
3. Verify all screens display correctly:
   - Selection screen loads
   - Game mechanics work (can make moves)
   - Results display properly

### Cross-Device Testing
- Test on iPhone, Android, Windows, macOS
- Verify touch controls work
- Check safe area padding on notched devices
- Test offline functionality

### Performance Testing
- Use Chrome DevTools Lighthouse
- Target: >90 score for Performance & Accessibility
- Monitor memory usage during long gameplay

## Statistics System

### Tracked Metrics
- **Wins/Losses/Draws**: Per game and overall
- **Rating**: Elo-style rating system (1000 base)
- **Match History**: Stored in Supabase
- **Streak Tracking**: Consecutive wins

### API Endpoints

```
POST /api/pvp/create-match       # Create new match
POST /api/pvp/finish-match       # Complete match
POST /api/pvp/update-stats       # Update player stats
```

## Architecture Overview

```
brain-battle/
├── app/
│   ├── page.tsx                 # Home page
│   ├── pvp/                     # PvP games
│   │   ├── page.tsx            # Game selector
│   │   ├── tic-tac-toe/
│   │   ├── chess/
│   │   └── ...11 games total
│   ├── profile/                 # Player profile
│   ├── settings/                # App settings
│   └── api/                     # Backend routes
├── components/
│   ├── games/
│   │   ├── pvp/                # PvP game implementations
│   │   └── pvp-game-wrapper.tsx
│   └── ui/                      # Reusable UI components
├── lib/
│   ├── pvp/                    # Game utilities
│   ├── supabase/              # Database client
│   └── types/                  # TypeScript types
└── public/                      # Assets & icons
```

## Mobile Considerations

### Safe Area Padding
```tsx
<div className="safe-area-top safe-area-bottom">
  {/* Content respects notches and system UI */}
</div>
```

### Touch Optimization
- Minimum 44x44px touch targets
- No hover states for touch devices
- Instant visual feedback

### Performance
- Code-split by game
- Lazy load images
- Use service workers for caching

## Stability & Bug Prevention

### Game State Management
- Use state machines for game phases
- Immutable state updates
- Prevent invalid move transitions

### Error Handling
- Try-catch blocks in async operations
- Graceful fallbacks for Supabase errors
- Offline-first architecture with localStorage

### Testing Checklist
- [x] All 11 games playable
- [x] Profile page loads correctly
- [x] Statistics persist to localStorage
- [x] Settings page functional
- [x] Responsive on all screen sizes
- [x] Touch controls work
- [x] No console errors
- [x] Fast load times (<2s)

## Contributing

1. Create a new branch: `git checkout -b feature/my-game`
2. Follow the Game Development Guide above
3. Test on mobile and desktop
4. Submit pull request with game showcase

## License

Brain Battle © 2025. All rights reserved.

## Support

For issues, feature requests, or questions, please open an issue on GitHub or contact the development team.
```

```tsx file="" isHidden
