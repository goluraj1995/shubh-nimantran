/**
 * Shubh Nimantran URL Shortener & Authentication Gate — Cloudflare Worker
 * Endpoints:
 *   - POST /shorten
 *   - POST /auth/verify
 *   - POST /auth/verify-session
 * Allowed Live Origin: https://goluraj1995.github.io
 * 
 * SECURITY DESIGN:
 * 1. ZERO default passwords. Fails closed if env.MASTER_PASSWORD_HASH or env.JWT_SECRET is missing/unconfigured.
 * 2. Password Hashing: PBKDF2-HMAC-SHA256 with 100,000 iterations and cryptographic salt.
 * 3. Session Expiration: 4 hours (14,400 seconds).
 * 4. Token Claim Validation: HMAC signature, exp, iss, aud, role, version.
 */

function isOriginAllowed(requestOrigin) {
  if (!requestOrigin || typeof requestOrigin !== 'string') {
    return false;
  }

  const trimmed = requestOrigin.trim();

  // 1. Live Production GitHub Pages
  if (trimmed === 'https://goluraj1995.github.io') {
    return true;
  }

  // 2. Local Capacitor or Dev Server
  if (trimmed === 'capacitor://localhost' || trimmed === 'http://localhost:3000') {
    return true;
  }

  // 3. AI Studio Preview Origin Validation
  try {
    const parsed = new URL(trimmed);

    if (parsed.protocol !== 'https:') {
      return false;
    }

    if (parsed.username || parsed.password) {
      return false;
    }

    if (parsed.port) {
      return false;
    }

    if (parsed.pathname !== '/' || parsed.search || parsed.hash) {
      return false;
    }

    if (trimmed !== `${parsed.protocol}//${parsed.host}`) {
      return false;
    }

    const hostname = parsed.hostname.toLowerCase();
    if (!hostname.endsWith('.run.app')) {
      return false;
    }

    const labels = hostname.split('.');
    const firstLabel = labels[0];
    if (!firstLabel.startsWith('ais-dev-') && !firstLabel.startsWith('ais-pre-')) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

function getCorsHeaders(requestOrigin) {
  const headers = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
    'Cache-Control': 'no-store'
  };

  if (isOriginAllowed(requestOrigin)) {
    headers['Access-Control-Allow-Origin'] = requestOrigin.trim();
  }

  return headers;
}

function hexToUint8Array(hexString) {
  const cleanHex = hexString.replace(/[^0-9a-fA-F]/g, '');
  if (cleanHex.length % 2 !== 0) return new Uint8Array(0);
  const array = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < cleanHex.length; i += 2) {
    array[i / 2] = parseInt(cleanHex.substring(i, i + 2), 16);
  }
  return array;
}

function uint8ArrayToHex(uint8Array) {
  return Array.from(uint8Array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Derives key using PBKDF2-HMAC-SHA256 (100,000 iterations)
 */
async function derivePBKDF2(password, saltHex, iterations = 100000) {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password.trim());
  const saltBuffer = hexToUint8Array(saltHex);

  if (saltBuffer.length === 0) {
    throw new Error('Invalid salt format');
  }

  const baseKey = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const derivedBuffer = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: iterations,
      hash: 'SHA-256'
    },
    baseKey,
    256 // 256 bits = 32 bytes
  );

  return uint8ArrayToHex(new Uint8Array(derivedBuffer));
}

/**
 * Web Crypto HMAC SHA-256 Signature Helper
 */
async function createHmacSignature(dataString, secretKey) {
  const encoder = new TextEncoder();
  const keyBuffer = encoder.encode(secretKey);
  const dataBuffer = encoder.encode(dataString);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, dataBuffer);
  return uint8ArrayToHex(new Uint8Array(signatureBuffer));
}

/**
 * Generate Signed Session Token (Valid 4 Hours = 14,400 seconds)
 */
