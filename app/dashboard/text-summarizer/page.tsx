'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Copy, Download, RotateCcw, Zap, Target, List } from 'lucide-react';
import { toast } from 'sonner';

export default function TextSummarizer() {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [summaryMethod, setSummaryMethod] = useState('extractive');
  const [summaryLength, setSummaryLength] = useState([30]); // percentage
  const [processing, setProcessing] = useState(false);

  const getWordFrequency = (text: string) => {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const frequency: { [key: string]: number } = {};
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them']);
    
    words.forEach(word => {
      if (!stopWords.has(word) && word.length > 2) {
        frequency[word] = (frequency[word] || 0) + 1;
      }
    });
    
    return frequency;
  };

  const scoreSentences = (sentences: string[], wordFreq: { [key: string]: number }) => {
    return sentences.map(sentence => {
      const words = sentence.toLowerCase().match(/\b\w+\b/g) || [];
      const score = words.reduce((sum, word) => sum + (wordFreq[word] || 0), 0);
      return { sentence: sentence.trim(), score, length: words.length };
    }).filter(item => item.length > 5); // Filter out very short sentences
  };

  const extractiveSummarization = (text: string, targetLength: number) => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length <= 2) return text;
    
    const wordFreq = getWordFrequency(text);
    const scoredSentences = scoreSentences(sentences, wordFreq);
    
    // Sort by score and select top sentences
    const topSentences = scoredSentences
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.max(1, Math.floor(sentences.length * targetLength / 100)))
      .sort((a, b) => sentences.indexOf(a.sentence) - sentences.indexOf(b.sentence));
    
    return topSentences.map(item => item.sentence).join('. ') + '.';
  };

  const abstractiveSummarization = (text: string, targetLength: number) => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length <= 2) return text;
    
    // Simple abstractive approach: combine key phrases
    const wordFreq = getWordFrequency(text);
    const keyWords = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
    
    const keySentences = sentences.filter(sentence => 
      keyWords.some(word => sentence.toLowerCase().includes(word))
    );
    
    const numSentences = Math.max(1, Math.floor(keySentences.length * targetLength / 100));
    return keySentences.slice(0, numSentences).join('. ') + '.';
  };

  const bulletPointSummarization = (text: string, targetLength: number) => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length <= 2) return text;
    
    const wordFreq = getWordFrequency(text);
    const scoredSentences = scoreSentences(sentences, wordFreq);
    
    const topSentences = scoredSentences
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.max(1, Math.floor(sentences.length * targetLength / 100)));
    
    return topSentences.map(item => `• ${item.sentence.trim()}`).join('\n');
  };

  const summarizeText = async () => {
    if (!inputText.trim()) {
      toast.error('Please enter text to summarize');
      return;
    }

    if (inputText.trim().split(' ').length < 10) {
      toast.error('Text is too short to summarize. Please enter at least 10 words.');
      return;
    }

    setProcessing(true);
    
    try {
      let result = '';
      const targetLength = summaryLength[0];
      
      switch (summaryMethod) {
        case 'extractive':
          result = extractiveSummarization(inputText, targetLength);
          break;
        case 'abstractive':
          result = abstractiveSummarization(inputText, targetLength);
          break;
        case 'bullets':
          result = bulletPointSummarization(inputText, targetLength);
          break;
        default:
          result = extractiveSummarization(inputText, targetLength);
      }
      
      setSummary(result);
      toast.success('Text summarized successfully!');
    } catch (error) {
      toast.error('Failed to summarize text. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const copyToClipboard = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary);
    toast.success('Summary copied to clipboard!');
  };

  const downloadSummary = () => {
    if (!summary) return;
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'text-summary.txt';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Summary downloaded!');
  };

  const clearAll = () => {
    setInputText('');
    setSummary('');
  };

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const getCharacterCount = (text: string) => {
    return text.length;
  };

  const getCompressionRatio = () => {
    if (!inputText || !summary) return 0;
    const originalWords = getWordCount(inputText);
    const summaryWords = getWordCount(summary);
    return Math.round((1 - summaryWords / originalWords) * 100);
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">AI Text Summarizer</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Input Text
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your text here to summarize... (minimum 10 words)"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={12}
              className="resize-none"
            />
            
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex gap-4">
                <span>{getWordCount(inputText)} words</span>
                <span>{getCharacterCount(inputText)} characters</span>
              </div>
              {inputText && (
                <Button variant="ghost" size="sm" onClick={clearAll}>
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Controls & Output Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Summarization Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Method Selection */}
            <Tabs value={summaryMethod} onValueChange={setSummaryMethod}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="extractive" className="flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  <span className="hidden sm:inline">Extractive</span>
                </TabsTrigger>
                <TabsTrigger value="abstractive" className="flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  <span className="hidden sm:inline">Abstractive</span>
                </TabsTrigger>
                <TabsTrigger value="bullets" className="flex items-center gap-1">
                  <List className="h-3 w-3" />
                  <span className="hidden sm:inline">Bullets</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="extractive" className="text-sm text-muted-foreground">
                Selects the most important sentences from the original text
              </TabsContent>
              <TabsContent value="abstractive" className="text-sm text-muted-foreground">
                Creates new sentences based on key concepts
              </TabsContent>
              <TabsContent value="bullets" className="text-sm text-muted-foreground">
                Presents key points as bullet points
              </TabsContent>
            </Tabs>

            {/* Length Control */}
            <div className="space-y-3">
              <label className="text-sm font-medium">
                Summary Length: {summaryLength[0]}% of original
              </label>
              <Slider
                value={summaryLength}
                onValueChange={setSummaryLength}
                max={80}
                min={10}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Very Short</span>
                <span>Balanced</span>
                <span>Detailed</span>
              </div>
            </div>

            {/* Action Button */}
            <Button 
              onClick={summarizeText} 
              className="w-full" 
              disabled={processing || !inputText.trim()}
            >
              {processing ? 'Summarizing...' : 'Generate Summary'}
            </Button>

            {/* Summary Output */}
            {summary && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Summary</h3>
                  <div className="flex gap-2">
                    <Badge variant="secondary">
                      {getCompressionRatio()}% shorter
                    </Badge>
                    <Badge variant="outline">
                      {getWordCount(summary)} words
                    </Badge>
                  </div>
                </div>
                
                <div className="p-4 bg-muted rounded-lg max-h-64 overflow-y-auto">
                  <div className="whitespace-pre-line text-sm leading-relaxed">
                    {summary}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadSummary}>
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Tips Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Extractive
              </h4>
              <p className="text-muted-foreground">
                Best for: Academic papers, news articles, formal documents. 
                Preserves original wording and maintains accuracy.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Abstractive
              </h4>
              <p className="text-muted-foreground">
                Best for: Creative content, blogs, general text. 
                Creates more natural, flowing summaries.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <List className="h-4 w-4" />
                Bullet Points
              </h4>
              <p className="text-muted-foreground">
                Best for: Meeting notes, reports, quick overviews. 
                Presents information in easy-to-scan format.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}