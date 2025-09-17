'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { GitBranch } from 'lucide-react';
import { toast } from 'sonner';

export default function GitIgnore() {
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [customRules, setCustomRules] = useState('');
  const [gitignore, setGitignore] = useState('');

  const templates = {
    'Node.js': ['node_modules/', 'npm-debug.log*', '.env', 'dist/', 'build/'],
    'Python': ['__pycache__/', '*.pyc', '.env', 'venv/', '.pytest_cache/'],
    'React': ['node_modules/', 'build/', '.env.local', '*.log'],
    'Java': ['*.class', 'target/', '*.jar', '.gradle/'],
    'C++': ['*.o', '*.exe', 'build/', 'cmake-build-*/'],
    'PHP': ['vendor/', '.env', '*.log', 'composer.phar'],
    'Ruby': ['*.gem', '.bundle/', 'log/', 'tmp/'],
    'Go': ['*.exe', '*.test', 'vendor/', 'go.sum']
  };

  const generateGitignore = () => {
    let content = '# Generated .gitignore\n\n';
    
    selectedTemplates.forEach(template => {
      content += `# ${template}\n`;
      templates[template as keyof typeof templates].forEach(rule => {
        content += `${rule}\n`;
      });
      content += '\n';
    });

    if (customRules.trim()) {
      content += '# Custom rules\n';
      content += customRules + '\n';
    }

    setGitignore(content);
    toast.success('.gitignore generated!');
  };

  const toggleTemplate = (template: string) => {
    setSelectedTemplates(prev => 
      prev.includes(template)
        ? prev.filter(t => t !== template)
        : [...prev, template]
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">.gitignore Generator</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Select Templates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(templates).map(template => (
                <div key={template} className="flex items-center space-x-2">
                  <Checkbox
                    id={template}
                    checked={selectedTemplates.includes(template)}
                    onCheckedChange={() => toggleTemplate(template)}
                  />
                  <label htmlFor={template} className="text-sm">
                    {template}
                  </label>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Custom Rules</label>
              <Textarea
                placeholder="Add custom ignore rules..."
                value={customRules}
                onChange={(e) => setCustomRules(e.target.value)}
                rows={6}
              />
            </div>

            <Button onClick={generateGitignore} className="w-full">
              Generate .gitignore
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated .gitignore</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={gitignore}
              readOnly
              rows={20}
              className="font-mono text-sm"
              placeholder="Generated .gitignore will appear here..."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}