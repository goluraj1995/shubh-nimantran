import { IInvitationStorage, InvitationRecord, StorageHealth } from './types.ts';
import { FirestoreInvitationStorage } from './FirestoreStorage.ts';
import { FileInvitationStorage } from './FileStorage.ts';

class ResilientInvitationStorage implements IInvitationStorage {
  readonly backendName = 'file' as const;
  private primary: IInvitationStorage;
  private fallback: IInvitationStorage;

  constructor(primary: IInvitationStorage, fallback: IInvitationStorage) {
    this.primary = primary;
    this.fallback = fallback;
  }

  async get(id: string): Promise<InvitationRecord | null> {
    try {
      const res = await this.primary.get(id);
      if (res) return res;
      return await this.fallback.get(id);
    } catch (err: any) {
      console.warn('[Storage] Primary storage get error, using fallback:', err?.message || err);
      return await this.fallback.get(id);
    }
  }

  async create(record: InvitationRecord): Promise<void> {
    try {
      await this.primary.create(record);
      try { await this.fallback.create(record); } catch {}
    } catch (err: any) {
      console.warn('[Storage] Primary storage create error, using fallback:', err?.message || err);
      await this.fallback.create(record);
    }
  }

  async update(id: string, updates: Partial<Omit<InvitationRecord, 'id' | 'editTokenHash' | 'createdAt'>>): Promise<void> {
    try {
      await this.primary.update(id, updates);
      try { await this.fallback.update(id, updates); } catch {}
    } catch (err: any) {
      console.warn('[Storage] Primary storage update error, using fallback:', err?.message || err);
      await this.fallback.update(id, updates);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      return await this.primary.delete(id);
    } catch (err: any) {
      console.warn('[Storage] Primary storage delete error, using fallback:', err?.message || err);
      return await this.fallback.delete(id);
    }
  }

  async batchGet(ids: string[]): Promise<InvitationRecord[]> {
    try {
      return await this.primary.batchGet(ids);
    } catch (err: any) {
      console.warn('[Storage] Primary storage batchGet error, using fallback:', err?.message || err);
      return await this.fallback.batchGet(ids);
    }
  }

  async checkHealth(): Promise<StorageHealth> {
    const fallbackHealth = await this.fallback.checkHealth();
    return {
      healthy: fallbackHealth.healthy,
      backend: 'file'
    };
  }
}

let storageInstance: IInvitationStorage | null = null;

export function getInvitationStorage(): IInvitationStorage {
  if (storageInstance) {
    return storageInstance;
  }

  const requestedBackend = process.env.STORAGE_BACKEND?.toLowerCase();
  const isProduction = process.env.NODE_ENV === 'production';
  const fileStorage = new FileInvitationStorage();

  if (requestedBackend === 'firestore' || isProduction) {
    console.log('[Storage] Initializing Firestore storage engine with FileStorage fallback...');
    const firestoreStorage = new FirestoreInvitationStorage();
    storageInstance = new ResilientInvitationStorage(firestoreStorage, fileStorage);
    return storageInstance;
  }

  console.log('[Storage] Initializing File-backed storage engine (Development Mode)...');
  storageInstance = fileStorage;
  return storageInstance;
}

export * from './types.ts';
export * from './FirestoreStorage.ts';
export * from './FileStorage.ts';
