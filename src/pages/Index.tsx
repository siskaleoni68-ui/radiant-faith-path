import { useState, useEffect } from 'react';
import { BottomNavigation } from '@/components/BottomNavigation';
import { DailyReminder } from '@/components/DailyReminder';
import { StreakTracker } from '@/components/StreakTracker';
import { HabitTracker } from '@/components/HabitTracker';
import { DhikrSection } from '@/components/DhikrSection';
import { SettingsPage } from '@/components/SettingsPage';
import { useHabits } from '@/hooks/useHabits';
import { useStreak } from '@/hooks/useStreak';

function HomePage() {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Assalamu Alaikum</h1>
        <p className="text-sm text-muted-foreground">Peace be upon you</p>
      </div>
      <DailyReminder />
      <StreakTracker />
    </div>
  );
}

function HabitsPage() {
  const { hasCompletedAny } = useHabits();
  const { recordActivity, streakUpdatedToday } = useStreak();

  useEffect(() => {
    if (hasCompletedAny && !streakUpdatedToday) {
      recordActivity();
    }
  }, [hasCompletedAny, streakUpdatedToday, recordActivity]);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="text-center space-y-1">
        <h1 className="text-xl font-bold text-foreground">Daily Habits</h1>
        <p className="text-sm text-muted-foreground">Track your worship today</p>
      </div>
      <HabitTracker />
    </div>
  );
}

function DhikrPage() {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="text-center space-y-1">
        <h1 className="text-xl font-bold text-foreground">Dhikr</h1>
        <p className="text-sm text-muted-foreground">Remember Allah often</p>
      </div>
      <DhikrSection />
    </div>
  );
}

function SettingsPageWrapper() {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="text-center space-y-1">
        <h1 className="text-xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Customize your experience</p>
      </div>
      <SettingsPage />
    </div>
  );
}

export default function Index() {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomePage />;
      case 'habits': return <HabitsPage />;
      case 'dhikr': return <DhikrPage />;
      case 'settings': return <SettingsPageWrapper />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-lg mx-auto px-4 pt-6 pb-24 safe-top">
        {renderContent()}
      </main>
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}