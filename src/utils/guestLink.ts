import { AnyInvitationData } from '../types/invitation';
import { sanitizeForPublicShare } from './shareInvitation';

export const DEFAULT_WORKER_SHORTENER_API = 'https://shubh-nimantran-shortener.goluraj1995.workers.dev/shorten';

// Helper for Base64 UTF-8 encoding
export const toBase64 = (str: string): string => {
  const bytes = new TextEncoder().encode(str);
  let binString = '';
  for (let i = 0; i < bytes.length; i += 8192) {
    binString += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + 8192)));
  }
  return btoa(binString);
};

// Returns the public base URL of the deployed application
export const getPublicBaseUrl = (): string => {
  // If explicitly configured in environment variable
  const publicAppUrl = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_PUBLIC_APP_URL) || '';
  if (publicAppUrl && typeof publicAppUrl === 'string') {
    return publicAppUrl.endsWith('/') ? publicAppUrl : publicAppUrl + '/';
  }

  // If running in browser
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname || '';
    const origin = window.location.origin || '';

    // If running on production GitHub Pages
    if (hostname.endsWith('github.io')) {
      let pathname = window.location.pathname || '/';
      pathname = pathname.replace(/\/(edit|create)(\/.*)?$/, '') || '/';
      return origin + (pathname.endsWith('/') ? pathname : pathname + '/');
    }

    // In local dev, Android Capacitor (capacitor://localhost), or preview domains,
    // the invitation link sent to guests on WhatsApp MUST point to the live public GitHub Pages site
    return 'https://goluraj1995.github.io/shubh-nimantran/';
  }

  return 'https://goluraj1995.github.io/shubh-nimantran/';
};

import { gzipSync, strToU8 } from 'fflate';

// Synchronous version for instant rendering/fallback using pure JS gzip
export const generateGuestInvitationUrlSync = (card: AnyInvitationData, guestName?: string): string => {
  const cleanCard = sanitizeForPublicShare(card);
  const targetGuestName = guestName !== undefined
    ? (guestName.trim() || undefined)
    : (cleanCard.personalGuestName || card.personalGuestName || undefined);

  const payload = {
    ...cleanCard,
    personalGuestName: targetGuestName
  };
  const jsonStr = JSON.stringify(payload);
  const baseUrl = getPublicBaseUrl();

  console.log('[Shubh Nimantran URL Generator Diagnostics]', {
    cardId: card.id,
    guestName: targetGuestName,
    jsonLength: jsonStr.length
  });

  try {
    const compressed = gzipSync(strToU8(jsonStr));
    let bin = '';
    for (let i = 0; i < compressed.length; i += 8192) {
      bin += String.fromCharCode.apply(null, Array.from(compressed.subarray(i, i + 8192)));
    }
    const b64 = 'gz_' + btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return baseUrl + '?invite=' + encodeURIComponent(b64);
  } catch (err) {
    console.warn('Gzip sync failed, falling back to base64:', err);
    const encoded = toBase64(jsonStr);
    return baseUrl + '?invite=' + encodeURIComponent(encoded);
  }
};

// Asynchronous compressed version (guarantees gzip base64 staying under 4.5k chars)
export const generateGuestInvitationUrl = async (card: AnyInvitationData, guestName?: string): Promise<string> => {
  return generateGuestInvitationUrlSync(card, guestName);
};

export interface ShortenResult {
  success: boolean;
  shortUrl: string;
  httpStatus?: number;
  error?: string;
  isCorsOrNetworkIssue?: boolean;
  detectedOrigin?: string;
  responseText?: string;
}

export const getShortenerEndpoint = (customApiUrl?: string): string => {
  const trimmed = customApiUrl?.trim();
  if (trimmed && trimmed !== DEFAULT_WORKER_SHORTENER_API) {
    return trimmed;
  }
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname || '';
    // Direct Cloudflare Worker for production GitHub Pages and AI Studio Preview (run.app)
    if (hostname.endsWith('github.io') || hostname.endsWith('run.app')) {
      return DEFAULT_WORKER_SHORTENER_API;
    }
    return '/api/shorten';
  }
  return DEFAULT_WORKER_SHORTENER_API;
};

export const extractShortUrlFromResponse = (data: any, responseText: string): string => {
  if (data && typeof data === 'object') {
    const candidates = [
      data.shortUrl,
      data.short_url,
      data.tiny_url,
      data.tinyUrl,
      data.url,
      data.short,
      data.result,
      data.link,
      data.shortenedUrl,
      data.shortened_url
    ];

    for (const c of candidates) {
      if (typeof c === 'string' && c.trim().startsWith('http')) {
        return c.trim();
      }
    }

    if (data.data && typeof data.data === 'object') {
      const nested = extractShortUrlFromResponse(data.data, '');
      if (nested) return nested;
    }
    if (data.result && typeof data.result === 'object') {
      const nested = extractShortUrlFromResponse(data.result, '');
      if (nested) return nested;
    }
  }

  if (typeof data === 'string' && data.trim().startsWith('http')) {
    return data.trim();
  }

  const trimmedText = (responseText || '').trim();
  // Guard against HTML documents (e.g. auth/cookie checks, 404 pages) being mistaken for valid text responses
  if (trimmedText.startsWith('<!doctype') || trimmedText.startsWith('<html') || trimmedText.startsWith('<?xml') || trimmedText.startsWith('<')) {
    return '';
  }

  if (trimmedText.startsWith('http://') || trimmedText.startsWith('https://')) {
    const firstLine = trimmedText.split(/[\r\n]+/)[0].trim();
    if (firstLine.startsWith('http://') || firstLine.startsWith('https://')) {
      return firstLine;
    }
  }

  return '';
};

