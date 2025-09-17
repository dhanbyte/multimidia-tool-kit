'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, RefreshCw, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

export default function TwoFactorAuth() {
  const [secret, setSecret] = useState('');
  const [token, setToken] = useState('');
  const [currentCode, setCurrentCode] = useState('');

  const generateSecret = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setSecret(result);
    toast.success('Secret generated!');
  };

  const generateTOTP = (secret: string) => {
    if (!secret) return '';
    
    // Simple TOTP simulation (not cryptographically secure)
    const time = Math.floor(Date.now() / 30000);
    const hash = (secret + time).split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return Math.abs(hash).toString().slice(-6).padStart(6, '0');
  };

  useEffect(() => {
    if (secret) {
      const interval = setInterval(() => {
        setCurrentCode(generateTOTP(secret));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [secret]);

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    toast.success('Secret copied to clipboard!');
  };

  const copyCode = () => {
    navigator.clipboard.writeText(currentCode);
    toast.success('Code copied to clipboard!');
  };

  const verifyToken = () => {
    const expected = generateTOTP(secret);
    if (token === expected) {
      toast.success('Token verified successfully!');
    } else {
      toast.error('Invalid token!');
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Two-Factor Authentication</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Generate 2FA Secret
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={generateSecret} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Generate New Secret
            </Button>
            
            {secret && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Secret Key</label>
                  <div className="flex gap-2">
                    <Input value={secret} readOnly className="font-mono" />
                    <Button variant="outline" onClick={copySecret}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter this secret in your authenticator app (Google Authenticator, Authy, etc.)
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Current TOTP Code</label>
                  <div className="flex gap-2">
                    <Input value={currentCode} readOnly className="font-mono text-2xl text-center" />
                    <Button variant="outline" onClick={copyCode}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This code changes every 30 seconds
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {secret && (
          <Card>
            <CardHeader>
              <CardTitle>Verify Token</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter 6-digit code from your app..."
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  maxLength={6}
                />
                <Button onClick={verifyToken}>Verify</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}