import { relations } from 'drizzle-orm'
import { index, integer, jsonb, pgEnum, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'

// ================================= Tables =========================================

export const userTable = pgTable(
  'user_table',
  {
    id: uuid('id')
      .primaryKey()
      .$default(() => uuidv7()),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    userName: varchar('user_name', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, precision: 0 }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, precision: 0 }).notNull().defaultNow(),
  },
  (table) => ({
    emailIdx: index('user_email_idx').on(table.email),
    userNameIdx: index('user_user_name_idx').on(table.userName),
  }),
)

export const organizationTable = pgTable(
  'organization_table',
  {
    id: uuid('id')
      .primaryKey()
      .$default(() => uuidv7()),
    name: varchar('name', { length: 255 }).notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => userTable.id),
    createdAt: timestamp('created_at', { withTimezone: true, precision: 0 }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, precision: 0 }).notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index('organization_user_id_idx').on(table.userId),
  }),
)

export const roleTable = pgTable(
  'role_table',
  {
    id: uuid('id')
      .primaryKey()
      .$default(() => uuidv7()),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description').notNull(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizationTable.id),
    createdAt: timestamp('created_at', { withTimezone: true, precision: 0 }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, precision: 0 }).notNull().defaultNow(),
  },
  (table) => ({
    orgIdx: index('role_organization_id_idx').on(table.organizationId),
  }),
)

export const organizationUsersTable = pgTable(
  'organization_users_table',
  {
    id: uuid('id')
      .primaryKey()
      .$default(() => uuidv7()),
    userId: uuid('user_id')
      .notNull()
      .references(() => userTable.id),
    roleId: uuid('role_id')
      .notNull()
      .references(() => roleTable.id),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizationTable.id),
    createdAt: timestamp('created_at', { withTimezone: true, precision: 0 }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, precision: 0 }).notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index('org_users_user_id_idx').on(table.userId),
    orgIdIdx: index('org_users_org_id_idx').on(table.organizationId),
    roleIdIdx: index('org_users_role_id_idx').on(table.roleId),
  }),
)

export const permissionTable = pgTable('permission_table', {
  id: uuid('id')
    .primaryKey()
    .$default(() => uuidv7()),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, precision: 0 }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, precision: 0 }).notNull().defaultNow(),
})

export const rolePermissionTable = pgTable(
  'role_permission_table',
  {
    id: uuid('id')
      .primaryKey()
      .$default(() => uuidv7()),
    roleId: uuid('role_id')
      .notNull()
      .references(() => roleTable.id),
    permissionId: uuid('permission_id')
      .notNull()
      .references(() => permissionTable.id),
    createdAt: timestamp('created_at', { withTimezone: true, precision: 0 }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, precision: 0 }).notNull().defaultNow(),
  },
  (table) => ({
    roleIdIdx: index('role_perm_role_id_idx').on(table.roleId),
    permissionIdIdx: index('role_perm_permission_id_idx').on(table.permissionId),
  }),
)

export const chatTable = pgTable(
  'chat_table',
  {
    id: uuid('id')
      .primaryKey()
      .$default(() => uuidv7()),
    name: varchar('name', { length: 255 }).notNull().unique(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizationTable.id),
    createdAt: timestamp('created_at', { withTimezone: true, precision: 0 }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, precision: 0 }).notNull().defaultNow(),
  },
  (table) => ({
    orgIdx: index('chat_organization_id_idx').on(table.organizationId),
  }),
)

export const llmModelsTable = pgTable('llm_models_table', {
  id: uuid('id')
    .primaryKey()
    .$default(() => uuidv7()),
  provider: varchar('provider', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  contextLimit: integer('context_limit').notNull(),
  tokenPrice: integer('token_price').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, precision: 0 }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, precision: 0 }).notNull().defaultNow(),
})

export const messageTypeEnum = pgEnum('message_type', ['user', 'assistant', 'system'])

export const messageTable = pgTable(
  'message_table',
  {
    id: uuid('id')
      .primaryKey()
      .$default(() => uuidv7()),
    type: messageTypeEnum('type').default('user'),
    content: text('content').notNull(),
    metadata: jsonb('metadata').notNull(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizationTable.id),
    chatId: uuid('chat_id')
      .notNull()
      .references(() => chatTable.id),
    modelId: uuid('model_id')
      .notNull()
      .references(() => llmModelsTable.id),
    createdAt: timestamp('created_at', { withTimezone: true, precision: 0 }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, precision: 0 }).notNull().defaultNow(),
  },
  (table) => ({
    organizationIdIdx: index('message_org_id_idx').on(table.organizationId),
    chatIdIdx: index('message_chat_id_idx').on(table.chatId),
    modelIdIdx: index('message_model_id_idx').on(table.modelId),
  }),
)

