import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Request } from 'express'
import { Observable } from 'rxjs'
import { throwError } from '~/common/libs'
import { AuthErrorType } from './auth.types'

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    if (context.switchToHttp().getRequest<Request>().session.user) return true
    console.log(context.switchToHttp().getRequest<Request>().session)

    throwError<AuthErrorType>('INVALID_CREDENTIALS')
    return false
  }
}

// TODO: work on this
@Injectable()
export class WSAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    console.log('hay from ws guard')
    console.log(context.switchToWs().getData())
    // if (context.switchToWs().getData()) return true
    // console.log(context.switchToHttp().getRequest<Request>().session)
    //
    // throwError<AuthErrorType>('INVALID_CREDENTIALS')
    return false
  }
}
