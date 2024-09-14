import React from 'react'
import { Heart, User, Briefcase, Coffee, Wine, Cigarette } from "lucide-react"

export default function Component() {
  const cards = [
    { title: "Shared, go deep", topic: "Fashion", type: "shared" },
    { title: "Find out", topic: "Having kids", type: "find" },
    { title: "Shared, go deep", topic: "Travel experiences", type: "shared" },
    { title: "Find out", topic: "How often do you drink? Is Sam ok with that?", type: "find" },
    { title: "Find out", topic: "Which cuisines do you share?", type: "find" }
  ]

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-3 flex items-center"><User className="mr-2" size={24} /> Me</h2>
              <div className="space-y-3">
                <p className="flex items-center text-gray-600"><Briefcase className="mr-2" size={18} /> Graphic Designer</p>
                <p className="text-sm">Techy by day, fashion geek by night. Seeking a strong, dependable partner to share adventures and create epic memories. If you're assertive, loyal, and ready for something real, swipe right, and let's turn our story into a bestseller.</p>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Coffee className="mr-1" size={18} />
                  <span>Hiking, photography, trying new restaurants</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-1 bg-gray-200 text-sm rounded-full">No kids</span>
                  <span className="px-2 py-1 bg-gray-200 text-sm rounded-full">Sometimes drinks</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-3 flex items-center"><User className="mr-2" size={24} /> Them</h2>
              <div className="space-y-3">
                <p className="flex items-center text-gray-600"><Briefcase className="mr-2" size={18} /> Software Engineer</p>
                <p className="text-sm">Code wizard by profession, adventure seeker by passion. Looking for a partner in crime to explore life's mysteries and create lasting memories. If you're ambitious, kind-hearted, and enjoy both quiet nights in and spontaneous adventures, let's connect and see where our journey takes us.</p>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Coffee className="mr-1" size={18} />
                  <span>Traveling, coding, playing guitar</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-1 bg-gray-200 text-sm rounded-full">Wants kids</span>
                  <span className="px-2 py-1 bg-gray-200 text-sm rounded-full flex items-center">
                    <Cigarette className="mr-1" size={14} />
                    Doesn't smoke
                  </span>
                  <span className="px-2 py-1 bg-gray-200 text-sm rounded-full flex items-center">
                    <Wine className="mr-1" size={14} />
                    Doesn't drink
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {cards.map((card, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-all hover:scale-105">
              <div className={`p-6 text-center ${
                card.type === 'shared' 
                  ? 'bg-gradient-to-br from-pink-100 to-purple-100' 
                  : 'bg-gradient-to-br from-blue-100 to-cyan-100'
              }`}>
                <p className="text-2xl font-bold mb-2">{card.title}</p>
                <p className="text-lg text-gray-600">{card.topic}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 text-center">
        <button className="px-6 py-3 bg-red-600 text-white rounded-full text-lg font-semibold hover:bg-red-700 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center mx-auto">
          <Heart className="mr-2" size={20} /> Give ideas to talk about
        </button>
      </div>
    </div>
  )
}