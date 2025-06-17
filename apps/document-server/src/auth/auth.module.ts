import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { MongodbModule } from '~/mongodb'

@Module({
  exports: [],
  imports: [MongodbModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
