'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Hash, Download, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { ResultShare } from '@/components/result-share';

export default function HashGenerator() {
  const [inputText, setInputText] = useState('');
  const [hashes, setHashes] = useState({
    md5: '',
    sha1: '',
    sha256: '',
    sha512: ''
  });

  // Simple hash functions (for demo - in production use crypto libraries)
  const generateMD5 = async (text: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('MD5', data).catch(() => null);
    if (!hashBuffer) return 'MD5 not supported in this browser';
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const generateSHA1 = async (text: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const generateSHA256 = async (text: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const generateSHA512 = async (text: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-512', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const generateAllHashes = async () => {
    if (!inputText.trim()) {
      toast.error('Please enter text to hash');
      return;
    }

    try {
      const [sha1, sha256, sha512] = await Promise.all([
        generateSHA1(inputText),
        generateSHA256(inputText),
        generateSHA512(inputText)
      ]);

      setHashes({
        md5: 'MD5 not available in browser (use SHA-256 instead)',
        sha1,
        sha256,
        sha512
      });

      toast.success('Hashes generated successfully!');
    } catch (error) {
      toast.error('Error generating hashes');
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(`${type} hash copied to clipboard!`);
  };

  const clearAll = () => {
    setInputText('');
    setHashes({
      md5: '',
      sha1: '',
      sha256: '',
      sha512: ''
    });
  };

  const downloadHashes = () => {
    if (!hashes.sha1 && !hashes.sha256 && !hashes.sha512) {
      toast.error('No hashes to download');
      return;
    }

    const content = `Hash Results for: "${inputText}"

SHA-1: ${hashes.sha1}
SHA-256: ${hashes.sha256}
SHA-512: ${hashes.sha512}

Generated on: ${new Date().toLocaleString()}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hashes-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Hashes downloaded!');
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Hash Generator</h1>
        <p className="text-muted-foreground">
          Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Generate Hashes
          </CardTitle>
          <CardDescription>
            Enter text to generate various hash values
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Input Text</label>
            <Textarea
              placeholder="Enter your text here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={generateAllHashes} className="flex-1">
              Generate Hashes
            </Button>
            <Button variant="outline" onClick={clearAll}>
              Clear
            </Button>
          </div>

          {(hashes.sha1 || hashes.sha256 || hashes.sha512) && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Generated Hashes</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={downloadHashes}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <ResultShare 
                    title="Hash Results"
                    result={`SHA-1: ${hashes.sha1}\nSHA-256: ${hashes.sha256}\nSHA-512: ${hashes.sha512}`}
                    resultType="text"
                    toolName="hash-generator"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">SHA-1</label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(hashes.sha1, 'SHA-1')}
                      disabled={!hashes.sha1}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <Input
                    value={hashes.sha1}
                    readOnly
                    className="font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">SHA-256</label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(hashes.sha256, 'SHA-256')}
                      disabled={!hashes.sha256}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <Input
                    value={hashes.sha256}
                    readOnly
                    className="font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">SHA-512</label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(hashes.sha512, 'SHA-512')}
                      disabled={!hashes.sha512}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <Textarea
                    value={hashes.sha512}
                    readOnly
                    rows={3}
                    className="font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Comprehensive Usage Guide */}
      <div className="mt-8 space-y-6">
        <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="text-purple-800 dark:text-purple-200 flex items-center gap-2">
              <Hash className="h-5 w-5" />
              Hash Generator - Complete Usage Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Quick Start */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-blue-700 dark:text-blue-300">
                  🔢 How to Generate Hashes
                </h3>
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li><strong>Enter Text:</strong> Type or paste your text in the input area</li>
                    <li><strong>Generate:</strong> Click "Generate Hashes" button</li>
                    <li><strong>View Results:</strong> See SHA-1, SHA-256, and SHA-512 hashes</li>
                    <li><strong>Copy Hash:</strong> Click copy button for specific hash</li>
                    <li><strong>Download:</strong> Save all hashes to a text file</li>
                  </ol>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-green-700 dark:text-green-300">
                  🔐 What are Hash Functions?
                </h3>
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li><strong>One-Way:</strong> Cannot reverse hash back to original</li>
                    <li><strong>Fixed Length:</strong> Same hash length regardless of input</li>
                    <li><strong>Deterministic:</strong> Same input always gives same hash</li>
                    <li><strong>Avalanche:</strong> Small input change = big hash change</li>
                    <li><strong>Collision Resistant:</strong> Hard to find two inputs with same hash</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Hash Types Explained */}
            <div>
              <h3 className="font-semibold mb-4 text-indigo-700 dark:text-indigo-300">
                🔍 Hash Algorithm Comparison
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h4 className="font-medium text-yellow-600 mb-2">SHA-1 (160-bit)</h4>
                  <ul className="text-xs space-y-1 text-yellow-700 dark:text-yellow-300">
                    <li>• <strong>Length:</strong> 40 hex characters</li>
                    <li>• <strong>Security:</strong> Deprecated (vulnerable)</li>
                    <li>• <strong>Speed:</strong> Fast</li>
                    <li>• <strong>Use:</strong> Legacy systems only</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-medium text-green-600 mb-2">SHA-256 (256-bit)</h4>
                  <ul className="text-xs space-y-1 text-green-700 dark:text-green-300">
                    <li>• <strong>Length:</strong> 64 hex characters</li>
                    <li>• <strong>Security:</strong> Very secure</li>
                    <li>• <strong>Speed:</strong> Good balance</li>
                    <li>• <strong>Use:</strong> Recommended standard</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-medium text-blue-600 mb-2">SHA-512 (512-bit)</h4>
                  <ul className="text-xs space-y-1 text-blue-700 dark:text-blue-300">
                    <li>• <strong>Length:</strong> 128 hex characters</li>
                    <li>• <strong>Security:</strong> Maximum security</li>
                    <li>• <strong>Speed:</strong> Slower but secure</li>
                    <li>• <strong>Use:</strong> High-security applications</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Common Use Cases */}
            <div>
              <h3 className="font-semibold mb-4 text-cyan-700 dark:text-cyan-300">
                💼 Common Hash Use Cases
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                  <h4 className="font-medium mb-2 text-red-600">🔒 Password Storage</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Hash passwords before storing</li>
                    <li>• Add salt for extra security</li>
                    <li>• Use SHA-256 or better</li>
                    <li>• Never store plain passwords</li>
                  </ul>
                </div>
                
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                  <h4 className="font-medium mb-2 text-blue-600">💾 File Integrity</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Verify file hasn't changed</li>
                    <li>• Detect corruption</li>
                    <li>• Ensure download integrity</li>
                    <li>• Compare file versions</li>
                  </ul>
                </div>
                
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                  <h4 className="font-medium mb-2 text-green-600">🔗 Blockchain</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Create block hashes</li>
                    <li>• Proof of work</li>
                    <li>• Transaction verification</li>
                    <li>• Digital signatures</li>
                  </ul>
                </div>
                
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                  <h4 className="font-medium mb-2 text-purple-600">🔍 Data Deduplication</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Find duplicate files</li>
                    <li>• Create unique identifiers</li>
                    <li>• Cache keys</li>
                    <li>• Database indexing</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Security Considerations */}
            <div>
              <h3 className="font-semibold mb-4 text-orange-700 dark:text-orange-300">
                ⚠️ Security Considerations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg border border-red-200 dark:border-red-800">
                  <h4 className="font-medium text-red-800 dark:text-red-200 mb-3">❌ Vulnerabilities</h4>
                  <ul className="text-sm space-y-2 text-red-700 dark:text-red-300">
                    <li>• <strong>Rainbow Tables:</strong> Pre-computed hash lookups</li>
                    <li>• <strong>Brute Force:</strong> Trying all possible inputs</li>
                    <li>• <strong>Dictionary Attacks:</strong> Common word hashing</li>
                    <li>• <strong>Collision Attacks:</strong> Finding hash duplicates</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-medium text-green-800 dark:text-green-200 mb-3">✅ Protection Methods</h4>
                  <ul className="text-sm space-y-2 text-green-700 dark:text-green-300">
                    <li>• <strong>Salt:</strong> Add random data before hashing</li>
                    <li>• <strong>Pepper:</strong> Add secret key to hash</li>
                    <li>• <strong>Key Stretching:</strong> Multiple hash iterations</li>
                    <li>• <strong>Strong Algorithms:</strong> Use SHA-256 or SHA-512</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Practical Examples */}
            <div>
              <h3 className="font-semibold mb-4 text-teal-700 dark:text-teal-300">
                📝 Practical Examples
              </h3>
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                  <h4 className="font-medium mb-2">Example 1: Simple Text</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>Input:</strong> <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">"Hello World"</code></p>
                      <p><strong>SHA-256:</strong></p>
                      <code className="text-xs bg-blue-100 dark:bg-blue-900 p-2 rounded block mt-1 break-all">
                        a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e
                      </code>
                    </div>
                    <div>
                      <p><strong>Use Case:</strong> Verify message integrity</p>
                      <p><strong>Note:</strong> Same input always produces same hash</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                  <h4 className="font-medium mb-2">Example 2: Password Hashing</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>Password:</strong> <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">"MySecretPass123"</code></p>
                      <p><strong>SHA-256:</strong></p>
                      <code className="text-xs bg-green-100 dark:bg-green-900 p-2 rounded block mt-1 break-all">
                        b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb9
                      </code>
                    </div>
                    <div>
                      <p><strong>Use Case:</strong> Store in database instead of plain password</p>
                      <p><strong>Security:</strong> Add salt for production use</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Best Practices */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-3">🛡️ Best Practices</h4>
                <ul className="text-sm space-y-2 text-blue-700 dark:text-blue-300">
                  <li>• Use SHA-256 or SHA-512 for new applications</li>
                  <li>• Always add salt when hashing passwords</li>
                  <li>• Use proper key derivation functions (PBKDF2, bcrypt)</li>
                  <li>• Verify hash integrity in critical applications</li>
                  <li>• Keep hash algorithms updated</li>
                </ul>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-3">⚠️ Important Notes</h4>
                <ul className="text-sm space-y-2 text-amber-700 dark:text-amber-300">
                  <li>• Hashes are one-way - cannot be reversed</li>
                  <li>• Same input always produces same hash</li>
                  <li>• Small input changes create completely different hashes</li>
                  <li>• This tool is for educational/testing purposes</li>
                  <li>• Use proper cryptographic libraries in production</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}