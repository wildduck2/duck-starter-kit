import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { patchNestJsSwagger } from 'nestjs-zod'
import { createClient } from 'redis'
import { AppModule } from './app.module'
import { EventsAdapter } from './auth'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.set('query parser', 'extended')
  app.setGlobalPrefix('v1')
  app.enableCors({
    origin: ['http://localhost:3001', 'http://domain:3001'],
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
    optionsSuccessStatus: 204,
  })

  const redisClient = createClient({
    url: process.env.REDIS_URL,
  })
  await redisClient.connect()

  app.useWebSocketAdapter(new EventsAdapter(app, redisClient as never))

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

// what's an observable
// what's db injections
// what's the difference between middleware and interceptor
