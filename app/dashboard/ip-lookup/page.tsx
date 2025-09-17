'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe } from 'lucide-react';
import { toast } from 'sonner';

export default function IPLookup() {
  const [ip, setIp] = useState('');
  const [ipInfo, setIpInfo] = useState<any>(null);
  const [myIP, setMyIP] = useState('');

  const lookupIP = async () => {
    if (!ip) {
      toast.error('Please enter an IP address');
      return;
    }

    // Simulate IP lookup (in real app, use IP geolocation API)
    setIpInfo({
      ip: ip,
      country: 'United States',
      region: 'California',
      city: 'San Francisco',
      isp: 'Example ISP',
      timezone: 'America/Los_Angeles'
    });
    toast.success('IP information retrieved!');
  };

  const getMyIP = async () => {
    // Simulate getting user's IP
    setMyIP('192.168.1.1');
    toast.success('Your IP address retrieved!');
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">IP Address Lookup</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              IP Lookup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter IP address (e.g., 8.8.8.8)"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
              />
              <Button onClick={lookupIP}>Lookup</Button>
            </div>
            
            <Button onClick={getMyIP} variant="outline" className="w-full">
              Get My IP Address
            </Button>

            {myIP && (
              <div className="p-4 bg-muted rounded">
                <strong>Your IP Address:</strong> {myIP}
              </div>
            )}
          </CardContent>
        </Card>

        {ipInfo && (
          <Card>
            <CardHeader>
              <CardTitle>IP Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <strong>IP Address:</strong> {ipInfo.ip}
                </div>
                <div>
                  <strong>Country:</strong> {ipInfo.country}
                </div>
                <div>
                  <strong>Region:</strong> {ipInfo.region}
                </div>
                <div>
                  <strong>City:</strong> {ipInfo.city}
                </div>
                <div>
                  <strong>ISP:</strong> {ipInfo.isp}
                </div>
                <div>
                  <strong>Timezone:</strong> {ipInfo.timezone}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}