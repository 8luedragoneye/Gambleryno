import { Charm, getCharmById } from '../data/charms';
import { random } from '../utils/random';

export interface CharmEffect {
  type: 'spins' | 'luck' | 'multiplier' | 'interest' | 'tickets' | 'trigger' | 'pattern_boost' | 'grid_size';
  value: number;
  condition?: string;
  probability?: number;
  gridSizeModifier?: { rows: number; cols: number };
}

export interface ActiveCharm {
  charm: Charm;
  usesRemaining?: number;
  isActive: boolean;
}

export class CharmSystem {
  private equippedCharms: ActiveCharm[] = [];
  private maxSlots: number = 3;

  constructor(maxSlots: number = 3) {
    this.maxSlots = maxSlots;
  }

  // Equip a charm
  equipCharm(charmId: string): boolean {
    if (this.equippedCharms.length >= this.maxSlots) {
      return false;
    }

    const charm = getCharmById(charmId);
    if (!charm) {
      return false;
    }

    // Check if already equipped
    if (this.equippedCharms.some(ac => ac.charm.id === charmId)) {
      return false;
    }

    const activeCharm: ActiveCharm = {
      charm,
      usesRemaining: charm.maxUses,
      isActive: true
    };

    this.equippedCharms.push(activeCharm);
    return true;
  }

  // Unequip a charm
  unequipCharm(charmId: string): boolean {
    const index = this.equippedCharms.findIndex(ac => ac.charm.id === charmId);
    if (index === -1) {
      return false;
    }

    this.equippedCharms.splice(index, 1);
    return true;
  }

  // Get equipped charms
  getEquippedCharms(): ActiveCharm[] {
    return [...this.equippedCharms];
  }

  // Get charm effects for a specific event
  getEffectsForEvent(event: string): CharmEffect[] {
    const effects: CharmEffect[] = [];

    for (const activeCharm of this.equippedCharms) {
      if (!activeCharm.isActive) continue;

      const charm = activeCharm.charm;
      const effect = this.getCharmEffect(charm, event);
      
      if (effect) {
        effects.push(effect);
      }
    }

    return effects;
  }

  // Get charm effect based on type and event
  private getCharmEffect(charm: Charm, event: string): CharmEffect | null {
    switch (charm.effectType) {
      case 'passive':
        return this.getPassiveEffect(charm, event);
      
      case 'random_trigger':
        return this.getRandomTriggerEffect(charm, event);
      
      case 'red_button':
        return this.getRedButtonEffect(charm, event);
      
      case 'pattern_triggered':
        return this.getPatternTriggeredEffect(charm, event);
      
      default:
        return null;
    }
  }

  // Get passive effects
  private getPassiveEffect(charm: Charm, event: string): CharmEffect | null {
    const effect = charm.effect.toLowerCase();
    
    // Grid size effects
    if (charm.gridSizeModifier && event === 'equip') {
      return { 
        type: 'grid_size', 
        value: 1, 
        gridSizeModifier: charm.gridSizeModifier 
      };
    }
    
    // Spins effects
    if (effect.includes('+2 spins every round') && event === 'round_start') {
      return { type: 'spins', value: 2 };
    }
    
    // Interest effects
    if (effect.includes('+5% interest')) {
      return { type: 'interest', value: 0.05 };
    }
    
    if (effect.includes('+15% interest')) {
      return { type: 'interest', value: 0.15 };
    }
    
    // Luck effects
    if (effect.includes('+7 luck on final spin') && event === 'final_spin') {
      return { type: 'luck', value: 7 };
    }
    
    if (effect.includes('+5 luck after two dead spins') && event === 'dead_spin') {
      return { type: 'luck', value: 5 };
    }
    
    // Multiplier effects
    if (effect.includes('+1 symbols multiplier')) {
      return { type: 'multiplier', value: 1, condition: 'symbols' };
    }
    
    // Ticket effects
    if (effect.includes('+2% ticket modifier chance')) {
      return { type: 'tickets', value: 0.02 };
    }
    
    
    return null;
  }

  // Get random trigger effects
  private getRandomTriggerEffect(charm: Charm, event: string): CharmEffect | null {
    if (event !== 'spin') return null;
    
    const effect = charm.effect.toLowerCase();
    const triggerChance = charm.triggerChance || 0;
    
    if (!random.boolean(triggerChance)) {
      return null;
    }
    
    // Fake Coin effect
    if (effect.includes('+1 spin and +4 luck')) {
      return { type: 'trigger', value: 1, condition: 'fake_coin' };
    }
    
    // Red Pepper effect
    if (effect.includes('+5 luck')) {
      return { type: 'luck', value: 5 };
    }
    
    // Green Pepper effect
    if (effect.includes('+7 luck')) {
      return { type: 'luck', value: 7 };
    }
    
    return null;
  }

