/**
 * Shubh Nimantran Master Password Authentication Service
 * Communicates with backend authentication endpoints (/api/auth/verify & /api/auth/verify-session)
 * or Cloudflare Worker for session creation and server-side HMAC validation.
 * 
 * SECURITY COMPLIANCE:
 * - Session token stored strictly in sessionStorage (cleared when browser session ends).
 * - Zero localStorage usage for auth tokens.
 * - Fails closed if server authentication secrets are missing.
 * - Safe non-JSON / HTML 404 response handling to prevent SyntaxError / Pattern exceptions.
 */

const TOKEN_STORAGE_KEY = 'shubh_editor_session_token';
export const LIVE_WORKER_AUTH_BASE = 'https://shubh-nimantran-shortener.goluraj1995.workers.dev';

export interface AuthVerifyResponse {
  ok: boolean;
  token?: string;
  expiresIn?: number;
  error?: string;
}

export interface SessionVerifyResponse {
  ok: boolean;
  valid: boolean;
  role?: string;
  expiresAt?: number;
  error?: string;
}

export const getStoredSessionToken = (): string | null => {
  try {
    return sessionStorage.getItem(TOKEN_STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to read session token from sessionStorage:', err);
    return null;
  }
};

export const setStoredSessionToken = (token: string): void => {
  try {
    sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch (err) {
    console.warn('Failed to save session token to sessionStorage:', err);
  }
};

export const clearStoredSessionToken = (): void => {
  try {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear session token:', err);
  }
};

/**
 * Resolves the appropriate target URL for authentication requests.
 * Uses Cloudflare Worker on static environments (GitHub Pages, preview domains)
 * and relative /api/... endpoints when running under local Express server.
 */
export function getAuthApiEndpoint(path: string): string {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname || '';
    // Route to Cloudflare Worker if running on GitHub Pages, preview domains, or Capacitor
    if (
      hostname.endsWith('github.io') ||
      hostname.includes('run.app') ||
      hostname === 'capacitor' ||
      window.location.protocol === 'capacitor:'
    ) {
      const workerPath = path.replace(/^\/api\/auth/, '/auth');
      return `${LIVE_WORKER_AUTH_BASE}${workerPath}`;
    }
  }
  return path;
}

/**
 * Safely parses response JSON, catching non-JSON HTML 404/500 responses from static hosts.
 */
async function parseJsonResponseSafe(response: Response): Promise<any> {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const text = await response.text();
    console.warn('Non-JSON response received from auth endpoint:', { status: response.status, contentType, textSample: text.substring(0, 100) });
    return { ok: false, error: `प्रमाणीकरण एंडपॉइंट अनुपलब्ध (HTTP ${response.status})` };
  }
  try {
    return await response.json();
  } catch (jsonErr) {
    console.warn('JSON parse error on auth response:', jsonErr);
    return { ok: false, error: 'प्रमाणीकरण प्रतिक्रिया पार्स करने में विफल' };
  }
}

/**
 * Verifies the entered Master Password against the backend/worker server.
 */
export async function verifyMasterPassword(password: string): Promise<AuthVerifyResponse> {
  if (!password || typeof password !== 'string') {
    return { ok: false, error: 'कृपया मास्टर पासवर्ड दर्ज करें' };
  }

  try {
    const targetUrl = getAuthApiEndpoint('/api/auth/verify');
    console.log('[Shubh Nimantran Auth] Verifying password at endpoint:', targetUrl);

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password: password.trim() })
    });

    const data = await parseJsonResponseSafe(response);

    if (response.ok && data.ok && data.token) {
      setStoredSessionToken(data.token);
      return { ok: true, token: data.token, expiresIn: data.expiresIn };
    } else {
      return { ok: false, error: data.error || 'गलत मास्टर पासवर्ड या प्रमाणीकरण अनुपलब्ध।' };
    }
  } catch (err: any) {
    console.error('Password verification error:', err);
    return { ok: false, error: err?.message || 'सर्वर से संपर्क करने में समस्या आई।' };
  }
}

/**
 * Validates the current stored session token with the backend/worker server-side HMAC signature.
 */
export async function checkSessionToken(tokenInput?: string): Promise<SessionVerifyResponse> {
  const token = tokenInput || getStoredSessionToken();
  if (!token) {
    return { ok: false, valid: false, error: 'कोई सक्रिय सत्र टोकन नहीं मिला' };
  }

  try {
    const targetUrl = getAuthApiEndpoint('/api/auth/verify-session');

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ token })
    });

    const data = await parseJsonResponseSafe(response);

    if (response.ok && data.ok && data.valid) {
      return { ok: true, valid: true, role: data.role, expiresAt: data.expiresAt };
    } else {
      clearStoredSessionToken();
      return { ok: false, valid: false, error: data.error || 'सत्र समाप्त हो गया है। कृपया पुनः लॉगिन करें।' };
    }
  } catch (err: any) {
    console.warn('Session check network warning:', err);
    return { ok: false, valid: false, error: 'सत्र सत्यापन में त्रुटि' };
  }
}
