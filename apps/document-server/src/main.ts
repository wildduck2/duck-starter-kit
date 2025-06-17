import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express'
import * as session from 'express-session'
import { RedisStore } from 'connect-redis'
import { createClient } from 'redis'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { patchNestJsSwagger } from 'nestjs-zod'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.set('query parser', 'extended')

  const redisClient = createClient({
    url: process.env.REDIS_URL,
  })
  await redisClient.connect()

  app.use(
    session({
      store: new RedisStore({ client: redisClient, prefix: 'session:' }),
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

  // Swagger
  patchNestJsSwagger()
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, documentFactory)

  await app.listen(process.env.PORT ?? 3000)
}

bootstrap()
