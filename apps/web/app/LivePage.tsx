"use client";
import React, {
    useEffect,
    useRef,
    useState,
} from 'react';

const LivePage: React.FC = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.start(1000); // Collect data every second
            setIsRecording(true);

            // Start the rolling buffer
            timerRef.current = setInterval(sendAudioChunk, 5000); // Send audio every 5 seconds
        } catch (error) {
            console.error('Error starting recording:', error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            audioChunksRef.current = [];
        }
    };

    const sendAudioChunk = async () => {
        if (audioChunksRef.current.length === 0) return;

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const reader = new FileReader();

        reader.onloadend = async () => {
            const base64Audio = reader.result as string;
            const base64Data = base64Audio.split(',')[1]; // Remove the data URL prefix

            try {
                const response = await fetch('/api/transcript', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ audio: base64Data }),
                });

                if (!response.ok) {
                    throw new Error('Transcription failed');
                }

                const data = await response.json();
                setTranscript((prev) => prev + ' ' + data.transcript);
            } catch (error) {
                console.error('Error sending audio chunk:', error);
            }
        };

        reader.readAsDataURL(audioBlob);
        audioChunksRef.current = []; // Clear the chunks after sending
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Live Transcription</h1>
            <div className="mb-4">
                {isRecording ? (
                    <button
                        onClick={stopRecording}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                        Stop Recording
                    </button>
                ) : (
                    <button
                        onClick={startRecording}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                        Start Recording
                    </button>
                )}
            </div>
            <div className="bg-gray-100 p-4 rounded min-h-[200px]">
                <h2 className="text-xl font-semibold mb-2">Transcript:</h2>
                <p>{transcript}</p>
            </div>
        </div>
    );
};

export default LivePage;
