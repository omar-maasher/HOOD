import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import { notifyOrg } from '@/libs/Notifications';

export async function POST() {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await notifyOrg(
      orgId,
      'إشعار تجريبي 🚀',
      'مبروك! إشعارات متصفح كروم وتطبيق الجوال تعمل الآن بنجاح.',
      { link: '/dashboard' },
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending test notification:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
