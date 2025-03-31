import { Lightbulb, Volume2, Mic } from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

function QuestionsSection({ mockInterviewQuestion, activeQuestionIndex, setActiveQuestionIndex ,answeredQuestion}) {
    const [aiResponse, setAiResponse] = useState("");
    const [userResponse, setUserResponse] = useState("");
    const [answeredQuestions, setAnsweredQuestions] = useState(new Set());

    // Convert Text to Speech
    const textToSpeech = (text) => {
        if ("speechSynthesis" in window) {
            const speech = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(speech);
        } else {
            alert("Sorry, Your browser does not support text-to-speech");
        }
    };

    // AI Response Function (OpenAI API)
    const handleAIResponse = async (question) => {
        if (!question) return;

        const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
        const endpoint = "https://api.openai.com/v1/chat/completions";

        const requestData = {
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a professional interviewer. Ask follow-up questions based on the user's answer." },
                { role: "user", content: `Question: ${question}\nUser Response: ${userResponse || "No response yet."}` }
            ],
            temperature: 0.7
        };

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`
                },
                body: JSON.stringify(requestData)
            });

            const data = await response.json();
            const aiReply = data.choices[0]?.message?.content || "I'm not sure. Can you clarify?";
            setAiResponse(aiReply);
            textToSpeech(aiReply);
        } catch (error) {
            console.error("AI API Error:", error);
            setAiResponse("Sorry, I couldn't generate a response.");
        }
    };

    // Auto-trigger AI question when the question index changes
    useEffect(() => {
        if (mockInterviewQuestion.length > 0) {
            const newQuestion = mockInterviewQuestion[activeQuestionIndex]?.question;
            setUserResponse(""); 
            setAiResponse(""); 
            textToSpeech(newQuestion); 
            handleAIResponse(newQuestion); 
        }
    }, [activeQuestionIndex]);

    // Handle Answer Submission
    const handleSubmitAnswer = () => {
        if (!userResponse.trim()) {
            toast.error("⚠️ Please provide an answer before submitting.");
            return;
        }

        toast.success("✅ Answer submitted successfully! Moving to next question...");
        setAnsweredQuestions(prev => new Set(prev).add(activeQuestionIndex));

        // Move to the next question if available
        if (activeQuestionIndex < mockInterviewQuestion.length - 1) {
            setActiveQuestionIndex(prevIndex => prevIndex + 1);
        } else {
            toast.info("🎉 You have completed all questions!");
        }
    };

    if (!mockInterviewQuestion || mockInterviewQuestion.length === 0) {
        return <p className="text-center text-red-500">No Questions Available</p>;
    }

    return (
        <div className="p-5 border rounded-lg my-10">
            {/* Questions List */}
            <div className="grid grid-cols-2 md-grid-cols-3 lg:grid-cols-4 gap-5">
                {mockInterviewQuestion.map((question, index) => (
                    <h2
                        key={index}
                        className={`p-2 border rounded-full text-xs md:text-sm text-center cursor-pointer 
                        ${activeQuestionIndex === index ? "bg-primary text-white" : ""} 
                        ${answeredQuestions.has(index) ? "bg-green-500 text-white" : ""}`}
                    >
                        Question #{index + 1}
                    </h2>
                ))}
            </div>

            {/* Display Selected Question */}
            <h2 className="my-5 text-md md:text-lg">
                {mockInterviewQuestion[activeQuestionIndex]?.question || "No Question Available"}
            </h2>

            {/* User Response Input */}
            <textarea
                className="w-full p-2 border rounded-lg"
                placeholder="Type your response here..."
                value={userResponse}
                onChange={(e) => setUserResponse(e.target.value)}
            />

            {/* AI & Speech Buttons */}
            <div className="flex items-center gap-4 my-3">
                <Volume2
                    className="cursor-pointer"
                    onClick={() => textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.question)}
                />
                <Mic className="cursor-pointer text-green-600" onClick={() => handleAIResponse(mockInterviewQuestion[activeQuestionIndex]?.question)} />
                <button 
                className="mt-4 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                onClick={handleSubmitAnswer}
            >
                Submit Answer
            </button>
            </div>

            {/* Submit Answer Button */}
           

            {/* AI Response Section */}
            {aiResponse && (
                <div className="p-3 bg-gray-100 border rounded-lg mt-3">
                    <strong>AI Interviewer:</strong> {aiResponse}
                </div>
            )}

            {/* Note Section */}
            <div className="border rounded-lg p-5 bg-blue-100 mt-20">
                <h2 className="flex gap-2 items-center text-primary">
                    <Lightbulb />
                    <strong>Note:</strong>
                </h2>
                <h2 className="text-sm text-primary my-2">
                    {process.env.NEXT_PUBLIC_QUESTION_NOTE || "Default note message"}
                </h2>
            </div>
        </div>
    );
}

export default QuestionsSection;
