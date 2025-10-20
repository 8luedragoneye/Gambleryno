import { useState, useCallback } from 'react';
import { LuckSystem, LuckState, LuckCalculation } from '../systems/luckSystem';

export const useLuck = () => {
  const [luckSystem] = useState(() => new LuckSystem());

  // Calculate current luck
  const calculateLuck = useCallback((): LuckCalculation => {
    return luckSystem.calculateLuck();
  }, [luckSystem]);

  // Record a spin result
  const recordSpin = useCallback((hadWin: boolean) => {
    luckSystem.recordSpin(hadWin);
  }, [luckSystem]);

  // Add base luck (from charms)
  const addBaseLuck = useCallback((amount: number) => {
    luckSystem.addBaseLuck(amount);
  }, [luckSystem]);

  // Set base luck (from charms)
  const setBaseLuck = useCallback((amount: number) => {
    luckSystem.setBaseLuck(amount);
  }, [luckSystem]);

  // Reset for new deadline
  const resetForNewDeadline = useCallback(() => {
    luckSystem.resetForNewDeadline();
  }, [luckSystem]);

  // Get current state
  const getState = useCallback((): LuckState => {
    return luckSystem.getState();
  }, [luckSystem]);

  // Force matches in grid
  const forceMatches = useCallback((grid: string[][], symbolWeights: { [key: string]: number }) => {
    return luckSystem.forceMatches(grid, symbolWeights);
  }, [luckSystem]);

  // Check if should trigger jackpot
  const shouldTriggerJackpot = useCallback((): boolean => {
    return luckSystem.shouldTriggerJackpot();
  }, [luckSystem]);

  // Get luck description
  const getLuckDescription = useCallback((): string => {
    return luckSystem.getLuckDescription();
  }, [luckSystem]);


  return {
    calculateLuck,
    recordSpin,
    addBaseLuck,
    setBaseLuck,
    resetForNewDeadline,
    getState,
    forceMatches,
    shouldTriggerJackpot,
    getLuckDescription
  };
};
