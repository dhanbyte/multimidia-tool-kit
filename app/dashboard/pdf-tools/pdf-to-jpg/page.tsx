'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Image, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function PDFToJPG() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile && uploadedFile.type === 'application/pdf') {
      setFile(uploadedFile);
      toast.success('PDF file uploaded successfully!');
    } else {
      toast.error('Please upload a valid PDF file');
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">PDF to JPG Converter</h1>
        <p className="text-muted-foreground">
          Convert PDF pages to high-quality JPG images online
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Convert PDF to JPG
          </CardTitle>
          <CardDescription>
            Upload your PDF file to convert pages to JPG images
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center relative">
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}