import LeadsClient from './LeadsClient';
import { getLeads } from './actions';

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
