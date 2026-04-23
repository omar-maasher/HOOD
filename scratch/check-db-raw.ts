import { db } from '../src/libs/DB';
import { integrationSchema } from '../src/models/Schema';

async function checkIntegrations() {
  try {
    const allIntegrations = await db.select().from(integrationSchema);
    console.log('--- ALL INTEGRATIONS IN DB ---');
    if (allIntegrations.length === 0) {
      console.log('No integrations found at all.');
    } else {
      allIntegrations.forEach(i => {
        console.log(`Type: ${i.type}, Status: ${i.status}, OrgId: ${i.organizationId}, ProviderId: ${i.providerId}`);
      });
    }
  } catch (e) {
    console.error('DB Error:', e);
  }
}

checkIntegrations().catch(console.error);
