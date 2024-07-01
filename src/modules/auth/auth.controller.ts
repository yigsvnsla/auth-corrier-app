import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { CredentialsUserDto } from './dtos/credentials-user.dto';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
	constructor(private readonly auhtService: AuthService) {}

	@Post('sing-in')
	public singIn(@Body() credentialsUserDto: CredentialsUserDto) {
		return this.auhtService.login(credentialsUserDto);
	}

	@Post('sing-up')
	public SingUp(@Body() createUserDto: CreateUserDto) {
		return this.auhtService.login(createUserDto);
	}
}
