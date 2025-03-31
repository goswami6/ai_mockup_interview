import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import React, { useState } from "react";

function InterviewItemCard({ interview, onDelete }) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);

  // Navigate to Start Interview Page
  const onStart = () => {
    router.push(`/dashboard/interview/${interview?.mockId}`);
  };

  // Navigate to Feedback Page
  const onFeedbackPress = () => {
    router.push(`/dashboard/interview/${interview?.mockId}/feedback`);
  };

  // Handle Delete with Animation
  const handleDelete = () => {
    setIsVisible(false); // Start fade-out animation
    setTimeout(() => onDelete(interview?.mockId), 300); // Remove after animation
  };

  // Prevent crash if `interview` is undefined
  if (!interview) return null;

  return (
    <div
      className={`relative border border-gray-300 bg-white shadow-lg rounded-xl p-5 
        transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-gray-500 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
    >
      {/* Delete Button */}
      <button
        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-all"
        onClick={handleDelete}
      >
        <X size={20} />
      </button>

      {/* Job Position & Experience */}
      <h2 className="font-bold text-lg text-gray-800">{interview?.jobPosition || "Unknown Job"}</h2>
      <p className="text-sm text-gray-600">
        {interview?.jobExperience ? `${interview?.jobExperience} Years of Experience` : "Experience not provided"}
      </p>
      <p className="text-xs text-gray-400">Created At: {interview?.createdAt || "N/A"}</p>

      {/* Action Buttons */}
      <div className="flex justify-between mt-4 gap-4">
        <Button
          size="m"
          variant="outline"
          className="w-full border-gray-500 text-gray-700 hover:border-gray-800 hover:text-gray-900 transition-all py-3"
          onClick={onFeedbackPress}
        >
          Feedback
        </Button>
        <Button
          size="sm"
          className="w-full bg-blue-500 text-white hover:bg-blue-600 transition-all py-3"
          onClick={onStart}
        >
          Start
        </Button>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        .fade-out {
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
      `}</style>
    </div>
  );
}

export default InterviewItemCard;
