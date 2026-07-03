interface Env {
  GEMINI_API_KEY?: string;
}

const SYSTEM_PROMPT = `You are the AI Watch Assistant — a friendly, knowledgeable sales advisor for the AI Watch Pro smartwatch.

PRODUCT INFO (use only these facts; never invent specs):
- Two sizes: 41mm ($299) and 45mm ($329)
- Three colors: Midnight Black, Silver, Gold
- Battery: 14 days typical use
- Health monitoring: heart rate, SpO2, sleep, ECG
- Water resistance: 5 ATM (up to 50m)
- Display: Always-on AMOLED, 1000 nits peak
- Connectivity: Bluetooth 5.3 + Wi-Fi
- Compatibility: iOS 15+ and Android 10+
- Pre-order pricing: 25% off retail ($399 → $299)
- Limited first batch: 5,000 units
- Shipping: free worldwide, August 2026
- Warranty: 2-year extended included
- Return: 30-day money-back guarantee

STYLE:
- Friendly, concise, helpful
- Reply in the same language the user uses (English or Vietnamese)
- Maximum 3 short sentences per reply
- Use 1-2 emojis max per message
- If asked something you don't know, suggest they pre-order or contact support@aiwatch.com`;

interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

async function callGemini(apiKey: string, userMessage: string): Promise<string | null> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const body = {
    system_instruction: {
      parts: [{ text: SYSTEM_PROMPT }],
    },
    contents: [
      {
        role: 'user',
        parts: [{ text: userMessage }],
      },
    ] satisfies ChatMessage[],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 250,
      topP: 0.9,
    },
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error('Gemini API error:', response.status, await response.text());
      return null;
    }

    const data = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return text?.trim() || null;
  } catch (err) {
    console.error('Gemini fetch failed:', err);
    return null;
  }
}

function pickReplyFallback(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('price') || lower.includes('cost') || lower.includes('giá')) {
    return 'AI Watch Pro starts at $299 (41mm) or $329 (45mm). Pre-order now to lock in 25% off the $399 retail price! 🎉';
  }
  if (lower.includes('feature') || lower.includes('spec') || lower.includes('tính năng')) {
    return 'AI Watch features: 14-day battery, AI health monitoring (HR, SpO2, ECG, sleep), 5 ATM water resistance, and always-on AMOLED display. Which spec matters most to you?';
  }
  if (lower.includes('shipping') || lower.includes('delivery') || lower.includes('giao hàng')) {
    return 'Free worldwide shipping! Estimated delivery is August 2026. Pre-order customers get priority shipping. 📦';
  }
  if (lower.includes('preorder') || lower.includes('pre-order') || lower.includes('order') || lower.includes('đặt')) {
    return 'Great choice! You can pre-order on this page — click the "Pre-order Now" button. 25% off retail, free shipping, and a free premium band ($29 value) included!';
  }
  if (lower.includes('color') || lower.includes('màu')) {
    return 'Available colors: Midnight Black, Silver, and Gold — all with premium titanium finish. Pick your favorite! ✨';
  }
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower.includes('chào')) {
    return 'Hi there! 👋 I can help with pricing, specs, pre-orders, or anything else about AI Watch Pro. What would you like to know?';
  }
  if (lower.includes('water') || lower.includes('waterproof') || lower.includes('chống nước')) {
    return 'AI Watch is rated 5 ATM — swim-proof up to 50 meters. Perfect for pools, showers, and open water! 🏊';
  }
  if (lower.includes('battery') || lower.includes('pin')) {
    return '14 days on a single charge with typical use. Always-on display mode drops it to about 7 days. ⚡';
  }
  if (lower.includes('return') || lower.includes('warranty') || lower.includes('đổi') || lower.includes('bảo hành')) {
    return '30-day money-back guarantee — no questions asked. Plus 2-year extended warranty included free. 🛡️';
  }
  return "Thanks for your interest in AI Watch Pro! I can help with pricing, specs, colors, pre-orders, or shipping. What would you like to know? 😊";
}

function getSessionId(request: Request): string {
  return request.headers.get('X-Session-Id') || 'anonymous';
}

async function trackConversation(
  env: Env,
  sessionId: string,
  userMessage: string,
  reply: string,
  source: 'gemini' | 'fallback',
): Promise<void> {
  if (!env.GEMINI_API_KEY) return;
  const trackingWebhook = (env as unknown as Record<string, string>).TRACKING_WEBHOOK_URL;
  if (!trackingWebhook) return;

  try {
    await fetch(trackingWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'chatbot_message',
        sessionId,
        userMessage: userMessage.slice(0, 500),
        reply: reply.slice(0, 500),
        source,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (err) {
    console.error('tracking webhook failed:', err);
  }
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = (await context.request.json()) as { message?: string };
    const message = (body.message || '').trim();

    if (!message) {
      return new Response(JSON.stringify({ success: false, message: 'Empty message' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (message.length > 1000) {
      return new Response(JSON.stringify({ success: false, message: 'Message too long (max 1000 chars)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let reply: string | null = null;
    let source: 'gemini' | 'fallback' = 'fallback';

    if (context.env.GEMINI_API_KEY) {
      reply = await callGemini(context.env.GEMINI_API_KEY, message);
      if (reply) {
        source = 'gemini';
      }
    }

    if (!reply) {
      reply = pickReplyFallback(message);
    }

    const sessionId = getSessionId(context.request);
    await trackConversation(context.env, sessionId, message, reply, source);

    return new Response(JSON.stringify({ success: true, reply, source }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('chat function error:', err);
    return new Response(JSON.stringify({ success: false, message: 'Invalid request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};