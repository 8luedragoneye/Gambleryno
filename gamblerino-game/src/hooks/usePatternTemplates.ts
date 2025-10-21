// Hook for using pattern templates with variable grids
import { useState, useCallback } from 'react';
import { PatternTemplateDetector, PatternMatch, calculateTotalPayout } from '../systems/patternTemplates';

export interface PatternTemplateState {
  matches: PatternMatch[];
  totalPayout: number;
  isDetecting: boolean;
}

export const usePatternTemplates = () => {
  const [state, setState] = useState<PatternTemplateState>({
    matches: [],
    totalPayout: 0,
    isDetecting: false
  });

  // Detect patterns in a grid
  const detectPatterns = useCallback((grid: string[][], symbolsMultiplier: number = 1, patternsMultiplier: number = 1) => {
    setState(prev => ({ ...prev, isDetecting: true }));

    console.log('🔍 PATTERN TEMPLATE DETECTION:');
    console.log('  Grid Size:', `${grid.length}x${grid[0]?.length || 0}`);
    console.log('  Symbols Multiplier:', symbolsMultiplier);
    console.log('  Patterns Multiplier:', patternsMultiplier);

    const detector = new PatternTemplateDetector(grid);
    const matches = detector.findMatches();
    const totalPayout = detector.calculateTotalPayout(matches, symbolsMultiplier, patternsMultiplier);

    console.log('  Total Matches:', matches.length);
    console.log('  Total Payout:', totalPayout);

    setState({
      matches,
      totalPayout,
      isDetecting: false
    });

    return { matches, totalPayout };
  }, []);

  // Get winning positions for highlighting
  const getWinningPositions = useCallback((): number[][] => {
    const allPositions: number[][] = [];
    
    state.matches.forEach(match => {
      allPositions.push(...match.positions);
    });

    // Remove duplicates
    const uniquePositions = allPositions.filter((pos, index, self) => 
      index === self.findIndex(p => p[0] === pos[0] && p[1] === pos[1])
    );

    return uniquePositions;
  }, [state.matches]);

  // Get matches by symbol
  const getMatchesBySymbol = useCallback((symbol: string): PatternMatch[] => {
    return state.matches.filter(match => match.symbol === symbol);
  }, [state.matches]);

  // Get matches by pattern type
  const getMatchesByType = useCallback((type: 'line' | 'diagonal' | 'geometric'): PatternMatch[] => {
    return state.matches.filter(match => match.template.type === type);
  }, [state.matches]);

  // Clear current matches
  const clearMatches = useCallback(() => {
    setState({
      matches: [],
      totalPayout: 0,
      isDetecting: false
    });
  }, []);

  return {
    state,
    detectPatterns,
    getWinningPositions,
    getMatchesBySymbol,
    getMatchesByType,
    clearMatches
  };
};
