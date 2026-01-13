import { useReminders } from '@/hooks/useReminders';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Star, MessageCircle, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const typeIcons = {
  quran: BookOpen,
  hadith: Star,
  quote: MessageCircle,
};

const typeLabels = {
  quran: 'Quran',
  hadith: 'Hadith',
  quote: 'Wisdom',
};

export function DailyReminder() {
  const { currentReminder, markAsRead, isRead } = useReminders();
  const Icon = typeIcons[currentReminder.type];

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-primary/5 via-card to-islamic-gold/5">
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 bg-primary/5 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground">Daily Reminder</span>
          </div>
          <Badge variant="secondary" className="text-xs font-medium">
            {typeLabels[currentReminder.type]}
          </Badge>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Arabic Text */}
          {currentReminder.arabic && (
            <p className="arabic-text text-2xl text-center text-foreground leading-loose">
              {currentReminder.arabic}
            </p>
          )}

          {/* Translation */}
          <p className="text-base text-center text-muted-foreground leading-relaxed">
            "{currentReminder.translation}"
          </p>

          {/* Source */}
          <p className="text-xs text-center text-muted-foreground/70 font-medium">
            — {currentReminder.source}
          </p>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5">
          <Button
            onClick={markAsRead}
            disabled={isRead}
            variant={isRead ? "secondary" : "default"}
            className={cn(
              "w-full h-11 rounded-xl font-medium transition-all",
              isRead && "bg-primary/10 text-primary"
            )}
          >
            {isRead ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Read ✓
              </>
            ) : (
              "Mark as Read"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
