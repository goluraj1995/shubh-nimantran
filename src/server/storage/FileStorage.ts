import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { IInvitationStorage, InvitationRecord, StorageHealth } from './types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class FileInvitationStorage implements IInvitationStorage {
  readonly backendName = 'file' as const;
  private dbFile: string;
  private dataDir: string;

  constructor() {
    this.dataDir = path.resolve(process.cwd(), 'data');
    this.dbFile = path.join(this.dataDir, 'invitations_store.json');
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  private load(): Record<string, InvitationRecord> {
    try {
      if (fs.existsSync(this.dbFile)) {
        const content = fs.readFileSync(this.dbFile, 'utf-8');
        return JSON.parse(content);
      }
    } catch (err) {
      console.error('FileInvitationStorage load error:', err);
    }
    return {};
  }

  private save(store: Record<string, InvitationRecord>): void {
    try {
      fs.writeFileSync(this.dbFile, JSON.stringify(store, null, 2), 'utf-8');
    } catch (err) {
      console.error('FileInvitationStorage save error:', err);
      throw new Error('स्थानीय फाइल में सहेजने में विफल');
    }
  }

  async get(id: string): Promise<InvitationRecord | null> {
    const store = this.load();
    return store[id] || null;
  }

  async create(record: InvitationRecord): Promise<void> {
    const store = this.load();
    store[record.id] = record;
    this.save(store);
  }

  async update(id: string, updates: Partial<Omit<InvitationRecord, 'id' | 'editTokenHash' | 'createdAt'>>): Promise<void> {
    const store = this.load();
    const existing = store[id];
    if (!existing) {
      throw new Error('निमंत्रण नहीं मिला');
    }
    store[id] = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save(store);
  }

  async delete(id: string): Promise<boolean> {
    const store = this.load();
    if (!store[id]) return false;
    delete store[id];
    this.save(store);
    return true;
  }

  async batchGet(ids: string[]): Promise<InvitationRecord[]> {
    if (!ids || ids.length === 0) return [];
    const store = this.load();
    return ids.filter(id => store[id]).map(id => store[id]);
  }

  async checkHealth(): Promise<StorageHealth> {
    try {
      const exists = fs.existsSync(this.dbFile);
      return {
        healthy: true,
        backend: 'file'
      };
    } catch (err: any) {
      return {
        healthy: false,
        backend: 'file',
        error: err.message || String(err)
      };
    }
  }
}
