import {
  sqliteTable,
  text,
  integer,
  primaryKey,
  uniqueIndex,
  index,
} from 'drizzle-orm/sqlite-core';
import { user } from './auth.schema';

export const roles = sqliteTable(
  'roles',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    description: text('description'),

    createdAt: integer('created_at', {
      mode: 'timestamp_ms',
    }).notNull(),
    updatedAt: integer('updated_at', {
      mode: 'timestamp_ms',
    }).notNull(),
  },
  (t) => [uniqueIndex('roles_slug_idx').on(t.slug)],
);

export const permissions = sqliteTable(
  'permissions',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    description: text('description'),

    createdAt: integer('created_at', {
      mode: 'timestamp_ms',
    }).notNull(),
  },
  (t) => [uniqueIndex('permissions_slug_idx').on(t.slug)],
);

export const userRoles = sqliteTable(
  'user_roles',
  {
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),

    roleId: text('role_id')
      .notNull()
      .references(() => roles.id, { onDelete: 'cascade' }),

    assignedAt: integer('assigned_at', {
      mode: 'timestamp_ms',
    }).notNull(),

    assignedBy: text('assigned_by').references(() => user.id, {
      onDelete: 'set null',
    }),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.roleId] }),
    index('user_roles_role_idx').on(t.roleId),
  ],
);

export const rolePermissions = sqliteTable(
  'role_permissions',
  {
    roleId: text('role_id')
      .notNull()
      .references(() => roles.id, { onDelete: 'cascade' }),

    permissionId: text('permission_id')
      .notNull()
      .references(() => permissions.id, { onDelete: 'cascade' }),
  },
  (t) => [
    primaryKey({ columns: [t.roleId, t.permissionId] }),
    index('role_permissions_permission_idx').on(t.permissionId),
  ],
);
