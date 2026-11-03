import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { getInvitationStorage, InvitationRecord, FirestoreInvitationStorage } from './src/server/storage/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = parseInt(process.env.PORT || '3000', 10);

const app = express();
app.use(cors());
app.use(express.json({ limit: '15mb' }));

// Native Direct Attachment Download Endpoint for v28 ZIP (84,042,285 bytes)
app.get('/download-v28-zip', (req, res) => {
  const filePath = path.resolve(__dirname, 'shubh_nimantran_dist_v28.zip');
  if (fs.existsSync(filePath)) {
    res.download(filePath, 'shubh_nimantran_dist_v28.zip');
  } else {
    res.status(404).send('ZIP file not found');
  }
});

// Dedicated Split Parts Download Endpoints (<30MB each)
app.get('/download-v28-part1', (req, res) => {
  const filePath = path.resolve(__dirname, 'shubh_nimantran_dist_v28.zip.part1');
  if (fs.existsSync(filePath)) {
    res.download(filePath, 'shubh_nimantran_dist_v28.zip.part1');
  } else {
    res.status(404).send('Part 1 not found');
  }
});

app.get('/download-v28-part2', (req, res) => {
  const filePath = path.resolve(__dirname, 'shubh_nimantran_dist_v28.zip.part2');
  if (fs.existsSync(filePath)) {
    res.download(filePath, 'shubh_nimantran_dist_v28.zip.part2');
  } else {
    res.status(404).send('Part 2 not found');
  }
});

app.get('/download-v28-part3', (req, res) => {
  const filePath = path.resolve(__dirname, 'shubh_nimantran_dist_v28.zip.part3');
  if (fs.existsSync(filePath)) {
    res.download(filePath, 'shubh_nimantran_dist_v28.zip.part3');
  } else {
    res.status(404).send('Part 3 not found');
  }
});

// v29 Endpoints
app.get(['/download', '/downloads', '/v29-download'], (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'v29-download.html'));
});

app.get('/download-v29-zip' , (req, res) => {
  const filePath = path.resolve(__dirname, 'shubh_nimantran_dist_v29.zip');
  if (fs.existsSync(filePath)) {
    res.download(filePath, 'shubh_nimantran_dist_v29.zip');
  } else {
    res.status(404).send('v29 ZIP file not found');
  }
});

app.get('/download-v29-parts-zip', (req, res) => {
  const filePath = path.resolve(__dirname, 'shubh_nimantran_v29_parts.zip');
  if (fs.existsSync(filePath)) {
    res.download(filePath, 'shubh_nimantran_v29_parts.zip');
  } else {
    res.status(404).send('v29 parts ZIP not found');
  }
});

app.get('/download-v29-part1', (req, res) => {
  const filePath = path.resolve(__dirname, 'v29part1.bin');
  if (fs.existsSync(filePath)) {
    res.download(filePath, 'v29part1.bin');
  } else {
    res.status(404).send('v29 Part 1 not found');
  }
});

app.get('/download-v29-part2', (req, res) => {
  const filePath = path.resolve(__dirname, 'v29part2.bin');
  if (fs.existsSync(filePath)) {
    res.download(filePath, 'v29part2.bin');
  } else {
    res.status(404).send('v29 Part 2 not found');
  }
});

app.get('/download-v29-part3', (req, res) => {
  const filePath = path.resolve(__dirname, 'v29part3.bin');
  if (fs.existsSync(filePath)) {
    res.download(filePath, 'v29part3.bin');
  } else {
    res.status(404).send('v29 Part 3 not found');
  }
});

app.get('/download-v29-part4', (req, res) => {
  const filePath = path.resolve(__dirname, 'v29part4.bin');
  if (fs.existsSync(filePath)) {
    res.download(filePath, 'v29part4.bin');
  } else {
    res.status(404).send('v29 Part 4 not found');
  }
});

app.get('/download-v29-part5', (req, res) => {
  const filePath = path.resolve(__dirname, 'v29part5.bin');
  if (fs.existsSync(filePath)) {
    res.download(filePath, 'v29part5.bin');
  } else {
    res.status(404).send('v29 Part 5 not found');
  }
});

// v30 Range-Based Download Endpoints
app.get(['/v30', '/v30-download', '/download-v30'], (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'v30-download.html'));
});

