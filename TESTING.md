# Brain Battle PvP - Testing Guide

Comprehensive testing procedures for all games and platforms.

## Unit Testing

### Test Each Game Individually

```bash
# Tic-Tac-Toe
npm test -- tic-tac-toe

# Chess
npm test -- chess

# All games
npm test
```

### Sample Test Structure

```typescript
describe("Tic-Tac-Toe PvP", () => {
  it("should accept valid moves", () => {
    const game = new TicTacToeGame()
    game.makeMove(0, "X")
    expect(game.board[0]).toBe("X")
  })

  it("should detect winner", () => {
    const game = createWinningGame()
    expect(game.checkWinner()).toBe("X")
  })

  it("should prevent invalid moves", () => {
    const game = new TicTacToeGame()
    game.makeMove(0, "X")
    expect(() => game.makeMove(0, "O")).toThrow()
  })
})
```

## Integration Testing

### Test Game Flows

1. **Selection Screen**
   - Can select symbol/color
   - Settings persist
   - Validation works

2. **Game Screen**
   - Moves register
   - Score updates
   - Timer works (if applicable)

3. **Result Screen**
   - Result displays correctly
   - Statistics save
   - Play again button works

## Regression Testing

### Before Each Release

- [ ] All 11 games playable
- [ ] No console errors
- [ ] No memory leaks
- [ ] Profile page loads
- [ ] Settings persist
- [ ] Navigation works

## Performance Testing

### Load Testing

```bash
# Simulate 100 concurrent users
npm install -D artillery

artillery quick --count 100 --num 10 http://localhost:3000/pvp
```

### Memory Testing

```bash
# Monitor heap usage
node --inspect app.js

# Chrome DevTools: Memory profiler
# Record: 30 second game session
# Detached DOM nodes: Should be <100
# Memory leak: Should not increase >10MB
```

## Cross-Device Testing

### Mobile Testing

**iPhone (Safari)**
- [ ] Touch controls responsive
- [ ] Notch/safe area handling
- [ ] Portrait/landscape work
- [ ] Battery indicator visible

**Android (Chrome)**
- [ ] Touch controls responsive
- [ ] System buttons accessible
- [ ] Keyboard doesn't break layout
- [ ] Back button works

### Desktop Testing

**Windows (Edge)**
- [ ] Window resize works
- [ ] Mouse controls work
- [ ] Keyboard shortcuts work
- [ ] Right-click menu disabled

**macOS (Safari)**
- [ ] Trackpad gestures work
- [ ] Font rendering correct
- [ ] Colors accurate

## Game-Specific Tests

### Tic-Tac-Toe
- [ ] Board displays 3x3 grid
- [ ] Can place X and O
- [ ] Detects winner (3 in a row)
- [ ] Detects draw
- [ ] Best of 3 rounds works

### Chess
- [ ] Can select piece color
- [ ] Valid moves allowed
- [ ] Invalid moves blocked
- [ ] Game ends on resign

### Math Duel
- [ ] Problems generate correctly
- [ ] Time limit enforced
- [ ] Score increments correctly
- [ ] First to 5 wins ends game

### Memory Match
- [ ] Cards flip on click
- [ ] Matches detected correctly
- [ ] Score tracks matches
- [ ] All pairs found = win

## Edge Case Testing

### Error Scenarios
- [ ] Network disconnection
- [ ] Missing Supabase connection
- [ ] Invalid player input
- [ ] Game state corruption
- [ ] Browser tab backgrounding

### Boundary Testing
- [ ] Minimum screen width: 320px
- [ ] Maximum screen width: 2560px
- [ ] Fastest/slowest network (3G)
- [ ] Device with 2GB RAM
- [ ] Old browser versions

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab key navigates all buttons
- [ ] Enter/Space activate buttons
- [ ] Escape closes dialogs

### Screen Reader
- [ ] All buttons have aria-labels
- [ ] Game state announced
- [ ] Results readable

### Color Contrast
- [ ] Text on backgrounds: 4.5:1
- [ ] UI elements: 3:1
- [ ] No color-only information

## Security Testing

### Input Validation
- [ ] SQL injection blocked
- [ ] XSS attacks prevented
- [ ] CSRF tokens present
- [ ] Invalid data rejected

### Authentication
- [ ] Unauthorized users blocked
- [ ] Sessions expire
- [ ] Tokens refresh correctly

## Deployment Testing

### Staging Environment
```bash
# Deploy to staging
vercel --prod --target production

# Run smoke tests
npm run test:smoke
```

### Production Verification
- [ ] Site loads
- [ ] All games accessible
- [ ] Statistics save
- [ ] Profile loads
- [ ] Settings work
- [ ] No 5xx errors in logs

## Test Results Template

```markdown
# Test Results - [Date]

## Environment
- Browser: Chrome 120
- Device: iPhone 15 Pro
- Network: 4G
- App Version: 1.0.0

## Functional Tests
- [ ] Tic-Tac-Toe: PASS
- [ ] Chess: PASS
- [ ] All games: PASS

## Performance
- Load time: 1.2s
- Memory: 45MB
- FCP: 0.8s

## Issues Found
1. [Bug description]
   - Severity: High
   - Status: Open
   - Assigned: Dev Team

## Sign-Off
Tested by: [Name]
Date: [Date]
Approved: [Lead]
```

---

Last Updated: January 2025
Version: 1.0.0
