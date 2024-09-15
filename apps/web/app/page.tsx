"use client";
import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  ChevronLeft,
  Cigarette,
  Coffee,
  Heart,
  Users,
  Wine,
} from 'lucide-react';
import Image from 'next/image';

// Add this new component for the popup
const ProfilePopup = ({ profile, onClose }: { profile: any; onClose: () => void }) => {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div ref={popupRef} className="bg-white p-6 rounded-lg max-w-2xl max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-black">{profile.name}'s Full Profile</h2>
        <div className="text-black whitespace-pre-wrap">{profile.body}</div>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const ProfileCard = ({ profile, tags }: any) => {
  const [showFullProfile, setShowFullProfile] = useState(false);
  const maxLength = 300; // Adjust this value to change the truncation length
  const truncatedBody = profile.body.length > maxLength
    ? profile.body.slice(0, maxLength) + '...'
    : profile.body;

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <Image
            src={profile.avatar}
            alt={`${profile.name}'s avatar`}
            width={48}
            height={48}
            className="rounded-full mr-4"
          />
          <h2 className="text-2xl font-bold text-black">{profile.name}</h2>
        </div>
        <div className="space-y-3">
          <div className="text-sm text-black whitespace-pre-wrap">
            {truncatedBody}
          </div>
          {profile.body.length > maxLength && (
            <button
              onClick={() => setShowFullProfile(true)}
              className="text-blue-600 hover:text-blue-800"
            >
              Show more
            </button>
          )}
          <div className="flex items-center space-x-2 text-black">
            <Coffee className="mr-1" size={18} />
            <span>{tags.interests}</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.badges.map((badge: { text: string, icon: React.ElementType | null }, index: number) => (
              <span key={index} className="px-2 py-1 bg-gray-200 text-sm rounded-full flex items-center text-black">
                {badge.icon && <badge.icon className="mr-1" size={14} />}
                {badge.text}
              </span>
            ))}
          </div>
        </div>
      </div>
      {showFullProfile && (
        <ProfilePopup profile={profile} onClose={() => setShowFullProfile(false)} />
      )}
    </div>
  );
};

