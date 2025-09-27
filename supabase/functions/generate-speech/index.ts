import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { text, voice = 'alloy', model = 'tts-1', speed = 1 } = await req.json();

    if (!text) {
      throw new Error('Text is required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Generating speech with:', { text: text.substring(0, 50) + '...', voice, model, speed });

    // Generate speech from text using OpenAI
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        input: text,
        voice,
        speed,
        response_format: 'mp3',
      }),
    });

    if (!response.ok) {
      const raw = await response.text();
      let message = `OpenAI API error: ${response.status} ${response.statusText}`;
      let code: string | undefined = undefined;
      try {
        const j = JSON.parse(raw);
        message = j?.error?.message || message;
        code = j?.error?.code || String(response.status);
      } catch (_) {
        // ignore JSON parse error
      }
      console.error('OpenAI API error:', raw);
      // Return 200 so Supabase client exposes the response body to the frontend
      return new Response(
        JSON.stringify({ error: message, errorCode: code }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Convert audio buffer to base64
    const arrayBuffer = await response.arrayBuffer();
    const base64Audio = btoa(
      String.fromCharCode(...new Uint8Array(arrayBuffer))
    );

    console.log('Speech generated successfully, audio length:', base64Audio.length);

    return new Response(
      JSON.stringify({ audioContent: base64Audio }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error in generate-speech function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    // Return 200 so frontend can access the error message
    return new Response(
      JSON.stringify({ error: errorMessage, errorCode: 'internal_error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});