import { SingInCredentialsDTO } from '../../common/interfaces/dtos/sing-in.dto';
import { UserDTO } from '../../common/interfaces/user.interface';
import { AuthService } from '../../common/interfaces/auth-service.interface';
import { AUTH_SERVICE_TOKEN } from 'src/common/constants/tokens';
import {
	Body,
	Controller,
	Get,
	Headers,
	HttpCode,
	HttpStatus,
	Inject,
	Post,
} from '@nestjs/common';
import { Public } from './decorators/public.decorator';
import { SingUpCredentialsDto } from 'src/common/interfaces/dtos/sing-up.dto';

@Controller({
	path: ['auth'],
	version: '1',
})
export class AuthController {
	constructor(
		@Inject(AUTH_SERVICE_TOKEN) private readonly authService: AuthService,
	) {}

	@Public()
	@Post('sing-up')
	findOne(@Body() body: SingUpCredentialsDto) {
		return this.authService.register(body);
	}

	@Public()
	@Post('sing-in')
	@HttpCode(HttpStatus.OK)
	public async SingIn(
		@Body() credentials: SingInCredentialsDTO,
	): Promise<UserDTO> {
		return await this.authService.login(credentials);
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	public async findAll(@Headers('authorization') t: string) {
		return await this.authService.userInfo(t.replace(/Bearer /, '').trim());
	}

	// @Patch(':id')
	// update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
	//   return this.authService.update(+id, updateAuthDto);
	// }

	// @Delete(':id')
	// remove(@Param('id') id: string) {
	//   return this.authService.remove(+id);
	// }
}
