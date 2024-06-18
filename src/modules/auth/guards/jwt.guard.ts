import {
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
@Injectable()
export class JwtAuthGuard extends AuthGuard('http-jwt') {
	private readonly logger = new Logger(JwtAuthGuard.name);

	constructor(private readonly reflector: Reflector) {
		super();
	}

	// eslint-disable-next-line prettier/prettier
	public canActivate(
		ctx: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			ctx.getHandler(),
			ctx.getClass(),
		]);

		return isPublic ? true : super.canActivate(ctx);
	}

	public handleRequest(err: any, user: any) {
		if (err) this.logger.log(err);
		if (err || !user) throw err || new UnauthorizedException();
		return user;
	}
}
