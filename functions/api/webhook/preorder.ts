interface Env {
  PREORDER_WEBHOOK_URL?: string;
  TRACKING_WEBHOOK_URL?: string;
}

interface PagesContext<TEnv = Env> {
  request: Request;
  env: TEnv;
}

async function forwardToExternal(
  url: string | undefined,
  payload: Record<string, unknown>,
  fallbackMessage: string,
): Promise<Response> {
  if (!url) {
    console.log('[preorder] received:', JSON.stringify(payload));
    return new Response(
      JSON.stringify({ success: true, message: fallbackMessage }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('[preorder] upstream error:', response.status, await response.text());
      return new Response(
        JSON.stringify({ success: false, message: 'Upstream webhook failed' }),
        { status: 502, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const text = await response.text();
    return new Response(text || JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[preorder] forward failed:', err);
    return new Response(
      JSON.stringify({ success: false, message: 'Webhook unavailable' }),
      { status: 502, headers: { 'Content-Type': 'application/json' } },
    );
  }
}

export const onRequestPost = async ({ request, env }: PagesContext) => {
  try {
    const body = (await request.json()) as {
      fullName?: string;
      email?: string;
      phone?: string;
      color?: string;
      size?: string;
    };

    const { fullName, email, phone, color, size } = body;

    if (!fullName || !email || !phone) {
      return new Response(
        JSON.stringify({ success: false, message: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const payload = {
      type: 'preorder',
      fullName,
      email,
      phone,
      color,
      size,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('User-Agent') || 'unknown',
      cfRegion: request.headers.get('CF-IPCountry') || 'unknown',
    };

    const webhookUrl = env.PREORDER_WEBHOOK_URL || env.TRACKING_WEBHOOK_URL;

    if (!webhookUrl) {
      console.log('[preorder] no webhook configured, logging payload:', JSON.stringify(payload));
      return new Response(
        JSON.stringify({ success: true, message: 'Pre-order received (no upstream configured)' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    }

    return forwardToExternal(webhookUrl, payload, 'Pre-order forwarded');
  } catch (err) {
    console.error('[preorder] parse error:', err);
    return new Response(
      JSON.stringify({ success: false, message: 'Invalid request' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }
};

export const onRequestOptions = async () =>
  new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });