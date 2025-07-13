import { WsException } from '@nestjs/websockets'

export function throwError<T extends string>(string: T, cause?: string): Error {
  throw new Error(string, {
    cause,
  })
}

export function throwWSError<T extends string>(string: T): Error {
  throw new WsException(string)
}
