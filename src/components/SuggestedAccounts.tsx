"use client";

const suggestedCreators = [
  {
    id: 1,
    name: "Alex Chen",
    handle: "alexchen",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    isVerified: true,
  },
  {
    id: 2,
    name: "Sarah Moon",
    handle: "sarahmoon",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    isVerified: true,
  },
  {
    id: 3,
    name: "Jordan Lee",
    handle: "jordanlee",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
    isVerified: false,
  },
];

export default function SuggestedAccounts() {
  return (
    <aside className="hidden xl:flex xl:flex-col w-80 bg-gray-900 border-l border-gray-800 p-6 overflow-y-auto">
      <h3 className="text-xl font-bold text-white mb-4">Suggested Accounts</h3>

      <div className="flex flex-col gap-4">
        {suggestedCreators.map((creator) => (
          <div
            key={creator.id}
            className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition cursor-pointer"
          >
            <div className="flex items-center gap-3 flex-1">
              <img
                src={creator.image}
                alt={creator.name}
                className="w-10 h-10 rounded-full border-2 border-red-500"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white flex items-center gap-1">
                  {creator.name}
                  {creator.isVerified && <span>✓</span>}
                </p>
                <p className="text-sm text-gray-400">@{creator.handle}</p>
              </div>
            </div>
            <button className="px-4 py-1 bg-red-600 text-white rounded-full text-sm font-semibold hover:bg-red-700 transition whitespace-nowrap">
              Follow
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}