app.get('/download-v30-part:partNum', (req, res) => {
  const partNum = parseInt(req.params.partNum, 10);
  const ranges = [
    { start: 0, end: 17169857 },
    { start: 17169858, end: 34339715 },
    { start: 34339716, end: 51509573 },
    { start: 51509574, end: 68679431 },
    { start: 68679432, end: 85849288 }
  ];
  if (isNaN(partNum) || partNum < 1 || partNum > 5) {
    return res.status(404).send('Invalid v30 part number. Expected 1 to 5.');
  }
  const { start, end } = ranges[partNum - 1];
  const filePath = path.resolve(__dirname, 'Shubh_Nimantran_v30_SOURCE.zip');
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('v30 SOURCE ZIP not found');
  }
  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Disposition', `attachment; filename="Shubh_Nimantran_v30_SOURCE.part${partNum}.bin"`);
  res.setHeader('Content-Length', (end - start + 1).toString());
  res.setHeader('Accept-Ranges', 'bytes');
  const stream = fs.createReadStream(filePath, { start, end });
  stream.pipe(res);
});

// v30 JSON Data Backup Direct Download Endpoint (forces download attachment in browser)
app.get(['/download-v30-data', '/download-v30-json'], (req, res) => {
  const filePath = path.resolve(__dirname, 'Shubh_Nimantran_v30_DATA_BACKUP.json');
  if (fs.existsSync(filePath)) {
    res.download(filePath, 'Shubh_Nimantran_v30_DATA_BACKUP.json');
  } else {
    res.status(404).send('Data backup file not found');
  }
});

// v31 HTML Download Landing Page (for iPad / Mobile Safari browser navigation)
app.get(['/v31', '/v31-download', '/download-v31'], (req, res) => {
  const htmlPath = path.resolve(__dirname, 'public', 'v31-download.html');
  if (fs.existsSync(htmlPath)) {
    res.sendFile(htmlPath);
  } else {
    res.status(404).send('Download page not found');
  }
});

// v31 Direct Binary Attachment Stream (Safari & iOS Download Manager Compatible)
app.get(['/download-v31-zip', '/shubh_nimantran_dist_v31.zip', '/api/download-v31-zip', '/api/shubh_nimantran_dist_v31.zip'], (req, res) => {
  const filePath = path.resolve(__dirname, 'shubh_nimantran_dist_v31.zip');
  if (fs.existsSync(filePath)) {
    const stat = fs.statSync(filePath);
    res.writeHead(200, {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="shubh_nimantran_dist_v31.zip"',
      'Content-Length': stat.size,
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Expose-Headers': 'Content-Disposition, Content-Length'
    });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.status(404).send('v31 ZIP file not found');
  }
});

// v31 Split Parts Downloads (<16MB each)
app.get('/download-v31-part:partNum', (req, res) => {
  const partNum = parseInt(req.params.partNum, 10);
  if (isNaN(partNum) || partNum < 1 || partNum > 5) {
    return res.status(400).send('Invalid part number (Expected 1 to 5)');
  }
  const fileName = `shubh_nimantran_v31_part${partNum}.bin`;
  const filePath = path.resolve(__dirname, 'public', fileName);
  if (fs.existsSync(filePath)) {
    const stat = fs.statSync(filePath);
    res.writeHead(200, {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Length': stat.size,
      'Access-Control-Expose-Headers': 'Content-Disposition, Content-Length'
    });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.status(404).send(`v31 Part ${partNum} file not found`);
  }
});

// v31 Cloudflare Worker Download Endpoint
app.get(['/download-worker-v31', '/worker-v31.js'], (req, res) => {
  const filePath = path.resolve(__dirname, 'public', 'worker-v31.js');
  if (fs.existsSync(filePath)) {
    const stat = fs.statSync(filePath);
    res.writeHead(200, {
      'Content-Type': 'text/javascript; charset=utf-8',
      'Content-Disposition': 'attachment; filename="worker-v31.js"',
      'Content-Length': stat.size,
      'Access-Control-Expose-Headers': 'Content-Disposition, Content-Length'
    });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.status(404).send('worker-v31.js file not found');
  }
});



const storage = getInvitationStorage();

const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token.trim()).digest('hex');
};

function generateShortId(): string {
  const chars = '23456789abcdefghjkmnpqrstuvwxyz';
  let result = '';
  const bytes = crypto.randomBytes(7);
  for (let i = 0; i < 7; i++) {
    result += chars[bytes[i] % chars.length];
  }
  return result;
}

function generateSecureToken(): string {
  return crypto.randomBytes(24).toString('hex');
}

