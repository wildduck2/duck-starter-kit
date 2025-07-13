import { Module } from '@nestjs/common'
import { AuthModule } from './auth'
import { DrizzleModule } from './drizzle'
import { EmailModule } from './email'

@Module({
  imports: [AuthModule, DrizzleModule, EmailModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
