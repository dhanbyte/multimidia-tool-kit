'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Upload } from 'lucide-react';
import { toast } from 'sonner';

export default function ImageWatermark() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState('');
  const [watermarkedImage, setWatermarkedImage] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setWatermarkedImage(null);
    }
  };

  const addWatermark = () => {
    if (!selectedFile || !watermarkText) {
      toast.error('Please select image and enter watermark text');
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      if (ctx) {
        ctx.font = '30px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillText(watermarkText, 20, canvas.height - 30);
      }
      
      setWatermarkedImage(canvas.toDataURL());
      toast.success('Watermark added!');
    };
    
    img.src = URL.createObjectURL(selectedFile);
  };

  const downloadImage = () => {
    if (!watermarkedImage) return;
    const link = document.createElement('a');
    link.download = 'watermarked-image.png';
    link.href = watermarkedImage;
    link.click();
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Image Watermark</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Add Watermark to Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
              <p>{selectedFile ? selectedFile.name : 'Upload image'}</p>
            </label>
          </div>

          <Input
            placeholder="Enter watermark text"
            value={watermarkText}
            onChange={(e) => setWatermarkText(e.target.value)}
          />

          <Button onClick={addWatermark} className="w-full">
            Add Watermark
          </Button>

          {watermarkedImage && (
            <div className="space-y-4">
              <div className="flex justify-between">
                <h3>Watermarked Image</h3>
                <Button onClick={downloadImage} size="sm">
                  <Download className="h-4 w-4 mr-2" />Download
                </Button>
              </div>
              <img src={watermarkedImage} alt="Watermarked" className="w-full rounded" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}