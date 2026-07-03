interface Env {}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = (await context.request.json()) as Record<string, unknown>;
    const product = (body.product as string) || 'unknown';
    const webhookUrl = (context.env as Record<string, string | undefined>).WEBHOOK_URL;

    if (!webhookUrl) {
      return new Response(
        JSON.stringify({ success: true, message: `Preorder received for ${product} (no webhook configured)` }),
        { headers: { 'Content-Type': 'application/json' } },
      );
    }

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch (err) {
      console.error('webhook forward failed:', err);
    }

    return new Response(JSON.stringify({ success: true, message: 'Preorder received' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ success: false, message: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};