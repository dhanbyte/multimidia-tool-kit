'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Download, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function PDFMetadata() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState({
    title: '',
    author: '',
    subject: '',
    keywords: '',
    creator: '',
    producer: ''
  });
  const [updatedFile, setUpdatedFile] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setUpdatedFile(null);
      
      // Simulate reading metadata
      setMetadata({
        title: 'Sample Document',
        author: 'Unknown Author',
        subject: 'PDF Document',
        keywords: 'pdf, document',
        creator: 'PDF Creator',
        producer: 'PDF Producer'
      });
    } else {
      toast.error('Please select a PDF file');
    }
  };

  const updateMetadata = () => {
    if (!selectedFile) {
      toast.error('Please select a PDF file');
      return;
    }

    setUpdatedFile(selectedFile.name.replace('.pdf', '_updated_metadata.pdf'));
    toast.success('PDF metadata updated!');
  };

  const downloadUpdated = () => {
    if (updatedFile) {
      toast.success(`Downloading ${updatedFile}`);
    }
  };

  const handleMetadataChange = (field: string, value: string) => {
    setMetadata(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">PDF Metadata Editor</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Edit PDF Metadata
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={metadata.title}
                    onChange={(e) => handleMetadataChange('title', e.target.value)}
                    placeholder="Document title"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Author</label>
                  <Input
                    value={metadata.author}
                    onChange={(e) => handleMetadataChange('author', e.target.value)}
                    placeholder="Document author"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Input
                    value={metadata.subject}
                    onChange={(e) => handleMetadataChange('subject', e.target.value)}
                    placeholder="Document subject"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Creator</label>
                  <Input
                    value={metadata.creator}
                    onChange={(e) => handleMetadataChange('creator', e.target.value)}
                    placeholder="Document creator"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Keywords</label>
                <Textarea
                  value={metadata.keywords}
                  onChange={(e) => handleMetadataChange('keywords', e.target.value)}
                  placeholder="Document keywords (comma separated)"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Producer</label>
                <Input
                  value={metadata.producer}
                  onChange={(e) => handleMetadataChange('producer', e.target.value)}
                  placeholder="PDF producer"
                />
              </div>

              <Button onClick={updateMetadata} className="w-full">
                Update Metadata
              </Button>

              {updatedFile && (
                <Button onClick={downloadUpdated} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Updated PDF
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}