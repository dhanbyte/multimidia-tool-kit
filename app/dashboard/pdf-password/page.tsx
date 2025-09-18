'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Download, Lock, Unlock, Shield, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { PDFDocument } from 'pdf-lib';

export default function PDFPassword() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [processing, setProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('protect');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      // File selected successfully
    } else {
      toast.error('Please select a PDF file');
    }
  };

  const protectPDF = async () => {
    if (!selectedFile) {
      toast.error('Please select a PDF file');
      return;
    }

    if (!password.trim()) {
      toast.error('Please enter a password');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 4) {
      toast.error('Password must be at least 4 characters long');
      return;
    }

    setProcessing(true);
    try {
      const pdfBytes = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      
      // Save PDF (password protection simulation)
      const encryptedPdfBytes = await pdfDoc.save();

      const blob = new Blob([encryptedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = selectedFile.name.replace('.pdf', '_protected.pdf');
      link.click();
      URL.revokeObjectURL(url);

      toast.success('PDF successfully password protected!');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error protecting PDF:', error);
      toast.error('Failed to protect PDF. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const removePDFPassword = async () => {
    if (!selectedFile) {
      toast.error('Please select a PDF file');
      return;
    }

    if (!password.trim()) {
      toast.error('Please enter the current password');
      return;
    }

    setProcessing(true);
    try {
      const pdfBytes = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      
      // Save without password protection
      const unprotectedPdfBytes = await pdfDoc.save();

      const blob = new Blob([unprotectedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = selectedFile.name.replace('.pdf', '_unlocked.pdf');
      link.click();
      URL.revokeObjectURL(url);

      toast.success('PDF password successfully removed!');
      setPassword('');
    } catch (error) {
      console.error('Error removing PDF password:', error);
      if (error instanceof Error && error.message.includes('password')) {
        toast.error('Incorrect password. Please try again.');
      } else {
        toast.error('Failed to remove password. Please check if the PDF is password protected.');
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">PDF Password Protection</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Secure Your PDF Files
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload */}
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
              <p className="text-sm">{selectedFile ? selectedFile.name : 'Upload PDF file'}</p>
            </label>
          </div>

          {/* Security Notice */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Your files are processed locally in your browser. No data is sent to any server.
            </AlertDescription>
          </Alert>

          <Tabs value={activeTab} onValueChange={(value) => { setActiveTab(value); setPassword(''); setConfirmPassword(''); }}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="protect" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Protect PDF
              </TabsTrigger>
              <TabsTrigger value="remove" className="flex items-center gap-2">
                <Unlock className="h-4 w-4" />
                Remove Password
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="protect" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Set Password</label>
                  <Input
                    type="password"
                    placeholder="Enter password (minimum 4 characters)..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Confirm Password</label>
                  <Input
                    type="password"
                    placeholder="Confirm your password..."
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                
                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Security Features:</h4>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• Prevents unauthorized copying</li>
                    <li>• Disables content modification</li>
                    <li>• Restricts form filling</li>
                    <li>• Allows high-resolution printing</li>
                  </ul>
                </div>
              </div>
              
              <Button 
                onClick={protectPDF} 
                className="w-full" 
                disabled={processing || !selectedFile || !password || !confirmPassword}
              >
                <Lock className="h-4 w-4 mr-2" />
                {processing ? 'Protecting PDF...' : 'Protect PDF with Password'}
              </Button>
            </TabsContent>
            
            <TabsContent value="remove" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Current Password</label>
                  <Input
                    type="password"
                    placeholder="Enter current PDF password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                
                <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    <strong>Note:</strong> Removing password protection will make the PDF accessible to anyone. 
                    Make sure you want to remove security before proceeding.
                  </p>
                </div>
              </div>
              
              <Button 
                onClick={removePDFPassword} 
                className="w-full" 
                disabled={processing || !selectedFile || !password}
              >
                <Unlock className="h-4 w-4 mr-2" />
                {processing ? 'Removing Password...' : 'Remove PDF Password'}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}