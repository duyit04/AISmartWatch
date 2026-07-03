import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';

const app = new Hono();

// Global error logger
app.onError((err, c) => {
  console.error('🔥 Server error:', err);
  return c.json({ success: false, message: err.message || 'Internal Server Error' }, 500);
});

// CORS - cho phép frontend dev gọi API
app.use('/*', cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Health check
app.get('/api/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Pre-order webhook (Discord embed)
app.post('/api/webhook/preorder', async (c) => {
  const body = await c.req.json();
  const { fullName, email, phone } = body;

  console.log('📦 New Pre-order:', { fullName, email, phone });

  return c.json({ success: true, message: 'Pre-order submitted successfully' });
});

// Cart sync (in-memory for demo)
const cartStore = new Map<string, unknown[]>();

app.post('/api/cart', async (c) => {
  const sessionId = c.req.header('X-Session-Id') || 'anonymous';
  const body = await c.req.json();
  cartStore.set(sessionId, body.items || []);
  return c.json({ success: true, message: 'Cart synced' });
});

app.get('/api/cart', async (c) => {
  const sessionId = c.req.header('X-Session-Id') || 'anonymous';
  return c.json({ success: true, items: cartStore.get(sessionId) || [] });
});

// Wishlist sync
const wishlistStore = new Map<string, unknown[]>();

app.post('/api/wishlist', async (c) => {
  const sessionId = c.req.header('X-Session-Id') || 'anonymous';
  const body = await c.req.json();
  wishlistStore.set(sessionId, body.items || []);
  return c.json({ success: true, message: 'Wishlist synced' });
});

app.get('/api/wishlist', async (c) => {
  const sessionId = c.req.header('X-Session-Id') || 'anonymous';
  return c.json({ success: true, items: wishlistStore.get(sessionId) || [] });
});

// Viewed products sync
const viewedStore = new Map<string, unknown[]>();

app.post('/api/viewed', async (c) => {
  const sessionId = c.req.header('X-Session-Id') || 'anonymous';
  try {
    const body = await c.req.json().catch(() => ({}));
    viewedStore.set(sessionId, body.items || []);
    return c.json({ success: true, message: 'Viewed products synced' });
  } catch (err) {
    console.error('viewed error:', err);
    return c.json({ success: false, message: 'Invalid JSON' }, 400);
  }
});

app.get('/api/viewed', async (c) => {
  const sessionId = c.req.header('X-Session-Id') || 'anonymous';
  return c.json({ success: true, items: viewedStore.get(sessionId) || [] });
});

// Chatbot (mock AI responses)
app.post('/api/chat', async (c) => {
  const body = await c.req.json();
  const { message } = body;

  const lowerMsg = (message || '').toLowerCase();

  let reply = "Thanks for your message! Our team will get back to you soon.";

  if (lowerMsg.includes('price') || lowerMsg.includes('cost')) {
    reply = "The AI SmartWatch Pro starts at $399. Would you like to know more about our payment plans?";
  } else if (lowerMsg.includes('feature') || lowerMsg.includes('spec')) {
    reply = "Our AI SmartWatch features: Health Monitoring, AI Assistant, 7-day battery, Water resistance up to 50m. What would you like to explore?";
  } else if (lowerMsg.includes('shipping') || lowerMsg.includes('delivery')) {
    reply = "We offer free worldwide shipping! Estimated delivery is 5-7 business days after launch.";
  } else if (lowerMsg.includes('preorder') || lowerMsg.includes('order')) {
    reply = "Great choice! You can pre-order now with a 20% early-bird discount. Use code EARLYBIRD at checkout.";
  } else if (lowerMsg.includes('color')) {
    reply = "Available colors: Midnight Black, Silver, and Gold. Each with premium titanium finish.";
  } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
    reply = "Hello! Welcome to AI SmartWatch. How can I help you today?";
  }

  return c.json({ success: true, reply });
});

// Start server
const PORT = 3001;

serve({
  fetch: app.fetch,
  port: PORT,
}, (info) => {
  console.log(`🚀 Local API server running on http://localhost:${info.port}`);
});