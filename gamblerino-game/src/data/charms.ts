// Lucky Charms data and effects
export interface Charm {
  id: string;
  name: string;
  cost: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'ultra_legendary';
  effect: string;
  effectType: 'passive' | 'random_trigger';
  triggerChance?: number;
  maxUses?: number;
  description: string;
  tier: 'S' | 'A' | 'B' | 'C';
  gridSizeModifier?: { rows: number; cols: number };
}

export const CHARMS: Charm[] = [
  // S-Tier Charms
  {
    id: 'cat_food',
    name: 'Cat Food',
    cost: 4,
    rarity: 'rare',
    effect: '+2 spins every round',
    effectType: 'passive',
    description: 'Universal utility, prevents bad chains, scales late-game.',
    tier: 'S'
  },
  {
    id: 'fake_coin',
    name: 'Fake Coin',
    cost: 2,
    rarity: 'uncommon',
    effect: 'Random trigger: +1 spin and +4 Luck',
    effectType: 'random_trigger',
    triggerChance: 0.1,
    description: 'Jackpot synergy.',
    tier: 'S'
  },

  // A-Tier Charms
  {
    id: 'hamsa',
    name: 'Hamsa',
    cost: 3,
    rarity: 'rare',
    effect: '+7 Luck on final spin',
    effectType: 'passive',
    description: 'Luck build essential.',
    tier: 'A'
  },
  {
    id: 'toy_train',
    name: 'Toy Train',
    cost: 2,
    rarity: 'uncommon',
    effect: '+5 Luck after two dead spins',
    effectType: 'passive',
    description: 'Safety net.',
    tier: 'A'
  },
  {
    id: 'expansive_vision',
    name: 'Expansive Vision',
    cost: 3,
    rarity: 'rare',
    effect: '+1 row and +1 column to grid',
    effectType: 'passive',
    gridSizeModifier: { rows: 1, cols: 1 },
    description: 'Permanently expands your grid size',
    tier: 'A'
  },

  // B-Tier Charms
  {
    id: 'wide_screen',
    name: 'Wide Screen',
    cost: 2,
    rarity: 'uncommon',
    effect: '+3 columns to grid',
    effectType: 'passive',
    gridSizeModifier: { rows: 0, cols: 3 },
    description: 'Makes your grid much wider',
    tier: 'B'
  },
  {
    id: 'tall_tower',
    name: 'Tall Tower',
    cost: 2,
    rarity: 'uncommon',
    effect: '+3 rows to grid',
    effectType: 'passive',
    gridSizeModifier: { rows: 3, cols: 0 },
    description: 'Makes your grid much taller',
    tier: 'B'
  },

  // C-Tier Charms
  {
    id: 'mini_grid',
    name: 'Mini Grid',
    cost: 1,
    rarity: 'common',
    effect: '-1 row and -1 column (risk/reward)',
    effectType: 'passive',
    gridSizeModifier: { rows: -1, cols: -1 },
    description: 'Smaller grid = easier patterns but less potential',
    tier: 'C'
  }
];

// Rarity weights for shop generation
export const RARITY_WEIGHTS = {
  common: 50,
  uncommon: 30,
  rare: 15,
  epic: 4,
  legendary: 1,
  ultra_legendary: 0.1
};

// Get charm by ID
export const getCharmById = (id: string): Charm | undefined => {
  return CHARMS.find(charm => charm.id === id);
};

// Get charms by tier
export const getCharmsByTier = (tier: string): Charm[] => {
  return CHARMS.filter(charm => charm.tier === tier);
};

// Get random charm by rarity
export const getRandomCharmByRarity = (rarity: keyof typeof RARITY_WEIGHTS): Charm => {
  const charmsOfRarity = CHARMS.filter(charm => charm.rarity === rarity);
  return charmsOfRarity[Math.floor(Math.random() * charmsOfRarity.length)];
};
