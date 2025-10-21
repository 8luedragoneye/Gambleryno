// Demo function to show pattern detection logging
import { PatternGenerator, GridSize } from '../systems/patternGenerator';
import { findMatchingPatterns } from '../data/patterns';

export const demoPatternLogging = () => {
  console.log('🎮 PATTERN DETECTION LOGGING DEMO');
  console.log('=====================================');
  
  // Test with a 3x3 grid
  const grid3x3: string[][] = [
    ['lemon', 'cherry', 'lemon'],
    ['cherry', 'lemon', 'cherry'],
    ['lemon', 'cherry', 'lemon']
  ];
  
  console.log('\n📐 Testing 3x3 Grid:');
  console.log('Grid Contents:');
  grid3x3.forEach((row, i) => {
    console.log(`  Row ${i}: [${row.join(', ')}]`);
  });
  
  const generator = new PatternGenerator();
  const patterns3x3 = generator.generatePatterns({ rows: 3, cols: 3 });
  const matches3x3 = findMatchingPatterns(grid3x3, patterns3x3);
  
  // Test with a 4x4 grid
  const grid4x4: string[][] = [
    ['lemon', 'cherry', 'lemon', 'cherry'],
    ['cherry', 'lemon', 'cherry', 'lemon'],
    ['lemon', 'cherry', 'lemon', 'cherry'],
    ['cherry', 'lemon', 'cherry', 'lemon']
  ];
  
  console.log('\n📐 Testing 4x4 Grid:');
  console.log('Grid Contents:');
  grid4x4.forEach((row, i) => {
    console.log(`  Row ${i}: [${row.join(', ')}]`);
  });
  
  const patterns4x4 = generator.generatePatterns({ rows: 4, cols: 4 });
  const matches4x4 = findMatchingPatterns(grid4x4, patterns4x4);
  
  console.log('\n🎯 DEMO COMPLETE!');
  console.log('Check the console above to see detailed pattern detection logs.');
};

// Function to test specific patterns
export const testSpecificPattern = (gridSize: GridSize, testSymbol: string) => {
  console.log(`\n🧪 TESTING SPECIFIC PATTERN: ${testSymbol} in ${gridSize.rows}x${gridSize.cols} grid`);
  console.log('=====================================');
  
  // Create a grid filled with the test symbol
  const testGrid: string[][] = Array(gridSize.rows)
    .fill(null)
    .map(() => Array(gridSize.cols).fill(testSymbol));
  
  console.log('Test Grid (all same symbol):');
  testGrid.forEach((row, i) => {
    console.log(`  Row ${i}: [${row.join(', ')}]`);
  });
  
  const generator = new PatternGenerator();
  const patterns = generator.generatePatterns(gridSize);
  const matches = findMatchingPatterns(testGrid, patterns);
  
  console.log(`\nFound ${matches.length} patterns with symbol: ${testSymbol}`);
};
