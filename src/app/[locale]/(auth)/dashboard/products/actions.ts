'use server';

import { auth } from '@clerk/nextjs/server';
import { eq, and, inArray } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { productSchema, organizationSchema } from '@/models/Schema';

export async function getProducts() {
  const { orgId } = await auth();
  
  if (!orgId) {
    return [];
  }

  const products = await db
    .select()
    .from(productSchema)
    .where(eq(productSchema.organizationId, orgId));

  return products.map((p: any) => ({
    ...p,
    price: p.price ? Number(p.price).toFixed(2) : '0.00',
    stock: p.stock ? Number(p.stock) : 0
  }));
}

export async function createProduct(data: any) {
  const { orgId } = await auth();
  
  if (!orgId) {
    throw new Error('Unauthorized');
  }

  // Ensure organization exists in Db to avoid foreign key constraints after local resets
  await db.insert(organizationSchema).values({ id: orgId }).onConflictDoNothing();

  const [newProduct] = await db.insert(productSchema).values({
    organizationId: orgId,
    name: data.name,
    price: data.price.toString(),
    currency: data.currency,
    category: data.category,
    status: data.status,
    description: data.description,
    stock: data.stock ? data.stock.toString() : '0',
  }).returning();

  if (!newProduct) throw new Error('Failed to create product');

  return { ...newProduct, price: newProduct.price ? Number(newProduct.price).toFixed(2) : '0.00', stock: newProduct.stock ? Number(newProduct.stock) : 0 };
}

export async function bulkUploadProducts(products: any[]) {
  const { orgId } = await auth();
  if (!orgId) throw new Error('Unauthorized');
  await db.insert(organizationSchema).values({ id: orgId }).onConflictDoNothing();

  const formattedProducts = products.map(p => ({
    organizationId: orgId,
    name: p.name || 'Unnamed Product',
    price: (p.price || 0).toString(),
    currency: p.currency || 'SAR',
    category: p.category || '',
    status: p.status || 'active',
    description: p.description || '',
    stock: (p.stock || 0).toString(),
  }));

  if (formattedProducts.length === 0) return [];

  const newProducts = await db.insert(productSchema).values(formattedProducts).returning();

  return newProducts.map((p: any) => ({ ...p, price: p.price ? Number(p.price).toFixed(2) : '0.00', stock: p.stock ? Number(p.stock) : 0 }));
}

export async function updateProduct(id: number, data: any) {
  const { orgId } = await auth();
  
  if (!orgId) {
    throw new Error('Unauthorized');
  }

  const [updated] = await db.update(productSchema)
    .set({
      name: data.name,
      price: data.price.toString(),
      currency: data.currency,
      category: data.category,
      status: data.status,
      description: data.description,
      stock: data.stock ? data.stock.toString() : '0',
    })
    .where(and(eq(productSchema.id, id), eq(productSchema.organizationId, orgId)))
    .returning();

  if (!updated) throw new Error('Failed to update product');

  return { ...updated, price: updated.price ? Number(updated.price).toFixed(2) : '0.00', stock: updated.stock ? Number(updated.stock) : 0 };
}

export async function deleteProduct(id: number) {
  const { orgId } = await auth();
  
  if (!orgId) {
    throw new Error('Unauthorized');
  }

  await db.delete(productSchema)
    .where(and(eq(productSchema.id, id), eq(productSchema.organizationId, orgId)));
    
  return true;
}

export async function deleteProducts(ids: number[]) {
  const { orgId } = await auth();
  
  if (!orgId) {
    throw new Error('Unauthorized');
  }

  if (ids.length === 0) return true;

  await db.delete(productSchema)
    .where(and(inArray(productSchema.id, ids), eq(productSchema.organizationId, orgId)));
    
  return true;
}
