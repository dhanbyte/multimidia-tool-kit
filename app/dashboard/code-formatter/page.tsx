'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Code, Copy, Download, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { ResultShare } from '@/components/result-share';

export default function CodeFormatter() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [formatted, setFormatted] = useState('');
  const [indentSize, setIndentSize] = useState('2');

  const formatJavaScript = (code: string, indent: string) => {
    let result = code.trim();
    let level = 0;
    let inString = false;
    let stringChar = '';
    let formatted = '';
    
    for (let i = 0; i < result.length; i++) {
      const char = result[i];
      const nextChar = result[i + 1];
      
      if ((char === '"' || char === "'") && result[i - 1] !== '\\') {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (char === stringChar) {
          inString = false;
        }
      }
      
      if (!inString) {
        if (char === '{') {
          formatted += char + '\n' + indent.repeat(++level);
          continue;
        }
        if (char === '}') {
          formatted = formatted.trimEnd() + '\n' + indent.repeat(--level) + char;
          if (nextChar && nextChar !== ',' && nextChar !== ';' && nextChar !== '}') {
            formatted += '\n' + indent.repeat(level);
          }
          continue;
        }
        if (char === ';' && nextChar !== '}') {
          formatted += char + '\n' + indent.repeat(level);
          continue;
        }
        if (char === ',' && result.substring(i - 10, i).includes('{')) {
          formatted += char + '\n' + indent.repeat(level);
          continue;
        }
      }
      
      formatted += char;
    }
    
    return formatted.replace(/\n\s*\n/g, '\n').trim();
  };

  const formatCSS = (code: string, indent: string) => {
    let result = code.trim();
    let level = 0;
    let formatted = '';
    
    result = result.replace(/\s*{\s*/g, ' {\n')
                  .replace(/;\s*/g, ';\n')
                  .replace(/}\s*/g, '\n}\n')
                  .replace(/,\s*/g, ',\n');
    
    const lines = result.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      
      if (trimmed.includes('{')) {
        formatted += indent.repeat(level) + trimmed + '\n';
        level++;
      } else if (trimmed === '}') {
        level = Math.max(0, level - 1);
        formatted += indent.repeat(level) + trimmed + '\n';
      } else {
        formatted += indent.repeat(level) + trimmed + '\n';
      }
    }
    
    return formatted.trim();
  };

  const formatHTML = (code: string, indent: string) => {
    let result = code.trim();
    let level = 0;
    let formatted = '';
    
    // Split by tags
    const tags = result.split(/(<[^>]*>)/);
    
    for (const tag of tags) {
      if (!tag.trim()) continue;
      
      if (tag.startsWith('<')) {
        if (tag.startsWith('</')) {
          level = Math.max(0, level - 1);
          formatted += indent.repeat(level) + tag + '\n';
        } else if (tag.endsWith('/>')) {
          formatted += indent.repeat(level) + tag + '\n';
        } else {
          formatted += indent.repeat(level) + tag + '\n';
          if (!['br', 'img', 'input', 'hr', 'meta', 'link'].some(selfClosing => 
            tag.toLowerCase().includes(`<${selfClosing}`))) {
            level++;
          }
        }
      } else {
        const content = tag.trim();
        if (content) {
          formatted += indent.repeat(level) + content + '\n';
        }
      }
    }
    
    return formatted.trim();
  };

  const formatJSON = (code: string, indent: string) => {
    try {
      const parsed = JSON.parse(code);
      return JSON.stringify(parsed, null, parseInt(indentSize));
    } catch {
      return code;
    }
  };

  const formatCode = () => {
    if (!code.trim()) {
      toast.error('Please enter code to format');
      return;
    }

    const indent = ' '.repeat(parseInt(indentSize));
    let result = code;
    
    try {
      switch (language) {
        case 'javascript':
        case 'typescript':
          result = formatJavaScript(code, indent);
          break;
        case 'css':
        case 'scss':
          result = formatCSS(code, indent);
          break;
        case 'html':
          result = formatHTML(code, indent);
          break;
        case 'json':
          result = formatJSON(code, indent);
          break;
        case 'xml':
          result = formatHTML(code, indent); // Similar to HTML
          break;
        default:
          result = code;
      }
      
      setFormatted(result);
      toast.success('Code formatted successfully!');
    } catch (error) {
      toast.error('Error formatting code');
    }
  };

  const minifyCode = () => {
    if (!code.trim()) {
      toast.error('Please enter code to minify');
      return;
    }

    let result = code;
    
    if (language === 'javascript' || language === 'typescript') {
      result = code.replace(/\s+/g, ' ')
                  .replace(/;\s*}/g, '}')
                  .replace(/\s*{\s*/g, '{')
                  .replace(/;\s*/g, ';')
                  .trim();
    } else if (language === 'css' || language === 'scss') {
      result = code.replace(/\s+/g, ' ')
                  .replace(/;\s*}/g, '}')
                  .replace(/\s*{\s*/g, '{')
                  .replace(/;\s*/g, ';')
                  .replace(/,\s*/g, ',')
                  .trim();
    } else if (language === 'json') {
      try {
        const parsed = JSON.parse(code);
        result = JSON.stringify(parsed);
      } catch {
        result = code.replace(/\s+/g, ' ').trim();
      }
    } else {
      result = code.replace(/\s+/g, ' ').trim();
    }
    
    setFormatted(result);
    toast.success('Code minified successfully!');
  };

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const downloadCode = () => {
    if (!formatted) {
      toast.error('No formatted code to download');
      return;
    }

    const extensions: { [key: string]: string } = {
      javascript: 'js',
      typescript: 'ts',
      css: 'css',
      scss: 'scss',
      html: 'html',
      json: 'json',
      xml: 'xml'
    };

    const blob = new Blob([formatted], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `formatted-code.${extensions[language] || 'txt'}`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Code downloaded!');
  };

  const clearAll = () => {
    setCode('');
    setFormatted('');
  };

  const loadSample = () => {
    const samples: { [key: string]: string } = {
      javascript: `function calculateSum(a,b){if(typeof a!=='number'||typeof b!=='number'){throw new Error('Invalid input');}return a+b;}const result=calculateSum(5,3);console.log(result);`,
      css: `.container{display:flex;justify-content:center;align-items:center;height:100vh;background-color:#f0f0f0;}.card{padding:20px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);background:white;}`,
      html: `<div class="container"><header><h1>Welcome</h1><nav><ul><li><a href="#home">Home</a></li><li><a href="#about">About</a></li></ul></nav></header><main><p>This is the main content.</p></main></div>`,
      json: `{"name":"John Doe","age":30,"address":{"street":"123 Main St","city":"New York"},"hobbies":["reading","coding"]}`
    };
    
    setCode(samples[language] || samples.javascript);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Code Formatter</h1>
        <p className="text-muted-foreground">
          Format, beautify, and minify code in multiple programming languages
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Code Formatter & Beautifier
          </CardTitle>
          <CardDescription>
            Format and beautify your code with proper indentation and structure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Language:</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="css">CSS</SelectItem>
                  <SelectItem value="scss">SCSS</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="xml">XML</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Indent Size:</label>
              <Select value={indentSize} onValueChange={setIndentSize}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="8">8</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Input Code</label>
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
                placeholder={`Paste your ${language} code here...`}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={18}
                className="font-mono text-sm"
              />
              
              <div className="flex gap-2">
                <Button onClick={formatCode} className="flex-1">
                  <Code className="h-4 w-4 mr-2" />
                  Format Code
                </Button>
                <Button onClick={minifyCode} variant="outline" className="flex-1">
                  Minify Code
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Formatted Output</label>
                {formatted && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(formatted)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadCode}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <ResultShare 
                      title="Formatted Code"
                      result={formatted}
                      resultType="text"
                      toolName="code-formatter"
                    />
                  </div>
                )}
              </div>
              
              {formatted ? (
                <Textarea
                  value={formatted}
                  readOnly
                  rows={18}
                  className="font-mono text-sm"
                />
              ) : (
                <div className="h-[432px] flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-md">
                  <div className="text-center">
                    <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Formatted code will appear here</p>
                    <p className="text-sm mt-2">Select language and paste your code to get started</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {formatted && (
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <Badge variant="secondary">
                Language: {language.toUpperCase()}
              </Badge>
              <Badge variant="secondary">
                Lines: {formatted.split('\n').length}
              </Badge>
              <Badge variant="secondary">
                Characters: {formatted.length}
              </Badge>
              <Badge variant="secondary">
                Size: {(new Blob([formatted]).size / 1024).toFixed(2)} KB
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Guide */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>How to Use Code Formatter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Step-by-Step Guide:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Select your programming language from the dropdown</li>
                <li>Choose your preferred indentation size (2, 4, or 8 spaces)</li>
                <li>Paste or type your unformatted code in the input area</li>
                <li>Click "Format Code" to beautify or "Minify Code" to compress</li>
                <li>Copy or download the formatted result</li>
              </ol>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Supported Languages:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>JavaScript/TypeScript:</strong> Proper indentation, bracket placement</li>
                <li><strong>CSS/SCSS:</strong> Property alignment, selector formatting</li>
                <li><strong>HTML/XML:</strong> Tag indentation, attribute formatting</li>
                <li><strong>JSON:</strong> Pretty printing with proper structure</li>
              </ul>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Features:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><strong>Smart Formatting:</strong> Language-specific formatting rules</li>
              <li><strong>Minification:</strong> Remove unnecessary whitespace and comments</li>
              <li><strong>Customizable Indentation:</strong> Choose between 2, 4, or 8 spaces</li>
              <li><strong>Copy & Download:</strong> Easy sharing and saving of formatted code</li>
              <li><strong>Sample Code:</strong> Load example code to test the formatter</li>
              <li><strong>Statistics:</strong> View line count, character count, and file size</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}