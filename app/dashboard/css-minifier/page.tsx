'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Minimize2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CSSMinifier() {
  const [css, setCss] = useState('');
  const [minified, setMinified] = useState('');
  const [stats, setStats] = useState({ original: 0, minified: 0, saved: 0 });

  const minifyCSS = () => {
    if (!css.trim()) {
      toast.error('Please enter CSS to minify');
      return;
    }

    const result = css
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/;\s*}/g, '}') // Remove semicolon before closing brace
      .replace(/\s*{\s*/g, '{') // Remove spaces around opening brace
      .replace(/;\s*/g, ';') // Remove spaces after semicolon
      .replace(/,\s*/g, ',') // Remove spaces after comma
      .replace(/:\s*/g, ':') // Remove spaces after colon
      .trim();

    setMinified(result);
    
    const originalSize = css.length;
    const minifiedSize = result.length;
    const savedBytes = originalSize - minifiedSize;
    const savedPercent = originalSize > 0 ? ((savedBytes / originalSize) * 100).toFixed(1) : 0;

    setStats({
      original: originalSize,
      minified: minifiedSize,
      saved: parseFloat(savedPercent.toString())
    });

    toast.success('CSS minified successfully!');
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">CSS Minifier</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Minimize2 className="h-5 w-5" />
            Minify CSS Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Input CSS</label>
              <Textarea
                placeholder="Paste your CSS code here..."
                value={css}
                onChange={(e) => setCss(e.target.value)}
                rows={15}
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Minified CSS</label>
              <Textarea
                value={minified}
                readOnly
                rows={15}
                className="font-mono text-sm"
              />
            </div>
          </div>

          <Button onClick={minifyCSS} className="w-full">
            Minify CSS
          </Button>

          {minified && (
            <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.original}</div>
                <div className="text-sm text-muted-foreground">Original Bytes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.minified}</div>
                <div className="text-sm text-muted-foreground">Minified Bytes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.saved}%</div>
                <div className="text-sm text-muted-foreground">Size Reduction</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}