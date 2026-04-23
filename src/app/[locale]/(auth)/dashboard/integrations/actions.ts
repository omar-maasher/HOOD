'use server';

import { Buffer } from 'node:buffer';

import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { db } from '@/libs/DB';
import { logger } from '@/libs/Logger';
import { integrationSchema, productSchema } from '@/models/Schema';

export async function saveStoreIntegrationAndSync(
  platform: string,
  storeUrl: string,
  accessToken: string = '',
  secretToken?: string,
  customMapping?: any,
) {
  const { orgId } = await auth();
  if (!orgId) {
    throw new Error('Unauthorized');
  }

  try {
    // 1. Validate Store URL simply
    const cleanUrl = storeUrl.replace(/\/$/, '').trim();

    if (platform !== 'scraper') {
      const existing = await db.query.integrationSchema.findFirst({
        where: (i, { and, eq }) => and(eq(i.organizationId, orgId), eq(i.type, platform)),
      });

      if (existing) {
        await db.update(integrationSchema)
          .set({ providerId: cleanUrl, accessToken, refreshToken: secretToken || null, status: 'active' })
          .where(eq(integrationSchema.id, existing.id));
      } else {
        await db.insert(integrationSchema).values({
          organizationId: orgId,
          type: platform,
          providerId: cleanUrl,
          accessToken,
          refreshToken: secretToken || null,
          status: 'active',
        });
      }
    }

    // 3. Official API Data Sync (Pull Products)
    let fetchedProducts: any[] = [];

    if (platform === 'salla') {
      // Salla API
      const res = await fetch('https://api.salla.dev/admin/v2/products', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      });
      if (!res.ok) {
        throw new Error('Salla API Error: Check Token');
      }
      const data = await res.json();
      fetchedProducts = data.data.map((p: any) => ({
        name: p.name,
        description: p.description?.replace(/<[^>]*>?/g, '') || '', // stripping HTML
        price: p.price?.amount || 0,
        currency: p.price?.currency || 'SAR',
        stock: p.quantity || 0,
        imageUrl: p.main_image || null,
        category: p.categories?.[0]?.name || 'عام',
      }));
    } else if (platform === 'shopify') {
      // Shopify API
      const shopifyDomain = cleanUrl.includes('.myshopify.com') ? cleanUrl : `${cleanUrl}.myshopify.com`;
      const res = await fetch(`https://${shopifyDomain}/admin/api/2024-01/products.json`, {
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) {
        throw new Error('Shopify API Error: Check Token and Store URL');
      }
      const data = await res.json();
      fetchedProducts = data.products.map((p: any) => ({
        name: p.title,
        description: p.body_html?.replace(/<[^>]*>?/g, '') || '',
        price: p.variants?.[0]?.price || 0,
        currency: 'USD', // Default fallback
        stock: p.variants?.[0]?.inventory_quantity || 0,
        imageUrl: p.image?.src || null,
        category: p.product_type || 'General',
      }));
    } else if (platform === 'woocommerce') {
      // WooCommerce API
      const authHeader = `Basic ${Buffer.from(`${accessToken}:${secretToken}`).toString('base64')}`;
      const res = await fetch(`${cleanUrl}/wp-json/wc/v3/products`, {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) {
        throw new Error('WooCommerce API Error: Check Keys and Store URL');
      }
      const data = await res.json();
      fetchedProducts = data.map((p: any) => ({
        name: p.name,
        description: p.description?.replace(/<[^>]*>?/g, '') || '',
        price: p.price || 0,
        currency: p.currency || 'SAR',
        stock: p.stock_quantity || (p.in_stock ? 100 : 0),
        imageUrl: p.images?.[0]?.src || null,
        category: p.categories?.[0]?.name || 'General',
      }));
    } else if (platform === 'custom') {
      // Custom Generic JSON API Integration
      const headersInit: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (accessToken) {
        headersInit.Authorization = accessToken;
      }

      const res = await fetch(cleanUrl, { headers: headersInit });
      if (!res.ok) {
        throw new Error(`Custom API Error (${res.status}): Please check Endpoint and Authorization headers.`);
      }

      const data = await res.json();

      // 1. Resolve to array using productsPath if defined (e.g. "data.items")
      let rawProducts = data;
      if (customMapping?.productsPath) {
        const paths = customMapping.productsPath.split('.');
        for (const p of paths) {
          if (rawProducts && rawProducts[p]) {
            rawProducts = rawProducts[p];
          }
        }
      }

      if (!Array.isArray(rawProducts)) {
        throw new TypeError('The resolved API data is not an array. Please verify your [JSON Array Path] mapping.');
      }

      // 2. Map fields dynamically based on user mapping
      const nKey = customMapping?.nameKey || 'name';
      const pKey = customMapping?.priceKey || 'price';
      const dKey = customMapping?.descKey || 'description';
      const iKey = customMapping?.imageKey || 'image';

      fetchedProducts = rawProducts.map((p: any) => ({
        name: String(p[nKey] || 'Product'),
        description: String(p[dKey] || '').replace(/<[^>]*>?/g, ''), // strip HTML
        price: Number.parseFloat(p[pKey]) || 0,
        currency: String(p.currency || 'SAR'),
        stock: Number.parseInt(p.stock || p.quantity || p.inventory_quantity || '10', 10),
        imageUrl: typeof p[iKey] === 'string' ? p[iKey] : null,
        category: p.category || 'General',
      }));
    } else if (platform === 'scraper') {
      const N8N_AI_READER_WEBHOOK = process.env.N8N_AI_READER_WEBHOOK || 'http://localhost:5678/webhook/ai-reader';

      const res = await fetch(N8N_AI_READER_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: cleanUrl, intent: 'products_sync' }),
      });

      if (!res.ok) {
        throw new Error('فشل الوصول إلى n8n لقراءة الرابط. يرجى التأكد من تشغيل الـ Webhook.');
      }

      const data = await res.json();

      if (!data.products || !Array.isArray(data.products)) {
        throw new Error('N8N لم يُرجع مصفوفة منتجات (products array) بشكل صحيح.');
      }

      const mappedProducts = data.products.map((p: any) => ({
        name: p.name || 'منتج مسحوب',
        description: p.description || '',
        price: Number.parseFloat(p.price) || 0,
        currency: p.currency || 'SAR',
        stock: Number.parseInt(p.stock || p.quantity || '10', 10),
        imageUrl: p.imageUrl || p.image || null,
        category: p.category || 'Scraped',
      }));

      if (mappedProducts.length === 0) {
        throw new Error('عاد n8n بمنتجات فارغة.');
      }

      fetchedProducts.push(...mappedProducts);
    }

    // 4. Save to SaaS Product Database
    for (const prod of fetchedProducts) {
      // Basic upsert/insert (Assuming unique names per org for simplicity)
      const existingProduct = await db.query.productSchema.findFirst({
        where: (p, { and, eq }) => and(eq(p.organizationId, orgId), eq(p.name, prod.name)),
      });

      if (existingProduct) {
        await db.update(productSchema)
          .set({
            price: prod.price.toString(),
            stock: prod.stock.toString(),
            imageUrl: prod.imageUrl,
            category: prod.category,
          })
          .where(eq(productSchema.id, existingProduct.id));
      } else {
        await db.insert(productSchema).values({
          organizationId: orgId,
          name: prod.name,
          description: prod.description,
          price: prod.price.toString(),
          currency: prod.currency,
          stock: prod.stock.toString(),
          imageUrl: prod.imageUrl,
          category: prod.category,
          status: 'active',
        });
      }
    }

    revalidatePath('/dashboard/integrations');
    revalidatePath('/dashboard/products');

    return { success: true, count: fetchedProducts.length };
  } catch (error: any) {
    logger.error('Store Sync Error', error);
    return { success: false, error: error.message || 'فشل الاتصال بالمتجر، يرجى التأكد من صحة البيانات.' };
  }
}
export async function syncAllIntegrationsAction() {
  const { orgId } = await auth();
  if (!orgId) {
    throw new Error('Unauthorized');
  }

  try {
    // 1. Get all active integrations
    const integrations = await db.query.integrationSchema.findMany({
      where: eq(integrationSchema.organizationId, orgId),
    });

    const results = [];

    for (const integration of integrations) {
      // Sync stores
      if (['salla', 'shopify', 'woocommerce', 'custom'].includes(integration.type)) {
        const res = await saveStoreIntegrationAndSync(
          integration.type,
          integration.providerId || '',
          integration.accessToken || '',
          integration.refreshToken || '',
        );
        results.push({ type: integration.type, ...res });
      }

      // Meta Channels Sync (Reset Webhook Subscriptions)
      if (['instagram', 'messenger'].includes(integration.type)) {
        try {
          const config = integration.config ? JSON.parse(integration.config as string) : {};
          const pageId = integration.providerId; // Messenger pageId or IG-connected pageId
          const accessToken = integration.accessToken;

          if (pageId && accessToken) {
             const fields = integration.type === 'instagram' 
                ? 'messages,messaging_postbacks,comments,mentions'
                : 'messages,messaging_postbacks';

             await fetch(`https://graph.facebook.com/v21.0/${pageId}/subscribed_apps?access_token=${accessToken}`, {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ subscribed_fields: fields.split(',') }),
             });
             results.push({ type: integration.type, success: true });
          }
        } catch (error) {
          console.error(`${integration.type} sync error:`, error);
          results.push({ type: integration.type, success: false });
        }
      }

      // WhatsApp Sync (Reset Subscriptions)
      if (integration.type === 'whatsapp') {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/whatsapp/resubscribe`, {
            method: 'POST',
            headers: {
              'Cookie': (await import('next/headers')).cookies().toString(),
            },
          });
          results.push({ type: 'whatsapp', success: res.ok });
        } catch (error) {
          console.error('WhatsApp sync error:', error);
        }
      }
    }

    revalidatePath('/dashboard/integrations');
    return { success: true, results };
  } catch (error: any) {
    logger.error('Sync process failed', error);
    return { success: false, error: error.message };
  }
}
