# Dynamic Pattern System Design

## Overview
A completely flexible pattern generation system that automatically discovers and values patterns based on any grid size, controlled by charms and phone calls.

## Core Concepts

### 1. Flexible Grid Sizing
- **Any dimensions**: 3x3, 4x4, 3x9, 7x2, 1x10, 6x6, etc.
- **Individual control**: Add rows and columns separately
- **Charm/Phone Call driven**: Grid size changes through game mechanics, not levels

### 2. Dynamic Pattern Discovery
- **No hardcoded patterns**: System generates patterns algorithmically
- **Size-adaptive**: Patterns automatically adjust to grid dimensions
- **Comprehensive scanning**: Finds ALL possible patterns for any grid size

### 3. Automatic Pattern Valuation
- **Length-based**: Longer patterns = more valuable
- **Rarity-based**: Harder to achieve = more valuable
- **Complexity-based**: Complex shapes = more valuable
- **Grid-adaptive**: Values adjust based on grid size and difficulty

## System Architecture

### Grid Size Control

#### Charm Effects
```typescript
interface GridSizeModifier {
  type: 'charm' | 'phone_call' | 'temporary';
  source: string;
  rows: number;
  cols: number;
  duration?: number; // for temporary effects
}

// Example charm effects
const gridSizeCharms = {
  'expansive-vision': { rows: +1, cols: +1, permanent: true },
  'temporary-expansion': { rows: +2, cols: +2, duration: 3 }, // 3 spins
  'mini-grid': { rows: -1, cols: -1, permanent: true }, // risk/reward
  'wide-screen': { rows: 0, cols: +3, permanent: true },
  'tall-tower': { rows: +3, cols: 0, permanent: true }
};
```

#### Phone Call Effects
```typescript
const patternPhoneCallEffects = {
  'grid-expansion': {
    description: "The caller offers to expand your grid temporarily",
    effect: { gridSize: { rows: +2, cols: +2 }, duration: 5 }
  },
  'wide-gambit': {
    description: "Make your grid extremely wide",
    effect: { gridSize: { rows: 0, cols: +5 }, duration: 3 }
  },
  'tall-challenge': {
    description: "Make your grid extremely tall",
    effect: { gridSize: { rows: +5, cols: 0 }, duration: 3 }
  }
};
```

### Pattern Discovery Algorithm

#### Core Pattern Generator
```typescript
interface PatternGenerator {
  generatePatterns(gridSize: {rows: number, cols: number}): Pattern[];
  generateLinePatterns(rows: number, cols: number): Pattern[];
  generateDiagonalPatterns(rows: number, cols: number): Pattern[];
  generateGeometricPatterns(rows: number, cols: number): Pattern[];
  generateCustomPatterns(rows: number, cols: number): Pattern[];
}

interface Pattern {
  name: string;
  positions: number[][];
  baseMultiplier: number;
  difficulty: number;
  type: 'line' | 'diagonal' | 'geometric' | 'custom';
  rarity: number;
}
```

#### Line Pattern Generation
```typescript
const generateLinePatterns = (rows: number, cols: number) => {
  const patterns: Pattern[] = [];
  
  // Horizontal lines (all possible lengths)
  for (let row = 0; row < rows; row++) {
    for (let length = 3; length <= cols; length++) {
      for (let startCol = 0; startCol <= cols - length; startCol++) {
        const positions = Array.from({length}, (_, i) => [row, startCol + i]);
        patterns.push({
          name: `H-${row}-${length}`,
          positions,
          baseMultiplier: calculateMultiplier(length, 'horizontal'),
          difficulty: length,
          type: 'line',
          rarity: calculateRarity(length, cols)
        });
      }
    }
  }
  
  // Vertical lines (all possible lengths)
  for (let col = 0; col < cols; col++) {
    for (let length = 3; length <= rows; length++) {
      for (let startRow = 0; startRow <= rows - length; startRow++) {
        const positions = Array.from({length}, (_, i) => [startRow + i, col]);
        patterns.push({
          name: `V-${col}-${length}`,
          positions,
          baseMultiplier: calculateMultiplier(length, 'vertical'),
          difficulty: length,
          type: 'line',
          rarity: calculateRarity(length, rows)
        });
      }
    }
  }
  
  return patterns;
};
```

