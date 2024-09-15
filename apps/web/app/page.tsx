"use client";
import React, {
  useEffect,
  useState,
} from 'react';

import {
  Cigarette,
  Wine,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';

import { trimLines } from '@lukebechtel/lab-ts-utils';

import LivePage from './LivePage';
import MainApp from './MainPage';

export default function Page() {
  const searchParams = useSearchParams();
  const isLive = searchParams.get('live') === '1';

  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showTextareas, setShowTextareas] = useState(false);
  const [profileContent, setProfileContent] = useState({
    them: {
      name: "Theodore",
      avatar: "/greg.jpg",
      body: trimLines(`
          I'm looking for a life partner who shares my worldview and values. I'm in my late 20s, living in a major city, and working in the tech industry. I'm open to dating people from other locations but prefer to settle in a global hub long-term. I'm undecided about having children but open to discussion with the right person.
          Here are five traits I'm looking for in a partner:

          Growth Mindset: I see the world as full of opportunities and view myself as a work in progress. I'm looking for someone who shares this attitude and embraces the "why not?" approach to life.
          Intellectual Curiosity: I have an analytical mindset and a strong drive to understand the world around me. I'd love a partner who shares this passion for learning and exploration, both in academic domains and beyond.
          Collaborative Spirit: I believe in building a deeply cooperative relationship where we tackle challenges together. I value strong communication and trust, and I'm willing to invest time in improving our partnership.
          Caring Attitude: I'm seeking someone who genuinely cares about making a positive impact on the world. This doesn't mean being exceptionally self-sacrificing, but rather having an underlying desire to contribute to something greater than oneself.
          Playfulness: While I take my goals seriously, I also have a playful side. I enjoy spontaneous adventures, dancing, and challenging conventional norms. I'm looking for someone who can balance depth with levity.

          Some additional points about me:

          I work in a cutting-edge field that I find both impactful and fascinating.
          I'm energetic and embrace various aspects of life, including sports, travel, reading, and socializing.
          I have a relaxed and optimistic outlook, coupled with ambition.
          I'm not overly concerned with traditional metrics like formal education or career trajectory.

          Areas where I'm still growing:

          While I understand emotions well, I'm working on improving my instinctive empathy.
          My work is a significant part of my life, which might be challenging for some partners.
          I'm on the shorter side for a man.

          If this resonates with you, I'd love to connect!
        `),
      interests: "Hiking, photography, trying new restaurants",
      badges: [
        { text: "No kids", icon: null },
        { text: "Sometimes drinks", icon: Wine }
      ]
    },
    me: {
      name: "Tati",
      avatar: "/tati.jpg",
      body: trimLines(`
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
        `),
      interests: "Traveling, coding, playing guitar",
      badges: [
        { text: "Wants kids", icon: null },
        { text: "Doesn't smoke", icon: Cigarette },
        { text: "Doesn't drink", icon: Wine }
      ]
    }
  })

  const [topics, setTopics] = useState<{ title: string, content: string, type: 'shared-go-deeper' | 'find-out' | 'navigate-tension' }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState('');

  const fetchTopics = async (useTranscript = false) => {
    setIsLoading(true);
    try {
      const endpoint = useTranscript ? '/api/topics/suggest_from_transcript' : '/api/topics';
      const body = useTranscript
        ? {
          transcript,
          userProfiles: [
            {
              ...profileContent.them,
              interests: profileContent.them.interests,
              badges: profileContent.them.badges
            },
            {
              ...profileContent.me,
              interests: profileContent.me.interests,
              badges: profileContent.me.badges
            }
          ],
          existingSuggestedTopics: topics,
        }
        : {
          userProfiles: [
            {
              ...profileContent.them,
              interests: profileContent.them.interests,
              badges: profileContent.them.badges
            },
            {
              ...profileContent.me,
              interests: profileContent.me.interests,
              badges: profileContent.me.badges
            }
          ],
          alreadySuggestedTopics: topics,
        };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch topics');
      }

      const data = await response.json();
      setTopics((prevTopics) => [
        ...prevTopics,
        // Add live indicator to each topic
        ...data.topics.map((topic: any) => ({
          ...topic,
          origin: useTranscript ? "live" : undefined
        }))
      ]);
    } catch (error) {
      console.error('Error fetching topics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isLive && transcript) {
      intervalId = setInterval(() => {
        fetchTopics(true);
      }, 5000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isLive, transcript]);

  const handleAnalyze = () => {
    setShowAnalysis(true);
    fetchTopics();
  };

  const handleNewProfiles = () => {
    setShowTextareas(true);
    setShowAnalysis(false);
  };

  const handleSaveProfiles = () => {
    setShowTextareas(false);
  };

  const handleProfileChange = (person: 'them' | 'me', field: 'body' | 'interests', newValue: string) => {
    setProfileContent(prev => ({
      ...prev,
      [person]: { ...prev[person], [field]: newValue }
    }));
  };

  const handleBadgeChange = (person: 'them' | 'me', index: number, newBadge: { text: string, icon: any }) => {
    setProfileContent(prev => ({
      ...prev,
      [person]: {
        ...prev[person],
        badges: prev[person].badges.map((badge, i) => i === index ? newBadge : badge)
      }
    }));
  };

  const handleTranscriptUpdate = (newTranscript: string) => {
    setTranscript(newTranscript);
  };

  if (isLive) {
    return (
      <LivePage
        profileContent={profileContent}
        topics={topics}
        isLoading={isLoading}
        onTranscriptUpdate={handleTranscriptUpdate}
      />
    );
  }

  return (
    <MainApp
      showAnalysis={showAnalysis}
      showTextareas={showTextareas}
      profileContent={profileContent}
      topics={topics}
      isLoading={isLoading}
      handleAnalyze={handleAnalyze}
      handleNewProfiles={handleNewProfiles}
      handleSaveProfiles={handleSaveProfiles}
      handleProfileChange={handleProfileChange}
      handleBadgeChange={handleBadgeChange}
    />
  );
}