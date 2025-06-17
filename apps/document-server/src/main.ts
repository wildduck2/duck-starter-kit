import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express'
import * as session from 'express-session'
import { RedisStore } from 'connect-redis'
import Redis from 'ioredis'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.set('query parser', 'extended')

  const redisClient = new Redis({
    host: process.env.REDIS_HOST || 'redis',
    port: Number.parseInt(process.env.REDIS_PORT || '6379', 10),
  })

  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: process.env.SESSION_SECRET || 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false, // true in production with HTTPS
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      },
    }),
  )

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