#### Diagonal Pattern Generation
```typescript
const generateDiagonalPatterns = (rows: number, cols: number) => {
  const patterns: Pattern[] = [];
  
  // Main diagonals (top-left to bottom-right)
  for (let startRow = 0; startRow <= rows - 3; startRow++) {
    for (let startCol = 0; startCol <= cols - 3; startCol++) {
      const maxLength = Math.min(rows - startRow, cols - startCol);
      for (let length = 3; length <= maxLength; length++) {
        const positions = Array.from({length}, (_, i) => [startRow + i, startCol + i]);
        patterns.push({
          name: `D-${startRow}-${startCol}-${length}`,
          positions,
          baseMultiplier: calculateMultiplier(length, 'diagonal'),
          difficulty: length,
          type: 'diagonal',
          rarity: calculateRarity(length, Math.min(rows, cols))
        });
      }
    }
  }
  
  // Anti-diagonals (top-right to bottom-left)
  for (let startRow = 0; startRow <= rows - 3; startRow++) {
    for (let startCol = 2; startCol < cols; startCol++) {
      const maxLength = Math.min(rows - startRow, startCol + 1);
      for (let length = 3; length <= maxLength; length++) {
        const positions = Array.from({length}, (_, i) => [startRow + i, startCol - i]);
        patterns.push({
          name: `AD-${startRow}-${startCol}-${length}`,
          positions,
          baseMultiplier: calculateMultiplier(length, 'diagonal'),
          difficulty: length,
          type: 'diagonal',
          rarity: calculateRarity(length, Math.min(rows, cols))
        });
      }
    }
  }
  
  return patterns;
};
```

#### Geometric Pattern Generation
```typescript
const generateGeometricPatterns = (rows: number, cols: number) => {
  const patterns: Pattern[] = [];
  
  // L-shapes (all possible sizes and orientations)
  for (let size = 2; size <= Math.min(rows, cols) - 1; size++) {
    for (let row = 0; row <= rows - size - 1; row++) {
      for (let col = 0; col <= cols - size - 1; col++) {
        // 4 orientations of L-shape
        const orientations = [
          // L pointing right-down
          [[0,0], [0,1], [1,0]],
          // L pointing down-left  
          [[0,1], [1,1], [1,0]],
          // L pointing left-up
          [[1,1], [1,0], [0,1]],
          // L pointing up-right
          [[1,0], [0,0], [0,1]]
        ];
        
        orientations.forEach((shape, i) => {
          const positions = shape.map(([r, c]) => [row + r, col + c]);
          patterns.push({
            name: `L-${size}-${i}-${row}-${col}`,
            positions,
            baseMultiplier: calculateMultiplier(positions.length, 'geometric'),
            difficulty: positions.length,
            type: 'geometric',
            rarity: calculateRarity(positions.length, Math.min(rows, cols))
          });
        });
      }
    }
  }
  
  // T-shapes
  for (let size = 2; size <= Math.min(rows, cols) - 1; size++) {
    for (let row = 0; row <= rows - size - 1; row++) {
      for (let col = 0; col <= cols - size - 1; col++) {
        const tShapes = [
          // T pointing up
          [[0,1], [1,0], [1,1], [1,2], [2,1]],
          // T pointing right
          [[0,0], [0,1], [0,2], [1,1], [2,1]],
          // T pointing down
          [[0,1], [1,0], [1,1], [1,2], [2,1]],
          // T pointing left
          [[0,1], [1,0], [1,1], [1,2], [2,1]]
        ];
        
        tShapes.forEach((shape, i) => {
          const positions = shape.map(([r, c]) => [row + r, col + c]);
          if (isValidPattern(positions, rows, cols)) {
            patterns.push({
              name: `T-${size}-${i}-${row}-${col}`,
              positions,
              baseMultiplier: calculateMultiplier(positions.length, 'geometric'),
              difficulty: positions.length,
              type: 'geometric',
              rarity: calculateRarity(positions.length, Math.min(rows, cols))
            });
          }
        });
      }
    }
  }
  
  return patterns;
};
```

