'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Copy, FileText, RefreshCw, Download } from 'lucide-react';
import { toast } from 'sonner';

export default function LoremGenerator() {
  const [generatedText, setGeneratedText] = useState('');
  const [paragraphCount, setParagraphCount] = useState(3);
  const [wordCount, setWordCount] = useState(50);
  const [sentenceCount, setSentenceCount] = useState(5);
  const [startWithLorem, setStartWithLorem] = useState(true);

  const loremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'at', 'vero', 'eos',
    'accusamus', 'accusantium', 'doloremque', 'laudantium', 'totam', 'rem',
    'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo', 'inventore', 'veritatis',
    'et', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta', 'sunt', 'explicabo'
  ];

  const generateWords = (count: number) => {
    const words = [];
    for (let i = 0; i < count; i++) {
      words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
    }
    return words.join(' ');
  };

  const generateSentence = () => {
    const length = Math.floor(Math.random() * 10) + 8; // 8-17 words per sentence
    const sentence = generateWords(length);
    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
  };

  const generateParagraph = (isFirst = false) => {
    const sentences = [];
    const sentenceCount = Math.floor(Math.random() * 4) + 3; // 3-6 sentences per paragraph
    for (let i = 0; i < sentenceCount; i++) {
      if (isFirst && i === 0 && startWithLorem) {
        sentences.push('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
      } else {
        sentences.push(generateSentence());
      }
    }
    return sentences.join(' ');
  };

  const generateParagraphs = () => {
    if (paragraphCount < 1 || paragraphCount > 50) {
      toast.error('Please enter a number between 1 and 50');
      return;
    }

    const paragraphs = [];
    for (let i = 0; i < paragraphCount; i++) {
      paragraphs.push(generateParagraph(i === 0));
    }
    setGeneratedText(paragraphs.join('\n\n'));
    toast.success(`Generated ${paragraphCount} paragraph(s)!`);
  };

  const generateWordList = () => {
    if (wordCount < 1 || wordCount > 1000) {
      toast.error('Please enter a number between 1 and 1000');
      return;
    }

    const text = generateWords(wordCount);
    setGeneratedText(text);
    toast.success(`Generated ${wordCount} words!`);
  };

  const generateSentences = () => {
    if (sentenceCount < 1 || sentenceCount > 100) {
      toast.error('Please enter a number between 1 and 100');
      return;
    }

    const sentences = [];
    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(generateSentence());
    }
    setGeneratedText(sentences.join(' '));
    toast.success(`Generated ${sentenceCount} sentence(s)!`);
  };

  const copyToClipboard = () => {
    if (!generatedText) return;
    navigator.clipboard.writeText(generatedText);
    toast.success('Text copied to clipboard!');
  };

  const clearText = () => {
    setGeneratedText('');
  };

  const downloadText = () => {
    if (!generatedText) return;
    const blob = new Blob([generatedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'lorem-ipsum.txt';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Text file downloaded!');
  };

  const quickGenerate = (type: 'short' | 'medium' | 'long') => {
    switch (type) {
      case 'short':
        setParagraphCount(2);
        generateParagraphs();
        break;
      case 'medium':
        setParagraphCount(5);
        generateParagraphs();
        break;
      case 'long':
        setParagraphCount(10);
        generateParagraphs();
        break;
    }
  };

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).length;
  };

  const getCharacterCount = (text: string) => {
    return text.length;
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Lorem Ipsum Generator</h1>
        <p className="text-muted-foreground">
          Generate placeholder text for your designs and layouts
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate Lorem Ipsum
          </CardTitle>
          <CardDescription>
            Choose the type and amount of placeholder text to generate
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Generate Options */}
          <div className="space-y-3">
            <h3 className="font-medium">Quick Generate</h3>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={() => quickGenerate('short')}>
                Short (2 paragraphs)
              </Button>
              <Button variant="outline" size="sm" onClick={() => quickGenerate('medium')}>
                Medium (5 paragraphs)
              </Button>
              <Button variant="outline" size="sm" onClick={() => quickGenerate('long')}>
                Long (10 paragraphs)
              </Button>
            </div>
          </div>

          <Tabs defaultValue="paragraphs">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="paragraphs">Paragraphs</TabsTrigger>
              <TabsTrigger value="words">Words</TabsTrigger>
              <TabsTrigger value="sentences">Sentences</TabsTrigger>
            </TabsList>
            
            <TabsContent value="paragraphs" className="space-y-4">
              <div className="space-y-4">
                <div className="flex gap-4 items-end">
                  <div className="space-y-2 flex-1">
                    <label className="text-sm font-medium">Number of Paragraphs</label>
                    <Input
                      type="number"
                      min="1"
                      max="50"
                      value={paragraphCount}
                      onChange={(e) => setParagraphCount(parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <Button onClick={generateParagraphs}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Generate
                  </Button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="start-lorem"
                    checked={startWithLorem}
                    onChange={(e) => setStartWithLorem(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="start-lorem" className="text-sm">
                    Start with "Lorem ipsum dolor sit amet..."
                  </label>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="words" className="space-y-4">
              <div className="flex gap-4 items-end">
                <div className="space-y-2 flex-1">
                  <label className="text-sm font-medium">Number of Words</label>
                  <Input
                    type="number"
                    min="1"
                    max="1000"
                    value={wordCount}
                    onChange={(e) => setWordCount(parseInt(e.target.value) || 1)}
                  />
                </div>
                <Button onClick={generateWordList}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="sentences" className="space-y-4">
              <div className="flex gap-4 items-end">
                <div className="space-y-2 flex-1">
                  <label className="text-sm font-medium">Number of Sentences</label>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={sentenceCount}
                    onChange={(e) => setSentenceCount(parseInt(e.target.value) || 1)}
                  />
                </div>
                <Button onClick={generateSentences}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {generatedText && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                Generated Text
                <div className="flex gap-2">
                  <Badge variant="secondary">
                    {getWordCount(generatedText)} words
                  </Badge>
                  <Badge variant="secondary">
                    {getCharacterCount(generatedText)} characters
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={downloadText}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" size="sm" onClick={clearText}>
                  Clear
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={generatedText}
              readOnly
              rows={15}
              className="resize-none font-mono text-sm"
              placeholder="Generated text will appear here..."
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}