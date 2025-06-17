import { Injectable, UseFilters } from '@nestjs/common'
import { ResponseType } from '~/common/types'
import { AuthErrorType, SigninSchemaType, SignupSchemaType } from './auth.types'
import { AuthError } from './auth.constants'
import { AuthExceptionFilter } from './auth-exception.filter'
import { PasswordHasher, throwError } from '~/common/libs'
import { InjectModel } from '@nestjs/mongoose'
import { User } from '~/mongodb/schemas'
import { Model } from 'mongoose'

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async signin(data: SigninSchemaType): Promise<Error> {
    // handle signin here.

    return throwError<AuthErrorType>('INVALID_CREDENTIALS')
  }

  async signup(body: SignupSchemaType): Promise<Omit<User, 'password'>> {
    const password = await PasswordHasher.hashPassword(body.password)

    const { password: _, ...createdUser } = await this.userModel.insertOne({
      ...body,
      password,
    })

    // NOTE: i do not like casting types like this i have to reverse engineer the whole mongose type
    // to remove the force casting here. do not forget this @wildduck
    return createdUser as never as Omit<User, 'password'>
  }
  async signout() {}
  async forgotPassword() {}
  async resetPassword() {}
  async verifyEmail() {}
  async deleteAccount() {}
  async updateAccountInformation() {}
}
