import { auth } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import { Facebook } from 'lucide-react';
import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import { db } from '@/libs/DB';
import { integrationSchema } from '@/models/Schema';

import { subscribeToMetaPage } from './actions';

export default async function MetaSelectPage(props: { searchParams: Promise<any> }) {
  const { orgId } = await auth();
  if (!orgId) redirect('/');

  const searchParams = await props.searchParams;
  const platform = searchParams.platform as string;
  const locale = await getLocale();
  const lang = locale || 'ar';

  if (!platform) redirect(`/${lang}/dashboard/integrations`);

  const fbRoot = await db.query.integrationSchema.findFirst({
    where: and(
      eq(integrationSchema.organizationId, orgId),
      eq(integrationSchema.type, 'facebook_root'),
    ),
  });

  if (!fbRoot || !fbRoot.accessToken) {
    redirect(`/${lang}/dashboard/integrations?error=no_facebook_root`);
  }

  // Fetch Pages
  const pagesRes = await fetch(`https://graph.facebook.com/v21.0/me/accounts?access_token=${fbRoot.accessToken}`);
  if (!pagesRes.ok) {
    redirect(`/${lang}/dashboard/integrations?error=pages_fetch_failed`);
  }

  const pagesData = await pagesRes.json();
  
  // Fetch permissions for debugging
  let debugInfo = '';
  try {
    const permsRes = await fetch(`https://graph.facebook.com/v21.0/me/permissions?access_token=${fbRoot.accessToken}`);
    const permsData = await permsRes.json();
    debugInfo = JSON.stringify({ permissions: permsData.data, pagesResponse: pagesData }, null, 2);
  } catch (e) {
    debugInfo = 'Failed to fetch debug info';
  }

  const pages = pagesData.data || [];

  // Filter for Instagram if needed
  let availablePages = [];

  if (platform === 'instagram') {
    for (const page of pages) {
      if (!page.access_token) continue;
      const igRes = await fetch(`https://graph.facebook.com/v21.0/${page.id}?fields=instagram_business_account{id,username,profile_picture_url}&access_token=${page.access_token}`);
      if (igRes.ok) {
        const igData = await igRes.json();
        if (igData.instagram_business_account) {
          availablePages.push({
            ...page,
            igAccountId: igData.instagram_business_account.id,
            igUsername: igData.instagram_business_account.username,
            igProfilePic: igData.instagram_business_account.profile_picture_url,
          });
        }
      }
    }
  } else {
    availablePages = pages.filter((p: any) => p.access_token);
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 pb-20 pt-10">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">
          اختر الصفحة المراد ربطها
        </h1>
        <p className="mt-2 text-muted-foreground">
          لقد وجدنا هذه الصفحات المرتبطة بحسابك، الرجاء اختيار الصفحة التي تريد تفعيل
          {' '}
          {platform === 'instagram' ? 'إنستجرام' : 'ماسنجر'}
          {' '}
          عليها.
        </p>
      </div>

      {availablePages.length === 0
        ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-900">
              <p>لم يتم العثور على أي صفحات صالحة لهذا الخيار. تأكد من إعطاء الصلاحيات لصفحاتك أو التأكد من ربط انستجرام بالصفحة.</p>
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm font-bold underline">إظهار تفاصيل الخطأ (للمطور)</summary>
                <pre className="mt-2 text-xs bg-red-100 p-4 rounded overflow-auto text-red-800" dir="ltr">
                  {debugInfo}
                </pre>
              </details>
            </div>
          )
        : (
            <div className="grid gap-4">
              {availablePages.map((page: any) => (
                <form
                  key={page.id}
                  action={async () => {
                    'use server';
                    let hasError = false;
                    try {
                      await subscribeToMetaPage(page.id, page.access_token, platform, page.igAccountId, page.igUsername, page.igProfilePic);
                    } catch (e: any) {
                      console.error(e);
                      hasError = true;
                    }

                    if (hasError) {
                      redirect(`/${lang}/dashboard/integrations?error=subscribe_failed`);
                    } else {
                      redirect(`/${lang}/dashboard/integrations?success=connected`);
                    }
                  }}
                  className="flex items-center justify-between rounded-2xl border bg-card p-6 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    {page.igProfilePic
                      ? (
                          <img src={page.igProfilePic} alt={page.igUsername} className="size-12 rounded-full border shadow-sm" referrerPolicy="no-referrer" />
                        )
                      : (
                          <div className="flex size-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            <Facebook className="size-6" />
                          </div>
                        )}
                    <div className="flex flex-col text-start">
                      <span className="text-lg font-bold">{page.name}</span>
                      {page.igUsername && (
                        <span className="text-sm text-muted-foreground">
                          @
                          {page.igUsername}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button type="submit" size="lg" className="rounded-xl font-bold">
                    ربط هذه الصفحة
                  </Button>
                </form>
              ))}
            </div>
          )}
    </div>
  );
}
