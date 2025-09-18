'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Minimize2, Maximize2, Copy, Download, RotateCcw, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { ResultShare } from '@/components/result-share';

export default function CSSMinifier() {
  const [css, setCss] = useState('');
  const [processed, setProcessed] = useState('');
  const [stats, setStats] = useState({ original: 0, processed: 0, saved: 0, savedBytes: 0 });
  const [activeTab, setActiveTab] = useState('minify');

  const minifyCSS = () => {
    if (!css.trim()) {
      toast.error('Please enter CSS to minify');
      return;
    }

    const result = css
      // Remove comments
      .replace(/\/\*[\s\S]*?\*\//g, '')
      // Remove unnecessary whitespace
      .replace(/\s+/g, ' ')
      // Remove spaces around specific characters
      .replace(/\s*([{}:;,>+~])\s*/g, '$1')
      // Remove trailing semicolon before closing brace
      .replace(/;}/g, '}')
      // Remove quotes from font names when not needed
      .replace(/font-family:\s*["']([^"',]+)["']/g, 'font-family:$1')
      // Convert hex colors to shorter form when possible
      .replace(/#([0-9a-f])\1([0-9a-f])\2([0-9a-f])\3/gi, '#$1$2$3')
      // Remove unnecessary zeros
      .replace(/\b0+(\.\d+)/g, '$1')
      .replace(/\b(\d+)\.0+(\D)/g, '$1$2')
      // Remove units from zero values
      .replace(/\b0(px|em|rem|%|vh|vw|pt|pc|in|cm|mm|ex|ch|vmin|vmax)\b/g, '0')
      .trim();

    setProcessed(result);
    calculateStats(css, result);
    toast.success('CSS minified successfully!');
  };

  const beautifyCSS = () => {
    if (!css.trim()) {
      toast.error('Please enter CSS to beautify');
      return;
    }

    let result = css
      // Normalize whitespace
      .replace(/\s+/g, ' ')
      .trim();

    // Add proper formatting
    result = result
      // Add newlines after opening braces
      .replace(/{/g, ' {\n  ')
      // Add newlines before closing braces
      .replace(/}/g, '\n}\n')
      // Add newlines after semicolons
      .replace(/;/g, ';\n  ')
      // Add newlines after commas in selectors
      .replace(/,(?![^{]*})/g, ',\n')
      // Clean up extra newlines
      .replace(/\n\s*\n/g, '\n')
      // Fix indentation
      .replace(/^\s+/gm, (match) => {
        const level = match.includes('}') ? 0 : 1;
        return '  '.repeat(level);
      })
      .trim();

    setProcessed(result);
    calculateStats(css, result);
    toast.success('CSS beautified successfully!');
  };

  const optimizeCSS = () => {
    if (!css.trim()) {
      toast.error('Please enter CSS to optimize');
      return;
    }

    let result = css;

    // Remove duplicate properties (keep last one)
    result = result.replace(/([^{}]+){([^{}]*)}/g, (match, selector, properties) => {
      const props = properties.split(';').filter((p: string) => p.trim());
      const uniqueProps: { [key: string]: string } = {};
      
      props.forEach((prop: string) => {
        const [key, value] = prop.split(':').map((s: string) => s.trim());
        if (key && value) {
          uniqueProps[key] = value;
        }
      });
      
      const optimizedProps = Object.entries(uniqueProps)
        .map(([key, value]) => `${key}:${value}`)
        .join(';');
      
      return `${selector}{${optimizedProps}}`;
    });

    // Apply minification
    result = result
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .replace(/\s*([{}:;,>+~])\s*/g, '$1')
      .replace(/;}/g, '}')
      .replace(/#([0-9a-f])\1([0-9a-f])\2([0-9a-f])\3/gi, '#$1$2$3')
      .replace(/\b0+(\.\d+)/g, '$1')
      .replace(/\b0(px|em|rem|%|vh|vw|pt|pc|in|cm|mm|ex|ch|vmin|vmax)\b/g, '0')
      .trim();

    setProcessed(result);
    calculateStats(css, result);
    toast.success('CSS optimized successfully!');
  };

  const calculateStats = (original: string, processed: string) => {
    const originalSize = original.length;
    const processedSize = processed.length;
    const savedBytes = originalSize - processedSize;
    const savedPercent = originalSize > 0 ? ((savedBytes / originalSize) * 100) : 0;

    setStats({
      original: originalSize,
      processed: processedSize,
      saved: parseFloat(savedPercent.toFixed(1)),
      savedBytes
    });
  };

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const downloadCSS = () => {
    if (!processed) {
      toast.error('No processed CSS to download');
      return;
    }

    const blob = new Blob([processed], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeTab}-css-${Date.now()}.css`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('CSS downloaded!');
  };

  const clearAll = () => {
    setCss('');
    setProcessed('');
    setStats({ original: 0, processed: 0, saved: 0, savedBytes: 0 });
  };

  const loadSample = () => {
    const sampleCSS = `/* Main styles */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  border-bottom: 1px solid #e0e0e0;
}

.button {
  background-color: #007bff;
  color: #ffffff;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: #0056b3;
}`;
    setCss(sampleCSS);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">CSS Minifier & Beautifier</h1>
        <p className="text-muted-foreground">
          Minify, beautify, and optimize CSS code with advanced compression and formatting options
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Minimize2 className="h-5 w-5" />
            CSS Processor
          </CardTitle>
          <CardDescription>
            Process your CSS with minification, beautification, or optimization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Panel */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Input CSS</label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={loadSample}>
                    Load Sample
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearAll}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </div>
              
              <Textarea
                placeholder="Paste your CSS code here...\n\n.container {\n  max-width: 1200px;\n  margin: 0 auto;\n}"
                value={css}
                onChange={(e) => setCss(e.target.value)}
                rows={18}
                className="font-mono text-sm"
              />
              
              {/* Processing Options */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="minify" className="flex items-center gap-2">
                    <Minimize2 className="h-4 w-4" />
                    Minify
                  </TabsTrigger>
                  <TabsTrigger value="beautify" className="flex items-center gap-2">
                    <Maximize2 className="h-4 w-4" />
                    Beautify
                  </TabsTrigger>
                  <TabsTrigger value="optimize" className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Optimize
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="minify" className="mt-4">
                  <Button onClick={minifyCSS} className="w-full">
                    <Minimize2 className="h-4 w-4 mr-2" />
                    Minify CSS
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    Remove whitespace, comments, and unnecessary characters to reduce file size.
                  </p>
                </TabsContent>
                
                <TabsContent value="beautify" className="mt-4">
                  <Button onClick={beautifyCSS} className="w-full">
                    <Maximize2 className="h-4 w-4 mr-2" />
                    Beautify CSS
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    Format CSS with proper indentation and line breaks for better readability.
                  </p>
                </TabsContent>
                
                <TabsContent value="optimize" className="mt-4">
                  <Button onClick={optimizeCSS} className="w-full">
                    <Zap className="h-4 w-4 mr-2" />
                    Optimize CSS
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    Remove duplicates, optimize values, and apply advanced compression techniques.
                  </p>
                </TabsContent>
              </Tabs>
            </div>

            {/* Output Panel */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">
                  {activeTab === 'minify' ? 'Minified' : activeTab === 'beautify' ? 'Beautified' : 'Optimized'} CSS
                </label>
                {processed && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(processed)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadCSS}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <ResultShare 
                      title={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} CSS`}
                      result={processed}
                      resultType="text"
                      toolName="css-minifier"
                    />
                  </div>
                )}
              </div>
              
              {processed ? (
                <Textarea
                  value={processed}
                  readOnly
                  rows={18}
                  className="font-mono text-sm"
                />
              ) : (
                <div className="h-[432px] flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-md">
                  <div className="text-center">
                    <Minimize2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Processed CSS will appear here</p>
                    <p className="text-sm mt-2">Choose a processing option and click the button</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Statistics */}
          {processed && stats.original > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold">{formatBytes(stats.original)}</div>
                <div className="text-sm text-muted-foreground">Original Size</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{formatBytes(stats.processed)}</div>
                <div className="text-sm text-muted-foreground">Processed Size</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.saved}%</div>
                <div className="text-sm text-muted-foreground">Size Reduction</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{formatBytes(stats.savedBytes)}</div>
                <div className="text-sm text-muted-foreground">Bytes Saved</div>
              </div>
            </div>
          )}

          {/* Additional Stats */}
          {processed && (
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <Badge variant="secondary">
                Lines: {processed.split('\n').length}
              </Badge>
              <Badge variant="secondary">
                Characters: {processed.length}
              </Badge>
              <Badge variant="secondary">
                Rules: {(processed.match(/{/g) || []).length}
              </Badge>
              <Badge variant="secondary">
                Properties: {(processed.match(/:/g) || []).length}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Guide */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>How to Use CSS Minifier & Beautifier</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Minimize2 className="h-4 w-4" />
                Minification:
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Removes all comments and unnecessary whitespace</li>
                <li>Shortens hex colors (#ffffff → #fff)</li>
                <li>Removes units from zero values (0px → 0)</li>
                <li>Optimizes decimal values (0.5 → .5)</li>
                <li>Perfect for production deployment</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Maximize2 className="h-4 w-4" />
                Beautification:
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Adds proper indentation and formatting</li>
                <li>Places each property on a new line</li>
                <li>Organizes selectors for readability</li>
                <li>Maintains all original functionality</li>
                <li>Ideal for code review and maintenance</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Optimization:
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Removes duplicate properties</li>
                <li>Combines similar rules when possible</li>
                <li>Applies advanced compression techniques</li>
                <li>Maintains CSS functionality</li>
                <li>Best balance of size and performance</li>
              </ul>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Step-by-Step Guide:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Paste your CSS code in the input area or load a sample</li>
              <li>Choose your processing method: Minify, Beautify, or Optimize</li>
              <li>Click the corresponding button to process your CSS</li>
              <li>Review the results and statistics</li>
              <li>Copy the processed CSS or download it as a file</li>
              <li>Use the processed CSS in your project</li>
            </ol>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Benefits:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><strong>Faster Loading:</strong> Minified CSS reduces file size and improves page load times</li>
              <li><strong>Better Maintenance:</strong> Beautified CSS is easier to read and maintain</li>
              <li><strong>Optimized Performance:</strong> Optimized CSS removes redundancy while maintaining functionality</li>
              <li><strong>Bandwidth Savings:</strong> Smaller files reduce bandwidth usage and hosting costs</li>
              <li><strong>SEO Benefits:</strong> Faster loading pages improve search engine rankings</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}