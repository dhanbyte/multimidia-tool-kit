'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

export default function DuplicateRemover() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');

  const removeDuplicates = () => {
    const lines = inputText.split('\n');
    const uniqueLines = [...new Set(lines)];
    setOutputText(uniqueLines.join('\n'));
    toast.success('Duplicates removed!');
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Duplicate Line Remover</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input Text</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter text with duplicate lines..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={8}
            />
            <Button onClick={removeDuplicates} className="w-full">
              Remove Duplicates
            </Button>
          </CardContent>
        </Card>

        {outputText && (
          <Card>
            <CardHeader>
              <CardTitle>Unique Lines</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea value={outputText} readOnly rows={8} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}