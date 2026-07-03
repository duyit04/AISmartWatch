interface Env {
  WEBHOOK_URL?: string;
}

const DISCORD_EMBED_COLOR = 0x0066ff;

interface PreOrderPayload {
  fullName?: string;
  email?: string;
  phone?: string;
  model?: string;
  color?: string;
  message?: string;
}

function buildDiscordEmbed(payload: PreOrderPayload, receivedAt: string) {
  return {
    title: '🎉 New AI Watch Pre-order!',
    color: DISCORD_EMBED_COLOR,
    fields: [
      { name: '👤 Name', value: payload.fullName || '—', inline: true },
      { name: '📧 Email', value: payload.email || '—', inline: true },
      { name: '📱 Phone', value: payload.phone || 'Not provided', inline: true },
      { name: '⌚ Model', value: payload.model || '—', inline: true },
      { name: '🎨 Color', value: payload.color || '—', inline: true },
      { name: '💬 Message', value: payload.message || 'No message', inline: false },
    ],
    footer: { text: `AI Watch Pre-order • ${receivedAt}` },
    timestamp: receivedAt,
  };
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function forwardToWebhook(
  webhookUrl: string,
  payload: PreOrderPayload,
  receivedAt: string,
): Promise<{ ok: boolean; status: number; error?: string }> {
  const isDiscord = webhookUrl.includes('discord.com/api/webhooks');

  const body = isDiscord
    ? {
        username: 'AI Watch Bot',
        embeds: [buildDiscordEmbed(payload, receivedAt)],
      }
    : payload;

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return { ok: response.ok, status: response.status };
  } catch (err) {
    return { ok: false, status: 0, error: err instanceof Error ? err.message : String(err) };
  }
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  let payload: PreOrderPayload;
  try {
    payload = (await context.request.json()) as PreOrderPayload;
  } catch {
    return new Response(JSON.stringify({ success: false, message: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Server-side validation
  if (!payload.email || !isValidEmail(payload.email)) {
    return new Response(JSON.stringify({ success: false, message: 'Valid email is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!payload.fullName || payload.fullName.trim().length < 2) {
    return new Response(JSON.stringify({ success: false, message: 'Full name is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const receivedAt = new Date().toISOString();
  const webhookUrl = context.env.WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn('[preorder] No WEBHOOK_URL configured — order accepted but not forwarded');
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Pre-order received (no webhook configured)',
        orderId: `pending-${Date.now().toString(36)}`,
      }),
      { headers: { 'Content-Type': 'application/json' } },
    );
  }

  const result = await forwardToWebhook(webhookUrl, payload, receivedAt);

  if (!result.ok) {
    console.error('[preorder] webhook forward failed:', result);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'We received your order but could not notify the team. Please email support@aiwatch.com.',
      }),
      { status: 502, headers: { 'Content-Type': 'application/json' } },
    );
  }

  return new Response(
    JSON.stringify({
      success: true,
      message: 'Pre-order received and confirmed',
      orderId: `ord-${Date.now().toString(36)}`,
    }),
    { headers: { 'Content-Type': 'application/json' } },
  );
};

export const onRequestGet: PagesFunction<Env> = async () => {
  return new Response(JSON.stringify({ success: false, message: 'Use POST' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  });
};