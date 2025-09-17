'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Code, Copy } from 'lucide-react';
import { toast } from 'sonner';

export default function AICodeGenerator() {
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' }
  ];

  const generateCode = async () => {
    if (!description.trim()) {
      toast.error('Please describe what code you want to generate');
      return;
    }

    setIsGenerating(true);
    
    setTimeout(() => {
      let mockCode = '';
      
      switch (language) {
        case 'javascript':
          mockCode = `// ${description}
function ${description.toLowerCase().replace(/\s+/g, '')}() {
  // AI-generated JavaScript code
  console.log('Generated code for: ${description}');
  
  // Example implementation
  const result = {
    success: true,
    message: 'Code generated successfully',
    data: []
  };
  
  return result;
}

// Usage example
const output = ${description.toLowerCase().replace(/\s+/g, '')}();
console.log(output);`;
          break;
          
        case 'python':
          mockCode = `# ${description}
def ${description.toLowerCase().replace(/\s+/g, '_')}():
    """AI-generated Python code"""
    print(f"Generated code for: ${description}")
    
    # Example implementation
    result = {
        'success': True,
        'message': 'Code generated successfully',
        'data': []
    }
    
    return result

# Usage example
if __name__ == "__main__":
    output = ${description.toLowerCase().replace(/\s+/g, '_')}()
    print(output)`;
          break;
          
        default:
          mockCode = `/* ${description} */
// AI-generated ${language} code
// This is a demo implementation

console.log("Generated code for: ${description}");`;
      }

      setGeneratedCode(mockCode);
      setIsGenerating(false);
      toast.success('Code generated successfully!');
    }, 2000);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    toast.success('Code copied to clipboard!');
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">AI Code Generator</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Generate Code with AI
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Describe what you want to build</label>
              <Textarea
                placeholder="e.g., Create a function to calculate fibonacci numbers"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Programming Language</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map(lang => (
                    <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={generateCode} disabled={isGenerating} className="w-full">
              {isGenerating ? 'Generating Code...' : 'Generate Code'}
            </Button>
          </CardContent>
        </Card>

        {generatedCode && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Generated Code</CardTitle>
                <Button onClick={copyCode} size="sm">
                  <Copy className="h-4 w-4 mr-2" />Copy
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea 
                value={generatedCode} 
                readOnly 
                rows={15} 
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}