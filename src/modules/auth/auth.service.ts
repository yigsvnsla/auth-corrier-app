import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { CredentialsUserDto } from './dtos/credentials-user.dto';

@Injectable()
export class AuthService {
	public async login(createUserDto: CredentialsUserDto) {
		console.log(createUserDto);
	}

	public async register(createUserDto: CreateUserDto) {
		console.log(createUserDto);
	}
}
