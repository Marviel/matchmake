"use client";
import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Cigarette,
  Coffee,
  Heart,
  Mic,
  Users,
  Wine,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import TopicCard from './components/TopicCard';

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

interface MainAppProps {
  showAnalysis: boolean;
  showTextareas: boolean;
  profileContent: {
    them: { name: string; avatar: string; body: string; interests: string; badges: { text: string; icon: any }[] };
    me: { name: string; avatar: string; body: string; interests: string; badges: { text: string; icon: any }[] };
  };
  topics: { title: string; content: string; type: 'shared-go-deeper' | 'find-out' | 'navigate-tension'; origin?: 'live' }[];
  isLoading: boolean;
  handleAnalyze: () => void;
  handleNewProfiles: () => void;
  handleSaveProfiles: () => void;
  handleProfileChange: (person: 'them' | 'me', field: 'body' | 'interests', newValue: string) => void;
  handleBadgeChange: (person: 'them' | 'me', index: number, newBadge: { text: string, icon: any }) => void;
}

export default function MainApp({
  showAnalysis,
  showTextareas,
  profileContent,
  topics,
  isLoading,
  handleAnalyze,
  handleNewProfiles,
  handleSaveProfiles,
  handleProfileChange,
}: MainAppProps) {
  const router = useRouter();

  const handleGoLive = () => {
    router.push('?live=1');
  };

  return (
    <div className="container mx-auto p-4 text-black">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {showTextareas ? (
            <>
              <div className="space-y-4">
                <label htmlFor="them-profile" className="block text-lg font-medium">Their Profile</label>
                <textarea
                  id="them-profile"
                  className="w-full h-64 p-2 border rounded-md"
                  value={profileContent.them.body}
                  onChange={(e) => handleProfileChange('them', 'body', e.target.value)}
                  placeholder='Paste their profile here...'
                />
              </div>
              <div className="space-y-4">
                <label htmlFor="my-profile" className="block text-lg font-medium">My Profile</label>
                <textarea
                  id="my-profile"
                  className="w-full h-64 p-2 border rounded-md"
                  value={profileContent.me.body}
                  onChange={(e) => handleProfileChange('me', 'body', e.target.value)}
                  placeholder='Paste your dating profile here from Tinder, Bumble, etc...'
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
          <button
            onClick={handleGoLive}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center mb-4"
          >
            <Mic className="mr-2" size={20} /> Go Live
          </button>
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
              <TopicCard key={index} topic={topic} />
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
    </div>
  );
}