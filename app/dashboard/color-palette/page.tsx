'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Palette, Copy, RefreshCw, Download, Eye, Shuffle } from 'lucide-react';
import { toast } from 'sonner';
import { ResultShare } from '@/components/result-share';

interface Color {
  hex: string;
  rgb: string;
  hsl: string;
  name: string;
}

export default function ColorPaletteGenerator() {
  const [baseColor, setBaseColor] = useState('#3B82F6');
  const [paletteType, setPaletteType] = useState('complementary');
  const [colorCount, setColorCount] = useState([5]);
  const [palette, setPalette] = useState<Color[]>([]);
  const [harmony, setHarmony] = useState('analogous');
  const [brightness, setBrightness] = useState([50]);
  const [saturation, setSaturation] = useState([70]);

  const paletteTypes = [
    { value: 'complementary', label: 'Complementary' },
    { value: 'analogous', label: 'Analogous' },
    { value: 'triadic', label: 'Triadic' },
    { value: 'tetradic', label: 'Tetradic' },
    { value: 'monochromatic', label: 'Monochromatic' },
    { value: 'split-complementary', label: 'Split Complementary' },
    { value: 'random', label: 'Random' }
  ];

  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

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

    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  };

  const hslToHex = (h: number, s: number, l: number) => {
    h /= 360; s /= 100; l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h * 12) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const generateColorName = (hex: string) => {
    const colorNames: { [key: string]: string } = {
      '#FF0000': 'Red', '#00FF00': 'Green', '#0000FF': 'Blue',
      '#FFFF00': 'Yellow', '#FF00FF': 'Magenta', '#00FFFF': 'Cyan',
      '#FFA500': 'Orange', '#800080': 'Purple', '#FFC0CB': 'Pink'
    };
    return colorNames[hex.toUpperCase()] || `Color ${hex}`;
  };

  const generatePalette = () => {
    const [h, s, l] = hexToHsl(baseColor);
    const colors: Color[] = [];
    const count = colorCount[0];

    switch (paletteType) {
      case 'complementary':
        colors.push(createColor(baseColor));
        colors.push(createColor(hslToHex((h + 180) % 360, s, l)));
        break;
      
      case 'analogous':
        for (let i = 0; i < count; i++) {
          const newH = (h + (i * 30)) % 360;
          colors.push(createColor(hslToHex(newH, saturation[0], brightness[0])));
        }
        break;
      
      case 'triadic':
        colors.push(createColor(baseColor));
        colors.push(createColor(hslToHex((h + 120) % 360, s, l)));
        colors.push(createColor(hslToHex((h + 240) % 360, s, l)));
        break;
      
      case 'tetradic':
        colors.push(createColor(baseColor));
        colors.push(createColor(hslToHex((h + 90) % 360, s, l)));
        colors.push(createColor(hslToHex((h + 180) % 360, s, l)));
        colors.push(createColor(hslToHex((h + 270) % 360, s, l)));
        break;
      
      case 'monochromatic':
        for (let i = 0; i < count; i++) {
          const newL = Math.max(10, Math.min(90, l + (i - count/2) * 15));
          colors.push(createColor(hslToHex(h, s, newL)));
        }
        break;
      
      case 'split-complementary':
        colors.push(createColor(baseColor));
        colors.push(createColor(hslToHex((h + 150) % 360, s, l)));
        colors.push(createColor(hslToHex((h + 210) % 360, s, l)));
        break;
      
      case 'random':
        for (let i = 0; i < count; i++) {
          const randomH = Math.floor(Math.random() * 360);
          const randomS = Math.floor(Math.random() * 50) + 50;
          const randomL = Math.floor(Math.random() * 40) + 30;
          colors.push(createColor(hslToHex(randomH, randomS, randomL)));
        }
        break;
    }

    setPalette(colors);
    toast.success('Color palette generated!');
  };

  const createColor = (hex: string): Color => {
    const [h, s, l] = hexToHsl(hex);
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    return {
      hex,
      rgb: `rgb(${r}, ${g}, ${b})`,
      hsl: `hsl(${h}, ${s}%, ${l}%)`,
      name: generateColorName(hex)
    };
  };

  const copyColor = (color: Color, format: string) => {
    let value = '';
    switch (format) {
      case 'hex': value = color.hex; break;
      case 'rgb': value = color.rgb; break;
      case 'hsl': value = color.hsl; break;
    }
    navigator.clipboard.writeText(value);
    toast.success(`${format.toUpperCase()} copied: ${value}`);
  };

  const exportPalette = (format: string) => {
    let content = '';
    const filename = `color-palette-${Date.now()}`;
    
    switch (format) {
      case 'css':
        content = `:root {\n${palette.map((color, i) => `  --color-${i + 1}: ${color.hex};`).join('\n')}\n}`;
        break;
      case 'scss':
        content = palette.map((color, i) => `$color-${i + 1}: ${color.hex};`).join('\n');
        break;
      case 'json':
        content = JSON.stringify(palette, null, 2);
        break;
      case 'ase':
        toast.info('ASE export coming soon!');
        return;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.${format}`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Palette exported as ${format.toUpperCase()}!`);
  };

  useEffect(() => {
    generatePalette();
  }, [baseColor, paletteType, colorCount, brightness, saturation]);

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Advanced Color Palette Generator</h1>
        <p className="text-muted-foreground">
          Generate beautiful color palettes with advanced color theory and export options
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Palette Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Base Color</label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="w-16 h-10 p-1 border rounded"
                />
                <Input
                  type="text"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="flex-1"
                  placeholder="#3B82F6"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Harmony Type</label>
              <Select value={paletteType} onValueChange={setPaletteType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paletteTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Colors Count: {colorCount[0]}
              </label>
              <Slider
                value={colorCount}
                onValueChange={setColorCount}
                max={10}
                min={3}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Brightness: {brightness[0]}%
              </label>
              <Slider
                value={brightness}
                onValueChange={setBrightness}
                max={90}
                min={10}
                step={5}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Saturation: {saturation[0]}%
              </label>
              <Slider
                value={saturation}
                onValueChange={setSaturation}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={generatePalette} className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate
              </Button>
              <Button variant="outline" onClick={() => {
                setBaseColor(`#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`);
              }}>
                <Shuffle className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Palette Display */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Generated Palette</CardTitle>
              <div className="flex gap-2">
                <Select onValueChange={exportPalette}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Export" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="css">CSS</SelectItem>
                    <SelectItem value="scss">SCSS</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="ase">ASE</SelectItem>
                  </SelectContent>
                </Select>
                <ResultShare 
                  title="Color Palette"
                  result={palette}
                  resultType="text"
                  toolName="color-palette"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {palette.map((color, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <div 
                    className="h-24 w-full cursor-pointer transition-transform hover:scale-105"
                    style={{ backgroundColor: color.hex }}
                    onClick={() => copyColor(color, 'hex')}
                  />
                  <div className="p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        Color {index + 1}
                      </Badge>
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono">{color.hex}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0"
                          onClick={() => copyColor(color, 'hex')}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-mono">{color.rgb}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0"
                          onClick={() => copyColor(color, 'rgb')}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-mono">{color.hsl}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0"
                          onClick={() => copyColor(color, 'hsl')}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Color Theory Info */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Color Theory Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Complementary</h4>
              <p className="text-muted-foreground">Colors opposite on the color wheel. High contrast, vibrant look.</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Analogous</h4>
              <p className="text-muted-foreground">Colors next to each other. Harmonious, pleasing to the eye.</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Triadic</h4>
              <p className="text-muted-foreground">Three colors evenly spaced. Vibrant yet balanced.</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Tetradic</h4>
              <p className="text-muted-foreground">Four colors forming a rectangle. Rich color palette.</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Monochromatic</h4>
              <p className="text-muted-foreground">Variations of a single color. Clean, elegant look.</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Split Complementary</h4>
              <p className="text-muted-foreground">Base color plus two adjacent to its complement.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}