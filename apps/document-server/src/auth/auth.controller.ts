import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseFilters } from '@nestjs/common'
import { Response } from 'express'
import { AuthService } from './auth.service'
import { signinSchema, signupSchema } from './auth.dto'
import { ZodValidationPipe } from '~/common/pipes'
import { SigninSchemaType, SignupSchemaType } from './auth.types'
import { AuthExceptionFilter } from './auth-exception.filter'
import { ResponseType } from '~/common/types'

@Controller('auth')
@UseFilters(AuthExceptionFilter)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body(new ZodValidationPipe(signinSchema)) body: SigninSchemaType,
    @Res({ passthrough: true }) res: Response,
  ) {
    // const data = await this.authService.signin(body)
    // return { message: 'Logged in', data }
  }

  @Post('signup')
  async signup(
    @Body(new ZodValidationPipe(signupSchema)) body: SignupSchemaType,
    @Req() req: any,
  ): Promise<ResponseType<any>> {
    const data = await this.authService.signup(body)
    return { state: 'success', data }
  }
}
