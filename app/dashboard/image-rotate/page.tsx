'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Upload, RotateCw, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

export default function ImageRotate() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [rotatedImage, setRotatedImage] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setRotatedImage(null);
      setRotation(0);
    }
  };

  const rotateImage = (degrees: number) => {
    if (!selectedFile) return;

    const newRotation = rotation + degrees;
    setRotation(newRotation);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      const rad = (newRotation * Math.PI) / 180;
      const sin = Math.abs(Math.sin(rad));
      const cos = Math.abs(Math.cos(rad));
      
      canvas.width = img.width * cos + img.height * sin;
      canvas.height = img.width * sin + img.height * cos;
      
      if (ctx) {
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(rad);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
      }
      
      setRotatedImage(canvas.toDataURL());
      toast.success(`Rotated ${degrees > 0 ? 'clockwise' : 'counter-clockwise'}!`);
    };
    
    img.src = URL.createObjectURL(selectedFile);
  };

  const downloadImage = () => {
    if (!rotatedImage) return;
    const link = document.createElement('a');
    link.download = 'rotated-image.png';
    link.href = rotatedImage;
    link.click();
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Image Rotate</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Rotate Image</CardTitle>
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

          <div className="flex gap-2 justify-center">
            <Button
              variant="outline"
              onClick={() => rotateImage(-90)}
              disabled={!selectedFile}
            >
              <RotateCcw className="h-4 w-4 mr-2" />90° Left
            </Button>
            <Button
              variant="outline"
              onClick={() => rotateImage(90)}
              disabled={!selectedFile}
            >
              <RotateCw className="h-4 w-4 mr-2" />90° Right
            </Button>
            <Button
              variant="outline"
              onClick={() => rotateImage(180)}
              disabled={!selectedFile}
            >
              180°
            </Button>
          </div>

          {rotatedImage && (
            <div className="space-y-4">
              <div className="flex justify-between">
                <h3>Rotated Image ({rotation}°)</h3>
                <Button onClick={downloadImage} size="sm">
                  <Download className="h-4 w-4 mr-2" />Download
                </Button>
              </div>
              <img src={rotatedImage} alt="Rotated" className="w-full rounded" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}