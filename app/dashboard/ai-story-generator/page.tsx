'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Copy } from 'lucide-react';
import { toast } from 'sonner';

export default function AIStoryGenerator() {
  const [genre, setGenre] = useState('adventure');
  const [characters, setCharacters] = useState('');
  const [setting, setSetting] = useState('');
  const [generatedStory, setGeneratedStory] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const genres = [
    { value: 'adventure', label: 'Adventure' },
    { value: 'mystery', label: 'Mystery' },
    { value: 'romance', label: 'Romance' },
    { value: 'scifi', label: 'Science Fiction' },
    { value: 'fantasy', label: 'Fantasy' },
    { value: 'horror', label: 'Horror' }
  ];

  const generateStory = async () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const story = `# ${genre.charAt(0).toUpperCase() + genre.slice(1)} Story

## Characters
${characters || 'A brave hero and their loyal companion'}

## Setting
${setting || 'A mysterious land filled with ancient secrets'}

## The Story

Once upon a time, in ${setting || 'a land far away'}, there lived ${characters || 'a brave adventurer'}. 

The ${genre} began when our protagonist discovered something extraordinary that would change their life forever. As they embarked on this incredible journey, they faced numerous challenges that tested their courage and determination.

Through trials and tribulations, our hero learned valuable lessons about friendship, bravery, and the power of believing in oneself. The adventure took unexpected turns, leading to discoveries that no one could have imagined.

In the end, ${characters || 'the hero'} emerged victorious, having grown stronger and wiser from their experiences. The ${setting || 'land'} was forever changed, and peace was restored.

*This is a demo AI story generator. Real implementation would use advanced AI models to create more detailed and creative stories.*

## The End

What an incredible ${genre} that was! The journey of ${characters || 'our hero'} will be remembered for generations to come.`;

      setGeneratedStory(story);
      setIsGenerating(false);
      toast.success('Story generated!');
    }, 3000);
  };

  const copyStory = () => {
    navigator.clipboard.writeText(generatedStory);
    toast.success('Story copied!');
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">AI Story Generator</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Generate Stories with AI
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Genre</label>
              <Select value={genre} onValueChange={setGenre}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {genres.map(g => (
                    <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Main Characters</label>
              <Input
                placeholder="e.g., A young wizard named Alex"
                value={characters}
                onChange={(e) => setCharacters(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Setting</label>
              <Input
                placeholder="e.g., A magical forest in medieval times"
                value={setting}
                onChange={(e) => setSetting(e.target.value)}
              />
            </div>

            <Button onClick={generateStory} disabled={isGenerating} className="w-full">
              {isGenerating ? 'Generating Story...' : 'Generate Story'}
            </Button>
          </CardContent>
        </Card>

        {generatedStory && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Generated Story</CardTitle>
                <Button onClick={copyStory} size="sm">
                  <Copy className="h-4 w-4 mr-2" />Copy
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea value={generatedStory} readOnly rows={20} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}