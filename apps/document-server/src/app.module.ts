import { Module } from '@nestjs/common'
import { AuthModule } from './auth'
import { ConfigModule } from '@nestjs/config'
import { MongodbModule } from './mongodb'
import { WinstonModule } from 'nest-winston'
import * as winston from 'winston'

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({}),
        new winston.transports.File({
          filename: 'logs/combined.log',
        }),
        new winston.transports.Http({
          host: 'logstash',
          port: 5000,
          path: '/',
          ssl: false,
        }),
      ],
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    }),
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
