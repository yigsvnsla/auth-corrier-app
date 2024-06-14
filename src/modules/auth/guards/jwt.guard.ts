import {
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { Logger } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('http-jwt') {
	private readonly logger = new Logger(JwtAuthGuard.name);
	// eslint-disable-next-line prettier/prettier
	public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		return super.canActivate(context);
	}

	public handleRequest(err: any, user: any) {
		if (err || !user) this.logger.log(err);
		if (err || !user) throw err || new UnauthorizedException();
		return user;
	}
}
