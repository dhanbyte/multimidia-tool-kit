'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Copy, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function TextPasswordGen() {
  const [baseText, setBaseText] = useState('');
  const [length, setLength] = useState(12);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeMixedCase, setIncludeMixedCase] = useState(true);
  const [passwords, setPasswords] = useState<string[]>([]);

  const generatePasswords = () => {
    if (!baseText.trim()) {
      toast.error('Please enter base text');
      return;
    }

    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const chars = baseText.toLowerCase();
    
    let charset = chars;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;

    const generated = [];
    for (let i = 0; i < 5; i++) {
      let password = baseText;
      
      if (includeMixedCase) {
        password = password.split('').map((char, index) => 
          Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase()
        ).join('');
      }

      // Add random characters to reach desired length
      while (password.length < length) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
      }

      // Shuffle the password
      password = password.split('').sort(() => Math.random() - 0.5).join('');
      generated.push(password.substring(0, length));
    }

    setPasswords(generated);
    toast.success('Passwords generated!');
  };

  const copyPassword = (password: string) => {
    navigator.clipboard.writeText(password);
    toast.success('Password copied!');
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Text-Based Password Generator</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Generate Passwords from Text
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Base Text</label>
            <Input
              placeholder="Enter memorable text (e.g., favorite phrase)"
              value={baseText}
              onChange={(e) => setBaseText(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Password Length</label>
            <Input
              type="number"
              min="8"
              max="50"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value) || 12)}
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Options</label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="numbers"
                  checked={includeNumbers}
                  onCheckedChange={setIncludeNumbers}
                />
                <label htmlFor="numbers" className="text-sm">Include Numbers</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="symbols"
                  checked={includeSymbols}
                  onCheckedChange={setIncludeSymbols}
                />
                <label htmlFor="symbols" className="text-sm">Include Symbols</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="mixedcase"
                  checked={includeMixedCase}
                  onCheckedChange={setIncludeMixedCase}
                />
                <label htmlFor="mixedcase" className="text-sm">Mixed Case</label>
              </div>
            </div>
          </div>

          <Button onClick={generatePasswords} className="w-full">
            Generate Passwords
          </Button>

          {passwords.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium">Generated Passwords</h3>
              {passwords.map((password, index) => (
                <div key={index} className="flex items-center gap-2 p-3 border rounded">
                  <code className="flex-1 font-mono text-sm">{password}</code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyPassword(password)}
                  >
                    <Copy className="h-4 w-4" />
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