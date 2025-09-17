'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Shield, Check, X } from 'lucide-react';

export default function PasswordStrength() {
  const [password, setPassword] = useState('');

  const checkStrength = (pwd: string) => {
    let score = 0;
    const checks = {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      numbers: /\d/.test(pwd),
      symbols: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
      noCommon: !['password', '123456', 'qwerty'].includes(pwd.toLowerCase())
    };

    Object.values(checks).forEach(check => check && score++);
    
    return { score, checks };
  };

  const { score, checks } = checkStrength(password);
  const strength = score <= 2 ? 'Weak' : score <= 4 ? 'Medium' : 'Strong';
  const color = score <= 2 ? 'text-red-500' : score <= 4 ? 'text-yellow-500' : 'text-green-500';

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Password Strength Checker</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Check Password Strength
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="password"
            placeholder="Enter password to check..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          {password && (
            <>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Strength:</span>
                  <span className={`font-bold ${color}`}>{strength}</span>
                </div>
                <Progress value={(score / 6) * 100} className="w-full" />
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Requirements:</h3>
                {Object.entries({
                  'At least 8 characters': checks.length,
                  'Uppercase letter': checks.uppercase,
                  'Lowercase letter': checks.lowercase,
                  'Number': checks.numbers,
                  'Special character': checks.symbols,
                  'Not common password': checks.noCommon
                }).map(([requirement, met]) => (
                  <div key={requirement} className="flex items-center gap-2">
                    {met ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                    <span className={met ? 'text-green-600' : 'text-red-600'}>
                      {requirement}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}