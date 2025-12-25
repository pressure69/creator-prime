"use client";

import { useState, useRef, useEffect } from "react";
import EngagementButtons from "./EngagementButtons";

interface VideoCardProps {
  id: string;
  videoUrl: string;
  creatorName: string;
  creatorImage: string;
  title: string;
  likes: number;
  comments: number;
  views: number;
}

export default function VideoCard({
  id,
  videoUrl,
  creatorName,
  creatorImage,
  title,
  likes,
  comments,
  views,
}: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isPlaying) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
  }, [isPlaying]);

  return (
    <div className="flex flex-col bg-gray-900 rounded-xl overflow-hidden border border-gray-800 max-w-2xl mx-auto w-full">
      <div className="relative bg-black aspect-video">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          onClick={() => setIsPlaying(!isPlaying)}
          src={videoUrl}
        />
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition group"
        >
          {!isPlaying && (
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition">
              ▶️
            </div>
          )}
        </button>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <img
            src={creatorImage}
            alt={creatorName}
            className="w-12 h-12 rounded-full border-2 border-red-500"
          />
          <div>
            <p className="font-bold text-white">{creatorName}</p>
            <p className="text-sm text-gray-400">@{creatorName.toLowerCase()}</p>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>

        <div className="flex gap-6 mb-4 text-sm text-gray-400">
          <span>👁️ {views.toLocaleString()} views</span>
          <span>❤️ {likes.toLocaleString()} likes</span>
          <span>💬 {comments.toLocaleString()} comments</span>
        </div>

        <EngagementButtons videoId={id} initialLikes={likes} />
      </div>
    </div>
  );
}
