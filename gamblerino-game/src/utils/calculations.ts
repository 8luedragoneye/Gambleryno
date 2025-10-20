// Game calculation utilities
export const calculations = {
  // Calculate debt for a given deadline level
  calculateDebt: (deadline: number): number => {
    if (deadline <= 9) {
      // Fixed amounts for first 9 deadlines
      const fixedDebts = [10, 15, 20, 25, 30, 40, 50, 60, 75];
      return fixedDebts[deadline - 1] || 75;
    } else {
      // Exponential growth after deadline 9
      return Math.floor(75 * Math.pow(1.5, deadline - 9));
    }
  },

  // Calculate interest on banked coins
  calculateInterest: (bankedCoins: number, interestRate: number = 0.1): number => {
    return Math.floor(bankedCoins * interestRate);
  },

  // Calculate restock cost based on deadline
  calculateRestockCost: (deadline: number, baseCost: number = 50): number => {
    return baseCost + (deadline - 1) * 25;
  },

  // Calculate luck value from various sources
  calculateLuck: (baseLuck: number, spontaneousLuck: number = 0): number => {
    return baseLuck + spontaneousLuck;
  },

  // Calculate spontaneous luck based on spin count and misses
  calculateSpontaneousLuck: (spinCount: number, missStreak: number): number => {
    let spontaneous = 0;
    
    // ILS (Initial Luck Spike) - first debt bonus
    if (spinCount <= 3) {
      spontaneous += 3;
    }
    
    // OLS (Occasional Luck Spike) - every 10 spins
    if (spinCount % 10 === 0) {
      spontaneous += 2;
    }
    
    // Pity system - scales with miss streak
    if (missStreak >= 3) {
      spontaneous += Math.min(missStreak * 2, 10);
    }
    
    return spontaneous;
  },

  // Calculate charm slot limit
  calculateCharmSlots: (baseSlots: number = 3, upgrades: number = 0): number => {
    return baseSlots + upgrades;
  },


  // Calculate spin limit for deadline
  calculateSpinLimit: (baseSpins: number = 5, bonuses: number = 0): number => {
    return baseSpins + bonuses;
  },

  // Calculate multiplier scaling
  calculateMultiplier: (baseMultiplier: number, bonuses: number[]): number => {
    return baseMultiplier + bonuses.reduce((sum, bonus) => sum + bonus, 0);
  },

  // Calculate probability with modifications
  calculateProbability: (baseProbability: number, modifications: number[]): number => {
    let result = baseProbability;
    for (const mod of modifications) {
      result += mod;
    }
    return Math.max(0, Math.min(1, result)); // Clamp between 0 and 1
  },

  // Calculate ticket generation
  calculateTickets: (baseTickets: number, modifiers: number[]): number => {
    return baseTickets + modifiers.reduce((sum, mod) => sum + mod, 0);
  },

  // Calculate charm cost with discounts
  calculateCharmCost: (baseCost: number, discount: number = 0): number => {
    return Math.max(1, Math.floor(baseCost * (1 - discount)));
  },

  // Calculate pattern value with bonuses
  calculatePatternValue: (baseValue: number, symbolMultiplier: number, patternMultiplier: number): number => {
    return baseValue * symbolMultiplier * patternMultiplier;
  },

  // Calculate manifestation bonus
  calculateManifestation: (baseWeight: number, manifestations: number): number => {
    return baseWeight + (manifestations * 0.8);
  },

  // Calculate halving effect
  calculateHalving: (currentWeight: number, halvings: number): number => {
    return currentWeight / Math.pow(2, halvings);
  }
};

// Game state validation
export const validation = {
  // Validate grid dimensions
  isValidGrid: (grid: string[][]): boolean => {
    return grid.length === 3 && grid.every(row => row.length === 3);
  },

  // Validate charm slot usage
  isValidCharmSlot: (equippedCharms: any[], maxSlots: number): boolean => {
    return equippedCharms.length <= maxSlots;
  },

  // Validate currency amounts
  isValidCurrency: (amount: number): boolean => {
    return amount >= 0 && Number.isInteger(amount);
  },

  // Validate probability values
  isValidProbability: (probability: number): boolean => {
    return probability >= 0 && probability <= 1;
  },

  // Validate deadline number
  isValidDeadline: (deadline: number): boolean => {
    return deadline >= 1 && Number.isInteger(deadline);
  }
};
