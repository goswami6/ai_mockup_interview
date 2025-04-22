const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Function that returns questions based on prompt
export const chatSession = async (prompt) => {
  const chat = await model.startChat({ generationConfig });
  const result = await chat.sendMessage(prompt);
  const text = await result.response.text();

  // You may want to split the response into individual questions
  return text.split("\n").filter(Boolean);
};
