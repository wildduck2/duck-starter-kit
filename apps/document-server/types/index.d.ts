import 'express-session'
import { User } from '~/auth/schema'
declare module 'express-session' {
  interface SessionData {
    user: Omit<User, 'password'>
  }
}
