'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Extract } from 'lucide-react';

export default function TextExtractor() {
  const [inputText, setInputText] = useState('');
  const [extractedText, setExtractedText] = useState('');

  const extractEmails = () => {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const emails = inputText.match(emailRegex) || [];
    setExtractedText(emails.join('\n'));
  };

  const extractURLs = () => {
    const urlRegex = /https?:\/\/[^\s]+/g;
    const urls = inputText.match(urlRegex) || [];
    setExtractedText(urls.join('\n'));
  };

  const extractNumbers = () => {
    const numberRegex = /\d+/g;
    const numbers = inputText.match(numberRegex) || [];
    setExtractedText(numbers.join('\n'));
  };

  const extractPhones = () => {
    const phoneRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g;
    const phones = inputText.match(phoneRegex) || [];
    setExtractedText(phones.join('\n'));
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Text Extractor</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Extract className="h-5 w-5" />
            Extract Data from Text
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter text to extract data from..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={8}
          />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button onClick={extractEmails} variant="outline">Extract Emails</Button>
            <Button onClick={extractURLs} variant="outline">Extract URLs</Button>
            <Button onClick={extractNumbers} variant="outline">Extract Numbers</Button>
            <Button onClick={extractPhones} variant="outline">Extract Phones</Button>
          </div>

          {extractedText && (
            <div className="space-y-2">
              <h3 className="font-medium">Extracted Data</h3>
              <Textarea value={extractedText} readOnly rows={6} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}