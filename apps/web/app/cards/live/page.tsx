'use client';

import React, { useState } from 'react';

interface Topic {
    type: string;
    content: string;
}

export default function LivePage() {
    const [userProfile1, setUserProfile1] = useState('30-year-old software engineer from New York');
    const [userProfile2, setUserProfile2] = useState('28-year-old artist from San Francisco');
    const [topics, setTopics] = useState<Topic[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchTopics = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/topics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userProfiles: [userProfile1, userProfile2],
                    alreadySuggestedTopics: topics,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch topics');
            }

            const data = await response.json();
            setTopics((prevTopics) => [...prevTopics, ...data.topics]);
        } catch (error) {
            console.error('Error fetching topics:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">AI Date Cards - Live View</h1>

            <div className="mb-4">
                <label className="block mb-2">User Profile 1:</label>
                <input
                    type="text"
                    value={userProfile1}
                    onChange={(e) => setUserProfile1(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>

            <div className="mb-4">
                <label className="block mb-2">User Profile 2:</label>
                <input
                    type="text"
                    value={userProfile2}
                    onChange={(e) => setUserProfile2(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>

            <button
                onClick={fetchTopics}
                disabled={isLoading}
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300"
            >
                {isLoading ? 'Loading...' : 'Generate Topics'}
            </button>

            <div className="mt-4">
                <h2 className="text-xl font-semibold mb-2">Generated Topics:</h2>
                {topics.length === 0 ? (
                    <p>No topics generated yet.</p>
                ) : (
                    <ul className="list-disc pl-5">
                        {topics.map((topic, index) => (
                            <li key={index} className="mb-2">
                                <span className="font-semibold">{topic.type}:</span> {topic.content}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}