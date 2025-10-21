// Pattern template system for variable grids
export interface PatternTemplate {
  name: string;
  shape: number[][]; // Relative positions from origin (0,0)
  multiplier: number;
  type: 'line' | 'diagonal' | 'geometric';
  minSize: number; // Minimum grid size needed
  description: string;
}

export interface PatternMatch {
  template: PatternTemplate;
  positions: number[][]; // Absolute positions on grid
  symbol: string;
  payout: number;
}

// Define pattern templates (relative to origin)
export const PATTERN_TEMPLATES: PatternTemplate[] = [
  // Horizontal Lines
  {
    name: 'Horizontal 3',
    shape: [[0, 0], [0, 1], [0, 2]],
    multiplier: 1.0,
    type: 'line',
    minSize: 3,
    description: '3-symbol horizontal line'
  },
  {
    name: 'Horizontal 4',
    shape: [[0, 0], [0, 1], [0, 2], [0, 3]],
    multiplier: 1.2,
    type: 'line',
    minSize: 4,
    description: '4-symbol horizontal line'
  },
  {
    name: 'Horizontal 5',
    shape: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]],
    multiplier: 1.44,
    type: 'line',
    minSize: 5,
    description: '5-symbol horizontal line'
  },

  // Vertical Lines
  {
    name: 'Vertical 3',
    shape: [[0, 0], [1, 0], [2, 0]],
    multiplier: 1.0,
    type: 'line',
    minSize: 3,
    description: '3-symbol vertical line'
  },
  {
    name: 'Vertical 4',
    shape: [[0, 0], [1, 0], [2, 0], [3, 0]],
    multiplier: 1.2,
    type: 'line',
    minSize: 4,
    description: '4-symbol vertical line'
  },

  // Diagonals
  {
    name: 'Main Diagonal 3',
    shape: [[0, 0], [1, 1], [2, 2]],
    multiplier: 1.2,
    type: 'diagonal',
    minSize: 3,
    description: '3-symbol main diagonal'
  },
  {
    name: 'Anti-Diagonal 3',
    shape: [[0, 2], [1, 1], [2, 0]],
    multiplier: 1.2,
    type: 'diagonal',
    minSize: 3,
    description: '3-symbol anti-diagonal'
  },

  // L-Shapes
  {
    name: 'L-Shape Right-Down',
    shape: [[0, 0], [0, 1], [1, 0]],
    multiplier: 1.5,
    type: 'geometric',
    minSize: 2,
    description: 'L-shape pointing right-down'
  },
  {
    name: 'L-Shape Down-Left',
    shape: [[0, 1], [1, 1], [1, 0]],
    multiplier: 1.5,
    type: 'geometric',
    minSize: 2,
    description: 'L-shape pointing down-left'
  },

  // T-Shapes
  {
    name: 'T-Shape Up',
    shape: [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]],
    multiplier: 2.0,
    type: 'geometric',
    minSize: 3,
    description: 'T-shape pointing up'
  },
  {
    name: 'T-Shape Right',
    shape: [[0, 0], [0, 1], [0, 2], [1, 1], [2, 1]],
    multiplier: 2.0,
    type: 'geometric',
    minSize: 3,
    description: 'T-shape pointing right'
  },

  // Cross Pattern
  {
    name: 'Cross',
    shape: [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]],
    multiplier: 2.5,
    type: 'geometric',
    minSize: 3,
    description: 'Cross pattern'
  }
];

export class PatternTemplateDetector {
  private grid: string[][];
  private gridSize: { rows: number; cols: number };

  constructor(grid: string[][]) {
    this.grid = grid;
    this.gridSize = { rows: grid.length, cols: grid[0]?.length || 0 };
  }

