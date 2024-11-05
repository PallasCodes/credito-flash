import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable()
export class UndefinedToNullInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()

    // Reemplazar undefined por null en los campos
    this.replaceUndefinedWithNull(request.body)

    return next.handle().pipe(map((data) => data))
  }

  private replaceUndefinedWithNull(obj: any) {
    Object.keys(obj).forEach((key) => {
      if (obj[key] === undefined) {
        obj[key] = null
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        this.replaceUndefinedWithNull(obj[key])
      }
    })
  }
}
