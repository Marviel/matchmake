'use client'

import {
  useEffect,
  useState,
} from 'react';

import AudioRecorder from '../components/AudioRecorder';
import CardStack from '../components/CardStack';
import Notification from '../components/Notification';

export default function CardsPage() {
    const [cards, setCards] = useState<{ id: number; text: string }[]>([])
    const [showNotification, setShowNotification] = useState<boolean>(false)

    useEffect(() => {
        // Fetch initial cards from API
        fetchCards()
    }, [])

    const fetchCards = async () => {
        // TODO: Implement API call to fetch cards
        const mockCards = [
            { id: 1, text: "What's your favorite travel destination?" },
            { id: 2, text: "Tell me about your family." },
            { id: 3, text: "What are your long-term goals?" },
        ]
        setCards(mockCards)
    }

    const handleNewCardRequest = () => {
        // TODO: Implement API call to get a new card
        const newCard = { id: Date.now(), text: "What's your biggest fear?" }
        setCards([...cards, newCard])
    }

    const handleAudioTranscription = (transcript) => {
        // TODO: Send transcript to API for analysis
        // For now, we'll just show a notification randomly
        if (Math.random() > 0.8) {
            setShowNotification(true)
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold mb-8">AI Date Cards</h1>
            <div className="flex justify-between">
                <CardStack cards={cards} onNewCardRequest={handleNewCardRequest} />
                <AudioRecorder onTranscription={handleAudioTranscription} />
            </div>
            {showNotification && (
                <Notification
                    message="New conversation topic suggested!"
                    onClose={() => setShowNotification(false)}
                />
            )}
        </div>
    )
}
