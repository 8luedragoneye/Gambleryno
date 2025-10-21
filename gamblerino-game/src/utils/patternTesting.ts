// Utilities for testing pattern generation and balancing
import { PatternGenerator, GridSize, DynamicPattern } from '../systems/patternGenerator';

export const testPatternGeneration = (gridSize: GridSize): {
  patterns: DynamicPattern[];
  stats: {
    totalPatterns: number;
    linePatterns: number;
    diagonalPatterns: number;
    geometricPatterns: number;
    averageMultiplier: number;
    averageRarity: number;
  };
} => {
  const generator = new PatternGenerator();
  const patterns = generator.generatePatterns(gridSize);
  
  const stats = {
    totalPatterns: patterns.length,
    linePatterns: patterns.filter(p => p.type === 'line').length,
    diagonalPatterns: patterns.filter(p => p.type === 'diagonal').length,
    geometricPatterns: patterns.filter(p => p.type === 'geometric').length,
    averageMultiplier: patterns.reduce((sum, p) => sum + p.baseMultiplier, 0) / patterns.length,
    averageRarity: patterns.reduce((sum, p) => sum + p.rarity, 0) / patterns.length
  };
  
  return { patterns, stats };
};

export const balancePatternValues = (patterns: DynamicPattern[], gridSize: GridSize): DynamicPattern[] => {
  // Adjust pattern values based on grid size and difficulty
  const maxDimension = Math.max(gridSize.rows, gridSize.cols);
  const minDimension = Math.min(gridSize.rows, gridSize.cols);
  
  return patterns.map(pattern => {
    // Adjust multiplier based on grid size
    const sizeFactor = maxDimension / 3; // Base size is 3x3
    const adjustedMultiplier = pattern.baseMultiplier * Math.pow(sizeFactor, 0.5);
    
    // Adjust rarity based on pattern difficulty vs grid size
    const difficultyFactor = pattern.difficulty / maxDimension;
    const adjustedRarity = pattern.rarity * Math.pow(difficultyFactor, 2);
    
    return {
      ...pattern,
      baseMultiplier: Math.round(adjustedMultiplier * 100) / 100,
      rarity: Math.round(adjustedRarity * 100) / 100
    };
  });
};

export const testDifferentGridSizes = (): void => {
  const testSizes: GridSize[] = [
    { rows: 3, cols: 3 },
    { rows: 4, cols: 4 },
    { rows: 3, cols: 6 },
    { rows: 6, cols: 3 },
    { rows: 2, cols: 8 },
    { rows: 8, cols: 2 }
  ];
  
  console.log('🧪 Testing Pattern Generation for Different Grid Sizes:');
  
  testSizes.forEach(size => {
    const result = testPatternGeneration(size);
    console.log(`\n📐 Grid ${size.rows}x${size.cols}:`);
    console.log(`  Total Patterns: ${result.stats.totalPatterns}`);
    console.log(`  Line Patterns: ${result.stats.linePatterns}`);
    console.log(`  Diagonal Patterns: ${result.stats.diagonalPatterns}`);
    console.log(`  Geometric Patterns: ${result.stats.geometricPatterns}`);
    console.log(`  Average Multiplier: ${result.stats.averageMultiplier.toFixed(2)}`);
    console.log(`  Average Rarity: ${result.stats.averageRarity.toFixed(2)}`);
  });
};
