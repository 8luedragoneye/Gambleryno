// Dynamic pattern generation system
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

export interface GridSizeModifier {
  type: 'charm' | 'phone_call' | 'temporary';
  source: string;
  rows: number;
  cols: number;
  duration?: number; // for temporary effects
}

export class PatternGenerator {
  generatePatterns(gridSize: GridSize): DynamicPattern[] {
    const patterns: DynamicPattern[] = [];
    
    // Generate all pattern types
    patterns.push(...this.generateLinePatterns(gridSize));
    patterns.push(...this.generateDiagonalPatterns(gridSize));
    patterns.push(...this.generateGeometricPatterns(gridSize));
    
    // Remove duplicate patterns (same positions)
    return this.removeDuplicatePatterns(patterns);
  }
  
  // Line Pattern Generation
  private generateLinePatterns(gridSize: GridSize): DynamicPattern[] {
    const patterns: DynamicPattern[] = [];
    
    // Horizontal lines (all possible lengths)
    for (let row = 0; row < gridSize.rows; row++) {
      for (let length = 3; length <= gridSize.cols; length++) {
        for (let startCol = 0; startCol <= gridSize.cols - length; startCol++) {
          const positions = Array.from({length}, (_, i) => [row, startCol + i]);
          patterns.push({
            name: `H-${row}-${length}`,
            positions,
            baseMultiplier: this.calculateMultiplier(length, 'horizontal'),
            difficulty: length,
            type: 'line',
            rarity: this.calculateRarity(length, gridSize.cols),
            description: `${length}-symbol horizontal line in row ${row}`
          });
        }
      }
    }
    
    // Vertical lines (all possible lengths)
    for (let col = 0; col < gridSize.cols; col++) {
      for (let length = 3; length <= gridSize.rows; length++) {
        for (let startRow = 0; startRow <= gridSize.rows - length; startRow++) {
          const positions = Array.from({length}, (_, i) => [startRow + i, col]);
          patterns.push({
            name: `V-${col}-${length}`,
            positions,
            baseMultiplier: this.calculateMultiplier(length, 'vertical'),
            difficulty: length,
            type: 'line',
            rarity: this.calculateRarity(length, gridSize.rows),
            description: `${length}-symbol vertical line in column ${col}`
          });
        }
      }
    }
    
    return patterns;
  }
  
  // Diagonal Pattern Generation
  private generateDiagonalPatterns(gridSize: GridSize): DynamicPattern[] {
    const patterns: DynamicPattern[] = [];
    
    // Main diagonals (top-left to bottom-right)
    for (let startRow = 0; startRow <= gridSize.rows - 3; startRow++) {
      for (let startCol = 0; startCol <= gridSize.cols - 3; startCol++) {
        const maxLength = Math.min(gridSize.rows - startRow, gridSize.cols - startCol);
        for (let length = 3; length <= maxLength; length++) {
          const positions = Array.from({length}, (_, i) => [startRow + i, startCol + i]);
          patterns.push({
            name: `D-${startRow}-${startCol}-${length}`,
            positions,
            baseMultiplier: this.calculateMultiplier(length, 'diagonal'),
            difficulty: length,
            type: 'diagonal',
            rarity: this.calculateRarity(length, Math.min(gridSize.rows, gridSize.cols)),
            description: `${length}-symbol diagonal from (${startRow},${startCol})`
          });
        }
      }
    }
    
    // Anti-diagonals (top-right to bottom-left)
    for (let startRow = 0; startRow <= gridSize.rows - 3; startRow++) {
      for (let startCol = 2; startCol < gridSize.cols; startCol++) {
        const maxLength = Math.min(gridSize.rows - startRow, startCol + 1);
        for (let length = 3; length <= maxLength; length++) {
          const positions = Array.from({length}, (_, i) => [startRow + i, startCol - i]);
          patterns.push({
            name: `AD-${startRow}-${startCol}-${length}`,
            positions,
            baseMultiplier: this.calculateMultiplier(length, 'diagonal'),
            difficulty: length,
            type: 'diagonal',
            rarity: this.calculateRarity(length, Math.min(gridSize.rows, gridSize.cols)),
            description: `${length}-symbol anti-diagonal from (${startRow},${startCol})`
          });
        }
      }
    }
    
    return patterns;
  }
  
