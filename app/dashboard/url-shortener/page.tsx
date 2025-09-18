'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Link, ExternalLink, BarChart3, History, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface ShortenedUrl {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
}

export default function URLShortener() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [urlHistory, setUrlHistory] = useState<ShortenedUrl[]>([]);
  const [customAlias, setCustomAlias] = useState('');

  useEffect(() => {
    loadUrlHistory();
    migrateOldUrls();
  }, []);

  const migrateOldUrls = () => {
    const saved = localStorage.getItem('url-shortener-history');
    if (saved) {
      try {
        const urlHistory: ShortenedUrl[] = JSON.parse(saved);
        const currentDomain = window.location.origin;
        
        // Check if any URLs use old short.ly domain
        const hasOldUrls = urlHistory.some(url => url.shortUrl.includes('short.ly'));
        
        if (hasOldUrls) {
          // Update all URLs to use current domain
          const updatedHistory = urlHistory.map(url => ({
            ...url,
            shortUrl: `${currentDomain}/s/${url.shortCode}`
          }));
          
          localStorage.setItem('url-shortener-history', JSON.stringify(updatedHistory));
          setUrlHistory(updatedHistory);
          toast.success('Fixed old short URLs to use correct domain!');
        }
      } catch (error) {
        // If there's any error with old data, clear it
        localStorage.removeItem('url-shortener-history');
        setUrlHistory([]);
      }
    }
  };

  const loadUrlHistory = () => {
    const saved = localStorage.getItem('url-shortener-history');
    if (saved) {
      setUrlHistory(JSON.parse(saved));
    }
  };

  const saveUrlHistory = (urls: ShortenedUrl[]) => {
    localStorage.setItem('url-shortener-history', JSON.stringify(urls));
    setUrlHistory(urls);
  };

  const generateShortCode = () => {
    return Math.random().toString(36).substring(2, 8);
  };

  const generateShortUrl = () => {
    if (!longUrl.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    if (!isValidUrl(longUrl)) {
      toast.error('Please enter a valid URL');
      return;
    }

    // Check if custom alias is already used
    if (customAlias && urlHistory.some(url => url.shortCode === customAlias)) {
      toast.error('Custom alias already exists. Please choose another.');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      const shortCode = customAlias || generateShortCode();
      const currentDomain = window.location.origin;
      const newShortUrl = `${currentDomain}/s/${shortCode}`;
      
      const newUrl: ShortenedUrl = {
        id: Date.now().toString(),
        originalUrl: longUrl,
        shortCode,
        shortUrl: newShortUrl,
        clicks: 0,
        createdAt: new Date().toISOString()
      };
      
      const updatedHistory = [newUrl, ...urlHistory];
      saveUrlHistory(updatedHistory);
      
      setShortUrl(newShortUrl);
      setIsLoading(false);
      setCustomAlias('');
      toast.success('URL shortened successfully!');
    }, 500);
  };

  const handleRedirect = (shortCode: string) => {
    const urlData = urlHistory.find(url => url.shortCode === shortCode);
    if (urlData) {
      // Update click count
      const updatedHistory = urlHistory.map(url => 
        url.shortCode === shortCode 
          ? { ...url, clicks: url.clicks + 1 }
          : url
      );
      saveUrlHistory(updatedHistory);
      
      // Redirect to original URL
      window.open(urlData.originalUrl, '_blank');
    }
  };

  const deleteUrl = (id: string) => {
    const updatedHistory = urlHistory.filter(url => url.id !== id);
    saveUrlHistory(updatedHistory);
    toast.success('URL deleted successfully!');
  };

  const clearHistory = () => {
    localStorage.removeItem('url-shortener-history');
    setUrlHistory([]);
    toast.success('History cleared!');
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

  const getTotalClicks = () => {
    return urlHistory.reduce((total, url) => total + url.clicks, 0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Professional URL Shortener</h1>
        <p className="text-muted-foreground">
          Create short, trackable links with custom aliases and detailed analytics
        </p>
      </div>

      <Tabs defaultValue="shorten" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="shorten">Shorten URL</TabsTrigger>
          <TabsTrigger value="history">History ({urlHistory.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="shorten">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* URL Shortener Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="h-5 w-5" />
                  Create Short URL
                </CardTitle>
                <CardDescription>
                  Enter a long URL and optionally customize the short link
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Original URL *</label>
                  <Input
                    placeholder="https://example.com/very/long/url/path"
                    value={longUrl}
                    onChange={(e) => setLongUrl(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Custom Alias (Optional)</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{window.location.origin}/s/</span>
                    <Input
                      placeholder="my-link"
                      value={customAlias}
                      onChange={(e) => setCustomAlias(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      maxLength={20}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Leave empty for auto-generated code
                  </p>
                </div>

                <Button 
                  onClick={generateShortUrl} 
                  disabled={isLoading || !longUrl.trim()}
                  className="w-full"
                >
                  {isLoading ? 'Creating Short URL...' : 'Shorten URL'}
                </Button>
              </CardContent>
            </Card>

            {/* Result Display */}
            <Card>
              <CardHeader>
                <CardTitle>Your Short URL</CardTitle>
              </CardHeader>
              <CardContent>
                {shortUrl ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-green-800 dark:text-green-200">
                          Shortened URL
                        </label>
                        <div className="flex gap-2">
                          <Input 
                            value={shortUrl} 
                            readOnly 
                            className="bg-white dark:bg-gray-900"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => copyToClipboard(shortUrl)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center space-y-2">
                      <Button
                        onClick={() => {
                          const shortCode = shortUrl.split('/s/')[1];
                          handleRedirect(shortCode);
                        }}
                        className="w-full"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Test Short URL
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        This will open the original URL in a new tab
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Link className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Your shortened URL will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  URL History
                </div>
                {urlHistory.length > 0 && (
                  <Button variant="outline" size="sm" onClick={clearHistory}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {urlHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No URLs shortened yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {urlHistory.map((url) => (
                    <div key={url.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">Short URL:</span>
                            <code className="text-sm bg-muted px-2 py-1 rounded">
                              {url.shortUrl}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(url.shortUrl)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <strong>Original:</strong> {url.originalUrl}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Created: {formatDate(url.createdAt)}</span>
                            <Badge variant="secondary">{url.clicks} clicks</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRedirect(url.shortCode)}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteUrl(url.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Total URLs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{urlHistory.length}</div>
                <p className="text-sm text-muted-foreground">URLs created</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  Total Clicks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{getTotalClicks()}</div>
                <p className="text-sm text-muted-foreground">Total redirects</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="h-5 w-5" />
                  Average CTR
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {urlHistory.length > 0 ? Math.round(getTotalClicks() / urlHistory.length) : 0}
                </div>
                <p className="text-sm text-muted-foreground">Clicks per URL</p>
              </CardContent>
            </Card>
          </div>
          
          {urlHistory.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Top Performing URLs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {urlHistory
                    .sort((a, b) => b.clicks - a.clicks)
                    .slice(0, 5)
                    .map((url) => (
                      <div key={url.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex-1">
                          <div className="font-medium text-sm truncate">
                            {url.originalUrl}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {url.shortUrl}
                          </div>
                        </div>
                        <Badge variant="secondary">{url.clicks} clicks</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Demo & Instructions */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">✅ DNS Issue Fixed!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
              <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">❌ Old (Broken):</h4>
              <code className="text-sm">https://short.ly/abc123</code>
              <p className="text-xs text-red-600 mt-1">DNS_PROBE_FINISHED_NXDOMAIN</p>
            </div>
            
            <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">✅ New (Working):</h4>
              <code className="text-sm">{typeof window !== 'undefined' ? window.location.origin : 'yoursite.com'}/s/abc123</code>
              <p className="text-xs text-green-600 mt-1">Fully functional redirect</p>
            </div>
            
            <div className="mt-4">
              <Button 
                onClick={() => {
                  localStorage.removeItem('url-shortener-history');
                  setUrlHistory([]);
                  setShortUrl('');
                  toast.success('Cleared all old URLs! Create new ones to avoid DNS errors.');
                }}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Clear Old URLs (Fix DNS Errors)
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p><strong>What was fixed:</strong></p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Removed fake "short.ly" domain</li>
                <li>Now uses your actual website domain</li>
                <li>Created proper redirect system</li>
                <li>Added click tracking functionality</li>
                <li>Auto-migrates old URLs on page load</li>
              </ul>
              
              <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded">
                <p className="text-xs text-yellow-800 dark:text-yellow-200">
                  <strong>Still getting DNS errors?</strong> Click "Clear Old URLs" button above to remove any cached broken links.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>How to Use Your Short URLs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">📊 Click Tracking</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Every click on your short URLs is automatically tracked. View detailed analytics 
                in the Analytics tab to monitor performance.
              </p>
              
              <h3 className="font-semibold mb-2">🎯 Custom Aliases</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Create memorable short URLs with custom aliases. Perfect for branding 
                and marketing campaigns.
              </p>
              
              <h3 className="font-semibold mb-2">💾 Local Storage</h3>
              <p className="text-sm text-muted-foreground">
                All your URLs are saved locally in your browser. Your data stays private 
                and accessible across sessions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}