import {
  useEffect,
  useRef,
  useState,
} from 'react';

interface AudioRecorderProps {
    onTranscription: (transcript: string) => void
}

export default function AudioRecorder({ onTranscription }: AudioRecorderProps) {
    const [isRecording, setIsRecording] = useState(false)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const audioChunksRef = useRef<Blob[]>([])

    useEffect(() => {
        if (isRecording) {
            startRecording()
        } else {
            stopRecording()
        }
    }, [isRecording])

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            mediaRecorderRef.current = new MediaRecorder(stream)
            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data)
            }
            mediaRecorderRef.current.onstop = handleAudioData
            mediaRecorderRef.current.start(1000) // Collect data every second
        } catch (error) {
            console.error('Error accessing microphone:', error)
        }
    }

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop()
        }
    }

    const handleAudioData = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        audioChunksRef.current = []

        // TODO: Send audioBlob to OpenAI API for transcription
        // For now, we'll just simulate a transcription
        const mockTranscript = "This is a simulated transcript of the conversation."
        onTranscription(mockTranscript)
    }

    return (
        <div className="flex flex-col items-center">
            <button
                className={`${isRecording ? 'bg-red-500' : 'bg-green-500'
                    } text-white font-bold py-2 px-4 rounded`}
                onClick={() => setIsRecording(!isRecording)}
            >
                {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
            <p className="mt-2">{isRecording ? 'Recording...' : 'Not recording'}</p>
        </div>
    )
}