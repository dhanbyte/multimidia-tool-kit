'use client';

import { useState, useMemo } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

export default function TextStatistics() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    if (!text) return null;

    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    
    // Word frequency
    const wordFreq: { [key: string]: number } = {};
    words.forEach(word => {
      const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
      if (cleanWord) {
        wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1;
      }
    });

    const topWords = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);

    // Character frequency
    const charFreq: { [key: string]: number } = {};
    text.toLowerCase().split('').forEach(char => {
      if (char.match(/[a-z]/)) {
        charFreq[char] = (charFreq[char] || 0) + 1;
      }
    });

    const avgWordsPerSentence = sentences.length > 0 ? (words.length / sentences.length).toFixed(1) : '0';
    const avgCharsPerWord = words.length > 0 ? (text.replace(/\s/g, '').length / words.length).toFixed(1) : '0';

    return {
      characters: text.length,
      charactersNoSpaces: text.replace(/\s/g, '').length,
      words: words.length,
      sentences: sentences.length,
      paragraphs: paragraphs.length,
      avgWordsPerSentence,
      avgCharsPerWord,
      topWords,
      charFreq: Object.entries(charFreq).sort(([,a], [,b]) => b - a).slice(0, 5)
    };
  }, [text]);

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Text Statistics</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input Text</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Enter or paste your text here for analysis..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={15}
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Basic Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted rounded">
                    <div className="text-2xl font-bold">{stats.characters}</div>
                    <div className="text-sm text-muted-foreground">Characters</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded">
                    <div className="text-2xl font-bold">{stats.charactersNoSpaces}</div>
                    <div className="text-sm text-muted-foreground">No Spaces</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded">
                    <div className="text-2xl font-bold">{stats.words}</div>
                    <div className="text-sm text-muted-foreground">Words</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded">
                    <div className="text-2xl font-bold">{stats.sentences}</div>
                    <div className="text-sm text-muted-foreground">Sentences</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded">
                    <div className="text-2xl font-bold">{stats.paragraphs}</div>
                    <div className="text-sm text-muted-foreground">Paragraphs</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded">
                    <div className="text-2xl font-bold">{stats.avgWordsPerSentence}</div>
                    <div className="text-sm text-muted-foreground">Avg Words/Sentence</div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Enter text to see statistics
                </p>
              )}
            </CardContent>
          </Card>

          {stats && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Most Frequent Words</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {stats.topWords.map(([word, count], index) => (
                      <div key={word} className="flex justify-between items-center">
                        <span className="font-mono">{word}</span>
                        <span className="text-sm text-muted-foreground">{count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Character Frequency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {stats.charFreq.map(([char, count], index) => (
                      <div key={char} className="flex justify-between items-center">
                        <span className="font-mono">{char.toUpperCase()}</span>
                        <span className="text-sm text-muted-foreground">{count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}