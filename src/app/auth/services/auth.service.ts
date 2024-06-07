import { Injectable } from '@nestjs/common';
import { IAuthService } from '../interfaces/auth.service.interface';

@Injectable()
export class AuthService implements IAuthService {
	public async login() {
		const res = await fetch(
			'http://localhost:8080/realms/auth-nestjs/protocol/openid-connect/token',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: new URLSearchParams({
					client_id: 'nest-client',
					client_secret: 'XSwT7oB5fcNIhxb3NPI0c2XV4FvcTJze',
					username: 'foo',
					password: '123',
					grant_type: 'password',
				}),
			},
		);

		return await res.json();
	}
}
