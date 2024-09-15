import React from 'react';

import {
    AlertTriangle,
    Search,
    Share2,
    Sparkles,
} from 'lucide-react';

const typeIcons = {
    'find-out': Search,
    'shared-go-deeper': Share2,
    'navigate-tension': AlertTriangle,
};

const typeLabels = {
    'find-out': 'Find Out',
    'shared-go-deeper': 'Shared, Go Deeper',
    'navigate-tension': 'Navigate Tension',
};

interface TopicCardProps {
    topic: {
        type: 'find-out' | 'shared-go-deeper' | 'navigate-tension';
        content: string;
        origin?: 'live';
    };
    onSwipe?: () => void;
}

const TopicCard: React.FC<TopicCardProps> = ({ topic, onSwipe }) => {
    const TypeIcon = typeIcons[topic.type];
    const typeLabel = typeLabels[topic.type];

    const handleSwipe = () => {
        if (onSwipe) {
            onSwipe();
        }
    };

    return (
        <div
            className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-all hover:scale-105 relative text-center cursor-pointer"
            onClick={handleSwipe}
        >
            <div className={`p-6 ${topic.type === 'shared-go-deeper'
                    ? 'bg-gradient-to-br from-pink-100 to-purple-100'
                    : topic.type === 'find-out'
                        ? 'bg-gradient-to-br from-blue-100 to-cyan-100'
                        : 'bg-gradient-to-br from-yellow-100 to-orange-100'
                }`}>
                <h3 className="text-sm text-gray-600">{typeLabel}</h3>
                <p className="text-xl font-bold mb-2 text-black">{topic.content}</p>
                {topic.origin === 'live' && (
                    <div className="absolute top-2 right-2 text-yellow-500">
                        <Sparkles size={20} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default TopicCard;