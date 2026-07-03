interface Env {}

function pickReply(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('price') || lower.includes('cost')) {
    return 'The AI SmartWatch Pro starts at $399. Would you like to know more about our payment plans?';
  }
  if (lower.includes('feature') || lower.includes('spec')) {
    return 'Our AI SmartWatch features: Health Monitoring, AI Assistant, 7-day battery, Water resistance up to 50m. What would you like to explore?';
  }
  if (lower.includes('shipping') || lower.includes('delivery')) {
    return 'We offer free worldwide shipping! Estimated delivery is 5-7 business days after launch.';
  }
  if (lower.includes('preorder') || lower.includes('order')) {
    return 'Great choice! You can pre-order now with a 20% early-bird discount. Use code EARLYBIRD at checkout.';
  }
  if (lower.includes('color')) {
    return 'Available colors: Midnight Black, Silver, and Gold. Each with premium titanium finish.';
  }
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return 'Hello! Welcome to AI SmartWatch. How can I help you today?';
  }
  return "Thanks for your message! Our team will get back to you soon.";
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = (await context.request.json()) as { message?: string };
    const reply = pickReply(body.message || '');
    return new Response(JSON.stringify({ success: true, reply }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ success: false, message: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};