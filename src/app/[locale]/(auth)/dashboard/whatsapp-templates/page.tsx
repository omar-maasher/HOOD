import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { WhatsAppTemplateBuilder } from '@/features/whatsapp/WhatsAppTemplateBuilder';

export default async function WhatsAppTemplatesPage() {
  const { orgId } = await auth();
  if (!orgId) redirect('/sign-in');

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <WhatsAppTemplateBuilder />
    </div>
  );
}

export const metadata = {
  title: 'قوالب الواتساب | لوحة التحكم',
  description: 'إنشاء وإدارة قوالب رسائل الواتساب',
};
