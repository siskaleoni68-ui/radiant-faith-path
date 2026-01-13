import { useStreak } from '@/hooks/useStreak';
import { Card, CardContent } from '@/components/ui/card';
import { Flame, Trophy } from 'lucide-react';

export function StreakTracker() {
  const { currentStreak, bestStreak, getMessage } = useStreak();

  return (
    <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-r from-islamic-gold/10 via-card to-islamic-gold/5">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Your Streak</h3>
          <div className="flex items-center gap-1 text-islamic-gold">
            <Trophy className="w-4 h-4" />
            <span className="text-xs font-medium">Best: {bestStreak}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-islamic-gold to-accent">
            <Flame className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="text-4xl font-bold text-foreground">
              {currentStreak}
            </div>
            <div className="text-sm text-muted-foreground">
              {currentStreak === 1 ? 'Day' : 'Days'}
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {getMessage()}
        </p>
      </CardContent>
    </Card>
  );
}
