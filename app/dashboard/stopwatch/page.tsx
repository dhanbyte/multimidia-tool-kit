'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(time => time + 1);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (centiseconds: number) => {
    const minutes = Math.floor(centiseconds / 6000);
    const seconds = Math.floor((centiseconds % 6000) / 100);
    const cs = centiseconds % 100;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${cs.toString().padStart(2, '0')}`;
  };

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    setTime(0);
    setIsRunning(false);
    setLaps([]);
  };
  const lap = () => setLaps([...laps, time]);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Stopwatch</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Stopwatch Timer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-6xl font-mono font-bold mb-4">
              {formatTime(time)}
            </div>
            
            <div className="flex gap-2 justify-center">
              {!isRunning ? (
                <Button onClick={start} size="lg">
                  <Play className="h-4 w-4 mr-2" />Start
                </Button>
              ) : (
                <Button onClick={pause} size="lg" variant="outline">
                  <Pause className="h-4 w-4 mr-2" />Pause
                </Button>
              )}
              
              <Button onClick={lap} size="lg" variant="outline" disabled={!isRunning}>
                <Square className="h-4 w-4 mr-2" />Lap
              </Button>
              
              <Button onClick={reset} size="lg" variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />Reset
              </Button>
            </div>
          </div>

          {laps.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium">Lap Times</h3>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {laps.map((lapTime, index) => (
                  <div key={index} className="flex justify-between p-2 bg-muted rounded">
                    <span>Lap {index + 1}</span>
                    <span className="font-mono">{formatTime(lapTime)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}