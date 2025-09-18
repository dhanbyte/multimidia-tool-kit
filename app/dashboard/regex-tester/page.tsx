'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Copy, Download, BookOpen, AlertCircle, CheckCircle, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';
import { ResultShare } from '@/components/result-share';

interface RegexPattern {
  name: string;
  pattern: string;
  description: string;
  example: string;
}

const commonPatterns: RegexPattern[] = [
  {
    name: 'Email',
    pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
    description: 'Matches email addresses',
    example: 'user@example.com'
  },
  {
    name: 'Phone Number',
    pattern: '\\+?[1-9]\\d{1,14}',
    description: 'Matches international phone numbers',
    example: '+1234567890'
  },
  {
    name: 'URL',
    pattern: 'https?:\\/\\/[^\\s]+',
    description: 'Matches HTTP/HTTPS URLs',
    example: 'https://example.com'
  },
  {
    name: 'IP Address',
    pattern: '\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b',
    description: 'Matches IPv4 addresses',
    example: '192.168.1.1'
  },
  {
    name: 'Date (YYYY-MM-DD)',
    pattern: '\\d{4}-\\d{2}-\\d{2}',
    description: 'Matches dates in YYYY-MM-DD format',
    example: '2024-01-15'
  },
  {
    name: 'Credit Card',
    pattern: '\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}',
    description: 'Matches credit card numbers',
    example: '1234-5678-9012-3456'
  },
  {
    name: 'Hexadecimal Color',
    pattern: '#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3}',
    description: 'Matches hex color codes',
    example: '#FF5733'
  },
  {
    name: 'Username',
    pattern: '^[a-zA-Z0-9_]{3,16}$',
    description: 'Matches usernames (3-16 chars, alphanumeric + underscore)',
    example: 'user_123'
  }
];

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [testText, setTestText] = useState('');
  const [flags, setFlags] = useState('g');
  const [replaceText, setReplaceText] = useState('');
  const [activeTab, setActiveTab] = useState('test');

  const { matches, isValidRegex, error } = useMemo(() => {
    if (!pattern || !testText) {
      return { matches: [], isValidRegex: true, error: null };
    }
    
    try {
      const regex = new RegExp(pattern, flags);
      const matches = [...testText.matchAll(regex)];
      return { matches, isValidRegex: true, error: null };
    } catch (err) {
      return { 
        matches: [], 
        isValidRegex: false, 
        error: err instanceof Error ? err.message : 'Invalid regex pattern'
      };
    }
  }, [pattern, testText, flags]);

  const replacedText = useMemo(() => {
    if (!pattern || !testText || !replaceText) return '';
    
    try {
      const regex = new RegExp(pattern, flags);
      return testText.replace(regex, replaceText);
    } catch {
      return '';
    }
  }, [pattern, testText, replaceText, flags]);

  const highlightedText = useMemo(() => {
    if (!pattern || !testText || matches.length === 0) return testText;
    
    let result = testText;
    let offset = 0;
    
    matches.forEach((match, index) => {
      if (match.index !== undefined) {
        const start = match.index + offset;
        const end = start + match[0].length;
        const highlighted = `<mark class="bg-yellow-200 px-1 rounded">${match[0]}</mark>`;
        result = result.slice(0, start) + highlighted + result.slice(end);
        offset += highlighted.length - match[0].length;
      }
    });
    
    return result;
  }, [pattern, testText, matches]);

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const downloadResults = () => {
    const results = {
      pattern,
      flags,
      testText,
      matches: matches.map(m => ({
        match: m[0],
        index: m.index,
        groups: m.slice(1)
      })),
      matchCount: matches.length
    };
    
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `regex-results-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Results downloaded!');
  };

  const loadPattern = (selectedPattern: RegexPattern) => {
    setPattern(selectedPattern.pattern);
    setTestText(selectedPattern.example);
    setFlags('g');
  };

  const loadSampleText = () => {
    const sampleText = `Contact us at support@example.com or sales@company.org
Call us: +1-555-123-4567 or +44-20-7946-0958
Visit: https://www.example.com or http://test.site.co.uk
Server IPs: 192.168.1.1, 10.0.0.1, 172.16.0.1
Dates: 2024-01-15, 2023-12-31, 2024-02-29
Colors: #FF5733, #3498DB, #2ECC71
Card: 1234-5678-9012-3456`;
    setTestText(sampleText);
  };

  const clearAll = () => {
    setPattern('');
    setTestText('');
    setReplaceText('');
    setFlags('g');
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Regex Tester</h1>
        <p className="text-muted-foreground">
          Test, validate, and debug regular expressions with real-time matching and replacement
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Testing Area */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Regular Expression Tester
              </CardTitle>
              <CardDescription>
                Enter your regex pattern and test text to see matches in real-time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Pattern Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Regex Pattern</label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Enter regex pattern (e.g., \\d+|[a-zA-Z]+)"
                      value={pattern}
                      onChange={(e) => setPattern(e.target.value)}
                      className={`font-mono ${!isValidRegex ? 'border-red-500' : ''}`}
                    />
                    {!isValidRegex && (
                      <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                    )}
                    {isValidRegex && pattern && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <Input
                    placeholder="Flags"
                    value={flags}
                    onChange={(e) => setFlags(e.target.value)}
                    className="w-20 font-mono"
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-600 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={loadSampleText}>
                  Load Sample Text
                </Button>
                <Button variant="outline" size="sm" onClick={clearAll}>
                  Clear All
                </Button>
                {matches.length > 0 && (
                  <>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(pattern)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Pattern
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadResults}>
                      <Download className="h-4 w-4 mr-2" />
                      Download Results
                    </Button>
                    <ResultShare 
                      title="Regex Test Results"
                      result={JSON.stringify({ pattern, matches: matches.length, flags }, null, 2)}
                      resultType="text"
                      toolName="regex-tester"
                    />
                  </>
                )}
              </div>

              {/* Test Text */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Test Text</label>
                <Textarea
                  placeholder="Enter text to test against your regex pattern..."
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>

              {/* Results Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="test">Matches ({matches.length})</TabsTrigger>
                  <TabsTrigger value="replace">Replace</TabsTrigger>
                  <TabsTrigger value="highlight">Highlighted</TabsTrigger>
                </TabsList>
                
                <TabsContent value="test" className="space-y-4">
                  {matches.length > 0 ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="default">
                          {matches.length} match{matches.length !== 1 ? 'es' : ''} found
                        </Badge>
                        {isValidRegex && (
                          <Badge variant="outline">
                            Pattern: /{pattern}/{flags}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {matches.map((match, index) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">Match {index + 1}</Badge>
                              <Badge variant="secondary">Position {match.index}</Badge>
                            </div>
                            <code className="bg-muted px-2 py-1 rounded block font-mono text-sm">
                              {match[0]}
                            </code>
                            {match.length > 1 && (
                              <div className="mt-2">
                                <p className="text-sm font-medium mb-1">Capture Groups:</p>
                                {match.slice(1).map((group, groupIndex) => (
                                  <div key={groupIndex} className="text-sm">
                                    <Badge variant="outline" className="mr-2">Group {groupIndex + 1}</Badge>
                                    <code className="bg-muted px-1 rounded">{group || '(empty)'}</code>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      {pattern && testText ? (
                        <>
                          <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No matches found</p>
                          <p className="text-sm mt-2">Try adjusting your regex pattern</p>
                        </>
                      ) : (
                        <>
                          <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Enter a pattern and test text to see matches</p>
                        </>
                      )}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="replace" className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Replacement Text</label>
                    <Input
                      placeholder="Enter replacement text (use $1, $2 for capture groups)"
                      value={replaceText}
                      onChange={(e) => setReplaceText(e.target.value)}
                      className="font-mono"
                    />
                  </div>
                  
                  {replacedText && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">Replaced Text</label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(replacedText)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                      <Textarea
                        value={replacedText}
                        readOnly
                        rows={8}
                        className="font-mono text-sm"
                      />
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="highlight" className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Text with Highlighted Matches</label>
                    <div 
                      className="p-3 border rounded-lg font-mono text-sm whitespace-pre-wrap min-h-32 bg-muted/30"
                      dangerouslySetInnerHTML={{ __html: highlightedText }}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Pattern Library */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Pattern Library
              </CardTitle>
              <CardDescription>
                Common regex patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {commonPatterns.map((patternItem, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => loadPattern(patternItem)}
                  >
                    <div className="font-medium text-sm mb-1">{patternItem.name}</div>
                    <code className="text-xs bg-muted px-1 rounded block mb-1 font-mono">
                      {patternItem.pattern}
                    </code>
                    <p className="text-xs text-muted-foreground">{patternItem.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Quick Reference
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-medium text-sm mb-2">Common Flags:</h4>
                <ul className="text-xs space-y-1">
                  <li><code>g</code> - Global (find all matches)</li>
                  <li><code>i</code> - Case insensitive</li>
                  <li><code>m</code> - Multiline</li>
                  <li><code>s</code> - Dot matches newline</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-2">Special Characters:</h4>
                <ul className="text-xs space-y-1">
                  <li><code>\d</code> - Any digit (0-9)</li>
                  <li><code>\w</code> - Word character</li>
                  <li><code>\s</code> - Whitespace</li>
                  <li><code>.</code> - Any character</li>
                  <li><code>*</code> - Zero or more</li>
                  <li><code>+</code> - One or more</li>
                  <li><code>?</code> - Zero or one</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Usage Guide */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>How to Use Regex Tester</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Step-by-Step Guide:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Enter your regular expression pattern</li>
                <li>Add flags (g, i, m, s) as needed</li>
                <li>Enter or paste your test text</li>
                <li>View matches in real-time</li>
                <li>Use Replace tab to test substitutions</li>
                <li>Check Highlighted tab to see visual matches</li>
              </ol>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Features:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>Real-time Testing:</strong> See matches as you type</li>
                <li><strong>Pattern Library:</strong> Common regex patterns ready to use</li>
                <li><strong>Replace Testing:</strong> Test regex replacements</li>
                <li><strong>Syntax Validation:</strong> Instant feedback on pattern validity</li>
                <li><strong>Capture Groups:</strong> View and analyze capture groups</li>
                <li><strong>Visual Highlighting:</strong> See matches highlighted in text</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}