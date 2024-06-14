import { IAuthController } from '../../common/interfaces/auth-controller.interface';
import { SingInCredentialsDTO } from '../../common/interfaces/dtos/sing-in-dto.dto';
import { UserDTO } from '../../common/interfaces/user.interface';
import { AuthService } from '../../common/interfaces/auth-service.interface';
import { AUTH_SERVICE_TOKEN } from 'src/common/constants/tokens';
import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Inject,
	Post,
} from '@nestjs/common';
import { Public } from './decorators/public.decorator';
// import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController implements IAuthController {
	constructor(
		@Inject(AUTH_SERVICE_TOKEN) private readonly authService: AuthService,
	) {}

	@Post('sing-in')
	@HttpCode(HttpStatus.OK)
	public async SingIn(
		@Body() credentials: SingInCredentialsDTO,
	): Promise<UserDTO> {
		return await this.authService.login(credentials);
	}

	// @UseGuards(JwtAuthGuard)
	@Public()
	@Get()
	findAll() {
		return 'hola mundo';
		// return this.authService.findAll();
	}

	// @Get(':id')
	// findOne(@Param('id') id: string) {
	//   return this.authService.findOne(+id);
	// }

	// @Patch(':id')
	// update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
	//   return this.authService.update(+id, updateAuthDto);
	// }

	// @Delete(':id')
	// remove(@Param('id') id: string) {
	//   return this.authService.remove(+id);
	// }
}
