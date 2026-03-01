import { getLeads } from './actions';
import LeadsClient from './LeadsClient';

export async function generateMetadata() {
  return {
    title: `العملاء المحتملين | Hoodtrading`,
  };
}

export default async function LeadsPage() {
  let leads: any[] = [];
  try {
    leads = await getLeads();
  } catch (error) {
    console.error('Leads page error:', error);
  }
  return <LeadsClient initialLeads={leads} />;
}
