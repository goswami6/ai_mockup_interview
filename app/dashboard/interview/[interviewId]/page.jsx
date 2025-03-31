"use client";
import { Button } from "@/components/ui/button";
import { eq } from "drizzle-orm";
import { Lightbulb, WebcamIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import { db } from "../../../../utils/db";
import { MockInterview } from "../../../../utils/schema";

function Interview({ params }) {
  const [interviewData, setInterviewData] = useState();
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  const [webCamError, setWebCamError] = useState("");
  const [multipleFacesDetected, setMultipleFacesDetected] = useState(false);
  const [isStartDisabled, setIsStartDisabled] = useState(true); // Button state

  const webcamRef = useRef(null);
  const detectionIntervalRef = useRef(null); // Store interval reference

  useEffect(() => {
    GetInterviewDetails();
  }, []);

  /**
   * Get Interview Details by MockId/Interview Id
   */
  const GetInterviewDetails = async () => {
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId));
      setInterviewData(result[0]);
    } catch (error) {
      console.error("Error fetching interview details:", error);
    }
  };

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/model");
        console.log("Face detection models loaded successfully.");
      } catch (error) {
        console.error("Error loading face detection models:", error);
      }
    };

    loadModels();
  }, []);

  /**
   * Handle Webcam Permission & Start Face Detection
   */
  const handleWebcamEnable = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setWebCamEnabled(true);
      setWebCamError("");
  
      // Load models before starting detection
      await faceapi.nets.tinyFaceDetector.loadFromUri("/model");
      startFaceDetection();
    } catch (error) {
      console.error("Webcam error:", error);
      setWebCamError("Failed to access the webcam. Please allow camera permissions.");
      setWebCamEnabled(false);
      setIsStartDisabled(true);
    }
  };
  

  /**
   * Start Face Detection
   */
  const startFaceDetection = async () => {
    if (!webcamRef.current || !webcamRef.current.video) return;
  
    const video = webcamRef.current.video;
  
    // Ensure video is loaded and dimensions are valid
    // if (video.readyState !== 4 || video.videoWidth === 0 || video.videoHeight === 0) {
    //   console.warn("Video not ready for face detection.");
    //   return;
    // }
  
    // Ensure models are loaded before starting detection
    if (!faceapi.nets.tinyFaceDetector.isLoaded) {
      console.warn("Face detection model not loaded yet.");
      return;
    }
  
    // Clear previous intervals
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }
  
    detectionIntervalRef.current = setInterval(async () => {
      if (!video || video.readyState !== 4) return;
  
      const detections = await faceapi.detectAllFaces(
        video,
        new faceapi.TinyFaceDetectorOptions()
      );
  
      console.log("Detections:", detections.length);
  
      // Disable the button when exactly one face is detected
      if (detections.length === 1) {
        setMultipleFacesDetected(false);
        setIsStartDisabled(false);
      } else {
        setMultipleFacesDetected(detections.length !== 1);
        setIsStartDisabled(true);
      }
    }, 1000);
  };
  
  

  return (
    <div style={{ marginTop: "40px", padding: "20px" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", textAlign: "center" }}>
        Let's Get Started
      </h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {/* Top Section */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "space-between",
          }}
        >
          {/* Left Section */}
          <div style={{ flex: 1, minWidth: "300px" }}>
            <div
              style={{
                padding: "20px",
                borderRadius: "10px",
                border: "1px solid #ddd",
                background: "#f9f9f9",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h2 style={{ fontSize: "18px", marginBottom: "10px" }}>
                <strong>Job Role:</strong> {interviewData?.jobPosition}
              </h2>
              <h2 style={{ fontSize: "18px", marginBottom: "10px" }}>
                <strong>Tech Stack:</strong> {interviewData?.jobDesc}
              </h2>
              <h2 style={{ fontSize: "18px" }}>
                <strong>Experience:</strong> {interviewData?.jobExperience} years
              </h2>
            </div>

            {/* Important Note Section */}
            <div
              style={{
                padding: "20px",
                borderRadius: "10px",
                border: "1px solid #fbbf24",
                background: "#fef3c7",
                marginTop: "20px",
              }}
            >
              <h2
                style={{
                  display: "flex",
                  alignItems: "center",
                  color: "#f59e0b",
                  fontWeight: "bold",
                  gap: "10px",
                }}
              >
                <Lightbulb />
                Important Note
              </h2>
              <h2 style={{ marginTop: "10px", color: "#d97706" }}>
                Ensure only **one** person is in front of the camera. The interview will not start if multiple faces are detected.
              </h2>
            </div>
          </div>

          {/* Right Section (Webcam) */}
          <div
            style={{
              flex: 1,
              minWidth: "300px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {webCamEnabled ? (
              <>
                <Webcam
                  ref={webcamRef}
                  mirrored={true}
                  style={{
                    height: "300px",
                    width: "100%",
                    borderRadius: "10px",
                    border: "2px solid #ddd",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                />
                {multipleFacesDetected && (
                  <p style={{ color: "red", marginTop: "10px", fontWeight: "bold" }}>
                    ⚠️ Multiple faces detected. Please ensure only one person is visible.
                  </p>
                )}
              </>
            ) : (
              <>
                <WebcamIcon
                  style={{
                    height: "300px",
                    width: "100%",
                    padding: "50px",
                    background: "#e5e7eb",
                    borderRadius: "10px",
                    border: "2px dashed #d1d5db",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#6b7280",
                  }}
                />
                <Button
                  style={{
                    width: "100%",
                    backgroundColor: "#2563eb",
                    color: "white",
                    padding: "10px",
                    borderRadius: "8px",
                    fontSize: "16px",
                    marginTop: "10px",
                  }}
                  onClick={handleWebcamEnable}
                >
                  Enable Web Cam and Microphone
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Start Interview Button */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
          <Link href={`/dashboard/interview/${params.interviewId}/start`}>
            <Button disabled={isStartDisabled}
              style={{
                backgroundColor: isStartDisabled ? "#d1d5db" : "#10b981",
                color: "white",
                padding: "10px 20px",
                borderRadius: "8px",
                fontSize: "16px",
              }}>
              Start Interview
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Interview;
