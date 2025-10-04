import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const projects = sqliteTable('projects', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  teamName: text('team_name').notNull(),
  description: text('description'),
  demoUrl: text('demo_url'),
  isLocked: integer('is_locked', { mode: 'boolean' }).default(true),
  voteCount: integer('vote_count').default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const votes = sqliteTable('votes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  projectId: integer('project_id').references(() => projects.id),
  voterIdentifier: text('voter_identifier').notNull(),
  votedAt: text('voted_at').notNull(),
});

export const systemState = sqliteTable('system_state', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  votingEnabled: integer('voting_enabled', { mode: 'boolean' }).default(false),
  emergencyLockdown: integer('emergency_lockdown', { mode: 'boolean' }).default(false),
  updatedAt: text('updated_at').notNull(),
});

export const adminActivity = sqliteTable('admin_activity', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  action: text('action').notNull(),
  details: text('details'),
  timestamp: text('timestamp').notNull(),
});