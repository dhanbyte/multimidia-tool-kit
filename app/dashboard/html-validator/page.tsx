'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Code } from 'lucide-react';
import { toast } from 'sonner';

export default function HTMLValidator() {
  const [html, setHtml] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const validateHTML = () => {
    if (!html.trim()) {
      toast.error('Please enter HTML to validate');
      return;
    }

    const foundErrors = [];
    
    // Basic HTML validation
    if (!html.includes('<!DOCTYPE')) foundErrors.push('Missing DOCTYPE declaration');
    if (!html.includes('<html')) foundErrors.push('Missing <html> tag');
    if (!html.includes('<head>')) foundErrors.push('Missing <head> tag');
    if (!html.includes('<body>')) foundErrors.push('Missing <body> tag');
    
    // Check for unclosed tags
    const openTags = html.match(/<[^\/][^>]*>/g) || [];
    const closeTags = html.match(/<\/[^>]*>/g) || [];
    
    if (openTags.length !== closeTags.length) {
      foundErrors.push('Mismatched opening/closing tags');
    }

    setErrors(foundErrors);
    setIsValid(foundErrors.length === 0);
    
    if (foundErrors.length === 0) {
      toast.success('HTML is valid!');
    } else {
      toast.error(`Found ${foundErrors.length} error(s)`);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">HTML Validator</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Validate HTML Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste your HTML code here..."
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            rows={12}
            className="font-mono text-sm"
          />
          
          <Button onClick={validateHTML} className="w-full">
            Validate HTML
          </Button>

          {isValid !== null && (
            <div className={`p-4 rounded-lg ${isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                {isValid ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span className={`font-medium ${isValid ? 'text-green-600' : 'text-red-600'}`}>
                  {isValid ? 'Valid HTML' : 'Invalid HTML'}
                </span>
              </div>
              
              {!isValid && errors.length > 0 && (
                <div className="space-y-1">
                  {errors.map((error, index) => (
                    <div key={index} className="text-sm text-red-600">
                      • {error}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}