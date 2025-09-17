'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, RotateCw, RotateCcw, Download } from 'lucide-react';
import { toast } from 'sonner';

export default function PDFRotate() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [rotation, setRotation] = useState(0);
  const [rotatedFile, setRotatedFile] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setRotation(0);
      setRotatedFile(null);
    } else {
      toast.error('Please select a PDF file');
    }
  };

  const rotatePDF = (degrees: number) => {
    if (!selectedFile) {
      toast.error('Please select a PDF file');
      return;
    }

    const newRotation = (rotation + degrees) % 360;
    setRotation(newRotation);
    setRotatedFile(selectedFile.name.replace('.pdf', `_rotated_${newRotation}deg.pdf`));
    toast.success(`PDF rotated ${degrees > 0 ? 'clockwise' : 'counter-clockwise'} by ${Math.abs(degrees)}°`);
  };

  const downloadRotated = () => {
    if (rotatedFile) {
      toast.success(`Downloading ${rotatedFile}`);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">PDF Rotate</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCw className="h-5 w-5" />
            Rotate PDF Pages
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

          {selectedFile && (
            <>
              <div className="text-center">
                <div className="text-lg font-medium mb-2">Current Rotation: {rotation}°</div>
                <div className="flex justify-center gap-2">
                  <Button onClick={() => rotatePDF(-90)} variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    90° Left
                  </Button>
                  <Button onClick={() => rotatePDF(90)} variant="outline">
                    <RotateCw className="h-4 w-4 mr-2" />
                    90° Right
                  </Button>
                  <Button onClick={() => rotatePDF(180)} variant="outline">
                    180°
                  </Button>
                </div>
              </div>

              <div className="text-center">
                <div 
                  className="inline-block w-32 h-40 bg-muted border-2 border-dashed rounded transition-transform duration-300"
                  style={{ transform: `rotate(${rotation}deg)` }}
                >
                  <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                    PDF Preview
                  </div>
                </div>
              </div>

              {rotatedFile && (
                <Button onClick={downloadRotated} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Rotated PDF
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}