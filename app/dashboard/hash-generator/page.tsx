'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Hash } from 'lucide-react';
import { toast } from 'sonner';

export default function HashGenerator() {
  const [inputText, setInputText] = useState('');
  const [hashes, setHashes] = useState({
    md5: '',
    sha1: '',
    sha256: '',
    sha512: ''
  });

  // Simple hash functions (for demo - in production use crypto libraries)
  const generateMD5 = async (text: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('MD5', data).catch(() => null);
    if (!hashBuffer) return 'MD5 not supported in this browser';
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const generateSHA1 = async (text: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const generateSHA256 = async (text: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const generateSHA512 = async (text: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-512', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const generateAllHashes = async () => {
    if (!inputText.trim()) {
      toast.error('Please enter text to hash');
      return;
    }

    try {
      const [sha1, sha256, sha512] = await Promise.all([
        generateSHA1(inputText),
        generateSHA256(inputText),
        generateSHA512(inputText)
      ]);

      setHashes({
        md5: 'MD5 not available in browser (use SHA-256 instead)',
        sha1,
        sha256,
        sha512
      });

      toast.success('Hashes generated successfully!');
    } catch (error) {
      toast.error('Error generating hashes');
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(`${type} hash copied to clipboard!`);
  };

  const clearAll = () => {
    setInputText('');
    setHashes({
      md5: '',
      sha1: '',
      sha256: '',
      sha512: ''
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Hash Generator</h1>
        <p className="text-muted-foreground">
          Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Generate Hashes
          </CardTitle>
          <CardDescription>
            Enter text to generate various hash values
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Input Text</label>
            <Textarea
              placeholder="Enter your text here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={generateAllHashes} className="flex-1">
              Generate Hashes
            </Button>
            <Button variant="outline" onClick={clearAll}>
              Clear
            </Button>
          </div>

          {(hashes.sha1 || hashes.sha256 || hashes.sha512) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Generated Hashes</h3>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">SHA-1</label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(hashes.sha1, 'SHA-1')}
                      disabled={!hashes.sha1}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <Input
                    value={hashes.sha1}
                    readOnly
                    className="font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">SHA-256</label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(hashes.sha256, 'SHA-256')}
                      disabled={!hashes.sha256}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <Input
                    value={hashes.sha256}
                    readOnly
                    className="font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">SHA-512</label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(hashes.sha512, 'SHA-512')}
                      disabled={!hashes.sha512}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <Textarea
                    value={hashes.sha512}
                    readOnly
                    rows={3}
                    className="font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}