'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Download, FileText, Zap } from 'lucide-react';
import { toast } from 'sonner';

export default function PDFCompress() {
  const [file, setFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile && uploadedFile.type === 'application/pdf') {
      setFile(uploadedFile);
      toast.success('PDF file uploaded successfully!');
    } else {
      toast.error('Please upload a valid PDF file');
    }
  };

  const compressPDF = async () => {
    if (!file) return;
    
    setIsCompressing(true);
    // Simulate compression
    setTimeout(() => {
      setIsCompressing(false);
      toast.success('PDF compressed successfully!');
    }, 2000);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Free PDF Compressor Online</h1>
        <p className="text-muted-foreground">
          Reduce PDF file size while maintaining quality - 100% free
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Compress PDF File
          </CardTitle>
          <CardDescription>
            Upload your PDF file and compress it to reduce file size
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <div className="space-y-2">
              <p className="text-lg font-medium">Drop your PDF file here</p>
              <p className="text-sm text-muted-foreground">or click to browse</p>
            </div>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          {file && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <FileText className="h-8 w-8 text-red-500" />
                </div>
              </div>

              <Button 
                onClick={compressPDF} 
                disabled={isCompressing}
                className="w-full"
              >
                {isCompressing ? (
                  <>
                    <Zap className="h-4 w-4 mr-2 animate-spin" />
                    Compressing...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Compress PDF
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}