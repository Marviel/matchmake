"use client";

import React, {
    useEffect,
    useRef,
    useState,
} from 'react';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

import RecordButton from './components/RecordButton';
import TopicCard from './components/TopicCard';

const REFRESH_INTERVAL_MS = 10_000;

interface LivePageProps {
    profileContent: any;
    topics: any[];
    isLoading: boolean;
    onTranscriptUpdate: (transcript: string) => void;
}

export default function LivePage({ profileContent, topics, isLoading, onTranscriptUpdate }: LivePageProps) {
    const router = useRouter();
    const [result, setResult] = useState<string>('');
    const [isListening, setIsListening] = useState<boolean>(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [seenTopics, setSeenTopics] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (typeof window !== 'undefined') {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    const newMediaRecorder = new MediaRecorder(stream);
                    newMediaRecorder.ondataavailable = e => {
                        chunksRef.current.push(e.data);
                    };
                    mediaRecorderRef.current = newMediaRecorder;
                })
                .catch(err => console.error('Error accessing microphone:', err));
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    const startListening = () => {
        setIsListening(true);
        recordAndTranscribe();
        timerRef.current = setInterval(recordAndTranscribe, REFRESH_INTERVAL_MS);
    };

    const stopListening = () => {
        setIsListening(false);
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
    };

    const recordAndTranscribe = () => {
        if (mediaRecorderRef.current) {
            if (mediaRecorderRef.current.state === 'recording') {
                mediaRecorderRef.current.stop();
            } else {
                chunksRef.current = [];
                mediaRecorderRef.current.start();
                setTimeout(() => {
                    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                        mediaRecorderRef.current.stop();
                    }
                }, 1900); // Stop just before the next interval to ensure we capture audio
            }

            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
                const reader = new FileReader();
                reader.readAsDataURL(audioBlob);
                reader.onloadend = async function () {
                    const base64Audio = reader.result?.toString().split(',')[1];
                    try {
                        const response = await fetch("/api/transcript", {
                            method: "POST",
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ audio: base64Audio }),
                        });
                        const data = await response.json();
                        if (response.status === 200) {
                            setResult(prev => prev + ' ' + data.transcript);
                        } else {
                            throw new Error(`Request failed with status ${response.status}`);
                        }
                    } catch (error: any) {
                        console.error('Transcription error:', error);
                    }
                };
            };
        }
    };

    useEffect(() => {
        // Update the parent component with the new transcript
        onTranscriptUpdate(result);
    }, [result, onTranscriptUpdate]);

    const filteredTopics = topics.filter(topic => !seenTopics.has(topic.content));

    const handleSwipe = () => {
        if (filteredTopics.length > 0) {
            const removedTopic = filteredTopics[0];
            setSeenTopics(prev => new Set(prev).add(removedTopic.content));
        }
    };

    const handleBack = () => {
        router.push('/'); // This will remove all query parameters
    };

    return (
        <div className="container mx-auto p-4 text-black flex flex-col items-center">
            <div className="w-full mb-4">
                <button
                    onClick={handleBack}
                    className="px-4 py-2 bg-gray-600 text-white rounded-full text-lg font-semibold hover:bg-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center"
                >
                    <ArrowLeft className="mr-2" size={20} /> Back
                </button>
            </div>
            <div className="flex flex-col items-center mb-8">
                <div className="w-40 h-40 flex items-center justify-center">
                    <RecordButton isRecording={isListening} onClick={isListening ? stopListening : startListening} />
                </div>
                <p className="mt-4 text-lg font-semibold">
                    {isListening ? 'Listening...' : 'Click to start recording'}
                </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* <div className="space-y-6">
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden p-6">
                        <h2 className="text-2xl font-bold mb-4">Transcript</h2>
                        <p className="whitespace-pre-wrap">{result}</p>
                    </div>
                </div> */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold mb-4 text-center">Suggested Topics:</h3>
                    {filteredTopics.length > 0 ? (
                        <TopicCard topic={filteredTopics[0]} onSwipe={handleSwipe} />
                    ) : (
                        <div className="bg-white shadow-lg rounded-lg overflow-hidden p-6 text-center">
                            <p className="text-xl text-black">No more topics</p>
                        </div>
                    )}
                    {isLoading && (
                        <div className="text-center">
                            <p className="text-lg text-gray-600">Loading more topics...</p>
                        </div>
                    )}
                    {/* <button
                        onClick={() => {}}
                        className="w-full px-6 py-3 bg-red-600 text-white rounded-full text-lg font-semibold hover:bg-red-700 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
                        disabled={isLoading}
                    >
                        <Heart className="mr-2" size={20} /> {isLoading ? 'Loading...' : 'Generate New Topics'}
                    </button> */}
                </div>
            </div>
        </div>
    );
}