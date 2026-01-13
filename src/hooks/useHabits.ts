import { useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { getTodayKey } from './useDailyReset';

export interface Habit {
  id: string;
  name: string;
  nameAr: string;
  category: 'prayer' | 'worship' | 'sunnah';
  completed: boolean;
}

export interface DailyHabits {
  date: string;
  habits: Habit[];
}

const DEFAULT_HABITS: Omit<Habit, 'completed'>[] = [
  { id: 'fajr', name: 'Fajr Prayer', nameAr: 'صلاة الفجر', category: 'prayer' },
  { id: 'dhuhr', name: 'Dhuhr Prayer', nameAr: 'صلاة الظهر', category: 'prayer' },
  { id: 'asr', name: 'Asr Prayer', nameAr: 'صلاة العصر', category: 'prayer' },
  { id: 'maghrib', name: 'Maghrib Prayer', nameAr: 'صلاة المغرب', category: 'prayer' },
  { id: 'isha', name: 'Isha Prayer', nameAr: 'صلاة العشاء', category: 'prayer' },
  { id: 'quran', name: 'Quran Reading', nameAr: 'قراءة القرآن', category: 'worship' },
  { id: 'dhikr', name: 'Dhikr', nameAr: 'الذكر', category: 'worship' },
  { id: 'dua', name: "Du'a", nameAr: 'الدعاء', category: 'worship' },
  { id: 'sunnah-fajr', name: 'Sunnah Fajr', nameAr: 'سنة الفجر', category: 'sunnah' },
  { id: 'sunnah-dhuhr', name: 'Sunnah Dhuhr', nameAr: 'سنة الظهر', category: 'sunnah' },
  { id: 'witr', name: 'Witr Prayer', nameAr: 'صلاة الوتر', category: 'sunnah' },
];

const HABITS_KEY = 'muslim-companion-habits';

export function useHabits() {
  const [dailyHabits, setDailyHabits] = useLocalStorage<DailyHabits>(HABITS_KEY, {
    date: getTodayKey(),
    habits: DEFAULT_HABITS.map(h => ({ ...h, completed: false })),
  });

  // Check for daily reset
  useEffect(() => {
    const today = getTodayKey();
    if (dailyHabits.date !== today) {
      setDailyHabits({
        date: today,
        habits: DEFAULT_HABITS.map(h => ({ ...h, completed: false })),
      });
    }
  }, [dailyHabits.date, setDailyHabits]);

  const toggleHabit = useCallback((habitId: string) => {
    setDailyHabits(prev => ({
      ...prev,
      habits: prev.habits.map(h =>
        h.id === habitId ? { ...h, completed: !h.completed } : h
      ),
    }));
  }, [setDailyHabits]);

  const getProgress = useCallback(() => {
    const completed = dailyHabits.habits.filter(h => h.completed).length;
    const total = dailyHabits.habits.length;
    return { completed, total, percentage: Math.round((completed / total) * 100) };
  }, [dailyHabits.habits]);

  const resetHabits = useCallback(() => {
    setDailyHabits({
      date: getTodayKey(),
      habits: DEFAULT_HABITS.map(h => ({ ...h, completed: false })),
    });
  }, [setDailyHabits]);

  const hasCompletedAny = dailyHabits.habits.some(h => h.completed);

  return {
    habits: dailyHabits.habits,
    toggleHabit,
    getProgress,
    resetHabits,
    hasCompletedAny,
  };
}
