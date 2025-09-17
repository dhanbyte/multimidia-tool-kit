'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

export default function CSSGradient() {
  const [colors, setColors] = useState(['#ff6b6b', '#4ecdc4', '#45b7d1']);

  const addColor = () => {
    setColors([...colors, '#000000']);
  };

  const removeColor = (index: number) => {
    if (colors.length > 2) {
      setColors(colors.filter((_, i) => i !== index));
    }
  };

  const updateColor = (index: number, color: string) => {
    const newColors = [...colors];
    newColors[index] = color;
    setColors(newColors);
  };

  const gradientCSS = `linear-gradient(45deg, ${colors.join(', ')})`;

  const copyCSS = () => {
    navigator.clipboard.writeText(`background: ${gradientCSS};`);
    toast.success('CSS copied!');
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">CSS Gradient Builder</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Multi-Color Gradient</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {colors.map((color, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => updateColor(index, e.target.value)}
                  className="w-12 h-10 rounded border cursor-pointer"
                />
                <span className="flex-1 font-mono">{color}</span>
                {colors.length > 2 && (
                  <Button size="sm" variant="outline" onClick={() => removeColor(index)}>
                    Remove
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button onClick={addColor} variant="outline">Add Color</Button>
            <Button onClick={copyCSS}><Copy className="h-4 w-4 mr-2" />Copy CSS</Button>
          </div>

          <div className="w-full h-32 rounded" style={{ background: gradientCSS }} />
          <div className="p-3 bg-muted rounded font-mono text-sm">{gradientCSS}</div>
        </CardContent>
      </Card>
    </div>
  );
}