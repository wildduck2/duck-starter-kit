import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common'
import { Request, Response } from 'express'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(201)
  login(@Body() body, @Res({ passthrough: true }) res: Response) {
    console.log(body)

    res.status(HttpStatus.OK).send({ message: 'Logged in' })
    return { message: 'Logged in' }
  }
}
