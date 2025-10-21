// Lucky Charms data and effects
export interface Charm {
  id: string;
  name: string;
  cost: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'ultra_legendary';
  effect: string;
  effectType: 'passive' | 'random_trigger' | 'red_button' | 'pattern_triggered';
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
    id: 'stain',
    name: 'Stain',
    cost: 1,
    rarity: 'common',
    effect: 'Boosts all pattern values when 4+ symbols trigger',
    effectType: 'pattern_triggered',
    description: 'Huge mid/late scaling, synergizes with interest.',
    tier: 'S'
  },
  {
    id: 'shrooms',
    name: 'Shrooms',
    cost: 2,
    rarity: 'uncommon',
    effect: 'Doubles all symbol values when 3+ patterns trigger',
    effectType: 'pattern_triggered',
    description: 'Insane payoffs with extra spins.',
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
  {
    id: 'horseshoe',
    name: 'Horseshoe',
    cost: 3,
    rarity: 'rare',
    effect: 'Doubles random trigger effects',
    effectType: 'passive',
    description: 'Passive scaling with other random triggers.',
    tier: 'S'
  },
  {
    id: 'lucky_cat',
    name: 'Lucky Cat',
    cost: 1,
    rarity: 'common',
    effect: 'When 3+ patterns trigger, earn coins equal to current interest',
    effectType: 'pattern_triggered',
    description: 'Interest build synergy.',
    tier: 'S'
  },
  {
    id: 'pentacle',
    name: 'Pentacle',
    cost: 3,
    rarity: 'rare',
    effect: '+1 Symbols Multiplier, increases +1 when 5+ patterns trigger',
    effectType: 'pattern_triggered',
    description: 'Scaling multiplier.',
    tier: 'S'
  },
  {
    id: 'cloverpot',
    name: 'Cloverpot',
    cost: 2,
    rarity: 'uncommon',
    effect: 'Earn 1 ticket per 3 owned at deadline end (max 10)',
    effectType: 'passive',
    description: 'Compounding economy.',
    tier: 'S'
  },
  {
    id: 'clover_voucher',
    name: 'Clover Voucher',
    cost: 2,
    rarity: 'uncommon',
    effect: 'Instant +4 tickets',
    effectType: 'passive',
    description: 'No slot taken. Early spike.',
    tier: 'S'
  },
  {
    id: 'car_battery',
    name: 'Car Battery',
    cost: 1,
    rarity: 'common',
    effect: 'Enables red-button charm loops',
    effectType: 'passive',
    description: 'No slot, enables loops.',
    tier: 'S'
  },

  // A-Tier Charms
  {
    id: 'raging_capitalist',
    name: 'Raging Capitalist',
    cost: 4,
    rarity: 'rare',
    effect: '+2% ticket modifier chance on symbols, +1% per charm bought (max 25%)',
    effectType: 'passive',
    description: 'Scaling economy.',
    tier: 'A'
  },
  {
    id: 'stonks',
    name: 'Stonks',
    cost: 2,
    rarity: 'uncommon',
    effect: '+5% interest',
    effectType: 'passive',
    description: 'Permanent passive boost.',
    tier: 'A'
  },
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
    id: 'red_shiny_rock',
    name: 'Red Shiny Rock',
    cost: 1,
    rarity: 'common',
    effect: 'Red Button: +4 Luck next spin',
    effectType: 'red_button',
    description: 'Button synergy.',
    tier: 'A'
  },

  // B-Tier Charms
  {
    id: 'tarot_deck',
    name: 'Tarot Deck',
    cost: 1,
    rarity: 'common',
    effect: 'Symbols Multiplier +0, +1 if charm triggers in spin; resets if none',
    effectType: 'random_trigger',
    triggerChance: 0.3,
    description: 'Conditional scaling.',
    tier: 'B'
  },
  {
    id: 'nuclear_button',
    name: 'Nuclear Button',
    cost: 3,
    rarity: 'rare',
    effect: 'Red-button charms trigger extra',
    effectType: 'passive',
    description: 'Reduces slot by 1. Synergy penalty.',
    tier: 'B'
  },
  {
    id: 'golden_lemon',
    name: 'Golden Lemon',
    cost: 2,
    rarity: 'uncommon',
    effect: '+20% Golden on Lemon',
    effectType: 'passive',
    description: 'Lemon build only.',
    tier: 'B'
  },
  {
    id: 'golden_cherry',
    name: 'Golden Cherry',
    cost: 2,
    rarity: 'uncommon',
    effect: '+20% Golden on Cherry',
    effectType: 'passive',
    description: 'Economy boost.',
    tier: 'B'
  },
  {
    id: 'lost_briefcase',
    name: 'Lost Briefcase',
    cost: 2,
    rarity: 'uncommon',
    effect: 'Instant 30% current debt relief',
    effectType: 'passive',
    description: 'No slot, one-time save.',
    tier: 'B'
  },

  // C-Tier Charms

  // Grid Size Modifying Charms
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
  },
  {
    id: 'temporary_expansion',
    name: 'Temporary Expansion',
    cost: 2,
    rarity: 'uncommon',
    effect: '+2 rows and +2 columns for 3 spins',
    effectType: 'passive',
    gridSizeModifier: { rows: 2, cols: 2 },
    description: 'Temporary grid expansion',
    tier: 'B'
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
