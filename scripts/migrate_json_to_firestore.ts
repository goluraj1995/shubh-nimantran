/**
 * Shubh Nimantran - Offline Migration Plan & Script
 * 
 * NOTE: DO NOT EXECUTE AUTOMATICALLY.
 * Run this script ONLY after service account credentials or IAM permissions
 * (roles/datastore.user) have been granted to the runtime identity in GCP.
 * 
 * Usage:
 *   GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json npx tsx scripts/migrate_json_to_firestore.ts
 */

import fs from 'fs';
import path from 'path';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

async function migrateData() {
  console.log('--- SHUBH NIMANTRAN FIRESTORE MIGRATION ---');

  const configPath = path.resolve('firebase-applet-config.json');
  if (!fs.existsSync(configPath)) {
    console.error('Error: firebase-applet-config.json not found.');
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  const dataFile = path.resolve('data/invitations_store.json');

  if (!fs.existsSync(dataFile)) {
    console.log('No local data/invitations_store.json found to migrate.');
    return;
  }

  const localStore = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
  const records = Object.values(localStore) as any[];

  console.log(`Found ${records.length} records in local store to migrate.`);

  const app = getApps().length > 0 ? getApps()[0] : initializeApp({ projectId: config.projectId });
  const db = config.firestoreDatabaseId ? getFirestore(app, config.firestoreDatabaseId) : getFirestore(app);

  let successCount = 0;
  let errorCount = 0;

  for (const record of records) {
    try {
      console.log(`Migrating invitation ID: ${record.id} (${record.familyNames})...`);
      await db.collection('invitations').doc(record.id).set(record);
      successCount++;
    } catch (err: any) {
      console.error(`Failed to migrate ${record.id}:`, err.message);
      errorCount++;
    }
  }

  console.log(`Migration complete. Successfully migrated: ${successCount}, Failed: ${errorCount}`);
}

// Script only executes if run directly with --execute flag
if (process.argv.includes('--execute')) {
  migrateData().catch(console.error);
} else {
  console.log('MIGRATION PLAN READY.');
  console.log('Safety lock active: pass --execute flag when running in production with verified credentials.');
}
