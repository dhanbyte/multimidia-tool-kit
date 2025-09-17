'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Copy, RefreshCw, Plus, Minus, Eye, Code } from 'lucide-react';
import { toast } from 'sonner';
import { ResultShare } from '@/components/result-share';

interface ColorStop {
  color: string;
  position: number;
}

interface GradientPreset {
  name: string;
  type: string;
  direction: string;
  stops: ColorStop[];
}

export default function CSSGradientGenerator() {
  const [gradientType, setGradientType] = useState('linear');
  const [direction, setDirection] = useState('to right');
  const [angle, setAngle] = useState([90]);
  const [colorStops, setColorStops] = useState<ColorStop[]>([
    { color: '#FF6B6B', position: 0 },
    { color: '#4ECDC4', position: 100 }
  ]);
  const [radialShape, setRadialShape] = useState('ellipse');
  const [radialSize, setRadialSize] = useState('farthest-corner');
  const [radialPosition, setRadialPosition] = useState('center');
  const [cssCode, setCssCode] = useState('');

  const presets: GradientPreset[] = [
    { name: 'Sunset', type: 'linear', direction: 'to right', stops: [
      { color: '#FF512F', position: 0 }, { color: '#F09819', position: 100 }
    ]},
    { name: 'Ocean', type: 'linear', direction: 'to bottom', stops: [
      { color: '#2196F3', position: 0 }, { color: '#21CBF3', position: 100 }
    ]},
    { name: 'Purple Rain', type: 'linear', direction: '45deg', stops: [
      { color: '#667eea', position: 0 }, { color: '#764ba2', position: 100 }
    ]},
    { name: 'Green Leaf', type: 'radial', direction: 'circle', stops: [
      { color: '#56ab2f', position: 0 }, { color: '#a8e6cf', position: 100 }
    ]},
    { name: 'Fire', type: 'linear', direction: 'to top', stops: [
      { color: '#f12711', position: 0 }, { color: '#f5af19', position: 50 }, { color: '#ff4b1f', position: 100 }
    ]},
    { name: 'Cool Blues', type: 'radial', direction: 'ellipse', stops: [
      { color: '#2196F3', position: 0 }, { color: '#1976D2', position: 50 }, { color: '#0D47A1', position: 100 }
    ]}
  ];

  const linearDirections = [
    { value: 'to right', label: 'To Right' },
    { value: 'to left', label: 'To Left' },
    { value: 'to bottom', label: 'To Bottom' },
    { value: 'to top', label: 'To Top' },
    { value: 'to bottom right', label: 'To Bottom Right' },
    { value: 'to bottom left', label: 'To Bottom Left' },
    { value: 'to top right', label: 'To Top Right' },
    { value: 'to top left', label: 'To Top Left' }
  ];

  const generateCSS = () => {
    let gradient = '';
    const stops = colorStops
      .sort((a, b) => a.position - b.position)
      .map(stop => `${stop.color} ${stop.position}%`)
      .join(', ');

    if (gradientType === 'linear') {
      const dir = direction.includes('deg') ? direction : direction;
      gradient = `linear-gradient(${dir}, ${stops})`;
    } else if (gradientType === 'radial') {
      const shape = radialShape === 'circle' ? 'circle' : 'ellipse';
      const size = radialSize;
      const pos = radialPosition;
      gradient = `radial-gradient(${shape} ${size} at ${pos}, ${stops})`;
    } else if (gradientType === 'conic') {
      gradient = `conic-gradient(from ${angle[0]}deg, ${stops})`;
    }

    const css = `background: ${gradient};`;
    return css;
  };

  const addColorStop = () => {
    const newPosition = colorStops.length > 0 
      ? Math.max(...colorStops.map(s => s.position)) + 10 
      : 50;
    setColorStops([...colorStops, { 
      color: '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'), 
      position: Math.min(newPosition, 100) 
    }]);
  };

  const removeColorStop = (index: number) => {
    if (colorStops.length > 2) {
      setColorStops(colorStops.filter((_, i) => i !== index));
    }
  };

  const updateColorStop = (index: number, field: 'color' | 'position', value: string | number) => {
    const updated = [...colorStops];
    updated[index] = { ...updated[index], [field]: value };
    setColorStops(updated);
  };

  const applyPreset = (preset: GradientPreset) => {
    setGradientType(preset.type);
    setDirection(preset.direction);
    setColorStops(preset.stops);
    toast.success(`Applied ${preset.name} preset!`);
  };

  const copyCSS = () => {
    navigator.clipboard.writeText(cssCode);
    toast.success('CSS copied to clipboard!');
  };

  const randomizeGradient = () => {
    const types = ['linear', 'radial', 'conic'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const randomStops = Array.from({ length: Math.floor(Math.random() * 3) + 2 }, (_, i) => ({
      color: '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'),
      position: (i / (Math.floor(Math.random() * 3) + 1)) * 100
    }));

    setGradientType(randomType);
    setColorStops(randomStops);
    if (randomType === 'linear') {
      setDirection(linearDirections[Math.floor(Math.random() * linearDirections.length)].value);
    }
    toast.success('Random gradient generated!');
  };

  useEffect(() => {
    const css = generateCSS();
    setCssCode(css);
  }, [gradientType, direction, angle, colorStops, radialShape, radialSize, radialPosition]);

  const gradientStyle = {
    background: generateCSS()
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Advanced CSS Gradient Generator</h1>
        <p className="text-muted-foreground">
          Create beautiful CSS gradients with live preview and advanced controls
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Gradient Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs value={gradientType} onValueChange={setGradientType}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="linear">Linear</TabsTrigger>
                <TabsTrigger value="radial">Radial</TabsTrigger>
                <TabsTrigger value="conic">Conic</TabsTrigger>
              </TabsList>

              <TabsContent value="linear" className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Direction</label>
                  <Select value={direction} onValueChange={setDirection}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {linearDirections.map((dir) => (
                        <SelectItem key={dir.value} value={dir.value}>
                          {dir.label}
                        </SelectItem>
                      ))}
                      <SelectItem value={`${angle[0]}deg`}>Custom Angle ({angle[0]}°)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Angle: {angle[0]}°
                  </label>
                  <Slider
                    value={angle}
                    onValueChange={(value) => {
                      setAngle(value);
                      setDirection(`${value[0]}deg`);
                    }}
                    max={360}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>
              </TabsContent>

              <TabsContent value="radial" className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Shape</label>
                  <Select value={radialShape} onValueChange={setRadialShape}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="circle">Circle</SelectItem>
                      <SelectItem value="ellipse">Ellipse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Size</label>
                  <Select value={radialSize} onValueChange={setRadialSize}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="closest-side">Closest Side</SelectItem>
                      <SelectItem value="closest-corner">Closest Corner</SelectItem>
                      <SelectItem value="farthest-side">Farthest Side</SelectItem>
                      <SelectItem value="farthest-corner">Farthest Corner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Position</label>
                  <Select value={radialPosition} onValueChange={setRadialPosition}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="top">Top</SelectItem>
                      <SelectItem value="bottom">Bottom</SelectItem>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                      <SelectItem value="top left">Top Left</SelectItem>
                      <SelectItem value="top right">Top Right</SelectItem>
                      <SelectItem value="bottom left">Bottom Left</SelectItem>
                      <SelectItem value="bottom right">Bottom Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="conic" className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Start Angle: {angle[0]}°
                  </label>
                  <Slider
                    value={angle}
                    onValueChange={setAngle}
                    max={360}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>
              </TabsContent>
            </Tabs>

            {/* Color Stops */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium">Color Stops</label>
                <Button variant="outline" size="sm" onClick={addColorStop}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-3">
                {colorStops.map((stop, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={stop.color}
                      onChange={(e) => updateColorStop(index, 'color', e.target.value)}
                      className="w-12 h-8 p-1 border rounded"
                    />
                    <Input
                      type="number"
                      value={stop.position}
                      onChange={(e) => updateColorStop(index, 'position', parseInt(e.target.value))}
                      className="w-16"
                      min="0"
                      max="100"
                    />
                    <span className="text-xs text-muted-foreground">%</span>
                    {colorStops.length > 2 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeColorStop(index)}
                        className="p-1"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={randomizeGradient} variant="outline" className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                Random
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview & Code */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Live Preview</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" onClick={copyCSS}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy CSS
                </Button>
                <ResultShare 
                  title="CSS Gradient"
                  result={cssCode}
                  resultType="text"
                  toolName="css-gradient"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Preview */}
            <div 
              className="w-full h-64 rounded-lg border-2 border-dashed border-gray-300"
              style={gradientStyle}
            />

            {/* CSS Code */}
            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <Code className="h-4 w-4" />
                Generated CSS
              </label>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto">
                  {cssCode}
                </pre>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-2 right-2"
                  onClick={copyCSS}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Presets */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Gradient Presets</CardTitle>
          <CardDescription>Click any preset to apply it instantly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {presets.map((preset, index) => (
              <div 
                key={index}
                className="cursor-pointer group"
                onClick={() => applyPreset(preset)}
              >
                <div 
                  className="h-20 rounded-lg border-2 border-transparent group-hover:border-primary transition-all"
                  style={{
                    background: preset.type === 'linear' 
                      ? `linear-gradient(${preset.direction}, ${preset.stops.map(s => `${s.color} ${s.position}%`).join(', ')})`
                      : `radial-gradient(${preset.direction}, ${preset.stops.map(s => `${s.color} ${s.position}%`).join(', ')})`
                  }}
                />
                <p className="text-sm font-medium mt-2 text-center">{preset.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}