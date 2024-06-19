import { OIDC_PROVIDER_TOKEN } from './../../common/constants/tokens';
import {
	Inject,
	Injectable,
	UnauthorizedException,
	Logger,
} from '@nestjs/common';
import { AuthService } from '../../common/interfaces/auth-service.interface';
import { SingInCredentialsDTO } from '../../common/interfaces/dtos/sing-in.dto';
import { ConfigService } from '@nestjs/config';
import { Client, IntrospectionResponse, TokenSet } from 'openid-client';
import { SingUpCredentialsDto } from 'src/common/interfaces/dtos/sing-up.dto';

@Injectable()
export class AuthServiceImpl implements AuthService {
	private readonly logger = new Logger('AuthService');

	constructor(
		@Inject(OIDC_PROVIDER_TOKEN) private readonly oidcCLient: Client,
		private readonly configService: ConfigService,
	) {}
	public async register(singUpCredentials: SingUpCredentialsDto): Promise<any> {
		console.log(this.oidcCLient.issuer.metadata.registration_endpoint);
		console.log(singUpCredentials);
		throw new Error('Method not implemented.');
	}

	public async validateToken(token: string): Promise<IntrospectionResponse> {
		try {
			this.logger.log(
				`Validating token: ...${token.slice(token.length - 50, token.length)}`,
			);
			const verifiedToken = await this.oidcCLient.introspect(token);
			if (verifiedToken.active) return verifiedToken;
			else throw new UnauthorizedException('Token is not active');
		} catch (error) {
			throw new UnauthorizedException('Invalid token');
		}
	}

	public async userInfo(token: string) {
		return await this.oidcCLient.userinfo(token);
	}

	public async login({
		password,
		username,
	}: SingInCredentialsDTO): Promise<TokenSet> {
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
