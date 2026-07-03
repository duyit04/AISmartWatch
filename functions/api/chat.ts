import type { Ai } from '@cloudflare/workers-types';

interface Env {
  AI: Ai;
  GEMINI_API_KEY?: string;
  TRACKING_WEBHOOK_URL?: string;
  WEBHOOK_URL?: string;
}

const SYSTEM_PROMPT = `You are the AI Watch Assistant — a friendly, knowledgeable sales advisor for the AI Watch Pro smartwatch.

CRITICAL LANGUAGE RULE:
- ALWAYS detect the language the user writes in and reply in EXACTLY that same language.
- If the user writes in Vietnamese (or mixes Vietnamese with English), you MUST reply in Vietnamese.
- Vietnamese accented characters (ă, â, ê, ô, ơ, ư, đ, à, á, ả, ã, ạ, ằ, ắ, ẳ, ẵ, ặ, ầ, ấ, ẩ, ẫ, ậ, è, é, ẻ, ẽ, ẹ, ề, ế, ể, ễ, ệ, ì, í, ỉ, ĩ, ị, ò, ó, ỏ, õ, ọ, ồ, ố, ổ, ỗ, ộ, ờ, ớ, ở, ỡ, ợ, ù, ú, ủ, ũ, ụ, ừ, ứ, ử, ữ, ự, ỳ, ý, ỷ, ỹ, ỵ) MUST appear naturally in your response.
- Do NOT switch to English even if the user's question contains product names or technical English words — keep the answer in Vietnamese unless the user clearly writes in English.

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
- Friendly, concise, helpful — sound like a Vietnamese salesperson, not a translator
- Maximum 3 short sentences per reply
- Use 1-2 emojis max per message
- If asked something you don't know, suggest they pre-order or contact support@aiwatch.com`;

async function callCloudflareAI(ai: Ai, userMessage: string): Promise<string | null> {
  try {
    const response = (await ai.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 250,
      temperature: 0.7,
      top_p: 0.9,
    })) as { response?: string };

    return response.response?.trim() || null;
  } catch (err) {
    console.error('Cloudflare AI error:', err);
    return null;
  }
}

function pickReplyFallback(message: string): string {
  const lower = message.toLowerCase();
  // Detect Vietnamese explicitly
  const vnMarkers = /[ăâêôơưđàáảãạằắẳẵặầấẩẫậèéẻẽẹềếểễệìíỉĩịòóỏõọồốổỗộờớởỡợùúủũụừứửữựỳýỷỹỵ]|giá|tính năng|giao hàng|đặt|màu|chào|chống nước|đổi|bảo hành/;
  const isVietnamese = vnMarkers.test(message);

  if (isVietnamese) {
    if (/(giá|bao nhiêu|cost|price)/.test(lower)) {
      return 'AI Watch Pro giá từ $299 (41mm) hoặc $329 (45mm). Đặt trước ngay để được giảm 25% từ giá bán lẻ $399! 🎉';
    }
    if (/(tính năng|thông số|spec)/.test(lower)) {
      return 'AI Watch có: pin 14 ngày, theo dõi sức khỏe AI (nhịp tim, SpO2, ECG, giấc ngủ), chống nước 5 ATM và màn hình AMOLED luôn hiển thị. Bạn quan tâm tính năng nào nhất?';
    }
    if (/(giao hàng|ship|shipping)/.test(lower)) {
      return 'Miễn phí giao hàng toàn quốc! Dự kiến giao vào tháng 8/2026. Khách đặt trước được ưu tiên giao sớm nhất. 📦';
    }
    if (/(đặt|đặt cọc|preorder|pre-order)/.test(lower)) {
      return 'Tuyệt vời! Bạn có thể đặt trước ngay tại trang này — nhấn nút "Đặt trước ngay". Giảm 25% giá bán lẻ, miễn phí ship và tặng kèm dây đeo cao cấp ($29)!';
    }
    if (/(màu|color)/.test(lower)) {
      return 'Có 3 màu: Midnight Black, Silver và Gold — tất cả đều hoàn thiện titan cao cấp. Bạn thích màu nào? ✨';
    }
    if (/(chào|hello|hi|hey)/.test(lower)) {
      return 'Chào bạn! 👋 Mình có thể hỗ trợ về giá, thông số, đặt trước hoặc mọi thứ liên quan đến AI Watch Pro. Bạn muốn tìm hiểu gì nè?';
    }
    if (/(nước|water|chống nước)/.test(lower)) {
      return 'AI Watch đạt chuẩn 5 ATM — bơi thoải mái đến 50m. Đi bơi, tắm, lặn biển đều ok! 🏊';
    }
    if (/(pin|battery)/.test(lower)) {
      return 'Pin 14 ngày cho mỗi lần sạc với sử dụng thông thường. Bật chế độ always-on thì khoảng 7 ngày. ⚡';
    }
    if (/(đổi|bảo hành|warranty|return)/.test(lower)) {
      return 'Đổi trả 30 ngày không hỏi lý do. Bảo hành mở rộng 2 năm miễn phí. 🛡️';
    }
    return 'Cảm ơn bạn đã quan tâm đến AI Watch Pro! Mình có thể hỗ trợ về giá, thông số, màu sắc, đặt trước hoặc giao hàng. Bạn muốn biết gì nè? 😊';
  }

  if (lower.includes('price') || lower.includes('cost')) {
    return 'AI Watch Pro starts at $299 (41mm) or $329 (45mm). Pre-order now to lock in 25% off the $399 retail price! 🎉';
  }
  if (lower.includes('feature') || lower.includes('spec')) {
    return 'AI Watch features: 14-day battery, AI health monitoring (HR, SpO2, ECG, sleep), 5 ATM water resistance, and always-on AMOLED display. Which spec matters most to you?';
  }
  if (lower.includes('shipping') || lower.includes('delivery')) {
    return 'Free worldwide shipping! Estimated delivery is August 2026. Pre-order customers get priority shipping. 📦';
  }
  if (lower.includes('preorder') || lower.includes('pre-order') || lower.includes('order')) {
    return 'Great choice! You can pre-order on this page — click the "Pre-order Now" button. 25% off retail, free shipping, and a free premium band ($29 value) included!';
  }
  if (lower.includes('color')) {
    return 'Available colors: Midnight Black, Silver, and Gold — all with premium titanium finish. Pick your favorite! ✨';
  }
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return 'Hi there! 👋 I can help with pricing, specs, pre-orders, or anything else about AI Watch Pro. What would you like to know?';
  }
  if (lower.includes('water') || lower.includes('waterproof')) {
    return 'AI Watch is rated 5 ATM — swim-proof up to 50 meters. Perfect for pools, showers, and open water! 🏊';
  }
  if (lower.includes('battery')) {
    return '14 days on a single charge with typical use. Always-on display mode drops it to about 7 days. ⚡';
  }
  if (lower.includes('return') || lower.includes('warranty')) {
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
  source: 'ai' | 'fallback',
): Promise<void> {
  const trackingWebhook = env.TRACKING_WEBHOOK_URL || env.WEBHOOK_URL;
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
    let source: 'ai' | 'fallback' = 'fallback';

    if (context.env.AI) {
      reply = await callCloudflareAI(context.env.AI, message);
      if (reply) {
        source = 'ai';
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