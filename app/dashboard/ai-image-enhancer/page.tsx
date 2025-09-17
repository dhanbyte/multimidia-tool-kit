'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Download, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function AIImageEnhancer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [enhancedUrl, setEnhancedUrl] = useState<string | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setEnhancedUrl(null);
    } else {
      toast.error('Please select an image file');
    }
  };

  const enhanceImage = async () => {
    if (!selectedFile) {
      toast.error('Please select an image first');
      return;
    }

    setIsEnhancing(true);
    
    setTimeout(() => {
      // Simulate AI enhancement by using the same image
      setEnhancedUrl(previewUrl);
      setIsEnhancing(false);
      toast.success('Image enhanced! (Demo version)');
    }, 3000);
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">AI Image Enhancer</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Enhance Images with AI
            </CardTitle>
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
                <p>{selectedFile ? selectedFile.name : 'Upload image to enhance'}</p>
              </label>
            </div>

            <Button onClick={enhanceImage} disabled={isEnhancing || !selectedFile} className="w-full">
              {isEnhancing ? 'Enhancing Image...' : 'Enhance with AI'}
            </Button>
          </CardContent>
        </Card>

        {(previewUrl || enhancedUrl) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {previewUrl && (
              <Card>
                <CardHeader>
                  <CardTitle>Original</CardTitle>
                </CardHeader>
                <CardContent>
                  <img src={previewUrl} alt="Original" className="w-full rounded" />
                </CardContent>
              </Card>
            )}

            {enhancedUrl && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Enhanced</CardTitle>
                    <Button size="sm">
                      <Download className="h-4 w-4 mr-2" />Download
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <img src={enhancedUrl} alt="Enhanced" className="w-full rounded" />
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}