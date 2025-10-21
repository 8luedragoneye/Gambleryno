// Pattern overlap resolver to prevent double-counting
import { PatternMatch } from './patternTemplates';

export interface ResolvedPatternMatch extends PatternMatch {
  priority: number;
  isOverlapped: boolean;
}

export class PatternOverlapResolver {
  // Resolve overlapping patterns by prioritizing longer patterns
  static resolveOverlaps(matches: PatternMatch[]): PatternMatch[] {
    if (matches.length === 0) return matches;

    console.log('🔍 RESOLVING PATTERN OVERLAPS:');
    console.log(`  Initial matches: ${matches.length}`);

    // Sort matches by priority (longer patterns first, then by multiplier)
    const sortedMatches = matches
      .map(match => ({
        ...match,
        priority: this.calculatePriority(match)
      }))
      .sort((a, b) => b.priority - a.priority);

    console.log('  Sorted by priority:');
    sortedMatches.forEach((match, i) => {
      console.log(`    ${i + 1}. ${match.template.name} (${match.positions.length} symbols, priority: ${match.priority})`);
    });

    const resolvedMatches: PatternMatch[] = [];
    const usedPositions = new Set<string>();

    for (const match of sortedMatches) {
      // Check if this pattern overlaps with already used positions
      const matchPositions = match.positions.map(([row, col]) => `${row},${col}`);
      const hasOverlap = matchPositions.some(pos => usedPositions.has(pos));

      if (!hasOverlap) {
        // No overlap - add this pattern
        resolvedMatches.push(match);
        matchPositions.forEach(pos => usedPositions.add(pos));
        
        console.log(`  ✅ ADDED: ${match.template.name} (${match.positions.length} symbols)`);
      } else {
        console.log(`  ❌ SKIPPED: ${match.template.name} (overlaps with existing patterns)`);
      }
    }

    console.log(`  Final resolved matches: ${resolvedMatches.length}`);
    return resolvedMatches;
  }

  // Calculate priority for a pattern (higher = more important)
  private static calculatePriority(match: PatternMatch): number {
    const length = match.positions.length;
    const multiplier = match.template.multiplier;
    const type = match.template.type;
    
    // Base priority from length (longer = higher priority)
    let priority = length * 100;
    
    // Bonus for pattern type
    const typeBonus = {
      'geometric': 50,  // T-shapes, L-shapes are rarer
      'diagonal': 25,   // Diagonals are harder than lines
      'line': 0         // Lines are most common
    };
    
    priority += typeBonus[type] || 0;
    
    // Small bonus for higher multipliers
    priority += multiplier * 10;
    
    return priority;
  }

  // Alternative approach: Remove contained patterns
  static removeContainedPatterns(matches: PatternMatch[]): PatternMatch[] {
    if (matches.length === 0) return matches;

    console.log('🔍 REMOVING CONTAINED PATTERNS:');
    console.log(`  Initial matches: ${matches.length}`);

    const filteredMatches: PatternMatch[] = [];

    for (const match of matches) {
      let isContained = false;
      
      // Check if this pattern is contained within any other pattern
      for (const otherMatch of matches) {
        if (match === otherMatch) continue;
        
        if (this.isPatternContained(match, otherMatch)) {
          isContained = true;
          console.log(`  ❌ REMOVED: ${match.template.name} (contained in ${otherMatch.template.name})`);
          break;
        }
      }
      
      if (!isContained) {
        filteredMatches.push(match);
        console.log(`  ✅ KEPT: ${match.template.name} (${match.positions.length} symbols)`);
      }
    }

    console.log(`  Final filtered matches: ${filteredMatches.length}`);
    return filteredMatches;
  }

  // Check if pattern A is contained within pattern B
  private static isPatternContained(patternA: PatternMatch, patternB: PatternMatch): boolean {
    // Pattern A is contained in B if all positions of A are also in B
    const positionsA = patternA.positions.map(([row, col]) => `${row},${col}`);
    const positionsB = patternB.positions.map(([row, col]) => `${row},${col}`);
    
    return positionsA.every(pos => positionsB.includes(pos));
  }

  // Get the best non-overlapping patterns
  static getBestPatterns(matches: PatternMatch[]): PatternMatch[] {
    if (matches.length === 0) return matches;

    console.log('🎯 GETTING BEST NON-OVERLAPPING PATTERNS:');
    console.log(`  Initial matches: ${matches.length}`);

    // First, remove contained patterns
    const nonContained = this.removeContainedPatterns(matches);
    
    // Then, resolve overlaps
    const bestPatterns = this.resolveOverlaps(nonContained);
    
    console.log(`  Best patterns: ${bestPatterns.length}`);
    return bestPatterns;
  }

  // Calculate total payout from resolved patterns
  static calculateResolvedPayout(matches: PatternMatch[]): number {
    const resolvedMatches = this.getBestPatterns(matches);
    return resolvedMatches.reduce((total, match) => total + match.payout, 0);
  }
}

// Utility function to resolve pattern overlaps
export const resolvePatternOverlaps = (matches: PatternMatch[]): PatternMatch[] => {
  return PatternOverlapResolver.getBestPatterns(matches);
};

// Utility function to calculate resolved payout
export const calculateResolvedPayout = (matches: PatternMatch[]): number => {
  return PatternOverlapResolver.calculateResolvedPayout(matches);
};
