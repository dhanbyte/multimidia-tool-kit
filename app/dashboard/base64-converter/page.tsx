'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, ArrowUpDown } from 'lucide-react';
import { toast } from 'sonner';

export default function Base64Converter() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [activeTab, setActiveTab] = useState('encode');

  const encodeBase64 = () => {
    if (!inputText.trim()) {
      toast.error('Please enter text to encode');
      return;
    }

    try {
      const encoded = btoa(unescape(encodeURIComponent(inputText)));
      setOutputText(encoded);
      toast.success('Text encoded successfully!');
    } catch (error) {
      toast.error('Error encoding text');
    }
  };

  const decodeBase64 = () => {
    if (!inputText.trim()) {
      toast.error('Please enter Base64 text to decode');
      return;
    }

    try {
      const decoded = decodeURIComponent(escape(atob(inputText)));
      setOutputText(decoded);
      toast.success('Text decoded successfully!');
    } catch (error) {
      toast.error('Invalid Base64 input');
    }
  };

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const clearAll = () => {
    setInputText('');
    setOutputText('');
  };

  const swapTexts = () => {
    const temp = inputText;
    setInputText(outputText);
    setOutputText(temp);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Base64 Encoder/Decoder</h1>
        <p className="text-muted-foreground">
          Encode and decode text using Base64 encoding
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUpDown className="h-5 w-5" />
            Base64 Converter
          </CardTitle>
          <CardDescription>
            Convert text to Base64 or decode Base64 back to text
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="encode">Encode</TabsTrigger>
              <TabsTrigger value="decode">Decode</TabsTrigger>
            </TabsList>
            
            <TabsContent value="encode" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Text to Encode</label>
                <Textarea
                  placeholder="Enter your text here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={6}
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={encodeBase64} className="flex-1">
                  Encode to Base64
                </Button>
                <Button variant="outline" onClick={clearAll}>
                  Clear
                </Button>
                <Button variant="outline" onClick={swapTexts}>
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="decode" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Base64 to Decode</label>
                <Textarea
                  placeholder="Enter Base64 encoded text here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={6}
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={decodeBase64} className="flex-1">
                  Decode from Base64
                </Button>
                <Button variant="outline" onClick={clearAll}>
                  Clear
                </Button>
                <Button variant="outline" onClick={swapTexts}>
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {outputText && (
            <div className="mt-6 space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">
                  {activeTab === 'encode' ? 'Encoded Result' : 'Decoded Result'}
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(outputText)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
              <Textarea
                value={outputText}
                readOnly
                rows={6}
                className="font-mono"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}