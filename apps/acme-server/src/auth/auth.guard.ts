import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Request } from 'express'
import { Observable } from 'rxjs'
import { throwError } from '~/common/libs'
import { AuthMessageType } from './auth.types'

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    if (context.switchToHttp().getRequest<Request>().session.user) return true
    console.log(context.switchToHttp().getRequest<Request>().session)

    throwError<AuthMessageType>('AUTH_UNAUTHORIZED')
    return false
  }
}
