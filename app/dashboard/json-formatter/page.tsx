'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, FileText, CheckCircle, XCircle, Download } from 'lucide-react';
import { toast } from 'sonner';
import { ResultShare } from '@/components/result-share';

export default function JSONFormatter() {
  const [inputJson, setInputJson] = useState('');
  const [formattedJson, setFormattedJson] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  const formatJSON = () => {
    if (!inputJson.trim()) {
      toast.error('Please enter JSON to format');
      return;
    }

    try {
      const parsed = JSON.parse(inputJson);
      const formatted = JSON.stringify(parsed, null, 2);
      setFormattedJson(formatted);
      setIsValid(true);
      setError('');
      toast.success('JSON formatted successfully!');
    } catch (err) {
      setIsValid(false);
      setError(err instanceof Error ? err.message : 'Invalid JSON');
      setFormattedJson('');
      toast.error('Invalid JSON format');
    }
  };

  const minifyJSON = () => {
    if (!inputJson.trim()) {
      toast.error('Please enter JSON to minify');
      return;
    }

    try {
      const parsed = JSON.parse(inputJson);
      const minified = JSON.stringify(parsed);
      setFormattedJson(minified);
      setIsValid(true);
      setError('');
      toast.success('JSON minified successfully!');
    } catch (err) {
      setIsValid(false);
      setError(err instanceof Error ? err.message : 'Invalid JSON');
      setFormattedJson('');
      toast.error('Invalid JSON format');
    }
  };

  const validateJSON = () => {
    if (!inputJson.trim()) {
      toast.error('Please enter JSON to validate');
      return;
    }

    try {
      JSON.parse(inputJson);
      setIsValid(true);
      setError('');
      toast.success('JSON is valid!');
    } catch (err) {
      setIsValid(false);
      setError(err instanceof Error ? err.message : 'Invalid JSON');
      toast.error('Invalid JSON format');
    }
  };

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const clearAll = () => {
    setInputJson('');
    setFormattedJson('');
    setIsValid(null);
    setError('');
  };

  const loadSample = () => {
    const sampleJson = {
      "name": "John Doe",
      "age": 30,
      "email": "john@example.com",
      "address": {
        "street": "123 Main St",
        "city": "New York",
        "zipCode": "10001"
      },
      "hobbies": ["reading", "swimming", "coding"],
      "isActive": true
    };
    setInputJson(JSON.stringify(sampleJson));
  };

  const downloadJSON = () => {
    if (!formattedJson) {
      toast.error('No formatted JSON to download');
      return;
    }

    const blob = new Blob([formattedJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `formatted-json-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('JSON downloaded!');
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">JSON Formatter</h1>
        <p className="text-muted-foreground">
          Format, validate, and minify JSON data
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Input JSON
            </CardTitle>
            <CardDescription>
              Paste your JSON data here
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your JSON here..."
              value={inputJson}
              onChange={(e) => setInputJson(e.target.value)}
              rows={15}
              className="font-mono text-sm"
            />
            
            <div className="flex flex-wrap gap-2">
              <Button onClick={formatJSON} size="sm">
                Format
              </Button>
              <Button onClick={minifyJSON} variant="outline" size="sm">
                Minify
              </Button>
              <Button onClick={validateJSON} variant="outline" size="sm">
                Validate
              </Button>
              <Button onClick={loadSample} variant="outline" size="sm">
                Load Sample
              </Button>
              <Button onClick={clearAll} variant="outline" size="sm">
                Clear
              </Button>
            </div>

            {isValid !== null && (
              <div className="flex items-center gap-2">
                {isValid ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Valid JSON
                    </Badge>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-red-500" />
                    <Badge variant="destructive">
                      Invalid JSON
                    </Badge>
                  </>
                )}
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600 font-mono">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Formatted Output
              </span>
              {formattedJson && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(formattedJson)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadJSON}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <ResultShare 
                    title="Formatted JSON"
                    result={formattedJson}
                    resultType="text"
                    toolName="json-formatter"
                  />
                </div>
              )}
            </CardTitle>
            <CardDescription>
              Formatted JSON will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            {formattedJson ? (
              <Textarea
                value={formattedJson}
                readOnly
                rows={15}
                className="font-mono text-sm"
              />
            ) : (
              <div className="h-[360px] flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-md">
                Formatted JSON will appear here
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}