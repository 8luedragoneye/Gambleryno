import { useState, useCallback } from 'react';
import { calculations } from '../utils/calculations';

export interface GameState {
  currentDeadline: number;
  debt: number;
  tickets: number;
  bankedCoins: number;
  interest: number;
  charmSlots: number;
  maxCharmSlots: number;
  equippedCharms: string[];
  gamePhase: 'playing' | 'shop' | 'phone_call' | 'game_over' | 'victory';
}

export const useGameState = () => {
  const [state, setState] = useState<GameState>({
    currentDeadline: 1,
    debt: 10,
    tickets: 0,
    bankedCoins: 0,
    interest: 0,
    charmSlots: 3,
    maxCharmSlots: 3,
    equippedCharms: [],
    gamePhase: 'playing'
  });

  // Advance to next deadline
  const advanceDeadline = useCallback(() => {
    setState(prev => {
      const newDeadline = prev.currentDeadline + 1;
      const newDebt = calculations.calculateDebt(newDeadline);
      
      return {
        ...prev,
        currentDeadline: newDeadline,
        debt: newDebt,
        gamePhase: 'playing'
      };
    });
  }, []);

  // Pay debt
  const payDebt = useCallback((coins: number): boolean => {
    if (coins >= state.debt) {
      setState(prev => ({
        ...prev,
        bankedCoins: prev.bankedCoins + (coins - prev.debt),
        gamePhase: 'shop'
      }));
      return true;
    }
    return false;
  }, [state.debt]);

  // Add tickets
  const addTickets = useCallback((amount: number) => {
    setState(prev => ({
      ...prev,
      tickets: prev.tickets + amount
    }));
  }, []);

  // Spend tickets
  const spendTickets = useCallback((amount: number): boolean => {
    if (state.tickets >= amount) {
      setState(prev => ({
        ...prev,
        tickets: prev.tickets - amount
      }));
      return true;
    }
    return false;
  }, [state.tickets]);

  // Bank coins
  const bankCoins = useCallback((amount: number) => {
    setState(prev => ({
      ...prev,
      bankedCoins: prev.bankedCoins + amount
    }));
  }, []);

  // Calculate and apply interest
  const applyInterest = useCallback((interestRate: number = 0.1) => {
    setState(prev => {
      const interestEarned = calculations.calculateInterest(prev.bankedCoins, interestRate);
      return {
        ...prev,
        interest: prev.interest + interestEarned,
        bankedCoins: prev.bankedCoins + interestEarned
      };
    });
  }, []);


  // Equip charm
  const equipCharm = useCallback((charmId: string): boolean => {
    if (state.equippedCharms.length < state.maxCharmSlots) {
      setState(prev => ({
        ...prev,
        equippedCharms: [...prev.equippedCharms, charmId]
      }));
      return true;
    }
    return false;
  }, [state.equippedCharms.length, state.maxCharmSlots]);

  // Unequip charm
  const unequipCharm = useCallback((charmId: string) => {
    setState(prev => ({
      ...prev,
      equippedCharms: prev.equippedCharms.filter(id => id !== charmId)
    }));
  }, []);

  // Set game phase
  const setGamePhase = useCallback((phase: GameState['gamePhase']) => {
    setState(prev => ({
      ...prev,
      gamePhase: phase
    }));
  }, []);

  // Game over
  const gameOver = useCallback(() => {
    setState(prev => ({
      ...prev,
      gamePhase: 'game_over'
    }));
  }, []);

  // Victory
  const victory = useCallback(() => {
    setState(prev => ({
      ...prev,
      gamePhase: 'victory'
    }));
  }, []);

  // Reset game
  const resetGame = useCallback(() => {
    setState({
      currentDeadline: 1,
      debt: 100,
      tickets: 0,
      bankedCoins: 0,
      interest: 0,
      charmSlots: 3,
      maxCharmSlots: 3,
      equippedCharms: [],
      gamePhase: 'playing'
    });
  }, []);

  return {
    state,
    advanceDeadline,
    payDebt,
    addTickets,
    spendTickets,
    bankCoins,
    applyInterest,
    equipCharm,
    unequipCharm,
    setGamePhase,
    gameOver,
    victory,
    resetGame
  };
};
