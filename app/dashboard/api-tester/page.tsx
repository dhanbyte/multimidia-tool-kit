'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Send, Copy, Download, Clock, AlertCircle, CheckCircle, History } from 'lucide-react';
import { toast } from 'sonner';
import { ResultShare } from '@/components/result-share';

interface RequestHistory {
  id: string;
  method: string;
  url: string;
  timestamp: string;
  status?: number;
  responseTime?: number;
}

export default function APITester() {
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [headers, setHeaders] = useState('{}');
  const [body, setBody] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [responseHeaders, setResponseHeaders] = useState('');
  const [history, setHistory] = useState<RequestHistory[]>([]);
  const [activeTab, setActiveTab] = useState('response');

  const sendRequest = async () => {
    if (!url.trim()) {
      toast.error('Please enter a valid URL');
      return;
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      toast.error('Please enter a valid URL (include http:// or https://)');
      return;
    }

    setLoading(true);
    const startTime = Date.now();
    
    try {
      // Parse headers
      let parsedHeaders = {};
      if (headers.trim()) {
        try {
          parsedHeaders = JSON.parse(headers);
        } catch {
          toast.error('Invalid JSON format in headers');
          setLoading(false);
          return;
        }
      }

      // Prepare request options
      const requestOptions: RequestInit = {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          ...parsedHeaders
        },
        mode: 'cors'
      };

      // Add body for POST, PUT, PATCH requests
      if (['POST', 'PUT', 'PATCH'].includes(method) && body.trim()) {
        requestOptions.body = body;
      }

      // Make the actual request
      const response = await fetch(url, requestOptions);
      const endTime = Date.now();
      const responseTimeMs = endTime - startTime;
      
      setResponseTime(responseTimeMs);
      setStatusCode(response.status);
      
      // Get response headers
      const headerObj: { [key: string]: string } = {};
      response.headers.forEach((value, key) => {
        headerObj[key] = value;
      });
      setResponseHeaders(JSON.stringify(headerObj, null, 2));
      
      // Get response body
      const contentType = response.headers.get('content-type');
      let responseData;
      
      if (contentType?.includes('application/json')) {
        try {
          responseData = await response.json();
          setResponse(JSON.stringify(responseData, null, 2));
        } catch {
          responseData = await response.text();
          setResponse(responseData);
        }
      } else {
        responseData = await response.text();
        setResponse(responseData);
      }
      
      // Add to history
      const historyItem: RequestHistory = {
        id: Date.now().toString(),
        method,
        url,
        timestamp: new Date().toISOString(),
        status: response.status,
        responseTime: responseTimeMs
      };
      
      setHistory(prev => [historyItem, ...prev.slice(0, 9)]); // Keep last 10 requests
      
      if (response.ok) {
        toast.success(`Request completed successfully (${responseTimeMs}ms)`);
      } else {
        toast.error(`Request failed with status ${response.status}`);
      }
      
    } catch (error) {
      const endTime = Date.now();
      setResponseTime(endTime - startTime);
      setStatusCode(null);
      
      const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
      setResponse(`Error: ${errorMessage}`);
      setResponseHeaders('');
      
      // Add failed request to history
      const historyItem: RequestHistory = {
        id: Date.now().toString(),
        method,
        url,
        timestamp: new Date().toISOString()
      };
      
      setHistory(prev => [historyItem, ...prev.slice(0, 9)]);
      
      toast.error('Request failed: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const downloadResponse = () => {
    if (!response) {
      toast.error('No response to download');
      return;
    }

    const blob = new Blob([response], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `api-response-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Response downloaded!');
  };

  const clearAll = () => {
    setUrl('');
    setHeaders('{}');
    setBody('');
    setResponse('');
    setResponseHeaders('');
    setStatusCode(null);
    setResponseTime(null);
  };

  const loadFromHistory = (item: RequestHistory) => {
    setMethod(item.method);
    setUrl(item.url);
  };

  const loadSampleRequest = () => {
    setUrl('https://jsonplaceholder.typicode.com/posts/1');
    setMethod('GET');
    setHeaders('{}');
    setBody('');
  };

  const getStatusBadgeVariant = (status: number | null) => {
    if (!status) return 'destructive';
    if (status >= 200 && status < 300) return 'default';
    if (status >= 300 && status < 400) return 'secondary';
    if (status >= 400 && status < 500) return 'destructive';
    return 'destructive';
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">API Tester</h1>
        <p className="text-muted-foreground">
          Test REST API endpoints with custom headers, request body, and view detailed responses
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Request Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Request Configuration
              </CardTitle>
              <CardDescription>
                Configure your API request parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* URL and Method */}
              <div className="flex gap-2">
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                    <SelectItem value="HEAD">HEAD</SelectItem>
                    <SelectItem value="OPTIONS">OPTIONS</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="https://api.example.com/endpoint"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={sendRequest} disabled={loading}>
                  {loading ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </>
                  )}
                </Button>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={loadSampleRequest}>
                  Load Sample
                </Button>
                <Button variant="outline" size="sm" onClick={clearAll}>
                  Clear All
                </Button>
              </div>

              {/* Headers */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Request Headers (JSON)</label>
                <Textarea
                  placeholder='{\n  "Authorization": "Bearer your-token",\n  "Content-Type": "application/json"\n}'
                  value={headers}
                  onChange={(e) => setHeaders(e.target.value)}
                  rows={4}
                  className="font-mono text-sm"
                />
              </div>

              {/* Request Body */}
              {['POST', 'PUT', 'PATCH'].includes(method) && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Request Body</label>
                  <Textarea
                    placeholder='{\n  "name": "John Doe",\n  "email": "john@example.com"\n}'
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={6}
                    className="font-mono text-sm"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Response Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    {statusCode ? (
                      statusCode >= 200 && statusCode < 300 ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )
                    ) : null}
                    Response
                  </div>
                  {statusCode && (
                    <Badge variant={getStatusBadgeVariant(statusCode)}>
                      {statusCode}
                    </Badge>
                  )}
                  {responseTime && (
                    <Badge variant="outline">
                      {responseTime}ms
                    </Badge>
                  )}
                </div>
                {response && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(response)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadResponse}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <ResultShare 
                      title="API Response"
                      result={response}
                      resultType="text"
                      toolName="api-tester"
                    />
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="response">Response Body</TabsTrigger>
                  <TabsTrigger value="headers">Response Headers</TabsTrigger>
                </TabsList>
                
                <TabsContent value="response" className="mt-4">
                  {response ? (
                    <Textarea
                      value={response}
                      readOnly
                      rows={15}
                      className="font-mono text-sm"
                    />
                  ) : (
                    <div className="h-[360px] flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-md">
                      <div className="text-center">
                        <Send className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Response will appear here</p>
                        <p className="text-sm mt-2">Configure your request and click Send</p>
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="headers" className="mt-4">
                  {responseHeaders ? (
                    <Textarea
                      value={responseHeaders}
                      readOnly
                      rows={15}
                      className="font-mono text-sm"
                    />
                  ) : (
                    <div className="h-[360px] flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-md">
                      Response headers will appear here
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* History Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Request History
              </CardTitle>
              <CardDescription>
                Recent API requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {history.length > 0 ? (
                <div className="space-y-2">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 border rounded-lg cursor-pointer hover:bg-muted transition-colors"
                      onClick={() => loadFromHistory(item)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="outline" className="text-xs">
                          {item.method}
                        </Badge>
                        {item.status && (
                          <Badge variant={getStatusBadgeVariant(item.status)} className="text-xs">
                            {item.status}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-mono truncate">
                        {item.url}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </p>
                        {item.responseTime && (
                          <p className="text-xs text-muted-foreground">
                            {item.responseTime}ms
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No requests yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Usage Guide */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>How to Use API Tester</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Step-by-Step Guide:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Select HTTP method (GET, POST, PUT, etc.)</li>
                <li>Enter the API endpoint URL</li>
                <li>Add request headers in JSON format (optional)</li>
                <li>Add request body for POST/PUT requests (optional)</li>
                <li>Click "Send" to make the request</li>
                <li>View response body, headers, and status code</li>
              </ol>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Features:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>Real HTTP Requests:</strong> Test actual API endpoints</li>
                <li><strong>Multiple Methods:</strong> Support for GET, POST, PUT, PATCH, DELETE</li>
                <li><strong>Custom Headers:</strong> Add authentication and custom headers</li>
                <li><strong>Request History:</strong> Track and reuse previous requests</li>
                <li><strong>Response Analysis:</strong> View status codes, headers, and timing</li>
                <li><strong>Export Results:</strong> Copy or download API responses</li>
              </ul>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Common Use Cases:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><strong>API Development:</strong> Test your own API endpoints during development</li>
              <li><strong>Third-party APIs:</strong> Explore and test external API services</li>
              <li><strong>Authentication Testing:</strong> Test API endpoints with different auth tokens</li>
              <li><strong>Data Validation:</strong> Verify API responses and data formats</li>
              <li><strong>Performance Testing:</strong> Monitor API response times</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}