'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Palette } from 'lucide-react';
import { toast } from 'sonner';

export default function GradientGenerator() {
  const [color1, setColor1] = useState('#ff6b6b');
  const [color2, setColor2] = useState('#4ecdc4');
  const [direction, setDirection] = useState('to right');
  const [gradientType, setGradientType] = useState('linear');

  const directions = [
    { value: 'to right', label: 'To Right' },
    { value: 'to left', label: 'To Left' },
    { value: 'to bottom', label: 'To Bottom' },
    { value: 'to top', label: 'To Top' },
    { value: '45deg', label: '45° Diagonal' },
    { value: '135deg', label: '135° Diagonal' }
  ];

  const gradientCSS = gradientType === 'linear' 
    ? `linear-gradient(${direction}, ${color1}, ${color2})`
    : `radial-gradient(circle, ${color1}, ${color2})`;

  const copyCSS = () => {
    navigator.clipboard.writeText(`background: ${gradientCSS};`);
    toast.success('CSS copied to clipboard!');
  };

  const randomGradient = () => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'];
    setColor1(colors[Math.floor(Math.random() * colors.length)]);
    setColor2(colors[Math.floor(Math.random() * colors.length)]);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Gradient Generator</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Create CSS Gradients
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Color 1</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={color1}
                    onChange={(e) => setColor1(e.target.value)}
                    className="w-12 h-10 rounded border cursor-pointer"
                  />
                  <Input value={color1} onChange={(e) => setColor1(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Color 2</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={color2}
                    onChange={(e) => setColor2(e.target.value)}
                    className="w-12 h-10 rounded border cursor-pointer"
                  />
                  <Input value={color2} onChange={(e) => setColor2(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select value={gradientType} onValueChange={setGradientType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linear">Linear</SelectItem>
                    <SelectItem value="radial">Radial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {gradientType === 'linear' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Direction</label>
                  <Select value={direction} onValueChange={setDirection}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {directions.map(dir => (
                        <SelectItem key={dir.value} value={dir.value}>{dir.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button onClick={randomGradient} variant="outline" className="flex-1">
                Random Gradient
              </Button>
              <Button onClick={copyCSS} className="flex-1">
                <Copy className="h-4 w-4 mr-2" />
                Copy CSS
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="w-full h-64 rounded-lg border"
              style={{ background: gradientCSS }}
            />
            <div className="mt-4 p-3 bg-muted rounded font-mono text-sm">
              background: {gradientCSS};
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}