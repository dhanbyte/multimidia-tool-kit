'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Zap } from 'lucide-react';
import { toast } from 'sonner';

export default function LogoMaker() {
  const [text, setText] = useState('LOGO');
  const [font, setFont] = useState('Arial');
  const [color, setColor] = useState('#3b82f6');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [shape, setShape] = useState('circle');

  const fonts = [
    'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana', 'Impact', 'Comic Sans MS'
  ];

  const shapes = [
    { value: 'circle', label: 'Circle' },
    { value: 'square', label: 'Square' },
    { value: 'rounded', label: 'Rounded Square' },
    { value: 'none', label: 'No Background' }
  ];

  const getShapeStyle = () => {
    const base = {
      backgroundColor: shape === 'none' ? 'transparent' : bgColor,
      color: color,
      fontFamily: font,
      fontSize: '48px',
      fontWeight: 'bold',
      width: '200px',
      height: '200px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto'
    };

    switch (shape) {
      case 'circle':
        return { ...base, borderRadius: '50%' };
      case 'rounded':
        return { ...base, borderRadius: '20px' };
      case 'square':
        return base;
      default:
        return { ...base, backgroundColor: 'transparent' };
    }
  };

  const downloadLogo = () => {
    toast.success('Logo download started! (Demo version)');
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Logo Maker</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Design Your Logo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Logo Text</label>
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter logo text"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Font</label>
              <Select value={font} onValueChange={setFont}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fonts.map(f => (
                    <SelectItem key={f} value={f}>{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Text Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-12 h-10 rounded border cursor-pointer"
                />
                <Input value={color} onChange={(e) => setColor(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Background Shape</label>
              <Select value={shape} onValueChange={setShape}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {shapes.map(s => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {shape !== 'none' && (
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
            )}

            <Button onClick={downloadLogo} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download Logo
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center p-8">
              <div style={getShapeStyle()}>
                {text}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}