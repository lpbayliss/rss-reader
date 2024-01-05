import { relations, sql } from 'drizzle-orm';
import { index, integer, pgTable, primaryKey, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { type AdapterAccount } from 'next-auth/adapters';
import {} from 'crypto';
import { url } from 'inspector';

export const users = pgTable('user', {
  id: varchar('id', { length: 255 }).notNull().primaryKey(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull(),
  emailVerified: timestamp('emailVerified', {
    mode: 'date',
    precision: 3,
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  image: varchar('image', { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  usersToSources: many(usersToSources),
}));

export const accounts = pgTable(
  'account',
  {
    userId: varchar('userId', { length: 255 }).notNull(),
    type: varchar('type', { length: 255 }).$type<AdapterAccount['type']>().notNull(),
    provider: varchar('provider', { length: 255 }).notNull(),
    providerAccountId: varchar('providerAccountId', { length: 255 }).notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: varchar('token_type', { length: 255 }),
    scope: varchar('scope', { length: 255 }),
    id_token: text('id_token'),
    session_state: varchar('session_state', { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
    userIdIdx: index('account_userId_idx').on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = pgTable(
  'session',
  {
    sessionToken: varchar('sessionToken', { length: 255 }).notNull().primaryKey(),
    userId: varchar('userId', { length: 255 }).notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (session) => ({
    userIdIdx: index('session_userId_idx').on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: varchar('identifier', { length: 255 }).notNull(),
    token: varchar('token', { length: 255 }).notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

export const sources = pgTable(
  'source',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    title: varchar('title', { length: 255 }),
    url: varchar('url', { length: 255 }).notNull(),
    description: text('description'),
    hash: varchar('hash', { length: 40 }).notNull().unique(),
  },
  (source) => ({
    hashIndex: index('source_hash_idx').on(source.hash),
  }),
);

export const sourcesRelations = relations(sources, ({ many }) => ({
  articles: many(articles),
  usersToSources: many(usersToSources),
}));

export const articles = pgTable(
  'article',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    title: varchar('title', { length: 255 }),
    url: varchar('url', { length: 255 }).notNull(),
    description: text('description'),
    hash: varchar('hash', { length: 40 }).notNull().unique(),
    source: uuid('source').notNull(),
    timestamp: timestamp('timestamp', { mode: 'date' }).notNull(),
  },
  (article) => ({
    hashIndex: index('article_hash_idx').on(article.hash),
  }),
);

export const articlesRelations = relations(articles, ({ one }) => ({
  source: one(sources, { fields: [articles.source], references: [sources.id] }),
}));

export const usersToSources = pgTable(
  'users_to_sources',
  {
    userId: varchar('user_id')
      .notNull()
      .references(() => users.id),
    sourceId: uuid('source_id')
      .notNull()
      .references(() => sources.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.sourceId] }),
  }),
);

export const usersToSourcesRelations = relations(usersToSources, ({ one }) => ({
  sources: one(sources, {
    fields: [usersToSources.sourceId],
    references: [sources.id],
  }),
  user: one(users, {
    fields: [usersToSources.userId],
    references: [users.id],
  }),
}));
