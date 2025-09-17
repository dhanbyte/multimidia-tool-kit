'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Download } from 'lucide-react';
import { toast } from 'sonner';

export default function FaviconGenerator() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [text, setText] = useState('F');
  const [bgColor, setBgColor] = useState('#3b82f6');
  const [textColor, setTextColor] = useState('#ffffff');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      toast.error('Please select an image file');
    }
  };

  const generateTextFavicon = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, 32, 32);
      
      ctx.fillStyle = textColor;
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text.charAt(0).toUpperCase(), 16, 16);
      
      setPreviewUrl(canvas.toDataURL());
    }
  };

  const downloadFavicon = () => {
    if (!previewUrl) {
      toast.error('Please generate or upload a favicon first');
      return;
    }
    
    const link = document.createElement('a');
    link.download = 'favicon.ico';
    link.href = previewUrl;
    link.click();
    toast.success('Favicon downloaded!');
  };

  const sizes = [16, 32, 48, 64, 128, 256];

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Favicon Generator</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Create Favicon</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-input"
                />
                <label htmlFor="file-input" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2" />
                  <p>Upload Image</p>
                </label>
              </div>

              <div className="text-center text-muted-foreground">OR</div>

              <div className="space-y-4">
                <h3 className="font-medium">Generate from Text</h3>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Text</label>
                  <Input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    maxLength={2}
                    placeholder="F"
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

                <Button onClick={generateTextFavicon} className="w-full">
                  Generate Text Favicon
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview & Download</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {previewUrl && (
              <>
                <div className="text-center">
                  <h3 className="font-medium mb-4">Preview (Different Sizes)</h3>
                  <div className="flex flex-wrap gap-4 justify-center">
                    {sizes.map(size => (
                      <div key={size} className="text-center">
                        <img
                          src={previewUrl}
                          alt="Favicon"
                          width={size}
                          height={size}
                          className="border rounded"
                        />
                        <div className="text-xs text-muted-foreground mt-1">{size}x{size}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button onClick={downloadFavicon} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Favicon
                </Button>
              </>
            )}

            {!previewUrl && (
              <div className="text-center text-muted-foreground py-8">
                Upload an image or generate from text to see preview
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}