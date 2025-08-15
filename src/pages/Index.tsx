import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { ProcessingStatus } from '@/components/ProcessingStatus';
import { MoodDisplay } from '@/components/MoodDisplay';
import { EmotionChart } from '@/components/EmotionChart';
import { Button } from '@/components/ui/button';
import { RotateCcw, Music } from 'lucide-react';
import { toast } from 'sonner';

interface EmotionDataPoint {
  time: number;
  emotion: string;
  score: number;
  valence?: number;
  arousal?: number;
}

interface MoodData {
  emotion: string;
  confidence: number;
  valence?: number;
  arousal?: number;
  tags?: string[];
}

interface AnalysisResult {
  mood: MoodData;
  timeline: EmotionDataPoint[];
  fileName: string;
}

// Mock data for demonstration
const mockAnalysisResult: AnalysisResult = {
  mood: {
    emotion: "Energetic",
    confidence: 0.87,
    valence: 0.78,
    arousal: 0.84,
    tags: ["upbeat", "electronic", "dance", "high-energy", "modern"]
  },
  timeline: [
    { time: 0, emotion: "Calm", score: 0.6, valence: 0.5, arousal: 0.3 },
    { time: 15, emotion: "Excited", score: 0.7, valence: 0.7, arousal: 0.6 },
    { time: 30, emotion: "Energetic", score: 0.9, valence: 0.8, arousal: 0.9 },
    { time: 45, emotion: "Energetic", score: 0.85, valence: 0.75, arousal: 0.85 },
    { time: 60, emotion: "Happy", score: 0.8, valence: 0.9, arousal: 0.7 },
    { time: 75, emotion: "Energetic", score: 0.95, valence: 0.8, arousal: 0.95 },
    { time: 90, emotion: "Excited", score: 0.75, valence: 0.7, arousal: 0.8 },
    { time: 105, emotion: "Energetic", score: 0.88, valence: 0.8, arousal: 0.9 },
    { time: 120, emotion: "Happy", score: 0.82, valence: 0.85, arousal: 0.6 },
    { time: 135, emotion: "Calm", score: 0.65, valence: 0.6, arousal: 0.4 }
  ],
  fileName: "Your uploaded track"
};

const Index = () => {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'complete' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  const handleFileSelect = async (file: File) => {
    setCurrentFile(file);
    setStatus('uploading');
    setProgress(0);
    
    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          handleProcessing(file);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleProcessing = async (file: File) => {
    setStatus('processing');
    setProgress(0);
    
    // Simulate processing with random progress updates
    const processingInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(processingInterval);
          handleComplete(file);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 500);
  };

  const handleComplete = (file: File) => {
    setStatus('complete');
    
    // Set mock result with actual filename
    const result = {
      ...mockAnalysisResult,
      fileName: file.name
    };
    
    setAnalysisResult(result);
    toast.success("Analysis complete! Your music's emotional journey has been mapped.");
    
    setTimeout(() => {
      setStatus('idle');
    }, 2000);
  };

  const handleReset = () => {
    setStatus('idle');
    setProgress(0);
    setAnalysisResult(null);
    setCurrentFile(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/30 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center glow-primary">
                <Music className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-audio bg-clip-text text-transparent">
                  Music Mood Visualizer
                </h1>
                <p className="text-sm text-muted-foreground">
                  AI-powered emotional analysis of your music
                </p>
              </div>
            </div>
            
            {analysisResult && (
              <Button 
                onClick={handleReset}
                variant="outline"
                className="border-border/50 hover:glow-primary"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Analyze New Track
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {!analysisResult ? (
          <>
            {/* Upload Section */}
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold">Discover Your Music's Emotions</h2>
                <p className="text-lg text-muted-foreground">
                  Upload any audio file and watch as our AI reveals the emotional journey within your music.
                  From energetic beats to melancholic melodies, see how emotions flow through time.
                </p>
              </div>
              
              <FileUpload 
                onFileSelect={handleFileSelect}
                isProcessing={status !== 'idle'}
              />
            </div>

            {/* Processing Status */}
            {status !== 'idle' && (
              <div className="max-w-2xl mx-auto">
                <ProcessingStatus 
                  status={status}
                  progress={progress}
                />
              </div>
            )}
          </>
        ) : (
          /* Results Section */
          <div className="space-y-8">
            {/* Main Mood Display */}
            <div className="max-w-4xl mx-auto">
              <MoodDisplay 
                mood={analysisResult.mood}
                fileName={analysisResult.fileName}
              />
            </div>

            {/* Emotion Timeline Chart */}
            <div className="max-w-6xl mx-auto">
              <EmotionChart 
                data={analysisResult.timeline}
                mainEmotion={analysisResult.mood.emotion}
              />
            </div>

            {/* Insights Section */}
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 gradient-surface rounded-lg border border-border/50">
                <h3 className="font-semibold text-accent mb-2">Peak Emotion</h3>
                <p className="text-2xl font-bold text-emotion-energetic">
                  {Math.max(...analysisResult.timeline.map(d => d.score * 100)).toFixed(1)}%
                </p>
                <p className="text-sm text-muted-foreground mt-1">Highest intensity</p>
              </div>
              
              <div className="text-center p-6 gradient-surface rounded-lg border border-border/50">
                <h3 className="font-semibold text-accent mb-2">Emotional Range</h3>
                <p className="text-2xl font-bold text-primary">
                  {new Set(analysisResult.timeline.map(d => d.emotion)).size}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Different emotions detected</p>
              </div>
              
              <div className="text-center p-6 gradient-surface rounded-lg border border-border/50">
                <h3 className="font-semibold text-accent mb-2">Duration</h3>
                <p className="text-2xl font-bold text-accent">
                  {Math.floor(Math.max(...analysisResult.timeline.map(d => d.time)) / 60)}:
                  {(Math.max(...analysisResult.timeline.map(d => d.time)) % 60).toString().padStart(2, '0')}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Track length analyzed</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 bg-card/30 mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">
            Powered by advanced AI emotion recognition technology
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;