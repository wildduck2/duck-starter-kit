import { Injectable } from '@nestjs/common'
import { AuthErrorType, SigninSchemaType, SignupSchemaType } from './auth.types'
import { PasswordHasher, throwError } from '~/common/libs'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from './schema'

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async signin(data: SigninSchemaType): Promise<Awaited<Omit<User, 'password'> | Error>> {
    const _user = await this.userModel.findOne({ username: data.username })
    if (!_user) {
      return throwError<AuthErrorType>('USERNAME_INVALID')
    }
    const passwordMatch = await PasswordHasher.comparePassword(data.password, _user.password)
    if (!passwordMatch) {
      return throwError<AuthErrorType>('PASSWORD_INVALID')
    }
    const { password: _, ...user } = _user.toObject()
    // NOTE: i do not like casting types like this i have to reverse engineer the whole mongose type
    // to remove the force casting here. do not forget this @wildduck
    return user as never as Omit<User, 'password'>
  }

  async signup(body: SignupSchemaType): Promise<Omit<User, 'password'>> {
    const password = await PasswordHasher.hashPassword(body.password)

    const _user = await this.userModel.insertOne({
      ...body,
      password,
    })
    // NOTE: Hiding the password from the response
    const { password: _, ...user } = _user.toObject()

    // NOTE: i do not like casting types like this i have to reverse engineer the whole mongose type
    // to remove the force casting here. do not forget this @wildduck
    return user as never as Omit<User, 'password'>
  }
  async signout() {
    const users = await this.userModel.find()
    return users
  }
  async forgotPassword() {}
  async resetPassword() {}
  async verifyEmail() {}
  async deleteAccount() {}
  async updateAccountInformation() {}
}
