interface Env {
  TRACKING_WEBHOOK_URL?: string;
}

interface TrackingEvent {
  type?: string;
  action?: string;
  target?: string;
  metadata?: Record<string, unknown>;
  sessionId?: string;
  page?: string;
  timestamp?: string;
}

function getSessionId(request: Request): string {
  return request.headers.get('X-Session-Id') || 'anonymous';
}

function getOrigin(request: Request): string {
  return request.headers.get('Origin') || request.headers.get('Referer') || '';
}

function getIp(request: Request, clientIp?: string): string {
  return (
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('X-Forwarded-For')?.split(',')[0].trim() ||
    clientIp ||
    'unknown'
  );
}

function getCountry(request: Request, cf?: IncomingRequestCfProperties): string {
  return cf?.country || 'unknown';
}

async function forward(env: Env, event: TrackingEvent): Promise<void> {
  if (!env.TRACKING_WEBHOOK_URL) return;
  try {
    await fetch(env.TRACKING_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
  } catch (err) {
    console.error('tracking forward failed:', err);
  }
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = (await context.request.json()) as TrackingEvent;
    const event: TrackingEvent = {
      type: body.type || 'unknown',
      action: body.action,
      target: body.target,
      metadata: body.metadata,
      sessionId: body.sessionId || getSessionId(context.request),
      page: body.page,
      timestamp: body.timestamp || new Date().toISOString(),
    };

    context.waitUntil(forward(context.env, event));

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ success: false, message: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const onRequestGet: PagesFunction<Env> = async () => {
  return new Response(JSON.stringify({ success: false, message: 'Use POST' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  });
};