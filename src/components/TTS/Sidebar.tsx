import { Home, Mic, Play, Settings, Volume2, Headphones, Mic2, FileText, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const playgroundItems = [
    { id: "text-to-speech", label: "Text to Speech", icon: Volume2, active: true },
    { id: "voice-changer", label: "Voice Changer", icon: Mic },
    { id: "sound-effects", label: "Sound Effects", icon: Headphones },
  ];

  const productItems = [
    { id: "studio", label: "Studio", icon: Mic2 },
    { id: "dubbing", label: "Dubbing", icon: FileText },
    { id: "conversational-ai", label: "Conversational AI", icon: ChevronRight },
    { id: "speech-to-text", label: "Speech to Text", icon: FileText },
  ];

  return (
    <div className="w-64 h-screen bg-tts-sidebar-bg border-r border-tts-sidebar-bg flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Volume2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-semibold text-lg">OpenAI TTS</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-6">
        {/* Main Items */}
        <div className="space-y-1">
          <button
            onClick={() => onSectionChange("home")}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors",
              activeSection === "home"
                ? "bg-tts-sidebar-active-bg text-tts-sidebar-active"
                : "text-tts-sidebar-foreground hover:bg-gray-800"
            )}
          >
            <Home className="w-4 h-4" />
            Home
          </button>
          
          <button
            onClick={() => onSectionChange("voices")}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors",
              activeSection === "voices"
                ? "bg-tts-sidebar-active-bg text-tts-sidebar-active"
                : "text-tts-sidebar-foreground hover:bg-gray-800"
            )}
          >
            <Mic className="w-4 h-4" />
            Voices
            <span className="ml-auto text-xs bg-gray-700 px-2 py-0.5 rounded">+</span>
          </button>
        </div>

        {/* Playground Section */}
        <div>
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Playground
          </h3>
          <div className="space-y-1">
            {playgroundItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors",
                  item.active || activeSection === item.id
                    ? "bg-tts-sidebar-active-bg text-tts-sidebar-active"
                    : "text-tts-sidebar-foreground hover:bg-gray-800"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Section */}
        <div>
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Products
          </h3>
          <div className="space-y-1">
            {productItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors",
                  activeSection === item.id
                    ? "bg-tts-sidebar-active-bg text-tts-sidebar-active"
                    : "text-tts-sidebar-foreground hover:bg-gray-800"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
                {item.id === "conversational-ai" && (
                  <ChevronRight className="w-3 h-3 ml-auto" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Audio Tools */}
      <div className="p-4 border-t border-gray-800">
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-tts-sidebar-foreground hover:bg-gray-800 rounded-lg transition-colors">
          <Settings className="w-4 h-4" />
          Audio Tools
          <ChevronRight className="w-3 h-3 ml-auto" />
        </button>
      </div>

      {/* User Section */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">U</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">User</div>
            <div className="text-xs text-gray-400 truncate">OpenAI TTS</div>
          </div>
          <ChevronRight className="w-3 h-3 text-gray-400" />
        </div>
      </div>
    </div>
  );
}