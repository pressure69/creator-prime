"use client";

import { useState } from "react";
import TipModal from "./TipModal";
import {
  HeartIcon,
  ChatBubbleLeftIcon,
  ArrowUpTrayIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

interface EngagementButtonsProps {
  videoId: string;
  initialLikes: number;
}

export default function EngagementButtons({
  videoId,
  initialLikes,
}: EngagementButtonsProps) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [showTipModal, setShowTipModal] = useState(false);

  const handleLike = async () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ 
        title: "Check this out", 
        url: window.location.href 
      });
    } else {
      alert("Share: " + window.location.href);
    }
  };

  return (
    <>
      <div className="flex gap-4 justify-around pt-4 border-t border-gray-700">
        <button
          onClick={handleLike}
          className="flex flex-col items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-800 transition group flex-1"
        >
          <HeartIcon
            className={`w-6 h-6 transition ${
              liked ? "fill-red-500 text-red-500" : "text-gray-400 group-hover:text-white"
            }`}
          />
          <span className="text-sm text-gray-400">{likes}</span>
        </button>

        <button className="flex flex-col items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-800 transition group flex-1">
          <ChatBubbleLeftIcon className="w-6 h-6 text-gray-400 group-hover:text-white" />
          <span className="text-sm text-gray-400">Comment</span>
        </button>

        <button
          onClick={handleShare}
          className="flex flex-col items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-800 transition group flex-1"
        >
          <ArrowUpTrayIcon className="w-6 h-6 text-gray-400 group-hover:text-white" />
          <span className="text-sm text-gray-400">Share</span>
        </button>

        <button
          onClick={() => setShowTipModal(true)}
          className="flex flex-col items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition group flex-1"
        >
          <SparklesIcon className="w-6 h-6 text-white" />
          <span className="text-sm text-white font-semibold">Tip</span>
        </button>
      </div>

      {showTipModal && (
        <TipModal
          creatorId="creator_123"
          onClose={() => setShowTipModal(false)}
        />
      )}
    </>
  );
}
