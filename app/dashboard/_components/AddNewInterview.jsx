"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoaderCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "../../../utils/GeminiAIModel";
import { db } from "../../../utils/db";
import { MockInterview } from "../../../utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";

const AddNewInterview = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const [formData, setFormData] = useState({
    jobRole: "",
    description: "",
    experience: "",
  });
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    // Construct prompt
    const prompt = `Job position: ${jobPosition}, Job Description: ${jobDesc}, Years of Experience: ${jobExperience}. Based on these, provide ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} interview questions along with answers in JSON format. Use "question" and "answer" as keys.`;

    // Send message to Gemini
    const result = await chatSession.sendMessage(prompt);
    const rawText = result.response.text();
    const cleanedText = rawText.replace("```json", "").replace("```", "").trim();

    // Parse response
    let parsedJSON;
    try {
      parsedJSON = JSON.parse(cleanedText);
    } catch (err) {
      console.error("Failed to parse Gemini response:", err);
      console.log("Gemini returned:", cleanedText);
      return;
    }

    // Store response in DB
    const response = await db.insert(MockInterview).values({
      mockId: uuidv4(),
      jsonMockResp: JSON.stringify(parsedJSON), // make sure this is stored as text
      jobPosition,
      jobDesc,
      jobExperience,
      createdBy: user?.primaryEmailAddress?.emailAddress || "",
      createdAt: moment().format("DD-MM-YYYY"),
    }).returning({
      mockId: MockInterview.mockId,
    });

    if (response?.length > 0) {
      console.log("Inserted interview ID:", response[0].mockId);
      setOpenDailog(false);
      router.push(`/dashboard/interview/${response[0].mockId}`);
    } else {
      console.error("Interview insertion failed.");
    }
  } catch (err) {
    console.error("Interview generation failed:", err);
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      <div
        className="relative flex aspect-[2/1] w-full max-w-md flex-col items-center justify-center 
          rounded-xl border border-gray-300 p-8 text-center bg-gradient-to-r from-gray-100 to-gray-200 overflow-hidden 
          shadow-lg cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105"
        onClick={() => setOpenDialog(true)}
      >
        <div className="absolute inset-0 rounded-xl border-2 border-dashed border-gray-500 animate-border"></div>
        <h2 className="font-semibold text-gray-800 text-lg transition-all duration-300 hover:scale-105">
          + Add New Interview
        </h2>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        {openDialog && <div className="fixed inset-0 bg-black bg-opacity-40 z-40"></div>}
        <DialogContent className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
          bg-white p-6 rounded-xl shadow-2xl border border-gray-200 max-w-lg transition-all duration-300 scale-95 animate-popup">
          <button
            className="absolute top-3 right-3 text-gray-600 hover:text-black"
            onClick={() => setOpenDialog(false)}
          >
            <X size={20} />
          </button>
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">Create New Interview</DialogTitle>
          </DialogHeader>

          <DialogDescription>
            <h2 className="text-gray-700">Fill in the details to generate interview questions</h2>

            <form onSubmit={handleSubmit} className="mt-5">
              <div className="flex flex-col">
                <label className="text-left text-gray-700 font-medium mb-2">Job Role</label>
                <Input
                  name="jobRole"
                  placeholder="Ex. Full Stack Developer"
                  value={formData.jobRole}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
                />
                {errors.jobRole && <p className="text-red-500 text-sm">{errors.jobRole}</p>}
              </div>

              <div className="mt-5 flex flex-col">
                <label className="text-left text-gray-700 font-medium mb-2">Job Description</label>
                <Textarea
                  name="description"
                  placeholder="Ex. React, Node.js, etc."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
              </div>

              <div className="mt-5 flex flex-col">
                <label className="text-left text-gray-700 font-medium mb-2">Years of Experience</label>
                <Input
                  name="experience"
                  type="number"
                  placeholder="Ex. 2"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
                />
                {errors.experience && <p className="text-red-500 text-sm">{errors.experience}</p>}
              </div>

              <div className="flex gap-5 justify-end mt-6">
                <Button
                  className="border border-gray-300 bg-white text-black px-4 py-2 hover:bg-gray-200"
                  type="button"
                  onClick={() => setOpenDialog(false)}
                >
                  Cancel
                </Button>
                <Button className="bg-black text-white px-4 py-2 hover:bg-gray-800" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <LoaderCircle className="animate-spin mr-2" /> Generating...
                    </>
                  ) : (
                    "Start Interview"
                  )}
                </Button>
              </div>
            </form>
          </DialogDescription>
        </DialogContent>
      </Dialog>

      {/* Animations & Styles */}
      <style jsx>{`
        /* Zigzag Border Animation */
        @keyframes borderAnimation {
          0% { border-color: transparent; }
          50% { border-color: black; }
          100% { border-color: transparent; }
        }

        .animate-border {
          animation: borderAnimation 2s infinite alternate ease-in-out;
        }

        /* Pop-up Animation */
        @keyframes popupScale {
          from { transform: translate(-50%, -50%) scale(0.9); opacity: 0; }
          to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }

        .animate-popup {
          animation: popupScale 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default AddNewInterview;
