"use client";

import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../../../../../utils/db";
import { UserAnswer } from "../../../../../utils/schema";
import { useWindowSize } from "react-use";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";

dayjs.extend(customParseFormat);

// 🔹 Function to get confidence level label with styling
const getConfidenceLabel = (confidence) => {
  if (confidence >= 7) return <span className="text-green-700 bg-green-200 px-2 py-1 rounded-md text-sm">High 🟢</span>;
  if (confidence >= 4) return <span className="text-yellow-700 bg-yellow-200 px-2 py-1 rounded-md text-sm">Medium 🟡</span>;
  return <span className="text-red-700 bg-red-200 px-2 py-1 rounded-md text-sm">Low 🔴</span>;
};

// ✅ Performance Summary Card
const SummaryCard = ({ totalQuestions, avgRating, avgConfidence }) => (
  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-300 min-h-[250px] flex flex-col justify-center items-center text-center">
  <p className="text-xl font-bold text-gray-700 mb-3 flex items-center gap-2">
    🏆 <span className="text-green-600">Total Questions:</span> 
    <span className="text-gray-900">{totalQuestions}</span>
  </p>

  <p className="text-xl font-bold text-gray-700 mb-3 flex items-center gap-2">
    ⭐ <span className="text-blue-600">Avg. Rating:</span> 
    <span className="text-gray-900">{avgRating}/10</span>
  </p>

  <p className="text-xl font-bold text-gray-700 flex items-center gap-2">
    🎭 <span className="text-purple-600">Avg. Confidence:</span> 
    {getConfidenceLabel(avgConfidence)}
  </p>
</div>

);

// ✅ Performance Chart
const PerformanceChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={250}>
    <AreaChart data={data}>
      <defs>
        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8} />
          <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
          <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis 
  dataKey="name" 
  tickFormatter={(date) => {
    if (!date || !dayjs(date, "YYYY-MM-DD", true).isValid()) {
      return "Invalid";
    }
    return dayjs(date).format("MMM D");
  }} 
/>

      <YAxis domain={[0, 10]} />
      <Tooltip />
      <Area type="monotone" dataKey="score" stroke="#22C55E" fillOpacity={1} fill="url(#colorScore)" />
      <Area type="monotone" dataKey="confidence" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorConfidence)" />
    </AreaChart>
  </ResponsiveContainer>
);

function Feedback({ params }) {
  const [feedbackList, setFeedbackList] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [summaryData, setSummaryData] = useState({ avgRating: "N/A", avgConfidence: "N/A" });
  const { width } = useWindowSize();
  const router = useRouter();

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const result = await db
        .select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, params.interviewId))
        .orderBy(UserAnswer.id);

      console.log("Raw Feedback Data:", result);

      const uniqueFeedback = result.reduce((acc, item) => {
        acc[item.question] = item;
        return acc;
      }, {});

      const filteredFeedback = Object.values(uniqueFeedback);
      setFeedbackList(filteredFeedback);

      // Calculate averages
      const totalRating = filteredFeedback.reduce((sum, item) => sum + (Number(item.rating) || 0), 0);
      const totalConfidence = filteredFeedback.reduce((sum, item) => sum + (Number(item.facialConfidence) || 0), 0);
      
      const avgRating = filteredFeedback.length ? (totalRating / filteredFeedback.length).toFixed(1) : "N/A";
      const avgConfidence = filteredFeedback.length ? (totalConfidence / filteredFeedback.length).toFixed(1) : "N/A";

      setPerformanceData(
        filteredFeedback.map((item) => ({
          name: dayjs(item.createdAt).format("YYYY-MM-DD"),
          score: item.rating || 0,
          confidence: item.facialConfidence || 0,
        }))
      );

      setSummaryData({ avgRating, avgConfidence });

    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

  return (
    <div className="p-6 md:p-12 lg:p-16 min-h-screen flex flex-col items-center w-full">
      {feedbackList.length === 0 ? (
        <h2 className="font-bold text-3xl text-gray-500 text-center mt-10">
          🚫 No Interview Feedback Found
        </h2>
      ) : (
        <div className="max-w-6xl w-full bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-8 md:p-12 flex flex-col md:flex-row gap-12 transition-all duration-300 hover:shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
          
          {/* Feedback Section */}
          <div className="w-full md:w-3/5">
            <h2 className="text-4xl font-bold text-green-600 text-center mb-3">
              🎉 Congratulations!
            </h2>
            <h3 className="font-semibold text-2xl text-center mb-6 text-gray-700">
              Your Interview Feedback
            </h3>
            
            {feedbackList.map((item, index) => (
              <Collapsible key={index} className="mt-4">
                <CollapsibleTrigger className="flex justify-between items-center bg-gray-200 p-4 rounded-lg shadow-md hover:bg-gray-300 transition-all w-full transform hover:scale-[1.02]">
                  <span className="font-medium text-gray-800">{item.question}</span>
                  <ChevronsUpDown className="h-5 w-5 text-gray-600" />
                </CollapsibleTrigger>
                <CollapsibleContent className="p-5 border-l-4 border-green-500 bg-gray-50 rounded-lg mt-2">
                  <FeedbackItem item={item} />
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>

          {/* Summary & Performance Chart */}
          <div className="w-full md:w-2/5">
            <SummaryCard 
              totalQuestions={feedbackList.length} 
              avgRating={summaryData.avgRating} 
              avgConfidence={summaryData.avgConfidence} 
            />
            <h3 className="text-xl font-bold text-center mt-10 mb-4 text-gray-800">📈 Performance Over Time</h3>
            <PerformanceChart data={performanceData} />
          </div>
        </div>
      )}
    </div>
  );
}
const FeedbackItem = ({ item }) => (
  <div className="space-y-3">
    <p><strong>Date:</strong> {dayjs(item.createdAt, "DD-MM-YYYY").format("MMMM D, YYYY")}</p>
    <p><strong>Rating:</strong> {item.rating || "N/A"}/10</p>
    <p><strong>Confidence:</strong> {getConfidenceLabel(item.facialConfidence)}</p>
    <p className="p-3 border rounded-lg bg-red-100"><strong>Your Answer:</strong> {item.userAns}</p>
    <p className="p-3 border rounded-lg bg-green-100"><strong>Correct Answer:</strong> {item.correctAns || "N/A"}</p>
    <p className="p-3 border rounded-lg bg-blue-100"><strong>Feedback:</strong> {item.feedback}</p>

  </div>
);


export default Feedback;
