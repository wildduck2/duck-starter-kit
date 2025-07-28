import { chatTable, messageTable, userTable, wishlistTable } from './tables'

export type User = typeof userTable.$inferInsert
export type WaitlistUser = typeof wishlistTable.$inferInsert
export type Message = typeof messageTable.$inferInsert
export type Chat = typeof chatTable.$inferInsert
