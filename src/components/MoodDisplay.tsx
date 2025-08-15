import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Zap, Smile, Frown, Meh } from 'lucide-react';

interface MoodData {
  emotion: string;
  confidence: number;
  valence?: number;
  arousal?: number;
  tags?: string[];
}

interface MoodDisplayProps {
  mood: MoodData;
  fileName?: string;
}

const getEmotionIcon = (emotion: string) => {
  const normalized = emotion.toLowerCase();
  
  if (normalized.includes('happy') || normalized.includes('joy') || normalized.includes('upbeat')) {
    return <Smile className="w-8 h-8 text-emotion-happy" />;
  } else if (normalized.includes('sad') || normalized.includes('melancholic') || normalized.includes('somber')) {
    return <Frown className="w-8 h-8 text-emotion-sad" />;
  } else if (normalized.includes('energetic') || normalized.includes('excited') || normalized.includes('dynamic')) {
    return <Zap className="w-8 h-8 text-emotion-energetic" />;
  } else if (normalized.includes('calm') || normalized.includes('peaceful') || normalized.includes('relaxed')) {
    return <Heart className="w-8 h-8 text-emotion-calm" />;
  } else {
    return <Meh className="w-8 h-8 text-emotion-neutral" />;
  }
};

const getEmotionColor = (emotion: string) => {
  const normalized = emotion.toLowerCase();
  
  if (normalized.includes('happy') || normalized.includes('joy') || normalized.includes('upbeat')) {
    return 'text-emotion-happy';
  } else if (normalized.includes('sad') || normalized.includes('melancholic') || normalized.includes('somber')) {
    return 'text-emotion-sad';
  } else if (normalized.includes('energetic') || normalized.includes('excited') || normalized.includes('dynamic')) {
    return 'text-emotion-energetic';
  } else if (normalized.includes('calm') || normalized.includes('peaceful') || normalized.includes('relaxed')) {
    return 'text-emotion-calm';
  } else {
    return 'text-emotion-neutral';
  }
};

const getEmotionDescription = (emotion: string, valence?: number, arousal?: number) => {
  const descriptions: { [key: string]: string } = {
    happy: "This track radiates positivity and joy, likely to lift your spirits!",
    sad: "A melancholic piece that evokes deep emotions and introspection.",
    energetic: "High-energy music that gets your blood pumping and body moving!",
    calm: "Peaceful and soothing, perfect for relaxation and meditation.",
    excited: "Dynamic and thrilling, this music creates anticipation and excitement!",
    angry: "Intense and powerful, expressing strong emotions and energy.",
    peaceful: "Tranquil and serene, ideal for unwinding and finding inner peace.",
    neutral: "Balanced emotional content with subtle mood variations."
  };

  const normalized = emotion.toLowerCase();
  let description = descriptions[normalized] || `This music has a ${emotion.toLowerCase()} emotional character.`;
  
  if (valence !== undefined && arousal !== undefined) {
    if (valence > 0.7 && arousal > 0.7) {
      description += " It's both uplifting and energizing!";
    } else if (valence > 0.7 && arousal < 0.3) {
      description += " It has a positive, relaxed vibe.";
    } else if (valence < 0.3 && arousal > 0.7) {
      description += " It's intense with darker emotions.";
    } else if (valence < 0.3 && arousal < 0.3) {
      description += " It carries a subdued, contemplative mood.";
    }
  }
  
  return description;
};

export function MoodDisplay({ mood, fileName }: MoodDisplayProps) {
  const emotionColor = getEmotionColor(mood.emotion);
  const emotionIcon = getEmotionIcon(mood.emotion);

  return (
    <Card className="p-6 gradient-surface border-border/50 glow-primary">
      <div className="space-y-6">
        {fileName && (
          <div className="text-center pb-4 border-b border-border/30">
            <h2 className="text-lg font-medium text-muted-foreground">Analysis for</h2>
            <h3 className="text-xl font-semibold truncate">{fileName}</h3>
          </div>
        )}
        
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 rounded-full gradient-surface glow-primary audio-pulse">
              {emotionIcon}
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className={`text-3xl font-bold ${emotionColor}`}>
              {mood.emotion}
            </h2>
            <p className="text-muted-foreground">
              {getEmotionDescription(mood.emotion, mood.valence, mood.arousal)}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center space-y-1">
            <p className="text-sm text-muted-foreground">Confidence</p>
            <p className="text-2xl font-bold text-primary">
              {(mood.confidence * 100).toFixed(1)}%
            </p>
          </div>
          
          {mood.valence !== undefined && (
            <div className="text-center space-y-1">
              <p className="text-sm text-muted-foreground">Positivity</p>
              <p className="text-2xl font-bold text-accent">
                {(mood.valence * 100).toFixed(1)}%
              </p>
            </div>
          )}
          
          {mood.arousal !== undefined && (
            <div className="text-center space-y-1">
              <p className="text-sm text-muted-foreground">Energy</p>
              <p className="text-2xl font-bold text-accent-glow">
                {(mood.arousal * 100).toFixed(1)}%
              </p>
            </div>
          )}
        </div>
        
        {mood.tags && mood.tags.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Musical Characteristics</p>
            <div className="flex flex-wrap gap-2">
              {mood.tags.map((tag, index) => (
                <Badge 
                  key={index}
                  variant="secondary"
                  className="bg-muted/30 text-muted-foreground hover:bg-primary/20 hover:text-primary"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}