"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ResultPage() {
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const data = localStorage.getItem("quiz_score");
    if (data) {
      const parsed = JSON.parse(data);
      setScore(parsed.score);
      setTotal(parsed.total);
    }
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-100 to-indigo-100 rounded-lg shadow-lg mt-5">
      <div className="bg-white p-8 rounded-lg shadow-md w-full sm:w-3/4 md:w-2/3 lg:w-1/2">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-6 text-center">
          Quiz Result
        </h1>
        <p className="text-2xl text-gray-800 mb-4 text-center">
          You scored <span className="font-semibold text-indigo-600">{score}</span> out of <span className="font-semibold text-indigo-600">{total}</span>
        </p>
        <div className="text-center">
          <Link
            href="/dashboard/quiz"
            className="mt-6 inline-block bg-blue-500 text-white px-6 py-3 rounded-md shadow-lg hover:bg-blue-600 hover:scale-105 transition-all duration-300 ease-in-out"
          >
            Go Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
