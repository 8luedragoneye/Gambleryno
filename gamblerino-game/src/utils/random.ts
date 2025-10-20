// Random number generation utilities
export const random = {
  // Generate random integer between min and max (inclusive)
  int: (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  // Generate random float between min and max
  float: (min: number, max: number): number => {
    return Math.random() * (max - min) + min;
  },

  // Weighted random selection from array
  weighted: <T>(items: T[], weights: number[]): T => {
    if (items.length !== weights.length) {
      throw new Error('Items and weights arrays must have the same length');
    }

    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < items.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return items[i];
      }
    }

    return items[items.length - 1]; // Fallback
  },

  // Random boolean with given probability
  boolean: (probability: number = 0.5): boolean => {
    return Math.random() < probability;
  },

  // Shuffle array in place
  shuffle: <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  // Pick random element from array
  pick: <T>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)];
  },

  // Pick multiple random elements from array
  pickMultiple: <T>(array: T[], count: number): T[] => {
    const shuffled = random.shuffle(array);
    return shuffled.slice(0, Math.min(count, array.length));
  },

  // Generate random ID
  id: (length: number = 8): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
};

// Probability helpers
export const probability = {
  // Check if event occurs with given probability
  occurs: (chance: number): boolean => {
    return Math.random() < chance;
  },

  // Roll dice (1 to sides)
  dice: (sides: number = 6): number => {
    return random.int(1, sides);
  },

  // Roll multiple dice
  diceMultiple: (count: number, sides: number = 6): number[] => {
    return Array.from({ length: count }, () => random.int(1, sides));
  }
};
