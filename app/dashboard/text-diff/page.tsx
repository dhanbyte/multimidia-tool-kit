'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GitCompare } from 'lucide-react';

export default function TextDiff() {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');

  const getDiff = () => {
    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    const maxLines = Math.max(lines1.length, lines2.length);
    
    const diff = [];
    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i] || '';
      const line2 = lines2[i] || '';
      
      if (line1 !== line2) {
        diff.push({ line: i + 1, text1: line1, text2: line2, different: true });
      } else {
        diff.push({ line: i + 1, text1: line1, text2: line2, different: false });
      }
    }
    return diff;
  };

  const diff = getDiff();

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Text Diff Checker</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Text 1</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Enter first text..."
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              rows={10}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Text 2</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Enter second text..."
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              rows={10}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCompare className="h-5 w-5" />
            Differences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 font-mono text-sm">
            {diff.map((item, index) => (
              <div key={index} className={`p-2 rounded ${item.different ? 'bg-red-50' : 'bg-green-50'}`}>
                <div className="text-xs text-muted-foreground mb-1">Line {item.line}</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className={item.different ? 'text-red-600' : ''}>{item.text1}</div>
                  <div className={item.different ? 'text-red-600' : ''}>{item.text2}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}