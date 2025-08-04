import { Body, Controller, Get, Post, Req, Res, Session, UseFilters, UseGuards } from '@nestjs/common'
import { Request, Response } from 'express'
import { SessionData } from 'express-session'
import { ErrorExceptionFilter } from '~/common/exceptions'
import { ZodValidationPipe } from '~/common/pipes'
import { ResponseType } from '~/common/types'
import { EmailService, TemplateText } from '~/email'
import { AuthMessages } from './auth.constants'
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signinSchema,
  signupSchema,
  updateAccountInformationSchema,
  withIDSchema,
} from './auth.dto'
import { AuthGuard } from './auth.guard'
import { AuthService } from './auth.service'
import {
  ForgotPasswordDto,
  GetUserDto,
  ResetPasswordDto,
  SigninDto,
  SignupDto,
  UpdateAccountInformationDto,
  VerifyCodeDto,
} from './auth.types'

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
  ): Promise<ResponseType<Awaited<ReturnType<typeof this.authService.signin>>, typeof AuthMessages>> {
    try {
      console.log(session)
      const data = await this.authService.signin(body)
      session.user = data!
      // session = { ...session, user: data! }

      return {
        state: 'success',
        data,
        message: 'AUTH_SIGNIN_SUCCESS',
      }
    } catch (error) {
      console.log(error)
      return {
        state: 'error',
        message: 'AUTH_SIGNIN_FAILED',
      }
    }
  }

  @Post('signup')
  async signup(
    @Body(new ZodValidationPipe(signupSchema)) body: SignupDto,
  ): Promise<ResponseType<Awaited<ReturnType<typeof this.authService.signup>> | Error>> {
    const user = await this.authService.signup(body)

    if (user) {
      this.emailService.sendTestEmail({
        to: user.email,
        subject: TemplateText.welcome.subject,
        text: TemplateText.welcome.text,
        template: {
          name: 'welcome',
          args: {
            username: user.userName,
          },
        },
      })
    }

    return { state: 'success', data: user, message: 'AUTH_SIGNUP_SUCCESS' }
  }

  @Get('signout')
  @UseGuards(AuthGuard)
  async signout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseType<Awaited<null>, typeof AuthMessages>> {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destruction error:', err)
          reject({ state: 'error', message: 'Could not destroy session' })
        } else {
          res.clearCookie('connect.sid')
          resolve({ state: 'success', data: null, message: 'AUTH_SIGNOUT_SUCCESS' })
        }
      })
    })
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async me(
    @Body(new ZodValidationPipe(withIDSchema)) body: GetUserDto,
  ): Promise<ResponseType<Awaited<ReturnType<typeof this.authService.getAccountInformation>>, typeof AuthMessages>> {
    const user = await this.authService.getAccountInformation(body)
    return { state: 'success', data: user, message: 'AUTH_GET_ACCOUNT_INFORMATION_SUCCESS' }
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body(new ZodValidationPipe(forgotPasswordSchema)) body: ForgotPasswordDto,
  ): Promise<ResponseType<Awaited<ReturnType<typeof this.authService.forgotPassword>>, typeof AuthMessages>> {
    const data = await this.authService.forgotPassword(body)

    if (data!.otp) {
      this.emailService.sendTestEmail({
        to: body.email,
        subject: TemplateText.forgot_password.subject,
        text: TemplateText.forgot_password.text,
        template: {
          name: 'forgot-password',
          args: {
            code: data!.otp[0].otp,
          },
        },
      })
    }

    return { state: 'success', data: data!.user as never, message: 'AUTH_FORGOT_PASSWORD_EMAIL_SENT' }
  }

  @Post('reset-password')
  async resetPassword(
    @Body(new ZodValidationPipe(resetPasswordSchema)) body: ResetPasswordDto,
  ): Promise<ResponseType<Awaited<ReturnType<typeof this.authService.resetPassword>>, typeof AuthMessages>> {
    const data = await this.authService.resetPassword(body)
    return { state: 'success', data, message: 'AUTH_RESET_PASSWORD_SUCCESS' }
  }

  @Post('update-profile')
  async updateAccountInformation(
    @Body(new ZodValidationPipe(updateAccountInformationSchema)) body: UpdateAccountInformationDto,
  ): Promise<ResponseType<Awaited<ReturnType<typeof this.authService.updateAccountInformation>>, typeof AuthMessages>> {
    const data = await this.authService.updateAccountInformation(body)
    return { state: 'success', data, message: 'AUTH_UPDATE_ACCOUNT_INFORMATION_SUCCESS' }
  }

  @Post('verify-code')
  async verifyEmail(@Body(new ZodValidationPipe(withIDSchema)) body: VerifyCodeDto) {
    const data = await this.authService.verifyCode(body)
    return { state: 'success', data }
  }

  @Post('delete-account')
  async deleteAccount(
    @Body(new ZodValidationPipe(withIDSchema)) body: GetUserDto,
  ): Promise<ResponseType<Awaited<ReturnType<typeof this.authService.deleteAccount>>, typeof AuthMessages>> {
    const data = await this.authService.deleteAccount(body)
    return { state: 'success', data, message: 'AUTH_DELETE_ACCOUNT_SUCCESS' }
  }
}
