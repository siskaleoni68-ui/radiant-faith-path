import { useHabits, Habit } from '@/hooks/useHabits';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface HabitItemProps {
  habit: Habit;
  onToggle: () => void;
}

function HabitItem({ habit, onToggle }: HabitItemProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-200 text-left",
        habit.completed
          ? "bg-primary/10 border border-primary/20"
          : "bg-muted/50 border border-transparent hover:bg-muted"
      )}
    >
      <Checkbox
        checked={habit.completed}
        onCheckedChange={onToggle}
        className="pointer-events-none"
      />
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-sm font-medium truncate transition-all",
          habit.completed ? "text-primary" : "text-foreground"
        )}>
          {habit.name}
        </p>
        <p className="text-xs text-muted-foreground arabic-text">
          {habit.nameAr}
        </p>
      </div>
    </button>
  );
}

interface HabitCategoryProps {
  title: string;
  habits: Habit[];
  onToggle: (id: string) => void;
}

function HabitCategory({ title, habits, onToggle }: HabitCategoryProps) {
  if (habits.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1">
        {title}
      </h4>
      <div className="grid gap-2">
        {habits.map((habit) => (
          <HabitItem
            key={habit.id}
            habit={habit}
            onToggle={() => onToggle(habit.id)}
          />
        ))}
      </div>
    </div>
  );
}

export function HabitTracker() {
  const { habits, toggleHabit, getProgress } = useHabits();
  const { completed, total, percentage } = getProgress();

  const prayerHabits = habits.filter(h => h.category === 'prayer');
  const worshipHabits = habits.filter(h => h.category === 'worship');
  const sunnahHabits = habits.filter(h => h.category === 'sunnah');

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Today's Worship</CardTitle>
          <span className="text-2xl font-bold text-primary">{percentage}%</span>
        </div>
        <div className="space-y-2">
          <Progress value={percentage} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {completed} of {total} activities completed
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <HabitCategory
          title="Daily Prayers"
          habits={prayerHabits}
          onToggle={toggleHabit}
        />
        <HabitCategory
          title="Worship"
          habits={worshipHabits}
          onToggle={toggleHabit}
        />
        <HabitCategory
          title="Sunnah Practices"
          habits={sunnahHabits}
          onToggle={toggleHabit}
        />
      </CardContent>
    </Card>
  );
}
