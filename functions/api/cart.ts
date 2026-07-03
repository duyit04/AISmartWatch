interface Env {
  CART_KV?: KVNamespace;
}

interface CartItem {
  id: string;
  quantity: number;
  [key: string]: unknown;
}

const FALLBACK: CartItem[] = [];

async function getItems(env: Env, key: string): Promise<CartItem[]> {
  if (!env.CART_KV) return FALLBACK;
  const data = await env.CART_KV.get(`cart:${key}`);
  if (!data) return [];
  try {
    return JSON.parse(data) as CartItem[];
  } catch {
    return [];
  }
}

async function setItems(env: Env, key: string, items: CartItem[]): Promise<void> {
  if (!env.CART_KV) return;
  await env.CART_KV.put(`cart:${key}`, JSON.stringify(items));
}

export const onRequestGet = async ({ request, env }: { request: Request; env: Env }) => {
  const sessionId = request.headers.get('X-Session-Id') || 'anonymous';
  const items = await getItems(env, sessionId);
  return new Response(JSON.stringify({ success: true, items }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  const sessionId = request.headers.get('X-Session-Id') || 'anonymous';
  const body = (await request.json().catch(() => ({}))) as { items?: CartItem[] };
  const items = Array.isArray(body.items) ? body.items : [];
  await setItems(env, sessionId, items);
  return new Response(JSON.stringify({ success: true, message: 'Cart synced' }), {
    headers: { 'Content-Type': 'application/json' },
  });
};