### Pattern Valuation System

#### Multiplier Calculation
```typescript
const calculateMultiplier = (length: number, type: 'horizontal' | 'vertical' | 'diagonal' | 'geometric') => {
  const baseMultipliers = {
    horizontal: 1.0,
    vertical: 1.0,
    diagonal: 1.2,
    geometric: 1.5
  };
  
  const lengthBonus = Math.pow(1.2, length - 3); // 20% bonus per extra symbol
  const typeBonus = baseMultipliers[type];
  
  return typeBonus * lengthBonus;
};
```

#### Rarity Calculation
```typescript
const calculateRarity = (length: number, maxDimension: number) => {
  // Longer patterns in smaller grids are rarer
  const rarityFactor = length / maxDimension;
  return Math.pow(2, rarityFactor * 3); // Exponential rarity scaling
};
```

#### Pattern Complexity Scoring
```typescript
const calculatePatternComplexity = (positions: number[][]) => {
  const bounds = getBounds(positions);
  const area = bounds.width * bounds.height;
  const coverage = positions.length / area;
  const spread = calculateSpread(positions);
  
  return {
    area,
    coverage,
    spread,
    complexity: (coverage * spread) / area
  };
};
```

### Pattern Filtering & Balancing

#### Pattern Filter
```typescript
interface PatternFilter {
  maxPatterns: number;
  difficultyRange: [number, number];
  excludeTypes?: string[];
  preferRare?: boolean;
  minRarity?: number;
}

const filterPatterns = (patterns: Pattern[], filter: PatternFilter) => {
  return patterns
    .filter(p => p.difficulty >= filter.difficultyRange[0] && 
                 p.difficulty <= filter.difficultyRange[1])
    .filter(p => !filter.excludeTypes?.includes(p.type))
    .filter(p => !filter.minRarity || p.rarity >= filter.minRarity)
    .sort((a, b) => {
      if (filter.preferRare) {
        return b.rarity - a.rarity;
      }
      return b.baseMultiplier - a.baseMultiplier;
    })
    .slice(0, filter.maxPatterns);
};
```

### Charm-Based Pattern Modifiers

#### Pattern Modifier Charms
```typescript
interface PatternModifierCharm {
  id: string;
  name: string;
  effects: {
    patternTypes?: string[]; // Only affect certain pattern types
    multiplierBonus?: number; // Add to pattern multiplier
    difficultyModifier?: number; // Make patterns easier/harder
    unlockNewTypes?: string[]; // Unlock new pattern types
    gridSizeModifier?: { rows: number, cols: number };
  };
}

const patternCharms = {
  'geometric-master': {
    effects: {
      patternTypes: ['geometric'],
      multiplierBonus: 0.5,
      unlockNewTypes: ['spiral', 'zigzag']
    }
  },
  'line-specialist': {
    effects: {
      patternTypes: ['line'],
      multiplierBonus: 0.3,
      difficultyModifier: -1 // Makes line patterns easier
    }
  },
  'wide-vision': {
    effects: {
      gridSizeModifier: { rows: 0, cols: +2 }
    }
  },
  'tall-ambition': {
    effects: {
      gridSizeModifier: { rows: +2, cols: 0 }
    }
  }
};
```

### Real-time Pattern Updates

