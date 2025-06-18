import { Body, Controller, Get, Post, Req, Res, Session, UseFilters, UseGuards } from '@nestjs/common'
import { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { signinSchema, signupSchema } from './auth.dto'

import { AuthExceptionFilter } from './auth-exception.filter'
import { ResponseType } from '~/common/types'
import { AuthGuard } from './auth.guard'
import { SessionData } from 'express-session'
import { AuthError } from './auth.constants'
import { throwError } from '~/common/libs'
import SigninDto, { AuthErrorType, SignupDto } from './auth.types'
import { ZodValidationPipe } from '~/common/pipes'

@Controller('auth')
@UseFilters(AuthExceptionFilter)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signin(
    @Body(new ZodValidationPipe(signinSchema)) body: SigninDto,
    @Session() session: SessionData,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseType<Awaited<ReturnType<typeof this.authService.signin>>, typeof AuthError>> {
    const data = await this.authService.signin(body)

    if (data instanceof Error) {
      throwError<AuthErrorType>('INVALID_CREDENTIALS')
      return {
        state: 'error',
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid credentials',
      }
    }
    session.user = data
    console.log(session)

    return {
      state: 'success',
      data,
    }
  }

  @Post('signup')
  async signup(
    @Body(new ZodValidationPipe(signupSchema)) body: SignupDto,
  ): Promise<ResponseType<Awaited<ReturnType<typeof this.authService.signup>> | Error>> {
    const data = await this.authService.signup(body)
    return { state: 'success', data }
  }

  @Get('signout')
  @UseGuards(AuthGuard)
  async signout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    req.session.destroy((err) => {
      console.log('session destroyed' + err)
    })
    res.clearCookie('connect.sid')
    return { state: 'success', data: null }
  }
}
