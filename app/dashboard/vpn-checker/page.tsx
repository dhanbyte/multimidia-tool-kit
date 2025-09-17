'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Globe, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function VPNChecker() {
  const [vpnInfo, setVpnInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkVPN = async () => {
    setLoading(true);
    
    // Simulate VPN detection
    setTimeout(() => {
      setVpnInfo({
        ip: '192.168.1.1',
        country: 'United States',
        city: 'New York',
        isVPN: Math.random() > 0.5,
        isTor: false,
        isProxy: false
      });
      setLoading(false);
      toast.success('VPN status checked!');
    }, 2000);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">VPN & Proxy Checker</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Check VPN Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={checkVPN} disabled={loading} className="w-full">
            {loading ? 'Checking...' : 'Check My Connection'}
          </Button>

          {vpnInfo && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium">IP Address</div>
                  <div className="text-sm text-muted-foreground">{vpnInfo.ip}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Location</div>
                  <div className="text-sm text-muted-foreground">{vpnInfo.city}, {vpnInfo.country}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className={`p-3 rounded-lg flex items-center gap-2 ${vpnInfo.isVPN ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <Shield className={`h-4 w-4 ${vpnInfo.isVPN ? 'text-green-600' : 'text-red-600'}`} />
                  <span className={`text-sm ${vpnInfo.isVPN ? 'text-green-600' : 'text-red-600'}`}>
                    {vpnInfo.isVPN ? 'VPN Detected' : 'No VPN Detected'}
                  </span>
                </div>

                <div className={`p-3 rounded-lg flex items-center gap-2 ${vpnInfo.isTor ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50 border border-gray-200'}`}>
                  <Eye className={`h-4 w-4 ${vpnInfo.isTor ? 'text-yellow-600' : 'text-gray-600'}`} />
                  <span className={`text-sm ${vpnInfo.isTor ? 'text-yellow-600' : 'text-gray-600'}`}>
                    {vpnInfo.isTor ? 'Tor Network Detected' : 'No Tor Network'}
                  </span>
                </div>

                <div className={`p-3 rounded-lg flex items-center gap-2 ${vpnInfo.isProxy ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50 border border-gray-200'}`}>
                  <Globe className={`h-4 w-4 ${vpnInfo.isProxy ? 'text-orange-600' : 'text-gray-600'}`} />
                  <span className={`text-sm ${vpnInfo.isProxy ? 'text-orange-600' : 'text-gray-600'}`}>
                    {vpnInfo.isProxy ? 'Proxy Detected' : 'No Proxy'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}