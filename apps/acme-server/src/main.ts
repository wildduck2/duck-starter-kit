import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { RedisStore } from 'connect-redis'
import session from 'express-session'
import { patchNestJsSwagger } from 'nestjs-zod'
import { createClient } from 'redis'
import { AppModule } from './app.module'
import { EventsAdapter } from './auth'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.set('query parser', 'extended')
  app.set('trust proxy', true)

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

  const _session = session({
    store: new RedisStore({ client: redisClient, prefix: 'session:' }),
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // true in production with HTTPS
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
  app.use(_session)
  app.useWebSocketAdapter(new EventsAdapter(_session))

  // Swagger
  patchNestJsSwagger()
  const config = new DocumentBuilder()
    .setTitle('acme acme Server')
    .setDescription('The acme acme Server API description')
    .setVersion('1.0')
    .addTag('acme acme Server')
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, documentFactory)

  await app.listen(process.env.PORT ?? 3000)
}

bootstrap()
