import { AnyInvitationData, HinduWeddingData, MuslimWeddingData, BirthdayData } from '../types/invitation';
import { normalizeInvitation } from './normalizeInvitation';
import { generateGuestInvitationUrlSync, generateGuestInvitationUrl, shortenUrlWithConfig, DEFAULT_WORKER_SHORTENER_API } from './guestLink';
import { uploadBase64ImageToSupabase } from './imageUpload';
export { exportCardAsImage, exportCardAsPdf } from './exportCard';

// Helper for Base64 UTF-8 encoding (handles Devanagari Hindi, Urdu, Sanskrit mantras)
const toBase64 = (str: string): string => {
  const bytes = new TextEncoder().encode(str);
  let binString = '';
  for (let i = 0; i < bytes.length; i += 8192) {
    binString += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + 8192)));
  }
  return btoa(binString);
};

import { gunzipSync, strFromU8 } from 'fflate';

// Helper for Base64 UTF-8 decoding
const fromBase64 = (str: string): string => {
  let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4 !== 0) b64 += '=';
  const decodedBin = atob(b64);
  const bytes = Uint8Array.from(decodedBin, m => m.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

// Minify data to remove redundant nulls and temporary blobs
const minifyData = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(v => minifyData(v)).filter(v => v !== null && v !== undefined);
  } else if (data !== null && typeof data === 'object') {
    const obj: any = {};
    for (const [k, v] of Object.entries(data)) {
      if (v === null || v === undefined || v === '') continue;
      if (k === 'updatedAt' || k === 'originalHeroImageUrl') continue;
      const minified = minifyData(v);
      if (minified !== null && minified !== undefined && minified !== '') {
        obj[k] = minified;
      }
    }
    return obj;
  }
  return data;
};

export const sanitizeForPublicShare = (card: AnyInvitationData): any => {
  if (!card) return {};
  const clone = JSON.parse(JSON.stringify(card));
  if (typeof clone.heroImageUrl === 'string' && clone.heroImageUrl.startsWith('blob:')) {
    clone.heroImageUrl = '';
  }
  if (clone.musicSettings && clone.musicSettings.audioUrl && clone.musicSettings.audioUrl.startsWith('blob:')) {
    clone.musicSettings.audioUrl = undefined;
    clone.musicSettings.mode = 'default';
  }
  return minifyData(clone);
};

/**
 * Prepares a clone of an invitation card for public sharing by uploading
 * heavy Base64 images (heroImageUrl and photos[]) to Supabase Storage ('invitation-images' bucket).
 * 
 * Rules:
 * - Never mutates the original card object (works on a deep clone).
 * - Leaves HTTPS URLs (e.g. Unsplash, existing Supabase CDN) untouched.
 * - De-duplicates identical Base64 strings (e.g. when hero image is also added as first gallery photo).
 * - Preserves music settings untouched (Base64 audio or Supabase audio remains intact).
 * - Throws an error on upload failure so the UI can notify the user instead of generating a broken link.
 */
