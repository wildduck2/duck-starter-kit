import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common'
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston'
import { Observable, tap } from 'rxjs'
import { LoggerService } from './logger.service'

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: WinstonLogger,
    private readonly meta: LoggerService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest()
    const { method, url } = req
    const now = Date.now()
    const metadata = this.meta.getRequestMetadata(req)

    return next.handle().pipe(
      tap(() => {
        const delay = Date.now() - now
        this.logger.log({
          message: `${method} ${url} - ${delay}ms`,
          context: 'HTTP',
          method,
          url,
          delay,
          ...metadata,
        })
      }),
    )
  }
}
