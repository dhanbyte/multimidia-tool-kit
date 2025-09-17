'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function PasswordLeakCheck() {
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkPassword = async () => {
    if (!password) {
      toast.error('Please enter a password');
      return;
    }

    setLoading(true);
    
    // Simulate API call (in real app, use HaveIBeenPwned API)
    setTimeout(() => {
      const isCommon = ['password', '123456', 'qwerty', 'admin'].includes(password.toLowerCase());
      setResult({
        breached: isCommon,
        count: isCommon ? Math.floor(Math.random() * 1000000) : 0
      });
      setLoading(false);
      toast.success('Password checked!');
    }, 2000);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Password Leak Checker</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Check Password Breaches
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="password"
            placeholder="Enter password to check..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <Button onClick={checkPassword} disabled={loading} className="w-full">
            {loading ? 'Checking...' : 'Check Password'}
          </Button>

          {result && (
            <div className={`p-4 rounded-lg ${result.breached ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
              {result.breached ? (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  <div>
                    <div className="font-medium">Password Found in Breaches!</div>
                    <div className="text-sm">This password appeared in {result.count.toLocaleString()} data breaches.</div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-green-600">
                  <Shield className="h-5 w-5" />
                  <div>
                    <div className="font-medium">Password Not Found</div>
                    <div className="text-sm">This password was not found in known data breaches.</div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            This tool checks against known data breaches. Your password is not stored or transmitted.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}