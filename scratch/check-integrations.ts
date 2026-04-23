import { db } from '../src/libs/DB';
import { integrationSchema } from '../src/models/Schema';

async function checkIntegrations() {
  try {
    const allIntegrations = await db.select().from(integrationSchema);
    console.log('--- ALL INTEGRATIONS ---');
    console.log(JSON.stringify(allIntegrations, null, 2));
  } catch (e) {
    console.error('DB Error:', e);
  }
}

checkIntegrations().catch(console.error);
