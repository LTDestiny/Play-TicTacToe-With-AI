# TicTacToe AI Game

An interactive TicTacToe game built with Next.js and TypeScript, featuring an intelligent AI opponent with multiple difficulty levels using the minimax algorithm.

![TicTacToe AI](https://img.shields.io/badge/Game-TicTacToe%20AI-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0-38B2AC)

## 🚀 Features

### ✅ Core Game Requirements

- **Complete TicTacToe Game**: Fully functional 3x3 grid with proper win/draw detection
- **Responsive UI**: Clean, modern interface that works perfectly on desktop and mobile
- **New Game Button**: Quick reset functionality to start fresh games
- **Turn Indicators**: Clear visual indication of whose turn it is (Player vs AI)
- **Winning Highlights**: Visual highlighting of winning combinations with animations

### 🤖 AI Implementation

#### **Easy Mode**

- Random valid move selection
- Easily beatable for beginners
- Occasionally misses obvious blocking moves
- Perfect for learning the game

#### **Hard Mode**

- Full minimax algorithm implementation with alpha-beta pruning
- **Unbeatable AI** - best case scenario is a draw
- Console logging of score evaluation for each move
- Performance metrics display:
  - Number of positions evaluated
  - AI thinking time in milliseconds
  - Move evaluation scores

### 📊 Game Features

#### **Score Tracking**

- Track wins, losses, and draws across multiple games
- Display current winning/losing streaks
- Persistent score storage in browser localStorage
- Win rate percentage calculation
- Average game duration tracking

#### **Performance Metrics** (Hard Mode)

- Real-time display of positions evaluated by AI
- AI thinking time measurement
- Move score interpretation (winning/defending/equal)
- Algorithm performance indicators

#### **Game Controls**

- Difficulty level switching (Easy/Hard)
- Player symbol selection (X or O)
- Statistics reset functionality
- Game state persistence

### 🎮 User Experience

- **Smooth Animations**: Framer Motion powered interactions
- **Loading States**: AI thinking indicators with animations
- **Game Over Dialog**: Celebration modal with statistics
- **Accessibility**: ARIA labels and keyboard navigation support
- **Dark Mode Support**: Automatic theme detection and switching

## 🏗️ Technical Architecture

### **Frontend Stack**

- **Next.js 15.5.4**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Modern component library
- **Framer Motion**: Smooth animations
- **Lucide React**: Beautiful icons

### **Code Quality**

- **Clean Architecture**: Separation of concerns between UI and game logic
- **Custom Hooks**: Reusable game state management
- **AI Module**: Dedicated minimax algorithm implementation
- **Type Safety**: Comprehensive TypeScript interfaces
- **Error Boundaries**: Graceful error handling

### **File Structure**

```
src/
├── components/          # UI Components
│   ├── GameBoard.tsx           # 3x3 game grid
│   ├── GameControls.tsx        # Settings and score
│   ├── AIMetricsDisplay.tsx    # AI performance metrics
│   ├── TicTacToeGame.tsx       # Main game container
│   └── ui/                     # shadcn/ui components
├── hooks/
│   └── useGameState.ts         # Game state management
├── types/
│   └── game.ts                 # TypeScript definitions
├── utils/
│   ├── gameLogic.ts            # Core game mechanics
│   └── aiEngine.ts             # Minimax AI implementation
└── app/
    └── page.tsx                # Main page
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd tictactoe-ai
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 🎯 How to Play

### Game Basics

1. **Choose your difficulty**: Easy (random AI) or Hard (minimax AI)
2. **Select your symbol**: Play as X (goes first) or O (goes second)
3. **Make your move**: Click on any empty cell to place your symbol
4. **Win conditions**: Get three of your symbols in a row (horizontal, vertical, or diagonal)

### AI Difficulty Levels

#### **Easy Mode** 🟢

- AI makes random moves
- Great for beginners and casual play
- Provides a learning environment
- You should win most games

#### **Hard Mode** 🔴

- AI uses the minimax algorithm
- **Mathematically unbeatable**
- Best possible outcome is a draw
- Perfect for challenging gameplay
- Watch the AI metrics to understand its thinking process

### Strategy Tips

- **Opening**: Take the center if you go first
- **Defense**: Always block opponent's winning moves
- **Offense**: Create multiple winning threats
- **Corners**: Corner positions are strategically important

## 🔧 AI Algorithm Details

### Minimax with Alpha-Beta Pruning

The Hard mode AI implements a complete minimax algorithm with the following features:

#### **Algorithm Overview**

```typescript
function minimax(board, depth, isMaximizing, alpha, beta) {
  // Base case: game over
  if (gameOver) return evaluate(board);

  // Recursive case: try all possible moves
  for (each possible move) {
    // Make move and recurse
    score = minimax(newBoard, depth+1, !isMaximizing, alpha, beta);

    // Alpha-beta pruning for optimization
    if (beta <= alpha) break;
  }

  return bestScore;
}
```

#### **Performance Optimizations**

- **Alpha-Beta Pruning**: Reduces search space by ~50%
- **Depth Preference**: Prefers winning quickly and losing slowly
- **Position Evaluation**: Scores positions from AI's perspective

#### **Scoring System**

- `+10`: AI can win
- `0`: Draw or neutral position
- `-10`: Player can win

#### **Metrics Tracking**

- Positions evaluated per move
- Thinking time measurement
- Score interpretation display

## 🧪 Testing

The game includes comprehensive testing for:

### Manual Testing Checklist

- [ ] Game board renders correctly
- [ ] Player moves register properly
- [ ] AI responds in both difficulty modes
- [ ] Win detection works for all combinations
- [ ] Draw detection works when board is full
- [ ] Score tracking persists across games
- [ ] Responsive design works on mobile
- [ ] Animations play smoothly
- [ ] Settings persist in localStorage

### Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📱 Mobile Support

The game is fully responsive and optimized for mobile devices:

- **Touch-friendly**: Large tap targets for easy interaction
- **Responsive Grid**: Adapts to different screen sizes
- **Swipe Gestures**: Natural mobile interactions
- **Performance**: Optimized for mobile browsers

## 🎨 Design Features

### Visual Enhancements

- **Smooth Animations**: Cell selection and winning highlights
- **Color Coding**: Different colors for X and O players
- **Winning Animation**: Pulsing highlight for winning combinations
- **Loading States**: Spinner animation during AI thinking
- **Modern UI**: Clean, accessible design with shadcn/ui

### Accessibility

- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG compliant color schemes
- **Focus Management**: Clear focus indicators

## 🔧 Development

### Architecture Decisions

#### **State Management**

- Custom React hooks for game state
- localStorage for persistence
- Immutable state updates

#### **AI Implementation**

- Separate AI engine module
- Performance metrics tracking
- Console logging for debugging

#### **Component Design**

- Atomic design principles
- Reusable UI components
- Props-based configuration

### Performance Considerations

- **Minimax Optimization**: Alpha-beta pruning reduces complexity
- **React Optimization**: useCallback and useMemo for expensive operations
- **Bundle Size**: Tree-shaking and code splitting
- **Rendering**: Efficient re-render patterns

## 📈 Future Enhancements

### Potential Features

- **Online Multiplayer**: Real-time games with other players
- **Tournament Mode**: Best-of-X game series
- **AI Personalities**: Different AI playing styles
- **Game Analysis**: Move history and analysis
- **Difficulty Progression**: Adaptive AI difficulty
- **Sound Effects**: Audio feedback for moves and wins
- **Themes**: Multiple visual themes
- **Statistics Dashboard**: Detailed analytics

### Technical Improvements

- **Unit Tests**: Comprehensive test coverage
- **E2E Tests**: Automated browser testing
- **PWA**: Progressive Web App features
- **Offline Mode**: Full offline functionality
- **Performance Monitoring**: Real-time metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team**: For the amazing React framework
- **shadcn**: For the beautiful UI components
- **Tailwind CSS**: For the utility-first CSS framework
- **Lucide**: For the beautiful icons
- **Framer Motion**: For smooth animations

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed description
3. Include browser and device information

---

**Built with ❤️ using React, TypeScript, and the Minimax Algorithm**
