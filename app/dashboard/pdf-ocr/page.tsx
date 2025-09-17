'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Download, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function PDFOCR() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [language, setLanguage] = useState('eng');
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const languages = [
    { code: 'eng', name: 'English' },
    { code: 'spa', name: 'Spanish' },
    { code: 'fra', name: 'French' },
    { code: 'deu', name: 'German' },
    { code: 'ita', name: 'Italian' },
    { code: 'por', name: 'Portuguese' },
    { code: 'rus', name: 'Russian' },
    { code: 'jpn', name: 'Japanese' },
    { code: 'kor', name: 'Korean' },
    { code: 'chi_sim', name: 'Chinese (Simplified)' }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setExtractedText('');
    } else {
      toast.error('Please select a PDF file');
    }
  };

  const performOCR = async () => {
    if (!selectedFile) {
      toast.error('Please select a PDF file');
      return;
    }

    setIsProcessing(true);
    
    // Simulate OCR processing
    setTimeout(() => {
      const mockText = `Sample extracted text from PDF using OCR technology.

This is a demonstration of text extraction from scanned PDF documents. 
The OCR (Optical Character Recognition) process converts images of text 
into machine-readable text format.

Key features:
- Multi-language support
- High accuracy text recognition
- Preserves document structure
- Handles various fonts and sizes

Language detected: ${languages.find(l => l.code === language)?.name}

Note: This is a demo version. In a real implementation, 
this would use actual OCR libraries like Tesseract.js or 
cloud-based OCR services.`;

      setExtractedText(mockText);
      setIsProcessing(false);
      toast.success('Text extracted successfully!');
    }, 3000);
  };

  const downloadText = () => {
    if (!extractedText) return;
    
    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile?.name.replace('.pdf', '_extracted.txt') || 'extracted_text.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Text file downloaded!');
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">PDF OCR</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Extract Text from Scanned PDF
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
              <p>{selectedFile ? selectedFile.name : 'Upload scanned PDF file'}</p>
            </label>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">OCR Language</label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map(lang => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={performOCR} disabled={isProcessing} className="w-full">
            {isProcessing ? 'Processing OCR...' : 'Extract Text'}
          </Button>

          {extractedText && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Extracted Text</h3>
                <Button onClick={downloadText} size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download Text
                </Button>
              </div>
              <Textarea
                value={extractedText}
                readOnly
                rows={12}
                className="font-mono text-sm"
              />
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            OCR works best with clear, high-resolution scanned documents. 
            Processing time depends on document size and complexity.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}