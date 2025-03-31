"use client"

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic, StopCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { chatSession } from '../../../../../../utils/GeminiAIModel';
import { db } from '../../../../../../utils/db';
import { UserAnswer } from '../../../../../../utils/schema';

function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, setActiveQuestionIndex, interviewData, answeredQuestions, setAnsweredQuestions }) {
    const [userAnswer, setUserAnswer] = useState('');
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const [confidence, setConfidence] = useState(null);

    const { isRecording, results, startSpeechToText, stopSpeechToText, setResults } = useSpeechToText({
        continuous: false,
        useLegacyResults: false
    });

    useEffect(() => {
        if (results.length > 0) {
            const newTranscript = results.map(res => res.transcript).join(' ');
            const newConfidence = results.map(res => res.confidence).reduce((a, b) => a + b, 0) / results.length || 0;

            setUserAnswer(prevAns => prevAns + ' ' + newTranscript);
            setConfidence(newConfidence.toFixed(2));
        }
    }, [results]);

    useEffect(() => {
        if (!isRecording && userAnswer.trim().length > 10) {
            UpdateUserAnswer();
        }
    }, [isRecording]);

    const StartStopRecording = () => {
        if (isRecording) {
            stopSpeechToText();
        } else {
            setUserAnswer('');
            setConfidence(null);
            startSpeechToText();
        }
    };

    const UpdateUserAnswer = async () => {
        if (!userAnswer.trim()) {
            toast.error('Please provide an answer before submitting.');
            return;
        }

        if (answeredQuestions.has(activeQuestionIndex)) {
            toast.warning("You've already answered this question.");
            return;
        }

        setLoading(true);

        const feedbackPrompt = `Question: ${mockInterviewQuestion[activeQuestionIndex]?.question}, \nUser Answer: ${userAnswer}.\nProvide JSON with 'rating' (1-5) and 'feedback' fields.`;

        try {
            const result = await chatSession.sendMessage(feedbackPrompt);
            if (!result || !result.response) throw new Error('Invalid AI response structure');
            
            const rawText = await result.response.text();
            if (!rawText) throw new Error('Empty AI response');

            const cleanJson = rawText.replace('```json', '').replace('```', '').trim();
            const JsonFeedbackResp = JSON.parse(cleanJson);

            if (!JsonFeedbackResp.rating || !JsonFeedbackResp.feedback) {
                throw new Error('AI response missing required fields');
            }

            const formattedDate = moment().format('YYYY-MM-DD');

            const resp = await db.insert(UserAnswer).values({
                mockIdRef: interviewData?.mockId,
                question: mockInterviewQuestion[activeQuestionIndex]?.question,
                correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
                userAns: userAnswer,
                feedback: JsonFeedbackResp?.feedback,
                rating: JsonFeedbackResp?.rating,
                confidence: confidence,
                userEmail: user?.primaryEmailAddress?.emailAddress,
                createdAt: formattedDate
            });

            if (resp) {
                toast.success('Answer submitted successfully! Moving to next question...');
                setUserAnswer('');
                setConfidence(null);
                setResults([]);

                setAnsweredQuestions(prev => new Set([...prev, activeQuestionIndex]));

                if (activeQuestionIndex < mockInterviewQuestion.length - 1) {
                    setActiveQuestionIndex(prevIndex => prevIndex + 1);
                } else {
                    toast.success('🎉 Interview completed!');
                }
            }
        } catch (error) {
            console.error('AI API Error:', error);
            toast.error('❌ AI failed to generate feedback. Please try again.');
        }

        setLoading(false);
    };

    return (
        <div className='flex flex-col items-center justify-center'>
            <div className='flex flex-col mt-10 justify-center items-center bg-black rounded-lg p-5 relative'>
                <Image src={'/webcam.png'} width={200} height={200} className='absolute' />
                <Webcam mirrored={true} style={{ height: 500, width: 500, zIndex: 10 }} />
            </div>
            <Button disabled={loading} variant='outline' className='my-10' onClick={StartStopRecording}>
                {isRecording ? (
                    <h2 className='text-red-600 animate-pulse flex gap-2 items-center'>
                        <StopCircle /> Stop Recording
                    </h2>
                ) : (
                    <h2 className='text-primary flex gap-2 items-center'>
                        <Mic /> Record Answer
                    </h2>
                )}
            </Button>
            {confidence !== null && (
                <p className='text-gray-400 mt-2'>Confidence: {confidence}%</p>
            )}
        </div>
    );
}

export default RecordAnswerSection;
