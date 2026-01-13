import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

interface Settings {
  notificationsEnabled: boolean;
  morningReminderEnabled: boolean;
  eveningReminderEnabled: boolean;
  language: 'en' | 'ar';
  darkMode: boolean;
}

const SETTINGS_KEY = 'muslim-companion-settings';

const DEFAULT_SETTINGS: Settings = {
  notificationsEnabled: true,
  morningReminderEnabled: true,
  eveningReminderEnabled: true,
  language: 'en',
  darkMode: false,
};

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<Settings>(SETTINGS_KEY, DEFAULT_SETTINGS);

  const updateSetting = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  }, [setSettings]);

  const toggleNotifications = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      notificationsEnabled: !prev.notificationsEnabled,
    }));
  }, [setSettings]);

  const toggleMorningReminder = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      morningReminderEnabled: !prev.morningReminderEnabled,
    }));
  }, [setSettings]);

  const toggleEveningReminder = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      eveningReminderEnabled: !prev.eveningReminderEnabled,
    }));
  }, [setSettings]);

  const toggleLanguage = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      language: prev.language === 'en' ? 'ar' : 'en',
    }));
  }, [setSettings]);

  const toggleDarkMode = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      darkMode: !prev.darkMode,
    }));
  }, [setSettings]);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, [setSettings]);

  return {
    settings,
    updateSetting,
    toggleNotifications,
    toggleMorningReminder,
    toggleEveningReminder,
    toggleLanguage,
    toggleDarkMode,
    resetSettings,
  };
}
