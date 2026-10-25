import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { user } from './auth.schema';

export const userProfiles = sqliteTable(
  'user_profiles',
  {
    userId: text('user_id')
      .primaryKey()
      .references(() => user.id, { onDelete: 'cascade' }),

    firstName: text('first_name'),
    lastName: text('last_name'),
    username: text('username').unique(),
    displayName: text('display_name'),
    pronouns: text('pronouns'),
    bio: text('bio'),
    headline: text('headline'),

    avatarUrl: text('avatar_url'),
    coverImageUrl: text('cover_image_url'),

    phone: text('phone'),
    website: text('website'),
    location: text('location'),
    city: text('city'),
    country: text('country'),
    timezone: text('timezone'),
    locale: text('locale').notNull().default('en'),

    jobTitle: text('job_title'),
    company: text('company'),
    industry: text('industry'),

    socialLinks: text('social_links', { mode: 'json' }).$type<
      Record<string, string>
    >(),
    skills: text('skills', { mode: 'json' }).$type<string[]>(),
    interests: text('interests', { mode: 'json' }).$type<string[]>(),

    theme: text('theme', {
      enum: ['light', 'dark', 'system'],
    })
      .notNull()
      .default('system'),

    emailNotifications: integer('email_notifications', {
      mode: 'boolean',
    })
      .notNull()
      .default(true),

    marketingEmails: integer('marketing_emails', {
      mode: 'boolean',
    })
      .notNull()
      .default(false),

    isPublic: integer('is_public', {
      mode: 'boolean',
    })
      .notNull()
      .default(true),

    createdAt: integer('created_at', {
      mode: 'timestamp_ms',
    })
      .notNull()
      .$defaultFn(() => new Date()),

    updatedAt: integer('updated_at', {
      mode: 'timestamp_ms',
    })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('user_profiles_display_name_idx').on(table.displayName),
    index('user_profiles_location_idx').on(table.country, table.city),
  ],
);
