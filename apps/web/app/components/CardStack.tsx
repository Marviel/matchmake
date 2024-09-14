import { useState } from 'react';

interface Card {
    id: number
    text: string
}

interface CardStackProps {
    cards: Card[]
    onNewCardRequest: () => void
}

export default function CardStack({ cards, onNewCardRequest }: CardStackProps) {
    const [currentIndex, setCurrentIndex] = useState(0)

    const handleSwipe = () => {
        if (currentIndex < cards.length - 1) {
            setCurrentIndex(currentIndex + 1)
        } else {
            onNewCardRequest()
        }
    }

    return (
        <div className="relative w-64 h-96">
            {cards.slice(currentIndex).map((card, index) => (
                <div
                    key={card.id}
                    className="absolute w-full h-full bg-white shadow-md rounded-lg p-4 flex items-center justify-center text-center cursor-pointer transition-transform duration-300 ease-in-out"
                    style={{
                        transform: `translateY(${index * 10}px) scale(${1 - index * 0.05})`,
                        zIndex: cards.length - index,
                    }}
                    onClick={handleSwipe}
                >
                    <p>{card.text}</p>
                </div>
            ))}
        </div>
    )
}