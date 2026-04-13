import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface ContentSystem {
  calendar: {
    day: number;
    type: string;
    idea: string;
    hook: string;
    goal: string;
  }[];
  hooks: string[];
  scripts: {
    hook: string;
    scenes: string[];
    onScreenText: string[];
    voiceover: string;
    visuals: string;
  }[];
  captions: {
    hook: string;
    value: string;
    cta: string;
    hashtags: string[];
  }[];
  trends: {
    format: string;
    adaptation: string;
    execution: string;
  }[];
  series: string[];
  postingTips: {
    time: string;
    frequency: string;
  };
}

export async function generateContentSystem(input: {
  niche: string;
  audience?: string;
  goal: string;
  platform: string;
  tone: string;
}): Promise<ContentSystem> {
  const prompt = `
    You are an expert AI Content Strategist. Transform the following input into a 30-day high-performing social media content system.
    
    INPUT:
    - Niche: ${input.niche}
    - Target Audience: ${input.audience || "General"}
    - Goal: ${input.goal}
    - Platform: ${input.platform}
    - Tone: ${input.tone}
    
    OUTPUT REQUIREMENTS:
    1. 30-Day Content Calendar (Day 1-30)
    2. Top 10 Viral Hooks
    3. 10 Short-form Video Scripts (Reels/Shorts)
    4. 10 Captions with CTA
    5. 10 Trend-based Content Ideas
    6. 3 Content Series Ideas
    7. Best posting time & frequency
    
    Focus on VIRALITY, CONSISTENCY, and HIGH ENGAGEMENT.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          calendar: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.NUMBER },
                type: { type: Type.STRING },
                idea: { type: Type.STRING },
                hook: { type: Type.STRING },
                goal: { type: Type.STRING },
              },
              required: ["day", "type", "idea", "hook", "goal"],
            },
          },
          hooks: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          scripts: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                hook: { type: Type.STRING },
                scenes: { type: Type.ARRAY, items: { type: Type.STRING } },
                onScreenText: { type: Type.ARRAY, items: { type: Type.STRING } },
                voiceover: { type: Type.STRING },
                visuals: { type: Type.STRING },
              },
              required: ["hook", "scenes", "onScreenText", "voiceover", "visuals"],
            },
          },
          captions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                hook: { type: Type.STRING },
                value: { type: Type.STRING },
                cta: { type: Type.STRING },
                hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["hook", "value", "cta", "hashtags"],
            },
          },
          trends: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                format: { type: Type.STRING },
                adaptation: { type: Type.STRING },
                execution: { type: Type.STRING },
              },
              required: ["format", "adaptation", "execution"],
            },
          },
          series: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          postingTips: {
            type: Type.OBJECT,
            properties: {
              time: { type: Type.STRING },
              frequency: { type: Type.STRING },
            },
            required: ["time", "frequency"],
          },
        },
        required: ["calendar", "hooks", "scripts", "captions", "trends", "series", "postingTips"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
}
