import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DrizzleModule } from '~/drizzle'
import mailerConfig from './email.constants'
import { EmailService } from './email.service'

@Module({
  imports: [
    DrizzleModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [mailerConfig],
      isGlobal: true,
    }),
  ],
  exports: [EmailService],
  providers: [EmailService],
  controllers: [],
})
export class EmailModule {}
