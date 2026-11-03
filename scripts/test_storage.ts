import { FirestoreInvitationStorage } from '../src/server/storage/FirestoreStorage.ts';
import { FileInvitationStorage } from '../src/server/storage/FileStorage.ts';

async function runSuite() {
  console.log('=== SHUBH NIMANTRAN STORAGE & PERSISTENCE TEST SUITE ===');

  // 1. Direct Firestore Connectivity Check
  console.log('\n[1/4] Probing Live Firestore Reachability...');
  const firestoreStorage = new FirestoreInvitationStorage();
  const firestoreHealth = await firestoreStorage.checkHealth();
  console.log('Firestore Health Result:', {
    healthy: firestoreHealth.healthy,
    projectId: firestoreHealth.projectId,
    databaseId: firestoreHealth.databaseId,
    error: firestoreHealth.error || 'None (Accessible)'
  });

  // 2. Storage Interface Conformance (FileStorage Backend)
  console.log('\n[2/4] Testing Storage Interface Conformance (FileStorage)...');
  const fileStorage = new FileInvitationStorage();
  
  const testId = `test_probe_${Date.now()}`;
  const testRecord = {
    id: testId,
    category: 'hindu_wedding',
    familyNames: 'परीक्षण परिवार',
    eventDate: '2026-11-25',
    data: { title: 'परीक्षण कार्ड', venue: 'जयपुर' },
    editTokenHash: 'hash_abc123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  await fileStorage.create(testRecord);
  console.log('-> Created record in storage');

  const retrieved = await fileStorage.get(testId);
  if (!retrieved || retrieved.id !== testId) {
    throw new Error('Storage GET failed to retrieve created record');
  }
  console.log('-> Retrieved record matches ID');

  await fileStorage.update(testId, { familyNames: 'अपडेटेड परिवार' });
  const updated = await fileStorage.get(testId);
  if (updated?.familyNames !== 'अपडेटेड परिवार') {
    throw new Error('Storage UPDATE failed');
  }
  console.log('-> Update confirmed in storage');

  const batch = await fileStorage.batchGet([testId]);
  if (batch.length !== 1 || batch[0].id !== testId) {
    throw new Error('Storage BATCH GET failed');
  }
  console.log('-> Batch retrieval confirmed');

  await fileStorage.delete(testId);
  const afterDelete = await fileStorage.get(testId);
  if (afterDelete !== null) {
    throw new Error('Storage DELETE failed');
  }
  console.log('-> Delete confirmed in storage');

  // 3. Testing API Server Authorization & Token Protection
  console.log('\n[3/4] Probing API Server Endpoints (http://localhost:3000)...');
  const baseUrl = 'http://localhost:3000';

  const createRes = await fetch(`${baseUrl}/api/invitations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      category: 'birthday',
      familyNames: 'आरव का जन्मदिन',
      eventDate: '10 दिसंबर 2026',
      data: { celebrantName: 'आरव', age: '5' }
    })
  });

  const created = await createRes.json();
  console.log('-> API Create Status:', createRes.status, 'ID:', created.id, 'HasToken:', !!created.token);
  const cardId = created.id;
  const token = created.token;

  // Verify public GET does NOT leak editTokenHash
  const publicRes = await fetch(`${baseUrl}/api/invitations/${cardId}`);
  const publicJson = await publicRes.json();
  const exposesHash = 'editTokenHash' in (publicJson.meta || {}) || 'editTokenHash' in (publicJson.data || {});
  console.log('-> Public Response Data Leakage Check:', exposesHash ? 'LEAKED (FAIL)' : 'CLEAN (PASS)');
  if (exposesHash) throw new Error('Security Failure: editTokenHash leaked in public response!');

  // Missing token PUT
  const missingTokenRes = await fetch(`${baseUrl}/api/invitations/${cardId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: { age: '6' } })
  });
  console.log('-> Missing Token PUT Status (expected 401):', missingTokenRes.status);
  if (missingTokenRes.status !== 401) throw new Error('Security Failure: Missing token not blocked with 401');

  // Invalid token PUT
  const badTokenRes = await fetch(`${baseUrl}/api/invitations/${cardId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: 'wrong_token_xyz', data: { age: '6' } })
  });
  console.log('-> Invalid Token PUT Status (expected 403):', badTokenRes.status);
  if (badTokenRes.status !== 403) throw new Error('Security Failure: Invalid token not blocked with 403');

  // Valid token PUT
  const validPutRes = await fetch(`${baseUrl}/api/invitations/${cardId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, familyNames: 'आरव का 5वां जन्मदिन (पुष्ट)' })
  });
  console.log('-> Valid Token PUT Status (expected 200):', validPutRes.status);
  if (validPutRes.status !== 200) throw new Error('Update Failure with valid token');

  // 4. Persistence Across Storage Reload
  console.log('\n[4/4] Verifying Persistence Across Re-instantiation...');
  const reloadedStorage = new FileInvitationStorage();
  const persistedRecord = await reloadedStorage.get(cardId);
  if (!persistedRecord || persistedRecord.familyNames !== 'आरव का 5वां जन्मदिन (पुष्ट)') {
    throw new Error('Persistence failure across storage re-instantiation');
  }
  console.log('-> Persistence across re-instantiation: CONFIRMED');

  // Cleanup probe
  await fetch(`${baseUrl}/api/invitations/${cardId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  });

  console.log('\n=== ALL AUTOMATED TESTS COMPLETED SUCCESSFULLY ===');
}

runSuite().catch(err => {
  console.error('\nTEST SUITE FAILED:', err);
  process.exit(1);
});
