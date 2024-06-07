import { IAuthController } from '../interfaces/auth.controller.interface';
import { ISingInCredentials } from '../interfaces/sing-in.interface';
import { IAuthService } from '../interfaces/auth.service.interface';
import { Body, Controller, Post } from '@nestjs/common';
import { IUser } from '../interfaces/user.interface';
// import { AuthGuard } from '@nestjs/passport';
// import { CreateAuthDto } from './dto/create-auth.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';
// import { AuthService } from './services/auth.service';

@Controller('auth')
export class AuthController implements IAuthController {
	constructor(private readonly authService: IAuthService) {}

	@Post('sing-in')
	public async SingIn(@Body() credentials: ISingInCredentials): Promise<IUser> {
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
