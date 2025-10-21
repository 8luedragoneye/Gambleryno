// Demo of pattern template system with variable grids
import { PatternTemplateDetector, findPatternMatches, calculateTotalPayout } from '../systems/patternTemplates';

export const demoPatternTemplates = () => {
  console.log('🎮 PATTERN TEMPLATE DEMO');
  console.log('========================');

  // Test with different grid sizes
  const testGrids = [
    {
      name: '3x3 Grid',
      grid: [
        ['lemon', 'lemon', 'lemon'],
        ['cherry', 'bell', 'diamond'],
        ['lemon', 'cherry', 'lemon']
      ]
    },
    {
      name: '4x4 Grid',
      grid: [
        ['lemon', 'lemon', 'lemon', 'cherry'],
        ['cherry', 'bell', 'diamond', 'treasure'],
        ['lemon', 'cherry', 'lemon', 'seven'],
        ['bell', 'diamond', 'treasure', 'seven']
      ]
    },
    {
      name: '5x5 Grid',
      grid: [
        ['lemon', 'lemon', 'lemon', 'cherry', 'bell'],
        ['cherry', 'bell', 'diamond', 'treasure', 'seven'],
        ['lemon', 'cherry', 'lemon', 'bell', 'diamond'],
        ['bell', 'diamond', 'treasure', 'seven', 'lemon'],
        ['cherry', 'lemon', 'bell', 'diamond', 'treasure']
      ]
    },
    {
      name: '6x3 Grid (Wide)',
      grid: [
        ['lemon', 'lemon', 'lemon', 'cherry', 'bell', 'diamond'],
        ['cherry', 'bell', 'diamond', 'treasure', 'seven', 'lemon'],
        ['lemon', 'cherry', 'lemon', 'bell', 'diamond', 'treasure']
      ]
    }
  ];

  testGrids.forEach(({ name, grid }) => {
    console.log(`\n📐 Testing ${name}:`);
    console.log('Grid Contents:');
    grid.forEach((row, i) => {
      console.log(`  Row ${i}: [${row.join(', ')}]`);
    });

    const detector = new PatternTemplateDetector(grid);
    const matches = detector.findMatches();
    const totalPayout = detector.calculateTotalPayout(matches);

    console.log(`\n🎯 Results:`);
    console.log(`  Total Patterns Found: ${matches.length}`);
    console.log(`  Total Payout: ${totalPayout} coins`);

    if (matches.length > 0) {
      console.log(`\n📋 Pattern Details:`);
      matches.forEach((match, i) => {
        console.log(`  ${i + 1}. ${match.template.name} (${match.template.type})`);
        console.log(`     Symbol: ${match.symbol}`);
        console.log(`     Positions: ${match.positions.map(([r, c]) => `(${r},${c})`).join(' ')}`);
        console.log(`     Payout: ${match.payout} coins`);
      });
    }

    console.log('\n' + '='.repeat(50));
  });
};

// Test performance with large grids
export const testPerformance = () => {
  console.log('⚡ PERFORMANCE TEST');
  console.log('==================');

  const testSizes = [
    { rows: 3, cols: 3 },
    { rows: 4, cols: 4 },
    { rows: 5, cols: 5 },
    { rows: 6, cols: 6 },
    { rows: 8, cols: 8 },
    { rows: 10, cols: 10 }
  ];

  testSizes.forEach(({ rows, cols }) => {
    console.log(`\n📊 Testing ${rows}x${cols} grid:`);
    
    // Create a random grid
    const symbols = ['lemon', 'cherry', 'clover', 'bell', 'diamond', 'treasure', 'seven'];
    const grid: string[][] = Array(rows).fill(null).map(() => 
      Array(cols).fill(null).map(() => 
        symbols[Math.floor(Math.random() * symbols.length)]
      )
    );

    const startTime = performance.now();
    const detector = new PatternTemplateDetector(grid);
    const matches = detector.findMatches();
    const endTime = performance.now();

    const executionTime = endTime - startTime;
    console.log(`  Execution Time: ${executionTime.toFixed(2)}ms`);
    console.log(`  Patterns Found: ${matches.length}`);
    console.log(`  Time per Pattern: ${(executionTime / matches.length).toFixed(2)}ms`);
  });
};

// Test with winning grids
export const testWinningGrids = () => {
  console.log('🏆 WINNING GRID TEST');
  console.log('===================');

  // Create grids with guaranteed wins
  const winningGrids = [
    {
      name: 'All Lemons 3x3',
      grid: [
        ['lemon', 'lemon', 'lemon'],
        ['lemon', 'lemon', 'lemon'],
        ['lemon', 'lemon', 'lemon']
      ]
    },
    {
      name: 'All Sevens 4x4',
      grid: [
        ['seven', 'seven', 'seven', 'seven'],
        ['seven', 'seven', 'seven', 'seven'],
        ['seven', 'seven', 'seven', 'seven'],
        ['seven', 'seven', 'seven', 'seven']
      ]
    },
    {
      name: 'Mixed Winners 5x5',
      grid: [
        ['lemon', 'lemon', 'lemon', 'cherry', 'bell'],
        ['lemon', 'lemon', 'lemon', 'cherry', 'bell'],
        ['lemon', 'lemon', 'lemon', 'cherry', 'bell'],
        ['diamond', 'diamond', 'diamond', 'diamond', 'diamond'],
        ['treasure', 'treasure', 'treasure', 'treasure', 'treasure']
      ]
    }
  ];

  winningGrids.forEach(({ name, grid }) => {
    console.log(`\n🎰 Testing ${name}:`);
    
    const detector = new PatternTemplateDetector(grid);
    const matches = detector.findMatches();
    const totalPayout = detector.calculateTotalPayout(matches);

    console.log(`  Patterns Found: ${matches.length}`);
    console.log(`  Total Payout: ${totalPayout} coins`);
    
    // Group by pattern type
    const lineMatches = matches.filter(m => m.template.type === 'line');
    const diagonalMatches = matches.filter(m => m.template.type === 'diagonal');
    const geometricMatches = matches.filter(m => m.template.type === 'geometric');
    
    console.log(`  Line Patterns: ${lineMatches.length}`);
    console.log(`  Diagonal Patterns: ${diagonalMatches.length}`);
    console.log(`  Geometric Patterns: ${geometricMatches.length}`);
  });
};
