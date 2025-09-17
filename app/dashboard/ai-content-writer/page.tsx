'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Copy } from 'lucide-react';
import { toast } from 'sonner';

export default function AIContentWriter() {
  const [topic, setTopic] = useState('');
  const [contentType, setContentType] = useState('blog');
  const [tone, setTone] = useState('professional');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const contentTypes = [
    { value: 'blog', label: 'Blog Post' },
    { value: 'article', label: 'Article' },
    { value: 'social', label: 'Social Media Post' },
    { value: 'email', label: 'Email' },
    { value: 'product', label: 'Product Description' }
  ];

  const tones = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'formal', label: 'Formal' },
    { value: 'creative', label: 'Creative' }
  ];

  const generateContent = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setIsGenerating(true);
    
    setTimeout(() => {
      const mockContent = `# ${topic}

This is AI-generated content about ${topic}. The content is written in a ${tone} tone for ${contentType} purposes.

## Introduction
${topic} is an important subject that deserves careful consideration. In this ${contentType}, we'll explore the key aspects and provide valuable insights.

## Key Points
- Understanding the fundamentals of ${topic}
- Best practices and recommendations
- Common challenges and solutions
- Future trends and developments

## Conclusion
In conclusion, ${topic} offers many opportunities for growth and improvement. By following the guidelines outlined in this ${contentType}, you can achieve better results.

*Note: This is a demo AI content generator. Real implementation would use actual AI APIs like OpenAI GPT or similar services.*`;

      setGeneratedContent(mockContent);
      setIsGenerating(false);
      toast.success('Content generated successfully!');
    }, 3000);
  };

  const copyContent = () => {
    navigator.clipboard.writeText(generatedContent);
    toast.success('Content copied to clipboard!');
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">AI Content Writer</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Generate Content with AI
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Topic</label>
              <Input
                placeholder="Enter your topic or keywords..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Content Type</label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {contentTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tone</label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map(t => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={generateContent} disabled={isGenerating} className="w-full">
              {isGenerating ? 'Generating Content...' : 'Generate Content'}
            </Button>
          </CardContent>
        </Card>

        {generatedContent && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Generated Content</CardTitle>
                <Button onClick={copyContent} size="sm">
                  <Copy className="h-4 w-4 mr-2" />Copy
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea value={generatedContent} readOnly rows={15} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}