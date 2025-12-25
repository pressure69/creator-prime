'use client';

import { useState } from 'react';
import TipModal from '@/components/TipModal';

interface Video {
  id: string;
  title: string;
  creator: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
}

const videos: Video[] = [
  {
    id: '1',
    title: 'Amazing Coding Tutorial - Build Your First App',
    creator: 'Alex Chen',
    views: 15200,
    likes: 890,
    comments: 234,
    shares: 45,
  },
  {
    id: '2',
    title: 'Web Design Trends 2025 - What You Need to Know',
    creator: 'Sarah Williams',
    views: 8900,
    likes: 620,
    comments: 156,
    shares: 32,
  },
];

export default function FeedPage() {
  const [tipModalOpen, setTipModalOpen] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState('');

  const handleTip = (creatorId: string) => {
    setSelectedCreator(creatorId);
    setTipModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="fixed inset-0 bg-gradient-to-br from-blue-950/20 via-black to-purple-950/20 pointer-events-none"></div>

      <header className="relative z-40 bg-black/80 border-b border-white/5 sticky top-0 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-4xl drop-shadow-2xl">🎥</div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter">
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-300 bg-clip-text text-transparent">Creator</span>
                <span className="bg-gradient-to-r from-purple-400 via-pink-300 to-purple-300 bg-clip-text text-transparent ml-2">Prime</span>
              </h1>
              <p className="text-xs text-gray-500 mt-1">Premium Streaming Platform</p>
            </div>
          </div>
          <input
            type="text"
            placeholder="Search creators, videos..."
            className="w-96 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition backdrop-blur-sm"
          />
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-8 py-12">
        <div className="space-y-8">
          {videos.map((video) => (
            <div
              key={video.id}
              className="group relative overflow-hidden rounded-2xl transition-all duration-500"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative bg-gradient-to-br from-gray-950 via-black to-gray-950 rounded-2xl border border-white/10 group-hover:border-blue-500/30 overflow-hidden transition-all duration-500 shadow-2xl">
                
                <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-black">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-transparent to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="inline-block mb-3 transform group-hover:scale-125 transition-transform duration-500">
                        <div className="text-8xl drop-shadow-2xl filter group-hover:drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]">🎬</div>
                      </div>
                      <p className="text-gray-400 text-sm font-medium group-hover:text-blue-300 transition-colors">Featured Video</p>
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-1.5 text-xs font-bold text-blue-300">
                    TRENDING
                  </div>
                </div>

                <div className="p-8 bg-gradient-to-b from-gray-950 via-black to-black relative">
                  <h3 className="text-3xl font-black mb-4 leading-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:via-cyan-300 group-hover:to-blue-300 group-hover:bg-clip-text transition-all duration-300">
                    {video.title}
                  </h3>

                  <div className="flex items-center gap-3 mb-7">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                      {video.creator.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-bold group-hover:text-blue-300 transition-colors">{video.creator}</p>
                      <p className="text-xs text-gray-500">Creator</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3 mb-8">
                    <div className="bg-gradient-to-br from-blue-900/20 to-blue-900/5 border border-blue-500/20 rounded-lg p-3 backdrop-blur-sm hover:border-blue-400/40 transition group/stat">
                      <p className="text-xs text-gray-400 mb-1">Views</p>
                      <p className="text-lg font-black text-blue-300 group-hover/stat:text-blue-200">{(video.views / 1000).toFixed(1)}K</p>
                    </div>
                    <div className="bg-gradient-to-br from-pink-900/20 to-pink-900/5 border border-pink-500/20 rounded-lg p-3 backdrop-blur-sm hover:border-pink-400/40 transition group/stat">
                      <p className="text-xs text-gray-400 mb-1">Likes</p>
                      <p className="text-lg font-black text-pink-300 group-hover/stat:text-pink-200">{(video.likes / 100).toFixed(0)}K</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-900/20 to-purple-900/5 border border-purple-500/20 rounded-lg p-3 backdrop-blur-sm hover:border-purple-400/40 transition group/stat">
                      <p className="text-xs text-gray-400 mb-1">Comments</p>
                      <p className="text-lg font-black text-purple-300 group-hover/stat:text-purple-200">{video.comments}</p>
                    </div>
                    <div className="bg-gradient-to-br from-cyan-900/20 to-cyan-900/5 border border-cyan-500/20 rounded-lg p-3 backdrop-blur-sm hover:border-cyan-400/40 transition group/stat">
                      <p className="text-xs text-gray-400 mb-1">Shares</p>
                      <p className="text-lg font-black text-cyan-300 group-hover/stat:text-cyan-200">{video.shares}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 group/btn relative overflow-hidden rounded-lg px-6 py-3 font-bold text-white transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 group-hover/btn:from-red-500 group-hover/btn:to-pink-500"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-400 opacity-0 group-hover/btn:opacity-20 blur-lg"></div>
                      <span className="relative flex items-center justify-center gap-2">❤️ Like</span>
                    </button>

                    <button className="flex-1 group/btn relative overflow-hidden rounded-lg px-6 py-3 font-bold text-white transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 group-hover/btn:from-cyan-500 group-hover/btn:to-blue-500"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover/btn:opacity-20 blur-lg"></div>
                      <span className="relative flex items-center justify-center gap-2">💬 Comment</span>
                    </button>

                    <button
                      onClick={() => handleTip(video.creator)}
                      className="flex-1 group/btn relative overflow-hidden rounded-lg px-6 py-3 font-bold text-black transition-all duration-300 transform hover:scale-105"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-300 to-amber-400 group-hover/btn:from-yellow-300 group-hover/btn:via-yellow-200 group-hover/btn:to-amber-300"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-amber-200 opacity-0 group-hover/btn:opacity-30 blur-lg"></div>
                      <span className="relative flex items-center justify-center gap-2 drop-shadow">💰 Tip Creator</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {tipModalOpen && (
        <TipModal
          creatorId={selectedCreator}
          onClose={() => setTipModalOpen(false)}
        />
      )}
    </div>
  );
}
