import { Injectable } from '@nestjs/common';
import { AuthService } from '../../common/interfaces/auth-service.interface';
import { SingInCredentialsDTO } from '../../common/interfaces/dtos/sing-in-dto.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthServiceImpl implements AuthService {
	constructor(private readonly configService: ConfigService) {}

	public async login(credentials: SingInCredentialsDTO) {
		const client_id = this.configService.getOrThrow<string>('APP_CLIENT_ID');
		const client_secret =
			this.configService.getOrThrow<string>('APP_CLIENT_SECRET');
		const grant_type = this.configService.getOrThrow<string>(
			'APP_CLIENT_GRANT_TYPE',
		);

		const res = await fetch(
			'http://localhost:8080/realms/auth-nestjs/protocol/openid-connect/token',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: new URLSearchParams({
					grant_type,
					client_id,
					client_secret,
					username: credentials.username,
					password: credentials.password,
				}),
			},
		);

		return await res.json();
	}
}