// 1. Create or Overwrite with Token (POST /api/invitations)
app.post('/api/invitations', async (req, res) => {
  try {
    const { category, data, familyNames, eventDate, requestedId, requestedToken } = req.body;

    // Check if updating an existing record using valid token
    if (requestedId && requestedToken) {
      const existing = await storage.get(requestedId);
      if (existing && existing.editTokenHash === hashToken(requestedToken)) {
        await storage.update(requestedId, {
          data: data || existing.data,
          familyNames: familyNames || existing.familyNames,
          eventDate: eventDate || existing.eventDate,
          category: category || existing.category
        });
        return res.json({
          id: existing.id,
          token: requestedToken,
          publicUrl: `/i/${existing.id}`,
          editUrl: `/edit/${existing.id}?token=${requestedToken}`,
          success: true
        });
      }
    }

    let id = generateShortId();
    if (requestedId && requestedId.length <= 16) {
      const checkDoc = await storage.get(requestedId);
      if (!checkDoc) {
        id = requestedId;
      }
    }

    const token = generateSecureToken();
    const editTokenHash = hashToken(token);

    const record: InvitationRecord = {
      id,
      category: category || 'hindu_wedding',
      data: data || {},
      familyNames: familyNames || 'शुभ निमंत्रण',
      eventDate: eventDate || new Date().toISOString(),
      editTokenHash,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await storage.create(record);

    res.json({
      id,
      token,
      publicUrl: `/i/${id}`,
      editUrl: `/edit/${id}?token=${token}`,
      success: true
    });
  } catch (error: any) {
    console.error('Create invitation error:', error.message);
    res.status(500).json({ error: error.message || 'डाटाबेस में सहेजने में विफल' });
  }
});

// 2. Fetch Public Invitation (GET /api/invitations/:id)
// CRITICAL SECURITY: Never expose editTokenHash in public responses
app.get('/api/invitations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const record = await storage.get(id);
    if (!record) {
      return res.status(404).json({ error: 'निमंत्रण नहीं मिला (Invitation not found)' });
    }
    const { editTokenHash, ...publicData } = record;
    res.json({ data: publicData.data, meta: publicData });
  } catch (error: any) {
    console.error(`Get invitation error for ${req.params.id}:`, error.message);
    res.status(500).json({ error: error.message || 'डाटाबेस से लोड करने में विफल' });
  }
});

// 3. Update Existing Invitation (PUT /api/invitations/:id)
app.put('/api/invitations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { token, data, familyNames, eventDate, category } = req.body;

    if (!token) {
      return res.status(401).json({ error: 'एडिट टोकन आवश्यक है (Edit token required)' });
    }

    const record = await storage.get(id);
    if (!record) {
      return res.status(404).json({ error: 'निमंत्रण नहीं मिला' });
    }

    if (hashToken(token) !== record.editTokenHash) {
      return res.status(403).json({ error: 'अमान्य टोकन: संपादन की अनुमति नहीं है (Invalid token: Unauthorized)' });
    }

    const updates: Partial<Omit<InvitationRecord, 'id' | 'editTokenHash' | 'createdAt'>> = {};
    if (data !== undefined) updates.data = data;
    if (familyNames !== undefined) updates.familyNames = familyNames;
    if (eventDate !== undefined) updates.eventDate = eventDate;
    if (category !== undefined) updates.category = category;

    await storage.update(id, updates);
    res.json({ success: true, id, updatedAt: new Date().toISOString() });
  } catch (error: any) {
    console.error(`Update invitation error for ${req.params.id}:`, error.message);
    res.status(500).json({ error: error.message || 'अपडेट करने में विफल' });
  }
});

// 4. Delete Invitation (DELETE /api/invitations/:id)
app.delete('/api/invitations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { token } = req.body;

    if (!token) {
      return res.status(401).json({ error: 'हटाने के लिए टोकन आवश्यक है' });
    }

    const record = await storage.get(id);
    if (!record) {
      return res.status(404).json({ error: 'निमंत्रण नहीं मिला' });
    }

    if (hashToken(token) !== record.editTokenHash) {
      return res.status(403).json({ error: 'अमान्य टोकन: हटाने की अनुमति नहीं है' });
    }

    const deleted = await storage.delete(id);
    res.json({ success: deleted });
  } catch (error: any) {
    console.error(`Delete invitation error for ${req.params.id}:`, error.message);
    res.status(500).json({ error: error.message || 'हटाने में विफल' });
  }
});

// 5. Batch Retrieval for Dashboard (POST /api/invitations/batch)
app.post('/api/invitations/batch', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.json([]);
    }
    const records = await storage.batchGet(ids);
    const sanitized = records.map(rec => {
      const { editTokenHash, ...rest } = rec;
      return rest;
    });
    res.json(sanitized);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Storage & Server Health Check (GET /api/health)
