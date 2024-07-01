import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { ApiTags } from '@nestjs/swagger';

// @ApiBearerAuth('zitadel-jwt')
// @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Not authorized' })
@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
	constructor(private readonly auhtService: AuthService) {}

	@Post('sing-up')
	public create(@Body() createUserDto: CreateUserDto) {
		return this.auhtService.login(createUserDto);
	}
}
