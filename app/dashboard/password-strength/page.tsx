'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Shield, Check, X, Copy, Download, Share2 } from 'lucide-react';
import { toast } from 'sonner';

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
      
      {/* Comprehensive Usage Guide */}
      <div className="mt-8 space-y-6">
        <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-green-800 dark:text-green-200 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Password Strength Checker - Complete Usage Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Quick Start */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-blue-700 dark:text-blue-300">
                  🔍 How to Check Password Strength
                </h3>
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li><strong>Enter Password:</strong> Type your password in the input field</li>
                    <li><strong>View Analysis:</strong> See real-time strength assessment</li>
                    <li><strong>Check Requirements:</strong> Review which criteria are met</li>
                    <li><strong>Improve Strength:</strong> Add missing character types</li>
                    <li><strong>Test Again:</strong> Re-check after improvements</li>
                  </ol>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-purple-700 dark:text-purple-300">
                  📊 Strength Criteria Explained
                </h3>
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li><strong>Length:</strong> At least 8 characters (12+ recommended)</li>
                    <li><strong>Uppercase:</strong> Contains A-Z letters</li>
                    <li><strong>Lowercase:</strong> Contains a-z letters</li>
                    <li><strong>Numbers:</strong> Contains 0-9 digits</li>
                    <li><strong>Symbols:</strong> Contains special characters</li>
                    <li><strong>Uniqueness:</strong> Not a common password</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Strength Levels */}
            <div>
              <h3 className="font-semibold mb-4 text-indigo-700 dark:text-indigo-300">
                🎨 Password Strength Levels
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg border border-red-200 dark:border-red-800">
                  <h4 className="font-medium text-red-600 mb-2 flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    Weak (0-2 criteria)
                  </h4>
                  <ul className="text-xs space-y-1 text-red-700 dark:text-red-300">
                    <li>• Easily cracked in minutes</li>
                    <li>• Vulnerable to attacks</li>
                    <li>• Should not be used</li>
                    <li>• Examples: "123456", "password"</li>
                  </ul>
                </div>
                
                <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h4 className="font-medium text-yellow-600 mb-2 flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    Medium (3-4 criteria)
                  </h4>
                  <ul className="text-xs space-y-1 text-yellow-700 dark:text-yellow-300">
                    <li>• Takes days to crack</li>
                    <li>• Acceptable for low-risk</li>
                    <li>• Needs improvement</li>
                    <li>• Examples: "MyPassword1"</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-medium text-green-600 mb-2 flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    Strong (5-6 criteria)
                  </h4>
                  <ul className="text-xs space-y-1 text-green-700 dark:text-green-300">
                    <li>• Takes years to crack</li>
                    <li>• Excellent security</li>
                    <li>• Recommended for all uses</li>
                    <li>• Examples: "Tr0ub4dor&3"</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Common Weak Passwords */}
            <div>
              <h3 className="font-semibold mb-4 text-red-700 dark:text-red-300">
                ⚠️ Common Weak Passwords to Avoid
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border">
                  <h4 className="font-medium text-red-600 mb-2">Sequential</h4>
                  <ul className="text-xs space-y-1 font-mono">
                    <li>123456</li>
                    <li>abcdef</li>
                    <li>qwerty</li>
                    <li>111111</li>
                  </ul>
                </div>
                
                <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border">
                  <h4 className="font-medium text-red-600 mb-2">Dictionary</h4>
                  <ul className="text-xs space-y-1 font-mono">
                    <li>password</li>
                    <li>welcome</li>
                    <li>admin</li>
                    <li>login</li>
                  </ul>
                </div>
                
                <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border">
                  <h4 className="font-medium text-red-600 mb-2">Personal</h4>
                  <ul className="text-xs space-y-1 font-mono">
                    <li>name123</li>
                    <li>birthday</li>
                    <li>phone#</li>
                    <li>address</li>
                  </ul>
                </div>
                
                <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border">
                  <h4 className="font-medium text-red-600 mb-2">Patterns</h4>
                  <ul className="text-xs space-y-1 font-mono">
                    <li>aaa111</li>
                    <li>abc123</li>
                    <li>password1</li>
                    <li>123abc</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Improvement Tips */}
            <div>
              <h3 className="font-semibold mb-4 text-cyan-700 dark:text-cyan-300">
                🚀 How to Improve Password Strength
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                  <h4 className="font-medium mb-2 text-green-600">Quick Fixes</h4>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Add Length:</strong> Make it 12+ characters</li>
                    <li>• <strong>Mix Cases:</strong> Use both Upper and lower</li>
                    <li>• <strong>Add Numbers:</strong> Include 2-3 digits</li>
                    <li>• <strong>Use Symbols:</strong> Add !@#$%^&* characters</li>
                  </ul>
                </div>
                
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                  <h4 className="font-medium mb-2 text-blue-600">Advanced Tips</h4>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Passphrases:</strong> Use 4-5 random words</li>
                    <li>• <strong>Substitution:</strong> Replace letters with symbols</li>
                    <li>• <strong>Acronyms:</strong> First letters of a sentence</li>
                    <li>• <strong>Generators:</strong> Use password generators</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Examples */}
            <div>
              <h3 className="font-semibold mb-4 text-orange-700 dark:text-orange-300">
                📝 Password Improvement Examples
              </h3>
              <div className="space-y-3">
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <h5 className="font-medium text-red-600 mb-1">Weak</h5>
                      <code className="bg-red-100 dark:bg-red-900 px-2 py-1 rounded">password</code>
                      <p className="text-xs text-muted-foreground mt-1">Only lowercase, common word</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-yellow-600 mb-1">Better</h5>
                      <code className="bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">Password123</code>
                      <p className="text-xs text-muted-foreground mt-1">Added uppercase and numbers</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-green-600 mb-1">Strong</h5>
                      <code className="bg-green-100 dark:bg-green-900 px-2 py-1 rounded">P@ssw0rd!2024</code>
                      <p className="text-xs text-muted-foreground mt-1">Mixed case, symbols, longer</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Security Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-3">🛡️ Security Best Practices</h4>
                <ul className="text-sm space-y-2 text-blue-700 dark:text-blue-300">
                  <li>• Use unique passwords for each account</li>
                  <li>• Enable two-factor authentication</li>
                  <li>• Use a reputable password manager</li>
                  <li>• Change passwords if breached</li>
                  <li>• Never share passwords with others</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-3">📊 Regular Security Checkup</h4>
                <ul className="text-sm space-y-2 text-purple-700 dark:text-purple-300">
                  <li>• Test all passwords monthly</li>
                  <li>• Update weak passwords immediately</li>
                  <li>• Monitor for data breaches</li>
                  <li>• Review account security settings</li>
                  <li>• Keep security software updated</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}