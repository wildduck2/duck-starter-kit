import { Module } from '@nestjs/common'
import { AuthModule } from './auth'
import { ConfigModule } from '@nestjs/config'
import { MongodbModule } from './mongodb'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.dev',
      isGlobal: true,
    }),
    AuthModule,
    MongodbModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
