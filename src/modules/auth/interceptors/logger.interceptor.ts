import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Logger } from '@nestjs/common';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
	constructor() {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const request = context.switchToHttp().getRequest();
		const response = context.switchToHttp().getResponse();
		const controller = context.getClass();
		const handler = context.getHandler();
		const now = Date.now();

		Logger.log(
			`{REQUEST} : ${controller.name}-> ${handler.name}: ${request.method} | ${request.url}`,
			LoggerInterceptor.name,
		);

		return next.handle().pipe(
			tap(() => {
				const delay = Date.now() - now;
				Logger.log(
					`{RESPONSE}: ${controller.name}-> ${handler.name}: (${response.statusCode} - ${delay}ms)`,
					LoggerInterceptor.name,
				);
			}),
		);
	}
}
