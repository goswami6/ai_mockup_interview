"use client";
import { useState } from "react";

import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { chatSession } from "../../../utils/GeminiAIModel"; // Assumed AI integration
import { useUser } from "@clerk/nextjs";
import { db } from "../../../utils/db";
import { CodingQuestions } from "../../../utils/schema"; // ✅ Correct schema
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const Questions = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    jobRole: "",
    description: "",
    experience: "",
    company: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState(null);
  const user = useUser();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let newErrors = {};
    if (!formData.jobRole) newErrors.jobRole = "Job Role is required";
    if (!formData.description) newErrors.description = "Job Description is required";
    if (!formData.experience) newErrors.experience = "Experience is required";
    if (!formData.company) newErrors.company = "Company is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    console.log("Form Submitted:", formData);
    const questionCount = process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT || 5;

    // ✅ Updated AI Prompt with Test Cases
    const InputPrompt = `Job Position: ${formData.jobRole}, 
    Job Description: "${formData.description}", 
    Years of Experience: ${formData.experience}, 
    Company: ${formData.company}. 

    Please provide exactly ${questionCount} coding problems along with their detailed coding solutions that were asked in real interviews last year.

    Each problem must include:
    1. **Problem Statement** (coding_problem)
    2. **Correct Solution** (solution)
    3. **Test Cases That Must Pass** (test_cases)

    Format (valid JSON):
    [
      {
        "coding_problem": "Problem 1",
        "solution": "Solution 1",
        "test_cases": [
          {"input": "test input 1", "expected_output": "expected output 1"},
          {"input": "test input 2", "expected_output": "expected output 2"}
        ]
      },
      {
        "coding_problem": "Problem 2",
        "solution": "Solution 2",
        "test_cases": [
          {"input": "test input A", "expected_output": "expected output A"},
          {"input": "test input B", "expected_output": "expected output B"}
        ]
      }
    ]

    Only return valid JSON without additional text, explanations, or markdown formatting.`;

    try {
      const result = await chatSession.sendMessage(InputPrompt);
      let rawResponse = await result.response.text();

      console.log("Raw AI Response:", rawResponse);

      let cleanedJson = rawResponse.trim();

      // ✅ Remove Markdown code blocks if AI includes ```json ... ```
      if (cleanedJson.startsWith("```json")) {
        cleanedJson = cleanedJson.replace(/```json|```/g, "").trim();
      }

      // ✅ Extract only JSON (removes text before/after JSON)
      const startIdx = cleanedJson.indexOf("[");
      const endIdx = cleanedJson.lastIndexOf("]");

      if (startIdx !== -1 && endIdx !== -1) {
        cleanedJson = cleanedJson.substring(startIdx, endIdx + 1);
      } else {
        console.error("No valid JSON found in AI response:", rawResponse);
        alert("AI response is not in the correct format. Please try again.");
        setLoading(false);
        return;
      }

      // ✅ Remove ```java from "solution" fields inside JSON
      try {
        cleanedJson = cleanedJson.replace(/```java|```/g, ""); // Removes Java markdown formatting
        cleanedJson = cleanedJson.replace(/,\s*([\]}])/g, "$1"); // Removes trailing commas
        JSON.parse(cleanedJson); // Check if it's valid JSON
      } catch (jsonError) {
        console.error("Invalid JSON:", jsonError.message, "\nRaw Response:", rawResponse);
        alert("AI returned invalid JSON. Please try again.");
        setLoading(false);
        return;
      }

      const parsedJson = JSON.parse(cleanedJson);
      console.log("Parsed JSON:", parsedJson);
      setJsonResponse(parsedJson);

      // ✅ Ensure createdBy is NEVER NULL
      const createdBy = user?.isSignedIn && user?.primaryEmailAddress?.emailAddress
        ? user.primaryEmailAddress.emailAddress
        : "guest_user";

      // Insert into Database
      const resp = await db
        .insert(CodingQuestions)
        .values({
          mockId: uuidv4(),
          jsonMockResp: JSON.stringify(parsedJson),
          jobPosition: formData.jobRole,
          jobDesc: formData.description,
          jobExperience: formData.experience,
          company: formData.company,
          createdBy, // ✅ Fix ensures it's never null
          createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
        })
        .returning({ mockId: CodingQuestions.mockId });

      console.log("Inserted ID:", resp);

      if (resp.length > 0) {
        setTimeout(() => {
          setOpenDialog(false); // Close popup after saving
          router.push(`/dashboard/coding/${resp[0]?.mockId}`);
        }, 1000);
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
      alert("Failed to generate questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    {/* Button to Open Popup */}
    <div
      className="relative flex aspect-[2/1] w-full max-w-md flex-col items-center justify-center rounded-xl border p-8 text-center bg-white shadow-xl cursor-pointer"
      onClick={() => setOpenDialog(true)}
    >
      <h2 className="font-bold text-sm text-gray-800">+ Add new</h2>
    </div>

    {/* Popup Dialog */}
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      {openDialog && <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"></div>}
      <DialogContent className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl max-w-md">
        {/* Header */}
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Add New Interview</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Job Role"
              value={formData.jobRole}
              onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
              className="w-full p-2 border rounded-md"
            />
            <input
              type="text"
              placeholder="Job Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border rounded-md"
            />
            <input
              type="number"
              placeholder="Experience"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              className="w-full p-2 border rounded-md"
            />
            <input
              type="text"
              placeholder="Company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full p-2 border rounded-md"
            />

            <div className="flex justify-end gap-3">
              <Button type="button" onClick={() => setOpenDialog(false)} className="border px-4 py-2">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-black text-white px-4 py-2">
                {loading ? <><LoaderCircle className="animate-spin" /> Generating...</> : "Generate Questions"}
              </Button>
            </div>
          </form>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  </>

  );
};

export default Questions;
