// Pattern containment resolver to prevent double-counting contained patterns
import { PatternMatch } from './patternTemplates';

export interface ContainmentAnalysis {
  pattern: PatternMatch;
  isContained: boolean;
  containedBy: PatternMatch[];
  contains: PatternMatch[];
}

export class PatternContainmentResolver {
  // Resolve patterns by removing those that are completely contained in others
  static resolveContainment(matches: PatternMatch[]): PatternMatch[] {
    if (matches.length === 0) return matches;

    console.log('🔍 RESOLVING PATTERN CONTAINMENT:');
    console.log(`  Initial matches: ${matches.length}`);

    // Analyze containment relationships
    const containmentAnalysis = this.analyzeContainment(matches);
    
    // Remove patterns that are contained in others
    const resolvedMatches: PatternMatch[] = [];
    
    for (const analysis of containmentAnalysis) {
      if (!analysis.isContained) {
        resolvedMatches.push(analysis.pattern);
        console.log(`  ✅ KEPT: ${analysis.pattern.template.name} (${analysis.pattern.template.type})`);
      } else {
        console.log(`  ❌ REMOVED: ${analysis.pattern.template.name} (contained in ${analysis.containedBy.map(p => p.template.name).join(', ')})`);
      }
    }

    console.log(`  Final resolved matches: ${resolvedMatches.length}`);
    return resolvedMatches;
  }

  // Analyze containment relationships between patterns
  private static analyzeContainment(matches: PatternMatch[]): ContainmentAnalysis[] {
    const analysis: ContainmentAnalysis[] = matches.map(pattern => ({
      pattern,
      isContained: false,
      containedBy: [],
      contains: []
    }));

    // Check each pattern against all others
    for (let i = 0; i < analysis.length; i++) {
      for (let j = 0; j < analysis.length; j++) {
        if (i === j) continue;
        
        const patternA = analysis[i].pattern;
        const patternB = analysis[j].pattern;
        
        // Only check patterns with the same symbol
        if (patternA.symbol !== patternB.symbol) continue;
        
        // Check if A is contained in B
        if (this.isPatternContained(patternA, patternB)) {
          analysis[i].isContained = true;
          analysis[i].containedBy.push(patternB);
          analysis[j].contains.push(patternA);
        }
      }
    }

    return analysis;
  }

  // Check if pattern A is completely contained in pattern B
  private static isPatternContained(patternA: PatternMatch, patternB: PatternMatch): boolean {
    // Pattern A is contained in B if all positions of A are also in B
    const positionsA = patternA.positions.map(([row, col]) => `${row},${col}`);
    const positionsB = patternB.positions.map(([row, col]) => `${row},${col}`);
    
    return positionsA.every(pos => positionsB.includes(pos));
  }

  // Smart containment resolution with priority
  static resolveSmartContainment(matches: PatternMatch[]): PatternMatch[] {
    if (matches.length === 0) return matches;

    console.log('🧠 SMART CONTAINMENT RESOLUTION:');
    console.log(`  Initial matches: ${matches.length}`);

    // Sort patterns by priority (geometric > diagonal > line, then by length)
    const sortedMatches = matches
      .map(match => ({
        ...match,
        priority: this.calculatePriority(match)
      }))
      .sort((a, b) => b.priority - a.priority);

    console.log('  Sorted by priority:');
    sortedMatches.forEach((match, i) => {
      console.log(`    ${i + 1}. ${match.template.name} (${match.template.type}, ${match.positions.length} symbols, priority: ${match.priority})`);
    });

    const resolvedMatches: PatternMatch[] = [];
    const usedPositions = new Set<string>();

    for (const match of sortedMatches) {
      // Check if this pattern is contained in any already resolved pattern
      const isContained = resolvedMatches.some(resolvedMatch => 
        this.isPatternContained(match, resolvedMatch)
      );

      if (!isContained) {
        // Check if this pattern contains any already resolved patterns
        const containedPatterns = resolvedMatches.filter(resolvedMatch => 
          this.isPatternContained(resolvedMatch, match)
        );

        if (containedPatterns.length > 0) {
          // This pattern contains others - remove the contained ones
          console.log(`  🔄 REPLACING: ${match.template.name} replaces ${containedPatterns.map(p => p.template.name).join(', ')}`);
          
          // Remove contained patterns from resolved matches
          containedPatterns.forEach(containedPattern => {
            const index = resolvedMatches.indexOf(containedPattern);
            if (index > -1) {
              resolvedMatches.splice(index, 1);
            }
          });
        }

        resolvedMatches.push(match);
        console.log(`  ✅ ADDED: ${match.template.name} (${match.template.type})`);
      } else {
        console.log(`  ❌ SKIPPED: ${match.template.name} (contained in existing pattern)`);
      }
    }

    console.log(`  Final resolved matches: ${resolvedMatches.length}`);
    return resolvedMatches;
  }

  // Calculate priority for a pattern
  private static calculatePriority(match: PatternMatch): number {
    const length = match.positions.length;
    const type = match.template.type;
    const multiplier = match.template.multiplier;
    
    // Base priority from type (geometric > diagonal > line)
    let priority = 0;
    switch (type) {
      case 'geometric': priority = 300; break;
      case 'diagonal': priority = 200; break;
      case 'line': priority = 100; break;
      default: priority = 0;
    }
    
    // Add length bonus
    priority += length * 10;
    
    // Add multiplier bonus
    priority += multiplier * 5;
    
    return priority;
  }

  // Get the best non-contained patterns
  static getBestPatterns(matches: PatternMatch[]): PatternMatch[] {
    if (matches.length === 0) return matches;

    console.log('🎯 GETTING BEST NON-CONTAINED PATTERNS:');
    console.log(`  Initial matches: ${matches.length}`);

    // Use smart containment resolution
    const bestPatterns = this.resolveSmartContainment(matches);
    
    console.log(`  Best patterns: ${bestPatterns.length}`);
    return bestPatterns;
  }

  // Calculate total payout from resolved patterns
  static calculateResolvedPayout(matches: PatternMatch[]): number {
    const resolvedMatches = this.getBestPatterns(matches);
    return resolvedMatches.reduce((total, match) => total + match.payout, 0);
  }
}

// Utility function to resolve pattern containment
export const resolvePatternContainment = (matches: PatternMatch[]): PatternMatch[] => {
  return PatternContainmentResolver.getBestPatterns(matches);
};

// Utility function to calculate resolved payout
export const calculateResolvedPayout = (matches: PatternMatch[]): number => {
  return PatternContainmentResolver.calculateResolvedPayout(matches);
};