async function generateSessionToken(secretKey) {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + (4 * 60 * 60); // 4 hours maximum lifetime
  const payload = {
    iss: 'shubh-nimantran',
    aud: 'shubh-editor',
    role: 'editor',
    version: '1',
    iat: now,
    exp: exp
  };
  const payloadBase64 = btoa(JSON.stringify(payload)).replace(/=/g, '');
  const signature = await createHmacSignature(payloadBase64, secretKey);
  return `${payloadBase64}.${signature}`;
}

/**
 * Verify Signed Session Token & Validate Claims strictly
 */
async function verifySessionToken(tokenString, secretKey) {
  if (!tokenString || typeof tokenString !== 'string' || tokenString.length > 2048) {
    return { valid: false, reason: 'Malformed or oversized token' };
  }
  const parts = tokenString.split('.');
  if (parts.length !== 2) return { valid: false, reason: 'Malformed token structure' };

  const [payloadBase64, signature] = parts;
  const expectedSignature = await createHmacSignature(payloadBase64, secretKey);

  if (signature !== expectedSignature) {
    return { valid: false, reason: 'Invalid HMAC signature' };
  }

  try {
    const payload = JSON.parse(atob(payloadBase64));
    const now = Math.floor(Date.now() / 1000);

    if (payload.iss !== 'shubh-nimantran' || payload.aud !== 'shubh-editor' || payload.role !== 'editor' || payload.version !== '1') {
      return { valid: false, reason: 'Invalid token claims' };
    }

    // MANDATORY FINITE NUMERIC iat VALIDATION
    if (typeof payload.iat !== 'number' || !Number.isFinite(payload.iat)) {
      return { valid: false, reason: 'Missing or non-finite numeric iat claim' };
    }
    // Reject tokens issued in the future (allowing 300s clock skew tolerance)
    if (payload.iat > now + 300) {
      return { valid: false, reason: 'Token issued in the future (invalid iat)' };
    }

    // MANDATORY FINITE NUMERIC exp VALIDATION
    if (typeof payload.exp !== 'number' || !Number.isFinite(payload.exp)) {
      return { valid: false, reason: 'Missing or non-finite numeric exp claim' };
    }
    // Reject expired session or exp <= now
    if (payload.exp <= now) {
      return { valid: false, reason: 'Session token expired' };
    }

    // Ensure exp > iat
    if (payload.exp <= payload.iat) {
      return { valid: false, reason: 'Invalid token timeframe (exp must be greater than iat)' };
    }

    // Ensure exp - iat <= 14400 (maximum 4 hours lifetime)
    if ((payload.exp - payload.iat) > 14400) {
      return { valid: false, reason: 'Token lifetime exceeds maximum allowed duration of 4 hours' };
    }

    return { valid: true, payload };
  } catch {
    return { valid: false, reason: 'Invalid token JSON payload' };
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    const corsHeaders = getCorsHeaders(origin);

    // 1. Handle OPTIONS Preflight
    if (request.method === 'OPTIONS') {
      if (!isOriginAllowed(origin)) {
        return new Response(JSON.stringify({
          ok: false,
          error: `Origin '${origin || 'unknown'}' not allowed.`
        }), {
          status: 403,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json; charset=utf-8'
          }
        });
      }

      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    const pathname = url.pathname.replace(/\/+$/, '') || '/';

    // 0. Legacy KV Short Link GET Redirection (Supports GET /s/:code and GET /:code)
    if (request.method === 'GET' && pathname !== '/' && pathname !== '/shorten' && !pathname.startsWith('/auth/')) {
      const isPrefixed = pathname.startsWith('/s/');
      const code = isPrefixed ? pathname.slice(3) : pathname.slice(1);
      
      if (code && /^[a-zA-Z0-9_-]+$/.test(code)) {
        if (env && env.SHORT_URL_KV) {
          try {
            const targetUrl = await env.SHORT_URL_KV.get(code);
            if (targetUrl && (targetUrl.startsWith('http://') || targetUrl.startsWith('https://'))) {
              return Response.redirect(targetUrl, 302);
            }
          } catch (kvErr) {
            console.error('KV redirect lookup error:', kvErr);
          }
        }
        // If code is not found in KV or KV lookup fails/unconfigured, return clean 404 Response with CORS
        return new Response(JSON.stringify({
          ok: false,
          error: `Short code '${code}' not found or shortener service unconfigured.`
        }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
        });
      }
    }

    // 2. Auth Route: POST /auth/verify
    if (pathname === '/auth/verify') {
      if (request.method !== 'POST') {
        return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
        });
      }

      if (!isOriginAllowed(origin)) {
        return new Response(JSON.stringify({ ok: false, error: `Origin '${origin || 'unknown'}' not allowed.` }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
        });
      }

      // FAIL CLOSED CHECK: Must have env.MASTER_PASSWORD_HASH and env.JWT_SECRET configured!
      const rawStoredHash = (env && env.MASTER_PASSWORD_HASH) ? env.MASTER_PASSWORD_HASH.trim() : '';
      const jwtSecret = (env && env.JWT_SECRET) ? env.JWT_SECRET.trim() : '';

      if (!rawStoredHash || !jwtSecret) {
        return new Response(JSON.stringify({
          ok: false,
          error: 'प्रमाणीकरण सेवा उपलब्ध नहीं है (Authentication service unconfigured)'
        }), {
          status: 503,
          headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
        });
      }

      try {
        const body = await request.json();
        const inputPassword = (body && typeof body.password === 'string') ? body.password.trim() : '';

        if (!inputPassword) {
          return new Response(JSON.stringify({ ok: false, error: 'मास्टर पासवर्ड आवश्यक है' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
          });
        }

        // Support pbkdf2:iterations:saltHex:hashHex format OR separate env variables
        let iterations = 100000;
        let saltHex = (env && env.MASTER_PASSWORD_SALT) ? env.MASTER_PASSWORD_SALT.trim() : '';
        let expectedHashHex = rawStoredHash;

        if (rawStoredHash.startsWith('pbkdf2:')) {
          const parts = rawStoredHash.split(':');
          if (parts.length !== 4) {
            return new Response(JSON.stringify({
              ok: false,
              error: 'प्रमाणीकरण सेवा उपलब्ध नहीं है (Invalid PBKDF2 configuration)'
            }), {
              status: 503,
              headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
            });
          }

          const iterStr = parts[1];
          if (!/^\d+$/.test(iterStr)) {
            return new Response(JSON.stringify({
              ok: false,
              error: 'प्रमाणीकरण सेवा उपलब्ध नहीं है (Invalid PBKDF2 configuration)'
            }), {
              status: 503,
              headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
            });
          }

          const parsedIter = parseInt(iterStr, 10);
          if (parsedIter < 10000 || parsedIter > 500000) {
            return new Response(JSON.stringify({
              ok: false,
              error: 'प्रमाणीकरण सेवा उपलब्ध नहीं है (Invalid PBKDF2 configuration)'
            }), {
              status: 503,
              headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
            });
          }

          iterations = parsedIter;
          saltHex = parts[2];
          expectedHashHex = parts[3];
        }

        // Strict salt (16 bytes = 32 hex chars) and hash (32 bytes = 64 hex chars) validation
        if (!saltHex || !expectedHashHex || !/^[0-9a-fA-F]{32}$/.test(saltHex) || !/^[0-9a-fA-F]{64}$/.test(expectedHashHex)) {
          return new Response(JSON.stringify({
            ok: false,
            error: 'प्रमाणीकरण सेवा उपलब्ध नहीं है (Invalid PBKDF2 configuration)'
          }), {
            status: 503,
            headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
          });
        }

        const computedHashHex = await derivePBKDF2(inputPassword, saltHex, iterations);

        if (computedHashHex !== expectedHashHex) {
          return new Response(JSON.stringify({ ok: false, error: 'गलत मास्टर पासवर्ड। कृपया पुनः प्रयास करें।' }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
          });
        }

        const token = await generateSessionToken(jwtSecret);

        return new Response(JSON.stringify({
          ok: true,
          token: token,
          expiresIn: 14400 // 4 hours maximum lifetime
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: 'प्रमाणीकरण प्रक्रिया में त्रुटि' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
        });
      }
    }

    // 3. Auth Route: POST /auth/verify-session
    if (pathname === '/auth/verify-session') {
      if (request.method !== 'POST') {
        return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
        });
      }

      if (!isOriginAllowed(origin)) {
        return new Response(JSON.stringify({ ok: false, error: `Origin '${origin || 'unknown'}' not allowed.` }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
        });
      }

      const jwtSecret = (env && env.JWT_SECRET) ? env.JWT_SECRET.trim() : '';
      if (!jwtSecret) {
        return new Response(JSON.stringify({ ok: false, valid: false, error: 'Authentication service unconfigured' }), {
          status: 503,
          headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
        });
      }

      try {
        const authHeader = request.headers.get('Authorization') || '';
        let token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

        if (!token) {
          const body = await request.json().catch(() => ({}));
          token = (body && typeof body.token === 'string') ? body.token.trim() : '';
        }

        const verification = await verifySessionToken(token, jwtSecret);

        if (!verification.valid) {
          return new Response(JSON.stringify({
            ok: false,
            valid: false,
            error: verification.reason || 'Invalid session'
          }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
          });
        }

        return new Response(JSON.stringify({
          ok: true,
          valid: true,
          role: verification.payload.role,
          expiresAt: verification.payload.exp
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, valid: false, error: 'Session verification error' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
        });
      }
    }

    // 4. Validate Shortener Route (/shorten or root /)
    if (pathname !== '/shorten' && pathname !== '') {
      return new Response(JSON.stringify({
        ok: false,
        error: `Endpoint not found: ${url.pathname}. Please use POST /shorten`
      }), {
        status: 404,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json; charset=utf-8'
        }
      });
    }

    // 5. Shortener HTTP Method check
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({
        ok: false,
        error: `Method ${request.method} not allowed. Please use POST /shorten`
      }), {
        status: 405,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json; charset=utf-8'
        }
      });
    }

    // 6. Shortener Origin check
    if (!isOriginAllowed(origin)) {
      return new Response(JSON.stringify({
        ok: false,
        error: `Origin '${origin || 'unknown'}' not allowed. Allowed origin: https://goluraj1995.github.io`
      }), {
        status: 403,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json; charset=utf-8'
        }
      });
    }

    // 7. Parse Shortener JSON Payload
    let targetUrl = '';
    try {
      const body = await request.json();
      targetUrl = (body && typeof body.url === 'string') ? body.url.trim() : '';
    } catch {
      return new Response(JSON.stringify({
        ok: false,
        error: 'Invalid JSON payload. Expected: {"url": "https://..."}'
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json; charset=utf-8'
        }
      });
    }

    if (!targetUrl || (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://'))) {
      return new Response(JSON.stringify({
        ok: false,
        error: 'Invalid URL. Must begin with http:// or https://'
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json; charset=utf-8'
        }
      });
    }

    // 8. Call TinyURL API
    try {
      const tinyApiUrl = `https://tinyurl.com/api-create.php?url=${encodeURIComponent(targetUrl)}`;
      const tinyResponse = await fetch(tinyApiUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Shubh-Nimantran-Shortener/1.0'
        }
      });

      if (!tinyResponse.ok) {
        const errorText = await tinyResponse.text().catch(() => '');
        return new Response(JSON.stringify({
          ok: false,
          error: `Upstream TinyURL error (HTTP ${tinyResponse.status}): ${errorText || 'Failed to create short link'}`
        }), {
          status: 502,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json; charset=utf-8'
          }
        });
      }

      const shortUrl = (await tinyResponse.text()).trim();
      if (!shortUrl.startsWith('http')) {
        return new Response(JSON.stringify({
          ok: false,
          error: `Unexpected TinyURL response: ${shortUrl}`
        }), {
          status: 502,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json; charset=utf-8'
          }
        });
      }

      return new Response(JSON.stringify({
        ok: true,
        shortUrl: shortUrl,
        tiny_url: shortUrl
      }), {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json; charset=utf-8'
        }
      });

    } catch (err) {
      return new Response(JSON.stringify({
        ok: false,
        error: `Shortener service error: ${err.message || 'Upstream request failed'}`
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json; charset=utf-8'
        }
      });
    }
  }
};
