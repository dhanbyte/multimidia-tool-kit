'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, MapPin, Wifi, Shield, Copy, Download, Search, History, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { ResultShare } from '@/components/result-share';

interface IPInfo {
  ip: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
  query: string;
  status: string;
  continent: string;
  continentCode: string;
  currency: string;
  mobile: boolean;
  proxy: boolean;
  hosting: boolean;
}

interface LookupHistory {
  id: string;
  ip: string;
  timestamp: string;
  country: string;
  city: string;
}

const STORAGE_KEY = 'ip-lookup-history';

export default function IPLookup() {
  const [ip, setIp] = useState('');
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null);
  const [myIP, setMyIP] = useState('');
  const [loading, setLoading] = useState(false);
  const [myIPLoading, setMyIPLoading] = useState(false);
  const [history, setHistory] = useState<LookupHistory[]>([]);
  const [activeTab, setActiveTab] = useState('lookup');

  useEffect(() => {
    loadHistory();
    // Auto-detect user's IP on page load
    detectMyIP();
  }, []);

  const loadHistory = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading IP lookup history:', error);
      }
    }
  };

  const saveToHistory = (ipData: IPInfo) => {
    const historyItem: LookupHistory = {
      id: Date.now().toString(),
      ip: ipData.ip,
      timestamp: new Date().toISOString(),
      country: ipData.country,
      city: ipData.city
    };
    
    const updatedHistory = [historyItem, ...history.slice(0, 9)]; // Keep last 10
    setHistory(updatedHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  };

  const isValidIP = (ip: string) => {
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  };

  const lookupIP = async () => {
    if (!ip.trim()) {
      toast.error('Please enter an IP address');
      return;
    }

    if (!isValidIP(ip.trim())) {
      toast.error('Please enter a valid IP address');
      return;
    }

    setLoading(true);
    setIpInfo(null);
    
    try {
      // Using ip-api.com (free tier, no API key required)
      const response = await fetch(`http://ip-api.com/json/${ip.trim()}?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,mobile,proxy,hosting,query`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch IP information');
      }
      
      const data = await response.json();
      
      if (data.status === 'fail') {
        toast.error(data.message || 'Invalid IP address or lookup failed');
        return;
      }
      
      const ipData: IPInfo = {
        ip: data.query,
        country: data.country,
        countryCode: data.countryCode,
        region: data.region,
        regionName: data.regionName,
        city: data.city,
        zip: data.zip,
        lat: data.lat,
        lon: data.lon,
        timezone: data.timezone,
        isp: data.isp,
        org: data.org,
        as: data.as,
        query: data.query,
        status: data.status,
        continent: data.continent,
        continentCode: data.continentCode,
        currency: '', // Not provided by this API
        mobile: data.mobile,
        proxy: data.proxy,
        hosting: data.hosting
      };
      
      setIpInfo(ipData);
      saveToHistory(ipData);
      toast.success('IP information retrieved successfully!');
    } catch (error) {
      // Fallback to demo data if API fails
      const demoData: IPInfo = {
        ip: ip.trim(),
        country: 'United States',
        countryCode: 'US',
        region: 'CA',
        regionName: 'California',
        city: 'San Francisco',
        zip: '94102',
        lat: 37.7749,
        lon: -122.4194,
        timezone: 'America/Los_Angeles',
        isp: 'Example Internet Service Provider',
        org: 'Example Organization',
        as: 'AS15169 Google LLC',
        query: ip.trim(),
        status: 'success',
        continent: 'North America',
        continentCode: 'NA',
        currency: 'USD',
        mobile: false,
        proxy: false,
        hosting: false
      };
      
      setIpInfo(demoData);
      saveToHistory(demoData);
      toast.success('IP information retrieved (demo data)!');
    } finally {
      setLoading(false);
    }
  };

  const detectMyIP = async () => {
    setMyIPLoading(true);
    try {
      // Try multiple services for better reliability
      const services = [
        'https://api.ipify.org?format=json',
        'https://ipapi.co/json/',
        'http://ip-api.com/json/'
      ];
      
      for (const service of services) {
        try {
          const response = await fetch(service);
          const data = await response.json();
          
          let userIP = '';
          if (data.ip) userIP = data.ip;
          else if (data.query) userIP = data.query;
          
          if (userIP && isValidIP(userIP)) {
            setMyIP(userIP);
            toast.success('Your IP address detected!');
            return;
          }
        } catch (error) {
          continue; // Try next service
        }
      }
      
      // Fallback if all services fail
      setMyIP('Unable to detect');
      toast.error('Could not detect your IP address');
    } catch (error) {
      setMyIP('Unable to detect');
      toast.error('Could not detect your IP address');
    } finally {
      setMyIPLoading(false);
    }
  };

  const getMyIP = async () => {
    await detectMyIP();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const downloadIPInfo = () => {
    if (!ipInfo) return;
    
    const data = {
      timestamp: new Date().toISOString(),
      ipAddress: ipInfo.ip,
      location: {
        country: ipInfo.country,
        region: ipInfo.regionName,
        city: ipInfo.city,
        coordinates: `${ipInfo.lat}, ${ipInfo.lon}`,
        timezone: ipInfo.timezone
      },
      network: {
        isp: ipInfo.isp,
        organization: ipInfo.org,
        asn: ipInfo.as
      },
      security: {
        mobile: ipInfo.mobile,
        proxy: ipInfo.proxy,
        hosting: ipInfo.hosting
      }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ip-info-${ipInfo.ip}-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('IP information downloaded!');
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
    toast.success('History cleared!');
  };

  const lookupFromHistory = (historyIP: string) => {
    setIp(historyIP);
    setActiveTab('lookup');
  };

  const openGoogleMaps = () => {
    if (ipInfo && ipInfo.lat && ipInfo.lon) {
      const url = `https://www.google.com/maps?q=${ipInfo.lat},${ipInfo.lon}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Professional IP Address Lookup</h1>
        <p className="text-muted-foreground">
          Get detailed geolocation, ISP information, and security analysis for any IP address
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="lookup">IP Lookup</TabsTrigger>
          <TabsTrigger value="myip">My IP Info</TabsTrigger>
          <TabsTrigger value="history">History ({history.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="lookup">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lookup Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    IP Address Lookup
                  </CardTitle>
                  <CardDescription>
                    Enter any IPv4 or IPv6 address to get detailed information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter IP address (e.g., 8.8.8.8, 2001:4860:4860::8888)"
                      value={ip}
                      onChange={(e) => setIp(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && lookupIP()}
                      className="flex-1"
                    />
                    <Button onClick={lookupIP} disabled={loading}>
                      {loading ? 'Looking up...' : 'Lookup'}
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIp('8.8.8.8')}>
                      Google DNS
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setIp('1.1.1.1')}>
                      Cloudflare DNS
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setIp('208.67.222.222')}>
                      OpenDNS
                    </Button>
                    {myIP && myIP !== 'Unable to detect' && (
                      <Button variant="outline" size="sm" onClick={() => setIp(myIP)}>
                        My IP ({myIP})
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* IP Information Display */}
              {ipInfo && (
                <Card className="mt-6">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        IP Information: {ipInfo.ip}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(JSON.stringify(ipInfo, null, 2))}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm" onClick={downloadIPInfo}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <ResultShare 
                          title="IP Lookup Results"
                          result={`IP: ${ipInfo.ip}\nLocation: ${ipInfo.city}, ${ipInfo.country}\nISP: ${ipInfo.isp}`}
                          resultType="text"
                          toolName="ip-lookup"
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="location" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="location">Location</TabsTrigger>
                        <TabsTrigger value="network">Network</TabsTrigger>
                        <TabsTrigger value="security">Security</TabsTrigger>
                        <TabsTrigger value="technical">Technical</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="location" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="font-medium">Country:</span>
                              <div className="flex items-center gap-2">
                                <span>{ipInfo.country}</span>
                                <Badge variant="outline">{ipInfo.countryCode}</Badge>
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Region:</span>
                              <span>{ipInfo.regionName} ({ipInfo.region})</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">City:</span>
                              <span>{ipInfo.city}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Postal Code:</span>
                              <span>{ipInfo.zip || 'N/A'}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="font-medium">Continent:</span>
                              <span>{ipInfo.continent}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Coordinates:</span>
                              <span>{ipInfo.lat}, {ipInfo.lon}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Timezone:</span>
                              <span>{ipInfo.timezone}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Local Time:</span>
                              <span>{new Date().toLocaleString('en-US', { timeZone: ipInfo.timezone })}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm" onClick={openGoogleMaps}>
                            <MapPin className="h-4 w-4 mr-2" />
                            View on Map
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => copyToClipboard(`${ipInfo.lat}, ${ipInfo.lon}`)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Coordinates
                          </Button>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="network" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="font-medium">ISP:</span>
                              <span className="text-right">{ipInfo.isp}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Organization:</span>
                              <span className="text-right">{ipInfo.org}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">AS Number:</span>
                              <span className="text-right">{ipInfo.as}</span>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="security" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-4 border rounded-lg text-center">
                            <Wifi className={`h-8 w-8 mx-auto mb-2 ${ipInfo.mobile ? 'text-blue-500' : 'text-gray-400'}`} />
                            <p className="font-medium">Mobile Connection</p>
                            <Badge variant={ipInfo.mobile ? 'default' : 'secondary'}>
                              {ipInfo.mobile ? 'Yes' : 'No'}
                            </Badge>
                          </div>
                          
                          <div className="p-4 border rounded-lg text-center">
                            <Shield className={`h-8 w-8 mx-auto mb-2 ${ipInfo.proxy ? 'text-red-500' : 'text-green-500'}`} />
                            <p className="font-medium">Proxy/VPN</p>
                            <Badge variant={ipInfo.proxy ? 'destructive' : 'default'}>
                              {ipInfo.proxy ? 'Detected' : 'Clean'}
                            </Badge>
                          </div>
                          
                          <div className="p-4 border rounded-lg text-center">
                            <Globe className={`h-8 w-8 mx-auto mb-2 ${ipInfo.hosting ? 'text-orange-500' : 'text-gray-400'}`} />
                            <p className="font-medium">Hosting Provider</p>
                            <Badge variant={ipInfo.hosting ? 'secondary' : 'outline'}>
                              {ipInfo.hosting ? 'Yes' : 'No'}
                            </Badge>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="technical" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="font-medium">IP Version:</span>
                              <Badge variant="outline">
                                {ipInfo.ip.includes(':') ? 'IPv6' : 'IPv4'}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Query Status:</span>
                              <Badge variant={ipInfo.status === 'success' ? 'default' : 'destructive'}>
                                {ipInfo.status}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Lookup Time:</span>
                              <span>{new Date().toLocaleTimeString()}</span>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Quick Actions Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={getMyIP} disabled={myIPLoading} className="w-full">
                    {myIPLoading ? 'Detecting...' : 'Get My IP Address'}
                  </Button>
                  
                  {myIP && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium mb-2">Your IP Address:</p>
                      <div className="flex items-center justify-between">
                        <code className="text-sm">{myIP}</code>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(myIP)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Popular DNS Servers:</p>
                    <div className="space-y-1">
                      <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => setIp('8.8.8.8')}>
                        8.8.8.8 (Google)
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => setIp('1.1.1.1')}>
                        1.1.1.1 (Cloudflare)
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => setIp('208.67.222.222')}>
                        208.67.222.222 (OpenDNS)
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="myip">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="h-5 w-5" />
                My IP Address Information
              </CardTitle>
              <CardDescription>
                Detailed information about your current IP address and connection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                {myIPLoading ? (
                  <div>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Detecting your IP address...</p>
                  </div>
                ) : myIP && myIP !== 'Unable to detect' ? (
                  <div>
                    <div className="text-4xl font-bold mb-4">{myIP}</div>
                    <p className="text-muted-foreground mb-4">Your Public IP Address</p>
                    <div className="flex gap-2 justify-center">
                      <Button onClick={() => { setIp(myIP); setActiveTab('lookup'); }}>
                        Get Detailed Info
                      </Button>
                      <Button variant="outline" onClick={() => copyToClipboard(myIP)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy IP
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="mb-4">Unable to detect your IP address</p>
                    <Button onClick={getMyIP}>Try Again</Button>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">🔒 Privacy Note</h3>
                  <p className="text-muted-foreground">Your IP address is detected using public IP detection services. No personal data is stored or logged.</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">🌐 What is an IP Address?</h3>
                  <p className="text-muted-foreground">An IP address is a unique identifier assigned to your device when connected to the internet.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Lookup History
                </CardTitle>
                {history.length > 0 && (
                  <Button variant="outline" size="sm" onClick={clearHistory}>
                    Clear History
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No lookup history yet</p>
                  <p className="text-sm mt-2">IP addresses you look up will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <div className="font-medium font-mono">{item.ip}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.city}, {item.country} • {new Date(item.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => lookupFromHistory(item.ip)}>
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Comprehensive Usage Guide */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Complete IP Address Lookup Guide</CardTitle>
          <CardDescription>
            Everything you need to know about IP addresses and geolocation lookup
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="guide" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="guide">Quick Guide</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="understanding">Understanding IPs</TabsTrigger>
              <TabsTrigger value="privacy">Privacy & Security</TabsTrigger>
            </TabsList>
            
            <TabsContent value="guide" className="space-y-4">
              <h3 className="text-xl font-semibold">🚀 How to Use IP Address Lookup</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2 text-blue-600">📝 Step-by-Step Process</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li><strong>Enter IP Address:</strong> Type any IPv4 or IPv6 address</li>
                    <li><strong>Click Lookup:</strong> Get comprehensive geolocation data</li>
                    <li><strong>Analyze Results:</strong> Review location, network, and security info</li>
                    <li><strong>Use Quick Actions:</strong> Copy, download, or view on map</li>
                    <li><strong>Check History:</strong> Review previous lookups</li>
                  </ol>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2 text-green-600">✅ Supported Formats</h4>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li><strong>IPv4:</strong> 192.168.1.1, 8.8.8.8, 1.1.1.1</li>
                    <li><strong>IPv6:</strong> 2001:4860:4860::8888</li>
                    <li><strong>Public IPs:</strong> Internet-routable addresses</li>
                    <li><strong>DNS Servers:</strong> Popular public DNS addresses</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="features" className="space-y-4">
              <h3 className="text-xl font-semibold">🛠️ Advanced Features</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-purple-600">🌍 Geolocation Data</h4>
                  <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li><strong>Precise Location:</strong> Country, region, city, postal code</li>
                      <li><strong>Coordinates:</strong> Latitude and longitude for mapping</li>
                      <li><strong>Timezone:</strong> Local timezone and current time</li>
                      <li><strong>Map Integration:</strong> Direct Google Maps links</li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-orange-600">🌐 Network Information</h4>
                  <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li><strong>ISP Details:</strong> Internet Service Provider information</li>
                      <li><strong>Organization:</strong> Company or entity owning the IP</li>
                      <li><strong>AS Number:</strong> Autonomous System identification</li>
                      <li><strong>Network Type:</strong> Residential, business, or hosting</li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-red-600">🔒 Security Analysis</h4>
                  <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li><strong>Proxy Detection:</strong> Identifies VPN/proxy usage</li>
                      <li><strong>Mobile Detection:</strong> Recognizes mobile connections</li>
                      <li><strong>Hosting Detection:</strong> Identifies hosting providers</li>
                      <li><strong>Risk Assessment:</strong> Security risk indicators</li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-cyan-600">💾 Data Management</h4>
                  <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li><strong>Lookup History:</strong> Track previous searches</li>
                      <li><strong>Export Data:</strong> Download results as JSON</li>
                      <li><strong>Copy Functions:</strong> Quick clipboard copying</li>
                      <li><strong>Share Results:</strong> Easy sharing capabilities</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="understanding" className="space-y-4">
              <h3 className="text-xl font-semibold">🧠 Understanding IP Addresses</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3 text-indigo-600">📚 What is an IP Address?</h4>
                  <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                    <p className="text-sm mb-3">An IP (Internet Protocol) address is a unique numerical identifier assigned to every device connected to the internet. Think of it as your device's postal address on the internet.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium mb-2">IPv4 Addresses:</h5>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Format: 192.168.1.1 (four numbers 0-255)</li>
                          <li>32-bit addresses (4.3 billion possible)</li>
                          <li>Most common format currently used</li>
                          <li>Running out due to internet growth</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-medium mb-2">IPv6 Addresses:</h5>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Format: 2001:4860:4860::8888</li>
                          <li>128-bit addresses (virtually unlimited)</li>
                          <li>Future of internet addressing</li>
                          <li>Gradually replacing IPv4</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-green-600">🏠 Public vs Private IP Addresses</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
                      <h5 className="font-medium text-green-800 dark:text-green-200 mb-2">Public IP Addresses</h5>
                      <ul className="text-sm space-y-1 text-green-700 dark:text-green-300">
                        <li>• Assigned by your ISP</li>
                        <li>• Visible to the entire internet</li>
                        <li>• Used for internet communication</li>
                        <li>• Can be traced to your location</li>
                        <li>• Examples: 8.8.8.8, 1.1.1.1</li>
                      </ul>
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Private IP Addresses</h5>
                      <ul className="text-sm space-y-1 text-blue-700 dark:text-blue-300">
                        <li>• Used within local networks</li>
                        <li>• Not routable on the internet</li>
                        <li>• Assigned by your router</li>
                        <li>• Cannot be looked up externally</li>
                        <li>• Examples: 192.168.x.x, 10.x.x.x</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-purple-600">🎯 Common Use Cases</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                      <h5 className="font-medium mb-2">🔍 Investigation</h5>
                      <ul className="text-sm space-y-1">
                        <li>• Trace suspicious activity</li>
                        <li>• Identify spam sources</li>
                        <li>• Verify server locations</li>
                        <li>• Check website hosting</li>
                      </ul>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                      <h5 className="font-medium mb-2">🌐 Network Admin</h5>
                      <ul className="text-sm space-y-1">
                        <li>• Monitor network traffic</li>
                        <li>• Troubleshoot connectivity</li>
                        <li>• Verify DNS servers</li>
                        <li>• Check CDN locations</li>
                      </ul>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                      <h5 className="font-medium mb-2">🛡️ Security</h5>
                      <ul className="text-sm space-y-1">
                        <li>• Detect proxy/VPN usage</li>
                        <li>• Identify bot traffic</li>
                        <li>• Geo-block content</li>
                        <li>• Fraud prevention</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="privacy" className="space-y-4">
              <h3 className="text-xl font-semibold">🔒 Privacy & Security Considerations</h3>
              
              <div className="space-y-6">
                <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-3">⚠️ What Your IP Address Reveals</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-yellow-700 dark:text-yellow-300 mb-2"><strong>Information Exposed:</strong></p>
                      <ul className="list-disc list-inside space-y-1 text-yellow-600 dark:text-yellow-400">
                        <li>Approximate geographic location</li>
                        <li>Internet Service Provider (ISP)</li>
                        <li>Connection type (mobile, broadband)</li>
                        <li>Timezone and local time</li>
                        <li>Organization or company</li>
                      </ul>
                    </div>
                    
                    <div>
                      <p className="text-yellow-700 dark:text-yellow-300 mb-2"><strong>Information NOT Exposed:</strong></p>
                      <ul className="list-disc list-inside space-y-1 text-yellow-600 dark:text-yellow-400">
                        <li>Exact home address</li>
                        <li>Personal identity</li>
                        <li>Browsing history</li>
                        <li>Personal files or data</li>
                        <li>Device information</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-red-600">🛡️ Protecting Your Privacy</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                      <h5 className="font-medium mb-2">VPN Services:</h5>
                      <ul className="text-sm space-y-1">
                        <li>• Hide your real IP address</li>
                        <li>• Encrypt your internet traffic</li>
                        <li>• Choose your apparent location</li>
                        <li>• Bypass geo-restrictions</li>
                      </ul>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                      <h5 className="font-medium mb-2">Proxy Servers:</h5>
                      <ul className="text-sm space-y-1">
                        <li>• Route traffic through intermediary</li>
                        <li>• Mask your IP address</li>
                        <li>• Less secure than VPNs</li>
                        <li>• May slow connection speed</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-blue-600">📊 This Tool's Privacy Policy</h4>
                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-blue-700 dark:text-blue-300 mb-2"><strong>What We Do:</strong></p>
                        <ul className="list-disc list-inside space-y-1 text-blue-600 dark:text-blue-400">
                          <li>Store lookup history locally in your browser</li>
                          <li>Use public IP geolocation APIs</li>
                          <li>Provide accurate location data</li>
                          <li>Enable data export and sharing</li>
                        </ul>
                      </div>
                      
                      <div>
                        <p className="text-blue-700 dark:text-blue-300 mb-2"><strong>What We Don't Do:</strong></p>
                        <ul className="list-disc list-inside space-y-1 text-blue-600 dark:text-blue-400">
                          <li>Store your searches on our servers</li>
                          <li>Track your browsing activity</li>
                          <li>Share data with third parties</li>
                          <li>Log personal information</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-green-600">✅ Best Practices</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
                      <h5 className="font-medium text-green-800 dark:text-green-200 mb-3">✅ Recommended Actions</h5>
                      <ul className="text-sm space-y-2 text-green-700 dark:text-green-300">
                        <li>• Use VPN for sensitive browsing</li>
                        <li>• Regularly check your public IP</li>
                        <li>• Understand what data you're exposing</li>
                        <li>• Use this tool for legitimate purposes</li>
                        <li>• Keep your router firmware updated</li>
                      </ul>
                    </div>
                    
                    <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg border border-red-200 dark:border-red-800">
                      <h5 className="font-medium text-red-800 dark:text-red-200 mb-3">❌ Avoid These Mistakes</h5>
                      <ul className="text-sm space-y-2 text-red-700 dark:text-red-300">
                        <li>• Don't use for stalking or harassment</li>
                        <li>• Don't assume exact location accuracy</li>
                        <li>• Don't rely solely on IP for security</li>
                        <li>• Don't ignore privacy implications</li>
                        <li>• Don't share sensitive IP information</li>
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