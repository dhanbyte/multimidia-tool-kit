'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Image } from 'lucide-react';
import { toast } from 'sonner';

export default function BannerMaker() {
  const [title, setTitle] = useState('Your Banner Title');
  const [subtitle, setSubtitle] = useState('Subtitle text here');
  const [bgColor, setBgColor] = useState('#3b82f6');
  const [textColor, setTextColor] = useState('#ffffff');
  const [size, setSize] = useState('social');

  const sizes = [
    { value: 'social', label: 'Social Media (1200x630)', width: 1200, height: 630 },
    { value: 'youtube', label: 'YouTube Thumbnail (1280x720)', width: 1280, height: 720 },
    { value: 'facebook', label: 'Facebook Cover (820x312)', width: 820, height: 312 },
    { value: 'twitter', label: 'Twitter Header (1500x500)', width: 1500, height: 500 },
    { value: 'linkedin', label: 'LinkedIn Banner (1584x396)', width: 1584, height: 396 }
  ];

  const selectedSize = sizes.find(s => s.value === size);

  const downloadBanner = () => {
    const canvas = document.createElement('canvas');
    if (!selectedSize) return;
    
    canvas.width = selectedSize.width;
    canvas.height = selectedSize.height;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Title
      ctx.fillStyle = textColor;
      ctx.font = `bold ${canvas.height * 0.1}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText(title, canvas.width/2, canvas.height/2 - 20);
      
      // Subtitle
      ctx.font = `${canvas.height * 0.05}px Arial`;
      ctx.fillText(subtitle, canvas.width/2, canvas.height/2 + 40);
      
      // Download
      const link = document.createElement('a');
      link.download = `banner-${size}.png`;
      link.href = canvas.toDataURL();
      link.click();
      
      toast.success('Banner downloaded!');
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Banner Maker</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Design Banner
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter banner title"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Subtitle</label>
              <Textarea
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Enter subtitle"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Banner Size</label>
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sizes.map(s => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

            <Button onClick={downloadBanner} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download Banner
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video w-full max-w-sm mx-auto">
              <div 
                className="w-full h-full flex flex-col items-center justify-center text-center p-4 rounded"
                style={{ backgroundColor: bgColor, color: textColor }}
              >
                <h2 className="text-lg font-bold mb-2">{title}</h2>
                <p className="text-sm">{subtitle}</p>
              </div>
            </div>
            <div className="text-center text-sm text-muted-foreground mt-2">
              {selectedSize?.label}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}