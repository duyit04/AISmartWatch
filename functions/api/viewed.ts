interface Env {}

async function readBody(request: Request): Promise<{ items?: unknown[]; ok: boolean }> {
  try {
    const body = (await request.json()) as { items?: unknown[] };
    return { items: body.items, ok: true };
  } catch {
    return { ok: false };
  }
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { ok } = await readBody(context.request);
  if (!ok) {
    return new Response(JSON.stringify({ success: false, message: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return new Response(JSON.stringify({ success: true, message: 'Viewed products synced' }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const onRequestGet: PagesFunction<Env> = async () => {
  return new Response(JSON.stringify({ success: true, items: [] }), {
    headers: { 'Content-Type': 'application/json' },
  });
};