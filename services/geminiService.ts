import { GoogleGenAI } from "@google/genai";
import { VerificationLog, StaffMember } from "../types";

const getAIClient = () => {
  if (!process.env.API_KEY) {
    console.error("API_KEY is missing");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const analyzeSecurityLogs = async (logs: VerificationLog[], staff: StaffMember[]) => {
  const ai = getAIClient();
  if (!ai) return "API Key missing. Unable to generate insights.";

  const prompt = `
    Analyze the following verification logs for an NGO identity system.
    Identify any suspicious patterns (e.g., suspended users trying to scan, expired IDs being used).
    
    Logs: ${JSON.stringify(logs.slice(0, 20))}
    Staff Data: ${JSON.stringify(staff.map(s => ({ id: s.id, name: s.fullName, status: s.status })))}
    
    Provide a concise, 3-bullet point security summary for the Admin.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "No insights generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Unable to analyze logs at this time.";
  }
};
