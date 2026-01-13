import { useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

const LAST_RESET_KEY = 'muslim-companion-last-reset';

export function useDailyReset(onReset: () => void) {
  const [lastReset, setLastReset] = useLocalStorage<string>(LAST_RESET_KEY, '');

  const checkAndReset = useCallback(() => {
    const today = new Date().toDateString();
    if (lastReset !== today) {
      onReset();
      setLastReset(today);
    }
  }, [lastReset, setLastReset, onReset]);

  useEffect(() => {
    checkAndReset();
    // Check again at midnight
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const timeoutId = setTimeout(checkAndReset, msUntilMidnight);
    return () => clearTimeout(timeoutId);
  }, [checkAndReset]);

  return { lastReset };
}

export function getTodayKey(): string {
  return new Date().toDateString();
}
