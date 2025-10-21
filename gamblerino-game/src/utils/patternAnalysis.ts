// Pattern analysis utilities
import { PatternGenerator, GridSize } from '../systems/patternGenerator';
import { findMatchingPatterns } from '../data/patterns';

export const analyzePatterns = (gridSize: GridSize, testGrid?: string[][]) => {
  console.log(`\n🔍 PATTERN ANALYSIS FOR ${gridSize.rows}x${gridSize.cols} GRID`);
  console.log('='.repeat(50));
  
  const generator = new PatternGenerator();
  const patterns = generator.generatePatterns(gridSize);
  
  // Check for duplicate patterns
  const positionMap = new Map();
  let duplicates = 0;
  
  patterns.forEach(pattern => {
    const key = pattern.positions
      .map(([row, col]) => `${row},${col}`)
      .sort()
      .join('|');
    
    if (positionMap.has(key)) {
      duplicates++;
      console.log(`❌ DUPLICATE FOUND:`);
      console.log(`   Pattern 1: ${positionMap.get(key).name}`);
      console.log(`   Pattern 2: ${pattern.name}`);
      console.log(`   Positions: ${key}`);
    } else {
      positionMap.set(key, pattern);
    }
  });
  
  console.log(`\n🔍 Duplicate Check: ${duplicates === 0 ? '✅ NO DUPLICATES' : `❌ ${duplicates} DUPLICATES FOUND`}`);
  
  // Analyze pattern types
  const linePatterns = patterns.filter(p => p.type === 'line');
  const diagonalPatterns = patterns.filter(p => p.type === 'diagonal');
  const geometricPatterns = patterns.filter(p => p.type === 'geometric');
  
  console.log(`📊 PATTERN STATISTICS:`);
  console.log(`  Total Patterns: ${patterns.length}`);
  console.log(`  Line Patterns: ${linePatterns.length}`);
  console.log(`  Diagonal Patterns: ${diagonalPatterns.length}`);
  console.log(`  Geometric Patterns: ${geometricPatterns.length}`);
  
  // Analyze difficulty distribution
  const difficultyStats = patterns.reduce((acc, pattern) => {
    acc[pattern.difficulty] = (acc[pattern.difficulty] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  
  console.log(`\n📈 DIFFICULTY DISTRIBUTION:`);
  Object.entries(difficultyStats).forEach(([difficulty, count]) => {
    console.log(`  Difficulty ${difficulty}: ${count} patterns`);
  });
  
  // Analyze multiplier distribution
  const multiplierRanges = {
    '1.0-1.5': patterns.filter(p => p.baseMultiplier >= 1.0 && p.baseMultiplier < 1.5).length,
    '1.5-2.0': patterns.filter(p => p.baseMultiplier >= 1.5 && p.baseMultiplier < 2.0).length,
    '2.0+': patterns.filter(p => p.baseMultiplier >= 2.0).length
  };
  
  console.log(`\n💰 MULTIPLIER DISTRIBUTION:`);
  Object.entries(multiplierRanges).forEach(([range, count]) => {
    console.log(`  ${range}: ${count} patterns`);
  });
  
  // Show some example patterns
  console.log(`\n🎯 EXAMPLE PATTERNS:`);
  const examples = patterns.slice(0, 5);
  examples.forEach((pattern, i) => {
    console.log(`  ${i + 1}. ${pattern.name} (${pattern.type})`);
    console.log(`     Positions: ${pattern.positions.map(([r, c]) => `(${r},${c})`).join(' ')}`);
    console.log(`     Multiplier: ${pattern.baseMultiplier}, Rarity: ${pattern.rarity.toFixed(2)}`);
  });
  
  // Test with a sample grid if provided
  if (testGrid) {
    console.log(`\n🧪 TESTING WITH SAMPLE GRID:`);
    testGrid.forEach((row, i) => {
      console.log(`  Row ${i}: [${row.join(', ')}]`);
    });
    
    const matches = findMatchingPatterns(testGrid, patterns);
    console.log(`\n✅ FOUND ${matches.length} MATCHES:`);
    matches.forEach((match, i) => {
      console.log(`  ${i + 1}. ${match.pattern.name} - ${match.symbol} (${match.payout} coins)`);
    });
  }
  
  console.log('\n' + '='.repeat(50));
};

// Test different grid sizes
export const testAllGridSizes = () => {
  const testSizes: GridSize[] = [
    { rows: 3, cols: 3 },
    { rows: 4, cols: 4 },
    { rows: 3, cols: 6 },
    { rows: 6, cols: 3 },
    { rows: 2, cols: 8 }
  ];
  
  testSizes.forEach(size => {
    analyzePatterns(size);
  });
};

// Test with a winning grid
export const testWinningGrid = (gridSize: GridSize) => {
  // Create a grid with all the same symbol to maximize matches
  const winningGrid: string[][] = Array(gridSize.rows)
    .fill(null)
    .map(() => Array(gridSize.cols).fill('lemon'));
  
  console.log(`\n🎰 TESTING WINNING GRID (All Lemons):`);
  analyzePatterns(gridSize, winningGrid);
};

// Test with a mixed grid
export const testMixedGrid = (gridSize: GridSize) => {
  const symbols = ['lemon', 'cherry', 'clover', 'bell', 'diamond', 'treasure', 'seven'];
  const mixedGrid: string[][] = Array(gridSize.rows)
    .fill(null)
    .map((_, row) => 
      Array(gridSize.cols)
        .fill(null)
        .map((_, col) => symbols[(row + col) % symbols.length])
    );
  
  console.log(`\n🎲 TESTING MIXED GRID:`);
  analyzePatterns(gridSize, mixedGrid);
};
