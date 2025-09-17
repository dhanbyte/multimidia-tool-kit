'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function TextSummarizer() {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');

  const summarizeText = () => {
    if (!inputText.trim()) {
      toast.error('Please enter text to summarize');
      return;
    }

    const sentences = inputText.split('.').filter(s => s.trim().length > 0);
    const summaryLength = Math.max(1, Math.floor(sentences.length / 3));
    const summarized = sentences.slice(0, summaryLength).join('. ') + '.';
    
    setSummary(summarized);
    toast.success('Text summarized!');
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Text Summarizer</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Summarize Text
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter text to summarize..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={8}
          />
          
          <Button onClick={summarizeText} className="w-full">
            Summarize Text
          </Button>

          {summary && (
            <div className="space-y-2">
              <h3 className="font-medium">Summary</h3>
              <div className="p-4 bg-muted rounded-lg">
                {summary}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}