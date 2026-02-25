import {
  bigint,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  jsonb,
} from 'drizzle-orm/pg-core';

// This file defines the structure of your database tables using the Drizzle ORM.

// To modify the database schema:
// 1. Update this file with your desired changes.
// 2. Generate a new migration by running: `npm run db:generate`

// The generated migration file will reflect your schema changes.
// The migration is automatically applied during the next database interaction,
// so there's no need to run it manually or restart the Next.js server.

// Need a database for production? Check out https://www.prisma.io/?via=saasboilerplatesrc
// Tested and compatible with Next.js Boilerplate
export const organizationSchema = pgTable(
  'organization',
  {
    id: text('id').primaryKey(),
    stripeCustomerId: text('stripe_customer_id'),
    stripeSubscriptionId: text('stripe_subscription_id'),
    stripeSubscriptionPriceId: text('stripe_subscription_price_id'),
    stripeSubscriptionStatus: text('stripe_subscription_status'),
    stripeSubscriptionCurrentPeriodEnd: bigint(
      'stripe_subscription_current_period_end',
      { mode: 'number' },
    ),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (table) => {
    return {
      stripeCustomerIdIdx: uniqueIndex('stripe_customer_id_idx').on(
        table.stripeCustomerId,
      ),
    };
  },
);

export const todoSchema = pgTable('todo', {
  id: serial('id').primaryKey(),
  ownerId: text('owner_id').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const businessProfileSchema = pgTable('business_profile', {
  id: serial('id').primaryKey(),
  organizationId: text('organization_id')
    .notNull()
    .unique()
    .references(() => organizationSchema.id),
  businessName: text('business_name'),
  businessDescription: text('business_description'),
  phoneNumber: text('phone_number'),
  address: text('address'),
  workingHours: text('working_hours'),
  policies: text('policies'),
  paymentMethods: text('payment_methods'),
  bankAccounts: jsonb('bank_accounts').$type<{ bankName: string; accountNumber: string; accountName: string }[]>(),
  socialLinks: jsonb('social_links').$type<{ platform: string; url: string }[]>(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const integrationSchema = pgTable('integration', {
  id: serial('id').primaryKey(),
  organizationId: text('organization_id')
    .notNull()
    .references(() => organizationSchema.id),
  type: text('type').notNull(), // 'whatsapp' | 'instagram' | 'messenger'
  providerId: text('provider_id'), // Page ID or WABA ID
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  status: text('status').default('active'),
  config: text('config'), // JSON string for extra config
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const productSchema = pgTable('product', {
  id: serial('id').primaryKey(),
  organizationId: text('organization_id')
    .notNull()
    .references(() => organizationSchema.id),
  name: text('name').notNull(),
  description: text('description'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').default('SAR').notNull(),
  imageUrl: text('image_url'),
  category: text('category'),
  status: text('status').default('active'), // 'active' | 'out_of_stock' | 'draft'
  stock: numeric('stock').default('0').notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const leadSchema = pgTable('lead', {
  id: serial('id').primaryKey(),
  organizationId: text('organization_id')
    .notNull()
    .references(() => organizationSchema.id),
  name: text('name').notNull(),
  contactMethod: text('contact_method').notNull(),
  source: text('source').default('whatsapp').notNull(),
  status: text('status').default('new').notNull(),
  notes: text('notes'),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const bookingSchema = pgTable('booking', {
  id: serial('id').primaryKey(),
  organizationId: text('organization_id')
    .notNull()
    .references(() => organizationSchema.id),
  cart: jsonb('cart').$type<{ productId: number; quantity: number }[]>(),
  customerName: text('customer_name').notNull(),
  contactInfo: text('contact_info'),
  serviceDetails: text('service_details'),
  bookingDate: timestamp('booking_date', { mode: 'date' }).notNull(),
  status: text('status').default('upcoming').notNull(), // 'upcoming' | 'completed' | 'cancelled'
  source: text('source').default('whatsapp'), // 'whatsapp' | 'instagram' | 'facebook' | 'manual' | etc
  socialUsername: text('social_username'),
  notes: text('notes'),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const aiSettingsSchema = pgTable('ai_settings', {
  id: serial('id').primaryKey(),
  organizationId: text('organization_id')
    .notNull()
    .unique()
    .references(() => organizationSchema.id),
  isActive: text('is_active').default('true'), // 'true' | 'false' (using text due to sqlite/pg quirks)
  botName: text('bot_name').default('مساعد المتجر'),
  systemPrompt: text('system_prompt'),
  tone: text('tone'),
  escalationRules: text('escalation_rules'),
  faqs: jsonb('faqs').$type<{ question: string; answer: string }[]>(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});
