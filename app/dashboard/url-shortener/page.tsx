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
    if (typeof window === 'undefined') return;
    
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
    if (typeof window === 'undefined') return;
    
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
                    <span className="text-sm text-muted-foreground">{typeof window !== 'undefined' ? window.location.origin : ''}/s/</span>
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
      
      {/* Comprehensive Usage Guide */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Complete URL Shortener Guide</CardTitle>
          <CardDescription>
            Everything you need to know about creating and managing short URLs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="guide" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="guide">Quick Guide</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="tips">Pro Tips</TabsTrigger>
              <TabsTrigger value="troubleshoot">Troubleshoot</TabsTrigger>
            </TabsList>
            
            <TabsContent value="guide" className="space-y-4">
              <h3 className="text-xl font-semibold">🚀 How to Create Short URLs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2 text-blue-600">📝 Step-by-Step Process</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li><strong>Enter URL:</strong> Paste your long URL in the input field</li>
                    <li><strong>Custom Alias:</strong> Optionally add a custom short code</li>
                    <li><strong>Generate:</strong> Click "Shorten URL" to create your link</li>
                    <li><strong>Copy & Share:</strong> Copy the short URL and use it anywhere</li>
                    <li><strong>Track Performance:</strong> Monitor clicks in the Analytics tab</li>
                  </ol>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2 text-green-600">✅ URL Requirements</h4>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li><strong>Valid Format:</strong> Must include http:// or https://</li>
                    <li><strong>Working Link:</strong> URL should be accessible online</li>
                    <li><strong>No Malware:</strong> Only legitimate, safe websites</li>
                    <li><strong>Custom Alias:</strong> 3-20 characters, letters/numbers/hyphens only</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="features" className="space-y-4">
              <h3 className="text-xl font-semibold">🛠️ Advanced Features</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-purple-600">🎯 Custom Aliases</h4>
                  <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li><strong>Branded Links:</strong> Create memorable, brand-consistent URLs</li>
                      <li><strong>Campaign Tracking:</strong> Use descriptive aliases for marketing</li>
                      <li><strong>Easy Sharing:</strong> Short, meaningful links are easier to share</li>
                      <li><strong>Professional Look:</strong> Custom aliases look more professional</li>
                    </ul>
                    <div className="mt-3 p-2 bg-purple-50 dark:bg-purple-950 rounded">
                      <p className="text-xs text-purple-700 dark:text-purple-300">
                        <strong>Example:</strong> yoursite.com/s/summer-sale instead of yoursite.com/s/x7k9m2
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-orange-600">📊 Click Analytics</h4>
                  <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li><strong>Real-time Tracking:</strong> See clicks as they happen</li>
                      <li><strong>Total Clicks:</strong> Track overall performance</li>
                      <li><strong>Top Performers:</strong> Identify your best-performing links</li>
                      <li><strong>Historical Data:</strong> View creation dates and trends</li>
                    </ul>
                    <div className="mt-3 p-2 bg-orange-50 dark:bg-orange-950 rounded">
                      <p className="text-xs text-orange-700 dark:text-orange-300">
                        <strong>Note:</strong> Analytics are stored locally and reset if you clear browser data
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-cyan-600">💾 Local Storage</h4>
                  <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li><strong>Privacy First:</strong> All data stored locally in your browser</li>
                      <li><strong>No Registration:</strong> No account needed, works immediately</li>
                      <li><strong>Persistent History:</strong> URLs saved across browser sessions</li>
                      <li><strong>Offline Access:</strong> View history even without internet</li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-red-600">🔧 Management Tools</h4>
                  <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li><strong>Delete URLs:</strong> Remove unwanted short links</li>
                      <li><strong>Clear History:</strong> Start fresh with one click</li>
                      <li><strong>Test Links:</strong> Verify URLs work before sharing</li>
                      <li><strong>Copy to Clipboard:</strong> Quick sharing with one click</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="tips" className="space-y-4">
              <h3 className="text-xl font-semibold">💡 Pro Tips & Best Practices</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-medium text-green-800 dark:text-green-200 mb-3">✅ Best Practices</h4>
                  <ul className="text-sm space-y-2 text-green-700 dark:text-green-300">
                    <li>• <strong>Test First:</strong> Always test your short URLs before sharing</li>
                    <li>• <strong>Descriptive Aliases:</strong> Use meaningful custom aliases</li>
                    <li>• <strong>Keep Records:</strong> Note what each short URL is for</li>
                    <li>• <strong>Monitor Performance:</strong> Check analytics regularly</li>
                    <li>• <strong>Clean Up:</strong> Delete unused URLs periodically</li>
                    <li>• <strong>Backup Important URLs:</strong> Save critical links elsewhere</li>
                  </ul>
                </div>
                
                <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg border border-red-200 dark:border-red-800">
                  <h4 className="font-medium text-red-800 dark:text-red-200 mb-3">❌ Common Mistakes</h4>
                  <ul className="text-sm space-y-2 text-red-700 dark:text-red-300">
                    <li>• <strong>Invalid URLs:</strong> Forgetting http:// or https://</li>
                    <li>• <strong>Duplicate Aliases:</strong> Using the same custom alias twice</li>
                    <li>• <strong>Too Long Aliases:</strong> Defeating the purpose of short URLs</li>
                    <li>• <strong>Special Characters:</strong> Using invalid characters in aliases</li>
                    <li>• <strong>Not Testing:</strong> Sharing broken or incorrect links</li>
                    <li>• <strong>Ignoring Analytics:</strong> Missing valuable performance data</li>
                  </ul>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3 text-indigo-600">🎯 Use Cases & Applications</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                    <h5 className="font-medium mb-2">📱 Social Media</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Twitter character limits</li>
                      <li>• Instagram bio links</li>
                      <li>• Facebook post sharing</li>
                      <li>• LinkedIn article links</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                    <h5 className="font-medium mb-2">📧 Email Marketing</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Newsletter campaigns</li>
                      <li>• Product promotions</li>
                      <li>• Event invitations</li>
                      <li>• Survey distribution</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                    <h5 className="font-medium mb-2">🖨️ Print Materials</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Business cards</li>
                      <li>• Flyers and brochures</li>
                      <li>• QR code generation</li>
                      <li>• Presentation slides</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="troubleshoot" className="space-y-4">
              <h3 className="text-xl font-semibold">🔧 Troubleshooting Guide</h3>
              
              <div className="space-y-6">
                <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg border border-red-200 dark:border-red-800">
                  <h4 className="font-semibold text-red-800 dark:text-red-200 mb-3">🚨 DNS_PROBE_FINISHED_NXDOMAIN Error</h4>
                  <div className="space-y-3">
                    <p className="text-sm text-red-700 dark:text-red-300">
                      <strong>Problem:</strong> Old short URLs using fake "short.ly" domain don't work
                    </p>
                    <div className="bg-white dark:bg-gray-900 p-3 rounded border">
                      <p className="text-sm font-medium mb-2">Solutions:</p>
                      <ol className="list-decimal list-inside space-y-1 text-sm">
                        <li>Click "Clear Old URLs" button to remove broken links</li>
                        <li>Create new short URLs (they'll use the correct domain)</li>
                        <li>Old URLs are automatically migrated when you visit the page</li>
                        <li>New URLs use your actual website domain and work properly</li>
                      </ol>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-3">⚠️ Common Issues</h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="font-medium">Short URL doesn't work:</p>
                        <ul className="list-disc list-inside ml-2 text-yellow-700 dark:text-yellow-300">
                          <li>Check if original URL is valid</li>
                          <li>Ensure URL includes http:// or https://</li>
                          <li>Test the original URL first</li>
                        </ul>
                      </div>
                      
                      <div>
                        <p className="font-medium">Custom alias rejected:</p>
                        <ul className="list-disc list-inside ml-2 text-yellow-700 dark:text-yellow-300">
                          <li>Alias might already exist</li>
                          <li>Use only letters, numbers, hyphens</li>
                          <li>Keep it between 3-20 characters</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">💡 Quick Fixes</h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="font-medium">Lost URL history:</p>
                        <ul className="list-disc list-inside ml-2 text-blue-700 dark:text-blue-300">
                          <li>Check if browser data was cleared</li>
                          <li>URLs are stored locally only</li>
                          <li>Create new URLs if needed</li>
                        </ul>
                      </div>
                      
                      <div>
                        <p className="font-medium">Analytics not updating:</p>
                        <ul className="list-disc list-inside ml-2 text-blue-700 dark:text-blue-300">
                          <li>Refresh the page</li>
                          <li>Click tracking works in real-time</li>
                          <li>Check if JavaScript is enabled</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3">✅ What's Fixed in This Version</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium mb-2">Technical Improvements:</p>
                      <ul className="list-disc list-inside space-y-1 text-green-700 dark:text-green-300">
                        <li>Removed fake "short.ly" domain</li>
                        <li>Uses actual website domain for redirects</li>
                        <li>Proper redirect system implementation</li>
                        <li>Real-time click tracking</li>
                      </ul>
                    </div>
                    
                    <div>
                      <p className="font-medium mb-2">User Experience:</p>
                      <ul className="list-disc list-inside space-y-1 text-green-700 dark:text-green-300">
                        <li>Automatic migration of old URLs</li>
                        <li>Clear error messages and solutions</li>
                        <li>One-click fix for DNS issues</li>
                        <li>Comprehensive analytics dashboard</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}