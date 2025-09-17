'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Keyboard, RotateCcw, Settings, Trophy, Target, Zap, BookOpen, Code, Globe } from 'lucide-react';
import { toast } from 'sonner';

interface TestResult {
  wpm: number;
  accuracy: number;
  time: number;
  errors: number;
  difficulty: string;
  category: string;
}

export default function TypingMaster() {
  // Text categories and difficulties
  const textCategories = {
    beginner: {
      name: 'Beginner',
      icon: BookOpen,
      texts: [
        "The quick brown fox jumps over the lazy dog.",
        "A journey of a thousand miles begins with a single step.",
        "Practice makes perfect when you keep trying every day."
      ]
    },
    intermediate: {
      name: 'Intermediate', 
      icon: Target,
      texts: [
        "Technology has revolutionized the way we communicate, work, and live our daily lives in the modern world.",
        "The art of programming requires patience, logical thinking, and continuous learning to master complex algorithms.",
        "Climate change is one of the most pressing challenges facing humanity in the twenty-first century."
      ]
    },
    advanced: {
      name: 'Advanced',
      icon: Zap,
      texts: [
        "Artificial intelligence and machine learning algorithms are transforming industries by automating complex decision-making processes and providing unprecedented insights into vast datasets.",
        "Quantum computing represents a paradigm shift in computational capabilities, promising to solve problems that are intractable for classical computers through quantum superposition and entanglement.",
        "The intersection of biotechnology and nanotechnology is opening new frontiers in medicine, enabling targeted drug delivery systems and personalized therapeutic interventions."
      ]
    },
    programming: {
      name: 'Programming',
      icon: Code,
      texts: [
        "function calculateSum(arr) { return arr.reduce((sum, num) => sum + num, 0); }",
        "const fetchData = async (url) => { try { const response = await fetch(url); return await response.json(); } catch (error) { console.error(error); } }",
        "class DataProcessor { constructor(data) { this.data = data; } process() { return this.data.filter(item => item.isValid).map(item => item.value); } }"
      ]
    },
    quotes: {
      name: 'Famous Quotes',
      icon: Globe,
      texts: [
        "The only way to do great work is to love what you do. - Steve Jobs",
        "Innovation distinguishes between a leader and a follower. - Steve Jobs",
        "Life is what happens to you while you're busy making other plans. - John Lennon"
      ]
    }
  };

  // State management
  const [selectedCategory, setSelectedCategory] = useState('beginner');
  const [selectedTextIndex, setSelectedTextIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [theme, setTheme] = useState('default');
  const [fontSize, setFontSize] = useState('medium');
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [timeLimit, setTimeLimit] = useState(0); // 0 = no limit
  const [timeElapsed, setTimeElapsed] = useState(0);

  const currentText = textCategories[selectedCategory as keyof typeof textCategories].texts[selectedTextIndex];

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStarted && !isCompleted) {
      interval = setInterval(() => {
        setTimeElapsed(prev => {
          const newTime = prev + 1;
          if (timeLimit > 0 && newTime >= timeLimit) {
            handleTimeUp();
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStarted, isCompleted, timeLimit]);

  const calculateStats = () => {
    if (!startTime) return;
    
    const timeElapsedMinutes = timeElapsed / 60;
    const wordsTyped = userInput.trim().split(' ').filter(word => word.length > 0).length;
    const currentWpm = timeElapsedMinutes > 0 ? Math.round(wordsTyped / timeElapsedMinutes) : 0;
    
    let correctChars = 0;
    let errorCount = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === currentText[i]) {
        correctChars++;
      } else {
        errorCount++;
      }
    }
    const currentAccuracy = userInput.length > 0 ? Math.round((correctChars / userInput.length) * 100) : 100;
    
    setWpm(currentWpm);
    setAccuracy(currentAccuracy);
    setErrors(errorCount);
  };

  useEffect(() => {
    if (isStarted) calculateStats();
  }, [userInput, timeElapsed, isStarted]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    if (!isStarted && value.length > 0) {
      setIsStarted(true);
      setStartTime(Date.now());
    }
    
    if (value.length <= currentText.length && !isCompleted) {
      setUserInput(value);
      
      if (value === currentText) {
        handleTestComplete();
      }
    }
  };

  const handleTestComplete = () => {
    setIsCompleted(true);
    setEndTime(Date.now());
    
    const result: TestResult = {
      wpm,
      accuracy,
      time: timeElapsed,
      errors,
      difficulty: selectedCategory,
      category: textCategories[selectedCategory as keyof typeof textCategories].name
    };
    
    setTestResults(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 results
    toast.success(`Test completed! WPM: ${wpm}, Accuracy: ${accuracy}%`);
  };

  const handleTimeUp = () => {
    setIsCompleted(true);
    setEndTime(Date.now());
    toast.info('Time up! Test completed.');
  };

  const reset = () => {
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setIsStarted(false);
    setIsCompleted(false);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setTimeElapsed(0);
  };

  const nextText = () => {
    const texts = textCategories[selectedCategory as keyof typeof textCategories].texts;
    setSelectedTextIndex((prev) => (prev + 1) % texts.length);
    reset();
  };

  const progress = (userInput.length / currentText.length) * 100;

  const getThemeClasses = () => {
    const themes = {
      default: 'bg-background',
      dark: 'bg-gray-900 text-white',
      blue: 'bg-blue-50',
      green: 'bg-green-50'
    };
    return themes[theme as keyof typeof themes] || themes.default;
  };

  const getFontSizeClass = () => {
    const sizes = {
      small: 'text-sm',
      medium: 'text-base',
      large: 'text-lg',
      xlarge: 'text-xl'
    };
    return sizes[fontSize as keyof typeof sizes] || sizes.medium;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`container mx-auto p-6 max-w-6xl ${getThemeClasses()}`}>
      <h1 className="text-3xl font-bold mb-8">Advanced Typing Master</h1>
      
      <Tabs defaultValue="test" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="test">Typing Test</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="keyboard">Keyboard</TabsTrigger>
        </TabsList>

        <TabsContent value="test" className="space-y-6">
          {/* Category Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Category & Difficulty</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(textCategories).map(([key, category]) => {
                  const Icon = category.icon;
                  return (
                    <Button
                      key={key}
                      variant={selectedCategory === key ? "default" : "outline"}
                      onClick={() => {
                        setSelectedCategory(key);
                        setSelectedTextIndex(0);
                        reset();
                      }}
                      className="h-20 flex-col gap-2"
                    >
                      <Icon className="h-6 w-6" />
                      <span className="text-xs">{category.name}</span>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Stats Display */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600">{wpm}</div>
                  <div className="text-sm text-muted-foreground">WPM</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">{accuracy}%</div>
                  <div className="text-sm text-muted-foreground">Accuracy</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-600">{Math.round(progress)}%</div>
                  <div className="text-sm text-muted-foreground">Progress</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-600">{errors}</div>
                  <div className="text-sm text-muted-foreground">Errors</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">{formatTime(timeElapsed)}</div>
                  <div className="text-sm text-muted-foreground">Time</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-indigo-600">
                    {timeLimit > 0 ? formatTime(Math.max(0, timeLimit - timeElapsed)) : '∞'}
                  </div>
                  <div className="text-sm text-muted-foreground">Remaining</div>
                </div>
              </div>
              
              <Progress value={progress} className="w-full mt-4" />
              {timeLimit > 0 && (
                <Progress value={(timeElapsed / timeLimit) * 100} className="w-full mt-2" />
              )}
            </CardContent>
          </Card>

          {/* Typing Area */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Keyboard className="h-5 w-5" />
                  Typing Test - {textCategories[selectedCategory as keyof typeof textCategories].name}
                </span>
                <Badge variant="outline">
                  Text {selectedTextIndex + 1} of {textCategories[selectedCategory as keyof typeof textCategories].texts.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`p-6 bg-muted rounded-lg font-mono leading-relaxed ${getFontSizeClass()}`}>
                {currentText.split('').map((char, index) => (
                  <span
                    key={index}
                    className={
                      index < userInput.length
                        ? userInput[index] === char
                          ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200'
                          : 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200'
                        : index === userInput.length
                        ? 'bg-blue-200 dark:bg-blue-800 animate-pulse'
                        : ''
                    }
                  >
                    {char === ' ' ? '·' : char}
                  </span>
                ))}
              </div>
              
              <textarea
                value={userInput}
                onChange={handleInputChange}
                placeholder="Start typing here..."
                className={`w-full h-32 p-4 border rounded-lg font-mono resize-none ${getFontSizeClass()}`}
                disabled={isCompleted || (timeLimit > 0 && timeElapsed >= timeLimit)}
                autoFocus
              />
              
              <div className="flex gap-2 flex-wrap">
                <Button onClick={reset} variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button onClick={nextText} variant="outline">
                  Next Text
                </Button>
                {isCompleted && (
                  <Button onClick={() => {
                    reset();
                    nextText();
                  }} className="bg-green-600 hover:bg-green-700">
                    <Trophy className="h-4 w-4 mr-2" />
                    Try Next
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Test Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Theme</label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="blue">Blue</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Font Size</label>
                  <Select value={fontSize} onValueChange={setFontSize}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                      <SelectItem value="xlarge">Extra Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time Limit (seconds)</label>
                  <Select value={timeLimit.toString()} onValueChange={(value) => setTimeLimit(Number(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No Limit</SelectItem>
                      <SelectItem value="60">1 Minute</SelectItem>
                      <SelectItem value="120">2 Minutes</SelectItem>
                      <SelectItem value="300">5 Minutes</SelectItem>
                      <SelectItem value="600">10 Minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Test Results History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {testResults.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No test results yet. Complete a test to see your progress!</p>
              ) : (
                <div className="space-y-4">
                  {testResults.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">{result.category}</Badge>
                        <div className="text-sm text-muted-foreground">
                          {formatTime(result.time)}
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <div className="font-bold text-blue-600">{result.wpm}</div>
                          <div className="text-xs text-muted-foreground">WPM</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-green-600">{result.accuracy}%</div>
                          <div className="text-xs text-muted-foreground">Accuracy</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-red-600">{result.errors}</div>
                          <div className="text-xs text-muted-foreground">Errors</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keyboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Keyboard className="h-5 w-5" />
                Virtual Keyboard Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-10 gap-1 text-xs font-mono">
                  {['1','2','3','4','5','6','7','8','9','0'].map(key => (
                    <div key={key} className="p-2 border rounded text-center">{key}</div>
                  ))}
                </div>
                <div className="grid grid-cols-10 gap-1 text-xs font-mono">
                  {['Q','W','E','R','T','Y','U','I','O','P'].map(key => (
                    <div key={key} className="p-2 border rounded text-center">{key}</div>
                  ))}
                </div>
                <div className="grid grid-cols-9 gap-1 text-xs font-mono">
                  {['A','S','D','F','G','H','J','K','L'].map(key => (
                    <div key={key} className="p-2 border rounded text-center">{key}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1 text-xs font-mono">
                  {['Z','X','C','V','B','N','M'].map(key => (
                    <div key={key} className="p-2 border rounded text-center">{key}</div>
                  ))}
                </div>
                <div className="flex justify-center">
                  <div className="p-2 border rounded text-center w-48 text-xs font-mono">SPACE</div>
                </div>
              </div>
              
              <div className="mt-6 space-y-2 text-sm">
                <h3 className="font-semibold">Typing Tips:</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Keep your fingers on the home row (ASDF JKL;)</li>
                  <li>Use all ten fingers for optimal speed</li>
                  <li>Maintain good posture while typing</li>
                  <li>Focus on accuracy first, speed will follow</li>
                  <li>Practice regularly for consistent improvement</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}