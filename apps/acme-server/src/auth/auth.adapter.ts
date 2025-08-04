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
  constructor(private readonly session: any) {
    super()
  }

  createIOServer(port: number, options?: any): any {
    const server: Server = super.createIOServer(port, options)

    server.use(
      //@ts-ignore
      sharedsession(this.session, {}),
    )
    return server
  }
}
