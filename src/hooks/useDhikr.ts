import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface Dhikr {
  id: string;
  arabic: string;
  transliteration: string;
  meaning: string;
  category: 'morning' | 'evening' | 'anytime';
  recommendedCount: number;
}

interface DhikrCounts {
  [dhikrId: string]: number;
}

const DHIKR_COUNTS_KEY = 'muslim-companion-dhikr-counts';

export const DHIKR_LIST: Dhikr[] = [
  {
    id: 'subhanallah',
    arabic: 'سُبْحَانَ اللهِ',
    transliteration: 'SubhanAllah',
    meaning: 'Glory be to Allah',
    category: 'anytime',
    recommendedCount: 33,
  },
  {
    id: 'alhamdulillah',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Alhamdulillah',
    meaning: 'All praise is due to Allah',
    category: 'anytime',
    recommendedCount: 33,
  },
  {
    id: 'allahuakbar',
    arabic: 'اللهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    meaning: 'Allah is the Greatest',
    category: 'anytime',
    recommendedCount: 34,
  },
  {
    id: 'lailahaillallah',
    arabic: 'لَا إِلَهَ إِلَّا اللهُ',
    transliteration: 'La ilaha illallah',
    meaning: 'There is no god but Allah',
    category: 'anytime',
    recommendedCount: 100,
  },
  {
    id: 'astaghfirullah',
    arabic: 'أَسْتَغْفِرُ اللهَ',
    transliteration: 'Astaghfirullah',
    meaning: 'I seek forgiveness from Allah',
    category: 'anytime',
    recommendedCount: 100,
  },
  {
    id: 'salawat',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
    transliteration: 'Allahumma salli ala Muhammad wa ala aali Muhammad',
    meaning: 'O Allah, send blessings upon Muhammad and the family of Muhammad',
    category: 'anytime',
    recommendedCount: 10,
  },
  {
    id: 'morning-master',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ',
    transliteration: "Asbahna wa asbahal mulku lillah",
    meaning: 'We have entered the morning and the sovereignty belongs to Allah',
    category: 'morning',
    recommendedCount: 1,
  },
  {
    id: 'evening-master',
    arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ',
    transliteration: "Amsayna wa amsal mulku lillah",
    meaning: 'We have entered the evening and the sovereignty belongs to Allah',
    category: 'evening',
    recommendedCount: 1,
  },
  {
    id: 'ayatul-kursi',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
    transliteration: 'Allahu la ilaha illa Huwal-Hayyul-Qayyum',
    meaning: 'Allah! There is no god but He, the Living, the Self-Subsisting',
    category: 'morning',
    recommendedCount: 1,
  },
  {
    id: 'protection',
    arabic: 'بِسْمِ اللهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ',
    transliteration: 'Bismillahil-ladhi la yadurru ma\`asmihi shay\'un',
    meaning: 'In the Name of Allah with Whose Name nothing can harm',
    category: 'evening',
    recommendedCount: 3,
  },
];

export function useDhikr() {
  const [counts, setCounts] = useLocalStorage<DhikrCounts>(DHIKR_COUNTS_KEY, {});

  const getCount = useCallback((dhikrId: string) => {
    return counts[dhikrId] || 0;
  }, [counts]);

  const incrementCount = useCallback((dhikrId: string) => {
    setCounts(prev => ({
      ...prev,
      [dhikrId]: (prev[dhikrId] || 0) + 1,
    }));
  }, [setCounts]);

  const resetCount = useCallback((dhikrId: string) => {
    setCounts(prev => ({
      ...prev,
      [dhikrId]: 0,
    }));
  }, [setCounts]);

  const resetAllCounts = useCallback(() => {
    setCounts({});
  }, [setCounts]);

  const getDhikrByCategory = useCallback((category: 'morning' | 'evening' | 'anytime') => {
    return DHIKR_LIST.filter(d => d.category === category);
  }, []);

  return {
    dhikrList: DHIKR_LIST,
    counts,
    getCount,
    incrementCount,
    resetCount,
    resetAllCounts,
    getDhikrByCategory,
  };
}
