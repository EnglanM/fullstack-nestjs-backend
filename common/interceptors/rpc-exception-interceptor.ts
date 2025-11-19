import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RpcException } from '@nestjs/microservices';
  
@Injectable()
export class RpcExceptionInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            catchError((error) => {
                if (error instanceof RpcException) {
                    return throwError(() => error);
                }
                if (error instanceof HttpException) {
                    const status = error.getStatus();
                    const response = error.getResponse();
                    const message = typeof response === 'string' 
                        ? response 
                        : (response as any).message || error.message;

                    return throwError(() =>
                        new RpcException({
                            status,
                            message: Array.isArray(message) ? message.join(', ') : message,
                        }),
                    );
                }
                return throwError(() =>
                    new RpcException({
                        status: error.status || 500,
                        message: error.message || 'Internal server error',
                    }),
                );
            }),
        );
    }
}