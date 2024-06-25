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
		/**
		 * 	TODO: REFACTORIZAR:
		 *
		 * ! ya no considero que el enfoque de este artículo sea óptimo
		 * ! En este artículo, utilicé el cliente administrador en el ámbito maestro,
		 * ! pero creo que es mejor crear un cliente en un ámbito específico
		 * ! y asignarle "roles de cuentas de servicio" adecuados, como el rol de "administrar usuarios".
		 *
		 * ? REF = https://steve-mu.medium.com/create-new-user-in-keycloak-with-admin-restful-api-e6e868b836b4
		 */

		const resToken = await fetch(
			new URL(
				'http://localhost:8080/realms/master/protocol/openid-connect/token',
			),
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: new URLSearchParams({
					client_id: 'admin-cli',
					client_secret: 'YzG3c5dVYPbVtX5kOlcgX5Tn7TLvGZTQ',
					grant_type: 'client_credentials',
				}),
			},
		);

		const tokenset = (await resToken.json()) as TokenSet;

		const res = await fetch(
			new URL('http://localhost:8080/admin/realms/auth-nestjs/users'),
			{
				method: 'POST',
				headers: {
					Authorization: `Bearer ${tokenset.access_token}`,
					'Content-Type': 'application/json',
				},

				body: JSON.stringify(singUpCredentials),
			},
		);
		if (!res.ok)
			throw new Error(`Error al crear el usuario: ${res.statusText}`);
		console.log('res:', await res.json());
		return {};
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
		try {
			const grant_type = this.configService.getOrThrow<string>(
				'APP_CLIENT_GRANT_TYPE',
			);
			return await this.oidcCLient.grant({
				username,
				password,
				grant_type,
				scope: 'email profile openid',
			});
		} catch (error) {
			throw new UnauthorizedException('Invalid Credentials');
		}
	}
}
