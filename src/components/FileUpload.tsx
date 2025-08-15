import { useState, useCallback } from 'react';
import { Upload, Music, FileAudio } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing?: boolean;
}

export function FileUpload({ onFileSelect, isProcessing }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('audio/')) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  return (
    <Card className="gradient-surface border-border/50 transition-all duration-300 hover:glow-primary">
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          p-8 md:p-12 text-center cursor-pointer transition-all duration-300
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}
        `}
        onClick={() => !isProcessing && document.getElementById('file-input')?.click()}
      >
        <input 
          id="file-input"
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isProcessing}
        />
        
        <div className="flex flex-col items-center space-y-4">
          {selectedFile ? (
            <div className="flex items-center space-x-3 text-accent">
              <FileAudio className="w-8 h-8" />
              <div className="text-left">
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="relative">
                <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center glow-primary audio-pulse">
                  <Music className="w-8 h-8 text-primary-foreground" />
                </div>
                <Upload className="w-6 h-6 text-accent absolute -top-1 -right-1" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Upload Your Music</h3>
                <p className="text-muted-foreground">
                  Drag and drop your audio file here, or click to browse
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports MP3, WAV, M4A, FLAC, OGG
                </p>
              </div>
            </>
          )}
          
          {!selectedFile && (
            <Button 
              variant="outline" 
              className="gradient-audio text-primary-foreground border-primary/30 hover:glow-primary"
              disabled={isProcessing}
              onClick={(e) => {
                e.stopPropagation();
                document.getElementById('file-input')?.click();
              }}
            >
              Choose File
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}