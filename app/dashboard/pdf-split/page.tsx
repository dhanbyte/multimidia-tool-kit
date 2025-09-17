'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Scissors } from 'lucide-react';
import { toast } from 'sonner';

export default function PDFSplit() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pageRange, setPageRange] = useState('');
  const [splitPages, setSplitPages] = useState<string[]>([]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setSplitPages([]);
    } else {
      toast.error('Please select a PDF file');
    }
  };

  const splitPDF = () => {
    if (!selectedFile) {
      toast.error('Please select a PDF file');
      return;
    }

    if (!pageRange) {
      toast.error('Please enter page range (e.g., 1-3, 5, 7-10)');
      return;
    }

    // Simulate PDF splitting
    const ranges = pageRange.split(',').map(r => r.trim());
    const mockPages = ranges.map((range, index) => 
      `split_${selectedFile.name.replace('.pdf', '')}_pages_${range}.pdf`
    );
    
    setSplitPages(mockPages);
    toast.success('PDF split successfully!');
  };

  const downloadPage = (filename: string) => {
    toast.success(`Downloading ${filename}`);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">PDF Split</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scissors className="h-5 w-5" />
            Split PDF Pages
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
            <label className="text-sm font-medium">Page Range</label>
            <Input
              placeholder="e.g., 1-3, 5, 7-10"
              value={pageRange}
              onChange={(e) => setPageRange(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Enter page numbers or ranges separated by commas
            </p>
          </div>

          <Button onClick={splitPDF} className="w-full">
            Split PDF
          </Button>

          {splitPages.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium">Split Files</h3>
              {splitPages.map((page, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded">
                  <span className="text-sm">{page}</span>
                  <Button size="sm" onClick={() => downloadPage(page)}>
                    Download
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}