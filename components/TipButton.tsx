import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function TipButton({ amount = 10 }: { amount?: number }) {
  const handleTip = async () => {
    const response = await fetch('/api/stripe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });

    if (!response.ok) {
      console.error('Payment failed');
      return;
    }

    const session = await response.json();

    const stripe = await stripePromise;
    if (!stripe) {
      console.error('Stripe not loaded');
      return;
    }

    // Type assertion to Stripe from stripe-js (has redirectToCheckout)
    await (stripe as any).redirectToCheckout({ sessionId: session.id });
  };

  return (
    <button 
      onClick={handleTip}
      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all"
    >
      💸 Tip ${amount}
    </button>
  );
}