export default function Component() {
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [showProfiles, setShowProfiles] = useState(false)
  const [showTextareas, setShowTextareas] = useState(false)
  const [profileContent, setProfileContent] = useState({
    them: {
      name: "Amber",
      avatar: "/greg.jpg", // Add this image to your public folder
      body: `
      🌟 Amber's Adventure Almanac 🌟

      📊 The Stats:
      Age: 29 | Height: 5'6" | Zodiac: Sagittarius (probably)

      🗣️ Fluent in: English, Mandarin Chinese, French, and Emoji 😉

      🏢 Day Job: Sr. Product Manager (aka Professional Post-it Note Enthusiast)

      🎓 Alma Mater: UIUC (Where dreams come true and coffee runs out)

      🧠 Belief System: Atheist (but I religiously believe in brunch)

      🏔️ Hobbies: Snowboarding (gracefully falling down mountains), Hiking (strategically getting lost in nature), and Pretending I'm in a Indie Movie Soundtrack

      👩‍🔬 Fun Fact: I can explain complex tech stuff using only pizza analogies

      🔍 Seeking: A partner in crime for long-term adventures (must enjoy dad jokes and spontaneous dance parties)

      💖 My Ideal Date: Solving escape rooms, then escaping to a cozy café for deep chats and deeper cappuccinos

      🚀 Life Motto: "Why blend in when you were born to stand out?" - Dr. Seuss (my spiritual guru)

      📚 Currently Reading: "How to Win Friends and Influence Algorithms"

      🎵 Anthem: "Nerd Girls Do It Better" (it's not a real song, but it should be)

      If you think you can keep up with my pun game and don't mind someone who occasionally talks to plants, swipe right! Let's create some epic coding errors together! 💻✨"
      `
    },
    me: {
      name: "Tati",
      avatar: "/tati.jpeg",
      body: `
      🌈 Tati's Technicolor Dream Profile 🌈

      📊 The Basics:
      Age: 36 | Height: 5'6" | Superpower: Getting ready in 2 minutes flat 🚀

      🗺️ Global Citizen: Third culture kid with a dash of 🇷🇺 and a sprinkle of 🇫🇮

      🗣️ Fluent in: 4 languages and interpretive dance

      🎨 Day Job: Designer & Artist (Professional Doodler Extraordinaire)

      🎓 Alma Mater: California College of Arts and Crafts (Where creativity flows and coffee never stops)

      🧠 Belief System: Atheist (but I worship at the altar of good design)

      🏞️ Hobbies: Yoga (pretzel impersonator), Hiking (professional tree hugger), and Jazz Appreciation (head-bobbing connoisseur)

      🧬 Fun Fact: I want to sequence my genome and turn it into art (DNA disco, anyone?)

      🔍 Seeking: A life partner for weird adventures and deep conversations

      💖 Ideal Date: Ambient music concert followed by stargazing and existential questions

      🚀 Life Motto: "Life is short, make it weird and beautiful"

      📚 Currently Contemplating: The intersection of quantum physics and modern art

      🎵 Playlist: "Jazzy Beats to Contemplate the Universe To"

      If you're into intellectual chats, creative shenanigans, and don't mind someone who occasionally talks to plants, let's connect! Bonus points if you can keep up with my globe-trotting stories and avant-garde art references. Ready to paint the town in all colors of the spectrum? 🎨✨
      `
    }
  })

  const [topics, setTopics] = useState<{ title: string, topic: string, type: 'shared-go-deeper' | 'find-out' | 'navigate-tension' }[]>([])
  const [isLoading, setIsLoading] = useState(false)

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

  return (
    <div className="container mx-auto p-4 text-black">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`space-y-6 ${showProfiles ? 'block' : 'hidden lg:block'}`}>
          {showTextareas ? (
            <>
              <div className="space-y-4">
                <label htmlFor="them-profile" className="block text-lg font-medium">Their Profile</label>
                <textarea
                  id="them-profile"
                  className="w-full h-64 p-2 border rounded-md"
                  value={profileContent.them.body}
                  onChange={(e) => setProfileContent(prev => ({ ...prev, them: { ...prev.them, body: e.target.value } }))}
                />
              </div>
              <div className="space-y-4">
                <label htmlFor="my-profile" className="block text-lg font-medium">My Profile</label>
                <textarea
                  id="my-profile"
                  className="w-full h-64 p-2 border rounded-md"
                  value={profileContent.me.body}
                  onChange={(e) => setProfileContent(prev => ({ ...prev, me: { ...prev.me, body: e.target.value } }))}
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
                profile={profileContent.them}
                tags={{
                  interests: "Hiking, photography, trying new restaurants",
                  badges: [
                    { text: "No kids", icon: null },
                    { text: "Sometimes drinks", icon: Wine }
                  ]
                }}
              />
              <ProfileCard
                profile={profileContent.me}
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
              <p className="text-xl text-black">I'll analyze the things you share and things you need to discuss</p>
            </div>
          ) : isLoading ? (
            <div className="bg-white shadow-lg rounded-lg overflow-hidden p-6 text-center">
              <p className="text-xl text-black">Loading topics...</p>
            </div>
          ) : (
            topics.map((topic, index) => (
              <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-all hover:scale-105">
                <div className={`p-6 text-center ${topic.type === 'shared-go-deeper'
                  ? 'bg-gradient-to-br from-pink-100 to-purple-100'
                  : 'bg-gradient-to-br from-blue-100 to-cyan-100'
                  }`}>
                  <p className="text-2xl font-bold mb-2 text-black">
                    {topic.type === 'shared-go-deeper' ? 'Shared, go deep:' : topic.type === 'find-out' ? 'Find out:' : 'Navigate tension:'}
                  </p>
                  <p className="text-lg text-black">{topic.content}</p>
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