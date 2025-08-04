import { Module } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { WinstonModule } from 'nest-winston'
import winston from 'winston'
import { LoggerInterceptor } from './logger.interceptor'
import { LoggerService } from './logger.service'

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        // new winston.transports.Console({
        //   format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
        // }),
        new winston.transports.File({
          filename: 'logs/combined.log',
          format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
        }),
      ],
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    }),
  ],
  providers: [
    LoggerService,
    LoggerInterceptor,

    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
  ],
  exports: [LoggerService, LoggerInterceptor],
})
export class LoggerModule {}
