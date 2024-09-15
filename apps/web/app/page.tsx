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

import LivePage from './LivePage';
import MainApp from './MainPage';

export default function Page() {
  const searchParams = useSearchParams();
  const isLive = searchParams.get('live') === '1';

  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showTextareas, setShowTextareas] = useState(false);
  const [profileContent, setProfileContent] = useState({
    them: {
      name: "Richard",
      avatar: "/greg.jpg",
      body: `
          I very much want a life partner who orients towards the world in a similar way as I do. I'm writing this document in the hope of finding her; please share it with women you think might be a good match. I'm male, 29, living in San Francisco, working in AI, uncertain about having kids (but probably persuadable by the right person). I'm open to going on dates with people who live elsewhere, but have trouble seeing myself living outside a global hub (like the Bay Area, NYC, London, etc) in the long term.
          Here are five of my defining traits; I'd love to find a partner who shares them with me. If they resonate with you, fill in this form or reach out directly.
          Growth
          ● I think of the world as full of opportunities waiting to be seized - which even if we can't get to yet, we'll be able to tomorrow. I want to be with someone who sees themselves as a work in progress, like I am; and whose default attitude is "why not?"
          For me, growth mindset is closely entangled with the idea of making the future of technology go well, which is the focus of most of my work.
          Intellectualism
          ● It's most natural for me to relate to the world in an analytical, systematizing way. I'd like a partner who, like me, has a strong drive to understand what's going on around them, to grasp the intellectual edifice humanity has been building, and to fill in the gaps themselves - not just in academic domains, but anywhere their curiosity leads them. For a picture of what this looks like in me, try reading my blog or my twitter.
          I often get along particularly well with people who read a lot as children, like I did.
          Teamwork
          ● I want a relationship which is deeply cooperative: two people building something in collaboration, where strong communication is the default and we trust that we can handle problems together. Some examples of how I've worked towards this in previous relationships:
          a. Scheduling an hour each week to raise issues and possible improvements.
          b. Taking a course on non-violent communication together.
          c. Doing circling together.
          Rereading that list, it all sounds... kinda serious? But the spirit I'm pointing towards is much less so: if we can laugh at all sorts of things (including ourselves) together, we're most of the way towards being a good team. And for me, being a good team is the essence of romance - everything else is built on top of that.
          Caring
          ● There's "caring" in the sense of kind, and "caring" in the sense of wanting things. The trait I'm talking about is somewhere in the middle. I'm not searching for someone who's
                  
          unusually empathetic, or unusually self-sacrificing. But there's an underlying attitude of valuing things outside of yourself that makes prosocial behavior feel less like an imposition and more like a facet of your own desires or personality. To care in this sense is to want to sculpt a better version of the world into existence. I tend to feel love most strongly when I think about how we're all tiny creatures carving our lives and works into an uncaring universe.
          Playfulness
          ● I balance the more "serious" traits above with a somewhat irreverent attitude towards life. I like spontaneous adventures, I like starting dancefloors, and I like thinking of rules as made to be broken. People are often surprised by how playful I am in person - it doesn't come through much in writing, where my intellectual side takes charge. (In this doc, my whimsical side keeps trying to slip things in, but my romantic side keeps overwriting them because it thinks finding a life partner is SERIOUS BUSINESS.)
          The person I'm writing this for might not have all the traits I've listed (or might not yet know that she does). But because we care about the same things on a deep level, I think she would want to have them eventually - just as the traits that she's looking for are probably the ones I'm already aiming for. Maybe we can develop them together.
          Some other things about me
          My guess is that, for the people I'm looking for, the traits I've talked about so far are likely to be the strongest signal that we should try going on a date. But here are some other facts about me that might help:
          - I'm a researcher at one of the top AI labs, working on what I consider to be the most impactful and interesting research directions in the world (a mix of AI governance and AI alignment). For an accessible introduction to my thinking, try this podcast. I'm excited about my work, and it's important to me.
          - I embrace life. I seize opportunities to dance, sing, travel, play practically any sport, read, socialize, and try new things. I'm energetic and adventurous.
          - I am fundamentally okay with myself, even as I strive to be better. I don't easily get flustered, angry, or insecure. Growing up in New Zealand gave me an underlying relaxed optimism about the world (although it's now often expressed via a very Californian type of ambition).
          - I'm unfussy about many conventionally-valued traits like level of formal education, career trajectory, finances, etc.
          I think my weakest traits from a dating perspective are that:
          - I'm not very empathetic on a gut level. This sometimes surprises people, because I'm
          unusually good at understanding and engaging with my own and others' emotions. But on an instinctive level, when I'm not actively trying to be empathetic, I still tend to default to thinking abstractly rather than putting myself in other people's shoes.
          
          - I work a lot, driven in part by my belief that technological progress (and particularly progress in AI) is going to accelerate a lot over the coming decades, potentially making this the most important century. This may be disconcerting for some potential partners.
          - I'm short for a guy.
          I'm still on good terms with all of the women I dated seriously during the past five years; here are reviews from two of them:
          "Richard is great. 5 out of 5 stars. It didn't work out with us but the quality of friendship we have now speaks for itself. He is one of the smartest people I know. Discussing things with him is great. Sharp and constructive. He has great friends. Absurdly good at any sport. Downside: bit chaotic, no taste for good food "
          "Richard is weirdly good at being in a relationship; I can think of three or four concrete ways I'm emotionally healthier after having dated him. One notable omission from this doc is the flip side of him being less empathetic than average on a gut level, which is that it feels easy to express feelings to him and negotiate conflict because he can accept intense emotions without getting caught up in them. He's more whimsical than the doc would suggest, though not less serious. Moreover, he is an excellent kisser and throws very good parties."
          Here are some photos of me:
          😉
    
          If you think we could be a good match (or you have a friend who might be), fill in my form, email me at richardcngo@gmail.com, tweet at me, tell a mutual friend to arrange a rendezvous, throw pebbles at my window, write me a song, or send me a document like this of your own! (If you're not sure what to say, tell me about a favorite book or song, or something you're looking forward to over the coming year.) If you're uncertain, please do err on the side of getting in touch - writing is much lower-bandwidth for discovering compatibility than meeting in person, and the heavy-tailed outcomes here are skewed very positively!
        `,
      interests: "Hiking, photography, trying new restaurants",
      badges: [
        { text: "No kids", icon: null },
        { text: "Sometimes drinks", icon: Wine }
      ]
    },
    me: {
      name: "Tati",
      avatar: "/tati.jpg",
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
        `,
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
      setTopics((prevTopics) => [...prevTopics, ...data.topics]);
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