#### Grid Size Change Handler
```typescript
const updatePatternsForGridSize = (newGridSize: {rows: number, cols: number}) => {
  const newPatterns = generatePatterns(newGridSize);
  const filteredPatterns = filterPatterns(newPatterns, currentFilter);
  
  // Update game state with new patterns
  setAvailablePatterns(filteredPatterns);
  
  // Recalculate existing matches with new patterns
  const currentMatches = findMatchingPatterns(currentGrid, filteredPatterns);
  updateMatches(currentMatches);
};
```

## Example Scenarios

### Scenario 1: 3x9 Grid
**Grid:**
```
🍋 🍒 🍀 🔔 💎 💰 7️⃣ 🍋 🍒
🔔 💎 💰 7️⃣ 🍋 🍒 🍀 🔔 💎
7️⃣ 🍋 🍒 🍀 🔔 💎 💰 7️⃣ 🍋
```

**Discovered Patterns:**
- 9-symbol horizontal lines: 50 coins (very rare!)
- 8-symbol horizontal lines: 40 coins
- 7-symbol horizontal lines: 30 coins
- 6-symbol horizontal lines: 20 coins
- 5-symbol horizontal lines: 15 coins
- 4-symbol horizontal lines: 10 coins
- 3-symbol horizontal lines: 5 coins
- 3-symbol vertical lines: 8 coins
- 3-symbol diagonals: 12 coins
- L-shapes: 15-25 coins (various sizes)
- T-shapes: 12-20 coins (various sizes)

### Scenario 2: 7x2 Grid
**Grid:**
```
🍋 🍒
🔔 💎
💰 7️⃣
🍋 🍒
🔔 💎
💰 7️⃣
🍋 🍒
```

**Discovered Patterns:**
- 7-symbol vertical lines: 35 coins (very rare!)
- 6-symbol vertical lines: 28 coins
- 5-symbol vertical lines: 20 coins
- 4-symbol vertical lines: 15 coins
- 3-symbol vertical lines: 10 coins
- 2-symbol horizontal lines: 3 coins (very common)

### Scenario 3: 1x20 Grid
**Grid:**
```
🍋 🍒 🍀 🔔 💎 💰 7️⃣ 🍋 🍒 🍀 🔔 💎 💰 7️⃣ 🍋 🍒 🍀 🔔 💎
```

**Discovered Patterns:**
- 20-symbol horizontal line: 100 coins (extremely rare!)
- 19-symbol horizontal line: 90 coins
- 18-symbol horizontal line: 80 coins
- ...and so on down to 3-symbol lines

## Benefits

### 1. Complete Flexibility
- Any grid size works automatically
- No hardcoded pattern limitations
- Patterns adapt to player's grid choices

### 2. Dynamic Balancing
- Values automatically adjust based on difficulty
- Rarer patterns in smaller grids worth more
- Longer patterns in larger grids worth more

### 3. Charm Integration
- Charms directly affect gameplay mechanics
- Grid size changes feel meaningful
- Temporary effects create variety

### 4. Scalable System
- Easy to add new pattern types
- Easy to add new grid size modifiers
- Easy to balance through parameters

### 5. Player Agency
- Players choose their grid size through charms
- Risk/reward decisions (smaller grid = easier patterns, bigger grid = harder but more valuable)
- Phone calls provide temporary strategic options

## Current Implementation Analysis

### How Patterns Are Currently Implemented

#### 1. **Static Pattern Definition** (`patterns.ts`)
- **Hardcoded 3x3 patterns**: 8 total patterns (3 rows, 3 columns, 2 diagonals)
- **Fixed positions**: Each pattern has predefined `[row, col]` coordinates
- **Simple multipliers**: 1.0 for lines, 1.5 for diagonals
- **Symbol-specific bonuses**: Different multipliers per symbol type

