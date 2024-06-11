import { IAuthController } from '../../common/interfaces/auth-controller.interface';
import { SingInCredentialsDTO } from '../../common/interfaces/dtos/sing-in-dto.interface';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { IUser } from '../../common/interfaces/user.interface';
import { AuthService } from '../../common/interfaces/auth-service.interface';
import { AUTH_SERVICE_TOKEN } from 'src/common/constants/tokens';
// import { AuthGuard } from '@nestjs/passport';
// import { CreateAuthDto } from './dto/create-auth.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';
// import { AuthService } from './services/auth.service';

@Controller('auth')
export class AuthController implements IAuthController {
	constructor(
		@Inject(AUTH_SERVICE_TOKEN) private readonly authService: AuthService,
	) {}

	@Post('sing-in')
	public async SingIn(
		@Body() credentials: SingInCredentialsDTO,
	): Promise<IUser> {
		console.log(credentials);
		return this.authService.login(credentials);
	}

	// @UseGuards(AuthGuard('StrategyOIDC'))

	// @Get()
	// findAll() {
	//   return this.authService.findAll();
	// }

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
