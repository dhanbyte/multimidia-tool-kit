'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Upload } from 'lucide-react';
import { toast } from 'sonner';

export default function ImageFilter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filteredImage, setFilteredImage] = useState<string | null>(null);

  const filters = [
    { name: 'Grayscale', filter: 'grayscale(100%)' },
    { name: 'Sepia', filter: 'sepia(100%)' },
    { name: 'Blur', filter: 'blur(5px)' },
    { name: 'Brightness', filter: 'brightness(150%)' },
    { name: 'Contrast', filter: 'contrast(150%)' },
    { name: 'Saturate', filter: 'saturate(200%)' }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setFilteredImage(null);
    }
  };

  const applyFilter = (filterValue: string) => {
    if (!selectedFile) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      if (ctx) {
        ctx.filter = filterValue;
        ctx.drawImage(img, 0, 0);
      }
      
      setFilteredImage(canvas.toDataURL());
      toast.success('Filter applied!');
    };
    
    img.src = URL.createObjectURL(selectedFile);
  };

  const downloadImage = () => {
    if (!filteredImage) return;
    const link = document.createElement('a');
    link.download = 'filtered-image.png';
    link.href = filteredImage;
    link.click();
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Image Filter</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Apply Filters to Image</CardTitle>
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

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {filters.map((filter) => (
              <Button
                key={filter.name}
                variant="outline"
                onClick={() => applyFilter(filter.filter)}
                disabled={!selectedFile}
              >
                {filter.name}
              </Button>
            ))}
          </div>

          {filteredImage && (
            <div className="space-y-4">
              <div className="flex justify-between">
                <h3>Filtered Image</h3>
                <Button onClick={downloadImage} size="sm">
                  <Download className="h-4 w-4 mr-2" />Download
                </Button>
              </div>
              <img src={filteredImage} alt="Filtered" className="w-full rounded" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}