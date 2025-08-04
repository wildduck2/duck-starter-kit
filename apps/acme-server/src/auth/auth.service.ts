import { Inject, Injectable } from '@nestjs/common'
import { DrizzleError, eq } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import otpGenerator from 'otp-generator'
import { PasswordHasher, throwError } from '~/common/libs'
import { DrizzleAsyncProvider, schema } from '~/drizzle'
import { UpdateAccountInformationSchemaType } from './auth.dto'
import {
  AuthMessageType,
  DeleteUserDto,
  ForgotPasswordDto,
  GetUserDto,
  ResetPasswordDto,
  SigninDto,
  SignupDto,
  VerifyCodeDto,
} from './auth.types'

@Injectable()
export class AuthService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase<typeof schema>,
    // @Inject(WINSTON_MODULE_NEST_PROVIDER)
    // private readonly logger: WinstonLogger,
  ) {}

  async signin(data: SigninDto) {
    try {
      const _user = await this.db.query.userTable.findFirst({
        where: eq(schema.userTable.userName, data.username),
      })

      if (!_user) {
        throwError<AuthMessageType>('AUTH_USERNAME_INVALID')
        return
      }

      const passwordMatch = await PasswordHasher.comparePassword(data.password, _user.password)
      if (!passwordMatch) {
        throwError<AuthMessageType>('AUTH_PASSWORD_INVALID')
        return
      }

      // omit password
      const { password: _, ...user } = _user
      return user
    } catch (error) {
      console.log(error)
      throwError<AuthMessageType>('AUTH_SIGNIN_FAILED')
      return
    }
  }

  async signup(data: SignupDto) {
    try {
      const password = await PasswordHasher.hashPassword(data.password)

      const insertedUsers = await this.db
        .insert(schema.userTable)
        .values({
          name: data.name,
          userName: data.username,
          email: data.email,
          password,
        })
        .returning()

      if (!insertedUsers?.length) {
        throwError<AuthMessageType>('AUTH_REGISTRATION_FAILED')
        return
      }
      const user = insertedUsers[0]
      const { password: _, ...safeUser } = user
      return safeUser
    } catch (error) {
      if (String((error as DrizzleError).cause).includes('user_table_user_name_unique')) {
        throwError<AuthMessageType>('AUTH_USERNAME_ALREADY_EXISTS')
        return
      }

      if (String((error as DrizzleError).cause).includes('user_table_email_unique')) {
        throwError<AuthMessageType>('AUTH_EMAIL_ALREADY_EXISTS')
        return
      }

      throwError<AuthMessageType>('AUTH_REGISTRATION_FAILED')
    }
  }

  async getAccountInformation(data: GetUserDto) {
    try {
      const user = await this.db.query.userTable.findFirst({
        columns: {
          id: true,
          userName: true,
          name: true,
          email: true,
        },
        where: eq(schema.userTable.id, data.user_id),
      })

      if (!user) {
        throwError<AuthMessageType>('AUTH_USER_NOT_FOUND_OR_UNAUTHORIZED')
        return
      }
      return user
    } catch (error) {
      console.log(error)
      throwError<AuthMessageType>('AUTH_GET_ACCOUNT_INFORMATION_FAILED')
      return
    }
  }

  async forgotPassword(data: ForgotPasswordDto) {
    try {
      const user = await this.db.query.userTable.findFirst({
        where: eq(schema.userTable.email, data.email),
      })
      console.log(user)

      if (!user) {
        throwError<AuthMessageType>('AUTH_USER_NOT_FOUND')
        return
      }

      const OTP = otpGenerator.generate(6, {
        upperCaseAlphabets: true,
        specialChars: true,
        lowerCaseAlphabets: true,
      })

      const expires_at = new Date(Date.now() + 60000 * 10)
      const otp = await this.db
        .insert(schema.otpTable)
        .values({
          user_id: user?.id,
          ...data,
          otp: OTP,
          expires_at,
        })
        .returning()

      if (!otp?.length) {
        throwError<AuthMessageType>('AUTH_FORGOT_PASSWORD_FAILED')
        return
      }
      return { otp, user }
    } catch (error) {
      console.log(error)
      throwError<AuthMessageType>('AUTH_FORGOT_PASSWORD_FAILED')
      return
    }
  }

  async resetPassword(data: ResetPasswordDto) {
    try {
      const password = await PasswordHasher.hashPassword(data.password)
      data.password = password
      console.log(data)

      const user = await this.db
        .update(schema.userTable)
        .set({ ...data })
        .where(eq(schema.userTable.id, data.user_id))
        .returning()

      console.log(user)

      if (!user?.length) {
        throwError<AuthMessageType>('AUTH_USER_NOT_FOUND_OR_RESET_PASSWORD_FAILED')
        return
      }
      return user
    } catch (error) {
      console.log(error)
      throwError<AuthMessageType>('AUTH_RESET_PASSWORD_FAILED')
      return
    }
  }

  async updateAccountInformation({ user_id, ...data }: UpdateAccountInformationSchemaType) {
    try {
      const user = await this.db
        .update(schema.userTable)
        .set({ ...data })
        .where(eq(schema.userTable.id, user_id))
        .returning()

      if (!user?.length) {
        throwError<AuthMessageType>('AUTH_USER_NOT_FOUND_OR_UPDATE_ACCOUNT_INFORMATION_FAILED')
        return
      }
      return user
    } catch (error) {
      console.log(error)
      throwError<AuthMessageType>('AUTH_UPDATE_ACCOUNT_INFORMATION_FAILED')
      return
    }
  }

  async verifyCode(data: VerifyCodeDto) {
    try {
      const otp = await this.db.delete(schema.otpTable).where(eq(schema.otpTable.user_id, data.user_id)).returning()
      console.log(otp)

      if (!otp?.length) {
        throwError<AuthMessageType>('AUTH_USER_NOT_FOUND_OR_VERIFY_CODE_FAILED')
        return
      }
      return null
    } catch (error) {
      console.log(error)
      throwError<AuthMessageType>('AUTH_VERIFY_CODE_FAILED')
      return
    }
  }

  async deleteAccount(data: DeleteUserDto) {
    try {
      const user = await this.db.delete(schema.userTable).where(eq(schema.userTable.id, data.user_id)).returning()
      if (!user?.length) {
        throwError<AuthMessageType>('AUTH_USER_NOT_FOUND_OR_DELETE_ACCOUNT_FAILED')
        return
      }
      return null
    } catch (error) {
      console.log(error)
      throwError<AuthMessageType>('AUTH_DELETE_ACCOUNT_FAILED')
      return
    }
  }
}
