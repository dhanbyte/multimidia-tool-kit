'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, Mail, Globe, Hash, Phone, Copy, Download, Search, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

export default function TextExtractor() {
  const [inputText, setInputText] = useState('');
  const [extractedData, setExtractedData] = useState<{[key: string]: string[]}>({});
  const [activeTab, setActiveTab] = useState('all');
  const [processing, setProcessing] = useState(false);

  const extractEmails = (text: string) => {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    return [...new Set(text.match(emailRegex) || [])];
  };

  const extractURLs = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|(ftp:\/\/[^\s]+)/g;
    return [...new Set(text.match(urlRegex) || [])];
  };

  const extractNumbers = (text: string) => {
    const numberRegex = /\b\d+(?:\.\d+)?\b/g;
    return [...new Set(text.match(numberRegex) || [])];
  };

  const extractPhones = (text: string) => {
    const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}|\d{10}/g;
    return [...new Set(text.match(phoneRegex) || [])].filter(phone => phone.replace(/\D/g, '').length >= 10);
  };

  const extractDates = (text: string) => {
    const dateRegex = /\b(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4})|(?:\d{2,4}[/-]\d{1,2}[/-]\d{1,2})|(?:\w+\s+\d{1,2},?\s+\d{2,4})/g;
    return [...new Set(text.match(dateRegex) || [])];
  };

  const extractIPs = (text: string) => {
    const ipRegex = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;
    return [...new Set(text.match(ipRegex) || [])].filter(ip => {
      const parts = ip.split('.');
      return parts.every(part => parseInt(part) <= 255);
    });
  };

  const extractHashtags = (text: string) => {
    const hashtagRegex = /#[a-zA-Z0-9_]+/g;
    return [...new Set(text.match(hashtagRegex) || [])];
  };

  const extractMentions = (text: string) => {
    const mentionRegex = /@[a-zA-Z0-9_]+/g;
    return [...new Set(text.match(mentionRegex) || [])];
  };

  const extractCreditCards = (text: string) => {
    const ccRegex = /\b(?:\d{4}[-.\s]?){3}\d{4}\b/g;
    return [...new Set(text.match(ccRegex) || [])];
  };

  const extractAll = async () => {
    if (!inputText.trim()) {
      toast.error('Please enter text to extract data from');
      return;
    }

    setProcessing(true);
    
    try {
      const results = {
        emails: extractEmails(inputText),
        urls: extractURLs(inputText),
        numbers: extractNumbers(inputText),
        phones: extractPhones(inputText),
        dates: extractDates(inputText),
        ips: extractIPs(inputText),
        hashtags: extractHashtags(inputText),
        mentions: extractMentions(inputText),
        creditcards: extractCreditCards(inputText)
      };
      
      setExtractedData(results);
      
      const totalFound = Object.values(results).reduce((sum, arr) => sum + arr.length, 0);
      toast.success(`Extracted ${totalFound} items from text!`);
    } catch (error) {
      toast.error('Failed to extract data. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const copyToClipboard = (data: string[]) => {
    if (data.length === 0) return;
    navigator.clipboard.writeText(data.join('\n'));
    toast.success('Data copied to clipboard!');
  };

  const downloadData = (data: string[], filename: string) => {
    if (data.length === 0) return;
    const blob = new Blob([data.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Data downloaded!');
  };

  const clearAll = () => {
    setInputText('');
    setExtractedData({});
    setActiveTab('all');
  };

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const extractionTools = [
    {
      id: 'emails',
      name: 'Email Addresses',
      icon: Mail,
      description: 'Extract valid email addresses from any text',
      example: 'user@example.com, contact@domain.org',
      color: 'text-blue-600'
    },
    {
      id: 'urls',
      name: 'URLs & Links',
      icon: Globe,
      description: 'Find all web URLs, links, and website addresses',
      example: 'https://example.com, www.site.com',
      color: 'text-green-600'
    },
    {
      id: 'phones',
      name: 'Phone Numbers',
      icon: Phone,
      description: 'Extract phone numbers in various formats',
      example: '+1-234-567-8900, (555) 123-4567',
      color: 'text-purple-600'
    },
    {
      id: 'numbers',
      name: 'Numbers',
      icon: Hash,
      description: 'Find all numeric values including decimals',
      example: '123, 45.67, 1000',
      color: 'text-orange-600'
    },
    {
      id: 'dates',
      name: 'Dates',
      icon: FileText,
      description: 'Extract dates in multiple formats',
      example: '12/25/2023, Dec 25, 2023',
      color: 'text-red-600'
    },
    {
      id: 'ips',
      name: 'IP Addresses',
      icon: Globe,
      description: 'Find IPv4 addresses',
      example: '192.168.1.1, 10.0.0.1',
      color: 'text-indigo-600'
    },
    {
      id: 'hashtags',
      name: 'Hashtags',
      icon: Hash,
      description: 'Extract social media hashtags',
      example: '#trending, #technology',
      color: 'text-pink-600'
    },
    {
      id: 'mentions',
      name: 'Mentions',
      icon: Mail,
      description: 'Find social media mentions',
      example: '@username, @company',
      color: 'text-cyan-600'
    }
  ];

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Advanced Text Data Extractor</h1>
        <p className="text-muted-foreground">
          Extract emails, phone numbers, URLs, dates, and other data patterns from any text with advanced regex patterns
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Input Text
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your text here to extract data...\n\nExample: Contact John at john@example.com or call (555) 123-4567. Visit https://example.com for more info."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={12}
              className="resize-none"
            />
            
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{getWordCount(inputText)} words, {inputText.length} characters</span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={clearAll}>
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              </div>
            </div>
            
            <Button 
              onClick={extractAll} 
              className="w-full" 
              disabled={processing || !inputText.trim()}
            >
              {processing ? 'Extracting Data...' : 'Extract All Data'}
            </Button>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Extraction Results</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(extractedData).length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Enter text and click "Extract All Data" to see results</p>
              </div>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="all">All Results</TabsTrigger>
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="export">Export</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="space-y-4 max-h-96 overflow-y-auto">
                  {extractionTools.map(tool => {
                    const data = extractedData[tool.id] || [];
                    if (data.length === 0) return null;
                    
                    return (
                      <div key={tool.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <tool.icon className={`h-4 w-4 ${tool.color}`} />
                            <span className="font-medium">{tool.name}</span>
                            <Badge variant="secondary">{data.length}</Badge>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(data)}>
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => downloadData(data, tool.id)}>
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="p-3 bg-muted rounded-lg max-h-32 overflow-y-auto">
                          <div className="text-sm space-y-1">
                            {data.map((item, index) => (
                              <div key={index} className="font-mono text-xs break-all">
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </TabsContent>
                
                <TabsContent value="summary">
                  <div className="grid grid-cols-2 gap-4">
                    {extractionTools.map(tool => {
                      const count = extractedData[tool.id]?.length || 0;
                      return (
                        <div key={tool.id} className="p-3 border rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <tool.icon className={`h-4 w-4 ${tool.color}`} />
                            <span className="font-medium text-sm">{tool.name}</span>
                          </div>
                          <div className="text-2xl font-bold">{count}</div>
                          <div className="text-xs text-muted-foreground">items found</div>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>
                
                <TabsContent value="export" className="space-y-4">
                  <Alert>
                    <Download className="h-4 w-4" />
                    <AlertDescription>
                      Export extracted data in various formats for further use.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid grid-cols-1 gap-2">
                    {extractionTools.map(tool => {
                      const data = extractedData[tool.id] || [];
                      if (data.length === 0) return null;
                      
                      return (
                        <div key={tool.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <tool.icon className={`h-4 w-4 ${tool.color}`} />
                            <span className="font-medium">{tool.name}</span>
                            <Badge variant="outline">{data.length} items</Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => copyToClipboard(data)}>
                              <Copy className="h-3 w-3 mr-1" />
                              Copy
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => downloadData(data, tool.id)}>
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Tool Descriptions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {extractionTools.map(tool => (
          <Card key={tool.id} className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <tool.icon className={`h-5 w-5 ${tool.color}`} />
              <h3 className="font-medium">{tool.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{tool.description}</p>
            <div className="text-xs font-mono bg-muted p-2 rounded">
              {tool.example}
            </div>
          </Card>
        ))}
      </div>
      
      {/* SEO Content */}
      <div className="mt-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>How to Use the Text Data Extractor</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">📧 Email Extraction</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Extract valid email addresses from any text including documents, web pages, or contact lists. 
                  Perfect for building mailing lists or data cleanup.
                </p>
                
                <h3 className="font-semibold mb-2">🌐 URL & Link Extraction</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Find all web URLs, website links, and domain names from text. Useful for SEO analysis, 
                  link building, and content auditing.
                </p>
                
                <h3 className="font-semibold mb-2">📱 Phone Number Extraction</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Extract phone numbers in various international formats including US, Indian, and global patterns. 
                  Great for contact management and lead generation.
                </p>
                
                <h3 className="font-semibold mb-2"># Number & Data Extraction</h3>
                <p className="text-sm text-muted-foreground">
                  Find all numeric values, dates, IP addresses, and other structured data patterns. 
                  Essential for data analysis and information processing.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">🎯 Use Cases</h3>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Lead generation and contact extraction</li>
                  <li>Data cleaning and validation</li>
                  <li>SEO analysis and link extraction</li>
                  <li>Social media data mining</li>
                  <li>Document processing and analysis</li>
                  <li>Research and data collection</li>
                  <li>Content auditing and verification</li>
                  <li>Database migration and cleanup</li>
                </ul>
                
                <h3 className="font-semibold mb-2 mt-4">✨ Features</h3>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Advanced regex patterns for accurate extraction</li>
                  <li>Duplicate removal and data deduplication</li>
                  <li>Multiple export formats (copy/download)</li>
                  <li>Real-time processing and validation</li>
                  <li>Support for international formats</li>
                  <li>Batch processing for large texts</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}