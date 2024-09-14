interface NotificationProps {
    message: string
    onClose: () => void
}

export default function Notification({ message, onClose }: NotificationProps) {
    return (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg">
            <p>{message}</p>
            <button
                className="absolute top-1 right-2 text-white"
                onClick={onClose}
            >
                &times;
            </button>
        </div>
    )
}