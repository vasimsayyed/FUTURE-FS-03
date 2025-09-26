import { useState, useEffect } from "react";
import { Sidebar } from "@/components/TTS/Sidebar";
import { MainContent } from "@/components/TTS/MainContent";
import { SettingsPanel, type TTSSettings } from "@/components/TTS/SettingsPanel";

export default function TTSApp() {
  const [activeSection, setActiveSection] = useState("text-to-speech");
  const [isGenerating, setIsGenerating] = useState(false);
  const [settings, setSettings] = useState<TTSSettings>({
    voice: "alloy",
    model: "tts-1",
    speed: 1.0,
  });

  // Update page title and meta
  useEffect(() => {
    document.title = "OpenAI Text to Speech";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Convert text to lifelike speech using OpenAI\'s advanced TTS models. Choose from multiple voices and customize speed for perfect audio generation.');
    }
  }, []);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      
      {activeSection === "text-to-speech" ? (
        <>
          <MainContent 
            settings={settings}
            onGenerationStateChange={setIsGenerating}
          />
          <SettingsPanel 
            settings={settings}
            onSettingsChange={setSettings}
            isGenerating={isGenerating}
          />
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Coming Soon</h2>
            <p className="text-muted-foreground">
              This section is under development
            </p>
          </div>
        </div>
      )}
    </div>
  );
}