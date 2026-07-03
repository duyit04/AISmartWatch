// Webhook + backend API helpers
// Local: http://localhost:3001/api
// Production: https://your-domain.pages.dev/api
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001';

function getSessionId(): string {
  let sessionId = sessionStorage.getItem('aiwatch_session_id');
  if (!sessionId) {
    sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('aiwatch_session_id', sessionId);
  }
  return sessionId;
}

interface WebhookPayload {
  email: string;
  name?: string;
  phone?: string;
  model?: string;
  color?: string;
  message?: string;
  timestamp: string;
  source: string;
}

interface WebhookResponse {
  success: boolean;
  message: string;
}

interface PreOrderData {
  fullName: string;
  email: string;
  phone?: string;
  model?: string;
  color?: string;
  message?: string;
  timestamp: number;
}

export async function submitToWebhook(payload: WebhookPayload): Promise<WebhookResponse> {
  const backendPayload = {
    fullName: payload.name || '',
    email: payload.email,
    phone: payload.phone,
    model: payload.model || '45mm',
    color: payload.color || 'midnight',
    message: payload.message,
  };

  try {
    const response = await fetch(`${API_BASE}/api/webhook/preorder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-Id': getSessionId(),
      },
      body: JSON.stringify(backendPayload),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return { success: false, message: (data as { message?: string }).message || 'Submission failed' };
    }
    return { success: true, message: 'Submission successful' };
  } catch {
    return { success: false, message: 'Network error. Please try again.' };
  }
}

export function createWebhookPayload(
  formData: Record<string, string>,
  source: string = 'preorder-form'
): WebhookPayload {
  return {
    email: formData.email,
    name: formData.name || undefined,
    phone: formData.phone || undefined,
    model: formData.model || undefined,
    color: formData.color || undefined,
    message: formData.message || undefined,
    timestamp: new Date().toISOString(),
    source,
  };
}

export function createPreOrderEmbed(data: PreOrderData): Record<string, unknown> {
  const modelNames: Record<string, string> = {
    '41mm': '41mm - Compact & Light',
    '45mm': '45mm - Larger Display',
  };

  const colorNames: Record<string, string> = {
    midnight: 'Midnight Black',
    silver: 'Silver',
    gold: 'Gold',
  };

  return {
    title: '🎉 New Pre-order!',
    color: 0x0066FF,
    fields: [
      { name: '👤 Name', value: data.fullName, inline: true },
      { name: '📧 Email', value: data.email, inline: true },
      { name: '📱 Phone', value: data.phone || 'Not provided', inline: true },
      { name: '⌚ Model', value: modelNames[data.model as string] || data.model || 'Not selected', inline: true },
      { name: '🎨 Color', value: colorNames[data.color as string] || data.color || 'Not selected', inline: true },
      { name: '💬 Message', value: data.message || 'No message', inline: false },
    ],
    footer: {
      text: `AI Watch Pre-order • ${new Date(data.timestamp).toLocaleString()}`,
    },
  };
}
