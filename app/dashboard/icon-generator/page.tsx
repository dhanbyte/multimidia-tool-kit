'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Zap } from 'lucide-react';
import { toast } from 'sonner';

export default function IconGenerator() {
  const [text, setText] = useState('A');
  const [bgColor, setBgColor] = useState('#3b82f6');
  const [textColor, setTextColor] = useState('#ffffff');
  const [shape, setShape] = useState('circle');
  const [size, setSize] = useState('64');

  const shapes = [
    { value: 'circle', label: 'Circle' },
    { value: 'square', label: 'Square' },
    { value: 'rounded', label: 'Rounded Square' }
  ];

  const sizes = ['16', '32', '64', '128', '256', '512'];

  const generateIcon = () => {
    const canvas = document.createElement('canvas');
    const sizeNum = parseInt(size);
    canvas.width = sizeNum;
    canvas.height = sizeNum;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Background
      ctx.fillStyle = bgColor;
      if (shape === 'circle') {
        ctx.beginPath();
        ctx.arc(sizeNum/2, sizeNum/2, sizeNum/2, 0, 2 * Math.PI);
        ctx.fill();
      } else if (shape === 'rounded') {
        const radius = sizeNum * 0.1;
        ctx.beginPath();
        ctx.roundRect(0, 0, sizeNum, sizeNum, radius);
        ctx.fill();
      } else {
        ctx.fillRect(0, 0, sizeNum, sizeNum);
      }
      
      // Text
      ctx.fillStyle = textColor;
      ctx.font = `bold ${sizeNum * 0.5}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text.charAt(0).toUpperCase(), sizeNum/2, sizeNum/2);
      
      // Download
      const link = document.createElement('a');
      link.download = `icon-${size}x${size}.png`;
      link.href = canvas.toDataURL();
      link.click();
      
      toast.success('Icon downloaded!');
    }
  };

  const getPreviewStyle = () => ({
    width: '128px',
    height: '128px',
    backgroundColor: bgColor,
    color: textColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '64px',
    fontWeight: 'bold',
    borderRadius: shape === 'circle' ? '50%' : shape === 'rounded' ? '12px' : '0',
    margin: '0 auto'
  });

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Icon Generator</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Create Icon
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Text/Letter</label>
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={2}
                placeholder="A"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Background</label>
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Shape</label>
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

              <div className="space-y-2">
                <label className="text-sm font-medium">Size (px)</label>
                <Select value={size} onValueChange={setSize}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sizes.map(s => (
                      <SelectItem key={s} value={s}>{s}x{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={generateIcon} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Generate & Download Icon
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center p-8">
              <div style={getPreviewStyle()}>
                {text.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              Preview (128x128)
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}