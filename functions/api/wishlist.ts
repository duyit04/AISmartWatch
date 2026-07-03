interface Env {
  WISHLIST_KV?: KVNamespace;
  CART_KV?: KVNamespace;
}

interface WishlistItem {
  id: string;
  [key: string]: unknown;
}

async function getItems(env: Env, key: string): Promise<WishlistItem[]> {
  const kv = env.WISHLIST_KV || env.CART_KV;
  if (!kv) return [];
  const data = await kv.get(`wishlist:${key}`);
  if (!data) return [];
  try {
    return JSON.parse(data) as WishlistItem[];
  } catch {
    return [];
  }
}

async function setItems(env: Env, key: string, items: WishlistItem[]): Promise<void> {
  const kv = env.WISHLIST_KV || env.CART_KV;
  if (!kv) return;
  await kv.put(`wishlist:${key}`, JSON.stringify(items));
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
  const body = (await request.json().catch(() => ({}))) as { items?: WishlistItem[] };
  const items = Array.isArray(body.items) ? body.items : [];
  await setItems(env, sessionId, items);
  return new Response(JSON.stringify({ success: true, message: 'Wishlist synced' }), {
    headers: { 'Content-Type': 'application/json' },
  });
};