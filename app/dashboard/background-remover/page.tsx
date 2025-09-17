'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Upload, Scissors } from 'lucide-react';
import { toast } from 'sonner';

export default function BackgroundRemover() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setProcessedImage(null);
    } else {
      toast.error('Please select an image file');
    }
  };

  const removeBackground = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    
    setTimeout(() => {
      const reader = new FileReader();
      reader.onload = () => {
        setProcessedImage(reader.result as string);
        setIsProcessing(false);
        toast.success('Background removed! (Demo version)');
      };
      reader.readAsDataURL(selectedFile);
    }, 2000);
  };

  const downloadImage = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.download = 'background-removed.png';
    link.href = processedImage;
    link.click();
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Background Remover</h1>
        <p className="text-muted-foreground">Remove backgrounds from images</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scissors className="h-5 w-5" />
            Remove Background
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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
              <p>{selectedFile ? selectedFile.name : 'Click to upload'}</p>
            </label>
          </div>

          <Button 
            onClick={removeBackground} 
            disabled={!selectedFile || isProcessing}
            className="w-full"
          >
            {isProcessing ? 'Processing...' : 'Remove Background'}
          </Button>

          {processedImage && (
            <div className="space-y-4">
              <div className="flex justify-between">
                <h3>Result</h3>
                <Button onClick={downloadImage} size="sm">
                  <Download className="h-4 w-4 mr-2" />Download
                </Button>
              </div>
              <img src={processedImage} alt="Result" className="w-full rounded" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}