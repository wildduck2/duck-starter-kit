import { Module } from '@nestjs/common'
import { DrizzleModule } from '~/drizzle'
import { EmailService } from './email.service'

@Module({
  imports: [DrizzleModule],
  exports: [EmailService],
  providers: [EmailService],
  controllers: [],
})
export class EmailModule {}