#### 2. **Pattern Detection** (`useSlotMachine.ts`)
- **Grid generation**: Fixed 3x3 grid using `Array(3).fill(null).map(() => Array(3).fill(''))`
- **Pattern matching**: Uses `findMatchingPatterns()` to check all 8 static patterns
- **Payout calculation**: `baseValue × patternMultiplier × symbolMultiplier × globalMultipliers`

#### 3. **UI Integration** (`SlotGrid.tsx`, `App.tsx`)
- **Visual display**: Shows 3x3 grid with winning positions highlighted
- **Result display**: Shows matched patterns and payouts
- **No grid size flexibility**: Hardcoded to 3x3 dimensions

#### 4. **Charm System** (`charms.ts`)
- **No grid size modifiers**: Current charms don't affect grid dimensions
- **Pattern bonuses**: Some charms boost pattern multipliers but don't change patterns themselves
- **No dynamic pattern generation**: Charms can't unlock new pattern types

### Key Limitations

1. **Fixed Grid Size**: Always 3x3, no flexibility
2. **Hardcoded Patterns**: Only 8 predefined patterns
3. **No Dynamic Generation**: Can't create patterns for different grid sizes
4. **Limited Charm Integration**: Charms can't modify grid or create new patterns
5. **No Pattern Complexity**: All patterns are simple lines

## Step-by-Step Implementation Guide

### Phase 1: Core Infrastructure Setup

#### Step 1: Create Dynamic Pattern Generator
**File**: `src/systems/patternGenerator.ts`

```typescript
// New file - Dynamic pattern generation system
export interface DynamicPattern {
  name: string;
  positions: number[][];
  baseMultiplier: number;
  difficulty: number;
  type: 'line' | 'diagonal' | 'geometric' | 'custom';
  rarity: number;
  description: string;
}

export interface GridSize {
  rows: number;
  cols: number;
}

export class PatternGenerator {
  generatePatterns(gridSize: GridSize): DynamicPattern[] {
    const patterns: DynamicPattern[] = [];
    
    // Generate all pattern types
    patterns.push(...this.generateLinePatterns(gridSize));
    patterns.push(...this.generateDiagonalPatterns(gridSize));
    patterns.push(...this.generateGeometricPatterns(gridSize));
    
    return patterns;
  }
  
  // Implementation of all pattern generation methods...
}
```

#### Step 2: Update Pattern Data Structure
**File**: `src/data/patterns.ts` (Major Refactor)

```typescript
// Replace static patterns with dynamic system
export interface PatternMatch {
  pattern: DynamicPattern;
  symbol: string;
  positions: number[][];
  payout: number;
}

// Remove static PATTERNS array
// Add dynamic pattern management functions
export const createPatternSystem = (gridSize: GridSize) => {
  const generator = new PatternGenerator();
  return generator.generatePatterns(gridSize);
};
```

#### Step 3: Add Grid Size Management
**File**: `src/hooks/useGridSize.ts` (New)

```typescript
export interface GridSizeState {
  rows: number;
  cols: number;
  modifiers: GridSizeModifier[];
}

export const useGridSize = (initialSize: GridSize = { rows: 3, cols: 3 }) => {
  // Manage dynamic grid size changes
  // Handle charm effects on grid size
  // Apply temporary modifiers
};
```

### Phase 2: Update Core Game Logic

#### Step 4: Modify Slot Machine Hook
**File**: `src/hooks/useSlotMachine.ts` (Major Changes)

```typescript
// Add grid size parameter
export const useSlotMachine = (initialSpins: number = 5, gridSize: GridSize = { rows: 3, cols: 3 }) => {
  // Replace hardcoded 3x3 with dynamic grid
  const generateGrid = useCallback((luckBonus: number = 0, currentGridSize: GridSize): string[][] => {
    const grid: string[][] = Array(currentGridSize.rows)
      .fill(null)
      .map(() => Array(currentGridSize.cols).fill(''));
    // ... rest of generation logic
  }, []);
  
  // Update pattern detection to use dynamic patterns
  const findMatchingPatterns = useCallback((grid: string[][], patterns: DynamicPattern[]) => {
    // Use dynamic pattern matching
  }, []);
};
```

