import { useState, useCallback } from 'react';
import { CharmSystem, ActiveCharm } from '../systems/charmSystem';
import { getCharmById } from '../data/charms';

export interface CharmState {
  equippedCharms: string[];
  maxSlots: number;
  ownedCharms: string[];
  charmSystem: CharmSystem;
}

export const useCharms = (initialMaxSlots: number = 3) => {
  const [charmSystem] = useState(() => new CharmSystem(initialMaxSlots));
  const [ownedCharms, setOwnedCharms] = useState<string[]>([]);

  // Equip a charm
  const equipCharm = useCallback((charmId: string): boolean => {
    if (charmSystem.equipCharm(charmId)) {
      return true;
    }
    return false;
  }, [charmSystem]);

  // Unequip a charm
  const unequipCharm = useCallback((charmId: string): boolean => {
    return charmSystem.unequipCharm(charmId);
  }, [charmSystem]);

  // Add charm to owned collection
  const addOwnedCharm = useCallback((charmId: string) => {
    setOwnedCharms(prev => {
      if (!prev.includes(charmId)) {
        return [...prev, charmId];
      }
      return prev;
    });
  }, []);

  // Remove charm from owned collection
  const removeOwnedCharm = useCallback((charmId: string) => {
    setOwnedCharms(prev => prev.filter(id => id !== charmId));
  }, []);

  // Get equipped charms
  const getEquippedCharms = useCallback((): ActiveCharm[] => {
    return charmSystem.getEquippedCharms();
  }, [charmSystem]);

  // Get owned charms
  const getOwnedCharms = useCallback((): string[] => {
    return [...ownedCharms];
  }, [ownedCharms]);

  // Check if charm is owned
  const isCharmOwned = useCallback((charmId: string): boolean => {
    return ownedCharms.includes(charmId);
  }, [ownedCharms]);

  // Check if charm is equipped
  const isCharmEquipped = useCallback((charmId: string): boolean => {
    return charmSystem.getEquippedCharms().some(ac => ac.charm.id === charmId);
  }, [charmSystem]);

  // Check if charm can be equipped
  const canEquipCharm = useCallback((charmId: string): boolean => {
    return charmSystem.canEquipCharm(charmId);
  }, [charmSystem]);

  // Get available slots
  const getAvailableSlots = useCallback((): number => {
    return charmSystem.getAvailableSlots();
  }, [charmSystem]);

  // Update max slots
  const updateMaxSlots = useCallback((newMaxSlots: number) => {
    charmSystem.updateMaxSlots(newMaxSlots);
  }, [charmSystem]);

  // Process charm effects for an event
  const processCharmEffects = useCallback((event: string, baseValues: any) => {
    return charmSystem.processEffects(event, baseValues);
  }, [charmSystem]);

  // Get charm effects for an event
  const getCharmEffects = useCallback((event: string) => {
    return charmSystem.getEffectsForEvent(event);
  }, [charmSystem]);

  // Get charm by ID
  const getCharm = useCallback((charmId: string) => {
    return getCharmById(charmId);
  }, []);

  // Get state for display
  const getState = useCallback((): CharmState => {
    return {
      equippedCharms: charmSystem.getEquippedCharms().map(ac => ac.charm.id),
      maxSlots: charmSystem.getAvailableSlots() + charmSystem.getEquippedCharms().length,
      ownedCharms: [...ownedCharms],
      charmSystem
    };
  }, [charmSystem, ownedCharms]);

  return {
    equipCharm,
    unequipCharm,
    addOwnedCharm,
    removeOwnedCharm,
    getEquippedCharms,
    getOwnedCharms,
    isCharmOwned,
    isCharmEquipped,
    canEquipCharm,
    getAvailableSlots,
    updateMaxSlots,
    processCharmEffects,
    getCharmEffects,
    getCharm,
    getState
  };
};
