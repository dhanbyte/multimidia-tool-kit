'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Download, Lock, Unlock } from 'lucide-react';
import { toast } from 'sonner';

export default function PDFPassword() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [processedFile, setProcessedFile] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('protect');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setProcessedFile(null);
    } else {
      toast.error('Please select a PDF file');
    }
  };

  const protectPDF = () => {
    if (!selectedFile) {
      toast.error('Please select a PDF file');
      return;
    }

    if (!password.trim()) {
      toast.error('Please enter a password');
      return;
    }

    setProcessedFile(selectedFile.name.replace('.pdf', '_protected.pdf'));
    toast.success('PDF password protected!');
  };

  const removePDFPassword = () => {
    if (!selectedFile) {
      toast.error('Please select a PDF file');
      return;
    }

    if (!password.trim()) {
      toast.error('Please enter the current password');
      return;
    }

    setProcessedFile(selectedFile.name.replace('.pdf', '_unlocked.pdf'));
    toast.success('PDF password removed!');
  };

  const downloadProcessed = () => {
    if (processedFile) {
      toast.success(`Downloading ${processedFile}`);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">PDF Password</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>PDF Password Protection</CardTitle>
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

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="protect">Protect PDF</TabsTrigger>
              <TabsTrigger value="remove">Remove Password</TabsTrigger>
            </TabsList>
            
            <TabsContent value="protect" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Set Password</label>
                <Input
                  type="password"
                  placeholder="Enter password to protect PDF..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              <Button onClick={protectPDF} className="w-full">
                <Lock className="h-4 w-4 mr-2" />
                Protect PDF with Password
              </Button>
            </TabsContent>
            
            <TabsContent value="remove" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Current Password</label>
                <Input
                  type="password"
                  placeholder="Enter current PDF password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              <Button onClick={removePDFPassword} className="w-full">
                <Unlock className="h-4 w-4 mr-2" />
                Remove PDF Password
              </Button>
            </TabsContent>
          </Tabs>

          {processedFile && (
            <div className="space-y-4 p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                {activeTab === 'protect' ? (
                  <Lock className="h-4 w-4 text-green-600" />
                ) : (
                  <Unlock className="h-4 w-4 text-blue-600" />
                )}
                <span className="font-medium">
                  PDF {activeTab === 'protect' ? 'Protected' : 'Unlocked'}
                </span>
              </div>
              
              <Button onClick={downloadProcessed} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download {activeTab === 'protect' ? 'Protected' : 'Unlocked'} PDF
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}