#### Step 5: Update Game State Management
**File**: `src/hooks/useGameState.ts` (Additions)

```typescript
export interface GameState {
  // ... existing properties
  gridSize: GridSize;
  availablePatterns: DynamicPattern[];
  gridSizeModifiers: GridSizeModifier[];
}

// Add grid size management functions
const updateGridSize = useCallback((newSize: GridSize) => {
  // Update grid size and regenerate patterns
}, []);

const applyGridSizeModifier = useCallback((modifier: GridSizeModifier) => {
  // Apply temporary or permanent grid size changes
}, []);
```

### Phase 3: Charm System Integration

#### Step 6: Add Grid Size Charm Effects
**File**: `src/data/charms.ts` (Additions)

```typescript
// Add new charm types for grid modification
export const GRID_SIZE_CHARMS: Charm[] = [
  {
    id: 'expansive_vision',
    name: 'Expansive Vision',
    cost: 3,
    rarity: 'rare',
    effect: '+1 row and +1 column to grid',
    effectType: 'passive',
    gridSizeModifier: { rows: 1, cols: 1 },
    description: 'Permanently expands your grid size',
    tier: 'A'
  },
  {
    id: 'wide_screen',
    name: 'Wide Screen',
    cost: 2,
    rarity: 'uncommon',
    effect: '+3 columns to grid',
    effectType: 'passive',
    gridSizeModifier: { rows: 0, cols: 3 },
    description: 'Makes your grid much wider',
    tier: 'B'
  },
  // ... more grid size charms
];
```

#### Step 7: Update Charm Processing
**File**: `src/hooks/useCharms.ts` (Modifications)

```typescript
// Add grid size effect processing
const processCharmEffects = useCallback((trigger: string, context: any) => {
  const effects = {
    // ... existing effects
    gridSizeModifier: null as GridSizeModifier | null
  };
  
  // Process grid size modifying charms
  equippedCharms.forEach(charm => {
    if (charm.charm.gridSizeModifier) {
      effects.gridSizeModifier = charm.charm.gridSizeModifier;
    }
  });
  
  return effects;
}, [equippedCharms]);
```

### Phase 4: UI Updates

#### Step 8: Update Slot Grid Component
**File**: `src/components/SlotMachine/SlotGrid.tsx` (Modifications)

```typescript
interface SlotGridProps {
  grid: string[][];
  isSpinning?: boolean;
  winningPositions?: number[][];
  gridSize: GridSize; // Add grid size prop
}

const SlotGrid: React.FC<SlotGridProps> = ({ 
  grid, 
  isSpinning = false, 
  winningPositions = [],
  gridSize // Use dynamic grid size
}) => {
  // Update CSS classes to handle different grid sizes
  const gridStyle = {
    gridTemplateColumns: `repeat(${gridSize.cols}, 1fr)`,
    gridTemplateRows: `repeat(${gridSize.rows}, 1fr)`
  };
  
  return (
    <div 
      className={`slot-grid ${isSpinning ? 'spinning' : ''}`}
      style={gridStyle}
    >
      {/* Dynamic grid rendering */}
    </div>
  );
};
```

#### Step 9: Update CSS for Dynamic Grids
**File**: `src/components/SlotMachine/SlotGrid.css` (Modifications)

```css
.slot-grid {
  display: grid;
  gap: 4px;
  padding: 10px;
  /* Remove fixed grid-template-columns/rows */
  /* Let JavaScript handle dynamic sizing */
}

.slot-cell {
  /* Ensure cells scale properly */
  min-width: 60px;
  min-height: 60px;
  /* Add responsive sizing */
}
```

#### Step 10: Update Main App Component
**File**: `src/App.tsx` (Major Changes)

