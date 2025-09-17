'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shuffle } from 'lucide-react';

export default function RandomGenerator() {
  const [randomNumber, setRandomNumber] = useState('');
  const [randomString, setRandomString] = useState('');
  const [min, setMin] = useState('1');
  const [max, setMax] = useState('100');
  const [length, setLength] = useState('10');

  const generateNumber = () => {
    const minNum = parseInt(min) || 1;
    const maxNum = parseInt(max) || 100;
    const random = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
    setRandomNumber(random.toString());
  };

  const generateString = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < parseInt(length); i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setRandomString(result);
  };

  const generateUUID = () => {
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    setRandomString(uuid);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Random Generator</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shuffle className="h-5 w-5" />
            Generate Random Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="number">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="number">Numbers</TabsTrigger>
              <TabsTrigger value="string">Strings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="number" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Min</label>
                  <Input value={min} onChange={(e) => setMin(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium">Max</label>
                  <Input value={max} onChange={(e) => setMax(e.target.value)} />
                </div>
              </div>
              <Button onClick={generateNumber} className="w-full">Generate Number</Button>
              {randomNumber && (
                <div className="p-4 bg-muted rounded text-center text-2xl font-mono">
                  {randomNumber}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="string" className="space-y-4">
              <div>
                <label className="text-sm font-medium">Length</label>
                <Input value={length} onChange={(e) => setLength(e.target.value)} />
              </div>
              <div className="flex gap-2">
                <Button onClick={generateString} className="flex-1">Generate String</Button>
                <Button onClick={generateUUID} variant="outline" className="flex-1">Generate UUID</Button>
              </div>
              {randomString && (
                <div className="p-4 bg-muted rounded text-center font-mono break-all">
                  {randomString}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}