import { useCallback, useEffect } from 'react';
import { LocalNotifications, ScheduleOptions } from '@capacitor/local-notifications';
import { useLocalStorage } from './useLocalStorage';

interface Settings {
  notificationsEnabled: boolean;
  morningReminderEnabled: boolean;
  eveningReminderEnabled: boolean;
  morningTime: string; // HH:mm format
  eveningTime: string; // HH:mm format
  language: 'en' | 'ar';
  darkMode: boolean;
}

const SETTINGS_KEY = 'muslim-companion-settings';

const DEFAULT_SETTINGS: Settings = {
  notificationsEnabled: true,
  morningReminderEnabled: true,
  eveningReminderEnabled: true,
  morningTime: '06:00',
  eveningTime: '19:00',
  language: 'en',
  darkMode: false,
};

const MORNING_REMINDERS = [
  "Start your day with Bismillah. May Allah bless your morning.",
  "Begin with gratitude. Alhamdulillah for another blessed day.",
  "Morning adhkar brings barakah. Don't forget your morning dhikr!",
  "A new day to earn Allah's pleasure. Make it count!",
  "The Prophet ﷺ said: 'The best time for dhikr is after Fajr.'",
];

const EVENING_REMINDERS = [
  "End your day with gratitude. Reflect on Allah's blessings.",
  "Evening adhkar protects you through the night.",
  "Have you completed your evening dhikr today?",
  "Seek forgiveness before you sleep. Allah is Al-Ghafoor.",
  "May Allah grant you a peaceful night and blessed tomorrow.",
];

const MORNING_NOTIFICATION_ID = 1001;
const EVENING_NOTIFICATION_ID = 1002;

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<Settings>(SETTINGS_KEY, DEFAULT_SETTINGS);

  // Schedule notifications when settings change
  useEffect(() => {
    scheduleNotifications(settings);
  }, [settings.notificationsEnabled, settings.morningReminderEnabled, settings.eveningReminderEnabled, settings.morningTime, settings.eveningTime]);

  const updateSetting = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  }, [setSettings]);

  const toggleNotifications = useCallback(async () => {
    const newValue = !settings.notificationsEnabled;
    
    if (newValue) {
      // Request permission when enabling
      const permission = await requestNotificationPermission();
      if (!permission) return;
    }
    
    setSettings(prev => ({
      ...prev,
      notificationsEnabled: newValue,
    }));
  }, [settings.notificationsEnabled, setSettings]);

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

  const setMorningTime = useCallback((time: string) => {
    setSettings(prev => ({
      ...prev,
      morningTime: time,
    }));
  }, [setSettings]);

  const setEveningTime = useCallback((time: string) => {
    setSettings(prev => ({
      ...prev,
      eveningTime: time,
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
    setMorningTime,
    setEveningTime,
    toggleLanguage,
    toggleDarkMode,
    resetSettings,
  };
}

// Helper functions for notifications
async function requestNotificationPermission(): Promise<boolean> {
  try {
    const result = await LocalNotifications.requestPermissions();
    return result.display === 'granted';
  } catch (error) {
    console.log('Notifications not available (web browser)', error);
    return false;
  }
}

async function scheduleNotifications(settings: Settings) {
  try {
    // Cancel existing notifications first
    await LocalNotifications.cancel({
      notifications: [
        { id: MORNING_NOTIFICATION_ID },
        { id: EVENING_NOTIFICATION_ID },
      ],
    });

    if (!settings.notificationsEnabled) return;

    const notifications: ScheduleOptions['notifications'] = [];

    if (settings.morningReminderEnabled) {
      const [hours, minutes] = settings.morningTime.split(':').map(Number);
      const randomReminder = MORNING_REMINDERS[Math.floor(Math.random() * MORNING_REMINDERS.length)];
      
      notifications.push({
        id: MORNING_NOTIFICATION_ID,
        title: '🌅 Morning Reminder',
        body: randomReminder,
        schedule: {
          on: {
            hour: hours,
            minute: minutes,
          },
          repeats: true,
          allowWhileIdle: true,
        },
        sound: 'default',
        smallIcon: 'ic_stat_icon',
        largeIcon: 'ic_launcher',
      });
    }

    if (settings.eveningReminderEnabled) {
      const [hours, minutes] = settings.eveningTime.split(':').map(Number);
      const randomReminder = EVENING_REMINDERS[Math.floor(Math.random() * EVENING_REMINDERS.length)];
      
      notifications.push({
        id: EVENING_NOTIFICATION_ID,
        title: '🌙 Evening Reminder',
        body: randomReminder,
        schedule: {
          on: {
            hour: hours,
            minute: minutes,
          },
          repeats: true,
          allowWhileIdle: true,
        },
        sound: 'default',
        smallIcon: 'ic_stat_icon',
        largeIcon: 'ic_launcher',
      });
    }

    if (notifications.length > 0) {
      await LocalNotifications.schedule({ notifications });
      console.log('Notifications scheduled:', notifications);
    }
  } catch (error) {
    console.log('Error scheduling notifications:', error);
  }
}

export async function initializeNotifications() {
  try {
    // Check if we have permission
    const permStatus = await LocalNotifications.checkPermissions();
    
    if (permStatus.display === 'prompt') {
      // Will request when user enables notifications
      return;
    }

    // Add listener for notification clicks
    await LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
      console.log('Notification clicked:', notification);
    });
  } catch (error) {
    console.log('Notifications not available:', error);
  }
}
