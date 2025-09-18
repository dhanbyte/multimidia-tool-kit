'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Copy, RefreshCw, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { ResultShare } from '@/components/result-share';

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState([12]);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [customSymbols, setCustomSymbols] = useState('!@#$%^&*()_+-=[]{}|;:,.<>?');
  const [passwordCount, setPasswordCount] = useState(1);
  const [pronounceable, setPronounceable] = useState(false);
  const [noRepeats, setNoRepeats] = useState(false);
  const [passwords, setPasswords] = useState<string[]>([]);

  const generatePassword = () => {
    let charset = '';
    let uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let lowercase = 'abcdefghijklmnopqrstuvwxyz';
    let numbers = '0123456789';
    let symbols = customSymbols;
    
    // Exclude similar characters if requested
    if (excludeSimilar) {
      uppercase = uppercase.replace(/[IL]/g, '');
      lowercase = lowercase.replace(/[il]/g, '');
      numbers = numbers.replace(/[01]/g, '');
    }
    
    // Exclude ambiguous characters if requested
    if (excludeAmbiguous) {
      uppercase = uppercase.replace(/[O]/g, '');
      lowercase = lowercase.replace(/[o]/g, '');
      symbols = symbols.replace(/[{}\[\]()\/<>]/g, '');
    }
    
    if (includeUppercase) charset += uppercase;
    if (includeLowercase) charset += lowercase;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;

    if (!charset) {
      toast.error('Please select at least one character type');
      return;
    }

    const generatedPasswords = [];
    
    for (let p = 0; p < passwordCount; p++) {
      let result = '';
      const usedChars = new Set();
      
      // Ensure at least one character from each selected type
      if (includeUppercase && uppercase) result += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
      if (includeLowercase && lowercase) result += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
      if (includeNumbers && numbers) result += numbers.charAt(Math.floor(Math.random() * numbers.length));
      if (includeSymbols && symbols) result += symbols.charAt(Math.floor(Math.random() * symbols.length));
      
      // Fill remaining length
      for (let i = result.length; i < length[0]; i++) {
        let char;
        let attempts = 0;
        do {
          char = charset.charAt(Math.floor(Math.random() * charset.length));
          attempts++;
        } while (noRepeats && usedChars.has(char) && attempts < 100);
        
        result += char;
        if (noRepeats) usedChars.add(char);
      }
      
      // Shuffle the password
      result = result.split('').sort(() => Math.random() - 0.5).join('');
      generatedPasswords.push(result);
    }
    
    if (passwordCount === 1) {
      setPassword(generatedPasswords[0]);
    }
    setPasswords(generatedPasswords);
    toast.success(`${passwordCount} password${passwordCount > 1 ? 's' : ''} generated successfully!`);
  };

  const copyToClipboard = () => {
    if (passwords.length === 0) return;
    const textToCopy = passwords.length === 1 ? passwords[0] : passwords.join('\n');
    navigator.clipboard.writeText(textToCopy);
    toast.success(`Password${passwords.length > 1 ? 's' : ''} copied to clipboard!`);
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
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="excludeSimilar"
                checked={excludeSimilar}
                onCheckedChange={(checked) => setExcludeSimilar(checked === true)}
              />
              <label htmlFor="excludeSimilar" className="text-sm">
                Exclude Similar (i, l, 1, L, o, 0, O)
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="excludeAmbiguous"
                checked={excludeAmbiguous}
                onCheckedChange={(checked) => setExcludeAmbiguous(checked === true)}
              />
              <label htmlFor="excludeAmbiguous" className="text-sm">
                Exclude Ambiguous (brackets, slashes)
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="noRepeats"
                checked={noRepeats}
                onCheckedChange={(checked) => setNoRepeats(checked === true)}
              />
              <label htmlFor="noRepeats" className="text-sm">
                No Repeated Characters
              </label>
            </div>
          </div>

          {/* Custom Symbols */}
          {includeSymbols && (
            <div>
              <label className="text-sm font-medium mb-2 block">Custom Symbols</label>
              <Input
                value={customSymbols}
                onChange={(e) => setCustomSymbols(e.target.value)}
                placeholder="!@#$%^&*()_+-=[]{}|;:,.<>?"
                className="font-mono"
              />
            </div>
          )}
          
          {/* Password Count */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Generate {passwordCount} password{passwordCount > 1 ? 's' : ''}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={passwordCount}
              onChange={(e) => setPasswordCount(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1</span>
              <span>5</span>
              <span>10</span>
            </div>
          </div>

          <Button onClick={generatePassword} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Generate Password{passwordCount > 1 ? 's' : ''}
          </Button>

          {passwords.length > 0 && (
            <div className="space-y-4 p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">
                  Generated Password{passwords.length > 1 ? 's' : ''}
                </label>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${getStrengthColor()}`}>
                    {getStrengthText()}
                  </span>
                  <ResultShare 
                    title="Generated Passwords"
                    result={passwords.length === 1 ? passwords[0] : passwords.join('\n')}
                    resultType="password"
                    toolName="password-generator"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                {passwords.map((pwd, index) => (
                  <div key={index} className="flex gap-2">
                    <Input value={pwd} readOnly className="font-mono" />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        navigator.clipboard.writeText(pwd);
                        toast.success('Password copied to clipboard!');
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              {/* Password Analysis */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-medium">{length[0]}</div>
                  <div className="text-muted-foreground">Length</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">{Math.pow(2, length[0] * 3).toExponential(2)}</div>
                  <div className="text-muted-foreground">Combinations</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">{getStrengthText()}</div>
                  <div className="text-muted-foreground">Strength</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">{passwords.length}</div>
                  <div className="text-muted-foreground">Generated</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Comprehensive Usage Guide */}
      <div className="mt-8 space-y-6">
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-200 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Password Generator - Complete Usage Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Quick Start */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-green-700 dark:text-green-300">
                  🔐 How to Generate Strong Passwords
                </h3>
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li><strong>Set Length:</strong> Choose 12+ characters for strong security</li>
                    <li><strong>Select Types:</strong> Enable uppercase, lowercase, numbers, symbols</li>
                    <li><strong>Advanced Options:</strong> Exclude similar/ambiguous characters if needed</li>
                    <li><strong>Generate:</strong> Click "Generate Password" button</li>
                    <li><strong>Copy & Save:</strong> Copy password and store it securely</li>
                  </ol>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-orange-700 dark:text-orange-300">
                  🛡️ Password Security Tips
                </h3>
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li><strong>Length Matters:</strong> Longer passwords are exponentially stronger</li>
                    <li><strong>Mix Characters:</strong> Use all character types for maximum security</li>
                    <li><strong>Unique Passwords:</strong> Never reuse passwords across accounts</li>
                    <li><strong>Store Safely:</strong> Use a password manager to store passwords</li>
                    <li><strong>Regular Updates:</strong> Change passwords periodically</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Password Strength Guide */}
            <div>
              <h3 className="font-semibold mb-4 text-purple-700 dark:text-purple-300">
                📊 Password Strength Levels
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg border border-red-200 dark:border-red-800">
                  <h4 className="font-medium text-red-600 mb-2">❌ Weak (4-7 chars)</h4>
                  <ul className="text-xs space-y-1 text-red-700 dark:text-red-300">
                    <li>• Easy to crack in minutes</li>
                    <li>• Vulnerable to brute force</li>
                    <li>• Not recommended for any use</li>
                    <li>• Example: "pass123"</li>
                  </ul>
                </div>
                
                <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h4 className="font-medium text-yellow-600 mb-2">⚠️ Medium (8-11 chars)</h4>
                  <ul className="text-xs space-y-1 text-yellow-700 dark:text-yellow-300">
                    <li>• Takes days/weeks to crack</li>
                    <li>• Acceptable for low-risk accounts</li>
                    <li>• Should include mixed characters</li>
                    <li>• Example: "MyPass123!"</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-medium text-green-600 mb-2">✅ Strong (12+ chars)</h4>
                  <ul className="text-xs space-y-1 text-green-700 dark:text-green-300">
                    <li>• Takes years/centuries to crack</li>
                    <li>• Recommended for all accounts</li>
                    <li>• Uses all character types</li>
                    <li>• Example: "Kp9#mX2$vL8@qR5!"</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Advanced Features */}
            <div>
              <h3 className="font-semibold mb-4 text-indigo-700 dark:text-indigo-300">
                ⚙️ Advanced Features Explained
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                  <h4 className="font-medium mb-2">🔤 Character Options</h4>
                  <ul className="text-sm space-y-1">
                    <li><strong>Uppercase:</strong> A-Z (adds 26 characters)</li>
                    <li><strong>Lowercase:</strong> a-z (adds 26 characters)</li>
                    <li><strong>Numbers:</strong> 0-9 (adds 10 characters)</li>
                    <li><strong>Symbols:</strong> !@#$... (adds 30+ characters)</li>
                  </ul>
                </div>
                
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                  <h4 className="font-medium mb-2">🎯 Exclusion Options</h4>
                  <ul className="text-sm space-y-1">
                    <li><strong>Similar:</strong> Excludes i,l,1,L,o,0,O</li>
                    <li><strong>Ambiguous:</strong> Excludes brackets and slashes</li>
                    <li><strong>No Repeats:</strong> Each character used once</li>
                    <li><strong>Custom Symbols:</strong> Define your own symbols</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Use Cases */}
            <div>
              <h3 className="font-semibold mb-4 text-cyan-700 dark:text-cyan-300">
                💼 Common Use Cases
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                  <h4 className="font-medium mb-2">🏦 Banking & Finance</h4>
                  <ul className="text-sm space-y-1">
                    <li>• 16+ character length</li>
                    <li>• All character types</li>
                    <li>• No similar characters</li>
                    <li>• Change every 3 months</li>
                  </ul>
                </div>
                
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                  <h4 className="font-medium mb-2">💼 Work Accounts</h4>
                  <ul className="text-sm space-y-1">
                    <li>• 12-14 character length</li>
                    <li>• Mixed case + numbers</li>
                    <li>• Avoid ambiguous chars</li>
                    <li>• Follow company policy</li>
                  </ul>
                </div>
                
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                  <h4 className="font-medium mb-2">🎮 Personal Accounts</h4>
                  <ul className="text-sm space-y-1">
                    <li>• 10-12 character length</li>
                    <li>• Easy to type symbols</li>
                    <li>• Memorable but secure</li>
                    <li>• Unique for each service</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Security Best Practices */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-medium text-green-800 dark:text-green-200 mb-3">✅ Do This</h4>
                <ul className="text-sm space-y-2 text-green-700 dark:text-green-300">
                  <li>• Use unique passwords for every account</li>
                  <li>• Store passwords in a password manager</li>
                  <li>• Enable two-factor authentication</li>
                  <li>• Generate new passwords regularly</li>
                  <li>• Use maximum length allowed</li>
                  <li>• Test password strength before using</li>
                </ul>
              </div>
              
              <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <h4 className="font-medium text-red-800 dark:text-red-200 mb-3">❌ Don't Do This</h4>
                <ul className="text-sm space-y-2 text-red-700 dark:text-red-300">
                  <li>• Don't reuse passwords across sites</li>
                  <li>• Don't use personal information</li>
                  <li>• Don't share passwords with others</li>
                  <li>• Don't write passwords on paper</li>
                  <li>• Don't use dictionary words</li>
                  <li>• Don't use predictable patterns</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}