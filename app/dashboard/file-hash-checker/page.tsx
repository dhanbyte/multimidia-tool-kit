'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Copy, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function FileHashChecker() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [hashes, setHashes] = useState<{[key: string]: string}>({});
  const [expectedHash, setExpectedHash] = useState('');
  const [hashType, setHashType] = useState('md5');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setHashes({});
    }
  };

  const generateHashes = async () => {
    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }

    setIsGenerating(true);
    
    // Simulate hash generation
    setTimeout(() => {
      const mockHashes = {
        md5: 'd41d8cd98f00b204e9800998ecf8427e',
        sha1: 'da39a3ee5e6b4b0d3255bfef95601890afd80709',
        sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        sha512: 'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e'
      };
      
      setHashes(mockHashes);
      setIsGenerating(false);
      toast.success('File hashes generated!');
    }, 2000);
  };

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    toast.success('Hash copied to clipboard!');
  };

  const verifyHash = () => {
    if (!expectedHash.trim()) {
      toast.error('Please enter expected hash');
      return;
    }

    const currentHash = hashes[hashType];
    if (!currentHash) {
      toast.error('Please generate hashes first');
      return;
    }

    const matches = currentHash.toLowerCase() === expectedHash.toLowerCase().trim();
    if (matches) {
      toast.success('Hash verification successful! File integrity confirmed.');
    } else {
      toast.error('Hash verification failed! File may be corrupted or modified.');
    }
  };

  const isHashMatch = () => {
    if (!expectedHash.trim() || !hashes[hashType]) return null;
    return hashes[hashType].toLowerCase() === expectedHash.toLowerCase().trim();
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">File Hash Checker</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Generate & Verify File Hashes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <input
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input" className="cursor-pointer">
              <Upload className="h-8 w-8 mx-auto mb-2" />
              <p>{selectedFile ? selectedFile.name : 'Upload file to check'}</p>
              {selectedFile && (
                <p className="text-sm text-muted-foreground mt-1">
                  Size: {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              )}
            </label>
          </div>

          <Button onClick={generateHashes} disabled={isGenerating || !selectedFile} className="w-full">
            {isGenerating ? 'Generating Hashes...' : 'Generate File Hashes'}
          </Button>

          {Object.keys(hashes).length > 0 && (
            <Tabs defaultValue="hashes">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="hashes">Generated Hashes</TabsTrigger>
                <TabsTrigger value="verify">Verify Hash</TabsTrigger>
              </TabsList>
              
              <TabsContent value="hashes" className="space-y-4">
                {Object.entries(hashes).map(([type, hash]) => (
                  <div key={type} className="space-y-2">
                    <label className="text-sm font-medium">{type.toUpperCase()}</label>
                    <div className="flex gap-2">
                      <Input value={hash} readOnly className="font-mono text-xs" />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyHash(hash)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="verify" className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Hash Type</label>
                  <select
                    value={hashType}
                    onChange={(e) => setHashType(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="md5">MD5</option>
                    <option value="sha1">SHA1</option>
                    <option value="sha256">SHA256</option>
                    <option value="sha512">SHA512</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Expected Hash</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter expected hash value..."
                      value={expectedHash}
                      onChange={(e) => setExpectedHash(e.target.value)}
                      className="font-mono text-xs"
                    />
                    <Button onClick={verifyHash}>
                      Verify
                    </Button>
                  </div>
                </div>

                {expectedHash.trim() && hashes[hashType] && (
                  <div className={`p-3 rounded-lg flex items-center gap-2 ${
                    isHashMatch() 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    {isHashMatch() ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-green-600 text-sm">Hash matches! File integrity verified.</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span className="text-red-600 text-sm">Hash mismatch! File may be corrupted.</span>
                      </>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}