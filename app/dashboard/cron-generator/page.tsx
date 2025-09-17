'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock } from 'lucide-react';

export default function CronGenerator() {
  const [minute, setMinute] = useState('*');
  const [hour, setHour] = useState('*');
  const [day, setDay] = useState('*');
  const [month, setMonth] = useState('*');
  const [weekday, setWeekday] = useState('*');

  const cronExpression = `${minute} ${hour} ${day} ${month} ${weekday}`;

  const getDescription = () => {
    if (cronExpression === '* * * * *') return 'Every minute';
    if (cronExpression === '0 * * * *') return 'Every hour';
    if (cronExpression === '0 0 * * *') return 'Every day at midnight';
    if (cronExpression === '0 0 * * 0') return 'Every Sunday at midnight';
    if (cronExpression === '0 0 1 * *') return 'First day of every month at midnight';
    return 'Custom schedule';
  };

  const presets = [
    { name: 'Every minute', value: '* * * * *' },
    { name: 'Every 5 minutes', value: '*/5 * * * *' },
    { name: 'Every hour', value: '0 * * * *' },
    { name: 'Every day at midnight', value: '0 0 * * *' },
    { name: 'Every Sunday', value: '0 0 * * 0' },
    { name: 'Every month', value: '0 0 1 * *' }
  ];

  const loadPreset = (preset: string) => {
    const parts = preset.split(' ');
    setMinute(parts[0]);
    setHour(parts[1]);
    setDay(parts[2]);
    setMonth(parts[3]);
    setWeekday(parts[4]);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Cron Expression Generator</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Generate Cron Expression
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-5 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Minute</label>
                <Input
                  value={minute}
                  onChange={(e) => setMinute(e.target.value)}
                  placeholder="0-59 or *"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Hour</label>
                <Input
                  value={hour}
                  onChange={(e) => setHour(e.target.value)}
                  placeholder="0-23 or *"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Day</label>
                <Input
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  placeholder="1-31 or *"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Month</label>
                <Input
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  placeholder="1-12 or *"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Weekday</label>
                <Input
                  value={weekday}
                  onChange={(e) => setWeekday(e.target.value)}
                  placeholder="0-7 or *"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Quick Presets</label>
              <Select onValueChange={loadPreset}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a preset..." />
                </SelectTrigger>
                <SelectContent>
                  {presets.map(preset => (
                    <SelectItem key={preset.value} value={preset.value}>
                      {preset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated Expression</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="font-mono text-lg">{cronExpression}</div>
              <div className="text-sm text-muted-foreground mt-2">{getDescription()}</div>
            </div>

            <div className="text-xs text-muted-foreground">
              <div>Format: minute hour day month weekday</div>
              <div>Use * for "any value", */5 for "every 5", 0-23 for ranges</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}