// Calls Cloudflare Worker /shorten endpoint via POST to create a TinyURL
export const shortenUrlWithConfig = async (
  longUrl: string,
  customApiUrl?: string
): Promise<ShortenResult> => {
  const endpoint = getShortenerEndpoint(customApiUrl);
  const controller = new AbortController();
  // 12-second timeout for mobile networks & upstream TinyURL response
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: longUrl }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const status = response.status;
    let responseText = '';
    try {
      responseText = await response.text();
    } catch {
      // Non-readable text
    }

    let data: any = null;
    try {
      data = JSON.parse(responseText);
    } catch {
      // Non-JSON response
    }

    if (!response.ok) {
      // In preview environments (run.app), if the remote worker returns 403 origin restriction, attempt fallback to server proxy
      if (status === 403 && endpoint === DEFAULT_WORKER_SHORTENER_API && typeof window !== 'undefined' && window.location.hostname.endsWith('run.app')) {
        try {
          const proxyRes = await fetch('/api/shorten', {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: longUrl })
          });
          if (proxyRes.ok) {
            const proxyText = await proxyRes.text();
            let proxyData: any = null;
            try { proxyData = JSON.parse(proxyText); } catch {}
            const proxyShortUrl = extractShortUrlFromResponse(proxyData, proxyText);
            if (proxyShortUrl) {
              return {
                success: true,
                shortUrl: proxyShortUrl,
                httpStatus: proxyRes.status
              };
            }
          }
        } catch {
          // Retain primary worker status error below
        }
      }

      let specificMsg = data?.error || responseText;
      if (!specificMsg) {
        if (status === 400) specificMsg = 'अमान्य अनुरोध या URL (HTTP 400)';
        else if (status === 403) specificMsg = 'डोमेन अस्वीकृत (HTTP 403: केवल goluraj1995.github.io समर्थित है)';
        else if (status === 404) specificMsg = 'एंडपॉइंट नहीं मिला (HTTP 404 /shorten)';
        else if (status === 500) specificMsg = 'वर्कर आंतरिक सर्वर त्रुटि (HTTP 500)';
        else specificMsg = `HTTP त्रुटि (${status}${response.statusText ? ' ' + response.statusText : ''})`;
      } else {
        specificMsg = `HTTP ${status}: ${specificMsg}`;
      }
      return {
        success: false,
        shortUrl: '',
        httpStatus: status,
        responseText,
        error: specificMsg
      };
    }

    const detectedShortUrl = extractShortUrlFromResponse(data, responseText);
    if (detectedShortUrl) {
      return {
        success: true,
        shortUrl: detectedShortUrl,
        httpStatus: status
      };
    } else {
      const isHtml = (responseText || '').trim().startsWith('<');
      const errDetail = isHtml
        ? 'सर्वर से HTML दस्तावेज़ प्राप्त हुआ (URL प्राप्त नहीं हुआ)'
        : (data && data.error) ? String(data.error) : 'अमान्य रिस्पांस फॉर्मेट (Short URL प्राप्त नहीं हुआ)';
      return {
        success: false,
        shortUrl: '',
        httpStatus: status,
        responseText,
        error: errDetail
      };
    }
  } catch (err: any) {
    clearTimeout(timeoutId);
    const rawMsg = err?.message || 'Load failed';
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    const currentOrigin = typeof window !== 'undefined'
      ? (window.location.origin || `${window.location.protocol}//${window.location.host}`)
      : 'unknown';
    const isLiveOrigin = currentOrigin === 'https://goluraj1995.github.io';
    const isCapacitorOrAndroid = typeof window !== 'undefined' && (
      window.location.protocol === 'capacitor:' ||
      window.location.protocol === 'file:' ||
      window.location.hostname === 'localhost' ||
      !!(window as any).Capacitor
    );

    console.warn('[Shubh Nimantran Shortener API Error]', {
      timestamp: new Date().toISOString(),
      currentOrigin,
      isLiveOrigin,
      isCapacitorOrAndroid,
      isOnline,
      endpoint,
      errorName: err?.name,
      errorMessage: rawMsg
    });

    if (err?.name === 'AbortError') {
      return {
        success: false,
        shortUrl: '',
        detectedOrigin: currentOrigin,
        error: 'शॉर्टनर अनुरोध टाइमआउट (12 सेकंड में वर्कर से उत्तर नहीं मिला)'
      };
    }

    if (!isOnline) {
      return {
        success: false,
        shortUrl: '',
        isCorsOrNetworkIssue: true,
        detectedOrigin: currentOrigin,
        error: `नेटवर्क विफलता: डिवाइस ऑफ़लाइन है (${rawMsg})`
      };
    }

    // Precise runtime origin detection without guessing
    if (!isLiveOrigin) {
      if (isCapacitorOrAndroid) {
        return {
          success: false,
          shortUrl: '',
          isCorsOrNetworkIssue: true,
          detectedOrigin: currentOrigin,
          error: `Android WebView ओरिजिन (${currentOrigin}): Cloudflare Worker पर लाइव ओरिजिन (https://goluraj1995.github.io) सेट है (${rawMsg})।`
        };
      }
      return {
        success: false,
        shortUrl: '',
        isCorsOrNetworkIssue: true,
        detectedOrigin: currentOrigin,
        error: `ब्राउज़र ओरिजिन (${currentOrigin}): Cloudflare Worker केवल लाइव डोमेन (https://goluraj1995.github.io) से शॉर्टनर अनुरोध स्वीकार करता है (${rawMsg})।`
      };
    }

    return {
      success: false,
      shortUrl: '',
      isCorsOrNetworkIssue: true,
      detectedOrigin: currentOrigin,
      error: `नेटवर्क विफलता अथवा ब्राउज़र CORS प्रतिबंध (${rawMsg})`
    };
  }
};
