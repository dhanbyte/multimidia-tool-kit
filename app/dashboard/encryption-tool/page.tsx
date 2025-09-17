'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lock, Unlock } from 'lucide-react';
import { toast } from 'sonner';

export default function EncryptionTool() {
  const [text, setText] = useState('');
  const [key, setKey] = useState('');
  const [result, setResult] = useState('');

  const simpleEncrypt = (text: string, key: string) => {
    let encrypted = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const keyChar = key.charCodeAt(i % key.length);
      encrypted += String.fromCharCode(charCode ^ keyChar);
    }
    return btoa(encrypted);
  };

  const simpleDecrypt = (encrypted: string, key: string) => {
    try {
      const decoded = atob(encrypted);
      let decrypted = '';
      for (let i = 0; i < decoded.length; i++) {
        const charCode = decoded.charCodeAt(i);
        const keyChar = key.charCodeAt(i % key.length);
        decrypted += String.fromCharCode(charCode ^ keyChar);
      }
      return decrypted;
    } catch {
      return 'Invalid encrypted text';
    }
  };

  const encrypt = () => {
    if (!text || !key) {
      toast.error('Please enter text and key');
      return;
    }
    setResult(simpleEncrypt(text, key));
    toast.success('Text encrypted!');
  };

  const decrypt = () => {
    if (!text || !key) {
      toast.error('Please enter encrypted text and key');
      return;
    }
    setResult(simpleDecrypt(text, key));
    toast.success('Text decrypted!');
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Text Encryption Tool</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Encrypt/Decrypt Text</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Enter encryption key..."
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
          
          <Textarea
            placeholder="Enter text to encrypt/decrypt..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
          />
          
          <div className="flex gap-2">
            <Button onClick={encrypt} className="flex-1">
              <Lock className="h-4 w-4 mr-2" />Encrypt
            </Button>
            <Button onClick={decrypt} variant="outline" className="flex-1">
              <Unlock className="h-4 w-4 mr-2" />Decrypt
            </Button>
          </div>

          {result && (
            <div className="space-y-2">
              <h3 className="font-medium">Result</h3>
              <Textarea value={result} readOnly rows={6} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}