'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code } from 'lucide-react';

export default function TextEncoder() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');

  const encodeURL = () => {
    setOutputText(encodeURIComponent(inputText));
  };

  const decodeURL = () => {
    try {
      setOutputText(decodeURIComponent(inputText));
    } catch {
      setOutputText('Invalid URL encoding');
    }
  };

  const encodeHTML = () => {
    setOutputText(inputText
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;'));
  };

  const decodeHTML = () => {
    setOutputText(inputText
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'"));
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Text Encoder/Decoder</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Encode/Decode Text
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter text to encode/decode..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={6}
          />
          
          <Tabs defaultValue="url">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url">URL Encoding</TabsTrigger>
              <TabsTrigger value="html">HTML Encoding</TabsTrigger>
            </TabsList>
            
            <TabsContent value="url" className="space-y-2">
              <div className="flex gap-2">
                <Button onClick={encodeURL} className="flex-1">Encode URL</Button>
                <Button onClick={decodeURL} variant="outline" className="flex-1">Decode URL</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="html" className="space-y-2">
              <div className="flex gap-2">
                <Button onClick={encodeHTML} className="flex-1">Encode HTML</Button>
                <Button onClick={decodeHTML} variant="outline" className="flex-1">Decode HTML</Button>
              </div>
            </TabsContent>
          </Tabs>

          {outputText && (
            <div className="space-y-2">
              <h3 className="font-medium">Result</h3>
              <Textarea value={outputText} readOnly rows={6} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}