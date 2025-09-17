'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wifi } from 'lucide-react';
import { toast } from 'sonner';

export default function WifiQR() {
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [security, setSecurity] = useState('WPA');
  const [qrCode, setQrCode] = useState('');

  const generateQR = () => {
    if (!ssid) {
      toast.error('Please enter WiFi name');
      return;
    }

    const wifiString = `WIFI:T:${security};S:${ssid};P:${password};H:false;;`;
    
    // Simple QR code simulation (in real app, use QR library)
    setQrCode(`data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="white"/><text x="100" y="100" text-anchor="middle" font-size="12">QR Code for: ${ssid}</text></svg>`);
    toast.success('WiFi QR code generated!');
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">WiFi QR Generator</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5" />
            Generate WiFi QR Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">WiFi Name (SSID)</label>
            <Input
              placeholder="Enter WiFi name..."
              value={ssid}
              onChange={(e) => setSsid(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input
              type="password"
              placeholder="Enter WiFi password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Security Type</label>
            <Select value={security} onValueChange={setSecurity}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WPA">WPA/WPA2</SelectItem>
                <SelectItem value="WEP">WEP</SelectItem>
                <SelectItem value="nopass">No Password</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={generateQR} className="w-full">
            Generate QR Code
          </Button>

          {qrCode && (
            <div className="text-center space-y-4">
              <img src={qrCode} alt="WiFi QR Code" className="mx-auto border rounded" />
              <p className="text-sm text-muted-foreground">
                Scan this QR code to connect to WiFi
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}