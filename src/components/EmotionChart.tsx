import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';

interface EmotionDataPoint {
  time: number;
  emotion: string;
  score: number;
  valence?: number;
  arousal?: number;
}

interface EmotionChartProps {
  data: EmotionDataPoint[];
  mainEmotion?: string;
}

const emotionColors = {
  happy: 'hsl(var(--emotion-happy))',
  sad: 'hsl(var(--emotion-sad))',
  energetic: 'hsl(var(--emotion-energetic))',
  calm: 'hsl(var(--emotion-calm))',
  neutral: 'hsl(var(--emotion-neutral))',
  excited: 'hsl(var(--accent))',
  angry: 'hsl(var(--destructive))',
  peaceful: 'hsl(var(--emotion-calm))',
  melancholic: 'hsl(var(--emotion-sad))',
  upbeat: 'hsl(var(--emotion-happy))'
};

const getEmotionColor = (emotion: string) => {
  const normalizedEmotion = emotion.toLowerCase();
  return emotionColors[normalizedEmotion as keyof typeof emotionColors] || 'hsl(var(--primary))';
};

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: EmotionDataPoint;
    value: number;
  }>;
  label?: number;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <Card className="p-3 gradient-surface border-border/50">
        <div className="space-y-1">
          <p className="font-medium">{`Time: ${Math.floor((label || 0) / 60)}:${((label || 0) % 60).toString().padStart(2, '0')}`}</p>
          <p className="text-sm">
            <span className="font-medium" style={{ color: getEmotionColor(data.emotion) }}>
              {data.emotion}
            </span>
            {' '}({(data.score * 100).toFixed(1)}%)
          </p>
          {data.valence !== undefined && (
            <p className="text-xs text-muted-foreground">
              Valence: {(data.valence * 100).toFixed(1)}%
            </p>
          )}
          {data.arousal !== undefined && (
            <p className="text-xs text-muted-foreground">
              Arousal: {(data.arousal * 100).toFixed(1)}%
            </p>
          )}
        </div>
      </Card>
    );
  }
  return null;
};

export function EmotionChart({ data, mainEmotion }: EmotionChartProps) {
  const chartColor = mainEmotion ? getEmotionColor(mainEmotion) : 'hsl(var(--primary))';

  const formatXAxisLabel = (tickItem: number) => {
    const minutes = Math.floor(tickItem / 60);
    const seconds = tickItem % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="p-6 gradient-surface border-border/50 glow-primary">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Emotion Timeline</h3>
          {mainEmotion && (
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: chartColor }}
              />
              <span className="text-sm font-medium" style={{ color: chartColor }}>
                Primary: {mainEmotion}
              </span>
            </div>
          )}
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="emotionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="time" 
                tickFormatter={formatXAxisLabel}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                domain={[0, 1]}
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="score"
                stroke={chartColor}
                strokeWidth={2}
                fill="url(#emotionGradient)"
                dot={{ fill: chartColor, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: chartColor, strokeWidth: 2, fill: 'hsl(var(--background))' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {data.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {Array.from(new Set(data.map(d => d.emotion))).map(emotion => (
              <div 
                key={emotion}
                className="flex items-center space-x-1 px-2 py-1 rounded-full bg-muted/30 text-xs"
              >
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getEmotionColor(emotion) }}
                />
                <span style={{ color: getEmotionColor(emotion) }}>{emotion}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}