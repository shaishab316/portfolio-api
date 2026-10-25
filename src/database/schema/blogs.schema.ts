import {
  sqliteTable,
  text,
  integer,
  index,
  uniqueIndex,
  primaryKey,
  type AnySQLiteColumn,
} from 'drizzle-orm/sqlite-core';
import { user } from './auth.schema';

export const categories = sqliteTable(
  'categories',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    description: text('description'),
    parentId: text('parent_id').references(
      (): AnySQLiteColumn => categories.id,
      { onDelete: 'set null' },
    ),
    createdAt: integer('created_at', {
      mode: 'timestamp_ms',
    }).notNull(),
    updatedAt: integer('updated_at', {
      mode: 'timestamp_ms',
    }).notNull(),
  },
  (t) => [
    uniqueIndex('categories_slug_idx').on(t.slug),
    index('categories_parent_idx').on(t.parentId),
  ],
);

export const tags = sqliteTable(
  'tags',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    description: text('description'),
    createdAt: integer('created_at', {
      mode: 'timestamp_ms',
    }).notNull(),
  },
  (t) => [uniqueIndex('tags_slug_idx').on(t.slug)],
);

export const blogStatusEnum = [
  'draft',
  'scheduled',
  'published',
  'archived',
] as const;
export type BlogStatus = (typeof blogStatusEnum)[number];
export const BlogStatus = blogStatusEnum.reduce(
  (acc, status) => {
    acc[status] = status;
    return acc;
  },
  {} as Record<BlogStatus, BlogStatus>,
);

export const blogs = sqliteTable(
  'blogs',
  {
    id: text('id').primaryKey(),

    authorId: text('author_id')
      .notNull()
      .references(() => user.id, { onDelete: 'restrict' }),

    parentBlogId: text('parent_blog_id').references(
      (): AnySQLiteColumn => blogs.id,
      { onDelete: 'set null' },
    ),

    title: text('title').notNull(),
    slug: text('slug').notNull(),
    excerpt: text('excerpt'),
    content: text('content').notNull(),
    coverImage: text('cover_image'),

    status: text('status', {
      enum: blogStatusEnum,
    })
      .notNull()
      .default(BlogStatus.draft),

    isFeatured: integer('is_featured', {
      mode: 'boolean',
    })
      .notNull()
      .default(false),

    allowComments: integer('allow_comments', {
      mode: 'boolean',
    })
      .notNull()
      .default(true),

    publishedAt: integer('published_at', {
      mode: 'timestamp_ms',
    }),
    scheduledAt: integer('scheduled_at', {
      mode: 'timestamp_ms',
    }),

    seoTitle: text('seo_title'),
    seoDescription: text('seo_description'),
    canonicalUrl: text('canonical_url'),

    readingTimeMinutes: integer('reading_time_minutes'),
    viewCount: integer('view_count').notNull().default(0),

    createdAt: integer('created_at', {
      mode: 'timestamp_ms',
    }).notNull(),
    updatedAt: integer('updated_at', {
      mode: 'timestamp_ms',
    }).notNull(),
    deletedAt: integer('deleted_at', {
      mode: 'timestamp_ms',
    }),
  },
  (t) => [
    uniqueIndex('blogs_slug_idx').on(t.slug),
    index('blogs_author_idx').on(t.authorId),
    index('blogs_parent_idx').on(t.parentBlogId),
    index('blogs_status_published_idx').on(t.status, t.publishedAt),
    index('blogs_scheduled_idx').on(t.status, t.scheduledAt),
  ],
);

export const blogCategories = sqliteTable(
  'blog_categories',
  {
    blogId: text('blog_id')
      .notNull()
      .references(() => blogs.id, { onDelete: 'cascade' }),
    categoryId: text('category_id')
      .notNull()
      .references(() => categories.id, { onDelete: 'cascade' }),
  },
  (t) => [
    primaryKey({ columns: [t.blogId, t.categoryId] }),
    index('blog_categories_category_idx').on(t.categoryId),
  ],
);

export const blogTags = sqliteTable(
  'blog_tags',
  {
    blogId: text('blog_id')
      .notNull()
      .references(() => blogs.id, { onDelete: 'cascade' }),
    tagId: text('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
  (t) => [
    primaryKey({ columns: [t.blogId, t.tagId] }),
    index('blog_tags_tag_idx').on(t.tagId),
  ],
);

export const relatedBlogs = sqliteTable(
  'related_blogs',
  {
    blogId: text('blog_id')
      .notNull()
      .references(() => blogs.id, { onDelete: 'cascade' }),
    relatedBlogId: text('related_blog_id')
      .notNull()
      .references(() => blogs.id, { onDelete: 'cascade' }),
    createdAt: integer('created_at', {
      mode: 'timestamp_ms',
    }).notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.blogId, t.relatedBlogId] }),
    index('related_blogs_related_idx').on(t.relatedBlogId),
  ],
);

export const blogCommentStatusEnum = [
  'pending',
  'approved',
  'spam',
  'rejected',
] as const;
export type BlogCommentStatus = (typeof blogCommentStatusEnum)[number];
export const BlogCommentStatus = blogCommentStatusEnum.reduce(
  (acc, status) => {
    acc[status] = status;
    return acc;
  },
  {} as Record<BlogCommentStatus, BlogCommentStatus>,
);

export const blogComments = sqliteTable(
  'blog_comments',
  {
    id: text('id').primaryKey(),

    blogId: text('blog_id')
      .notNull()
      .references(() => blogs.id, { onDelete: 'cascade' }),

    authorId: text('author_id').references(() => user.id, {
      onDelete: 'set null',
    }),

    parentId: text('parent_id').references(
      (): AnySQLiteColumn => blogComments.id,
      { onDelete: 'cascade' },
    ),

    guestName: text('guest_name'),
    guestEmail: text('guest_email'),
    content: text('content').notNull(),

    status: text('status', {
      enum: blogCommentStatusEnum,
    })
      .notNull()
      .default(BlogCommentStatus.pending),

    createdAt: integer('created_at', {
      mode: 'timestamp_ms',
    }).notNull(),
    updatedAt: integer('updated_at', {
      mode: 'timestamp_ms',
    }).notNull(),
  },
  (t) => [
    index('blog_comments_blog_status_idx').on(t.blogId, t.status),
    index('blog_comments_parent_idx').on(t.parentId),
    index('blog_comments_author_idx').on(t.authorId),
  ],
);

export const blogRevisions = sqliteTable(
  'blog_revisions',
  {
    id: text('id').primaryKey(),

    blogId: text('blog_id')
      .notNull()
      .references(() => blogs.id, { onDelete: 'cascade' }),

    editorId: text('editor_id').references(() => user.id, {
      onDelete: 'set null',
    }),

    title: text('title').notNull(),
    content: text('content').notNull(),
    excerpt: text('excerpt'),

    createdAt: integer('created_at', {
      mode: 'timestamp_ms',
    }).notNull(),
  },
  (t) => [index('blog_revisions_blog_created_idx').on(t.blogId, t.createdAt)],
);
