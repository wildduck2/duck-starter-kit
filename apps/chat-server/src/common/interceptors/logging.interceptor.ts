import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject } from '@nestjs/common'
import { Observable, tap } from 'rxjs'
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: WinstonLogger,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest()
    const { method, url } = req
    const now = Date.now()

    return next.handle().pipe(
      tap(() => {
        const delay = Date.now() - now
        this.logger.log(`${method} ${url} - ${delay}ms`, 'HTTP')
      }),
    )
  }
}
