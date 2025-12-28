import PostCard from '../../components/PostCard';

export default function Feed() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">🔥 Hot Feed</h1>
      <PostCard username="hotcreator" content="Just went live... tip me to cum daddy~ 🍑" likes={69} />
      <PostCard username="bimbobabe" content="New AI deepfake video... pay to unlock 😈" likes={420} />
      {/* Real fetch from Supabase coming soon! */}
    </div>
  );
}
