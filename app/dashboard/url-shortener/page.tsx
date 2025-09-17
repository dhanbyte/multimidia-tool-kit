'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Link, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export default function URLShortener() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateShortUrl = () => {
    if (!longUrl.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    if (!isValidUrl(longUrl)) {
      toast.error('Please enter a valid URL');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call - replace with actual URL shortening service
    setTimeout(() => {
      const shortCode = Math.random().toString(36).substring(2, 8);
      setShortUrl(`https://short.ly/${shortCode}`);
      setIsLoading(false);
      toast.success('URL shortened successfully!');
    }, 1000);
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">URL Shortener</h1>
        <p className="text-muted-foreground">
          Shorten long URLs to make them easier to share
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Shorten Your URL
          </CardTitle>
          <CardDescription>
            Enter a long URL to get a shortened version
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Long URL</label>
            <Input
              placeholder="https://example.com/very/long/url/path"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
            />
          </div>

          <Button 
            onClick={generateShortUrl} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Shortening...' : 'Shorten URL'}
          </Button>

          {shortUrl && (
            <div className="space-y-2 p-4 bg-muted rounded-lg">
              <label className="text-sm font-medium">Shortened URL</label>
              <div className="flex gap-2">
                <Input value={shortUrl} readOnly />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(shortUrl)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => window.open(shortUrl, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}