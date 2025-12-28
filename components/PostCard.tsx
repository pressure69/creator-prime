"use client"
import { useState } from 'react';

interface PostProps {
  username: string;
  content: string;
  likes: number;
}

export default function PostCard({ username, content, likes: initialLikes }: PostProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [comment, setComment] = useState('');
  const handleLike = () => setLikes(likes + 1);
  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    // Real API call to Supabase (use your env SUPABASE_URL/KEY)
    fetch(`${process.env.SUPABASE_URL}/posts/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': process.env.SUPABASE_ANON_KEY || '' },
      body: JSON.stringify({ comment }),
    }).then(() => alert(`Comment posted: ${comment}`)); // Real post, alert for now
    setComment('');
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl mb-4 shadow-lg">
      <h3 className="text-xl font-bold text-pink-400">@{username}</h3>
      <p className="text-white my-2">{content}</p>
      <div className="flex gap-4 mt-4">
        <button onClick={handleLike} className="text-red-500 hover:text-red-300">❤️ {likes} Likes</button>
        <button className="text-green-500 hover:text-green-300">🔄 Retweet</button>
      </div>
      <form onSubmit={handleComment} className="mt-4">
        <input 
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Comment... 💬 Get dirty~"
          className="bg-gray-900 text-white p-2 rounded w-full"
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded mt-2">Post Comment</button>
      </form>
    </div>
  );
}
