import { Module } from '@nestjs/common'
import { AuthModule } from './auth'
import { DrizzleModule } from './drizzle'
import { EmailModule } from './email'
import { LoggerModule } from './logger'
import { MinioModule } from './minio'
import { RedisModule } from './redis'

@Module({
  imports: [LoggerModule, DrizzleModule, EmailModule, MinioModule, AuthModule, RedisModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
