// Phone Call events and choices
export interface PhoneCallOption {
  id: string;
  text: string;
  effect: string;
  value: number;
  type: 'positive' | 'negative' | 'neutral';
}

export interface PhoneCall {
  id: string;
  type: 'normal' | 'evil' | 'holy';
  title: string;
  description: string;
  options: PhoneCallOption[];
  maxPicks: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export const PHONE_CALLS: PhoneCall[] = [
  // Normal Call - Simple effects
  {
    id: 'normal_1',
    type: 'normal',
    title: 'Friendly Voice',
    description: 'A warm voice offers you some help...',
    rarity: 'common',
    maxPicks: 1,
    options: [
      {
        id: 'ticket_bonus',
        text: 'Ticket Bonus',
        effect: '+3 tickets',
        value: 3,
        type: 'positive'
      },
      {
        id: 'coin_bonus',
        text: 'Coin Bonus',
        effect: '+50 coins',
        value: 50,
        type: 'positive'
      },
      {
        id: 'luck_boost',
        text: 'Luck Boost',
        effect: '+5 permanent luck',
        value: 5,
        type: 'positive'
      }
    ]
  }
];

// Rarity weights for phone call generation
export const PHONE_CALL_RARITY_WEIGHTS = {
  common: 50,
  uncommon: 30,
  rare: 15,
  epic: 4,
  legendary: 1
};

// Get phone call by ID
export const getPhoneCallById = (id: string): PhoneCall | undefined => {
  return PHONE_CALLS.find(call => call.id === id);
};

// Get phone calls by type
export const getPhoneCallsByType = (type: 'normal' | 'evil' | 'holy'): PhoneCall[] => {
  return PHONE_CALLS.filter(call => call.type === type);
};

// Get random phone call by type and rarity
export const getRandomPhoneCall = (type: 'normal' | 'evil' | 'holy'): PhoneCall => {
  const callsOfType = getPhoneCallsByType(type);
  const totalWeight = callsOfType.reduce((sum, call) => {
    return sum + (PHONE_CALL_RARITY_WEIGHTS[call.rarity] || 1);
  }, 0);

  const randomValue = Math.random() * totalWeight;
  let currentWeight = 0;

  for (const call of callsOfType) {
    currentWeight += PHONE_CALL_RARITY_WEIGHTS[call.rarity] || 1;
    if (randomValue <= currentWeight) {
      return call;
    }
  }

  return callsOfType[0]; // Fallback
};
