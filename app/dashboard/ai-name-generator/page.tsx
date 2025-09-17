'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Copy } from 'lucide-react';
import { toast } from 'sonner';

export default function AINameGenerator() {
  const [category, setCategory] = useState('business');
  const [keywords, setKeywords] = useState('');
  const [generatedNames, setGeneratedNames] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const categories = [
    { value: 'business', label: 'Business/Company' },
    { value: 'product', label: 'Product' },
    { value: 'app', label: 'App/Software' },
    { value: 'brand', label: 'Brand' },
    { value: 'character', label: 'Character' },
    { value: 'pet', label: 'Pet' }
  ];

  const generateNames = async () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const prefixes = ['Tech', 'Smart', 'Pro', 'Digital', 'Creative', 'Innovative', 'Modern', 'Elite'];
      const suffixes = ['Hub', 'Lab', 'Works', 'Solutions', 'Studio', 'Co', 'Group', 'Systems'];
      const base = keywords || category;
      
      const names = [];
      for (let i = 0; i < 10; i++) {
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        names.push(`${prefix}${base.charAt(0).toUpperCase() + base.slice(1)}`);
        names.push(`${base.charAt(0).toUpperCase() + base.slice(1)}${suffix}`);
      }
      
      setGeneratedNames([...new Set(names)].slice(0, 12));
      setIsGenerating(false);
      toast.success('Names generated!');
    }, 2000);
  };

  const copyName = (name: string) => {
    navigator.clipboard.writeText(name);
    toast.success(`"${name}" copied!`);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">AI Name Generator</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Generate Names with AI
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Keywords (Optional)</label>
                <Input
                  placeholder="e.g., tech, creative, fast"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                />
              </div>
            </div>

            <Button onClick={generateNames} disabled={isGenerating} className="w-full">
              {isGenerating ? 'Generating Names...' : 'Generate Names'}
            </Button>
          </CardContent>
        </Card>

        {generatedNames.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Generated Names</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {generatedNames.map((name, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <span className="font-medium">{name}</span>
                    <Button size="sm" variant="ghost" onClick={() => copyName(name)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}