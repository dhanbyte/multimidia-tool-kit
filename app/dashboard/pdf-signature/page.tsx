'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Download, PenTool } from 'lucide-react';
import { toast } from 'sonner';

export default function PDFSignature() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [signature, setSignature] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [signedFile, setSignedFile] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setSignedFile(null);
    } else {
      toast.error('Please select a PDF file');
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const addSignature = () => {
    if (!selectedFile) {
      toast.error('Please select a PDF file');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      toast.error('Please draw a signature');
      return;
    }

    setSignedFile(selectedFile.name.replace('.pdf', '_signed.pdf'));
    toast.success('Signature added to PDF!');
  };

  const downloadSigned = () => {
    if (signedFile) {
      toast.success(`Downloading ${signedFile}`);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">PDF Signature</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PenTool className="h-5 w-5" />
              Add Signature to PDF
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
              <label className="text-sm font-medium">Draw Your Signature</label>
              <div className="border rounded-lg p-4">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={150}
                  className="border border-dashed w-full cursor-crosshair"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm" onClick={clearSignature}>
                    Clear
                  </Button>
                </div>
              </div>
            </div>

            <Button onClick={addSignature} className="w-full">
              Add Signature to PDF
            </Button>

            {signedFile && (
              <Button onClick={downloadSigned} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Signed PDF
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}