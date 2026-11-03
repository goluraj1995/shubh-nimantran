import { getStoredSessionToken, LIVE_WORKER_AUTH_BASE } from "./authService";

export interface CloudBackupItem {
  id: string;
  created_at: number;
  updated_at: number;
}

interface BackupResponse {
  ok: boolean;
  error?: string;
  id?: string;
  card_count?: number;
  backups?: CloudBackupItem[];
  cards?: any[];
  created_at?: number;
  updated_at?: number;
}

async function backupRequest(
  endpoint: string,
  body: Record<string, unknown> = {}
): Promise<BackupResponse> {
  const token = getStoredSessionToken();

  if (!token) {
    throw new Error('लॉगिन सत्र समाप्त है। कृपया दोबारा लॉगिन करें।');
  }

  let response: Response;

  try {
    response = await fetch(`${LIVE_WORKER_AUTH_BASE}/backup/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body),
      cache: 'no-store'
    });
  } catch {
    throw new Error('Cloud Server से संपर्क नहीं हो पाया। इंटरनेट जाँचें।');
  }

  let data: BackupResponse;

  try {
    data = await response.json();
  } catch {
    throw new Error(`Server ने अमान्य प्रतिक्रिया दी (HTTP ${response.status})`);
  }

  if (!response.ok || !data.ok) {
    throw new Error(data.error || `Cloud Backup विफल (HTTP ${response.status})`);
  }

  return data;
}

export async function saveCloudBackup(cards: any[]) {
  return backupRequest('save', { cards });
}

export async function listCloudBackups(): Promise<CloudBackupItem[]> {
  const result = await backupRequest('list');
  return result.backups || [];
}

export async function restoreCloudBackup(id: string): Promise<BackupResponse> {
  return backupRequest('restore', { id });
}
