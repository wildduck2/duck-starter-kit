import { NestExpressApplication } from '@nestjs/platform-express'
import { IoAdapter } from '@nestjs/platform-socket.io'
import { RedisStore } from 'connect-redis'
import session from 'express-session'
import sharedsession from 'express-socket.io-session'
import { RedisClientType } from 'redis'
import { Server } from 'socket.io'

/**
 * Enable session tokens for web sockets by using express-socket.io-session
 */
export class EventsAdapter extends IoAdapter {
  private app: NestExpressApplication
  private redisClient: RedisClientType

  constructor(app: NestExpressApplication, redisClient: RedisClientType) {
    super(app)
    this.app = app
    this.redisClient = redisClient
  }

  createIOServer(port: number, options?: any): any {
    const server: Server = super.createIOServer(port, options)

    const _session = session({
      store: new RedisStore({ client: this.redisClient, prefix: 'session:' }),
      secret: process.env.SESSION_SECRET || 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false, // true in production with HTTPS
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      },
    })

    this.app.use(_session)
    server.use(
      // @ts-ignore
      sharedsession(_session, {
        autoSave: true,
      }),
    )
    return server
  }
}
