import { Inject, Injectable } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston'
import { uuidv7 } from 'uuidv7'
import { PasswordHasher, throwError } from '~/common/libs'
import { DrizzleAsyncProvider, schema } from '~/drizzle'
import { AuthErrorType, SigninSchemaType, SignupSchemaType } from './auth.types'

@Injectable()
export class AuthService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase<typeof schema>,
    // @Inject(WINSTON_MODULE_NEST_PROVIDER)
    // private readonly logger: WinstonLogger,
  ) {}

  async signin(data: SigninSchemaType): Promise<Omit<typeof schema.userTable.$inferSelect, 'password'> | Error> {
    try {
      const _user = await this.db.query.userTable.findFirst({
        where: eq(schema.userTable.userName, data.username),
      })
      console.log(_user, data)

      if (!_user) {
        return throwError<AuthErrorType>('USERNAME_INVALID')
      }

      const passwordMatch = await PasswordHasher.comparePassword(data.password, _user.password)
      if (!passwordMatch) {
        return throwError<AuthErrorType>('PASSWORD_INVALID')
      }

      // omit password
      const { password: _, ...user } = _user
      return user
    } catch (error) {
      console.log(error)
      return throwError<AuthErrorType>('SIGNIN_FAILED')
    }
  }

  async signup(data: SignupSchemaType) {
    try {
      const password = await PasswordHasher.hashPassword(data.password)
      console.log(password)

      const insertedUsers = await this.db
        .insert(schema.userTable)
        .values({
          id: uuidv7(),
          // FIX: change the useranme to be name
          name: data.username,
          userName: data.username,
          email: data.email,
          password,
        })
        .returning()

      const user = insertedUsers[0]
      const { password: _, ...safeUser } = user
      return safeUser
    } catch (error) {
      console.log(error)
      return throwError<AuthErrorType>('REGISTRATION_FAILED')
    }
  }

  async signout() {
    try {
      const users = await this.db.select().from(schema.userTable)
      return users
    } catch (error) {
      console.log(error)
      return throwError<AuthErrorType>('SIGNOUT_FAILED')
    }
  }

  async forgotPassword() {}
  async resetPassword() {}
  async verifyEmail() {}
  async deleteAccount() {}
  async updateAccountInformation() {}
}
