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
		const res = await fetch(
			`${this.oidcCLient.issuer.metadata.registration_endpoint}`,
			{
				method: 'POST',
				headers: {
					Authorization: `Bearer ${'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJDYjN1cGJINjZwRlNPYTdhdkxKQ195RVB6S2REZnplVTA3X1RTa2RFOURBIn0.eyJleHAiOjE3MTg4Mzc4NDgsImlhdCI6MTcxODgzNjA0OCwianRpIjoiMTAwNWM0NmYtNmRjNy00ODU3LTk5ODItMzhkNjAwNzNhODY2IiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL3JlYWxtcy9hdXRoLW5lc3RqcyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJhZDIxYWY2ZC1lOTEyLTRkZDItOTgyOS0yZTA0MzJiYmFjOTYiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJuZXN0LWNsaWVudCIsInNlc3Npb25fc3RhdGUiOiI2NmNmOGEyMS0yZjczLTQ3YzUtYWY3Ni1jNWYyNTM3NTBmN2QiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbIiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiIsImRlZmF1bHQtcm9sZXMtYXV0aC1uZXN0anMiXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBlbWFpbCBwcm9maWxlIiwic2lkIjoiNjZjZjhhMjEtMmY3My00N2M1LWFmNzYtYzVmMjUzNzUwZjdkIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJmb28gYmFyIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiZm9vIiwiZ2l2ZW5fbmFtZSI6ImZvbyIsImZhbWlseV9uYW1lIjoiYmFyIiwiZW1haWwiOiJmb29AYmFyLm1haWwuY29tIn0.UaBYAzTvKUEd6doddPEXw1HI1vdmK5wCiFF8w-ynhvzr_U1DZAztP316bD89z6c8X49R8UtDorRmvbP5rnn5EeDO3eTa-giY94kCWRFtukHkv8rOmgIprMgB-TjmvOrKAkJxhHSM3z076rMWtShipgylsYE1SbMhiJ4PkhEI-e5xyB5NgFMoXPR1FL5lAhrg1XEyuug-qmn9YIR4W3mW_mnV0GU5aYgUqNQygxQhjIMBQGkSiPO5wLWz6g5acBzifX3Y7PTU774UQH6W_zn2P2ogpXcWbUkJy2hzXxeuJUEwH78IfRuaQJpjFfcHTZvFhb40Ng32fkMQobuQRL3onw'}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(singUpCredentials),
			},
		);
		if (!res.ok)
			throw new Error(`Error al crear el usuario: ${res.statusText}`);
		console.log('res:', await res.json());
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
