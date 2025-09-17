'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2 } from 'lucide-react';
import { toast } from 'sonner';

export default function TextToSpeech() {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('default');
  const [speed, setSpeed] = useState([1]);
  const [pitch, setPitch] = useState([1]);
  const [isPlaying, setIsPlaying] = useState(false);

  const voices = [
    { value: 'default', label: 'Default Voice' },
    { value: 'male', label: 'Male Voice' },
    { value: 'female', label: 'Female Voice' },
    { value: 'robot', label: 'Robot Voice' }
  ];

  const speak = () => {
    if (!text.trim()) {
      toast.error('Please enter text to speak');
      return;
    }

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = speed[0];
      utterance.pitch = pitch[0];
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      
      speechSynthesis.speak(utterance);
      toast.success('Playing text as speech');
    } else {
      toast.error('Speech synthesis not supported in this browser');
    }
  };

  const stop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Text to Speech</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Convert Text to Speech
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter text to convert to speech..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Voice</label>
              <Select value={voice} onValueChange={setVoice}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {voices.map(v => (
                    <SelectItem key={v.value} value={v.value}>{v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Speed: {speed[0]}</label>
              <Slider
                value={speed}
                onValueChange={setSpeed}
                min={0.5}
                max={2}
                step={0.1}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Pitch: {pitch[0]}</label>
              <Slider
                value={pitch}
                onValueChange={setPitch}
                min={0.5}
                max={2}
                step={0.1}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={speak} disabled={isPlaying} className="flex-1">
              <Play className="h-4 w-4 mr-2" />
              {isPlaying ? 'Playing...' : 'Play Speech'}
            </Button>
            <Button onClick={stop} variant="outline" disabled={!isPlaying}>
              <Pause className="h-4 w-4 mr-2" />
              Stop
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}