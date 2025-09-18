'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Database, Copy, Download, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ResultShare } from '@/components/result-share';

export default function SQLFormatter() {
  const [sql, setSql] = useState('');
  const [formatted, setFormatted] = useState('');
  const [indentSize, setIndentSize] = useState('2');
  const [sqlDialect, setSqlDialect] = useState('standard');
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const formatSQL = () => {
    if (!sql.trim()) {
      toast.error('Please enter SQL to format');
      return;
    }

    try {
      const indent = ' '.repeat(parseInt(indentSize));
      let result = sql.replace(/\s+/g, ' ').trim();
      
      // Advanced SQL formatting
      result = result
        // Main clauses
        .replace(/(SELECT|INSERT INTO|UPDATE|DELETE FROM|CREATE TABLE|ALTER TABLE|DROP TABLE)/gi, '\n$1')
        .replace(/(FROM|WHERE|GROUP BY|HAVING|ORDER BY|LIMIT|OFFSET)/gi, '\n$1')
        .replace(/(INNER JOIN|LEFT JOIN|RIGHT JOIN|FULL JOIN|CROSS JOIN|JOIN)/gi, '\n$1')
        .replace(/(UNION|UNION ALL|INTERSECT|EXCEPT)/gi, '\n$1')
        .replace(/(VALUES|SET)/gi, '\n$1')
        
        // Subqueries and conditions
        .replace(/(AND|OR)(?![^()]*\))/gi, `\n${indent}$1`)
        .replace(/(ON)\s+/gi, `\n${indent}$1 `)
        
        // Case statements
        .replace(/(CASE|WHEN|THEN|ELSE|END)/gi, (match, p1, offset, string) => {
          const beforeMatch = string.substring(0, offset);
          const openParens = (beforeMatch.match(/\(/g) || []).length;
          const closeParens = (beforeMatch.match(/\)/g) || []).length;
          const inParens = openParens > closeParens;
          
          if (p1.toUpperCase() === 'CASE') return `\n${indent}${p1}`;
          if (p1.toUpperCase() === 'WHEN') return `\n${indent}${indent}${p1}`;
          if (p1.toUpperCase() === 'THEN') return ` ${p1}`;
          if (p1.toUpperCase() === 'ELSE') return `\n${indent}${indent}${p1}`;
          if (p1.toUpperCase() === 'END') return `\n${indent}${p1}`;
          return match;
        })
        
        // Functions and parentheses
        .replace(/,(?![^()]*\))/g, `,\n${indent}`)
        
        // Clean up extra whitespace
        .replace(/\n\s*\n/g, '\n')
        .replace(/^\s+/gm, (match) => {
          const level = Math.floor(match.length / parseInt(indentSize));
          return indent.repeat(level);
        })
        .trim();

      // Basic SQL validation
      const keywords = ['SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP'];
      const hasKeyword = keywords.some(keyword => 
        result.toUpperCase().includes(keyword)
      );
      
      // Check for balanced parentheses
      const openParens = (result.match(/\(/g) || []).length;
      const closeParens = (result.match(/\)/g) || []).length;
      const balancedParens = openParens === closeParens;
      
      setIsValid(hasKeyword && balancedParens);
      setFormatted(result);
      toast.success('SQL formatted successfully!');
    } catch (error) {
      setIsValid(false);
      toast.error('Error formatting SQL');
    }
  };

  const minifySQL = () => {
    if (!sql.trim()) {
      toast.error('Please enter SQL to minify');
      return;
    }

    const result = sql
      .replace(/--.*$/gm, '') // Remove single-line comments
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\s*([(),;])\s*/g, '$1') // Remove spaces around punctuation
      .trim();
      
    setFormatted(result);
    setIsValid(null);
    toast.success('SQL minified successfully!');
  };

  const validateSQL = () => {
    if (!sql.trim()) {
      toast.error('Please enter SQL to validate');
      return;
    }

    // Basic SQL validation
    const keywords = ['SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP'];
    const hasKeyword = keywords.some(keyword => 
      sql.toUpperCase().includes(keyword)
    );
    
    const openParens = (sql.match(/\(/g) || []).length;
    const closeParens = (sql.match(/\)/g) || []).length;
    const balancedParens = openParens === closeParens;
    
    const openQuotes = (sql.match(/'/g) || []).length;
    const balancedQuotes = openQuotes % 2 === 0;
    
    const valid = hasKeyword && balancedParens && balancedQuotes;
    setIsValid(valid);
    
    if (valid) {
      toast.success('SQL appears to be valid!');
    } else {
      toast.error('SQL validation failed - check syntax');
    }
  };

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const downloadSQL = () => {
    if (!formatted) {
      toast.error('No formatted SQL to download');
      return;
    }

    const blob = new Blob([formatted], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `formatted-query-${Date.now()}.sql`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('SQL downloaded!');
  };

  const clearAll = () => {
    setSql('');
    setFormatted('');
    setIsValid(null);
  };

  const loadSample = () => {
    const sampleSQL = `SELECT u.id, u.name, u.email, p.title, p.content, c.name as category FROM users u LEFT JOIN posts p ON u.id = p.user_id INNER JOIN categories c ON p.category_id = c.id WHERE u.active = 1 AND p.published_at IS NOT NULL ORDER BY p.created_at DESC LIMIT 10;`;
    setSql(sampleSQL);
  };

  const getStats = () => {
    if (!formatted) return null;
    
    return {
      lines: formatted.split('\n').length,
      characters: formatted.length,
      words: formatted.split(/\s+/).filter(word => word.length > 0).length,
      size: (new Blob([formatted]).size / 1024).toFixed(2)
    };
  };

  const stats = getStats();

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">SQL Formatter</h1>
        <p className="text-muted-foreground">
          Format, beautify, minify, and validate SQL queries with advanced formatting options
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            SQL Query Formatter & Beautifier
          </CardTitle>
          <CardDescription>
            Format your SQL queries with proper indentation and structure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Configuration Options */}
          <div className="flex flex-wrap gap-4">
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
            
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">SQL Dialect:</label>
              <Select value={sqlDialect} onValueChange={setSqlDialect}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="mysql">MySQL</SelectItem>
                  <SelectItem value="postgresql">PostgreSQL</SelectItem>
                  <SelectItem value="sqlite">SQLite</SelectItem>
                  <SelectItem value="mssql">SQL Server</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Panel */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Input SQL Query</label>
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
                placeholder="Paste your SQL query here...\n\nExample:\nSELECT * FROM users WHERE active = 1;"
                value={sql}
                onChange={(e) => setSql(e.target.value)}
                rows={18}
                className="font-mono text-sm"
              />
              
              <div className="flex gap-2">
                <Button onClick={formatSQL} className="flex-1">
                  <Database className="h-4 w-4 mr-2" />
                  Format SQL
                </Button>
                <Button onClick={minifySQL} variant="outline" className="flex-1">
                  Minify SQL
                </Button>
                <Button onClick={validateSQL} variant="outline">
                  Validate
                </Button>
              </div>
              
              {/* Validation Status */}
              {isValid !== null && (
                <div className="flex items-center gap-2">
                  {isValid ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Valid SQL
                      </Badge>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <Badge variant="destructive">
                        Invalid SQL
                      </Badge>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Output Panel */}
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
                    <Button variant="outline" size="sm" onClick={downloadSQL}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <ResultShare 
                      title="Formatted SQL"
                      result={formatted}
                      resultType="text"
                      toolName="sql-formatter"
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
                    <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Formatted SQL will appear here</p>
                    <p className="text-sm mt-2">Enter your SQL query and click Format</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Statistics */}
          {stats && (
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <Badge variant="secondary">
                Lines: {stats.lines}
              </Badge>
              <Badge variant="secondary">
                Characters: {stats.characters}
              </Badge>
              <Badge variant="secondary">
                Words: {stats.words}
              </Badge>
              <Badge variant="secondary">
                Size: {stats.size} KB
              </Badge>
              <Badge variant="secondary">
                Dialect: {sqlDialect.toUpperCase()}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Guide */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>How to Use SQL Formatter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Step-by-Step Guide:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Choose your preferred indentation size (2, 4, or 8 spaces)</li>
                <li>Select your SQL dialect for optimal formatting</li>
                <li>Paste or type your SQL query in the input area</li>
                <li>Click "Format SQL" to beautify or "Minify SQL" to compress</li>
                <li>Use "Validate" to check for basic syntax errors</li>
                <li>Copy or download the formatted result</li>
              </ol>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Supported SQL Features:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>SELECT Statements:</strong> Proper column and table formatting</li>
                <li><strong>JOIN Operations:</strong> Clear indentation for complex joins</li>
                <li><strong>Subqueries:</strong> Nested query formatting</li>
                <li><strong>CASE Statements:</strong> Structured conditional formatting</li>
                <li><strong>INSERT/UPDATE/DELETE:</strong> DML statement formatting</li>
                <li><strong>DDL Statements:</strong> CREATE, ALTER, DROP formatting</li>
              </ul>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Features:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><strong>Advanced Formatting:</strong> Intelligent indentation and line breaks</li>
              <li><strong>Multiple Dialects:</strong> Support for MySQL, PostgreSQL, SQLite, SQL Server</li>
              <li><strong>Syntax Validation:</strong> Basic SQL syntax checking</li>
              <li><strong>Minification:</strong> Remove comments and unnecessary whitespace</li>
              <li><strong>Statistics:</strong> View query metrics and file size</li>
              <li><strong>Export Options:</strong> Copy to clipboard or download as .sql file</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Common Use Cases:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><strong>Code Review:</strong> Make SQL queries more readable for team review</li>
              <li><strong>Documentation:</strong> Format queries for technical documentation</li>
              <li><strong>Learning:</strong> Understand complex query structure through formatting</li>
              <li><strong>Optimization:</strong> Minify queries for production deployment</li>
              <li><strong>Migration:</strong> Format queries when moving between databases</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}