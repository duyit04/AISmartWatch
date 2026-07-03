interface Env {}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    await context.request.json();
  } catch {
    // ignore parse errors
  }
  return new Response(JSON.stringify({ success: true, message: 'Wishlist synced' }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const onRequestGet: PagesFunction<Env> = async () => {
  return new Response(JSON.stringify({ success: true, items: [] }), {
    headers: { 'Content-Type': 'application/json' },
  });
};