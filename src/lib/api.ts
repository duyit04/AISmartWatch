// Local: http://localhost:3001
// Production: relative path (sẽ dùng cùng domain)
const API_BASE = import.meta.env.VITE_API_BASE || '';

function getSessionId(): string {
  let sessionId = sessionStorage.getItem('aiwatch_session_id');
  if (!sessionId) {
    sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('aiwatch_session_id', sessionId);
  }
  return sessionId;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Session-Id': getSessionId(),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error((data as { message?: string }).message || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  preorder: (payload: Record<string, unknown>) => apiPost<{ success: boolean; message: string }>('/api/webhook/preorder', payload),
  cart: (items: Array<Record<string, unknown>>) => apiPost<{ success: boolean; message: string }>('/api/cart', { items }),
  wishlist: (items: Array<Record<string, unknown>>) => apiPost<{ success: boolean; message: string }>('/api/wishlist', { items }),
  viewed: (items: Array<Record<string, unknown>>) => apiPost<{ success: boolean; message: string }>('/api/viewed', { items }),
  chat: (message: string) =>
    apiPost<{ success: boolean; reply: string; source?: 'gemini' | 'fallback' }>('/api/chat', { message }),
};
