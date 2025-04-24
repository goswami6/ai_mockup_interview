"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function QuizPage({ params }) {
  const { language } = params;
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/ai-quiz", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ language }),
        });

        const data = await res.json();
        if (data.questions) {
          setQuestions(data.questions);
        } else {
          console.error("No questions returned");
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [language]);

  const handleAnswer = (option) => {
    if (questions[currentIndex].correct_answer === option) {
      setScore((prev) => prev + 1);
    }

    const next = currentIndex + 1;
    if (next < questions.length) {
      setCurrentIndex(next);
    } else {
      localStorage.setItem(
        "quiz_score",
        JSON.stringify({ score: score + 1, total: questions.length })
      );
      router.push(`/dashboard/quiz/quizs/${language}/result`);
    }
  };

  if (loading) return <div className="p-6">Loading questions...</div>;
  if (questions.length === 0) return <div>No questions available.</div>;

  return (
    <main className="p-6 min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 to-indigo-100 rounded-lg shadow-lg mt-5">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-indigo-800 drop-shadow-md">
        {language?.toUpperCase()} Quiz
      </h1>
      <div className="bg-white p-8 rounded-lg shadow-md w-full sm:w-3/4 md:w-2/3 lg:w-1/2">
        <p className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Q{currentIndex + 1}: {questions[currentIndex].question}
        </p>
        <div className="grid grid-cols-1 gap-4">
          {questions[currentIndex].options.map((option, idx) => (
            <button
              key={idx}
              className="w-full bg-indigo-600 text-white p-4 rounded-lg shadow-lg hover:bg-indigo-700 hover:scale-105 transition-all duration-300 ease-in-out"
              onClick={() => handleAnswer(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
