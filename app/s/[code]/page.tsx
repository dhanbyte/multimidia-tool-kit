'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';

interface ShortenedUrl {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
}

export default function RedirectPage() {
  const params = useParams();
  const shortCode = params.code as string;
  const [urlData, setUrlData] = useState<ShortenedUrl | null>(null);
  const [countdown, setCountdown] = useState(5);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!shortCode) return;

    // Load URL data from localStorage
    const saved = localStorage.getItem('url-shortener-history');
    if (saved) {
      const urlHistory: ShortenedUrl[] = JSON.parse(saved);
      const foundUrl = urlHistory.find(url => url.shortCode === shortCode);
      
      if (foundUrl) {
        setUrlData(foundUrl);
        
        // Update click count
        const updatedHistory = urlHistory.map(url => 
          url.shortCode === shortCode 
            ? { ...url, clicks: url.clicks + 1 }
            : url
        );
        localStorage.setItem('url-shortener-history', JSON.stringify(updatedHistory));
        
        // Start countdown
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              redirectToUrl(foundUrl.originalUrl);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(timer);
      }
    }
  }, [shortCode]);

  const redirectToUrl = (url: string) => {
    setRedirecting(true);
    // Ensure URL has protocol
    const finalUrl = url.startsWith('http') ? url : `https://${url}`;
    window.location.href = finalUrl;
  };

  const redirectNow = () => {
    if (urlData) {
      redirectToUrl(urlData.originalUrl);
    }
  };

  if (!urlData) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-red-600">Short URL Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              The short URL <code className="bg-muted px-2 py-1 rounded">{shortCode}</code> does not exist or has been deleted.
            </p>
            <Link href="/dashboard/url-shortener">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Create New Short URL
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Redirecting...</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-2">
            <p className="text-muted-foreground">You will be redirected to:</p>
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-medium break-all">{urlData.originalUrl}</p>
            </div>
          </div>

          <div className="space-y-4">
            {!redirecting && countdown > 0 && (
              <div className="flex items-center justify-center gap-2 text-lg">
                <Clock className="h-5 w-5" />
                <span>Redirecting in {countdown} seconds...</span>
              </div>
            )}

            {redirecting && (
              <div className="text-lg text-green-600">
                Redirecting now...
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <Button onClick={redirectNow} disabled={redirecting}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Go Now
              </Button>
              <Link href="/dashboard/url-shortener">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Shortener
                </Button>
              </Link>
            </div>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>Short URL: <code>{urlData.shortUrl}</code></p>
            <p>Clicks: {urlData.clicks + 1}</p>
            <p>Created: {new Date(urlData.createdAt).toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}