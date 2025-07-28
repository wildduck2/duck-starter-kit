import { uuidv7 } from 'uuidv7'
import {
  chatTable,
  feedbackTable,
  llmModelsTable,
  messageTable,
  organizationTable,
  organizationUsersTable,
  permissionTable,
  rolePermissionTable,
  roleTable,
  userTable,
  wishlistTable,
} from './tables'
import { db } from './db'

async function seed() {
  console.log('🌱 Seeding...')

  // === Users ===
  const users = await db
    .insert(userTable)
    .values([
      {
        id: uuidv7(),
        name: 'Alice',
        email: 'alice@example.com',
        userName: 'alice123',
        password: 'hashed-password',
      },
      {
        id: uuidv7(),
        name: 'Bob',
        email: 'bob@example.com',
        userName: 'bob456',
        password: 'hashed-password',
      },
      {
        id: uuidv7(),
        name: 'Charlie',
        email: 'charlie@example.com',
        userName: 'charlie789',
        password: 'hashed-password',
      },
    ])
    .returning()

  const [alice, bob, charlie] = users

  // === Organization ===
  const [org] = await db
    .insert(organizationTable)
    .values({
      id: uuidv7(),
      name: 'Acme Inc',
      userId: alice.id,
    })
    .returning()

  // === Roles ===
  const [adminRole, userRole] = await db
    .insert(roleTable)
    .values([
      {
        id: uuidv7(),
        name: 'Admin',
        description: 'Full access',
        organizationId: org.id,
      },
      {
        id: uuidv7(),
        name: 'User',
        description: 'Limited access',
        organizationId: org.id,
      },
    ])
    .returning()

  // === Permissions ===
  const permissions = await db
    .insert(permissionTable)
    .values([
      { id: uuidv7(), name: 'chat:create', description: 'Create chat' },
      { id: uuidv7(), name: 'chat:read', description: 'Read chat' },
      { id: uuidv7(), name: 'chat:delete', description: 'Delete chat' },
    ])
    .returning()

  // === Assign Roles to Users ===
  await db.insert(organizationUsersTable).values([
    {
      id: uuidv7(),
      userId: alice.id,
      organizationId: org.id,
      roleId: adminRole.id,
    },
    {
      id: uuidv7(),
      userId: bob.id,
      organizationId: org.id,
      roleId: userRole.id,
    },
  ])

  // === Assign Permissions to Roles ===
  await db.insert(rolePermissionTable).values(
    permissions.map((perm) => ({
      id: uuidv7(),
      roleId: adminRole.id,
      permissionId: perm.id,
    })),
  )

  // === Chat Room ===
  const [chat] = await db
    .insert(chatTable)
    .values({
      id: uuidv7(),
      name: 'General Discussion',
      organizationId: org.id,
    })
    .returning()

  // === LLM Model ===
  const [model] = await db
    .insert(llmModelsTable)
    .values({
      id: uuidv7(),
      provider: 'openai',
      name: 'gpt-4',
      contextLimit: 8192,
      tokenPrice: 10,
    })
    .returning()

  // === Messages ===
  const [msg1, msg2] = await db
    .insert(messageTable)
    .values([
      {
        id: uuidv7(),
        type: 'user',
        content: 'Hello everyone!',
        metadata: {},
        organizationId: org.id,
        chatId: chat.id,
        modelId: model.id,
      },
      {
        id: uuidv7(),
        type: 'assistant',
        content: 'Hey Alice!',
        metadata: {},
        organizationId: org.id,
        chatId: chat.id,
        modelId: model.id,
      },
      {
        id: uuidv7(),
        type: 'user',
        content: 'Hello everyone!',
        metadata: {},
        organizationId: org.id,
        chatId: chat.id,
        modelId: model.id,
      },
      {
        id: uuidv7(),
        type: 'assistant',
        content: 'Hello everyone!',
        metadata: {},
        organizationId: org.id,
        chatId: chat.id,
        modelId: model.id,
      },
      {
        id: uuidv7(),
        type: 'user',
        content: 'Has anyone reviewed the PR from yesterday?',
        metadata: {},
        organizationId: org.id,
        chatId: chat.id,
        modelId: model.id,
      },
      {
        id: uuidv7(),
        type: 'assistant',
        content: 'I did! Left a couple of comments.',
        metadata: {},
        organizationId: org.id,
        chatId: chat.id,
        modelId: model.id,
      },
      {
        id: uuidv7(),
        type: 'user',
        content: 'Awesome, thanks! I’ll address them shortly.',
        metadata: {},
        organizationId: org.id,
        chatId: chat.id,
        modelId: model.id,
      },
      {
        id: uuidv7(),
        type: 'assistant',
        content: 'Do we have an agenda for the weekly sync?',
        metadata: {},
        organizationId: org.id,
        chatId: chat.id,
        modelId: model.id,
      },
      {
        id: uuidv7(),
        type: 'user',
        content: 'Let’s wrap this up and catch up tomorrow. Thanks everyone!',
        metadata: {},
        organizationId: org.id,
        chatId: chat.id,
        modelId: model.id,
      },
    ])
    .returning()

  // === Feedback ===
  await db.insert(feedbackTable).values({
    id: uuidv7(),
    userId: charlie.id,
    messageId: msg1.id,
  })

  // === Wishlist ===
  await db.insert(wishlistTable).values({
    id: uuidv7(),
    email: 'test@wishlist.com',
  })

  console.log('✅ Done seeding.')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Error seeding:', err)
  process.exit(1)
})
