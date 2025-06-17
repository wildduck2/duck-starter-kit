import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  Session,
  UseFilters,
  UseGuards,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { SigninDto, signinSchema, SignupDto, signupSchema } from './auth.dto'
import { ZodValidationPipe } from '~/common/pipes'
import { SigninSchemaType, SignupSchemaType } from './auth.types'
import { AuthExceptionFilter } from './auth-exception.filter'
import { ResponseType } from '~/common/types'
import { AuthGuard } from './auth.gaurd'
import { SessionData } from 'express-session'

@Controller('auth')
@UseFilters(AuthExceptionFilter)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body(new ZodValidationPipe(signinSchema)) body: SigninDto,
    @Req() req: Request,
    // @Session() session: SessionData,
    @Res({ passthrough: true }) res: Response,
  ) {
    // const data = await this.authService.signin(body)
    req.session.userId = 'mock-user-id-123'
    console.log(req.session, 'session')

    return {
      message: 'Logged in', //data
    }
  }

  /**
   * @name signup
   * @description register a new user
   * @method POST
   * @route /auth/signup
   *
   * @param {SignupSchemaType} body
   * @returns {Promise<ResponseType<Awaited<ReturnType<typeof this.authService.signup>>>>>}
   */
  @Post('signup')
  async signup(
    @Body(new ZodValidationPipe(signupSchema)) body: SignupDto,
  ): Promise<ResponseType<Awaited<ReturnType<typeof this.authService.signup>>>> {
    const data = await this.authService.signup(body)
    return { state: 'success', data }
  }

  @Get('signout')
  @UseGuards(AuthGuard)
  async signout(@Session() session: SessionData) {
    const data = await this.authService.signout()
    console.log(session)
    return { state: 'success', data }
  }
}
