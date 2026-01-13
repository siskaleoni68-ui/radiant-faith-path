import { useState } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { useHabits } from '@/hooks/useHabits';
import { useStreak } from '@/hooks/useStreak';
import { useDhikr } from '@/hooks/useDhikr';
import { useReminders } from '@/hooks/useReminders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Bell, Sun, Moon, Languages, RotateCcw, Info, Heart, Clock } from 'lucide-react';

interface SettingRowProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: React.ReactNode;
}

function SettingRow({ icon, title, description, action }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

interface TimePickerRowProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
  onTimeChange: (time: string) => void;
  disabled?: boolean;
}

function TimePickerRow({ icon, title, description, time, onTimeChange, disabled }: TimePickerRowProps) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <Input
        type="time"
        value={time}
        onChange={(e) => onTimeChange(e.target.value)}
        disabled={disabled}
        className="w-28 text-sm"
      />
    </div>
  );
}

export function SettingsPage() {
  const { 
    settings, 
    toggleNotifications, 
    toggleMorningReminder, 
    toggleEveningReminder,
    setMorningTime,
    setEveningTime,
    toggleLanguage,
  } = useSettings();

  const { resetHabits } = useHabits();
  const { resetStreak } = useStreak();
  const { resetAllCounts } = useDhikr();
  const { resetReadStatus } = useReminders();

  const [showResetDialog, setShowResetDialog] = useState(false);

  const handleResetAll = () => {
    resetHabits();
    resetStreak();
    resetAllCounts();
    resetReadStatus();
    setShowResetDialog(false);
  };

  return (
    <div className="space-y-4">
      {/* Notifications */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Notifications</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          <SettingRow
            icon={<Bell className="w-5 h-5" />}
            title="Enable Notifications"
            description="Receive daily Islamic reminders"
            action={
              <Switch
                checked={settings.notificationsEnabled}
                onCheckedChange={toggleNotifications}
              />
            }
          />
          <SettingRow
            icon={<Sun className="w-5 h-5" />}
            title="Morning Reminder"
            description="Start your day with blessings"
            action={
              <Switch
                checked={settings.morningReminderEnabled}
                onCheckedChange={toggleMorningReminder}
                disabled={!settings.notificationsEnabled}
              />
            }
          />
          <TimePickerRow
            icon={<Clock className="w-5 h-5" />}
            title="Morning Time"
            description="When to receive morning reminder"
            time={settings.morningTime}
            onTimeChange={setMorningTime}
            disabled={!settings.notificationsEnabled || !settings.morningReminderEnabled}
          />
          <SettingRow
            icon={<Moon className="w-5 h-5" />}
            title="Evening Reminder"
            description="End your day with reflection"
            action={
              <Switch
                checked={settings.eveningReminderEnabled}
                onCheckedChange={toggleEveningReminder}
                disabled={!settings.notificationsEnabled}
              />
            }
          />
          <TimePickerRow
            icon={<Clock className="w-5 h-5" />}
            title="Evening Time"
            description="When to receive evening reminder"
            time={settings.eveningTime}
            onTimeChange={setEveningTime}
            disabled={!settings.notificationsEnabled || !settings.eveningReminderEnabled}
          />
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Preferences</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          <SettingRow
            icon={<Languages className="w-5 h-5" />}
            title="Language"
            description={settings.language === 'en' ? 'English' : 'العربية'}
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={toggleLanguage}
                className="text-xs"
              >
                {settings.language === 'en' ? 'العربية' : 'English'}
              </Button>
            }
          />
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Data Management</CardTitle>
        </CardHeader>
        <CardContent>
          <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="w-full"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset All Progress
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset All Progress?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all your progress including habits, 
                  streaks, dhikr counts, and settings. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleResetAll}>
                  Reset Everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      {/* About */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">About</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 py-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Info className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Muslim Daily Companion</p>
              <p className="text-xs text-muted-foreground">Version 1.0.0</p>
            </div>
          </div>
          <Separator />
          <div className="text-center py-4">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <span className="text-sm">Made with</span>
              <Heart className="w-4 h-4 text-destructive fill-destructive" />
              <span className="text-sm">for the Ummah</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              May Allah accept our efforts
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
