
import LeadsClient from './LeadsClient';
import { getLeads } from './actions';

export async function generateMetadata() {
  return {
    title: `العملاء المحتملين | Hoodtrading`,
  };
}

export default async function LeadsPage() {
  const leads = await getLeads();
  return <LeadsClient initialLeads={leads} />;
}
