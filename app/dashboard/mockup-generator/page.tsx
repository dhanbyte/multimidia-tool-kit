'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Download, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

export default function MockupGenerator() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [device, setDevice] = useState('phone');

  const devices = [
    { value: 'phone', label: 'iPhone', width: 375, height: 812 },
    { value: 'tablet', label: 'iPad', width: 768, height: 1024 },
    { value: 'laptop', label: 'MacBook', width: 1440, height: 900 },
    { value: 'desktop', label: 'iMac', width: 1920, height: 1080 }
  ];

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

  const downloadMockup = () => {
    toast.success('Mockup download started! (Demo version)');
  };

  const selectedDevice = devices.find(d => d.value === device);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Mockup Generator</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Create Device Mockup
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
                <p>{selectedFile ? selectedFile.name : 'Upload screenshot'}</p>
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Device Type</label>
              <Select value={device} onValueChange={setDevice}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {devices.map(d => (
                    <SelectItem key={d.value} value={d.value}>
                      {d.label} ({d.width}x{d.height})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={downloadMockup} disabled={!previewUrl} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download Mockup
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center p-4">
              {previewUrl ? (
                <div className="relative">
                  <div className={`
                    ${device === 'phone' ? 'w-48 h-96 bg-black rounded-3xl p-2' : ''}
                    ${device === 'tablet' ? 'w-64 h-80 bg-black rounded-2xl p-3' : ''}
                    ${device === 'laptop' ? 'w-80 h-48 bg-gray-800 rounded-lg p-2' : ''}
                    ${device === 'desktop' ? 'w-80 h-48 bg-black rounded-lg p-1' : ''}
                  `}>
                    <img
                      src={previewUrl}
                      alt="Mockup preview"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </div>
                  <div className="text-center mt-2 text-sm text-muted-foreground">
                    {selectedDevice?.label} Mockup
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-16">
                  Upload an image to see mockup preview
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}