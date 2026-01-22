"use client";

export default function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-gray-900 text-white border-t border-gray-700 py-3 flex justify-around">
      <button className="flex flex-col items-center text-sm">
        <span className="text-2xl">🏠</span>
        Home
      </button>

      <button className="flex flex-col items-center text-sm">
        <span className="text-2xl">🎥</span>
        Stream
      </button>

      <button className="flex flex-col items-center text-sm">
        <span className="text-2xl">💬</span>
        Chat
      </button>

      <button className="flex flex-col items-center text-sm">
        <span className="text-2xl">⚙️</span>
        Settings
      </button>
    </nav>
  );
}
