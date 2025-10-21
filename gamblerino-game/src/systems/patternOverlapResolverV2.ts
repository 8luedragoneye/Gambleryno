// Improved pattern overlap resolver that allows different pattern types to cross
import { PatternMatch } from './patternTemplates';

export interface ResolvedPatternMatch extends PatternMatch {
  priority: number;
  isOverlapped: boolean;
}

export class PatternOverlapResolverV2 {
  // Resolve overlaps by allowing different pattern types to cross
  static resolveOverlaps(matches: PatternMatch[]): PatternMatch[] {
    if (matches.length === 0) return matches;

    console.log('🔍 RESOLVING PATTERN OVERLAPS (V2):');
    console.log(`  Initial matches: ${matches.length}`);

    // Group matches by pattern type
    const matchesByType = this.groupMatchesByType(matches);
    
    // Resolve overlaps within each type (same type patterns can't overlap)
    const resolvedMatches: PatternMatch[] = [];
    
    for (const [type, typeMatches] of Object.entries(matchesByType)) {
      console.log(`\n  Processing ${type} patterns: ${typeMatches.length}`);
      const resolvedTypeMatches = this.resolveOverlapsWithinType(typeMatches);
      resolvedMatches.push(...resolvedTypeMatches);
    }

    console.log(`  Final resolved matches: ${resolvedMatches.length}`);
    return resolvedMatches;
  }

  // Group matches by pattern type
  private static groupMatchesByType(matches: PatternMatch[]): { [key: string]: PatternMatch[] } {
    const groups: { [key: string]: PatternMatch[] } = {};
    
    matches.forEach(match => {
      const type = match.template.type;
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(match);
    });
    
    return groups;
  }

  // Resolve overlaps within the same pattern type
  private static resolveOverlapsWithinType(matches: PatternMatch[]): PatternMatch[] {
    if (matches.length === 0) return matches;

    // Sort by priority (longer patterns first)
    const sortedMatches = matches
      .map(match => ({
        ...match,
        priority: this.calculatePriority(match)
      }))
      .sort((a, b) => b.priority - a.priority);

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
        
        console.log(`    ✅ ADDED: ${match.template.name} (${match.positions.length} symbols)`);
      } else {
        console.log(`    ❌ SKIPPED: ${match.template.name} (overlaps with existing ${match.template.type} pattern)`);
      }
    }

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

  // Alternative approach: Smart overlap resolution
  static resolveSmartOverlaps(matches: PatternMatch[]): PatternMatch[] {
    if (matches.length === 0) return matches;

    console.log('🧠 SMART OVERLAP RESOLUTION:');
    console.log(`  Initial matches: ${matches.length}`);

    // Group by symbol first
    const matchesBySymbol = this.groupMatchesBySymbol(matches);
    const resolvedMatches: PatternMatch[] = [];

    for (const [symbol, symbolMatches] of Object.entries(matchesBySymbol)) {
      console.log(`\n  Processing ${symbol} patterns: ${symbolMatches.length}`);
      
      // For each symbol, resolve overlaps by type
      const symbolResolved = this.resolveOverlapsWithinType(symbolMatches);
      resolvedMatches.push(...symbolResolved);
    }

    console.log(`  Final resolved matches: ${resolvedMatches.length}`);
    return resolvedMatches;
  }

  // Group matches by symbol
  private static groupMatchesBySymbol(matches: PatternMatch[]): { [key: string]: PatternMatch[] } {
    const groups: { [key: string]: PatternMatch[] } = {};
    
    matches.forEach(match => {
      const symbol = match.symbol;
      if (!groups[symbol]) {
        groups[symbol] = [];
      }
      groups[symbol].push(match);
    });
    
    return groups;
  }

  // Get the best non-overlapping patterns
  static getBestPatterns(matches: PatternMatch[]): PatternMatch[] {
    if (matches.length === 0) return matches;

    console.log('🎯 GETTING BEST PATTERNS (V2):');
    console.log(`  Initial matches: ${matches.length}`);

    // Use smart overlap resolution
    const bestPatterns = this.resolveSmartOverlaps(matches);
    
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
export const resolvePatternOverlapsV2 = (matches: PatternMatch[]): PatternMatch[] => {
  return PatternOverlapResolverV2.getBestPatterns(matches);
};

// Utility function to calculate resolved payout
export const calculateResolvedPayoutV2 = (matches: PatternMatch[]): number => {
  return PatternOverlapResolverV2.calculateResolvedPayout(matches);
};