```typescript
function App() {
  // Add grid size state
  const [gridSize, setGridSize] = useState<GridSize>({ rows: 3, cols: 3 });
  const [availablePatterns, setAvailablePatterns] = useState<DynamicPattern[]>([]);
  
  // Initialize patterns when grid size changes
  useEffect(() => {
    const generator = new PatternGenerator();
    const patterns = generator.generatePatterns(gridSize);
    setAvailablePatterns(patterns);
  }, [gridSize]);
  
  // Update slot machine to use dynamic grid
  const { state: slotState, spin, /* ... */ } = useSlotMachine(5, gridSize);
  
  // Handle grid size changes from charms
  const handleGridSizeChange = useCallback((newSize: GridSize) => {
    setGridSize(newSize);
    // Regenerate patterns
    const generator = new PatternGenerator();
    const patterns = generator.generatePatterns(newSize);
    setAvailablePatterns(patterns);
  }, []);
  
  // Pass grid size to components
  return (
    <SlotGrid
      grid={slotState.grid}
      isSpinning={slotState.isSpinning}
      winningPositions={winningPositions}
      gridSize={gridSize}
    />
  );
}
```

### Phase 5: Advanced Features

#### Step 11: Add Pattern Filtering System
**File**: `src/systems/patternFilter.ts` (New)

```typescript
export interface PatternFilter {
  maxPatterns: number;
  difficultyRange: [number, number];
  excludeTypes?: string[];
  preferRare?: boolean;
  minRarity?: number;
}

export const filterPatterns = (patterns: DynamicPattern[], filter: PatternFilter): DynamicPattern[] => {
  // Implement pattern filtering logic
};
```

#### Step 12: Add Phone Call Grid Effects
**File**: `src/data/phoneCalls.ts` (Additions)

```typescript
export const GRID_SIZE_PHONE_CALLS = [
  {
    id: 'grid_expansion',
    description: "The caller offers to expand your grid temporarily",
    effect: { 
      type: 'grid_size',
      modifier: { rows: 2, cols: 2 },
      duration: 5 // 5 spins
    }
  },
  // ... more grid size phone calls
];
```

#### Step 13: Add Pattern Complexity Visualization
**File**: `src/components/UI/PatternStats.tsx` (New)

```typescript
// Component to show available patterns and their complexity
const PatternStats: React.FC<{ patterns: DynamicPattern[], gridSize: GridSize }> = ({ patterns, gridSize }) => {
  // Display pattern statistics, rarity, complexity
};
```

### Phase 6: Testing and Balancing

#### Step 14: Add Pattern Testing Utilities
**File**: `src/utils/patternTesting.ts` (New)

```typescript
// Utilities for testing pattern generation and balancing
export const testPatternGeneration = (gridSize: GridSize) => {
  // Test pattern generation for different grid sizes
};

export const balancePatternValues = (patterns: DynamicPattern[], gridSize: GridSize) => {
  // Adjust pattern values based on grid size and difficulty
};
```

#### Step 15: Update Game Balance
**File**: `src/systems/gameBalance.ts` (New)

```typescript
// Balance patterns based on grid size and game progression
export const calculatePatternBalance = (gridSize: GridSize, deadline: number) => {
  // Adjust pattern values and rarity based on game state
};
```

## Implementation Order

1. **Start with Phase 1** - Core infrastructure
2. **Move to Phase 2** - Update game logic
3. **Implement Phase 3** - Charm integration
4. **Update Phase 4** - UI components
5. **Add Phase 5** - Advanced features
6. **Finish with Phase 6** - Testing and balancing

## Key Benefits After Implementation

1. **Complete Flexibility**: Any grid size works automatically
2. **Dynamic Patterns**: Patterns adapt to grid dimensions
3. **Charm Integration**: Charms can modify grid size and patterns
4. **Scalable System**: Easy to add new pattern types
5. **Player Agency**: Strategic grid size choices
6. **Balanced Progression**: Values adjust based on difficulty