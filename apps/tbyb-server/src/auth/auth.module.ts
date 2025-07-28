import { Module } from '@nestjs/common'
import { EmailModule, EmailService } from '~/email'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  exports: [],
  imports: [EmailModule],
  controllers: [AuthController],
  providers: [AuthService, EmailService],
})
export class AuthModule {}
