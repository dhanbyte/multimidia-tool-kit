'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wifi, Shield, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface ScanResult {
  ip: string;
  hostname: string;
  status: 'online' | 'offline';
  ports: { port: number; status: 'open' | 'closed'; service: string }[];
  os: string;
  risk: 'low' | 'medium' | 'high';
}

export default function NetworkScanner() {
  const [target, setTarget] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<ScanResult[]>([]);

  const scanNetwork = async () => {
    if (!target.trim()) {
      toast.error('Please enter IP address or hostname');
      return;
    }

    setIsScanning(true);
    
    // Simulate network scanning
    setTimeout(() => {
      const mockResults: ScanResult[] = [
        {
          ip: '192.168.1.1',
          hostname: 'router.local',
          status: 'online',
          ports: [
            { port: 80, status: 'open', service: 'HTTP' },
            { port: 443, status: 'open', service: 'HTTPS' },
            { port: 22, status: 'closed', service: 'SSH' }
          ],
          os: 'Linux',
          risk: 'low'
        },
        {
          ip: '192.168.1.100',
          hostname: 'desktop.local',
          status: 'online',
          ports: [
            { port: 135, status: 'open', service: 'RPC' },
            { port: 445, status: 'open', service: 'SMB' },
            { port: 3389, status: 'open', service: 'RDP' }
          ],
          os: 'Windows 10',
          risk: 'medium'
        },
        {
          ip: '192.168.1.50',
          hostname: 'unknown',
          status: 'online',
          ports: [
            { port: 23, status: 'open', service: 'Telnet' },
            { port: 21, status: 'open', service: 'FTP' }
          ],
          os: 'Unknown',
          risk: 'high'
        }
      ];

      setResults(mockResults);
      setIsScanning(false);
      toast.success('Network scan completed!');
    }, 3000);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Network Scanner</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5" />
            Scan Network
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter IP address or hostname (e.g., 192.168.1.1)"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="flex-1"
            />
            <Button onClick={scanNetwork} disabled={isScanning}>
              {isScanning ? 'Scanning...' : 'Scan'}
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground">
            This is a demo scanner. Real network scanning requires proper authorization.
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Scan Results</h2>
          {results.map((result, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{result.ip}</CardTitle>
                    <p className="text-sm text-muted-foreground">{result.hostname}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={result.status === 'online' ? 'default' : 'secondary'}>
                      {result.status}
                    </Badge>
                    <Badge className={getRiskColor(result.risk)}>
                      {result.risk} risk
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">System Info</h4>
                    <p className="text-sm text-muted-foreground">OS: {result.os}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Open Ports</h4>
                    <div className="space-y-1">
                      {result.ports.filter(p => p.status === 'open').map((port, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span>{port.port}/{port.service}</span>
                          <Badge variant="outline" className="text-xs">
                            {port.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {result.risk === 'high' && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-red-600">
                      High risk: Insecure services detected (Telnet, FTP)
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}