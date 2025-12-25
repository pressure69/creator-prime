'use client';

export default function NavBar() {
  return (
    <div className="h-16 bg-gray-900 border-b border-gray-800 flex items-center px-6">
      <input
        type="text"
        placeholder="Search videos, creators..."
        className="w-80 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
      />
    </div>
  );
}
