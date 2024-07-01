import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { Issuer } from 'openid-client';

@Injectable()
export class AuthService {
	public async login(createUserDto: CreateUserDto) {
		const googleIssuer = await Issuer.discover('http://localhost:8080');
		console.log(
			'Discovered issuer %s %O',
			googleIssuer.issuer,
			googleIssuer.metadata,
		);
		console.log(createUserDto);
	}
}
