import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.b526e6f439f84a3899fcd83e194281b6',
  appName: 'Muslim Daily Companion',
  webDir: 'dist',
  server: {
    url: 'https://b526e6f4-39f8-4a38-99fc-d83e194281b6.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
  android: {
    allowMixedContent: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#f7f9f5',
      showSpinner: false,
    },
  },
};

export default config;
