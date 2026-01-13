import { useState } from 'react';
import { useDhikr, Dhikr } from '@/hooks/useDhikr';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RotateCcw, Sun, Moon, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DhikrCardProps {
  dhikr: Dhikr;
  count: number;
  onIncrement: () => void;
  onReset: () => void;
}

function DhikrCard({ dhikr, count, onIncrement, onReset }: DhikrCardProps) {
  const isComplete = count >= dhikr.recommendedCount;
  const progressPercentage = Math.min((count / dhikr.recommendedCount) * 100, 100);

  return (
    <Card 
      className={cn(
        "overflow-hidden border transition-all duration-200 cursor-pointer active:scale-[0.98]",
        isComplete ? "border-primary/30 bg-primary/5" : "border-border"
      )}
      onClick={onIncrement}
    >
      <CardContent className="p-4 space-y-3">
        {/* Arabic */}
        <p className="arabic-text text-xl text-center text-foreground leading-loose">
          {dhikr.arabic}
        </p>

        {/* Transliteration */}
        <p className="text-sm text-center font-medium text-muted-foreground italic">
          {dhikr.transliteration}
        </p>

        {/* Meaning */}
        <p className="text-xs text-center text-muted-foreground/80">
          {dhikr.meaning}
        </p>

        {/* Counter */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <div 
              className={cn(
                "text-2xl font-bold transition-all",
                isComplete ? "text-primary" : "text-foreground",
                count > 0 && "animate-counter-pulse"
              )}
            >
              {count}
            </div>
            <span className="text-sm text-muted-foreground">
              / {dhikr.recommendedCount}
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onReset();
            }}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Progress bar */}
        <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full transition-all duration-300 rounded-full",
              isComplete ? "bg-primary" : "bg-islamic-gold"
            )}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {isComplete && (
          <Badge className="w-full justify-center bg-primary/10 text-primary border-0">
            ✓ Complete - MashaAllah!
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}

export function DhikrSection() {
  const [activeTab, setActiveTab] = useState('anytime');
  const { getDhikrByCategory, getCount, incrementCount, resetCount } = useDhikr();

  const tabConfig = [
    { id: 'morning', label: 'Morning', icon: Sun },
    { id: 'evening', label: 'Evening', icon: Moon },
    { id: 'anytime', label: 'Anytime', icon: Sparkles },
  ];

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 h-12">
          {tabConfig.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {tabConfig.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="mt-4 space-y-4">
            {getDhikrByCategory(tab.id as 'morning' | 'evening' | 'anytime').map((dhikr) => (
              <DhikrCard
                key={dhikr.id}
                dhikr={dhikr}
                count={getCount(dhikr.id)}
                onIncrement={() => incrementCount(dhikr.id)}
                onReset={() => resetCount(dhikr.id)}
              />
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
