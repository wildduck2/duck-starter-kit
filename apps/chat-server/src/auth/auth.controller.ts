import { Body, Controller, Get, Post, Req, Res, Session, UseFilters, UseGuards } from '@nestjs/common'
import { Request, Response } from 'express'
import { SessionData } from 'express-session'
import { ErrorExceptionFilter } from '~/common/exceptions'
import { throwError } from '~/common/libs'
import { ZodValidationPipe } from '~/common/pipes'
import { ResponseType } from '~/common/types'
import { EmailService, TemplateText } from '~/email'
import { AuthError } from './auth.constants'
import { signinSchema, signupSchema } from './auth.dto'
import { AuthGuard } from './auth.guard'
import { AuthService } from './auth.service'
import { AuthErrorType, SigninDto, SignupDto } from './auth.types'

@Controller('auth')
@UseFilters(ErrorExceptionFilter)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
  ) {}

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

    if (!(data instanceof Error)) {
      this.emailService.sendTestEmail({
        to: data.email,
        subject: TemplateText.welcome.subject,
        text: TemplateText.welcome.text,
        template: {
          name: 'welcome',
          args: {
            username: data.userName,
          },
        },
      })
    }

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
