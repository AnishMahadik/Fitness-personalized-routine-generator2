import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, FitnessPlan } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateFitnessPlan(profile: UserProfile): Promise<FitnessPlan> {
  const prompt = `Generate a highly personalized fitness routine and comprehensive nutrition plan for the following profile:
  - Age: ${profile.age}
  - Gender: ${profile.gender}
  - Weight: ${profile.weight}kg
  - Height: ${profile.height}cm
  - Goal: ${profile.goal.replace('_', ' ')}
  - Experience Level: ${profile.experienceLevel}
  - Available Equipment: ${profile.equipment.join(', ') || 'Bodyweight only'}
  - Commitment: ${profile.daysPerWeek} days per week, ${profile.sessionDuration} minutes per session.

  Provide a structured plan including:
  1. A weekly schedule with specific exercises (sets, reps, muscle groups).
  2. Detailed nutrition advice including caloric strategy, macronutrient focus, and specific food suggestions for the user's goal.
  3. Pro tips for recovery and performance.`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          planName: { type: Type.STRING },
          overview: { type: Type.STRING },
          weeklySchedule: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING },
                focus: { type: Type.STRING },
                exercises: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      sets: { type: Type.NUMBER },
                      reps: { type: Type.STRING },
                      duration: { type: Type.STRING },
                      instructions: { type: Type.STRING },
                      targetMuscle: { type: Type.STRING },
                    },
                    required: ["name", "instructions", "targetMuscle"]
                  }
                }
              },
              required: ["day", "focus", "exercises"]
            }
          },
          nutritionAdvice: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          proTips: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["planName", "overview", "weeklySchedule", "nutritionAdvice", "proTips"]
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}') as FitnessPlan;
  } catch (error) {
    console.error("Failed to parse fitness plan:", error);
    throw new Error("Failed to generate a valid fitness plan. Please try again.");
  }
}