export const feedbackTable = pgTable(
  'feedback_table',
  {
    id: uuid('id')
      .primaryKey()
      .$default(() => uuidv7()),
    userId: uuid('user_id')
      .notNull()
      .references(() => userTable.id),
    messageId: uuid('message_id')
      .notNull()
      .references(() => messageTable.id),
    createdAt: timestamp('created_at', { withTimezone: true, precision: 0 }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, precision: 0 }).notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index('feedback_user_id_idx').on(table.userId),
    messageIdIdx: index('feedback_message_id_idx').on(table.messageId),
  }),
)

export const wishlistTable = pgTable('wishlist_table', {
  id: uuid('id')
    .primaryKey()
    .$default(() => uuidv7()),
  email: varchar('email', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true, precision: 0 }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, precision: 0 }).notNull().defaultNow(),
})

export const otpTable = pgTable(
  'otp_table',
  {
    id: uuid('id')
      .primaryKey()
      .$default(() => uuidv7()),
    user_id: varchar('user_id', { length: 255 }).notNull().unique(),
    otp: varchar('otp', { length: 255 }).notNull(),
    created_at: timestamp('created_at', { withTimezone: true, precision: 0 }).notNull().defaultNow(),
    expires_at: timestamp('expires_at', { withTimezone: true, precision: 0 }).notNull(),
  },
  (table) => ({
    userIdIdx: index('otp_user_id_idx').on(table.user_id),
    expiresAtIdx: index('otp_expires_at_idx').on(table.expires_at),
  }),
)

/* ###################################################################################### */

// ================================= Relations =========================================

export const userRelations = relations(userTable, ({ many }) => ({
  organizations: many(organizationTable),
  organizationUsers: many(organizationUsersTable),
  feedbacks: many(feedbackTable),
}))

export const organizationRelations = relations(organizationTable, ({ one, many }) => ({
  owner: one(userTable, {
    fields: [organizationTable.userId],
    references: [userTable.id],
  }),
  roles: many(roleTable),
  chats: many(chatTable),
  users: many(organizationUsersTable),
}))

export const roleRelations = relations(roleTable, ({ one, many }) => ({
  organization: one(organizationTable, {
    fields: [roleTable.organizationId],
    references: [organizationTable.id],
  }),
  organizationUsers: many(organizationUsersTable),
  permissions: many(rolePermissionTable),
}))

export const organizationUsersRelations = relations(organizationUsersTable, ({ one }) => ({
  user: one(userTable, {
    fields: [organizationUsersTable.userId],
    references: [userTable.id],
  }),
  organization: one(organizationTable, {
    fields: [organizationUsersTable.organizationId],
    references: [organizationTable.id],
  }),
  role: one(roleTable, {
    fields: [organizationUsersTable.roleId],
    references: [roleTable.id],
  }),
}))

export const permissionRelations = relations(permissionTable, ({ many }) => ({
  roles: many(rolePermissionTable),
}))

export const rolePermissionRelations = relations(rolePermissionTable, ({ one }) => ({
  role: one(roleTable, {
    fields: [rolePermissionTable.roleId],
    references: [roleTable.id],
  }),
  permission: one(permissionTable, {
    fields: [rolePermissionTable.permissionId],
    references: [permissionTable.id],
  }),
}))

export const chatRelations = relations(chatTable, ({ one, many }) => ({
  organization: one(organizationTable, {
    fields: [chatTable.organizationId],
    references: [organizationTable.id],
  }),
  messages: many(messageTable),
}))

export const llmModelRelations = relations(llmModelsTable, ({ many }) => ({
  messages: many(messageTable),
}))

export const messageRelations = relations(messageTable, ({ one }) => ({
  organization: one(organizationTable, {
    fields: [messageTable.organizationId],
    references: [organizationTable.id],
  }),
  chat: one(chatTable, {
    fields: [messageTable.chatId],
    references: [chatTable.id],
  }),
  model: one(llmModelsTable, {
    fields: [messageTable.modelId],
    references: [llmModelsTable.id],
  }),
}))

export const feedbackRelations = relations(feedbackTable, ({ one }) => ({
  user: one(userTable, {
    fields: [feedbackTable.userId],
    references: [userTable.id],
  }),
  message: one(messageTable, {
    fields: [feedbackTable.messageId],
    references: [messageTable.id],
  }),
}))

export const otpRelations = relations(otpTable, ({ one }) => ({
  user: one(userTable, {
    fields: [otpTable.user_id],
    references: [userTable.userName],
  }),
}))

export const _relations = {
  userRelations,
  organizationRelations,
  roleRelations,
  organizationUsersRelations,
  permissionRelations,
  rolePermissionRelations,
  chatRelations,
  llmModelRelations,
  messageRelations,
  feedbackRelations,
  otpRelations,
}

export const tables = {
  userTable,
  organizationTable,
  organizationUsersTable,
  roleTable,
  permissionTable,
  rolePermissionTable,
  chatTable,
  llmModelsTable,
  messageTable,
  feedbackTable,
  wishlistTable,
  otpTable,
}
