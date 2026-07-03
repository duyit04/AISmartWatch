interface Env {
  CART_KV?: KVNamespace;
}

interface CartItem {
  model: string;
  color: string;
  colorName: string;
  price: number;
  quantity: number;
  addedAt: number;
}

interface WishlistItem {
  model: string;
  color: string;
  colorName: string;
  price: number;
  addedAt: number;
}

function getSessionId(request: Request): string {
  return request.headers.get('X-Session-Id') || 'anonymous';
}

async function getJson<T>(env: Env, key: string, fallback: T): Promise<T> {
  if (!env.CART_KV) return fallback;
  try {
    const value = await env.CART_KV.get(key, 'json');
    return (value as T) ?? fallback;
  } catch {
    return fallback;
  }
}

async function setJson(env: Env, key: string, value: unknown): Promise<void> {
  if (!env.CART_KV) return;
  try {
    await env.CART_KV.put(key, JSON.stringify(value), { expirationTtl: 60 * 60 * 24 * 30 });
  } catch (err) {
    console.error(`KV put failed for ${key}:`, err);
  }
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = (await context.request.json()) as { items?: CartItem[] };
    const sessionId = getSessionId(context.request);
    const items = Array.isArray(body.items) ? body.items : [];

    await setJson(context.env, `cart:${sessionId}`, items);

    return new Response(JSON.stringify({ success: true, message: 'Cart synced' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ success: false, message: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const sessionId = getSessionId(context.request);
  const items = await getJson<CartItem[]>(context.env, `cart:${sessionId}`, []);
  return new Response(JSON.stringify({ success: true, items }), {
    headers: { 'Content-Type': 'application/json' },
  });
};