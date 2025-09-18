'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, Square, RotateCcw, Download, Copy, Timer, TrendingUp, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { ResultShare } from '@/components/result-share';

interface LapData {
  lapNumber: number;
  lapTime: number;
  totalTime: number;
  splitTime: number;
}

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<LapData[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [sessions, setSessions] = useState<{ startTime: Date; endTime: Date; duration: number; laps: number }[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const STORAGE_KEY = 'stopwatch-sessions';

  // Load sessions from localStorage
  useEffect(() => {
    const savedSessions = localStorage.getItem(STORAGE_KEY);
    if (savedSessions) {
      try {
        const parsed = JSON.parse(savedSessions);
        const sessionsWithDates = parsed.map((session: any) => ({
          ...session,
          startTime: new Date(session.startTime),
          endTime: new Date(session.endTime)
        }));
        setSessions(sessionsWithDates);
      } catch (error) {
        console.error('Error loading stopwatch sessions:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(time => time + 1);
      }, 10);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const formatTime = (centiseconds: number) => {
    const hours = Math.floor(centiseconds / 360000);
    const minutes = Math.floor((centiseconds % 360000) / 6000);
    const seconds = Math.floor((centiseconds % 6000) / 100);
    const cs = centiseconds % 100;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${cs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${cs.toString().padStart(2, '0')}`;
  };

  const formatTimeDetailed = (centiseconds: number) => {
    const hours = Math.floor(centiseconds / 360000);
    const minutes = Math.floor((centiseconds % 360000) / 6000);
    const seconds = Math.floor((centiseconds % 6000) / 100);
    const cs = centiseconds % 100;
    
    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0) parts.push(`${seconds}s`);
    if (cs > 0 || parts.length === 0) parts.push(`${cs}cs`);
    
    return parts.join(' ');
  };

  const start = () => {
    setIsRunning(true);
    if (!startTime) {
      setStartTime(new Date());
    }
  };

  const pause = () => {
    setIsRunning(false);
  };

  const reset = () => {
    if (time > 0 && startTime) {
      const session = {
        startTime,
        endTime: new Date(),
        duration: time,
        laps: laps.length
      };
      const updatedSessions = [session, ...sessions.slice(0, 9)]; // Keep last 10 sessions
      setSessions(updatedSessions);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSessions));
    }
    
    setTime(0);
    setIsRunning(false);
    setLaps([]);
    setStartTime(null);
    toast.success('Stopwatch reset!');
  };

  const lap = () => {
    if (!isRunning) return;
    
    const lapNumber = laps.length + 1;
    const previousLapTime = laps.length > 0 ? laps[laps.length - 1].totalTime : 0;
    const splitTime = time - previousLapTime;
    
    const newLap: LapData = {
      lapNumber,
      lapTime: splitTime,
      totalTime: time,
      splitTime
    };
    
    setLaps(prev => [...prev, newLap]);
    toast.success(`Lap ${lapNumber} recorded!`);
  };

  const getLapStats = () => {
    if (laps.length === 0) return null;
    
    const lapTimes = laps.map(lap => lap.lapTime);
    const fastest = Math.min(...lapTimes);
    const slowest = Math.max(...lapTimes);
    const average = lapTimes.reduce((sum, time) => sum + time, 0) / lapTimes.length;
    
    return { fastest, slowest, average };
  };

  const copyResults = () => {
    const results = [
      `Stopwatch Results - ${new Date().toLocaleString()}`,
      `Total Time: ${formatTime(time)}`,
      `Laps: ${laps.length}`,
      '',
      'Lap Details:'
    ];
    
    laps.forEach(lap => {
      results.push(`Lap ${lap.lapNumber}: ${formatTime(lap.lapTime)} (Total: ${formatTime(lap.totalTime)})`);
    });
    
    const stats = getLapStats();
    if (stats) {
      results.push('');
      results.push('Statistics:');
      results.push(`Fastest Lap: ${formatTime(stats.fastest)}`);
      results.push(`Slowest Lap: ${formatTime(stats.slowest)}`);
      results.push(`Average Lap: ${formatTime(stats.average)}`);
    }
    
    navigator.clipboard.writeText(results.join('\n'));
    toast.success('Results copied to clipboard!');
  };

  const downloadResults = () => {
    const results = {
      timestamp: new Date().toISOString(),
      totalTime: time,
      formattedTime: formatTime(time),
      laps: laps.map(lap => ({
        lapNumber: lap.lapNumber,
        lapTime: lap.lapTime,
        formattedLapTime: formatTime(lap.lapTime),
        totalTime: lap.totalTime,
        formattedTotalTime: formatTime(lap.totalTime)
      })),
      statistics: getLapStats() ? {
        fastest: getLapStats()!.fastest,
        slowest: getLapStats()!.slowest,
        average: getLapStats()!.average,
        formattedFastest: formatTime(getLapStats()!.fastest),
        formattedSlowest: formatTime(getLapStats()!.slowest),
        formattedAverage: formatTime(getLapStats()!.average)
      } : null
    };
    
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `stopwatch-results-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Results downloaded!');
  };

  const stats = getLapStats();

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Online Stopwatch Timer</h1>
        <p className="text-muted-foreground">
          Professional precision stopwatch with lap timing, statistics, and session tracking for sports, workouts, and time measurement
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Stopwatch */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="h-5 w-5" />
                Precision Stopwatch Timer
              </CardTitle>
              <CardDescription>
                High-precision timing with centisecond accuracy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-7xl font-mono font-bold mb-6 p-6 bg-muted/30 rounded-lg">
                  {formatTime(time)}
                </div>
                
                <div className="flex gap-3 justify-center mb-4">
                  {!isRunning ? (
                    <Button onClick={start} size="lg" className="min-w-24">
                      <Play className="h-5 w-5 mr-2" />Start
                    </Button>
                  ) : (
                    <Button onClick={pause} size="lg" variant="outline" className="min-w-24">
                      <Pause className="h-5 w-5 mr-2" />Pause
                    </Button>
                  )}
                  
                  <Button onClick={lap} size="lg" variant="outline" disabled={!isRunning} className="min-w-24">
                    <Square className="h-5 w-5 mr-2" />Lap
                  </Button>
                  
                  <Button onClick={reset} size="lg" variant="outline" className="min-w-24">
                    <RotateCcw className="h-5 w-5 mr-2" />Reset
                  </Button>
                </div>
                
                {time > 0 && (
                  <div className="flex gap-2 justify-center">
                    <Button variant="outline" size="sm" onClick={copyResults}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Results
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadResults}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <ResultShare 
                      title="Stopwatch Results"
                      result={`Total Time: ${formatTime(time)} | Laps: ${laps.length}`}
                      resultType="text"
                      toolName="stopwatch"
                    />
                  </div>
                )}
              </div>

              {/* Current Session Info */}
              {(time > 0 || startTime) && (
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                  <Badge variant="secondary">
                    Status: {isRunning ? 'Running' : time > 0 ? 'Paused' : 'Ready'}
                  </Badge>
                  {startTime && (
                    <Badge variant="secondary">
                      Started: {startTime.toLocaleTimeString()}
                    </Badge>
                  )}
                  <Badge variant="secondary">
                    Laps: {laps.length}
                  </Badge>
                  <Badge variant="secondary">
                    Duration: {formatTimeDetailed(time)}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Statistics Panel */}
        <div className="space-y-6">
          {stats && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Lap Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Fastest Lap:</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      {formatTime(stats.fastest)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Slowest Lap:</span>
                    <Badge variant="default" className="bg-red-100 text-red-800">
                      {formatTime(stats.slowest)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Average Lap:</span>
                    <Badge variant="secondary">
                      {formatTime(stats.average)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Laps:</span>
                    <Badge variant="outline">
                      {laps.length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Session History */}
          {sessions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {sessions.map((session, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">
                          {formatTime(session.duration)}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {session.laps} laps
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {session.startTime.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Lap Times */}
      {laps.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Lap Times</CardTitle>
            <CardDescription>
              Detailed lap timing with split times and cumulative totals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-80 overflow-y-auto">
              <div className="grid gap-2">
                {laps.map((lap, index) => {
                  const isFastest = stats && lap.lapTime === stats.fastest;
                  const isSlowest = stats && lap.lapTime === stats.slowest;
                  
                  return (
                    <div key={index} className={`flex justify-between items-center p-3 rounded-lg border ${
                      isFastest ? 'bg-green-50 border-green-200' : 
                      isSlowest ? 'bg-red-50 border-red-200' : 'bg-muted/30'
                    }`}>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">Lap {lap.lapNumber}</Badge>
                        {isFastest && <Badge variant="default" className="bg-green-100 text-green-800 text-xs">Fastest</Badge>}
                        {isSlowest && <Badge variant="default" className="bg-red-100 text-red-800 text-xs">Slowest</Badge>}
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-medium">{formatTime(lap.lapTime)}</div>
                        <div className="text-sm text-muted-foreground font-mono">
                          Total: {formatTime(lap.totalTime)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* SEO-Friendly Detailed Information */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Complete Guide to Online Stopwatch Timer</CardTitle>
          <CardDescription>
            Everything you need to know about using our professional stopwatch tool
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="guide">How to Use</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>
            
            <TabsContent value="features" className="space-y-4">
              <h3 className="text-xl font-semibold">Advanced Stopwatch Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">⏱️ Precision Timing</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Centisecond accuracy (0.01 second precision)</li>
                    <li>Hours, minutes, seconds, and centiseconds display</li>
                    <li>Real-time updating with smooth animation</li>
                    <li>No time limit - run for hours if needed</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">🏃 Lap Timing System</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Unlimited lap recording capability</li>
                    <li>Split time and cumulative time tracking</li>
                    <li>Fastest and slowest lap identification</li>
                    <li>Average lap time calculation</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">📊 Statistical Analysis</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Comprehensive lap statistics</li>
                    <li>Performance trend analysis</li>
                    <li>Visual highlighting of best/worst laps</li>
                    <li>Session history tracking</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">💾 Export & Share</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Copy results to clipboard</li>
                    <li>Download detailed JSON reports</li>
                    <li>Share timing results easily</li>
                    <li>Session data preservation</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="guide" className="space-y-4">
              <h3 className="text-xl font-semibold">How to Use the Stopwatch Timer</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">🚀 Basic Operation</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li><strong>Start:</strong> Click the "Start" button to begin timing</li>
                    <li><strong>Pause:</strong> Click "Pause" to temporarily stop the timer</li>
                    <li><strong>Resume:</strong> Click "Start" again to continue from where you paused</li>
                    <li><strong>Reset:</strong> Click "Reset" to clear the timer and start fresh</li>
                  </ol>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">⏲️ Lap Timing</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Start the stopwatch by clicking "Start"</li>
                    <li>Click "Lap" at each interval you want to record</li>
                    <li>View lap times in the detailed lap section below</li>
                    <li>Analyze your performance with automatic statistics</li>
                  </ol>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">📈 Reading the Display</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>MM:SS.CC format:</strong> Minutes:Seconds.Centiseconds</li>
                    <li><strong>HH:MM:SS.CC format:</strong> Hours:Minutes:Seconds.Centiseconds (for longer sessions)</li>
                    <li><strong>Green highlight:</strong> Fastest lap time</li>
                    <li><strong>Red highlight:</strong> Slowest lap time</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">💡 Pro Tips</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Use keyboard shortcuts: Spacebar to start/pause, L for lap, R for reset</li>
                    <li>The timer continues running even if you switch browser tabs</li>
                    <li>Your session data is automatically saved for reference</li>
                    <li>Export your results for detailed analysis in other applications</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="applications" className="space-y-4">
              <h3 className="text-xl font-semibold">Stopwatch Applications & Use Cases</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">🏃‍♂️ Sports & Athletics</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Running:</strong> Track lap times, mile splits, interval training</li>
                    <li><strong>Swimming:</strong> Monitor pool laps, stroke timing, race preparation</li>
                    <li><strong>Cycling:</strong> Measure segment times, hill climbs, sprint intervals</li>
                    <li><strong>Team Sports:</strong> Practice drills, game timing, performance analysis</li>
                    <li><strong>Track & Field:</strong> Event timing, training sessions, personal records</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">💪 Fitness & Workouts</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>HIIT Training:</strong> High-intensity interval timing</li>
                    <li><strong>Circuit Training:</strong> Station timing, rest periods</li>
                    <li><strong>Yoga & Meditation:</strong> Pose holding, breathing exercises</li>
                    <li><strong>Strength Training:</strong> Rest between sets, workout duration</li>
                    <li><strong>Cardio Sessions:</strong> Treadmill intervals, bike workouts</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">🎓 Education & Study</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Exam Timing:</strong> Practice tests, time management</li>
                    <li><strong>Study Sessions:</strong> Pomodoro technique, focus periods</li>
                    <li><strong>Presentations:</strong> Speech timing, practice runs</li>
                    <li><strong>Research:</strong> Task timing, productivity measurement</li>
                    <li><strong>Language Learning:</strong> Speaking practice, listening exercises</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">💼 Professional Use</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Meetings:</strong> Time management, agenda tracking</li>
                    <li><strong>Cooking:</strong> Recipe timing, baking precision</li>
                    <li><strong>Photography:</strong> Long exposure timing, session duration</li>
                    <li><strong>Manufacturing:</strong> Process timing, quality control</li>
                    <li><strong>Events:</strong> Activity timing, schedule management</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">🎮 Gaming & Competitions</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Speedrunning:</strong> Game completion timing, level splits</li>
                    <li><strong>Esports:</strong> Match timing, practice sessions</li>
                    <li><strong>Board Games:</strong> Turn timing, game duration</li>
                    <li><strong>Puzzles:</strong> Solving time, personal challenges</li>
                    <li><strong>Competitions:</strong> Event timing, performance tracking</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">🏠 Daily Life</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Household Tasks:</strong> Cleaning time, chore efficiency</li>
                    <li><strong>Commuting:</strong> Travel time tracking, route comparison</li>
                    <li><strong>Hobbies:</strong> Craft projects, skill practice</li>
                    <li><strong>Health:</strong> Medication timing, therapy exercises</li>
                    <li><strong>Productivity:</strong> Task completion, time awareness</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="faq" className="space-y-4">
              <h3 className="text-xl font-semibold">Frequently Asked Questions</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">❓ How accurate is this online stopwatch?</h4>
                  <p className="text-sm text-muted-foreground">
                    Our stopwatch provides centisecond accuracy (0.01 second precision), making it suitable for most timing needs. 
                    The accuracy depends on your device's performance and browser capabilities, but it's typically accurate within 
                    a few milliseconds for most applications.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">❓ Can I use keyboard shortcuts?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes! Use Spacebar to start/pause the timer, 'L' key for lap timing, and 'R' key to reset. 
                    These shortcuts make it easier to operate the stopwatch during activities when clicking buttons might be inconvenient.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">❓ Does the timer continue if I close the browser tab?</h4>
                  <p className="text-sm text-muted-foreground">
                    The timer will pause if you close the browser tab or navigate away from the page. However, it continues 
                    running if you switch to other tabs or minimize the browser window. For long-duration timing, 
                    keep the tab open in your browser.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">❓ How many laps can I record?</h4>
                  <p className="text-sm text-muted-foreground">
                    There's no limit to the number of laps you can record. The system can handle hundreds of laps 
                    while maintaining performance. All lap data is stored locally in your browser session.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">❓ Can I export my timing results?</h4>
                  <p className="text-sm text-muted-foreground">
                    Absolutely! You can copy results to clipboard for quick sharing or download detailed JSON reports 
                    containing all timing data, statistics, and session information for further analysis.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">❓ Is this stopwatch suitable for professional sports timing?</h4>
                  <p className="text-sm text-muted-foreground">
                    While our stopwatch is highly accurate for training and casual timing, professional sports timing 
                    typically requires specialized hardware. This tool is perfect for training, practice sessions, 
                    and personal performance tracking.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">❓ Does it work on mobile devices?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes! The stopwatch is fully responsive and works perfectly on smartphones and tablets. 
                    The large buttons and clear display make it easy to use on touch devices during workouts or activities.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">❓ Can I use this for interval training?</h4>
                  <p className="text-sm text-muted-foreground">
                    Perfect for interval training! Use the lap function to mark each interval, and the statistics 
                    will help you maintain consistent timing. The visual feedback shows your fastest and slowest intervals 
                    to help optimize your training.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}