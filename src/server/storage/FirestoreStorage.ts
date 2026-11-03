import { initializeApp, getApps, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { IInvitationStorage, InvitationRecord, StorageHealth } from './types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class FirestoreInvitationStorage implements IInvitationStorage {
  readonly backendName = 'firestore' as const;
  private db: Firestore | null = null;
  private app: App | null = null;
  private projectId: string = '';
  private databaseId: string = '';
  private initError: string | null = null;

  constructor() {
    this.init();
  }

  private init() {
    try {
      let configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
      if (!fs.existsSync(configPath)) {
        configPath = path.resolve(__dirname, '../../../firebase-applet-config.json');
      }

      if (!fs.existsSync(configPath)) {
        throw new Error('firebase-applet-config.json file not found');
      }

      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      this.projectId = config.projectId || process.env.GOOGLE_CLOUD_PROJECT || '';
      this.databaseId = config.firestoreDatabaseId || '(default)';

      if (!this.projectId) {
        throw new Error('Project ID not specified in firebase configuration');
      }

      const existingApps = getApps();
      if (existingApps.length > 0) {
        this.app = existingApps[0];
      } else {
        this.app = initializeApp({
          projectId: this.projectId
        });
      }

      this.db = (this.databaseId && this.databaseId !== '(default)')
        ? getFirestore(this.app, this.databaseId)
        : getFirestore(this.app);

    } catch (err: any) {
      this.initError = err.message || String(err);
      console.warn('[Firestore] Initialization note:', this.initError);
    }
  }

  private ensureDb(): Firestore {
    if (this.initError) {
      throw new Error(`Firestore initialization failed: ${this.initError}`);
    }
    if (!this.db) {
      throw new Error('Firestore database instance is not available');
    }
    return this.db;
  }

  async get(id: string): Promise<InvitationRecord | null> {
    const db = this.ensureDb();
    const docSnap = await db.collection('invitations').doc(id).get();
    if (!docSnap.exists) {
      return null;
    }
    return docSnap.data() as InvitationRecord;
  }

  async create(record: InvitationRecord): Promise<void> {
    const db = this.ensureDb();
    await db.collection('invitations').doc(record.id).set(record);
  }

  async update(id: string, updates: Partial<Omit<InvitationRecord, 'id' | 'editTokenHash' | 'createdAt'>>): Promise<void> {
    const db = this.ensureDb();
    const docRef = db.collection('invitations').doc(id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      throw new Error('निमंत्रण नहीं मिला (Document not found in Firestore)');
    }
    await docRef.update({
      ...updates,
      updatedAt: new Date().toISOString()
    });
  }

  async delete(id: string): Promise<boolean> {
    const db = this.ensureDb();
    const docRef = db.collection('invitations').doc(id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return false;
    }
    await docRef.delete();
    return true;
  }

  async batchGet(ids: string[]): Promise<InvitationRecord[]> {
    if (!ids || ids.length === 0) return [];
    const db = this.ensureDb();
    const results: InvitationRecord[] = [];
    
    const chunkSize = 30;
    for (let i = 0; i < ids.length; i += chunkSize) {
      const chunk = ids.slice(i, i + chunkSize);
      const docRefs = chunk.map(id => db.collection('invitations').doc(id));
      const snapshots = await db.getAll(...docRefs);
      for (const snap of snapshots) {
        if (snap.exists) {
          results.push(snap.data() as InvitationRecord);
        }
      }
    }
    return results;
  }

  async checkHealth(): Promise<StorageHealth> {
    if (this.initError) {
      return {
        healthy: false,
        backend: 'firestore',
        projectId: this.projectId,
        databaseId: this.databaseId,
        errorCategory: 'INITIALIZATION_FAILED',
        error: 'Firestore initialization error'
      };
    }
    try {
      const db = this.ensureDb();
      await db.collection('invitations').limit(1).get();
      return {
        healthy: true,
        backend: 'firestore',
        projectId: this.projectId,
        databaseId: this.databaseId
      };
    } catch (err: any) {
      const msg = err.message || '';
      let errorCategory: StorageHealth['errorCategory'] = 'UNKNOWN';

      if (msg.includes('PERMISSION_DENIED') || err.code === 7) {
        errorCategory = 'PERMISSION_DENIED';
      } else if (msg.includes('NOT_FOUND') || err.code === 5) {
        errorCategory = 'DATABASE_NOT_FOUND';
      } else if (msg.includes('UNAVAILABLE') || err.code === 14) {
        errorCategory = 'NETWORK_ERROR';
      }

      return {
        healthy: false,
        backend: 'firestore',
        projectId: this.projectId,
        databaseId: this.databaseId,
        errorCategory,
        error: errorCategory === 'PERMISSION_DENIED'
          ? 'GCP IAM permission denied: current runtime identity lacks roles/datastore.user'
          : errorCategory
      };
    }
  }
}
