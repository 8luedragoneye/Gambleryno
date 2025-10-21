// Quick test script to analyze patterns
const { PatternGenerator } = require('./src/systems/patternGenerator.ts');

console.log('🧪 PATTERN ANALYSIS TEST');
console.log('========================');

// Test 3x3 grid
console.log('\n📐 3x3 Grid Analysis:');
const generator = new PatternGenerator();
const patterns3x3 = generator.generatePatterns({ rows: 3, cols: 3 });

console.log(`Total Patterns: ${patterns3x3.length}`);

// Count by type
const lineCount = patterns3x3.filter(p => p.type === 'line').length;
const diagonalCount = patterns3x3.filter(p => p.type === 'diagonal').length;
const geometricCount = patterns3x3.filter(p => p.type === 'geometric').length;

console.log(`Line Patterns: ${lineCount}`);
console.log(`Diagonal Patterns: ${diagonalCount}`);
console.log(`Geometric Patterns: ${geometricCount}`);

// Show some examples
console.log('\n🎯 Example Patterns:');
patterns3x3.slice(0, 5).forEach((pattern, i) => {
  console.log(`${i + 1}. ${pattern.name} (${pattern.type})`);
  console.log(`   Positions: ${pattern.positions.map(([r, c]) => `(${r},${c})`).join(' ')}`);
  console.log(`   Multiplier: ${pattern.baseMultiplier}, Rarity: ${pattern.rarity.toFixed(2)}`);
});

// Test 4x4 grid
console.log('\n📐 4x4 Grid Analysis:');
const patterns4x4 = generator.generatePatterns({ rows: 4, cols: 4 });

console.log(`Total Patterns: ${patterns4x4.length}`);

const lineCount4x4 = patterns4x4.filter(p => p.type === 'line').length;
const diagonalCount4x4 = patterns4x4.filter(p => p.type === 'diagonal').length;
const geometricCount4x4 = patterns4x4.filter(p => p.type === 'geometric').length;

console.log(`Line Patterns: ${lineCount4x4}`);
console.log(`Diagonal Patterns: ${diagonalCount4x4}`);
console.log(`Geometric Patterns: ${geometricCount4x4}`);

console.log('\n✅ Analysis Complete!');
