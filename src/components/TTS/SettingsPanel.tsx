import { useState } from "react";
import { ChevronDown, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface TTSSettings {
  voice: string;
  model: string;
  speed: number;
}

interface SettingsPanelProps {
  settings: TTSSettings;
  onSettingsChange: (settings: TTSSettings) => void;
  isGenerating: boolean;
}

const OPENAI_VOICES = [
  { id: "alloy", name: "Alloy", description: "Neutral, balanced" },
  { id: "echo", name: "Echo", description: "Deep, resonant" },
  { id: "fable", name: "Fable", description: "Warm, expressive" },
  { id: "onyx", name: "Onyx", description: "Strong, authoritative" },
  { id: "nova", name: "Nova", description: "Bright, energetic" },
  { id: "shimmer", name: "Shimmer", description: "Soft, gentle" },
];

const OPENAI_MODELS = [
  { id: "tts-1", name: "TTS-1 (Standard)", description: "Real-time optimized" },
  { id: "tts-1-hd", name: "TTS-1 HD", description: "High quality" },
];

export function SettingsPanel({ settings, onSettingsChange, isGenerating }: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<"settings" | "history">("settings");

  const currentVoice = OPENAI_VOICES.find(v => v.id === settings.voice);
  const currentModel = OPENAI_MODELS.find(m => m.id === settings.model);

  const resetSettings = () => {
    onSettingsChange({
      voice: "alloy",
      model: "tts-1",
      speed: 1.0,
    });
  };

  return (
    <div className="w-80 h-screen bg-tts-settings-bg border-l border-border overflow-y-auto">
      {/* Header Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("settings")}
          className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
            activeTab === "settings"
              ? "text-foreground border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Settings
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
            activeTab === "history"
              ? "text-foreground border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          History
        </button>
      </div>

      {activeTab === "settings" && (
        <div className="p-6 space-y-8">
          {/* Voice Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Voice
            </label>
            <Select
              value={settings.voice}
              onValueChange={(value) =>
                onSettingsChange({ ...settings, voice: value })
              }
            >
              <SelectTrigger className="w-full bg-input border-border">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>{currentVoice?.name}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {OPENAI_VOICES.map((voice) => (
                  <SelectItem key={voice.id} value={voice.id}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <div>
                        <div className="font-medium">{voice.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {voice.description}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Model Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Model
            </label>
            <Select
              value={settings.model}
              onValueChange={(value) =>
                onSettingsChange({ ...settings, model: value })
              }
            >
              <SelectTrigger className="w-full bg-input border-border">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-4 bg-primary/20 rounded text-xs flex items-center justify-center text-primary font-medium">
                      AI
                    </div>
                    <span>{currentModel?.name}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {OPENAI_MODELS.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-4 bg-primary/20 rounded text-xs flex items-center justify-center text-primary font-medium">
                        AI
                      </div>
                      <div>
                        <div className="font-medium">{model.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {model.description}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Speed Control */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-foreground">Speed</label>
              <span className="text-xs text-muted-foreground">
                {settings.speed.toFixed(1)}x
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Slower</span>
                <span>Faster</span>
              </div>
              <Slider
                value={[settings.speed]}
                onValueChange={([value]) =>
                  onSettingsChange({ ...settings, speed: value })
                }
                min={0.25}
                max={4.0}
                step={0.25}
                className="w-full"
              />
            </div>
          </div>

          {/* Reset Button */}
          <div className="pt-4">
            <Button
              variant="outline"
              onClick={resetSettings}
              className="w-full justify-start gap-2"
              disabled={isGenerating}
            >
              <RotateCcw className="w-4 h-4" />
              Reset values
            </Button>
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="p-6">
          <div className="text-center text-muted-foreground">
            <div className="text-sm">No history yet</div>
            <div className="text-xs mt-1">
              Generated audio will appear here
            </div>
          </div>
        </div>
      )}
    </div>
  );
}