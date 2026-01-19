"use client";
import LiveStreamPlayer from './components/LiveStreamPlayer';
import VideoFeed from './components/VideoFeed';
import { ChatInterface } from './components/ai-chat/ChatInterface';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-pink-900 text-white overflow-hidden">
      {/* Neon Hero */}
      <section className="relative h-screen">
        <LiveStreamPlayer />
        <div className="absolute top-4 right-4 bg-red-500/90 backdrop-blur-sm text-xs px-3 py-1 rounded-full animate-pulse border-2 border-neon-pink">
          LIVE NOW
        </div>
      </section>
      {/* TikTok Feed */}
      <VideoFeed />
      {/* AI Teaser */}
      <ChatInterface preview />
      {/* Bottom Nav */}
      <nav className="fixed bottom-0 w-full bg-black/50 backdrop-blur-md p-2 flex justify-around">
        <span>Home</span><span>Live</span><span>AI</span><span>Feed</span><span>Profile</span>
      </nav>
    </div>
  );
}
