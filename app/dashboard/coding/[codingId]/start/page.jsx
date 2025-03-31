"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
// import { db } from "../../../utils/db";
import { CodingQuestions } from "../../../../../utils/schema";
import Link from "next/link";
import { db } from "../../../../../utils/db";

const DisplayQuestions = () => {
  const { interviewId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const result = await db
          .select()
          .from(CodingQuestions)
          .where(eq(CodingQuestions.mockId, interviewId));

        if (result.length > 0) {
          setQuestions(JSON.parse(result[0].jsonMockResp));
        } else {
          setError("No questions found for this interview.");
        }
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError("Failed to fetch questions.");
      } finally {
        setLoading(false);
      }
    };

    if (interviewId) {
      fetchQuestions();
    }
  }, [interviewId]);

  if (loading) return <p>Loading questions...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Generated Coding Questions</h1>
      {questions.length === 0 ? (
        <p>No questions available.</p>
      ) : (
        questions.map((q, index) => (
          <div key={index} className="mb-6 p-4 border rounded-lg shadow-md">
            <h2 className="font-semibold">Question {index + 1}:</h2>
            <p className="text-gray-700">{q.coding_problem}</p>
            <h3 className="font-semibold mt-2">Solution:</h3>
            <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">{q.solution}</pre>
            <h3 className="font-semibold mt-2">Test Cases:</h3>
            <ul className="list-disc pl-6">
              {q.test_cases.map((tc, i) => (
                <li key={i} className="text-gray-600">
                  <strong>Input:</strong> {tc.input} | <strong>Expected Output:</strong> {tc.expected_output}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
      <Link href="/dashboard" className="mt-4 block text-blue-500">Back to Dashboard</Link>
    </div>
  );
};

export default DisplayQuestions;
