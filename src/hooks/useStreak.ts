import { useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

interface StreakData {
  currentStreak: number;
  bestStreak: number;
  lastActivityDate: string;
  streakUpdatedToday: boolean;
}

const STREAK_KEY = 'muslim-companion-streak';

const getMotivationalMessage = (currentStreak: number, isIncrease: boolean, isBroken: boolean): string => {
  if (isBroken) {
    return "Don't worry, every new day is a chance to start again. May Allah make it easy for you.";
  }
  if (isIncrease) {
    if (currentStreak === 1) return "MashaAllah! You've started your journey. Keep going!";
    if (currentStreak === 7) return "SubhanAllah! A full week of consistency!";
    if (currentStreak === 30) return "Allahu Akbar! 30 days of dedication!";
    if (currentStreak % 10 === 0) return `MashaAllah! ${currentStreak} days of worship!`;
    return "May Allah bless your efforts and reward your consistency.";
  }
  return "Continue your journey of worship today.";
};

export function useStreak() {
  const [streakData, setStreakData] = useLocalStorage<StreakData>(STREAK_KEY, {
    currentStreak: 0,
    bestStreak: 0,
    lastActivityDate: '',
    streakUpdatedToday: false,
  });

  // Check for streak break on new day
  useEffect(() => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    if (streakData.lastActivityDate && streakData.lastActivityDate !== today) {
      if (streakData.lastActivityDate !== yesterday) {
        // Streak broken - more than 1 day gap
        setStreakData(prev => ({
          ...prev,
          currentStreak: 0,
          streakUpdatedToday: false,
        }));
      } else {
        // New day, reset the update flag
        setStreakData(prev => ({
          ...prev,
          streakUpdatedToday: false,
        }));
      }
    }
  }, [streakData.lastActivityDate, setStreakData]);

  const recordActivity = useCallback(() => {
    const today = new Date().toDateString();
    
    setStreakData(prev => {
      if (prev.streakUpdatedToday && prev.lastActivityDate === today) {
        return prev; // Already recorded today
      }

      const yesterday = new Date(Date.now() - 86400000).toDateString();
      let newStreak = prev.currentStreak;
      
      if (prev.lastActivityDate === yesterday) {
        newStreak = prev.currentStreak + 1;
      } else if (prev.lastActivityDate !== today) {
        newStreak = 1;
      }

      const newBest = Math.max(newStreak, prev.bestStreak);

      return {
        currentStreak: newStreak,
        bestStreak: newBest,
        lastActivityDate: today,
        streakUpdatedToday: true,
      };
    });
  }, [setStreakData]);

  const resetStreak = useCallback(() => {
    setStreakData({
      currentStreak: 0,
      bestStreak: 0,
      lastActivityDate: '',
      streakUpdatedToday: false,
    });
  }, [setStreakData]);

  const getMessage = useCallback(() => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    const isIncrease = streakData.streakUpdatedToday;
    const isBroken = streakData.lastActivityDate !== '' && 
                     streakData.lastActivityDate !== today && 
                     streakData.lastActivityDate !== yesterday &&
                     streakData.currentStreak === 0;

    return getMotivationalMessage(streakData.currentStreak, isIncrease, isBroken);
  }, [streakData]);

  return {
    currentStreak: streakData.currentStreak,
    bestStreak: streakData.bestStreak,
    recordActivity,
    resetStreak,
    getMessage,
    streakUpdatedToday: streakData.streakUpdatedToday,
  };
}
