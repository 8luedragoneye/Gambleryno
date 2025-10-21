# 🎰 Gamblerino - Demonic Slot Machine Rogue-lite

A React-based web implementation of the Gamblerino game concept - a unique rogue-lite horror game that transforms slot machine gambling into strategic gameplay.

## 🎮 Game Concept

Gamblerino is a rogue-lite horror game where players are trapped in a demonic cell representing personal hell of addiction and debt. The core gameplay involves spinning a demonic slot machine to earn coins, which are used to pay off escalating debts at the end of each deadline. Unlike real gambling, success comes from exploiting and manipulating the slot machine through strategic charm builds and synergies.

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd gamblerino-game
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── SlotMachine/     # Core slot machine components
│   │   ├── SlotGrid.tsx
│   │   ├── SlotGrid.css
│   │   ├── SpinButton.tsx
│   │   └── SpinButton.css
│   ├── Shop/            # Shop system components
│   ├── UI/              # General UI components
│   │   ├── StatusBar.tsx
│   │   └── StatusBar.css
│   └── PhoneCalls/      # Phone call event components
├── hooks/               # Custom React hooks
│   ├── useSlotMachine.ts
│   ├── useGameState.ts
│   └── useCharms.ts
├── systems/             # Game logic systems
│   ├── symbols.js
│   ├── patterns.js
│   ├── charms.js
│   └── luck.js
├── data/                # Game data and configurations
│   ├── symbols.ts       # Symbol definitions and probabilities
│   ├── charms.ts        # Lucky charms data
│   └── patterns.ts      # Pattern recognition and payouts
├── utils/               # Utility functions
│   ├── random.ts        # Random number generation
│   └── calculations.ts  # Game calculations
└── App.tsx              # Main application component
```

## 🎯 Core Features Implemented

### ✅ Phase 1: Foundation (Completed)
- **Symbols & Probabilities**: 7 main symbols with weighted rarity
- **Slot Machine Grid**: 3x3 grid with spin mechanics
- **Pattern Recognition**: Row, column, and diagonal pattern detection
- **Basic Payout System**: Coin calculation with multipliers

### 🔄 Phase 2: Progression Systems (In Progress)
- **Debt & Deadlines**: Round management and debt tracking
- **Shop & Currency**: Ticket/coin management system

### 📋 Phase 3: Advanced Mechanics (Planned)
- **Lucky Charms System**: Item effects and equipment
- **Luck Mechanics**: Forced matches from charm-based luck
- **Phone Calls**: Random events and choices

### 🎨 Phase 4: Polish & Advanced Features (Planned)
- **Modifiers & Traits**: Charm enhancement system
- **Progression & Endless Mode**: Meta-progression and endless gameplay

## 🎲 Game Mechanics

### Symbols
- **Lemon & Cherry**: 1.3 weight (~19.4% each) - Most common
- **Clover & Bell**: 1.0 weight (~14.9% each) - Common
- **Diamond & Treasure**: 0.8 weight (~11.9% each) - Uncommon
- **Seven**: 0.5 weight (~7.5%) - Rare

### Patterns
- **Rows**: Top, middle, bottom
- **Columns**: Left, middle, right
- **Diagonals**: Main and anti-diagonal (1.5x multiplier)


## 🛠️ Development

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

### Adding New Features

The project is designed for incremental development. Each core feature is modular and can be implemented independently:

1. **Data Layer**: Add new data to `src/data/`
2. **Logic Layer**: Implement game logic in `src/systems/`
3. **Hooks Layer**: Create custom hooks in `src/hooks/`
4. **UI Layer**: Build components in `src/components/`

### Key Design Principles

- **Modular Architecture**: Each feature is self-contained
- **Type Safety**: Full TypeScript implementation
- **Responsive Design**: Mobile-friendly interface
- **Performance**: Optimized for smooth gameplay

## 🎨 Styling

The game uses a dark, horror-themed design with:
- Gradient backgrounds and borders
- Glowing effects for winning combinations
- Smooth animations and transitions
- Responsive design for all screen sizes

## 📝 TODO

- [ ] Implement Lucky Charms system
- [ ] Add Shop functionality
- [ ] Create Phone Call events
- [ ] Add Luck mechanics
- [ ] Implement Modifiers & Traits
- [ ] Add meta-progression
- [ ] Create endless mode
- [ ] Add sound effects
- [ ] Implement save/load system

## 🤝 Contributing

This is a learning project implementing the Gamblerino game concept. Feel free to fork and experiment with the code!

## 📄 License

This project is for educational purposes. The game concept is inspired by the original Gamblerino design documents.