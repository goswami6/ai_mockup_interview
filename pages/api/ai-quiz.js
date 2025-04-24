// pages/api/generate-questions.js
import { chatSession } from "../../utils/GeminiAIModel";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { language } = req.body;

  if (!language) {
    return res.status(400).json({ error: "Language is required." });
  }

  const prompt = `
You are a programming quiz generator.

Generate exactly 10 multiple choice quiz questions for the programming language: ${language}.

Each question must include:
1. "question" (string)
2. "options" (array of 4 strings)
3. "correct_answer" (must match one of the options)

Return ONLY valid JSON in this format:

[
  {
    "question": "What does HTML stand for?",
    "options": [
      "Hyper Text Markup Language",
      "Home Tool Markup Language",
      "Hyperlinks and Text Markup Language",
      "Hyperlinking and Text Management Language"
    ],
    "correct_answer": "Hyper Text Markup Language"
  },
  ...
]

Do NOT include markdown or explanation.
`;

  try {
    const result = await chatSession.sendMessage(prompt);
    let raw = await result.response.text();

    // Clean any markdown wrapping
    if (raw.startsWith("```json")) {
      raw = raw.replace(/```json|```/g, "").trim();
    }

    const start = raw.indexOf("[");
    const end = raw.lastIndexOf("]");

    if (start !== -1 && end !== -1) {
      const cleaned = raw.substring(start, end + 1);
      const questions = JSON.parse(cleaned);
      return res.status(200).json({ questions });
    } else {
      throw new Error("No valid JSON array found.");
    }
  } catch (err) {
    console.error("AI Error:", err);
    return res.status(500).json({ error: "Failed to generate questions." });
  }
}
