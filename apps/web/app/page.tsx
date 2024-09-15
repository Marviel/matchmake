"use client";
import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  AlertTriangle,
  Cigarette,
  Coffee,
  Heart,
  Search,
  Share2,
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

const TopicCard = ({ topic }: { topic: any }) => {
  const typeIcons = {
    'find-out': Search,
    'shared-go-deeper': Share2,
    'navigate-tension': AlertTriangle,
  };

  const typeLabels = {
    'find-out': 'Find Out',
    'shared-go-deeper': 'Shared; Dig Deeper',
    'navigate-tension': 'Navigate Tension',
  };

  const TypeIcon = typeIcons[topic.type as keyof typeof typeIcons];
  const typeLabel = typeLabels[topic.type as keyof typeof typeLabels];

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-all hover:scale-105 relative">
      <div className={`p-6 ${topic.type === 'shared-go-deeper'
          ? 'bg-gradient-to-br from-pink-100 to-purple-100'
          : topic.type === 'find-out'
            ? 'bg-gradient-to-br from-blue-100 to-cyan-100'
            : 'bg-gradient-to-br from-yellow-100 to-orange-100'
        }`}>
        <div className="absolute top-2 right-2 bg-white rounded-full py-1 px-2 flex items-center space-x-1">
          <TypeIcon size={16} className="text-gray-600" />
          <span className="text-xs font-medium text-gray-600">{typeLabel}</span>
        </div>
        <h3 className="text-xl font-bold mb-2 text-black">{topic.title}</h3>
        <p className="text-sm text-black">{topic.content}</p>
      </div>
    </div>
  );
};

export default function Component() {
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [showTextareas, setShowTextareas] = useState(false)
  const [profileContent, setProfileContent] = useState({
    them: {
      name: "Richard",
      avatar: "/greg.jpg", // Add this image to your public folder
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

  const [topics, setTopics] = useState<{ title: string, content: string, type: 'shared-go-deeper' | 'find-out' | 'navigate-tension' }[]>([])
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
        <div className="space-y-6">
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
  )
}