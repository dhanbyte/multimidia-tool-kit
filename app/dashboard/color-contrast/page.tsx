'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';

export default function ColorContrast() {
  const [bgColor, setBgColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#000000');

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const getContrastRatio = () => {
    const bg = hexToRgb(bgColor);
    const text = hexToRgb(textColor);
    
    if (!bg || !text) return 1;
    
    const bgLum = getLuminance(bg.r, bg.g, bg.b);
    const textLum = getLuminance(text.r, text.g, text.b);
    
    const lighter = Math.max(bgLum, textLum);
    const darker = Math.min(bgLum, textLum);
    
    return (lighter + 0.05) / (darker + 0.05);
  };

  const ratio = getContrastRatio();
  const aaPass = ratio >= 4.5;
  const aaaPass = ratio >= 7;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Color Contrast Checker</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Color Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Background Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-12 h-10 rounded border cursor-pointer"
                />
                <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Text Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-12 h-10 rounded border cursor-pointer"
                />
                <Input value={textColor} onChange={(e) => setTextColor(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Contrast Ratio</h3>
              <div className="text-3xl font-bold">{ratio.toFixed(2)}:1</div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant={aaPass ? 'default' : 'destructive'}>
                    {aaPass ? 'PASS' : 'FAIL'}
                  </Badge>
                  <span className="text-sm">WCAG AA (4.5:1)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={aaaPass ? 'default' : 'destructive'}>
                    {aaaPass ? 'PASS' : 'FAIL'}
                  </Badge>
                  <span className="text-sm">WCAG AAA (7:1)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="p-6 rounded-lg"
              style={{ backgroundColor: bgColor, color: textColor }}
            >
              <h2 className="text-2xl font-bold mb-4">Sample Heading</h2>
              <p className="mb-4">
                This is a sample paragraph to demonstrate how the text appears 
                against the background color. The contrast ratio determines 
                readability and accessibility compliance.
              </p>
              <p className="text-sm">
                Small text example for testing different font sizes.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}