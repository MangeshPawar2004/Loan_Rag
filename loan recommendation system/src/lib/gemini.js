// src/lib/gemini.js
import { GoogleGenAI } from '@google/genai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
export const ai = new GoogleGenAI({ apiKey });

/** generate -> returns text */
export async function generateText(prompt, model='gemini-2.5-flash') {
  const resp = await ai.models.generateContent({
    model,
    contents: [
      { role: 'user', parts: [{ text: prompt }] }
    ],
  });
  return resp.text ?? resp?.candidates?.[0]?.content ?? '';
}
