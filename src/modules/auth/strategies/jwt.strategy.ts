import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { AUTH_SERVICE_TOKEN } from 'src/common/constants/tokens';
import { AuthService } from '../../../common/interfaces/auth-service.interface';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'http-jwt') {
	constructor(
		@Inject(AUTH_SERVICE_TOKEN) private readonly authService: AuthService,
	) {
		super({ passReqToCallback: true });
	}

	public async validate(_: Request, token: string): Promise<boolean> {
		const validToken = await this.authService.validateToken(token);
		if (!validToken) throw new UnauthorizedException();
		return validToken.active;
	}
}
