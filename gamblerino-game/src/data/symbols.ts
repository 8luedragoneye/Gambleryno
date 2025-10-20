// Symbol definitions and base probabilities
export interface Symbol {
  name: string;
  weight: number;
  baseValue: number;
  emoji: string;
  color: string;
}

export interface SymbolModifier {
  name: string;
  effect: string;
  probability: number;
  valueMultiplier?: number;
  ticketBonus?: number;
}

export const SYMBOLS: Symbol[] = [
  {
    name: 'lemon',
    weight: 1.3,
    baseValue: 10,
    emoji: '🍋',
    color: '#FFD700'
  },
  {
    name: 'cherry',
    weight: 1.3,
    baseValue: 10,
    emoji: '🍒',
    color: '#FF0000'
  },
  {
    name: 'clover',
    weight: 1.0,
    baseValue: 15,
    emoji: '🍀',
    color: '#00FF00'
  },
  {
    name: 'bell',
    weight: 1.0,
    baseValue: 15,
    emoji: '🔔',
    color: '#FFA500'
  },
  {
    name: 'diamond',
    weight: 0.8,
    baseValue: 25,
    emoji: '💎',
    color: '#00BFFF'
  },
  {
    name: 'treasure',
    weight: 0.8,
    baseValue: 25,
    emoji: '💰',
    color: '#FFD700'
  },
  {
    name: 'seven',
    weight: 0.5,
    baseValue: 50,
    emoji: '7️⃣',
    color: '#FF69B4'
  }
];

export const SYMBOL_MODIFIERS: SymbolModifier[] = [
  {
    name: 'golden',
    effect: 'Extra value boost',
    probability: 0.2,
    valueMultiplier: 2
  },
  {
    name: 'ticket',
    effect: 'Earns tickets',
    probability: 0.15,
    ticketBonus: 1
  },
  {
    name: 'token',
    effect: 'Special effect',
    probability: 0.05
  }
];

// Calculate total weight for probability calculations
export const TOTAL_WEIGHT = SYMBOLS.reduce((sum, symbol) => sum + symbol.weight, 0);

// Get symbol by name
export const getSymbolByName = (name: string): Symbol | undefined => {
  return SYMBOLS.find(symbol => symbol.name === name);
};

// Get weighted random symbol
export const getRandomSymbol = (): Symbol => {
  const random = Math.random() * TOTAL_WEIGHT;
  let currentWeight = 0;
  
  for (const symbol of SYMBOLS) {
    currentWeight += symbol.weight;
    if (random <= currentWeight) {
      return symbol;
    }
  }
  
  return SYMBOLS[SYMBOLS.length - 1]; // Fallback
};
