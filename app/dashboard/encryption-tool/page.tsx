'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Unlock, Copy, Download, Eye, EyeOff, Shield, Key, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

// Secure Message Share Component
function SecureMessageShare() {
  const [message, setMessage] = useState('');
  const [shareKey, setShareKey] = useState('');
  const [encryptedData, setEncryptedData] = useState('');
  const [shareableLink, setShareableLink] = useState('');
  const [showShareKey, setShowShareKey] = useState(false);

  const aesEncrypt = (text: string, key: string) => {
    const keyHash = btoa(key).slice(0, 16).padEnd(16, '0');
    let encrypted = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const keyChar = keyHash.charCodeAt(i % keyHash.length);
      const shift = (i + 1) * 3;
      encrypted += String.fromCharCode((charCode ^ keyChar) + shift);
    }
    return btoa(encrypted);
  };

  const generateShareKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let key = '';
    for (let i = 0; i < 16; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setShareKey(key);
    toast.success('Secure key generated!');
  };

  const createSecureMessage = () => {
    if (!message.trim()) {
      toast.error('Please enter a message to encrypt');
      return;
    }
    if (!shareKey.trim()) {
      toast.error('Please generate or enter a secure key');
      return;
    }

    try {
      const encrypted = aesEncrypt(message, shareKey);
      setEncryptedData(encrypted);
      
      const shareData = {
        data: encrypted,
        timestamp: new Date().toISOString(),
        hint: `Message encrypted on ${new Date().toLocaleDateString()}`
      };
      
      const encodedData = btoa(JSON.stringify(shareData));
      setShareableLink(encodedData);
      
      toast.success('Secure message created!');
    } catch (error) {
      toast.error('Failed to create secure message');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Create Secure Message for Sharing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Secret Message</label>
            <Textarea
              placeholder="Enter your secret message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Encryption Key</label>
            <div className="flex gap-2">
              <Input
                type={showShareKey ? 'text' : 'password'}
                placeholder="Generate or enter a secure key..."
                value={shareKey}
                onChange={(e) => setShareKey(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline" onClick={() => setShowShareKey(!showShareKey)}>
                {showShareKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button variant="outline" onClick={generateShareKey}>
                Generate
              </Button>
            </div>
          </div>

          <Button onClick={createSecureMessage} className="w-full" size="lg">
            <Lock className="h-4 w-4 mr-2" />
            Create Secure Message
          </Button>
        </CardContent>
      </Card>

      {shareableLink && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">📦 Encrypted Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={shareableLink}
                readOnly
                rows={8}
                className="font-mono text-sm bg-green-50 dark:bg-green-950"
              />
              <Button onClick={() => {
                navigator.clipboard.writeText(shareableLink);
                toast.success('Encrypted data copied!');
              }} className="w-full">
                <Copy className="h-4 w-4 mr-2" />
                Copy Encrypted Data
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">🔑 Decryption Key</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="font-mono text-lg text-center break-all">
                  {shareKey}
                </div>
              </div>
              <Button onClick={() => {
                navigator.clipboard.writeText(shareKey);
                toast.success('Key copied! Share separately!');
              }} variant="outline" className="w-full">
                <Copy className="h-4 w-4 mr-2" />
                Copy Key (Share Separately!)
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Security:</strong> Share the encrypted data and key through different channels for maximum security.
        </AlertDescription>
      </Alert>
    </div>
  );
}

// Receive Encrypted Message Component
function ReceiveEncryptedMessage() {
  const [encryptedInput, setEncryptedInput] = useState('');
  const [decryptionKey, setDecryptionKey] = useState('');
  const [decryptedMessage, setDecryptedMessage] = useState('');
  const [showDecryptionKey, setShowDecryptionKey] = useState(false);

  const aesDecrypt = (encrypted: string, key: string) => {
    try {
      const keyHash = btoa(key).slice(0, 16).padEnd(16, '0');
      const decoded = atob(encrypted);
      let decrypted = '';
      for (let i = 0; i < decoded.length; i++) {
        const charCode = decoded.charCodeAt(i);
        const keyChar = keyHash.charCodeAt(i % keyHash.length);
        const shift = (i + 1) * 3;
        decrypted += String.fromCharCode((charCode - shift) ^ keyChar);
      }
      return decrypted;
    } catch {
      return null;
    }
  };

  const decryptReceivedMessage = () => {
    if (!encryptedInput.trim() || !decryptionKey.trim()) {
      toast.error('Please enter both encrypted data and key');
      return;
    }

    try {
      let encryptedData = '';
      
      try {
        const parsed = JSON.parse(atob(encryptedInput));
        encryptedData = parsed.data || encryptedInput;
      } catch {
        encryptedData = encryptedInput;
      }

      const decrypted = aesDecrypt(encryptedData, decryptionKey);
      
      if (decrypted) {
        setDecryptedMessage(decrypted);
        toast.success('Message decrypted successfully!');
      } else {
        toast.error('Decryption failed. Check your key and data.');
      }
    } catch (error) {
      toast.error('Invalid encrypted data or wrong key');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Unlock className="h-5 w-5" />
            Decrypt Received Message
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Encrypted Data</label>
            <Textarea
              placeholder="Paste the encrypted data here..."
              value={encryptedInput}
              onChange={(e) => setEncryptedInput(e.target.value)}
              rows={6}
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Decryption Key</label>
            <div className="flex gap-2">
              <Input
                type={showDecryptionKey ? 'text' : 'password'}
                placeholder="Enter the decryption key..."
                value={decryptionKey}
                onChange={(e) => setDecryptionKey(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline" onClick={() => setShowDecryptionKey(!showDecryptionKey)}>
                {showDecryptionKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button onClick={decryptReceivedMessage} className="w-full" size="lg">
            <Unlock className="h-4 w-4 mr-2" />
            Decrypt Message
          </Button>
        </CardContent>
      </Card>

      {decryptedMessage && (
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">🎉 Decrypted Message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-6 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="text-lg whitespace-pre-wrap break-words">
                {decryptedMessage}
              </div>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => {
                navigator.clipboard.writeText(decryptedMessage);
                toast.success('Message copied!');
              }}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Message
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function EncryptionTool() {
  const [text, setText] = useState('');
  const [key, setKey] = useState('');
  const [result, setResult] = useState('');
  const [encryptionMethod, setEncryptionMethod] = useState('aes');
  const [showKey, setShowKey] = useState(false);
  const [processing, setProcessing] = useState(false);

  // AES-like encryption (simplified for demo)
  const aesEncrypt = (text: string, key: string) => {
    const keyHash = btoa(key).slice(0, 16).padEnd(16, '0');
    let encrypted = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const keyChar = keyHash.charCodeAt(i % keyHash.length);
      const shift = (i + 1) * 3;
      encrypted += String.fromCharCode((charCode ^ keyChar) + shift);
    }
    return btoa(encrypted);
  };

  const aesDecrypt = (encrypted: string, key: string) => {
    try {
      const keyHash = btoa(key).slice(0, 16).padEnd(16, '0');
      const decoded = atob(encrypted);
      let decrypted = '';
      for (let i = 0; i < decoded.length; i++) {
        const charCode = decoded.charCodeAt(i);
        const keyChar = keyHash.charCodeAt(i % keyHash.length);
        const shift = (i + 1) * 3;
        decrypted += String.fromCharCode((charCode - shift) ^ keyChar);
      }
      return decrypted;
    } catch {
      return 'Invalid encrypted text or wrong key';
    }
  };

  // Caesar Cipher
  const caesarEncrypt = (text: string, shift: number) => {
    return text.replace(/[a-zA-Z]/g, (char) => {
      const start = char <= 'Z' ? 65 : 97;
      return String.fromCharCode(((char.charCodeAt(0) - start + shift) % 26) + start);
    });
  };

  const caesarDecrypt = (text: string, shift: number) => {
    return caesarEncrypt(text, 26 - shift);
  };

  // Base64 Encoding
  const base64Encrypt = (text: string) => {
    return btoa(unescape(encodeURIComponent(text)));
  };

  const base64Decrypt = (text: string) => {
    try {
      return decodeURIComponent(escape(atob(text)));
    } catch {
      return 'Invalid Base64 text';
    }
  };

  // XOR Cipher
  const xorEncrypt = (text: string, key: string) => {
    let encrypted = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const keyChar = key.charCodeAt(i % key.length);
      encrypted += String.fromCharCode(charCode ^ keyChar);
    }
    return btoa(encrypted);
  };

  const xorDecrypt = (encrypted: string, key: string) => {
    try {
      const decoded = atob(encrypted);
      let decrypted = '';
      for (let i = 0; i < decoded.length; i++) {
        const charCode = decoded.charCodeAt(i);
        const keyChar = key.charCodeAt(i % key.length);
        decrypted += String.fromCharCode(charCode ^ keyChar);
      }
      return decrypted;
    } catch {
      return 'Invalid encrypted text';
    }
  };

  const encrypt = async () => {
    if (!text.trim()) {
      toast.error('Please enter text to encrypt');
      return;
    }

    if ((encryptionMethod === 'aes' || encryptionMethod === 'xor') && !key.trim()) {
      toast.error('Please enter an encryption key');
      return;
    }

    setProcessing(true);
    
    try {
      let encrypted = '';
      
      switch (encryptionMethod) {
        case 'aes':
          encrypted = aesEncrypt(text, key);
          break;
        case 'caesar':
          const shift = parseInt(key) || 3;
          encrypted = caesarEncrypt(text, shift);
          break;
        case 'base64':
          encrypted = base64Encrypt(text);
          break;
        case 'xor':
          encrypted = xorEncrypt(text, key);
          break;
        default:
          encrypted = aesEncrypt(text, key);
      }
      
      setResult(encrypted);
      toast.success('Text encrypted successfully!');
    } catch (error) {
      toast.error('Encryption failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const decrypt = async () => {
    if (!text.trim()) {
      toast.error('Please enter encrypted text to decrypt');
      return;
    }

    if ((encryptionMethod === 'aes' || encryptionMethod === 'xor') && !key.trim()) {
      toast.error('Please enter the decryption key');
      return;
    }

    setProcessing(true);
    
    try {
      let decrypted = '';
      
      switch (encryptionMethod) {
        case 'aes':
          decrypted = aesDecrypt(text, key);
          break;
        case 'caesar':
          const shift = parseInt(key) || 3;
          decrypted = caesarDecrypt(text, shift);
          break;
        case 'base64':
          decrypted = base64Decrypt(text);
          break;
        case 'xor':
          decrypted = xorDecrypt(text, key);
          break;
        default:
          decrypted = aesDecrypt(text, key);
      }
      
      setResult(decrypted);
      toast.success('Text decrypted successfully!');
    } catch (error) {
      toast.error('Decryption failed. Check your key and try again.');
    } finally {
      setProcessing(false);
    }
  };

  const generateRandomKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let key = '';
    for (let i = 0; i < 16; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setKey(key);
    toast.success('Random key generated!');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const downloadResult = () => {
    if (!result) return;
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${encryptionMethod}-result.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Result downloaded!');
  };

  const clearAll = () => {
    setText('');
    setKey('');
    setResult('');
  };

  const encryptionMethods = {
    aes: { name: 'AES-like', description: 'Advanced encryption with key', needsKey: true, keyType: 'text' },
    caesar: { name: 'Caesar Cipher', description: 'Classic shift cipher', needsKey: true, keyType: 'number' },
    base64: { name: 'Base64', description: 'Simple encoding (not secure)', needsKey: false, keyType: 'none' },
    xor: { name: 'XOR Cipher', description: 'Bitwise XOR encryption', needsKey: true, keyType: 'text' }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Advanced Text Encryption Tool</h1>
        <p className="text-muted-foreground">
          Secure your text with multiple encryption methods and share encrypted messages safely
        </p>
      </div>
      
      <Tabs defaultValue="encrypt" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="encrypt">Encrypt & Decrypt</TabsTrigger>
          <TabsTrigger value="share">Secure Message Sharing</TabsTrigger>
          <TabsTrigger value="receive">Receive Encrypted Message</TabsTrigger>
        </TabsList>

        <TabsContent value="encrypt">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Encryption Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Encryption Method */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Encryption Method</label>
                  <Select value={encryptionMethod} onValueChange={setEncryptionMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(encryptionMethods).map(([key, method]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center justify-between w-full">
                            <span>{method.name}</span>
                            <Badge variant="outline" className="ml-2">
                              {method.needsKey ? 'Key Required' : 'No Key'}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {encryptionMethods[encryptionMethod as keyof typeof encryptionMethods].description}
                  </p>
                </div>

                {/* Key Input */}
                {encryptionMethods[encryptionMethod as keyof typeof encryptionMethods].needsKey && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      {encryptionMethods[encryptionMethod as keyof typeof encryptionMethods].keyType === 'number' ? 'Shift Number' : 'Encryption Key'}
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          type={showKey ? 'text' : 'password'}
                          placeholder={encryptionMethods[encryptionMethod as keyof typeof encryptionMethods].keyType === 'number' ? 'Enter shift number (e.g., 3)' : 'Enter your secret key...'}
                          value={key}
                          onChange={(e) => setKey(e.target.value)}
                        />
                        {encryptionMethods[encryptionMethod as keyof typeof encryptionMethods].keyType === 'text' && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowKey(!showKey)}
                          >
                            {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        )}
                      </div>
                      {encryptionMethods[encryptionMethod as keyof typeof encryptionMethods].keyType === 'text' && (
                        <Button variant="outline" onClick={generateRandomKey}>
                          Generate
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* Text Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Input Text</label>
                  <Textarea
                    placeholder="Enter text to encrypt or decrypt..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={8}
                    className="resize-none"
                  />
                  <div className="text-xs text-muted-foreground">
                    {text.length} characters
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Button onClick={encrypt} disabled={processing}>
                    <Lock className="h-4 w-4 mr-2" />
                    {processing ? 'Encrypting...' : 'Encrypt'}
                  </Button>
                  <Button onClick={decrypt} variant="outline" disabled={processing}>
                    <Unlock className="h-4 w-4 mr-2" />
                    {processing ? 'Decrypting...' : 'Decrypt'}
                  </Button>
                </div>
                
                <Button variant="ghost" onClick={clearAll} className="w-full">
                  Clear All
                </Button>
              </CardContent>
            </Card>

            {/* Result Panel */}
            <Card>
              <CardHeader>
                <CardTitle>Result</CardTitle>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-4">
                    <Textarea
                      value={result}
                      readOnly
                      rows={12}
                      className="resize-none bg-muted font-mono text-sm"
                    />
                    
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => copyToClipboard(result)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button variant="outline" onClick={downloadResult}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Result length: {result.length} characters
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Your encrypted/decrypted text will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="share">
          <SecureMessageShare />
        </TabsContent>

        <TabsContent value="receive">
          <ReceiveEncryptedMessage />
        </TabsContent>
      </Tabs>
      
      {/* Security Warning */}
      <Alert className="mt-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Security Notice:</strong> This tool is for educational purposes. For real security needs, use established cryptographic libraries and never share your encryption keys.
        </AlertDescription>
      </Alert>
    </div>
  );
}