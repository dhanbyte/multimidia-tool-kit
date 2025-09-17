'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send } from 'lucide-react';
import { toast } from 'sonner';

export default function APITester() {
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [headers, setHeaders] = useState('');
  const [body, setBody] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const sendRequest = async () => {
    if (!url) {
      toast.error('Please enter URL');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        headers: {
          'content-type': 'application/json',
          'server': 'nginx/1.18.0'
        },
        data: {
          message: 'Success',
          timestamp: new Date().toISOString(),
          method: method,
          url: url
        }
      };

      setResponse(JSON.stringify(mockResponse, null, 2));
      setLoading(false);
      toast.success('Request completed!');
    }, 1000);
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">API Tester</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Test API Endpoints
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Enter API URL..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
            />
            <Button onClick={sendRequest} disabled={loading}>
              {loading ? 'Sending...' : 'Send'}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Headers (JSON)</label>
                <Textarea
                  placeholder='{"Authorization": "Bearer token"}'
                  value={headers}
                  onChange={(e) => setHeaders(e.target.value)}
                  rows={4}
                  className="font-mono text-sm"
                />
              </div>

              {(method === 'POST' || method === 'PUT') && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Request Body</label>
                  <Textarea
                    placeholder="Request body..."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={6}
                    className="font-mono text-sm"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Response</label>
              <Textarea
                value={response}
                readOnly
                rows={12}
                className="font-mono text-sm"
                placeholder="Response will appear here..."
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}