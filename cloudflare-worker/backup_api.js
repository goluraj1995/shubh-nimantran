// Shubh Nimantran Cloud Backup API v1

const OWNER_ID = "master_admin";
const MAX_BACKUP_BYTES = 1572864;
const MAX_CARDS = 500;
const KEEP_BACKUPS = 5;

function backupJson(data, status, corsHeaders) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
  });
}

async function readBackupBody(request) {
  const declared = Number(request.headers.get("Content-Length") || 0);
  if (declared > MAX_BACKUP_BYTES) throw new Error("BACKUP_TOO_LARGE");
  const bytes = await request.arrayBuffer();
  if (bytes.byteLength > MAX_BACKUP_BYTES) throw new Error("BACKUP_TOO_LARGE");
  try { return JSON.parse(new TextDecoder().decode(bytes)); }
  catch { throw new Error("INVALID_JSON"); }
}

function validateBackupCards(cards) {
  if (!Array.isArray(cards) || cards.length > MAX_CARDS) return false;
  const ids = new Set();
  for (const card of cards) {
    if (!card || typeof card !== "object" || Array.isArray(card)) return false;
    if (typeof card.id !== "string" || !card.id.trim() || card.id.length > 200) return false;
    if (ids.has(card.id)) return false;
    ids.add(card.id);
  }
  return true;
}

console.log("BACKUP HELPERS READY");

export async function handleBackupSave(request, env, corsHeaders, verifySessionToken) {
  if (request.method !== "POST") return backupJson({ok:false,error:"Method not allowed"},405,corsHeaders);
  if (!env || !env.JWT_SECRET || !env.BACKUP_DB) return backupJson({ok:false,error:"Backup service is not configured"},503,corsHeaders);
  const auth = request.headers.get("Authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  const session = token ? await verifySessionToken(token, env.JWT_SECRET) : {valid:false};
  if (!session.valid) return backupJson({ok:false,error:"Unauthorized"},401,corsHeaders);
  let body;
  try { body = await readBackupBody(request); }
  catch (e) {
    const tooLarge = e.message === "BACKUP_TOO_LARGE";
    return backupJson({ok:false,error:tooLarge?"Backup exceeds 1.5 MB":"Invalid JSON"},tooLarge?413:400,corsHeaders);
  }
  if (!validateBackupCards(body.cards)) return backupJson({ok:false,error:"Invalid cards data"},400,corsHeaders);
  const now = Math.floor(Date.now()/1000);
  const id = crypto.randomUUID();
  try {
    await env.BACKUP_DB.prepare("INSERT INTO invitation_backups (id, owner_id, invitation_data, created_at, updated_at) VALUES (?, ?, ?, ?, ?)").bind(id,OWNER_ID,JSON.stringify({cards:body.cards}),now,now).run();
    await env.BACKUP_DB.prepare("DELETE FROM invitation_backups WHERE owner_id = ? AND id NOT IN (SELECT id FROM invitation_backups WHERE owner_id = ? ORDER BY updated_at DESC, created_at DESC LIMIT ?)").bind(OWNER_ID,OWNER_ID,KEEP_BACKUPS).run();
    return backupJson({ok:true,id,created_at:now,card_count:body.cards.length},200,corsHeaders);
  } catch (e) {
    console.error("Backup save failed",e);
    return backupJson({ok:false,error:"Could not save backup"},500,corsHeaders);
  }
}

console.log("BACKUP SAVE API READY");

export async function handleBackupList(request, env, corsHeaders, verifySessionToken) {
  if (request.method !== "POST") return backupJson({ok:false,error:"Method not allowed"},405,corsHeaders);
  if (!env || !env.JWT_SECRET || !env.BACKUP_DB) return backupJson({ok:false,error:"Backup service is not configured"},503,corsHeaders);
  const auth = request.headers.get("Authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  const session = token ? await verifySessionToken(token,env.JWT_SECRET) : {valid:false};
  if (!session.valid) return backupJson({ok:false,error:"Unauthorized"},401,corsHeaders);
  try {
    const result = await env.BACKUP_DB.prepare("SELECT id, created_at, updated_at FROM invitation_backups WHERE owner_id = ? ORDER BY updated_at DESC, created_at DESC LIMIT ?").bind(OWNER_ID,KEEP_BACKUPS).all();
    return backupJson({ok:true,backups:result.results || []},200,corsHeaders);
  } catch (e) {
    console.error("Backup list failed",e);
    return backupJson({ok:false,error:"Could not list backups"},500,corsHeaders);
  }
}

console.log("BACKUP LIST API READY");

export async function handleBackupRestore(request, env, corsHeaders, verifySessionToken) {
  if (request.method !== "POST") return backupJson({ok:false,error:"Method not allowed"},405,corsHeaders);
  if (!env || !env.JWT_SECRET || !env.BACKUP_DB) return backupJson({ok:false,error:"Backup service is not configured"},503,corsHeaders);
  const auth = request.headers.get("Authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  const session = token ? await verifySessionToken(token,env.JWT_SECRET) : {valid:false};
  if (!session.valid) return backupJson({ok:false,error:"Unauthorized"},401,corsHeaders);
  let body;
  try { body = await readBackupBody(request); }
  catch (e) { return backupJson({ok:false,error:"Invalid request body"},400,corsHeaders); }
  if (typeof body.id !== "string" || !body.id.trim() || body.id.length > 100) return backupJson({ok:false,error:"Invalid backup ID"},400,corsHeaders);
  try {
    const row = await env.BACKUP_DB.prepare("SELECT id, invitation_data, created_at, updated_at FROM invitation_backups WHERE id = ? AND owner_id = ? LIMIT 1").bind(body.id,OWNER_ID).first();
    if (!row) return backupJson({ok:false,error:"Backup not found"},404,corsHeaders);
    let saved;
    try { saved = JSON.parse(row.invitation_data); } catch { return backupJson({ok:false,error:"Backup data is damaged"},500,corsHeaders); }
    if (!saved || !validateBackupCards(saved.cards)) return backupJson({ok:false,error:"Backup data is invalid"},500,corsHeaders);
    return backupJson({ok:true,id:row.id,cards:saved.cards,created_at:row.created_at,updated_at:row.updated_at},200,corsHeaders);
  } catch (e) {
    console.error("Backup restore failed",e);
    return backupJson({ok:false,error:"Could not restore backup"},500,corsHeaders);
  }
}

console.log("BACKUP RESTORE API READY");