  // Find all matching patterns using templates
  findMatches(): PatternMatch[] {
    const matches: PatternMatch[] = [];
    
    // Get applicable templates for this grid size
    const applicableTemplates = PATTERN_TEMPLATES.filter(
      template => this.gridSize.rows >= template.minSize && 
                 this.gridSize.cols >= template.minSize
    );

    console.log(`🔍 Checking ${applicableTemplates.length} applicable templates on ${this.gridSize.rows}x${this.gridSize.cols} grid`);

    for (const template of applicableTemplates) {
      const templateMatches = this.findTemplateMatches(template);
      matches.push(...templateMatches);
    }

    console.log(`✅ Found ${matches.length} total pattern matches`);
    return matches;
  }

  // Find matches for a specific template
  private findTemplateMatches(template: PatternTemplate): PatternMatch[] {
    const matches: PatternMatch[] = [];
    
    // Try placing the template at every possible position
    for (let startRow = 0; startRow < this.gridSize.rows; startRow++) {
      for (let startCol = 0; startCol < this.gridSize.cols; startCol++) {
        const match = this.checkTemplateAtPosition(template, startRow, startCol);
        if (match) {
          matches.push(match);
        }
      }
    }

    return matches;
  }

  // Check if template matches at a specific position
  private checkTemplateAtPosition(
    template: PatternTemplate, 
    startRow: number, 
    startCol: number
  ): PatternMatch | null {
    // Calculate absolute positions
    const positions = template.shape.map(([relRow, relCol]) => [
      startRow + relRow,
      startCol + relCol
    ]);

    // Check if all positions are within grid bounds
    if (!this.arePositionsValid(positions)) {
      return null;
    }

    // Check if all positions have the same symbol
    const firstSymbol = this.grid[positions[0][0]][positions[0][1]];
    for (const [row, col] of positions) {
      if (this.grid[row][col] !== firstSymbol) {
        return null;
      }
    }

    // Calculate payout
    const baseValue = this.getSymbolBaseValue(firstSymbol);
    const symbolMultiplier = this.getSymbolMultiplier(firstSymbol);
    const payout = baseValue * template.multiplier * symbolMultiplier;

    console.log(`🎯 FOUND PATTERN: ${template.name}`);
    console.log(`   Symbol: ${firstSymbol}`);
    console.log(`   Positions: ${positions.map(([r, c]) => `(${r},${c})`).join(' ')}`);
    console.log(`   Multiplier: ${template.multiplier}`);
    console.log(`   Payout: ${payout}`);

    return {
      template,
      positions,
      symbol: firstSymbol,
      payout
    };
  }

  // Validate that all positions are within grid bounds
  private arePositionsValid(positions: number[][]): boolean {
    return positions.every(([row, col]) => 
      row >= 0 && row < this.gridSize.rows && 
      col >= 0 && col < this.gridSize.cols
    );
  }

  // Get base value for a symbol
  private getSymbolBaseValue(symbolName: string): number {
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
  }

  // Get symbol-specific multiplier
  private getSymbolMultiplier(symbolName: string): number {
    const symbolMultipliers: { [key: string]: number } = {
      seven: 2.0,
      diamond: 1.5,
      treasure: 1.5,
      bell: 1.2,
      clover: 1.2,
      cherry: 1.0,
      lemon: 1.0
    };
    
    return symbolMultipliers[symbolName] || 1.0;
  }

  // Calculate total payout from all matches
  calculateTotalPayout(matches: PatternMatch[], symbolsMultiplier: number = 1, patternsMultiplier: number = 1): number {
    const basePayout = matches.reduce((total, match) => total + match.payout, 0);
    return basePayout * symbolsMultiplier * patternsMultiplier;
  }
}

// Utility function to create detector and find matches
export const findPatternMatches = (grid: string[][]): PatternMatch[] => {
  const detector = new PatternTemplateDetector(grid);
  return detector.findMatches();
};

// Utility function to calculate total payout
export const calculateTotalPayout = (
  grid: string[][], 
  symbolsMultiplier: number = 1, 
  patternsMultiplier: number = 1
): number => {
  const detector = new PatternTemplateDetector(grid);
  const matches = detector.findMatches();
  return detector.calculateTotalPayout(matches, symbolsMultiplier, patternsMultiplier);
};
