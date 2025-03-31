import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import FontAwesome icons

const CodingQuestionsComponent = ({ questions }) => {
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null);
  const [showSolution, setShowSolution] = useState(false); // Toggle solution visibility

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Coding Questions</h1>
      
      {/* List of Questions at the Top */}
      <div className="mb-6 flex flex-wrap justify-center gap-3">
        {questions.map((q, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded-lg transition-all duration-300 shadow-md border 
              ${selectedQuestionIndex === index 
                ? "bg-blue-500 text-white border-blue-600 shadow-lg" 
                : "bg-gray-100 text-gray-800 hover:bg-gray-200 hover:shadow-md"}`}
            onClick={() => {
              setSelectedQuestionIndex(index);
              setShowSolution(false); // Reset solution visibility when selecting a new question
            }}
          >
            Question {index + 1}
          </button>
        ))}
      </div>
      
      {/* Display Selected Question Details */}
      {selectedQuestionIndex !== null && (
        <div className="mt-6 p-6 border rounded-lg shadow-md bg-gray-50">
          <h2 className="text-lg font-semibold text-blue-600">
            Question {selectedQuestionIndex + 1}:
          </h2>
          <p className="text-gray-700 mt-2">{questions[selectedQuestionIndex].coding_problem}</p>
          
          {/* Show Solution Button */}
          <button
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
            onClick={() => setShowSolution(!showSolution)}
          >
            {showSolution ? <FaEyeSlash /> : <FaEye />} {showSolution ? "Hide Solution" : "Show Solution"}
          </button>

          {/* Show Solution Section */}
          {showSolution && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg border">
              <h3 className="font-semibold text-gray-800">Solution:</h3>
              <pre className="mt-2 p-2 bg-white rounded-lg shadow-sm border text-gray-700 overflow-x-auto">
                {questions[selectedQuestionIndex].solution}
              </pre>
            </div>
          )}

          <h3 className="font-semibold mt-4 text-gray-800">Test Cases:</h3>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            {Array.isArray(questions[selectedQuestionIndex].test_cases) ? (
              questions[selectedQuestionIndex].test_cases.map((tc, i) => (
                <li key={i} className="text-gray-600 bg-white p-2 rounded-lg shadow-sm border">
                  <strong>Input:</strong> {JSON.stringify(tc.input)} | 
                  <strong> Expected Output:</strong> {JSON.stringify(tc.expected_output)}
                </li>
              ))
            ) : (
              <li className="text-gray-600">Invalid test cases format.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CodingQuestionsComponent;
