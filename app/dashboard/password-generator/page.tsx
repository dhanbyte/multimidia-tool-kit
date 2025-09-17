'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Copy, RefreshCw, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { ShareButton } from '@/components/share-button';
import { ResultShare } from '@/components/result-share';

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState([12]);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  const generatePassword = () => {
    let charset = '';
    
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!charset) {
      toast.error('Please select at least one character type');
      return;
    }

    let result = '';
    for (let i = 0; i < length[0]; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    setPassword(result);
    toast.success('Password generated successfully!');
  };

  const copyToClipboard = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    toast.success('Password copied to clipboard!');
  };

  const getStrengthColor = () => {
    if (length[0] < 8) return 'text-red-500';
    if (length[0] < 12) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStrengthText = () => {
    if (length[0] < 8) return 'Weak';
    if (length[0] < 12) return 'Medium';
    return 'Strong';
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Password Generator</h1>
        <p className="text-muted-foreground">
          Generate secure passwords with customizable options
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Generate Secure Password
          </CardTitle>
          <CardDescription>
            Customize your password settings and generate a secure password
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Password Length: {length[0]}
            </label>
            <Slider
              value={length}
              onValueChange={setLength}
              max={50}
              min={4}
              step={1}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="uppercase"
                checked={includeUppercase}
                onCheckedChange={(checked) => setIncludeUppercase(checked === true)}
              />
              <label htmlFor="uppercase" className="text-sm">
                Uppercase (A-Z)
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="lowercase"
                checked={includeLowercase}
                onCheckedChange={(checked) => setIncludeLowercase(checked === true)}
              />
              <label htmlFor="lowercase" className="text-sm">
                Lowercase (a-z)
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="numbers"
                checked={includeNumbers}
                onCheckedChange={(checked) => setIncludeNumbers(checked === true)}
              />
              <label htmlFor="numbers" className="text-sm">
                Numbers (0-9)
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="symbols"
                checked={includeSymbols}
                onCheckedChange={(checked) => setIncludeSymbols(checked === true)}
              />
              <label htmlFor="symbols" className="text-sm">
                Symbols (!@#$...)
              </label>
            </div>
          </div>

          <Button onClick={generatePassword} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Generate Password
          </Button>

          {password && (
            <div className="space-y-2 p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Generated Password</label>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${getStrengthColor()}`}>
                    {getStrengthText()}
                  </span>
                  <ResultShare 
                    title="Generated Password"
                    result={password}
                    resultType="password"
                    toolName="password-generator"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Input value={password} readOnly className="font-mono" />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyToClipboard}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}