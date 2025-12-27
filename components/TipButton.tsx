import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function TipButton({ amount, creatorId }: { amount: number; creatorId: string }) {
  const handleTip = async () => {
    const stripe = await stripePromise;
    const response = await fetch('/api/tips/create-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, creatorId }),
    });
    const session = await response.json();
    stripe?.redirectToCheckout({ sessionId: session.id });
  };

  return (
    <button 
      onClick={handleTip}
      className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-4 px-8 rounded-full shadow-lg animate-pulse"
    >
      💸 Tip ${amount} - Make me cum! 🍆💦
    </button>
  );
}
