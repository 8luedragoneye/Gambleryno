import { useState, useCallback } from 'react';
import { PhoneCallSystem, PhoneCallResult, PhoneCallEffect } from '../systems/phoneCallSystem';
import { PhoneCall, PhoneCallOption } from '../data/phoneCalls';

export const usePhoneCalls = () => {
  const [phoneCallSystem] = useState(() => new PhoneCallSystem());
  const [currentCall, setCurrentCall] = useState<PhoneCallResult | null>(null);

  // Trigger a phone call
  const triggerPhoneCall = useCallback((): PhoneCallResult | null => {
    const result = phoneCallSystem.triggerPhoneCall();
    if (result) {
      setCurrentCall(result);
    }
    return result;
  }, [phoneCallSystem]);

  // Process selected options
  const processPhoneCallOptions = useCallback((call: PhoneCall, selectedOptions: PhoneCallOption[]): PhoneCallEffect[] => {
    const selectedOptionIds = selectedOptions.map(option => option.id);
    return phoneCallSystem.processPhoneCallOptions(call, selectedOptionIds);
  }, [phoneCallSystem]);

  // These methods are no longer used but kept for compatibility
  const scheduleEvilCall = useCallback(() => {
    // No longer used
  }, []);

  const scheduleHolyCall = useCallback(() => {
    // No longer used
  }, []);

  const shouldTrigger666 = useCallback((): boolean => {
    return false; // No longer used
  }, []);

  const addDivineProtection = useCallback((rounds: number) => {
    // No longer used
  }, []);

  // Get current state
  const getState = useCallback(() => {
    return phoneCallSystem.getState();
  }, [phoneCallSystem]);

  // Reset for new deadline
  const resetForNewDeadline = useCallback(() => {
    phoneCallSystem.resetForNewDeadline();
  }, [phoneCallSystem]);

  // Phone calls now always trigger at deadline start
  const shouldTriggerAtDeadlineStart = useCallback((): boolean => {
    return true; // Always trigger at deadline start
  }, []);

  // Get call type color
  const getCallTypeColor = useCallback((type: 'normal' | 'evil' | 'holy'): string => {
    return phoneCallSystem.getCallTypeColor(type);
  }, [phoneCallSystem]);

  // Get call type icon
  const getCallTypeIcon = useCallback((type: 'normal' | 'evil' | 'holy'): string => {
    return phoneCallSystem.getCallTypeIcon(type);
  }, [phoneCallSystem]);

  // Close current call
  const closeCurrentCall = useCallback(() => {
    setCurrentCall(null);
  }, []);

  return {
    currentCall,
    triggerPhoneCall,
    processPhoneCallOptions,
    scheduleEvilCall,
    scheduleHolyCall,
    shouldTrigger666,
    addDivineProtection,
    getState,
    resetForNewDeadline,
    shouldTriggerAtDeadlineStart,
    getCallTypeColor,
    getCallTypeIcon,
    closeCurrentCall,
    phoneCallSystem
  };
};
