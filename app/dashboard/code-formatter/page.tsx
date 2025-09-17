'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Code } from 'lucide-react';
import { toast } from 'sonner';

export default function CodeFormatter() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [formatted, setFormatted] = useState('');

  const formatCode = () => {
    if (!code.trim()) {
      toast.error('Please enter code to format');
      return;
    }

    let result = code;
    
    if (language === 'javascript') {
      result = code
        .replace(/;/g, ';\n')
        .replace(/{/g, '{\n  ')
        .replace(/}/g, '\n}')
        .replace(/,/g, ',\n  ');
    } else if (language === 'css') {
      result = code
        .replace(/{/g, ' {\n  ')
        .replace(/}/g, '\n}\n')
        .replace(/;/g, ';\n  ');
    } else if (language === 'html') {
      result = code
        .replace(/></g, '>\n<')
        .replace(/>/g, '>\n')
        .replace(/</g, '\n<');
    }

    setFormatted(result);
    toast.success('Code formatted!');
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Code Formatter</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Format Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="css">CSS</SelectItem>
              <SelectItem value="html">HTML</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
            </SelectContent>
          </Select>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Input Code</label>
              <Textarea
                placeholder="Paste your code here..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={15}
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Formatted Code</label>
              <Textarea
                value={formatted}
                readOnly
                rows={15}
                className="font-mono text-sm"
              />
            </div>
          </div>

          <Button onClick={formatCode} className="w-full">
            Format Code
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}