export async function prepareCardForPublicShare(card: AnyInvitationData): Promise<AnyInvitationData> {
  if (!card) return card;

  // Deep clone to ensure zero mutations to the original card or local state
  const clone = JSON.parse(JSON.stringify(card)) as AnyInvitationData;
  const uploadCache = new Map<string, string>();

  const uploadIfBase64 = async (dataUrl: string, folder: string): Promise<string> => {
    if (!dataUrl || typeof dataUrl !== 'string') return dataUrl;
    if (!dataUrl.startsWith('data:image/')) return dataUrl;

    if (uploadCache.has(dataUrl)) {
      return uploadCache.get(dataUrl)!;
    }

    const uploadedUrl = await uploadBase64ImageToSupabase(dataUrl, folder);
    uploadCache.set(dataUrl, uploadedUrl);
    return uploadedUrl;
  };

  // 1. Hero Image
  if (typeof clone.heroImageUrl === 'string' && clone.heroImageUrl.startsWith('data:image/')) {
    clone.heroImageUrl = await uploadIfBase64(clone.heroImageUrl, 'invitation-heroes');
  }

  // 2. Photos gallery
  if (Array.isArray(clone.photos)) {
    for (const photo of clone.photos) {
      if (photo && typeof photo.url === 'string' && photo.url.startsWith('data:image/')) {
        photo.url = await uploadIfBase64(photo.url, 'invitation-gallery');
      }
    }
  }

  // 3. Legacy gallery array if present
  if (Array.isArray((clone as any).gallery)) {
    for (const item of (clone as any).gallery) {
      if (typeof item === 'string' && item.startsWith('data:image/')) {
        const idx = (clone as any).gallery.indexOf(item);
        (clone as any).gallery[idx] = await uploadIfBase64(item, 'invitation-gallery');
      } else if (item && typeof item.url === 'string' && item.url.startsWith('data:image/')) {
        item.url = await uploadIfBase64(item.url, 'invitation-gallery');
      }
    }
  }

  // 4. Custom background image if present
  const bgSettings = (clone as any).backgroundSettings || (clone as any).design?.background;
  if (bgSettings && typeof bgSettings.customBgUrl === 'string' && bgSettings.customBgUrl.startsWith('data:image/')) {
    bgSettings.customBgUrl = await uploadIfBase64(bgSettings.customBgUrl, 'invitation-backgrounds');
  }

  return clone;
}

export const generatePublicShareUrl = (card: AnyInvitationData): { url: string; isLocalhost: boolean } => {
  try {
    const url = generateGuestInvitationUrlSync(card);
    const hostname = typeof window !== 'undefined' ? window?.location?.hostname : 'localhost';
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
    return { url, isLocalhost };
  } catch (err) {
    console.error('generatePublicShareUrl failed:', err);
    throw err;
  }
};

export interface TinyUrlResult {
  shortUrl: string;
  status: 'success' | 'timeout' | 'network_error' | 'http_error' | 'invalid_response';
  message: string;
}

// Generate Short URL via Cloudflare Worker POST /shorten endpoint
export const generateShortUrlViaTinyUrl = async (longUrl: string): Promise<TinyUrlResult> => {
  const res = await shortenUrlWithConfig(longUrl);
  if (res.success && res.shortUrl) {
    return {
      shortUrl: res.shortUrl,
      status: 'success',
      message: 'छोटा लिंक सफलतापूर्वक बन गया'
    };
  } else {
    return {
      shortUrl: '',
      status: 'http_error',
      message: res.error || 'शॉर्ट लिंक नहीं बन सका'
    };
  }
};

export const checkIsPublicGuest = (isReadOnlyProp?: boolean, data?: any): boolean => {
  if (isReadOnlyProp === true) return true;
  if (data?.isReadOnly === true) return true;
  if (data?.isPublicGuest === true) return true;
  if (data?.isSharedMode === true) return true;

  if (typeof window !== 'undefined') {
    const href = (window.location.href || '').toLowerCase();
    const search = (window.location.search || '').toLowerCase();
    const hash = (window.location.hash || '').toLowerCase();

    if (
      href.includes('invite') ||
      search.includes('invite') ||
      hash.includes('invite') ||
      href.includes('gz_') ||
      search.includes('gz_') ||
      hash.includes('gz_')
    ) {
      return true;
    }
  }

  return false;
};

