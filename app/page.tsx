'use client'
import Link from 'next/link'

const streams = [
  { id: 1, creator: 'AnnaVibes', likes: '1.2M', views: '98K', live: true },
  { id: 2, creator: 'LunaStream', likes: '890K', views: '75K', live: false },
  { id: 3, creator: 'CyberDaddy', likes: '2.1M', views: '150K', live: true },
  { id: 4, creator: 'NeonQueen', likes: '450K', views: '42K', live: true },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyberBlack via-black to-cyberPurple overflow-hidden">
      {/* Hero stats overlay */}
      <div className="absolute top-12 left-8 text-4xl font-black text-neonPink drop-shadow-2xl animate-glow z-10">
        <div>1.2M ❤️</div>
        <div className="text-xl text-gray-400">Likes</div>
      </div>

      {/* Live stream grid */}
      <section className="p-12 pt-32 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-32">
        {streams.map(stream => (
          <Link key={stream.id} href={\/live/\\} className="group relative aspect-square rounded-3xl overflow-hidden bg-cyberBlack/50 border-4 border-neonPink/30 hover:border-neonPink/70 hover:scale-105 transition-all duration-500 shadow-2xl backdrop-blur-xl">
            {stream.live && <div className="absolute top-4 right-4 bg-red-600 text-white text-xs px-3 py-1 rounded-full font-bold animate-pulse">● LIVE</div>}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-all p-6 flex flex-col justify-end">
              <h3 className="font-black text-2xl text-neonPink drop-shadow-lg">{stream.creator}</h3>
              <div className="text-neonPink font-bold">{stream.likes} ❤️ {stream.views} 👀</div>
            </div>
          </Link>
        ))}
      </section>

      {/* Fixed bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-cyberBlack/90 backdrop-blur-xl border-t-4 border-neonPink/50 p-4 flex justify-around items-center z-50">
        <Link href="/" className="flex flex-col items-center text-xs text-gray-400 hover:text-white transition-all p-2 rounded-xl hover:bg-neonPink/20">
          <span className="text-2xl mb-1">🏠</span>Home
        </Link>
        <Link href="/live" className="flex flex-col items-center text-xs text-gray-400 hover:text-white transition-all p-2 rounded-xl hover:bg-neonPink/20">
          <span className="text-2xl mb-1">📺</span>Live
        </Link>
        <Link href="/daddy-ai" className="flex flex-col items-center text-lg font-black bg-gradient-to-r from-neonPink to-cyberPurple bg-clip-text text-transparent shadow-2xl p-2 rounded-xl animate-glow scale-110">
          <span className="text-3xl mb-1 animate-pulse drop-shadow-2xl">💋</span>Daddy AI
        </Link>
        <Link href="/feed" className="flex flex-col items-center text-xs text-gray-400 hover:text-white transition-all p-2 rounded-xl hover:bg-neonPink/20">
          <span className="text-2xl mb-1">📱</span>Feed
        </Link>
        <Link href="/profile" className="flex flex-col items-center text-xs text-gray-400 hover:text-white transition-all p-2 rounded-xl hover:bg-neonPink/20">
          <span className="text-2xl mb-1">👤</span>Profile
        </Link>
      </nav>
    </div>
  )
}
