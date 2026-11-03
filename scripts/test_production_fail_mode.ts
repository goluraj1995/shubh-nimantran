import { FirestoreInvitationStorage } from '../src/server/storage/FirestoreStorage.ts';

async function testProductionMode() {
  console.log('--- TESTING PRODUCTION FIRESTORE ENFORCEMENT & FAIL-SAFE ---');
  
  const storage = new FirestoreInvitationStorage();
  const health = await storage.checkHealth();
  
  console.log('1. Health check reports:');
  console.log('   Healthy:', health.healthy);
  console.log('   Backend:', health.backend);
  console.log('   ErrorCategory:', health.errorCategory);
  console.log('   Diagnostic message:', health.error);

  console.log('\n2. Testing explicit failure on write (no silent fallback):');
  try {
    await storage.create({
      id: 'prod_fail_probe',
      category: 'hindu_wedding',
      familyNames: 'Fail Probe',
      eventDate: '2026-11-25',
      data: {},
      editTokenHash: 'dummy_hash',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    console.log('UNEXPECTED SUCCESS: Write succeeded when it should have failed!');
    process.exit(1);
  } catch (err: any) {
    console.log('   SUCCESSFULLY REJECTED WITH EXPLICIT ERROR:');
    console.log('   Error name:', err.name);
    console.log('   Error message:', err.message);
    console.log('   GCP Code:', err.code);
  }

  console.log('\n--- VERIFIED: PRODUCTION MODE STRICTLY FAILS WITHOUT SILENT FILE FALLBACK ---');
}

testProductionMode();
