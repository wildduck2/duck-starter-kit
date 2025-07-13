import 'express-session'
import { DrizzleTables } from '../src/drizzle'

declare module 'express-session' {
  interface SessionData {
    user: Omit<DrizzleTables['userTable']['$inferSelect'], 'password'>
  }
}
