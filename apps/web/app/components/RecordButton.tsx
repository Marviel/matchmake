import React, {
    useEffect,
    useState,
} from 'react';

interface RecordButtonProps {
    isRecording: boolean;
    onClick: () => void;
}

const RecordButton: React.FC<RecordButtonProps> = ({ isRecording, onClick }) => {
    const [volume, setVolume] = useState(0);

    useEffect(() => {
        if (isRecording) {
            // Simulate volume changes
            const interval = setInterval(() => {
                setVolume(Math.random());
            }, 100);
            return () => clearInterval(interval);
        } else {
            setVolume(0);
        }
    }, [isRecording]);

    const buttonSize = 120 + volume * 40; // Base size + up to 40px growth

    return (
        <button
            onClick={onClick}
            className={`rounded-full transition-all duration-150 flex items-center justify-center font-bold text-white ${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                }`}
            style={{
                width: `${buttonSize}px`,
                height: `${buttonSize}px`,
            }}
        >
            {isRecording ? 'Stop' : 'Record'}
        </button>
    );
};

export default RecordButton;