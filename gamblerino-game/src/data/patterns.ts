// Pattern definitions and payout calculations
import { DynamicPattern, GridSize } from '../systems/patternGenerator';
import { PatternGenerator } from '../systems/patternGenerator';

export interface Pattern {
  name: string;
  positions: number[][];
  multiplier: number;
  description: string;
}

export interface PatternMatch {
  pattern: DynamicPattern;
  symbol: string;
  positions: number[][];
  payout: number;
}

// Legacy static patterns for backward compatibility
export const LEGACY_PATTERNS: Pattern[] = [
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

// Dynamic pattern system
export const createPatternSystem = (gridSize: GridSize): DynamicPattern[] => {
  const generator = new PatternGenerator();
  return generator.generatePatterns(gridSize);
};

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
export const checkPattern = (grid: string[][], pattern: DynamicPattern): string | null => {
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

// Find all matching patterns in the grid using dynamic patterns
export const findMatchingPatterns = (grid: string[][], patterns: DynamicPattern[]): PatternMatch[] => {
  const matches: PatternMatch[] = [];
  
  for (const pattern of patterns) {
    const symbol = checkPattern(grid, pattern);
    if (symbol) {
      const baseValue = getSymbolBaseValue(symbol);
      const symbolMultiplier = SPECIAL_PATTERN_MULTIPLIERS[symbol as keyof typeof SPECIAL_PATTERN_MULTIPLIERS] || 1.0;
      const payout = baseValue * pattern.baseMultiplier * symbolMultiplier;
      
      // Log pattern details
      console.log(`✅ FOUND PATTERN: ${pattern.name}`);
      console.log(`    Type: ${pattern.type}`);
      console.log(`    Symbol: ${symbol}`);
      console.log(`    Positions:`, pattern.positions.map(([r, c]) => `(${r},${c})`).join(' '));
      console.log(`    Multiplier: ${pattern.baseMultiplier}`);
      console.log(`    Rarity: ${pattern.rarity}`);
      console.log(`    Payout: ${payout}`);
      
      matches.push({
        pattern,
        symbol,
        positions: pattern.positions,
        payout
      });
    }
  }
  
  console.log(`🎯 Patterns Found: ${matches.length}`);
  
  return matches;
};

// Legacy function for backward compatibility
export const findMatchingPatternsLegacy = (grid: string[][]): PatternMatch[] => {
  const matches: PatternMatch[] = [];
  
  for (const pattern of LEGACY_PATTERNS) {
    const symbol = checkPatternLegacy(grid, pattern);
    if (symbol) {
      const baseValue = getSymbolBaseValue(symbol);
      const symbolMultiplier = SPECIAL_PATTERN_MULTIPLIERS[symbol as keyof typeof SPECIAL_PATTERN_MULTIPLIERS] || 1.0;
      const payout = baseValue * pattern.multiplier * symbolMultiplier;
      
      matches.push({
        pattern: {
          name: pattern.name,
          positions: pattern.positions,
          baseMultiplier: pattern.multiplier,
          difficulty: pattern.positions.length,
          type: 'line' as const,
          rarity: 1,
          description: pattern.description
        },
        symbol,
        positions: pattern.positions,
        payout
      });
    }
  }
  
  return matches;
};

// Legacy pattern check function
const checkPatternLegacy = (grid: string[][], pattern: Pattern): string | null => {
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

