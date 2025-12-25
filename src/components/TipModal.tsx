import { useState } from "react";

const tipAmounts = [5, 10, 25, 50, 100, 500];

interface TipModalProps {
  creatorId: string;
  onClose: () => void;
}

export default function TipModal({ creatorId, onClose }: TipModalProps) {
  const [selectedAmount, setSelectedAmount] = useState(10);
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: selectedAmount,
          creatorId,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create checkout session");
      }

      const { sessionId } = await res.json();
      
      window.location.href = "https://checkout.stripe.com/pay/" + sessionId;
    } catch (error) {
      console.error("Error:", error);
      alert("Payment failed: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/10 p-8 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text">
            Support {creatorId}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            ?
          </button>
        </div>

        <p className="text-gray-400 mb-6">Choose an amount to tip this creator:</p>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {tipAmounts.map((amount) => (
            <button
              key={amount}
              onClick={() => setSelectedAmount(amount)}
              className={
                selectedAmount === amount
                  ? "py-3 rounded-lg font-bold transition-all bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg shadow-yellow-500/50"
                  : "py-3 rounded-lg font-bold transition-all bg-gray-800 text-white hover:bg-gray-700"
              }
            >
              ${amount}
            </button>
          ))}
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-400">Total Amount</p>
          <p className="text-3xl font-black text-yellow-400">
            ${selectedAmount.toFixed(2)}
          </p>
        </div>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-yellow-400 via-yellow-300 to-amber-400 text-black rounded-lg font-bold hover:from-yellow-300 hover:via-yellow-200 hover:to-amber-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-yellow-500/50"
        >
          {loading ? "Processing..." : "?? Tip Creator"}
        </button>

        <button
          onClick={onClose}
          className="w-full mt-3 py-3 bg-gray-800 text-white rounded-lg font-bold hover:bg-gray-700 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
