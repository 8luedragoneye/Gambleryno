// Pattern definitions and payout calculations
export interface Pattern {
  name: string;
  positions: number[][];
  multiplier: number;
  description: string;
}

export interface PatternMatch {
  pattern: Pattern;
  symbol: string;
  positions: number[][];
  payout: number;
}

// Define all possible winning patterns in a 3x3 grid
export const PATTERNS: Pattern[] = [
  // Rows
  {
    name: 'Top Row',
    positions: [[0, 0], [0, 1], [0, 2]],
    multiplier: 1.0,
    description: 'Three matching symbols in the top row'
  },
  {
    name: 'Middle Row',
    positions: [[1, 0], [1, 1], [1, 2]],
    multiplier: 1.0,
    description: 'Three matching symbols in the middle row'
  },
  {
    name: 'Bottom Row',
    positions: [[2, 0], [2, 1], [2, 2]],
    multiplier: 1.0,
    description: 'Three matching symbols in the bottom row'
  },
  // Columns
  {
    name: 'Left Column',
    positions: [[0, 0], [1, 0], [2, 0]],
    multiplier: 1.0,
    description: 'Three matching symbols in the left column'
  },
  {
    name: 'Middle Column',
    positions: [[0, 1], [1, 1], [2, 1]],
    multiplier: 1.0,
    description: 'Three matching symbols in the middle column'
  },
  {
    name: 'Right Column',
    positions: [[0, 2], [1, 2], [2, 2]],
    multiplier: 1.0,
    description: 'Three matching symbols in the right column'
  },
  // Diagonals
  {
    name: 'Main Diagonal',
    positions: [[0, 0], [1, 1], [2, 2]],
    multiplier: 1.5,
    description: 'Three matching symbols in the main diagonal'
  },
  {
    name: 'Anti-Diagonal',
    positions: [[0, 2], [1, 1], [2, 0]],
    multiplier: 1.5,
    description: 'Three matching symbols in the anti-diagonal'
  }
];

// Special pattern multipliers
export const SPECIAL_PATTERN_MULTIPLIERS = {
  // Symbol-specific bonuses
  seven: 2.0,
  diamond: 1.5,
  treasure: 1.5,
  bell: 1.2,
  clover: 1.2,
  cherry: 1.0,
  lemon: 1.0
};

// Check if a pattern matches in the grid
export const checkPattern = (grid: string[][], pattern: Pattern): string | null => {
  const positions = pattern.positions;
  const firstSymbol = grid[positions[0][0]][positions[0][1]];
  
  // Check if all positions have the same symbol
  for (const [row, col] of positions) {
    if (grid[row][col] !== firstSymbol) {
      return null;
    }
  }
  
  return firstSymbol;
};

// Find all matching patterns in the grid
export const findMatchingPatterns = (grid: string[][]): PatternMatch[] => {
  const matches: PatternMatch[] = [];
  
  for (const pattern of PATTERNS) {
    const symbol = checkPattern(grid, pattern);
    if (symbol) {
      const baseValue = getSymbolBaseValue(symbol);
      const symbolMultiplier = SPECIAL_PATTERN_MULTIPLIERS[symbol as keyof typeof SPECIAL_PATTERN_MULTIPLIERS] || 1.0;
      const payout = baseValue * pattern.multiplier * symbolMultiplier;
      
      matches.push({
        pattern,
        symbol,
        positions: pattern.positions,
        payout
      });
    }
  }
  
  return matches;
};

// Get base value for a symbol (this should match the symbols data)
const getSymbolBaseValue = (symbolName: string): number => {
  const symbolValues: { [key: string]: number } = {
    lemon: 10,
    cherry: 10,
    clover: 15,
    bell: 15,
    diamond: 25,
    treasure: 25,
    seven: 50
  };
  
  return symbolValues[symbolName] || 0;
};

// Calculate total payout from all matches
export const calculateTotalPayout = (matches: PatternMatch[], symbolsMultiplier: number = 1, patternsMultiplier: number = 1): number => {
  const basePayout = matches.reduce((total, match) => total + match.payout, 0);
  return basePayout * symbolsMultiplier * patternsMultiplier;
};

// Check for special number sequences (666, 999)
export const checkSpecialSequences = (grid: string[][]): '666' | '999' | null => {
  const flatGrid = grid.flat();
  
  // Check for 666 (bad - resets coins)
  if (flatGrid.filter(symbol => symbol === 'seven').length >= 3) {
    return '666';
  }
  
  // Check for 999 (good - doubles payouts)
  if (flatGrid.filter(symbol => symbol === 'seven').length >= 6) {
    return '999';
  }
  
  return null;
};
