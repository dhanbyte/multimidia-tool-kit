'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RotateCcw } from 'lucide-react';

export default function TextReverser() {
  const [inputText, setInputText] = useState('');
  const [reversedText, setReversedText] = useState('');

  const reverseText = () => {
    setReversedText(inputText.split('').reverse().join(''));
  };

  const reverseWords = () => {
    setReversedText(inputText.split(' ').reverse().join(' '));
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Text Reverser</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5" />
            Reverse Text
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter text to reverse..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={6}
          />
          
          <div className="flex gap-2">
            <Button onClick={reverseText} className="flex-1">
              Reverse Characters
            </Button>
            <Button onClick={reverseWords} variant="outline" className="flex-1">
              Reverse Words
            </Button>
          </div>

          {reversedText && (
            <div className="space-y-2">
              <h3 className="font-medium">Reversed Text</h3>
              <Textarea value={reversedText} readOnly rows={6} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}