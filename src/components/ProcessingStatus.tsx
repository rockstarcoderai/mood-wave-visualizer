import { Card } from '@/components/ui/card';
import { Music, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface ProcessingStatusProps {
  status: 'idle' | 'uploading' | 'processing' | 'complete' | 'error';
  message?: string;
  progress?: number;
}

export function ProcessingStatus({ status, message, progress }: ProcessingStatusProps) {
  if (status === 'idle') return null;

  const getStatusContent = () => {
    switch (status) {
      case 'uploading':
        return {
          icon: <Loader2 className="w-6 h-6 animate-spin text-accent" />,
          title: 'Uploading Audio',
          description: message || 'Preparing your music file...',
          color: 'text-accent'
        };
      case 'processing':
        return {
          icon: <Music className="w-6 h-6 text-primary audio-pulse" />,
          title: 'Analyzing Emotions',
          description: message || 'Our AI is listening to your music and detecting emotional patterns...',
          color: 'text-primary'
        };
      case 'complete':
        return {
          icon: <CheckCircle2 className="w-6 h-6 text-emotion-happy" />,
          title: 'Analysis Complete',
          description: message || 'Your music has been analyzed successfully!',
          color: 'text-emotion-happy'
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-6 h-6 text-destructive" />,
          title: 'Analysis Failed',
          description: message || 'Something went wrong. Please try again.',
          color: 'text-destructive'
        };
      default:
        return null;
    }
  };

  const content = getStatusContent();
  if (!content) return null;

  return (
    <Card className="p-6 gradient-surface border-border/50 glow-primary">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          {content.icon}
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className={`font-semibold ${content.color}`}>
              {content.title}
            </h3>
            {progress !== undefined && (
              <span className="text-sm text-muted-foreground">
                {Math.round(progress)}%
              </span>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground">
            {content.description}
          </p>
          
          {progress !== undefined && (
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="h-2 rounded-full gradient-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </div>
      
      {status === 'processing' && (
        <div className="mt-4 flex space-x-1 justify-center">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-primary rounded-full waveform-bar"
              style={{
                animationDelay: `${i * 0.1}s`,
                height: '20px'
              }}
            />
          ))}
        </div>
      )}
    </Card>
  );
}