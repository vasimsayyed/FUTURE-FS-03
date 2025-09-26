import { useState, useRef } from "react";
import { Play, Pause, Download, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { TTSSettings } from "./SettingsPanel";

interface MainContentProps {
  settings: TTSSettings;
  onGenerationStateChange: (isGenerating: boolean) => void;
}

const SUGGESTION_PROMPTS = [
  { icon: "📚", text: "Narrate a story" },
  { icon: "😄", text: "Tell a silly joke" },
  { icon: "📢", text: "Record an advertisement" },
  { icon: "🌍", text: "Speak in different languages" },
  { icon: "🎬", text: "Direct a dramatic movie scene" },
  { icon: "🎮", text: "Hear from a video game character" },
  { icon: "🎙️", text: "Introduce your podcast" },
  { icon: "🧘", text: "Guide a meditation class" },
];

export function MainContent({ settings, onGenerationStateChange }: MainContentProps) {
  const [text, setText] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const characterCount = text.length;
  const maxCharacters = 4096;
  const isTextValid = text.trim().length > 0 && characterCount <= maxCharacters;

  const generateSpeech = async () => {
    if (!isTextValid) {
      toast({
        title: "Invalid text",
        description: "Please enter some text (max 4096 characters)",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    onGenerationStateChange(true);

    try {
      // Note: This would need to be implemented with a backend API
      // since OpenAI API requires server-side handling
      const response = await fetch('/api/generate-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          voice: settings.voice,
          model: settings.model,
          speed: settings.speed,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);

      toast({
        title: "Speech generated",
        description: "Your audio is ready to play!",
      });
    } catch (error) {
      console.error('Speech generation error:', error);
      toast({
        title: "Generation failed",
        description: "Please check your API key and try again. For now, this is a demo interface.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      onGenerationStateChange(false);
    }
  };

  const togglePlayback = () => {
    if (!audioUrl) {
      generateSpeech();
      return;
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const downloadAudio = () => {
    if (audioUrl) {
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = `speech-${Date.now()}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const insertSuggestion = (suggestion: string) => {
    setText(suggestion);
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="px-8 py-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">Text to Speech</h1>
          <Button variant="outline" size="sm">
            Feedback
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Text Input Area */}
          <div className="mb-8">
            <div className="relative">
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Start typing here or paste any text you want to turn into lifelike speech..."
                className="min-h-[300px] text-lg bg-tts-text-area-bg border-border resize-none"
                maxLength={maxCharacters}
              />
              <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">
                {characterCount}/{maxCharacters}
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center gap-3 mt-4">
              <Button
                onClick={togglePlayback}
                disabled={!isTextValid || isGenerating}
                size="lg"
                className="gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : isPlaying ? (
                  <>
                    <Pause className="w-4 h-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    {audioUrl ? "Play" : "Generate Speech"}
                  </>
                )}
              </Button>

              {audioUrl && (
                <>
                  <Button
                    onClick={stopPlayback}
                    variant="outline"
                    size="lg"
                    className="gap-2"
                  >
                    <Square className="w-4 h-4" />
                    Stop
                  </Button>
                  <Button
                    onClick={downloadAudio}
                    variant="outline"
                    size="lg"
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Suggestions */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-4">
              Get started with
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {SUGGESTION_PROMPTS.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => insertSuggestion(prompt.text)}
                  className="h-auto p-4 justify-start gap-3 bg-tts-suggestion-bg hover:bg-tts-suggestion-hover border-border"
                >
                  <span className="text-lg">{prompt.icon}</span>
                  <span className="text-sm text-left">{prompt.text}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Audio Element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          onLoadStart={() => setIsPlaying(false)}
        />
      )}
    </div>
  );
}