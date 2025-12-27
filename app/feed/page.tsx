import PostCard from '@/components/PostCard';

export default function Feed() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">🔥 Hot Feed</h1>
      {/* Future: fetch posts from Supabase */}
      <PostCard username="hotcreator" content="Just went live... come tip me daddy~ 🍑" likes={69} />
      <PostCard username="bimbobabe" content="New AI video dropping... paid access only 😈" likes={420} />
    </div>
  );
}
