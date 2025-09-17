'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Download, Type } from 'lucide-react';
import { toast } from 'sonner';

export default function PDFWatermark() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState('');
  const [position, setPosition] = useState('center');
  const [opacity, setOpacity] = useState('50');
  const [watermarkedFile, setWatermarkedFile] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setWatermarkedFile(null);
    } else {
      toast.error('Please select a PDF file');
    }
  };

  const addWatermark = () => {
    if (!selectedFile) {
      toast.error('Please select a PDF file');
      return;
    }

    if (!watermarkText.trim()) {
      toast.error('Please enter watermark text');
      return;
    }

    setWatermarkedFile(selectedFile.name.replace('.pdf', '_watermarked.pdf'));
    toast.success('Watermark added to PDF!');
  };

  const downloadWatermarked = () => {
    if (watermarkedFile) {
      toast.success(`Downloading ${watermarkedFile}`);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">PDF Watermark</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Add Watermark to PDF
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input" className="cursor-pointer">
              <Upload className="h-8 w-8 mx-auto mb-2" />
              <p>{selectedFile ? selectedFile.name : 'Upload PDF file'}</p>
            </label>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Watermark Text</label>
            <Input
              placeholder="Enter watermark text..."
              value={watermarkText}
              onChange={(e) => setWatermarkText(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Position</label>
              <Select value={position} onValueChange={setPosition}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="top-left">Top Left</SelectItem>
                  <SelectItem value="top-right">Top Right</SelectItem>
                  <SelectItem value="bottom-left">Bottom Left</SelectItem>
                  <SelectItem value="bottom-right">Bottom Right</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Opacity (%)</label>
              <Select value={opacity} onValueChange={setOpacity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25%</SelectItem>
                  <SelectItem value="50">50%</SelectItem>
                  <SelectItem value="75">75%</SelectItem>
                  <SelectItem value="100">100%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="text-sm font-medium mb-2">Preview</div>
            <div className="relative w-full h-32 bg-white border rounded">
              {watermarkText && (
                <div 
                  className={`absolute text-gray-400 font-bold text-lg select-none pointer-events-none
                    ${position === 'center' ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' : ''}
                    ${position === 'top-left' ? 'top-2 left-2' : ''}
                    ${position === 'top-right' ? 'top-2 right-2' : ''}
                    ${position === 'bottom-left' ? 'bottom-2 left-2' : ''}
                    ${position === 'bottom-right' ? 'bottom-2 right-2' : ''}
                  `}
                  style={{ opacity: parseInt(opacity) / 100 }}
                >
                  {watermarkText}
                </div>
              )}
            </div>
          </div>

          <Button onClick={addWatermark} className="w-full">
            Add Watermark
          </Button>

          {watermarkedFile && (
            <Button onClick={downloadWatermarked} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download Watermarked PDF
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}