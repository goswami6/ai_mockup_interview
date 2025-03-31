"use client";

import { eq } from "drizzle-orm";
import React, { useEffect, useState, useRef } from "react";
import RecordAnswerSection from "./_components/RecordAnswerSection";
import Link from "next/link";
import { db } from "../../../../../utils/db";
import { MockInterview } from "../../../../../utils/schema";
import QuestionsSection from "./_components/QuestionsSection";
import { Button } from "@/components/ui/button";
import * as faceapi from "face-api.js";

function StartInterview({ params }) {
  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [userName, setUserName] = useState("User");
  const [expression, setExpression] = useState("");

  const videoRef = useRef(null);
  const expressionIntervalRef = useRef(null);

  // Load Face API Models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/model");
        await faceapi.nets.faceExpressionNet.loadFromUri("/model");
      } catch (error) {
        console.error("Error loading Face API models:", error);
      }
    };
    loadModels();
  }, []);

  // Start video stream (without showing it)
  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };

    startVideo();
  }, []);

  // Analyze face expressions in real time (background process)
  useEffect(() => {
    const analyzeFace = async () => {
      if (!videoRef.current) return;

      const detections = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections) {
        const { expressions } = detections;
        const maxExpression = Object.keys(expressions).reduce((a, b) =>
          expressions[a] > expressions[b] ? a : b
        );
        setExpression(maxExpression);
      }
    };

    if (!expressionIntervalRef.current) {
      expressionIntervalRef.current = setInterval(analyzeFace, 1000);
    }

    return () => {
      clearInterval(expressionIntervalRef.current);
      expressionIntervalRef.current = null;
    };
  }, []);

  // Fetch interview details
  useEffect(() => {
    const fetchInterviewDetails = async () => {
      try {
        if (!params?.interviewId) {
          console.error("Error: Missing interviewId in params.");
          return;
        }

        const result = await db
          .select()
          .from(MockInterview)
          .where(eq(MockInterview.mockId, params.interviewId));

        if (!result.length) {
          console.error("Error: No interview found for given ID.");
          return;
        }

        let jsonMockResp;
        try {
          jsonMockResp = JSON.parse(result[0].jsonMockResp);
        } catch (error) {
          console.error("Error parsing JSON:", error);
          return;
        }

        jsonMockResp.unshift({ question: `Welcome ${userName}! Please introduce yourself.` });

        setMockInterviewQuestion(jsonMockResp);
        setInterviewData(result[0]);
      } catch (error) {
        console.error("Error fetching interview details:", error);
      }
    };

    fetchInterviewDetails();
  }, [params?.interviewId, userName]);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      const chosenVoice =
        voices.find((voice) => voice.name.includes("Google UK English Male")) || voices[0];

      setSelectedVoice(chosenVoice);
    };

    speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices(); // Call immediately in case voices are already loaded
  }, []);

  // Simulate human-like speech with pauses
  const speakQuestion = (text) => {
    if (!window.speechSynthesis || !selectedVoice) {
      console.error("Speech Synthesis not supported or voice not loaded.");
      return;
    }

    speechSynthesis.cancel();

    const sentences = text.split(". ");

    const speakSentence = (index) => {
      if (index >= sentences.length) return;

      const utterance = new SpeechSynthesisUtterance(sentences[index] + ".");
      utterance.voice = selectedVoice;
      utterance.rate = 0.85;
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setTimeout(() => speakSentence(index + 1), 600);
      };

      speechSynthesis.speak(utterance);
    };

    speakSentence(0);
  };

  useEffect(() => {
    if (mockInterviewQuestion.length > 0 && selectedVoice) {
      if (activeQuestionIndex === 0) {
        speakQuestion(`Hello ${userName}! Let's begin. ${mockInterviewQuestion[activeQuestionIndex].question}`);
      } else {
        speakQuestion(mockInterviewQuestion[activeQuestionIndex].question);
      }
    }
  }, [activeQuestionIndex, mockInterviewQuestion, selectedVoice]);

  return (
    <div>
      {/* Invisible Video Stream for Face Detection */}
      <video ref={videoRef} autoPlay muted className="hidden" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Questions Section */}
        <QuestionsSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          answeredQuestions={answeredQuestions}
          setActiveQuestionIndex={setActiveQuestionIndex}
        />

        {/* Video/Audio Recording Section */}
        <RecordAnswerSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          setActiveQuestionIndex={setActiveQuestionIndex}
          answeredQuestions={answeredQuestions}
          setAnsweredQuestions={setAnsweredQuestions}
          interviewData={interviewData}
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-end gap-6 bg-white p-4 text-white">
      {activeQuestionIndex>0&&  
          <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex-1)}>Previous Question</Button>}
          {activeQuestionIndex!=mockInterviewQuestion?.length-1&& 
           <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex+1)}>Next Question</Button>}
          {activeQuestionIndex==mockInterviewQuestion?.length-1&&  
          <Link href={'/dashboard/interview/'+interviewData?.mockId+"/feedback"}>
          <Button >End Interview</Button>
          </Link>}
      </div>
    </div>
  );
}

export default StartInterview;
