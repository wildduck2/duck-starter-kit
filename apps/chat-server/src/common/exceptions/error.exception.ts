import { ArgumentsHost, Catch, ExceptionFilter, WsExceptionFilter } from '@nestjs/common'
import { BaseWsExceptionFilter } from '@nestjs/websockets'
import { Response } from 'express'
import { Socket } from 'socket.io'

@Catch()
export class ErrorExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    console.log('🔥 Exception caught:', exception)

    response.status(500).json({
      state: 'error',
      error: exception.message,
    })
  }
}

@Catch()
export class WSErrorExceptionFilter implements WsExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const client: Socket = host.switchToWs().getClient<Socket>()

    console.error('🔥 WebSocket Error:', exception)

    client.emit('error', {
      status: 'error',
      message: exception.message,
    })
  }
}
