"use client";

import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import styles from './page.module.css';

const REFRESH_INTERVAL_MS = 10_000;

export default function LivePage() {

    const [result, setResult] = useState<string>('');
    const [isListening, setIsListening] = useState<boolean>(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

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

    return (
        <main className={styles.main}>
            <div className={styles.description}>
                <h2>Convert audio to text <span>-&gt;</span></h2>
                <button onClick={isListening ? stopListening : startListening}>
                    {isListening ? 'Stop Listening' : 'Start Listening'}
                </button>
                <p>{result}</p>
            </div>
        </main>
    );
}