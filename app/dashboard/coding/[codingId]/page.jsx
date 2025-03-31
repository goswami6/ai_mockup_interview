"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "../../../../utils/db";
import { CodingQuestions } from "../../../../utils/schema";
import { eq } from "drizzle-orm";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import CodingQuestionsComponent from "./start/_components/codingquestions"; // Ensure the correct path

const DisplayQuestions = () => {
  const { codingId } = useParams();
  const router = useRouter(); // For navigation
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userCode, setUserCode] = useState("");
  const [output, setOutput] = useState(null);

  useEffect(() => {
    if (!codingId) {
      setError("Invalid interview ID.");
      setLoading(false);
      return;
    }

    const fetchQuestions = async () => {
      try {
        const result = await db
          .select()
          .from(CodingQuestions)
          .where(eq(CodingQuestions.mockId, codingId));

        if (result.length > 0 && result[0].jsonMockResp) {
          const parsedQuestions = JSON.parse(result[0].jsonMockResp);
          setQuestions(Array.isArray(parsedQuestions) ? parsedQuestions : []);
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

    fetchQuestions();
  }, [codingId]);

  const runCode = () => {
    try {
      // Security Warning: Avoid using eval() in production!
      // Instead, send the code to a backend API for execution
      const result = new Function(userCode)();
      setOutput(result);
    } catch (error) {
      setOutput("Error: " + error.message);
    }
  };

  const handleEndInterview = () => {
    alert("Interview ended. Thank you!"); 
    router.push("/dashboard"); // Redirect to dashboard or another page
  };

  if (loading) return <p className="text-center mt-10 text-gray-700">Loading questions...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
      {/* Left Side: Questions List */}
      <div className="">
     
        {questions.length === 0 ? (
          <p className="text-gray-600 text-center">No questions available.</p>
        ) : (
          <CodingQuestionsComponent questions={questions} />
        )}
      </div>

      {/* Right Side: Code Editor */}
      <div className="bg-white p-6 rounded-lg shadow-lg border flex flex-col">
        <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">Write Your Code</h2>
        <CodeMirror
          value={userCode}
          height="500px"
          className="border rounded-md"
          extensions={[javascript()]}
          onChange={(value) => setUserCode(value)}
        />
        <button 
          onClick={runCode} 
          className="mt-4 px-5 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all"
        >
          Run Code
        </button>
        {output !== null && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg border">
            <h3 className="font-semibold text-gray-700">Output:</h3>
            <p className="text-gray-800">{output}</p>
          </div>
        )}
      </div>

      {/* End Interview Button */}
      <div className="col-span-1 md:col-span-2 flex justify-center mt-6">
        <button
          onClick={handleEndInterview}
          className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all"
        >
          End Interview
        </button>
      </div>
    </div>
  );
};

export default DisplayQuestions;
