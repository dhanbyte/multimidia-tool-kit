'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Palette } from 'lucide-react';
import { toast } from 'sonner';

export default function ColorPicker() {
  const [color, setColor] = useState('#3b82f6');

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`
      : '';
  };

  const hexToHsl = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return '';

    let r = parseInt(result[1], 16) / 255;
    let g = parseInt(result[2], 16) / 255;
    let b = parseInt(result[3], 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  const copyColor = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success(`Copied ${value}!`);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Color Picker</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Pick and Convert Colors
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4 items-center">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-20 h-20 rounded-lg border cursor-pointer"
            />
            <div className="flex-1">
              <Input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="#3b82f6"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">HEX</label>
              <div className="flex gap-2">
                <Input value={color} readOnly className="font-mono" />
                <button
                  onClick={() => copyColor(color)}
                  className="p-2 hover:bg-muted rounded"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">RGB</label>
              <div className="flex gap-2">
                <Input value={hexToRgb(color)} readOnly className="font-mono" />
                <button
                  onClick={() => copyColor(hexToRgb(color))}
                  className="p-2 hover:bg-muted rounded"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">HSL</label>
              <div className="flex gap-2">
                <Input value={hexToHsl(color)} readOnly className="font-mono" />
                <button
                  onClick={() => copyColor(hexToHsl(color))}
                  className="p-2 hover:bg-muted rounded"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Color Preview</label>
            <div
              className="w-full h-32 rounded-lg border"
              style={{ backgroundColor: color }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}