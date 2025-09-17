'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [testText, setTestText] = useState('');
  const [flags, setFlags] = useState('g');

  const getMatches = () => {
    if (!pattern || !testText) return [];
    
    try {
      const regex = new RegExp(pattern, flags);
      return [...testText.matchAll(regex)];
    } catch {
      return [];
    }
  };

  const matches = getMatches();

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Regex Tester</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Test Regular Expressions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 gap-2">
            <div className="col-span-3">
              <Input
                placeholder="Enter regex pattern..."
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
              />
            </div>
            <Input
              placeholder="Flags (g,i,m)"
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
            />
          </div>
          
          <Textarea
            placeholder="Enter test text..."
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            rows={8}
          />

          <div className="space-y-2">
            <h3 className="font-medium">Matches ({matches.length})</h3>
            <div className="space-y-2">
              {matches.map((match, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Badge variant="outline">Match {index + 1}</Badge>
                  <code className="bg-muted px-2 py-1 rounded">{match[0]}</code>
                  <span className="text-sm text-muted-foreground">
                    at position {match.index}
                  </span>
                </div>
              ))}
              {matches.length === 0 && pattern && testText && (
                <p className="text-muted-foreground">No matches found</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}