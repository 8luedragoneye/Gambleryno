import { useState, useCallback } from 'react';
import { getRandomSymbol } from '../data/symbols';
import { findMatchingPatterns, calculateTotalPayout, checkSpecialSequences } from '../data/patterns';
import { LuckSystem } from '../systems/luckSystem';

export interface SlotMachineState {
  grid: string[][];
  spinsRemaining: number;
  coins: number;
  luck: number;
  symbolsMultiplier: number;
  patternsMultiplier: number;
  isSpinning: boolean;
}

export interface SpinResult {
  grid: string[][];
  matches: any[];
  totalPayout: number;
  specialSequence: string | null;
  newCoins: number;
}

export const useSlotMachine = (initialSpins: number = 5) => {
  const [state, setState] = useState<SlotMachineState>({
    grid: Array(3).fill(null).map(() => Array(3).fill('')),
    spinsRemaining: initialSpins,
    coins: 0,
    luck: 0,
    symbolsMultiplier: 1,
    patternsMultiplier: 1,
    isSpinning: false
  });


  // Generate a new grid with symbols
  const generateGrid = useCallback((luckBonus: number = 0): string[][] => {
    console.log('🎰 SLOT MACHINE GRID GENERATION:');
    console.log('  Luck Bonus:', luckBonus);
    
    const grid: string[][] = Array(3).fill(null).map(() => Array(3).fill(''));
    
    // Fill grid with random symbols
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        grid[row][col] = getRandomSymbol().name;
      }
    }
    
    console.log('  Initial Random Grid:', grid);
    
    // Apply luck for guaranteed symbols
    if (luckBonus > 0) {
      console.log('  Applying luck system...');
      
      // Create symbol weights for luck system
      const symbolWeights = {
        lemon: 1.3,
        cherry: 1.3,
        clover: 1.0,
        bell: 1.0,
        diamond: 0.8,
        treasure: 0.8,
        seven: 0.5
      };
      
      console.log('  Symbol Weights:', symbolWeights);
      
      // Use luck system to force symbols
      const luckSystem = new LuckSystem();
      luckSystem.setBaseLuck(luckBonus);
      const finalGrid = luckSystem.forceMatches(grid, symbolWeights);
      
      console.log('  Final Grid After Luck:', finalGrid);
      return finalGrid;
    }
    
    console.log('  No luck applied - using random grid');
    return grid;
  }, []);

  // Perform a spin
  const spin = useCallback((): SpinResult | null => {
    if (state.spinsRemaining <= 0 || state.isSpinning) {
      return null;
    }

    console.log('🎰 SPINNING SLOT MACHINE:');
    console.log('  Current Luck:', state.luck);
    console.log('  Spins Remaining:', state.spinsRemaining);

    setState(prev => ({ ...prev, isSpinning: true }));

    // Generate new grid
    const newGrid = generateGrid(state.luck);
    
    // Find matching patterns
    const matches = findMatchingPatterns(newGrid);
    console.log('  Found Matches:', matches);
    
    // Calculate total payout
    const totalPayout = calculateTotalPayout(
      matches, 
      state.symbolsMultiplier, 
      state.patternsMultiplier
    );
    console.log('  Total Payout:', totalPayout);
    
    // Check for special sequences
    const specialSequence = checkSpecialSequences(newGrid);
    console.log('  Special Sequence:', specialSequence);
    
    // Calculate new coin total
    let newCoins = state.coins + totalPayout;
    
    // Apply special sequence effects
    if (specialSequence === '666') {
      newCoins = 0; // Reset coins
      console.log('  666 Effect: Coins reset to 0');
    } else if (specialSequence === '999') {
      newCoins = state.coins + (totalPayout * 2); // Double payout
      console.log('  999 Effect: Payout doubled');
    }

    const result: SpinResult = {
      grid: newGrid,
      matches,
      totalPayout,
      specialSequence,
      newCoins
    };

    console.log('  Final Result:', result);

    // Update state
    setState(prev => ({
      ...prev,
      grid: newGrid,
      spinsRemaining: prev.spinsRemaining - 1,
      coins: newCoins,
      isSpinning: false
    }));

    return result;
  }, [state, generateGrid]);

  // Reset spins for new deadline
  const resetSpins = useCallback((newSpinCount: number) => {
    setState(prev => ({
      ...prev,
      spinsRemaining: newSpinCount
    }));
  }, []);

  // Add spins
  const addSpins = useCallback((amount: number) => {
    setState(prev => ({
      ...prev,
      spinsRemaining: prev.spinsRemaining + amount
    }));
  }, []);

  // Update multipliers
  const updateMultipliers = useCallback((symbolsMultiplier: number, patternsMultiplier: number) => {
    setState(prev => ({
      ...prev,
      symbolsMultiplier,
      patternsMultiplier
    }));
  }, []);

  // Update luck
  const updateLuck = useCallback((newLuck: number) => {
    setState(prev => ({
      ...prev,
      luck: newLuck
    }));
  }, []);

  // Add coins
  const addCoins = useCallback((amount: number) => {
    setState(prev => ({
      ...prev,
      coins: prev.coins + amount
    }));
  }, []);

  // Spend coins
  const spendCoins = useCallback((amount: number): boolean => {
    if (state.coins >= amount) {
      setState(prev => ({
        ...prev,
        coins: prev.coins - amount
      }));
      return true;
    }
    return false;
  }, [state.coins]);

  return {
    state,
    spin,
    resetSpins,
    addSpins,
    updateMultipliers,
    updateLuck,
    addCoins,
    spendCoins
  };
};
