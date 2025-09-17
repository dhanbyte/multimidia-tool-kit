'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

export default function TimestampConverter() {
  const [timestamp, setTimestamp] = useState('');
  const [humanDate, setHumanDate] = useState('');

  const convertToHuman = () => {
    const date = new Date(parseInt(timestamp) * 1000);
    setHumanDate(date.toString());
  };

  const convertToTimestamp = () => {
    const date = new Date(humanDate);
    setTimestamp(Math.floor(date.getTime() / 1000).toString());
  };

  const getCurrentTimestamp = () => {
    const now = Math.floor(Date.now() / 1000);
    setTimestamp(now.toString());
    setHumanDate(new Date().toString());
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Timestamp Converter</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Convert Timestamps
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Unix Timestamp</label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter timestamp..."
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
              />
              <Button onClick={convertToHuman}>Convert</Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Human Date</label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter date..."
                value={humanDate}
                onChange={(e) => setHumanDate(e.target.value)}
              />
              <Button onClick={convertToTimestamp}>Convert</Button>
            </div>
          </div>

          <Button onClick={getCurrentTimestamp} variant="outline" className="w-full">
            Get Current Timestamp
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}