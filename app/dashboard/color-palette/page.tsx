'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Palette, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface Color {
  hex: string;
  rgb: string;
  hsl: string;
}

export default function ColorPalette() {
  const [baseColor, setBaseColor] = useState('#3b82f6');
  const [palette, setPalette] = useState<Color[]>([]);

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

  const generatePalette = () => {
    const colors: Color[] = [];
    const baseHue = parseInt(baseColor.slice(1), 16);
    
    // Generate complementary and analogous colors
    const variations = [
      baseColor,
      adjustBrightness(baseColor, 20),
      adjustBrightness(baseColor, -20),
      adjustHue(baseColor, 30),
      adjustHue(baseColor, -30),
      adjustHue(baseColor, 180), // Complementary
      adjustSaturation(baseColor, 20),
      adjustSaturation(baseColor, -20),
    ];

    variations.forEach(hex => {
      colors.push({
        hex,
        rgb: hexToRgb(hex),
        hsl: hexToHsl(hex)
      });
    });

    setPalette(colors);
    toast.success('Color palette generated!');
  };

  const adjustBrightness = (hex: string, percent: number) => {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  };

  const adjustHue = (hex: string, degrees: number) => {
    // Simple hue adjustment - in a real app, you'd use proper HSL conversion
    const num = parseInt(hex.replace('#', ''), 16);
    const hueShift = Math.floor(degrees / 360 * 255);
    return '#' + ((num + hueShift) % 0xFFFFFF).toString(16).padStart(6, '0');
  };

  const adjustSaturation = (hex: string, percent: number) => {
    // Simple saturation adjustment
    return adjustBrightness(hex, percent / 2);
  };

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    toast.success(`Copied ${color} to clipboard!`);
  };

  const generateRandomColor = () => {
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    setBaseColor(randomColor);
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Color Palette Generator</h1>
        <p className="text-muted-foreground">
          Generate beautiful color palettes from a base color
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Generate Color Palette
          </CardTitle>
          <CardDescription>
            Choose a base color and generate a harmonious color palette
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium">Base Color</label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  placeholder="#3b82f6"
                  className="flex-1"
                />
              </div>
            </div>
            <Button variant="outline" onClick={generateRandomColor}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Random
            </Button>
            <Button onClick={generatePalette}>
              Generate Palette
            </Button>
          </div>
        </CardContent>
      </Card>

      {palette.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Palette</CardTitle>
            <CardDescription>
              Click on any color value to copy it to clipboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {palette.map((color, index) => (
                <div key={index} className="space-y-2">
                  <div
                    className="w-full h-24 rounded-lg border cursor-pointer"
                    style={{ backgroundColor: color.hex }}
                    onClick={() => copyColor(color.hex)}
                  />
                  <div className="space-y-1 text-sm">
                    <div
                      className="flex items-center justify-between cursor-pointer hover:bg-muted p-1 rounded"
                      onClick={() => copyColor(color.hex)}
                    >
                      <span className="font-mono">{color.hex}</span>
                      <Copy className="h-3 w-3" />
                    </div>
                    <div
                      className="flex items-center justify-between cursor-pointer hover:bg-muted p-1 rounded"
                      onClick={() => copyColor(color.rgb)}
                    >
                      <span className="font-mono text-xs">{color.rgb}</span>
                      <Copy className="h-3 w-3" />
                    </div>
                    <div
                      className="flex items-center justify-between cursor-pointer hover:bg-muted p-1 rounded"
                      onClick={() => copyColor(color.hsl)}
                    >
                      <span className="font-mono text-xs">{color.hsl}</span>
                      <Copy className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}