// Diagnostic without credential exposure
app.get('/api/health', async (req, res) => {
  try {
    const storageHealth = await storage.checkHealth();
    
    // Background audit probe of Firestore reachability
    let firestoreAudit: any = undefined;
    if (storage.backendName === 'file') {
      try {
        const probeStorage = new FirestoreInvitationStorage();
        const probeHealth = await probeStorage.checkHealth();
        firestoreAudit = {
          targetProject: probeHealth.projectId,
          targetDatabase: probeHealth.databaseId,
          accessible: probeHealth.healthy,
          errorCategory: probeHealth.errorCategory || (probeHealth.healthy ? undefined : 'UNAVAILABLE'),
          diagnostic: probeHealth.error || 'Connected'
        };
      } catch (probeErr: any) {
        firestoreAudit = {
          accessible: false,
          errorCategory: 'INITIALIZATION_FAILED',
          diagnostic: probeErr.message || 'Probe error'
        };
      }
    }

    res.json({
      status: storageHealth.healthy ? 'ok' : 'degraded',
      backend: storage.backendName,
      mode: isProduction ? 'production' : 'development',
      storage: {
        backend: storageHealth.backend,
        healthy: storageHealth.healthy,
        errorCategory: storageHealth.errorCategory,
        message: storageHealth.error || 'Storage engine is operational'
      },
      firestoreAudit,
      time: new Date().toISOString()
    });
  } catch (err: any) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// 7. Master Password Verification Endpoint (POST /api/auth/verify)
// SECURITY: Fail closed if MASTER_PASSWORD_HASH or MASTER_PASSWORD_SALT or JWT_SECRET is unconfigured.
// Hashing Algorithm: PBKDF2-HMAC-SHA256 with 100,000 iterations.
app.post('/api/auth/verify', (req, res) => {
  try {
    let rawStoredHash = process.env.MASTER_PASSWORD_HASH ? process.env.MASTER_PASSWORD_HASH.trim() : '';
    let jwtSecret = process.env.JWT_SECRET ? process.env.JWT_SECRET.trim() : '';
    let saltHex = process.env.MASTER_PASSWORD_SALT ? process.env.MASTER_PASSWORD_SALT.trim() : '';

    // In dev test environment, allow test header overrides for security testing
    if (process.env.NODE_ENV !== 'production') {
      if (req.headers['x-test-hash']) rawStoredHash = String(req.headers['x-test-hash']);
      if (req.headers['x-test-secret']) jwtSecret = String(req.headers['x-test-secret']);
      if (req.headers['x-test-salt']) saltHex = String(req.headers['x-test-salt']);
    }

    let iterations = 100000;
    let expectedHashHex = rawStoredHash;

    if (rawStoredHash.startsWith('pbkdf2:')) {
      const parts = rawStoredHash.split(':');
      if (parts.length !== 4) {
        return res.status(503).json({
          ok: false,
          error: 'प्रमाणीकरण सेवा उपलब्ध नहीं है (Invalid PBKDF2 configuration)'
        });
      }

      const iterStr = parts[1];
      if (!/^\d+$/.test(iterStr)) {
        return res.status(503).json({
          ok: false,
          error: 'प्रमाणीकरण सेवा उपलब्ध नहीं है (Invalid PBKDF2 configuration)'
        });
      }

      const parsedIter = parseInt(iterStr, 10);
      if (parsedIter < 10000 || parsedIter > 500000) {
        return res.status(503).json({
          ok: false,
          error: 'प्रमाणीकरण सेवा उपलब्ध नहीं है (Invalid PBKDF2 configuration)'
        });
      }

      iterations = parsedIter;
      saltHex = parts[2];
      expectedHashHex = parts[3];
    }

    // FAIL CLOSED: If secrets are missing or unconfigured, reject request safely
    if (!expectedHashHex || !saltHex || !jwtSecret || !/^[0-9a-fA-F]{32}$/.test(saltHex) || !/^[0-9a-fA-F]{64}$/.test(expectedHashHex)) {
      return res.status(503).json({
        ok: false,
        error: 'प्रमाणीकरण सेवा उपलब्ध नहीं है (Invalid PBKDF2 configuration)'
      });
    }

    const { password } = req.body || {};
    if (!password || typeof password !== 'string') {
      return res.status(400).json({ ok: false, error: 'मास्टर पासवर्ड आवश्यक है' });
    }

    const saltBuffer = Buffer.from(saltHex, 'hex');
    const derivedKey = crypto.pbkdf2Sync(password.trim(), saltBuffer, iterations, 32, 'sha256');
    const computedHashHex = derivedKey.toString('hex');

    if (computedHashHex !== expectedHashHex) {
      return res.status(401).json({ ok: false, error: 'गलत मास्टर पासवर्ड। कृपया पुनः प्रयास करें।' });
    }

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
    const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64').replace(/=/g, '');
    const signature = crypto.createHmac('sha256', jwtSecret).update(payloadBase64).digest('hex');
    const token = `${payloadBase64}.${signature}`;

    return res.json({ ok: true, token, expiresIn: 14400 });
  } catch (err: any) {
    console.error('Auth verify error:', err);
    return res.status(500).json({ ok: false, error: 'प्रमाणीकरण प्रक्रिया में त्रुटि' });
  }
});

// 8. Session Token Verification Endpoint (POST /api/auth/verify-session)
app.post('/api/auth/verify-session', (req, res) => {
  try {
    let jwtSecret = process.env.JWT_SECRET ? process.env.JWT_SECRET.trim() : '';
    if (process.env.NODE_ENV !== 'production' && req.headers['x-test-secret']) {
      jwtSecret = String(req.headers['x-test-secret']);
    }
    if (!jwtSecret) {
      return res.status(503).json({ ok: false, valid: false, error: 'Authentication service unconfigured' });
    }

    const authHeader = req.headers.authorization || '';
    let token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

    if (!token && req.body && typeof req.body.token === 'string') {
      token = req.body.token.trim();
    }

    if (!token || token.length > 2048) {
      return res.status(401).json({ ok: false, valid: false, error: 'अमान्य या अति-लंबा टोकन' });
    }

    const parts = token.split('.');
    if (parts.length !== 2) {
      return res.status(401).json({ ok: false, valid: false, error: 'अमान्य टोकन प्रारूप' });
    }

    const [payloadBase64, signature] = parts;
    const expectedSignature = crypto.createHmac('sha256', jwtSecret).update(payloadBase64).digest('hex');

    if (signature !== expectedSignature) {
      return res.status(401).json({ ok: false, valid: false, error: 'अमान्य HMAC हस्ताक्षर' });
    }

    const payloadJson = Buffer.from(payloadBase64, 'base64').toString('utf8');
    const payload = JSON.parse(payloadJson);
    const now = Math.floor(Date.now() / 1000);

    if (payload.iss !== 'shubh-nimantran' || payload.aud !== 'shubh-editor' || payload.role !== 'editor' || payload.version !== '1') {
      return res.status(401).json({ ok: false, valid: false, error: 'अमान्य दावा (Invalid claims)' });
    }

    if (payload.exp && payload.exp < now) {
      return res.status(401).json({ ok: false, valid: false, error: 'सत्र समाप्त हो गया है' });
    }

    return res.json({ ok: true, valid: true, role: payload.role, expiresAt: payload.exp });
  } catch (err: any) {
    return res.status(500).json({ ok: false, valid: false, error: 'सत्र सत्यापन त्रुटि' });
  }
});

// 9. URL Shortener Proxy Route (POST /api/shorten)
// Safely proxies shortening requests to Cloudflare Worker with verified Origin header
app.post('/api/shorten', async (req, res) => {
  try {
    const { url } = req.body || {};
    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
      return res.status(400).json({ ok: false, error: 'अमान्य URL (Invalid URL format)' });
    }

    // Call Cloudflare Worker with production Origin
    const workerRes = await fetch('https://shubh-nimantran-shortener.goluraj1995.workers.dev/shorten', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://goluraj1995.github.io'
      },
      body: JSON.stringify({ url })
    });

    if (workerRes.ok) {
      const data = await workerRes.json();
      return res.json(data);
    }

    // Fallback directly to TinyURL if worker is unavailable
    const tinyRes = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`, {
      headers: {
        'User-Agent': 'Shubh-Nimantran-Server/1.0'
      }
    });
    if (tinyRes.ok) {
      const shortUrl = (await tinyRes.text()).trim();
      if (!shortUrl.startsWith('http')) {
        return res.json({ ok: true, shortUrl, tiny_url: shortUrl });
      }
    }

    const errText = await workerRes.text().catch(() => '');
    res.status(workerRes.status).json({ ok: false, error: errText || 'शॉर्टनर सेवा से त्रुटि' });
  } catch (err: any) {
    console.error('Shorten proxy error:', err);
    res.status(500).json({ ok: false, error: err?.message || 'शॉर्टनर अनुरोध विफल' });
  }
});

// Setup dev vs prod middleware
async function startServer() {
  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Shubh Nimantran server running on http://0.0.0.0:${PORT} [Storage: ${storage.backendName}]`);
  });
}

startServer();
