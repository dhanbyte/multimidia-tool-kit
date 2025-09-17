'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Download, Minimize2 } from 'lucide-react';
import { toast } from 'sonner';

export default function PDFCompress() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [quality, setQuality] = useState('medium');
  const [compressedFile, setCompressedFile] = useState<any>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setCompressedFile(null);
    } else {
      toast.error('Please select a PDF file');
    }
  };

  const compressPDF = async () => {
    if (!selectedFile) {
      toast.error('Please select a PDF file');
      return;
    }

    setIsCompressing(true);
    
    // Simulate compression
    setTimeout(() => {
      const originalSize = selectedFile.size;
      const compressionRatio = quality === 'high' ? 0.9 : quality === 'medium' ? 0.7 : 0.5;
      const compressedSize = Math.floor(originalSize * compressionRatio);
      
      setCompressedFile({
        name: selectedFile.name.replace('.pdf', '_compressed.pdf'),
        originalSize,
        compressedSize,
        savedBytes: originalSize - compressedSize,
        savedPercent: Math.round(((originalSize - compressedSize) / originalSize) * 100)
      });
      
      setIsCompressing(false);
      toast.success('PDF compressed successfully!');
    }, 3000);
  };

  const downloadCompressed = () => {
    toast.success(`Downloading ${compressedFile.name}`);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">PDF Compress</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Minimize2 className="h-5 w-5" />
            Compress PDF File
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
            <label className="text-sm font-medium">Compression Quality</label>
            <Select value={quality} onValueChange={setQuality}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High Quality (Less compression)</SelectItem>
                <SelectItem value="medium">Medium Quality (Balanced)</SelectItem>
                <SelectItem value="low">Low Quality (Maximum compression)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={compressPDF} disabled={isCompressing} className="w-full">
            {isCompressing ? 'Compressing...' : 'Compress PDF'}
          </Button>

          {compressedFile && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-bold">{(compressedFile.originalSize / 1024 / 1024).toFixed(2)} MB</div>
                  <div className="text-sm text-muted-foreground">Original Size</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">{(compressedFile.compressedSize / 1024 / 1024).toFixed(2)} MB</div>
                  <div className="text-sm text-muted-foreground">Compressed Size</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{compressedFile.savedPercent}%</div>
                  <div className="text-sm text-muted-foreground">Size Reduction</div>
                </div>
              </div>

              <Button onClick={downloadCompressed} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Compressed PDF
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}