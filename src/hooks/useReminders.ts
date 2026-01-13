import { useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface Reminder {
  id: string;
  type: 'quran' | 'hadith' | 'quote';
  arabic: string;
  translation: string;
  source: string;
}

interface ReminderState {
  currentReminderId: string;
  lastShownDate: string;
  readReminders: string[];
}

const REMINDER_KEY = 'muslim-companion-reminders';

const REMINDERS: Reminder[] = [
  {
    id: 'quran-1',
    type: 'quran',
    arabic: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا',
    translation: 'And whoever fears Allah - He will make for him a way out.',
    source: 'Quran 65:2',
  },
  {
    id: 'quran-2',
    type: 'quran',
    arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    translation: 'Indeed, with hardship comes ease.',
    source: 'Quran 94:6',
  },
  {
    id: 'quran-3',
    type: 'quran',
    arabic: 'وَاذْكُر رَّبَّكَ فِي نَفْسِكَ تَضَرُّعًا وَخِيفَةً',
    translation: 'And remember your Lord within yourself in humility and in fear.',
    source: 'Quran 7:205',
  },
  {
    id: 'quran-4',
    type: 'quran',
    arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ',
    translation: 'So remember Me; I will remember you.',
    source: 'Quran 2:152',
  },
  {
    id: 'quran-5',
    type: 'quran',
    arabic: 'وَقُل رَّبِّ زِدْنِي عِلْمًا',
    translation: 'And say, "My Lord, increase me in knowledge."',
    source: 'Quran 20:114',
  },
  {
    id: 'hadith-1',
    type: 'hadith',
    arabic: 'الطُّهُورُ شَطْرُ الإِيمَانِ',
    translation: 'Cleanliness is half of faith.',
    source: 'Sahih Muslim',
  },
  {
    id: 'hadith-2',
    type: 'hadith',
    arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    translation: 'The best of you are those who learn the Quran and teach it.',
    source: 'Sahih Bukhari',
  },
  {
    id: 'hadith-3',
    type: 'hadith',
    arabic: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ',
    translation: 'Actions are judged by intentions.',
    source: 'Sahih Bukhari & Muslim',
  },
  {
    id: 'hadith-4',
    type: 'hadith',
    arabic: 'الْمُؤْمِنُ لِلْمُؤْمِنِ كَالْبُنْيَانِ',
    translation: 'A believer to another believer is like a building whose parts support each other.',
    source: 'Sahih Bukhari',
  },
  {
    id: 'quote-1',
    type: 'quote',
    arabic: '',
    translation: 'When you have nothing left but Allah, you realize Allah is enough.',
    source: 'Islamic Wisdom',
  },
  {
    id: 'quote-2',
    type: 'quote',
    arabic: '',
    translation: 'The world is a prison for the believer and paradise for the disbeliever.',
    source: 'Sahih Muslim',
  },
  {
    id: 'quote-3',
    type: 'quote',
    arabic: '',
    translation: 'Every soul shall taste death. So make sure you live before you die.',
    source: 'Islamic Wisdom',
  },
];

export function useReminders() {
  const [state, setState] = useLocalStorage<ReminderState>(REMINDER_KEY, {
    currentReminderId: REMINDERS[0].id,
    lastShownDate: '',
    readReminders: [],
  });

  // Check for daily reminder change
  useEffect(() => {
    const today = new Date().toDateString();
    if (state.lastShownDate !== today) {
      const currentIndex = REMINDERS.findIndex(r => r.id === state.currentReminderId);
      const nextIndex = (currentIndex + 1) % REMINDERS.length;
      setState(prev => ({
        ...prev,
        currentReminderId: REMINDERS[nextIndex].id,
        lastShownDate: today,
      }));
    }
  }, [state.lastShownDate, state.currentReminderId, setState]);

  const currentReminder = REMINDERS.find(r => r.id === state.currentReminderId) || REMINDERS[0];

  const markAsRead = useCallback(() => {
    setState(prev => ({
      ...prev,
      readReminders: prev.readReminders.includes(prev.currentReminderId)
        ? prev.readReminders
        : [...prev.readReminders, prev.currentReminderId],
    }));
  }, [setState]);

  const isRead = state.readReminders.includes(state.currentReminderId);

  const resetReadStatus = useCallback(() => {
    setState(prev => ({
      ...prev,
      readReminders: [],
    }));
  }, [setState]);

  return {
    currentReminder,
    markAsRead,
    isRead,
    resetReadStatus,
    allReminders: REMINDERS,
  };
}