  // Geometric Pattern Generation
  private generateGeometricPatterns(gridSize: GridSize): DynamicPattern[] {
    const patterns: DynamicPattern[] = [];
    
    // L-shapes (all possible sizes and orientations)
    for (let size = 2; size <= Math.min(gridSize.rows, gridSize.cols) - 1; size++) {
      for (let row = 0; row <= gridSize.rows - size - 1; row++) {
        for (let col = 0; col <= gridSize.cols - size - 1; col++) {
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
            if (this.isValidPattern(positions, gridSize)) {
              patterns.push({
                name: `L-${size}-${i}-${row}-${col}`,
                positions,
                baseMultiplier: this.calculateMultiplier(positions.length, 'geometric'),
                difficulty: positions.length,
                type: 'geometric',
                rarity: this.calculateRarity(positions.length, Math.min(gridSize.rows, gridSize.cols)),
                description: `L-shape pattern at (${row},${col})`
              });
            }
          });
        }
      }
    }
    
    // T-shapes (only generate unique orientations)
    for (let size = 2; size <= Math.min(gridSize.rows, gridSize.cols) - 1; size++) {
      for (let row = 0; row <= gridSize.rows - size - 1; row++) {
        for (let col = 0; col <= gridSize.cols - size - 1; col++) {
          const tShapes = [
            // T pointing up
            [[0,1], [1,0], [1,1], [1,2], [2,1]],
            // T pointing right
            [[0,0], [0,1], [0,2], [1,1], [2,1]],
            // T pointing down
            [[2,1], [1,0], [1,1], [1,2], [0,1]],
            // T pointing left
            [[0,1], [1,2], [1,1], [1,0], [2,1]]
          ];
          
          tShapes.forEach((shape, i) => {
            const positions = shape.map(([r, c]) => [row + r, col + c]);
            if (this.isValidPattern(positions, gridSize)) {
              patterns.push({
                name: `T-${size}-${i}-${row}-${col}`,
                positions,
                baseMultiplier: this.calculateMultiplier(positions.length, 'geometric'),
                difficulty: positions.length,
                type: 'geometric',
                rarity: this.calculateRarity(positions.length, Math.min(gridSize.rows, gridSize.cols)),
                description: `T-shape pattern at (${row},${col})`
              });
            }
          });
        }
      }
    }
    
    return patterns;
  }
  
  // Multiplier Calculation
  private calculateMultiplier(length: number, type: 'horizontal' | 'vertical' | 'diagonal' | 'geometric'): number {
    const baseMultipliers = {
      horizontal: 1.0,
      vertical: 1.0,
      diagonal: 1.2,
      geometric: 1.5
    };
    
    const lengthBonus = Math.pow(1.2, length - 3); // 20% bonus per extra symbol
    const typeBonus = baseMultipliers[type];
    
    return typeBonus * lengthBonus;
  }
  
  // Rarity Calculation
  private calculateRarity(length: number, maxDimension: number): number {
    // Longer patterns in smaller grids are rarer
    const rarityFactor = length / maxDimension;
    return Math.pow(2, rarityFactor * 3); // Exponential rarity scaling
  }
  
  // Pattern Validation
  private isValidPattern(positions: number[][], gridSize: GridSize): boolean {
    return positions.every(([row, col]) => 
      row >= 0 && row < gridSize.rows && 
      col >= 0 && col < gridSize.cols
    );
  }
  
  // Pattern Complexity Scoring
  calculatePatternComplexity(positions: number[][]): {
    area: number;
    coverage: number;
    spread: number;
    complexity: number;
  } {
    const bounds = this.getBounds(positions);
    const area = bounds.width * bounds.height;
    const coverage = positions.length / area;
    const spread = this.calculateSpread(positions);
    
    return {
      area,
      coverage,
      spread,
      complexity: (coverage * spread) / area
    };
  }
  
  private getBounds(positions: number[][]): { width: number; height: number } {
    const rows = positions.map(([row]) => row);
    const cols = positions.map(([, col]) => col);
    
    return {
      width: Math.max(...cols) - Math.min(...cols) + 1,
      height: Math.max(...rows) - Math.min(...rows) + 1
    };
  }
  
  private calculateSpread(positions: number[][]): number {
    const rows = positions.map(([row]) => row);
    const cols = positions.map(([, col]) => col);
    
    const rowSpread = Math.max(...rows) - Math.min(...rows);
    const colSpread = Math.max(...cols) - Math.min(...cols);
    
    return Math.sqrt(rowSpread * rowSpread + colSpread * colSpread);
  }
  
  // Remove duplicate patterns based on identical positions
  private removeDuplicatePatterns(patterns: DynamicPattern[]): DynamicPattern[] {
    const uniquePatterns: DynamicPattern[] = [];
    const seenPositions = new Set<string>();
    
    for (const pattern of patterns) {
      // Create a normalized position key (sorted positions)
      const normalizedPositions = pattern.positions
        .map(([row, col]) => `${row},${col}`)
        .sort()
        .join('|');
      
      if (!seenPositions.has(normalizedPositions)) {
        seenPositions.add(normalizedPositions);
        uniquePatterns.push(pattern);
      }
    }
    
    return uniquePatterns;
  }
}
