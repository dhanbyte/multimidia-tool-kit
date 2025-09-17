'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Code } from 'lucide-react';
import { toast } from 'sonner';

export default function LoremCode() {
  const [language, setLanguage] = useState('javascript');
  const [lines, setLines] = useState(10);
  const [generatedCode, setGeneratedCode] = useState('');

  const codeTemplates = {
    javascript: [
      'function generateRandomData() {',
      '  const data = [];',
      '  for (let i = 0; i < 10; i++) {',
      '    data.push(Math.random());',
      '  }',
      '  return data;',
      '}',
      '',
      'const result = generateRandomData();',
      'console.log(result);'
    ],
    python: [
      'import random',
      '',
      'def generate_random_data():',
      '    data = []',
      '    for i in range(10):',
      '        data.append(random.random())',
      '    return data',
      '',
      'result = generate_random_data()',
      'print(result)'
    ],
    java: [
      'public class RandomGenerator {',
      '    public static void main(String[] args) {',
      '        double[] data = new double[10];',
      '        for (int i = 0; i < data.length; i++) {',
      '            data[i] = Math.random();',
      '        }',
      '        System.out.println(Arrays.toString(data));',
      '    }',
      '}',
      ''
    ],
    css: [
      '.container {',
      '  display: flex;',
      '  justify-content: center;',
      '  align-items: center;',
      '  height: 100vh;',
      '  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);',
      '}',
      '',
      '.card {',
      '  padding: 2rem;',
      '  border-radius: 8px;',
      '  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);',
      '}'
    ]
  };

  const generateCode = () => {
    const template = codeTemplates[language as keyof typeof codeTemplates];
    const result = template.slice(0, lines).join('\n');
    setGeneratedCode(result);
    toast.success('Lorem code generated!');
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Lorem Code Generator</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Generate Sample Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Language</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="css">CSS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Number of Lines</label>
              <Input
                type="number"
                min="1"
                max="50"
                value={lines}
                onChange={(e) => setLines(parseInt(e.target.value) || 10)}
              />
            </div>
          </div>

          <Button onClick={generateCode} className="w-full">
            Generate Lorem Code
          </Button>

          {generatedCode && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Generated Code</label>
              <Textarea
                value={generatedCode}
                readOnly
                rows={15}
                className="font-mono text-sm"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}