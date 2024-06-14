import { OIDC_PROVIDER_TOKEN } from './../../common/constants/tokens';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../common/interfaces/auth-service.interface';
import { SingInCredentialsDTO } from '../../common/interfaces/dtos/sing-in-dto.dto';
import { ConfigService } from '@nestjs/config';
import { Client, IntrospectionResponse } from 'openid-client';

@Injectable()
export class AuthServiceImpl implements AuthService {
	constructor(
		@Inject(OIDC_PROVIDER_TOKEN) private readonly oidcCLient: Client,
		private readonly configService: ConfigService,
	) {}

	public async validateToken(token: string): Promise<IntrospectionResponse> {
		try {
			const verifiedToken = await this.oidcCLient.introspect(token);
			if (verifiedToken.active) return verifiedToken;
			else throw new UnauthorizedException('Token is not active');
		} catch (error) {
			throw new UnauthorizedException('Invalid token');
		}
	}

	public async login({ password, username }: SingInCredentialsDTO) {
		const grant_type = this.configService.getOrThrow<string>(
			'APP_CLIENT_GRANT_TYPE',
		);
		return await this.oidcCLient.grant({
			username,
			password,
			grant_type,
			scope: 'email profile openid',
		});
	}
}
