import { PhoneCall, PhoneCallOption, getRandomPhoneCall } from '../data/phoneCalls';

export interface PhoneCallState {
  lastCallType: 'normal' | 'evil' | 'holy' | null;
  evilCallScheduled: boolean;
  holyCallScheduled: boolean;
  divineProtection: number; // Rounds immune to 666
}

export interface PhoneCallResult {
  call: PhoneCall;
  selectedOptions: PhoneCallOption[];
  effects: PhoneCallEffect[];
}

export interface PhoneCallEffect {
  type: 'spins' | 'luck' | 'multiplier' | 'coins' | 'tickets' | 'charm_slot' | 'interest' | 'manifestation' | 'protection' | 'curse';
  value: number;
  duration?: number; // For temporary effects
  permanent?: boolean;
  description: string;
}

export class PhoneCallSystem {
  private state: PhoneCallState;

  constructor() {
    this.state = {
      lastCallType: null,
      evilCallScheduled: false,
      holyCallScheduled: false,
      divineProtection: 0
    };
  }

  // Trigger a phone call (simplified - only normal calls)
  triggerPhoneCall(): PhoneCallResult | null {
    const call = getRandomPhoneCall('normal');
    this.state.lastCallType = 'normal';

    return {
      call,
      selectedOptions: [],
      effects: []
    };
  }

  // Process selected options and return effects
  processPhoneCallOptions(call: PhoneCall, selectedOptionIds: string[]): PhoneCallEffect[] {
    const effects: PhoneCallEffect[] = [];
    const selectedOptions = call.options.filter(option => 
      selectedOptionIds.includes(option.id)
    );

    for (const option of selectedOptions) {
      const effect = this.convertOptionToEffect(option);
      if (effect) {
        effects.push(effect);
      }
    }

    return effects;
  }

  // Convert phone call option to effect
  private convertOptionToEffect(option: PhoneCallOption): PhoneCallEffect | null {
    const effect = option.effect.toLowerCase();
    const value = option.value;

    // Spins effects
    if (effect.includes('spins')) {
      return {
        type: 'spins',
        value: value,
        description: option.effect
      };
    }

    // Luck effects
    if (effect.includes('luck')) {
      const duration = effect.includes('next') ? 5 : undefined;
      const permanent = effect.includes('permanent');
      return {
        type: 'luck',
        value: value,
        duration: duration,
        permanent: permanent,
        description: option.effect
      };
    }

    // Multiplier effects
    if (effect.includes('multiplier')) {
      const multiplierType = effect.includes('symbol') ? 'multiplier' : 'multiplier';
      return {
        type: multiplierType,
        value: value,
        description: option.effect
      };
    }

    // Coin effects
    if (effect.includes('coin')) {
      return {
        type: 'coins',
        value: value,
        description: option.effect
      };
    }

    // Ticket effects
    if (effect.includes('ticket')) {
      return {
        type: 'tickets',
        value: value,
        description: option.effect
      };
    }


    // Charm slot effects
    if (effect.includes('charm slot')) {
      return {
        type: 'charm_slot',
        value: value,
        permanent: true,
        description: option.effect
      };
    }

    // Interest effects
    if (effect.includes('interest')) {
      return {
        type: 'interest',
        value: value,
        permanent: true,
        description: option.effect
      };
    }

    // Manifestation effects
    if (effect.includes('manifestation')) {
      return {
        type: 'manifestation',
        value: value,
        description: option.effect
      };
    }

    // Protection effects
    if (effect.includes('immune') || effect.includes('protection')) {
      return {
        type: 'protection',
        value: value,
        description: option.effect
      };
    }

    // Curse effects
    if (effect.includes('curse') || effect.includes('cursed')) {
      return {
        type: 'curse',
        value: value,
        description: option.effect
      };
    }

    return null;
  }

  // These methods are kept for compatibility but no longer used
  scheduleEvilCall(): void {
    // No longer used - phone calls are random at deadline start
  }

  scheduleHolyCall(): void {
    // No longer used - phone calls are random at deadline start
  }

  shouldTrigger666(): boolean {
    // No longer used - 666 doesn't trigger phone calls
    return false;
  }

  addDivineProtection(rounds: number): void {
    // No longer used - divine protection system removed
  }

  // Get current state
  getState(): PhoneCallState {
    return { ...this.state };
  }

  // Reset for new deadline
  resetForNewDeadline(): void {
    // No longer needed - phone calls are always triggered at deadline start
  }

  // Phone calls now always trigger at deadline start
  shouldTriggerAtDeadlineStart(): boolean {
    return true; // Always trigger at deadline start
  }

  // Get call type color for UI
  getCallTypeColor(type: 'normal' | 'evil' | 'holy'): string {
    switch (type) {
      case 'normal': return '#4ecdc4';
      case 'evil': return '#ff6b6b';
      case 'holy': return '#ffd700';
      default: return '#9ca3af';
    }
  }

  // Get call type icon for UI
  getCallTypeIcon(type: 'normal' | 'evil' | 'holy'): string {
    switch (type) {
      case 'normal': return '📞';
      case 'evil': return '👹';
      case 'holy': return '👼';
      default: return '📞';
    }
  }
}
