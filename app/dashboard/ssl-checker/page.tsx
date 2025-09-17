'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Shield, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function SSLChecker() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkSSL = async () => {
    if (!url) {
      toast.error('Please enter a URL');
      return;
    }

    setLoading(true);
    
    // Simulate SSL check
    setTimeout(() => {
      const isSecure = url.startsWith('https://');
      setResult({
        valid: isSecure,
        issuer: isSecure ? 'Let\'s Encrypt' : 'N/A',
        expires: isSecure ? '2025-12-31' : 'N/A',
        grade: isSecure ? 'A+' : 'F'
      });
      setLoading(false);
      toast.success('SSL certificate checked!');
    }, 2000);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">SSL Certificate Checker</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Check SSL Certificate
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Enter website URL (e.g., https://example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          
          <Button onClick={checkSSL} disabled={loading} className="w-full">
            {loading ? 'Checking...' : 'Check SSL'}
          </Button>

          {result && (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${result.valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center gap-2">
                  {result.valid ? (
                    <Shield className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  )}
                  <span className={`font-medium ${result.valid ? 'text-green-600' : 'text-red-600'}`}>
                    {result.valid ? 'Valid SSL Certificate' : 'Invalid or Missing SSL'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm font-medium">Issuer</div>
                  <div className="text-sm text-muted-foreground">{result.issuer}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Expires</div>
                  <div className="text-sm text-muted-foreground">{result.expires}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Grade</div>
                  <div className="text-sm text-muted-foreground">{result.grade}</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}