  // Get red button effects
  private getRedButtonEffect(charm: Charm, event: string): CharmEffect | null {
    if (event !== 'red_button') return null;
    
    const effect = charm.effect.toLowerCase();
    
    // Red Shiny Rock effect
    if (effect.includes('+4 luck next spin')) {
      return { type: 'luck', value: 4, condition: 'next_spin' };
    }
    
    // Picture charms effects
    if (effect.includes('+2') && effect.includes('manifestation')) {
      const symbol = this.extractSymbolFromEffect(effect);
      if (symbol) {
        return { type: 'pattern_boost', value: 2, condition: symbol };
      }
    }
    
    return null;
  }

  // Get pattern triggered effects
  private getPatternTriggeredEffect(charm: Charm, event: string): CharmEffect | null {
    if (event !== 'pattern_match') return null;
    
    const effect = charm.effect.toLowerCase();
    
    // Stain effect
    if (effect.includes('boosts all pattern values when 4+ symbols trigger')) {
      return { type: 'pattern_boost', value: 1.5, condition: '4+_patterns' };
    }
    
    // Shrooms effect
    if (effect.includes('doubles all symbol values when 3+ patterns trigger')) {
      return { type: 'multiplier', value: 2, condition: '3+_patterns' };
    }
    
    // Lucky Cat effect
    if (effect.includes('earn coins equal to current interest')) {
      return { type: 'trigger', value: 1, condition: 'interest_payout' };
    }
    
    // Pentacle effect
    if (effect.includes('increases +1 when 5+ patterns trigger')) {
      return { type: 'multiplier', value: 1, condition: '5+_patterns' };
    }
    
    return null;
  }

  // Extract symbol name from effect text
  private extractSymbolFromEffect(effect: string): string | null {
    const symbols = ['lemon', 'cherry', 'clover', 'bell', 'diamond', 'coins', 'seven'];
    for (const symbol of symbols) {
      if (effect.includes(symbol)) {
        return symbol;
      }
    }
    return null;
  }

  // Process charm effects and return modified values
  processEffects(event: string, baseValues: any): any {
    const effects = this.getEffectsForEvent(event);
    const result = { ...baseValues };

    for (const effect of effects) {
      switch (effect.type) {
        case 'spins':
          result.spins = (result.spins || 0) + effect.value;
          break;
        
        case 'luck':
          result.luck = (result.luck || 0) + effect.value;
          break;
        
        case 'multiplier':
          if (effect.condition === 'symbols') {
            result.symbolsMultiplier = (result.symbolsMultiplier || 1) + effect.value;
          } else if (effect.condition === 'patterns') {
            result.patternsMultiplier = (result.patternsMultiplier || 1) + effect.value;
          } else if (effect.condition === '3+_patterns') {
            result.symbolsMultiplier = (result.symbolsMultiplier || 1) * effect.value;
          }
          break;
        
        case 'interest':
          result.interestRate = (result.interestRate || 0.1) + effect.value;
          break;
        
        case 'tickets':
          result.ticketChance = (result.ticketChance || 0) + effect.value;
          break;
        
        
        case 'trigger':
          if (effect.condition === 'fake_coin') {
            result.spins = (result.spins || 0) + 1;
            result.luck = (result.luck || 0) + 4;
          }
          break;
        
        case 'pattern_boost':
          if (effect.condition === '4+_patterns') {
            result.patternMultiplier = (result.patternMultiplier || 1) * effect.value;
          }
          break;
        
        case 'grid_size':
          if (effect.gridSizeModifier) {
            result.gridSizeModifier = effect.gridSizeModifier;
          }
          break;
      }
    }

    return result;
  }

  // Check if charm can be equipped
  canEquipCharm(charmId: string): boolean {
    if (this.equippedCharms.length >= this.maxSlots) {
      return false;
    }
    
    return !this.equippedCharms.some(ac => ac.charm.id === charmId);
  }

  // Get available slots
  getAvailableSlots(): number {
    return this.maxSlots - this.equippedCharms.length;
  }

  // Update max slots
  updateMaxSlots(newMaxSlots: number): void {
    this.maxSlots = newMaxSlots;
    
    // Remove excess charms if needed
    if (this.equippedCharms.length > newMaxSlots) {
      this.equippedCharms = this.equippedCharms.slice(0, newMaxSlots);
    }
  }
}
