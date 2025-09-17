'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Upload, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function ImageFormatConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState('');
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  const formats = [
    { value: 'jpeg', label: 'JPEG' },
    { value: 'png', label: 'PNG' },
    { value: 'webp', label: 'WebP' },
    { value: 'bmp', label: 'BMP' },
    { value: 'gif', label: 'GIF' }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        setConvertedImage(null);
      } else {
        toast.error('Please select an image file');
      }
    }
  };

  const convertImage = async () => {
    if (!selectedFile || !outputFormat) {
      toast.error('Please select a file and output format');
      return;
    }

    setIsConverting(true);
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        const quality = outputFormat === 'jpeg' ? 0.9 : undefined;
        const dataUrl = canvas.toDataURL(`image/${outputFormat}`, quality);
        setConvertedImage(dataUrl);
        setIsConverting(false);
        toast.success('Image converted successfully!');
      };
      
      img.src = URL.createObjectURL(selectedFile);
    } catch (error) {
      setIsConverting(false);
      toast.error('Error converting image');
    }
  };

  const downloadImage = () => {
    if (!convertedImage) return;
    
    const link = document.createElement('a');
    link.download = `converted.${outputFormat}`;
    link.href = convertedImage;
    link.click();
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Image Format Converter</h1>
        <p className="text-muted-foreground">
          Convert images between different formats (JPEG, PNG, WebP, BMP, GIF)
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Convert Image Format
          </CardTitle>
          <CardDescription>
            Upload an image and convert it to your desired format
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Image</label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-input"
                />
                <label htmlFor="file-input" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {selectedFile ? selectedFile.name : 'Click to upload an image'}
                  </p>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Output Format</label>
              <Select value={outputFormat} onValueChange={setOutputFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Select output format" />
                </SelectTrigger>
                <SelectContent>
                  {formats.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={convertImage} 
              disabled={!selectedFile || !outputFormat || isConverting}
              className="w-full"
            >
              {isConverting ? 'Converting...' : 'Convert Image'}
            </Button>
          </div>

          {convertedImage && (
            <div className="space-y-4 p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Converted Image</h3>
                <Button onClick={downloadImage} size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
              <img 
                src={convertedImage} 
                alt="Converted" 
                className="max-w-full h-auto rounded border"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}