export interface InvitationRecord {
  id: string;
  category: string;
  data: any;
  familyNames: string;
  eventDate: string;
  editTokenHash: string;
  createdAt: string;
  updatedAt: string;
}

export interface StorageHealth {
  healthy: boolean;
  backend: 'firestore' | 'file';
  databaseId?: string;
  projectId?: string;
  errorCategory?: 'PERMISSION_DENIED' | 'DATABASE_NOT_FOUND' | 'INITIALIZATION_FAILED' | 'NETWORK_ERROR' | 'UNKNOWN';
  error?: string;
}

export interface IInvitationStorage {
  readonly backendName: 'firestore' | 'file';
  get(id: string): Promise<InvitationRecord | null>;
  create(record: InvitationRecord): Promise<void>;
  update(id: string, updates: Partial<Omit<InvitationRecord, 'id' | 'editTokenHash' | 'createdAt'>>): Promise<void>;
  delete(id: string): Promise<boolean>;
  batchGet(ids: string[]): Promise<InvitationRecord[]>;
  checkHealth(): Promise<StorageHealth>;
}