export const parseInvitationFromUrlSync = (): AnyInvitationData | null => {
  try {
    if (typeof window === 'undefined') return null;

    let rawParam: string | null = null;

    // 1. Try URLSearchParams on search string
    if (window.location.search && window.location.search.length > 1) {
      try {
        const params = new URLSearchParams(window.location.search);
        rawParam = params.get('invite');
      } catch (e) {
        console.warn('URLSearchParams search error:', e);
      }
    }

    // 2. Try URLSearchParams on hash (handles #/?invite=... or #invite=...)
    if (!rawParam && window.location.hash) {
      try {
        const hashStr = window.location.hash.replace(/^#\/?/, '');
        const queryIdx = hashStr.indexOf('?');
        if (queryIdx >= 0) {
          const hashParams = new URLSearchParams(hashStr.substring(queryIdx + 1));
          rawParam = hashParams.get('invite');
        } else if (hashStr.includes('invite=')) {
          const hashParams = new URLSearchParams(hashStr);
          rawParam = hashParams.get('invite');
        }
      } catch (e) {
        console.warn('URLSearchParams hash error:', e);
      }
    }

    // 3. Fallback regex stopping at delimiters [&?#]
    if (!rawParam && typeof window.location.href === 'string' && window.location.href.includes('invite=')) {
      const match = window.location.href.match(/[?&#]invite=([^&#]+)/);
      if (match && match[1]) {
        rawParam = match[1];
      }
    }

    if (!rawParam) return null;

    // Decode percent encoding safely
    let encodedData = rawParam.trim();
    try {
      if (encodedData.includes('%')) {
        encodedData = decodeURIComponent(encodedData);
      }
    } catch {
      // Keep raw string if URI decode fails
    }

    // Check if compressed with gzip (prefixed with gz_)
    if (encodedData.startsWith('gz_')) {
      try {
        let b64 = encodedData.substring(3).replace(/-/g, '+').replace(/_/g, '/');
        while (b64.length % 4 !== 0) {
          b64 += '=';
        }
        const bin = atob(b64);
        const bytes = Uint8Array.from(bin, m => m.charCodeAt(0));

        // Primary: pure JS decompress with fflate (100% synchronous)
        const decompressed = gunzipSync(bytes);
        const jsonText = strFromU8(decompressed);
        const rawData = JSON.parse(jsonText);
        const normalized = normalizeInvitation(rawData);
        if (normalized) {
          normalized.isReadOnly = true;
          normalized.isPublicGuest = true;
          normalized.isSharedMode = true;
          console.log('[Shubh Nimantran Synchronous URL Parser]', {
            cardId: normalized.id,
            guestName: normalized.personalGuestName,
            category: normalized.category
          });
        }
        return normalized;
      } catch (gzErr) {
        console.warn('fflate gunzipSync failed:', gzErr);
      }
    }

    // Standard UTF-8 Base64 decode fallback
    try {
      const jsonStr = fromBase64(encodedData);
      const rawData = JSON.parse(jsonStr);
      const normalizedBase64 = normalizeInvitation(rawData);
      if (normalizedBase64) {
        normalizedBase64.isReadOnly = true;
        normalizedBase64.isPublicGuest = true;
        normalizedBase64.isSharedMode = true;
      }
      return normalizedBase64;
    } catch (b64Err) {
      console.error('Base64 decode fallback failed:', b64Err);
    }

    return null;
  } catch (err) {
    console.error('parseInvitationFromUrlSync error:', err);
    return null;
  }
};

export const parseInvitationFromUrl = async (): Promise<AnyInvitationData | null> => {
  return parseInvitationFromUrlSync();
};

export interface ServerSyncResult {
  id: string;
  token: string;
  publicUrl: string;
  editUrl: string;
}

export const syncCardWithServer = async (card: AnyInvitationData): Promise<ServerSyncResult> => {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const savedMetaStr = typeof localStorage !== 'undefined' ? localStorage.getItem('owned_invitations') || '{}' : '{}';
  const savedMeta = JSON.parse(savedMetaStr);
  const existingRecord = savedMeta[card.id];

  const payload: any = {
    category: card.category,
    data: sanitizeForPublicShare(card),
    familyNames: (card as any).groomName
      ? `${(card as any).groomName} संग ${(card as any).brideName}`
      : (card as any).celebrantName
      ? `${(card as any).celebrantName} का जन्मदिन`
      : card.title || 'शुभ निमंत्रण',
    eventDate: (card as any).weddingDateDisplay || (card as any).partyDateDisplay || '',
    requestedId: card.id,
    requestedToken: existingRecord?.token
  };

  const response = await fetch('/api/invitations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Server returned ${response.status}`);
  }

  const result = await response.json();
  const id = result.id;
  const token = result.token;

  savedMeta[id] = {
    token,
    familyNames: payload.familyNames,
    eventDate: payload.eventDate,
    category: payload.category,
    updatedAt: new Date().toISOString()
  };
  localStorage.setItem('owned_invitations', JSON.stringify(savedMeta));

  return {
    id,
    token,
    publicUrl: `${origin}/#invite=${id}`,
    editUrl: `${origin}/edit/${id}?token=${token}`
  };
};

export const getWhatsAppShareMessage = (card: AnyInvitationData, publicUrl: string, guestName?: string): string => {
  const gName = (guestName || card.personalGuestName)?.trim();
  const guestHeader = gName ? `✨ *सादर आमंत्रण — आदरणीय ${gName} जी के लिए* ✨\n\n` : '';

  if (card.category === 'hindu_wedding') {
    const hCard = card as HinduWeddingData;
    return (
      '🚩 *॥ श्री गणेशाय नमः ॥* 🚩\n\n' +
      guestHeader +
      '*सादर आमंत्रण - शुभ विवाह*\n\n' +
      'परमपिता परमात्मा के असीम आशीर्वाद से हमारे प्रिय:\n' +
      '*' + hCard.groomName + '* (' + hCard.groomParents + ')\n' +
      '        संग\n' +
      '*' + hCard.brideName + '* (' + hCard.brideParents + ')\n\n' +
      'का पावन विवाह संस्कार संपन्न होना निश्चित हुआ है।\n\n' +
      '📅 *विवाह तिथि:* ' + hCard.weddingDateDisplay + '\n' +
      '⏰ *शुभ मुहूर्त:* ' + hCard.weddingMuhurat + '\n' +
      '📍 *विवाह स्थल:* ' + hCard.venueName + ', ' + hCard.venueAddress + '\n\n' +
      'आप सपरिवार पधारकर वर-वधू को अपना स्नेहमयी शुभाशीर्वाद प्रदान करें।\n\n' +
      '👉 *डिजिटल विवाह निमंत्रण पत्र यहाँ खोलें:*\n' + publicUrl
    );
  } else if (card.category === 'muslim_wedding') {
    const mCard = card as MuslimWeddingData;
    return (
      '🌙 *' + (mCard.bismillahText || 'बिसमिल्लाहिर रहमानिर रहीम') + '* 🌙\n\n' +
      guestHeader +
      '*दावत-ए-निकाह व वलीमा*\n\n' +
      'अल्लाह तआला के फ़ज़्ल-ओ-करम से हमारे अज़ीज़:\n' +
      '*' + mCard.groomName + '* संग *' + mCard.brideName + '*\n\n' +
      '📍 *मुकाम:* ' + (mCard.venueName || 'निर्धारित स्थान') + '\n\n' +
      'तशरीफ़ लाकर बाइस-ए-मसर्रत फरमाएं।\n\n' +
      '👉 *डिजिटल कार्ड खोलें:*\n' + publicUrl
    );
  } else {
    const bCard = card as BirthdayData;
    return (
      '🎂 *जन्मदिन की दावत (Birthday Celebration)* 🎂\n\n' +
      guestHeader +
      '*' + bCard.celebrantName + '* का जन्मदिन!\n\n' +
      '📍 *स्थान:* ' + (bCard.venueName || 'निर्धारित स्थान') + '\n\n' +
      '👉 *डिजिटल निमंत्रण कार्ड खोलें:*\n' + publicUrl
    );
  }
};
