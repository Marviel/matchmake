"use client";
import React, { useState } from 'react';

import {
  ChevronLeft,
  Cigarette,
  Coffee,
  Heart,
  User,
  Users,
  Wine,
} from 'lucide-react';

export default function Component() {
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [showProfiles, setShowProfiles] = useState(false)
  const [showTextareas, setShowTextareas] = useState(false)
  const [profileContent, setProfileContent] = useState({
    them: "Techy by day, fashion geek by night. Seeking a strong, dependable partner to share adventures and create epic memories. If you're assertive, loyal, and ready for something real, swipe right, and let's turn our story into a bestseller.\n\nI'm all about pushing boundaries, both in my career and personal life. Whether it's mastering a new design software or planning an impromptu weekend getaway, I thrive on challenges and new experiences. I believe in work-life balance and making time for the things that truly matter.\n\nLooking for someone who appreciates good design, isn't afraid to debate the merits of serif vs. sans-serif fonts, and is always up for trying that new fusion restaurant in town. Bonus points if you can teach me something new – I'm always eager to learn!",
    me: "Code wizard by profession, adventure seeker by passion. Looking for a partner in crime to explore life's mysteries and create lasting memories. If you're ambitious, kind-hearted, and enjoy both quiet nights in and spontaneous adventures, let's connect and see where our journey takes us.\n\nI find beauty in elegant code and efficiency in well-designed systems. My work is my passion, but I know how to unplug and enjoy life beyond the screen. I'm equally comfortable debugging a complex algorithm or strumming my guitar around a campfire under the stars.\n\nIdeal match? Someone who appreciates intellectual discussions, shares my love for both technology and nature, and isn't afraid to dream big. If you're up for coding marathons followed by actual marathons, we might just be a perfect match!"
  })

  const [topics, setTopics] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const cards = [
    { title: "Shared, go deep", topic: "Fashion", type: "shared" },
    { title: "Find out", topic: "Having kids", type: "find" },
    { title: "Shared, go deep", topic: "Travel experiences", type: "shared" },
    { title: "Find out", topic: "How often do you drink? Is Sam ok with that?", type: "find" },
    { title: "Find out", topic: "Which cuisines do you share?", type: "find" }
  ]

  const fetchTopics = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/topics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProfiles: [profileContent.them, profileContent.me],
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

  const handleAnalyze = () => {
    setShowAnalysis(true)
    fetchTopics()
  }

  const handleNewProfiles = () => {
    setShowTextareas(true)
    setShowAnalysis(false)
  }

  const handleSaveProfiles = () => {
    setShowTextareas(false)
  }

  const ProfileCard = ({ title, content, tags }: any) => (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-3 flex items-center"><User className="mr-2" size={24} /> {title}</h2>
        <div className="space-y-3">
          {content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-sm">{paragraph}</p>
          ))}
          <div className="flex items-center space-x-2 text-gray-600">
            <Coffee className="mr-1" size={18} />
            <span>{tags.interests}</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.badges.map((badge, index) => (
              <span key={index} className="px-2 py-1 bg-gray-200 text-sm rounded-full flex items-center">
                {badge.icon && <badge.icon className="mr-1" size={14} />}
                {badge.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`space-y-6 ${showProfiles ? 'block' : 'hidden lg:block'}`}>
          {showTextareas ? (
            <>
              <div className="space-y-4">
                <label htmlFor="them-profile" className="block text-lg font-medium">Their Profile</label>
                <textarea
                  id="them-profile"
                  className="w-full h-64 p-2 border rounded-md"
                  value={profileContent.them}
                  onChange={(e) => setProfileContent(prev => ({ ...prev, them: e.target.value }))}
                />
              </div>
              <div className="space-y-4">
                <label htmlFor="my-profile" className="block text-lg font-medium">My Profile</label>
                <textarea
                  id="my-profile"
                  className="w-full h-64 p-2 border rounded-md"
                  value={profileContent.me}
                  onChange={(e) => setProfileContent(prev => ({ ...prev, me: e.target.value }))}
                />
              </div>
              <button
                onClick={handleSaveProfiles}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-full text-lg font-semibold hover:bg-green-700 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
              >
                Save Profiles
              </button>
            </>
          ) : (
            <>
              <ProfileCard
                title="Them"
                content={profileContent.them}
                tags={{
                  interests: "Hiking, photography, trying new restaurants",
                  badges: [
                    { text: "No kids", icon: null },
                    { text: "Sometimes drinks", icon: Wine }
                  ]
                }}
              />
              <ProfileCard
                title="Me"
                content={profileContent.me}
                tags={{
                  interests: "Traveling, coding, playing guitar",
                  badges: [
                    { text: "Wants kids", icon: null },
                    { text: "Doesn't smoke", icon: Cigarette },
                    { text: "Doesn't drink", icon: Wine }
                  ]
                }}
              />
              <button
                onClick={handleNewProfiles}
                className="w-full px-6 py-3 bg-gray-600 text-white rounded-full text-lg font-semibold hover:bg-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
              >
                Analyze new profiles
              </button>
            </>
          )}
        </div>
        <div className="space-y-4">
          {!showAnalysis ? (
            <div className="bg-white shadow-lg rounded-lg overflow-hidden p-6 text-center">
              <Users size={48} className="mx-auto mb-4" />
              <p className="text-xl">I'll analyze the things you share and things you need to discuss</p>
            </div>
          ) : isLoading ? (
            <div className="bg-white shadow-lg rounded-lg overflow-hidden p-6 text-center">
              <p className="text-xl">Loading topics...</p>
            </div>
          ) : (
            topics.map((topic, index) => (
              <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-all hover:scale-105">
                <div className={`p-6 text-center ${topic.type === 'shared'
                  ? 'bg-gradient-to-br from-pink-100 to-purple-100'
                  : 'bg-gradient-to-br from-blue-100 to-cyan-100'
                  }`}>
                  <p className="text-2xl font-bold mb-2">{topic.title}</p>
                  <p className="text-lg text-gray-600">{topic.content}</p>
                </div>
              </div>
            ))
          )}
          <button
            onClick={handleAnalyze}
            className="w-full px-6 py-3 bg-red-600 text-white rounded-full text-lg font-semibold hover:bg-red-700 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
            disabled={isLoading}
          >
            <Heart className="mr-2" size={20} /> {isLoading ? 'Loading...' : 'Give ideas to talk about'}
          </button>
        </div>
      </div>
      <div className="mt-6 lg:hidden">
        <button
          onClick={() => setShowProfiles(!showProfiles)}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
        >
          {showProfiles ? <ChevronLeft className="mr-2" size={20} /> : null}
          {showProfiles ? "Back to Analysis" : "Profiles"}
        </button>
      </div>
    </div>
  )
}