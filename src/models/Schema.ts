import {
  bigint,
  // integer,
  jsonb,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
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
    planId: text('plan_id'),
    metaAccessToken: text('meta_access_token'),
    stripeCustomerId: text('stripe_customer_id'),
    stripeSubscriptionId: text('stripe_subscription_id'),
    stripeSubscriptionPriceId: text('stripe_subscription_price_id'),
    stripeSubscriptionStatus: text('stripe_subscription_status'),
    stripeSubscriptionCurrentPeriodEnd: bigint(
      'stripe_subscription_current_period_end',
      { mode: 'number' },
    ),
    apiKey: text('api_key').unique(),
    expoPushTokens: jsonb('expo_push_tokens').$type<string[]>(),
    webPushSubscriptions: jsonb('web_push_subscriptions').$type<any[]>(),
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
  businessType: text('business_type'),
  businessDescription: text('business_description'),
  phoneNumber: text('phone_number'),
  address: text('address'),
  workingHours: text('working_hours'),
  policies: text('policies'),
  paymentMethods: text('payment_methods'),
  bankAccounts: jsonb('bank_accounts').$type<{ bankName: string; accountNumber: string; accountName: string }[]>(),
  socialLinks: jsonb('social_links').$type<{ platform: string; url: string }[]>(),
  storeLatitude: text('store_latitude'),
  storeLongitude: text('store_longitude'),
  deliveryPricePerKm: text('delivery_price_per_km'),
  isDeliveryEnabled: text('is_delivery_enabled').default('false'),
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
  username: text('username'), // Social handle (@user)
  externalId: text('external_id'), // Meta PSID / WBA ID for lookups
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
  doctorName: text('doctor_name'), // For clinics/consultants
  serviceType: text('service_type'), // e.g., Consultation, Surgery, Follow-up
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
  isCommentsActive: text('is_comments_active').default('true'),
  botName: text('bot_name').default('مساعد المتجر'),
  systemPrompt: text('system_prompt'),
  tone: text('tone'),
  escalationRules: text('escalation_rules'),
  faqs: jsonb('faqs').$type<{ question: string; answer: string }[]>(),
  welcomeMessage: text('welcome_message').default('أهلاً بك {name}! كيف يمكنني مساعدتك؟ (طلب / سعر / دعم / حجز / تواصل بشري)'),
  workingHours: jsonb('working_hours').$type<{ enabled: boolean; start: string; end: string; outOfHoursMessage: string }>(),
  antiSpam: jsonb('anti_spam').$type<{ enabled: boolean; maxMessagesPerWindow: number; windowMinutes: number; warningMessage: string }>(),
  whatsappMenu: jsonb('whatsapp_menu').$type<{
    enabled: boolean;
    header: string;
    body: string;
    footer: string;
    buttonText: string;
    sections: Array<{
      title: string;
      rows: Array<{ id: string; title: string; description: string }>;
    }>;
  }>(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const webhookEventSchema = pgTable('webhook_event', {
  id: serial('id').primaryKey(),
  mid: text('mid').notNull().unique(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const waTemplateSchema = pgTable('wa_template', {
  id: serial('id').primaryKey(),
  organizationId: text('organization_id').notNull().references(() => organizationSchema.id),
  name: text('name').notNull(), // snake_case, unique per WABA
  language: text('language').default('ar').notNull(), // e.g. ar, en_US
  category: text('category').notNull(), // MARKETING | UTILITY
  headerText: text('header_text'), // optional text header
  bodyText: text('body_text').notNull(),
  footerText: text('footer_text'),
  buttons: jsonb('buttons').$type<Array<{ type: 'URL' | 'PHONE_NUMBER' | 'QUICK_REPLY'; text: string; url?: string; phone_number?: string }>>(),
  metaStatus: text('meta_status').default('PENDING'), // PENDING | APPROVED | REJECTED | PAUSED
  metaTemplateId: text('meta_template_id'), // returned by Meta after creation
  rejectedReason: text('rejected_reason'),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().$onUpdate(() => new Date()).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const globalSettingsSchema = pgTable('global_settings', {
  id: serial('id').primaryKey(),
  key: text('key').notNull().unique(),
  value: text('value'),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});
export const conversationSchema = pgTable('conversation', {
  id: serial('id').primaryKey(),
  organizationId: text('organization_id')
    .notNull()
    .references(() => organizationSchema.id),
  platform: text('platform').notNull(), // 'whatsapp' | 'instagram' | 'messenger'
  externalId: text('external_id').notNull(), // The ID from Meta (senderId)
  customerName: text('customer_name'),
  lastMessage: text('last_message'),
  lastMessageAt: timestamp('last_message_at', { mode: 'date' }),
  isUnread: text('is_unread').default('false'),
  status: text('status').default('open'), // 'open' | 'pending' | 'closed'
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
}, (table) => {
  return {
    externalPlatformIdx: uniqueIndex('external_platform_idx').on(table.organizationId, table.platform, table.externalId),
  };
});

export const messageSchema = pgTable('message', {
  id: serial('id').primaryKey(),
  organizationId: text('organization_id')
    .notNull()
    .references(() => organizationSchema.id),
  conversationId: serial('conversation_id')
    .notNull()
    .references(() => conversationSchema.id, { onDelete: 'cascade' }),
  direction: text('direction').notNull(), // 'incoming' | 'outgoing'
  type: text('type').default('text').notNull(), // 'text' | 'image' | 'voice'
  text: text('text'),
  mediaUrl: text('media_url'),
  metadata: text('metadata'), // Extra info like MID or status
  senderType: text('sender_type').default('customer'), // 'customer' | 'agent' | 'bot'
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const notificationSchema = pgTable('notification', {
  id: serial('id').primaryKey(),
  organizationId: text('organization_id')
    .notNull()
    .references(() => organizationSchema.id),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type').default('info').notNull(), // 'info' | 'message' | 'alert' | 'success'
  isRead: text('is_read').default('false').notNull(),
  link: text('link'),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// Relationships and types for Drizzle
export type Conversation = typeof conversationSchema.$inferSelect;
export type Message = typeof messageSchema.$inferSelect;
export type Booking = typeof bookingSchema.$inferSelect;
export type Notification = typeof notificationSchema.$inferSelect;
